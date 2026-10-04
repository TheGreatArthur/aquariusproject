"""
Brouillon de `data/fish/<espèce>.json` pour une espèce à ajouter au catalogue, depuis les sources collectées

Lit le résumé écrit par `tools/fetch_sources.py` (Seriously Fish, FishBase, GBIF) et pré-remplit :
- les valeurs mesurées : pH, dureté (°dGH), température et longueur standard de Seriously Fish, à défaut de
  FishBase ; famille, genre et continent d'origine (pays indigènes de FishBase) ;
- les valeurs dérivées, avec les règles tirées des 135 poissons du classeur pour que le simulateur traite les
  nouveaux de la même façon : volume minimum = volume Seriously Fish × 1,25 (médiane du classeur : 1,23),
  à défaut médiane du classeur pour la même taille ; points de population selon la taille, groupe minimum lu
  dans le texte « Behaviour » (sinon la médiane du mode de vie), longévité selon la taille ;
- des suggestions pour les catégories (comportement, mode de vie, régime, courant), tirées de mots-clés des
  textes Seriously Fish, à relire une à une ; robustesse, disponibilité et nom commun restent à choisir.
Un fichier existant n'est jamais écrasé. `--revue` écrit dans `.cache/sources/revue-poissons.md` les phrases
des sources qui justifient chaque suggestion, pour la relecture (le texte des sources ne va pas dans le dépôt).

Usage : venv/bin/python -m tools.draft_fish [--revue] nom scientifique...
"""

import json
import math
import re
import sys

from fish_data import FISH_DIR
from tools.compare_sources import fishbase_values, seriouslyfish_values
from tools.fetch_sources import CACHE_DIR, slug

LITRES_PAR_VOLUME_SF = 1.25
# Familles créées par les révisions récentes (FishBase 2024) : on garde le nom d'usage du catalogue
FAMILLES = {'Acestrorhamphidae': 'Characidae', 'Stevardiidae': 'Characidae', 'Lepidarchidae': 'Alestidae'}
# Pays d'Amérique du Nord pour FishBase que le classeur range en Amérique centrale (Mexique, isthme, Antilles)
AMERIQUE_CENTRALE = {'MEX', 'GTM', 'BLZ', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'CUB', 'HTI', 'DOM', 'JAM', 'PRI', 'BHS',
                     'CYM', 'TTO', 'BRB', 'GLP', 'MTQ'}
CONTINENTS = {'South America': 'Amérique du Sud', 'Asia': 'Asie', 'Africa': 'Afrique', 'Oceania': 'Océanie',
              'North America': 'Amérique du Nord', 'Central America': 'Amérique centrale', 'Europe': 'Europe'}
GROUPE_PAR_MODE = {'banc': 10, 'petit groupe': 5, 'couple': 2, 'solitaire': 1, 'harem': 4}


def nice(value: float) -> int:
    """ Arrondi lisible d'un volume : à 10 L près sous 200 L, à 50 L au-delà """
    step = 10 if value < 200 else 50
    return int(max(step, round(value / step) * step))


def points_for(taille: float) -> int:
    """ Points de population (≈ litres par poisson) selon la taille, d'après les valeurs du classeur """
    for limit, points in ((3, 2), (7, 5), (11, 10), (16, 20), (26, 30), (40, 50), (60, 100)):
        if taille < limit:
            return points
    return 250


def litres_for(taille: float) -> int:
    """ Volume minimum sans volume Seriously Fish : médiane du classeur pour les poissons de la même taille """
    for limit, litres in ((3, 40), (7, 80), (10, 110), (13, 180), (25, 300), (40, 500), (80, 900)):
        if taille < limit:
            return litres
    return 5000


def longevity_for(taille: float) -> int:
    for limit, years in ((4, 4), (8, 5), (15, 8), (30, 12)):
        if taille < limit:
            return years
    return 15


def zone_for(countries: list[dict]) -> str | None:
    """ Continent où l'espèce compte le plus de pays indigènes """
    native = [c for c in countries if c['status'] in ('native', 'endemic')]
    zones = ['Amérique centrale' if c['iso3'] in AMERIQUE_CENTRALE else CONTINENTS.get(c['continent']) for c in native]
    zones = [z for z in zones if z]
    return max(set(zones), key=zones.count) if zones else None


def family_for(family: str | None, zone: str | None) -> str | None:
    if family == 'Cichlidae':
        return 'Cichlidae africain' if zone == 'Afrique' else 'Cichlidae américain' if zone and 'Amérique' in zone \
            else family
    return FAMILLES.get(family, family)


# --- Suggestions tirées des textes ------------------------------------------------------------------

def sentences(text: str, pattern: str) -> list[str]:
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', text or '') if re.search(pattern, s, re.IGNORECASE)]


def suggest_group(text: str) -> int | None:
    """ « a group of at least 8-10 specimens » -> 8 """
    m = re.search(r'(?:group|shoal|school|colony|aggregation)s?\s+(?:of\s+)?(?:at\s+least\s+|a\s+minimum\s+of\s+)?'
                  r'(\d+)', text or '', re.IGNORECASE)
    return int(m.group(1)) if m and 2 <= int(m.group(1)) <= 30 else None


def suggest_mode(text: str) -> str:
    t = (text or '').lower()
    if 'harem' in t:
        return 'harem'
    if re.search(r'\bshoal|\bschool|schooling|shoaling', t):
        return 'banc'
    if re.search(r'\bpairs?\b|mated pair|monogam', t):
        return 'couple'
    if re.search(r'solitary|singly|alone|single specimen', t):
        return 'solitaire'
    return 'petit groupe'


def suggest_behaviour(text: str) -> str:
    t = (text or '').lower()
    if re.search(r'predator|piscivor|will eat (?:any )?(?:smaller )?fish', t):
        return 'prédateur'
    if re.search(r'very aggressive|highly aggressive|extremely aggressive', t):
        return 'agressif'
    if 'aggressive' in t:
        return 'moyennement agressif'
    if 'territorial' in t:
        return 'territorial'
    if re.search(r'nipp|boisterous|robust tankmates', t):
        return 'peu agressif'
    return 'pacifique'


def suggest_diet(text: str) -> str:
    t = (text or '').lower()
    carni = bool(re.search(r'carnivor|predator|piscivor|micropredator|insectivor|live and frozen|meaty', t))
    herbi = bool(re.search(r'herbivor|vegetable|vegetation|plant matter|algae|aufwuchs|spirulina|wood', t))
    omni = 'omnivor' in t
    if omni or (carni and herbi):
        return 'omnivore'
    return 'herbivore' if herbi else 'carnivore'


def suggest_current(text: str) -> str:
    t = (text or '').lower()
    if re.search(r'fast[- ]flowing|rapids|torrent|riffle|strong current|turbulent|high levels of dissolved oxygen', t):
        return 'modéré, fort'
    if re.search(r'stagnant|still water|swamp|pond|ditch|backwater|slow[- ]moving|sluggish|peat', t):
        return 'stagnant, doux'
    return 'doux'


# --- Brouillon --------------------------------------------------------------------------------------

def draft(sources: dict) -> dict:
    name = sources['nom_scientifique']
    sf_raw, fb_raw = sources.get('seriouslyfish') or {}, sources.get('fishbase') or {}
    sf = seriouslyfish_values(sf_raw) if sf_raw else {}
    fb = fishbase_values(fb_raw) if fb_raw else {}
    texts = sf_raw.get('sections', {})

    def pick(field):
        return sf.get(field) or fb.get(field)

    ph, gh, temp = pick('ph'), pick('gh'), pick('temp')
    # Longueur standard de Seriously Fish (la plus grande quand elle est donnée par sexe : « ♂ 75 · ♀ 50 mm SL »),
    # à défaut la longueur maximale de FishBase, ramenée à une longueur standard si elle est totale
    lengths = [float(n) for n in re.findall(r'\d+(?:\.\d+)?', sf_raw.get('facts', {}).get('Length', ''))]
    size = (max(lengths) / 10, 'SL') if lengths else fb.get('taille')
    taille = size[0] * (0.85 if size and size[1] == 'TL' else 1) if size else None
    volume = re.search(r'(\d+)', sf_raw.get('facts', {}).get('Volume', ''))
    zone = zone_for(fb_raw.get('countries', []))
    mode = suggest_mode(texts.get('behaviour', ''))
    group = suggest_group(texts.get('behaviour', '')) or GROUPE_PAR_MODE[mode]

    fish = dict(
        nom_scientifique=name,
        nom_commun='',
        famille=family_for(fb_raw.get('family') or (sources.get('gbif') or {}).get('family'), zone),
        genre=name.split()[0],
        zone_geo=zone,
        type_eau='douce',
        ph_mini=ph[0] if ph else None, ph_maxi=ph[1] if ph else None,
        kh=None,
        gh_mini=gh[0] if gh else None, gh_maxi=gh[1] if gh else None,
        temp_mini=int(temp[0]) if temp else None, temp_maxi=int(math.ceil(temp[1])) if temp else None,
        taille=round(taille * 2) / 2 if taille else None,
        litrage_mini=(nice(int(volume.group(1)) * LITRES_PAR_VOLUME_SF) if volume
                      else litres_for(taille) if taille else None),
        nb_individus=1 if mode == 'solitaire' else 2 if mode == 'couple' else group,
        points=points_for(taille) if taille else None,
        regime=suggest_diet(texts.get('diet', '')),
        mode_vie=mode,
        comportement=suggest_behaviour(texts.get('behaviour', '')),
        robustesse='',
        dispo='',
        longevite=longevity_for(taille) if taille else None,
        courant=suggest_current(' '.join(texts.get(k, '') for k in ('habitat', 'maintenance'))),
        photos=[],
        sources=[s for s in (
            {'nom': 'Seriously Fish', 'url': sf_raw.get('url')}, {'nom': 'FishBase', 'url': fb_raw.get('url')},
        ) if s['url']],
    )
    return fish


def review(sources: dict, fish: dict) -> str:
    """ Phrases des sources qui appuient les suggestions, pour la relecture """
    texts = (sources.get('seriouslyfish') or {}).get('sections', {})
    fb = sources.get('fishbase') or {}
    lines = [f"## {fish['nom_scientifique']} ({fish['famille']}, {fish['zone_geo']})",
             f"taille {fish['taille']} cm, {fish['litrage_mini']} L, pH {fish['ph_mini']}-{fish['ph_maxi']}, "
             f"GH {fish['gh_mini']}-{fish['gh_maxi']}, {fish['temp_mini']}-{fish['temp_maxi']} °C",
             f"suggestions : {fish['comportement']} / {fish['mode_vie']} ({fish['nb_individus']}) / {fish['regime']}"
             f" / courant {fish['courant']}"]
    for label, key, pattern in (('comportement', 'behaviour', r'.'), ('régime', 'diet', r'.'),
                                ('habitat', 'habitat', r'flow|current|stream|river|swamp|lake|still|rapid'),
                                ('maintenance', 'maintenance', r'hardy|sensitive|delicate|difficult|easy|robust'
                                                               r'|wild|commercial|availab|bred')):
        found = sentences(texts.get(key, ''), pattern)[:4]
        if found:
            lines.append(f'- {label} : ' + ' '.join(found)[:700])
    if fb.get('biology'):
        lines.append(f"- FishBase : {fb['biology'][:300]}")
    return '\n'.join(lines)


def main(args: list[str]) -> None:
    with_review = '--revue' in args
    names = [a for a in args if a != '--revue']
    FISH_DIR.mkdir(parents=True, exist_ok=True)
    notes = []
    for name in names:
        cache = CACHE_DIR / 'parsed' / f'{slug(name)}.json'
        if not cache.exists():
            print(f'{name} : sources absentes, lancer tools.fetch_sources')
            continue
        sources = json.loads(cache.read_text(encoding='utf-8'))
        fish = draft(sources)
        notes.append(review(sources, fish))
        path = FISH_DIR / f'{slug(name)}.json'
        if path.exists():
            continue
        path.write_text(json.dumps(fish, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Brouillon : {path.name}')
    if with_review:
        (CACHE_DIR / 'revue-poissons.md').write_text('\n\n'.join(notes) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv[1:])

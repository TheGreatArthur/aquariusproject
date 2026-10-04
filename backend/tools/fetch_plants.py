"""
Collecte des données des plantes d'aquarium : Flowgrow, Tropica, GBIF et Wikimedia Commons

Chaque fiche de `data/plants/<plante>.json` indique ses pages sources (`flowgrow`, `tropica`) et les photos
Wikimedia Commons retenues (`photos`). Pour chaque plante, l'outil :
- lit les paramètres de culture sur Flowgrow (pH, KH, températures, lumière, croissance, difficulté,
  emplacement, multiplication), puis la hauteur en aquarium et le besoin en CO2 sur Tropica ;
- relève le nom valide, l'auteur, l'ordre et la famille sur GBIF ;
- télécharge les photos dans `frontend/public/plants/` (2000 px au plus, JPEG qualité 82) avec leur auteur
  et leur licence, et refuse toute photo qui n'est pas sous licence libre.
Les valeurs, traduites en français, sont écrites dans `data/plant_sources.json` (versionné) : `plants.py`
les charge en base avec les textes des fiches. Les pages sont mises en cache dans `.cache/sources/`, le texte
des sources n'est jamais recopié dans le dépôt.

Usage : venv/bin/python -m tools.fetch_plants [plante ...]   (noms de fichiers sans .json)
"""

import json
import re
import sys
import urllib.parse
from pathlib import Path

from bs4 import BeautifulSoup, Tag

from tools.commons import FREE_LICENCE, check_licence, clean_author, download_photos  # noqa: F401
from tools.fetch_sources import fetch, slug

BACKEND_DIR = Path(__file__).resolve().parent.parent
PLANTS_DIR = BACKEND_DIR / 'data' / 'plants'
SOURCES_FILE = BACKEND_DIR / 'data' / 'plant_sources.json'
PHOTOS_DIR = BACKEND_DIR.parent / 'frontend' / 'public' / 'plants'

FLOWGROW_URL = 'https://www.flowgrow.de/db/aquaticplants/{}'
TROPICA_URL = 'https://tropica.com/en/plants/plantdetails/{}'


# --- Traductions des libellés Flowgrow et Tropica ---------------------------------------------------

DIFFICULTES = {'very easy': 'très facile', 'easy': 'facile', 'medium': 'moyenne', 'difficult': 'difficile',
               'very difficult': 'très difficile'}
CROISSANCES = {'very slow': 'très lente', 'slow': 'lente', 'medium': 'moyenne', 'fast': 'rapide',
               'very fast': 'très rapide'}
LUMIERES = {'very low': 'très faible', 'low': 'faible', 'medium': 'moyenne', 'high': 'forte', 'very high': 'très forte'}
CO2 = {'low': 'faible', 'medium': 'moyen', 'high': 'élevé'}

# Usage Flowgrow -> (emplacements, autres usages) ; certains libellés contiennent eux-mêmes une virgule
USAGES = {
    'Foreground, ground cover': (['premier plan'], ['tapis']),
    'Foreground, group': (['premier plan'], []),
    'Foreground': (['premier plan'], []),
    'Midground': (['plan intermédiaire'], []),
    'Background': (['arrière-plan'], []),
    'Epiphyte (growing on hardscape)': (['sur le décor'], []),
    'Water surface': (['en surface'], []),
    'Solitary plant': ([], ['plante isolée']),
    'Nano tanks': ([], ['nano-aquarium']),
    'Cichlid proof plant': ([], ['résiste aux cichlidés']),
    'Plant for spawning': ([], ['frayère']),
}

MULTIPLICATIONS = {
    'Splitting, cutting off daughter plants': 'séparation des rejets',
    'Rhizomteilung': 'division du rhizome',
    'Proliferating leaves': 'plantules sur les feuilles',
    'Proliferating roots': 'plantules sur les racines',
    'Proliferating inflorescences': 'plantules sur la hampe florale',
    'Runners': 'stolons',
    'Cuttings': 'boutures',
    'Fragmentation': 'fragmentation',
    'Seeds': 'graines',
}

# Port de la plante (pictogrammes Flowgrow), du plus caractéristique au plus général
PORTS = {
    'moss / liverwort or fern prothallium': 'mousse',
    'epiphyte or epilith': 'épiphyte',
    'free-floating submerged plant': 'flottante',
    'floating plant': 'flottante',
    'stem': 'tige',
    'rosette': 'rosette',
    'rhizome or creeping stem': 'rhizome',
}
PRIORITE_PORTS = ('mousse', 'épiphyte', 'flottante', 'tige', 'rosette', 'rhizome')


# --- Analyse des valeurs ----------------------------------------------------------------------------

def number(text: str) -> float | int:
    value = float(text.replace(',', '.'))
    return int(value) if value.is_integer() else value


def parse_range(text: str | None) -> tuple | None:
    """ '12 to 30 °C' -> (12, 30), '5 - 15+' -> (5, 15), '6' -> (6, 6) """
    if not text:
        return None
    values = re.findall(r'\d+(?:[.,]\d+)?', text)
    if not values:
        return None
    return number(values[0]), number(values[1] if len(values) > 1 else values[0])


def parse_levels(text: str | None, levels: dict[str, str]) -> tuple | None:
    """ 'low to high' -> ('faible', 'forte') ; un niveau seul donne la même valeur aux deux bornes """
    if not text:
        return None
    parts = [levels.get(p.strip().lower()) for p in re.split(r'\bto\b', text)]
    if not all(parts):
        return None
    return parts[0], parts[-1]


def split_known(text: str | None, known: dict) -> tuple[list, list[str]]:
    """
    Valeurs des libellés connus d'une liste séparée par des virgules, et morceaux inconnus. Un libellé peut
    lui-même contenir une virgule (« Foreground, group ») : le plus long libellé connu l'emporte.
    """
    parts = [part.strip() for part in (text or '').split(',') if part.strip()]
    found, unknown, i = [], [], 0
    while i < len(parts):
        for j in range(len(parts), i, -1):
            if (label := ', '.join(parts[i:j])) in known:
                found.append(known[label])
                i = j
                break
        else:
            unknown.append(parts[i])
            i += 1
    return found, unknown


def unique(values) -> list:
    return list(dict.fromkeys(values))


# --- Flowgrow ---------------------------------------------------------------------------------------

def parse_flowgrow(markup: str) -> dict:
    """ Valeurs brutes d'une fiche Flowgrow (libellés anglais) """
    soup = BeautifulSoup(markup, 'html.parser')
    raw: dict = {}
    # « <strong>Libellé:</strong>&nbsp;valeur<br/> »
    for strong in soup.find_all('strong'):
        label = re.sub(r'\[\?\]', '', strong.get_text(' ', strip=True)).strip().rstrip(':').strip()
        parts = []
        for sibling in strong.next_siblings:
            if isinstance(sibling, Tag) and sibling.name in ('br', 'strong'):
                if sibling.name == 'br' and not parts:
                    continue
                break
            parts.append(sibling.get_text(' ', strip=True) if isinstance(sibling, Tag) else str(sibling))
        value = re.sub(r'\s+', ' ', ' '.join(parts).replace('\xa0', ' ').replace(' ', ' ')).strip()
        if label and value:
            raw.setdefault(label, value)
    # Tableau des paramètres de culture : « <td>Libellé</td><td>valeur</td> »
    for row in soup.select('tr'):
        cells = row.find_all('td')
        if len(cells) == 2:
            label = cells[0].get_text('', strip=True)
            raw.setdefault(label, re.sub(r'\s+', ' ', cells[1].get_text(' ', strip=True).replace(' ', ' ')))
    raw['ports'] = [div['title'].split(': ', 1)[-1] for div in soup.select('div.type[title]')]
    region_map = soup.select_one('img.s360__product--tab--gmap')
    raw['regions'] = region_map['title'].removeprefix('Regions: ') if region_map else None
    for flag in soup.select('.family-flag .text'):
        rank = flag.find('strong')
        if rank:
            name = rank.get_text(strip=True).rstrip(':')
            raw.setdefault(name, flag.get_text(' ', strip=True).replace(rank.get_text(strip=True), '').strip())
    return raw


def flowgrow_values(raw: dict) -> tuple[dict, list[str]]:
    """ Valeurs Flowgrow traduites pour la base, et avertissements (libellés inconnus) """
    warnings = []
    values: dict = {}

    def put(names: tuple, pair):
        if pair:
            values.update(zip(names, pair))

    put(('ph_mini', 'ph_maxi'), parse_range(raw.get('pH value')))
    put(('kh_mini', 'kh_maxi'), parse_range(raw.get('Carbonate hardness')))
    put(('temp_mini', 'temp_maxi'), parse_range(raw.get('Temperature tolerance')))
    put(('temp_opti_mini', 'temp_opti_maxi'), parse_range(raw.get('Optimum temperature')))
    put(('hauteur_mini', 'hauteur_maxi'), parse_range(raw.get('Height')))
    put(('lumiere_mini', 'lumiere_maxi'), parse_levels(raw.get('Light'), LUMIERES))

    for field, label, table in (('difficulte', 'Difficulty', DIFFICULTES), ('croissance', 'Growth', CROISSANCES)):
        if raw.get(label):
            if raw[label].lower() in table:
                values[field] = table[raw[label].lower()]
            else:
                warnings.append(f'{label} inconnu : {raw[label]!r}')

    usages, unknown = split_known(raw.get('Usage'), USAGES)
    warnings += [f'usage inconnu : {u!r}' for u in unknown]
    values['positions'] = unique(p for positions, _ in usages for p in positions)
    values['usages'] = unique(u for _, others in usages for u in others)

    multiplication, unknown = split_known(raw.get('Propagation'), MULTIPLICATIONS)
    warnings += [f'multiplication inconnue : {u!r}' for u in unknown]
    values['multiplication'] = unique(multiplication)

    ports = [PORTS[p] for p in raw.get('ports', []) if p in PORTS]
    warnings += [f'port inconnu : {p!r}' for p in raw.get('ports', []) if p not in PORTS and p != 'fern']
    values['type'] = main_type(ports, values['usages'])

    emersed = (raw.get('Can grow emersed?') or '').lower()
    if emersed in ('yes', 'no'):
        values['emergee'] = emersed == 'yes'
    values['ordre'] = raw.get('Order')
    values['famille'] = raw.get('Family')
    values['regions'] = raw.get('regions')
    return {k: v for k, v in values.items() if v not in (None, '')}, warnings


def main_type(ports: list[str], usages: list[str]) -> str | None:
    """ Port principal ; une plante qui forme un tapis au premier plan est classée « tapissante » """
    ordered = [p for p in PRIORITE_PORTS if p in ports]
    if 'tapis' in usages and (not ordered or ordered[0] in ('rhizome', 'rosette', 'tige')):
        return 'tapissante'
    return ordered[0] if ordered else None


def flowgrow(page: str) -> tuple[dict, list[str]]:
    url = FLOWGROW_URL.format(page)
    status, body = fetch(url, f'flowgrow-{page}.html')
    if status != 200 or 'Botanical name' not in body:
        return {}, [f'Flowgrow : page {page!r} introuvable ({status})']
    values, warnings = flowgrow_values(parse_flowgrow(body))
    return {'url': url, **values}, warnings


# --- Tropica ----------------------------------------------------------------------------------------

def parse_tropica(markup: str) -> dict:
    """ Tableau « Plant info » d'une fiche Tropica (libellés anglais) """
    table = BeautifulSoup(markup, 'html.parser').select_one('table.specficationTable')
    if not table:
        return {}
    return {row.th.get_text(' ', strip=True).rstrip(':').strip(): row.td.get_text(' ', strip=True)
            for row in table.find_all('tr') if row.th and row.td}


def tropica_values(raw: dict) -> dict:
    values = {}
    height = parse_range(raw.get('Height'))
    if height:
        values['hauteur_mini'], values['hauteur_maxi'] = height
    if (co2 := raw.get('CO2', '').lower()) in CO2:
        values['co2'] = CO2[co2]
    if raw.get('Origin'):
        values['origine'] = raw['Origin']
    return values


def tropica(page: str) -> tuple[dict, list[str]]:
    url = TROPICA_URL.format(urllib.parse.quote(page, safe="/()'."))
    status, body = fetch(url, f'tropica-{slug(page)}.html')
    raw = parse_tropica(body) if status == 200 else {}
    if not raw:
        return {}, [f'Tropica : page {page!r} introuvable ({status})']
    return {'url': url, **tropica_values(raw)}, []


# --- GBIF -------------------------------------------------------------------------------------------

def gbif(name: str) -> tuple[dict, list[str]]:
    query = urllib.parse.urlencode({'name': name, 'kingdom': 'Plantae', 'verbose': 'false'})
    _, body = fetch(f'https://api.gbif.org/v1/species/match?{query}', f'gbif-plant-match-{slug(name)}.json')
    match = json.loads(body or '{}')
    if not match.get('usageKey') or match.get('matchType') not in ('EXACT', 'VARIANT'):
        return {}, [f'GBIF : pas de correspondance exacte pour {name!r} ({match.get("matchType")})']

    usage = species(match['usageKey'])
    values = dict(
        url=f'https://www.gbif.org/species/{match["usageKey"]}',
        statut=match.get('status'),
        auteur=usage.get('authorship', '').strip() or None,
        ordre=match.get('order'),
        famille=match.get('family'),
    )
    if match.get('status') == 'SYNONYM' and match.get('acceptedUsageKey'):
        # Le synonyme d'une espèce indique directement l'espèce acceptée ; sinon on lit le nom accepté
        values['nom_valide'] = (usage.get('species') if usage.get('rank') == 'SPECIES'
                                else plain_name(species(match['acceptedUsageKey'])))
    return {k: v for k, v in values.items() if v}, []


def species(key: int) -> dict:
    _, body = fetch(f'https://api.gbif.org/v1/species/{key}', f'gbif-plant-species-{key}.json')
    return json.loads(body or '{}')


def plain_name(usage: dict) -> str | None:
    """ Nom scientifique sans auteur, rang compris (« Anubias barteri var. nana ») """
    name, author = usage.get('scientificName', ''), usage.get('authorship', '').strip()
    return name.removesuffix(author).strip() if author else name or None


# --- Wikimedia Commons ------------------------------------------------------------------------------

def photos(name: str, titles: list[str], previous: list[dict] = ()) -> tuple[list[dict], list[str]]:
    """ Télécharge les photos d'une plante (<plante>-1.jpg, -2.jpg...) et renvoie leurs crédits """
    return download_photos(name, titles, PHOTOS_DIR, previous)


# --- Collecte ---------------------------------------------------------------------------------------

def collect(name: str, fiche: dict, previous: dict | None = None) -> tuple[dict, list[str]]:
    """ Données sources d'une plante (clé : nom du fichier de la fiche) et avertissements ; `previous` est le
    résultat du passage précédent, pour savoir quelles photos sont déjà à jour """
    out, warnings = {}, []
    if fiche.get('flowgrow'):
        out['flowgrow'], problems = flowgrow(fiche['flowgrow'])
        warnings += problems
    if fiche.get('tropica'):
        out['tropica'], problems = tropica(fiche['tropica'])
        warnings += problems
    out['gbif'], problems = gbif(fiche.get('gbif') or fiche['nom_scientifique'])
    warnings += problems
    out['photos'], problems = photos(name, fiche.get('photos', []), (previous or {}).get('photos', []))
    warnings += problems
    return out, warnings


def main(names: list[str]) -> int:
    paths = sorted(PLANTS_DIR.glob('*.json'))
    sources = json.loads(SOURCES_FILE.read_text(encoding='utf-8')) if SOURCES_FILE.exists() else {}
    failed = 0
    for path in paths:
        if names and path.stem not in names:
            continue
        fiche = json.loads(path.read_text(encoding='utf-8'))
        sources[path.stem], warnings = collect(path.stem, fiche, sources.get(path.stem))
        print(f'{path.stem} : {len(sources[path.stem]["photos"])} photo(s)')
        for warning in warnings:
            print('  !', warning)
        failed += bool(warnings)
    # Les fiches supprimées disparaissent aussi des sources
    sources = {k: sources[k] for k in sorted(sources) if (PLANTS_DIR / f'{k}.json').exists()}
    SOURCES_FILE.write_text(json.dumps(sources, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

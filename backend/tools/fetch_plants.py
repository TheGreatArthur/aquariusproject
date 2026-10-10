"""
Collecte des données des plantes d'aquarium : Flowgrow, Tropica, GBIF, WCVP et Wikimedia Commons

Chaque fiche de `data/plants/<plante>.json` indique ses pages sources (`flowgrow`, `tropica`) et les photos
Wikimedia Commons retenues (`photos`). Pour chaque plante, l'outil :
- lit les paramètres de culture sur Flowgrow (pH, KH, températures, lumière, croissance, difficulté,
  emplacement, multiplication), puis la hauteur en aquarium et le besoin en CO2 sur Tropica ;
- relève le nom valide, l'auteur, l'ordre, la famille et le statut UICN sur GBIF ;
- relève les pays d'origine et d'introduction dans la World Checklist of Vascular Plants de Kew (publiée sur
  GBIF, régions botaniques TDWG ramenées aux pays) ; les mousses, absentes de cette liste, prennent les pays
  où GBIF compte des observations sur leurs continents d'origine selon Flowgrow ;
- télécharge les photos dans `frontend/public/plants/` (2000 px au plus, JPEG qualité 82) avec leur auteur
  et leur licence, et refuse toute photo qui n'est pas sous licence libre ; les photos iNaturalist
  (`photos_externes`) sont gardées telles quelles.
Les valeurs, traduites en français, sont écrites dans `data/plant_sources.json` (versionné) : `plants.py`
les charge en base avec les textes des fiches. Les pages sont mises en cache dans `.cache/sources/`, le texte
des sources n'est jamais recopié dans le dépôt.

Usage : venv/bin/python -m tools.fetch_plants [plante ...]   (noms de fichiers sans .json)
"""

import json
import re
import sys
import urllib.parse
from functools import cache
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
    'Specimen plant': ([], ['plante isolée']),
    'Accent (red)': ([], ['accent coloré']),
    'Street (Dutch style)': ([], ['rue hollandaise']),
    'Semi-emersed plant for open tanks': ([], ['bac ouvert']),
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
    'Spores': 'spores',
}

# Port de la plante (pictogrammes Flowgrow), du plus caractéristique au plus général
PORTS = {
    'moss / liverwort or fern prothallium': 'mousse',
    'epiphyte or epilith': 'épiphyte',
    'free-floating submerged plant': 'flottante',
    'free-floating (surface)': 'flottante',
    'floating plant': 'flottante',
    'stem': 'tige',
    'rosette': 'rosette',
    'rhizome or creeping stem': 'rhizome',
}
PRIORITE_PORTS = ('mousse', 'épiphyte', 'flottante', 'tige', 'rosette', 'rhizome')
# Pictogrammes qui précisent un port déjà donné (bulbe, tubercule, feuilles flottantes d'une plante enracinée)
PORTS_IGNORES = ('fern', 'rooting plant with floating leaves', 'tuber', 'onion', 'emergent aquatic plant')



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
    put(('co2_mini', 'co2_maxi'), parse_range(raw.get('Carbon dioxide (CO2)')))
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
    warnings += [f'port inconnu : {p!r}' for p in raw.get('ports', []) if p not in PORTS and p not in PORTS_IGNORES]
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
    # Une fiche d'agrégat (« Callitriche palustris agg. ») n'a pas de « Botanical name » : on reconnaît la fiche
    # au tableau de culture
    if status != 200 or 'Aquarium suitability' not in body:
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
    key = match.get('acceptedUsageKey') or match['usageKey']
    values = dict(
        url=f'https://www.gbif.org/species/{match["usageKey"]}',
        statut=match.get('status'),
        auteur=usage.get('authorship', '').strip() or None,
        ordre=match.get('order'),
        famille=match.get('family'),
        # Taxon accepté, dont on cherche les observations, et embranchement (les mousses n'ont pas d'aire WCVP)
        taxon=key,
        embranchement=match.get('phylum'),
        uicn=iucn_category(key),
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


def iucn_category(key: int) -> str | None:
    """ Catégorie de la Liste rouge UICN (« LC »), si l'espèce a été évaluée """
    status, body = fetch(f'https://api.gbif.org/v1/species/{key}/iucnRedListCategory', f'gbif-iucn-{key}.json')
    return json.loads(body).get('code') if status == 200 and body else None


# --- Aire de répartition ----------------------------------------------------------------------------

# World Checklist of Vascular Plants (Kew), publiée sur GBIF : régions botaniques d'origine et d'introduction
WCVP_DATASET = 'f382f0ce-323a-4091-bb9f-add557f3a9a2'
# Régions botaniques TDWG (WGSRPD) : chaque unité de niveau 4 donne le code ISO de son pays
TDWG_LEVEL4 = 'https://raw.githubusercontent.com/tdwg/wgsrpd/master/109-488-1-ED/2nd%20Edition/tblLevel4.txt'
# Corrections de la table (2001) : codes ISO disparus (UK, YU, TP, AN) ou faux (Slovénie « SL », qui est la
# Sierra Leone ; Lettonie et Biélorussie « RU » ; Namibie « ZA » ; Spratleys « SI »), et unités qui ne doivent
# colorer aucun pays : micro-États et îlots rattachés à la région d'un voisin (Andorre à l'Espagne, Kinmen à la
# Chine du Sud-Est, Navassa à Haïti...)
TDWG_ISO = {
    'BLR-OO': ['BY'], 'BLT-LA': ['LV'], 'NAM-OO': ['NA'], 'CZE-CZ': ['CZ'], 'CZE-SK': ['SK'],
    'FRA-CI': ['GG', 'JE'], 'GRB-OO': ['GB'], 'IRE-NI': ['GB'], 'LEE-NL': ['BQ', 'SX'], 'LEE-SM': ['MF', 'BL'],
    'LSI-ET': ['TL'], 'NLA-BO': ['BQ'], 'NLA-CU': ['CW'],
    'YUG-BH': ['BA'], 'YUG-KO': ['XK'], 'YUG-MN': ['ME'], 'YUG-SE': ['RS'], 'YUG-SL': ['SI'],
    **{code: [] for code in (
        'AND-CO', 'AUT-LI', 'CHS-KI', 'CHS-MP', 'CPI-CL', 'CPI-CO', 'CPI-MA', 'FRA-MO', 'HAI-NI', 'ITA-SM', 'ITA-VC',
        'LEE-AV', 'MCI-OO', 'MOR-SP', 'SCS-PI', 'SCS-SI', 'SPA-AN', 'SPA-GI', 'SWC-CC', 'SWC-HC', 'SWC-NC')},
}
# Codes ISO alpha-3 que le fond de carte (Natural Earth) écrit autrement
MAP_CODES = {'ESH': 'SAH', 'SSD': 'SDS', 'PSE': 'PSX', 'XKX': 'KOS'}
WORLD_MAP = BACKEND_DIR.parent / 'frontend' / 'public' / 'maps' / 'world-50m.json'

# Mousses et hépatiques : la WCVP ne couvre que les plantes vasculaires
BRYOPHYTES = ('Bryophyta', 'Marchantiophyta', 'Anthocerotophyta')
# Régions d'origine Flowgrow -> grandes régions GBIF de leurs pays (GBIF range la Russie, l'Asie centrale et
# la Turquie en Europe)
FLOWGROW_REGIONS = {
    'Africa': {'AFRICA'}, 'North Africa': {'AFRICA'}, 'West Africa': {'AFRICA'}, 'Central Africa': {'AFRICA'},
    'East Africa': {'AFRICA'}, 'Southern Africa': {'AFRICA'}, 'Madagascan region': {'AFRICA'},
    'Europe': {'EUROPE'}, 'Asia': {'ASIA', 'EUROPE'}, 'North Asia': {'EUROPE', 'ASIA'},
    'West Asia': {'ASIA', 'EUROPE'}, 'Central Asia': {'ASIA', 'EUROPE'}, 'South Asia': {'ASIA'},
    'Southeast Asia': {'ASIA'}, 'East Asia': {'ASIA'}, 'Australia': {'OCEANIA'}, 'New Zealand': {'OCEANIA'},
    'Oceana': {'OCEANIA'}, 'America': {'NORTH_AMERICA', 'LATIN_AMERICA'}, 'North America': {'NORTH_AMERICA'},
    'Central America': {'LATIN_AMERICA'}, 'Caribbean Islands': {'LATIN_AMERICA'},
    'Tropical South America': {'LATIN_AMERICA'}, 'Southern South America': {'LATIN_AMERICA'},
}
MIN_RECORDS = 2  # observations GBIF d'un pays pour le compter dans l'aire d'une mousse
OCCURRENCE_BASIS = ('PRESERVED_SPECIMEN', 'MATERIAL_SAMPLE', 'HUMAN_OBSERVATION', 'OBSERVATION', 'OCCURRENCE')


@cache
def gbif_countries() -> list[dict]:
    _, body = fetch('https://api.gbif.org/v1/enumeration/country', 'gbif-countries.json')
    return json.loads(body)


@cache
def map_codes() -> set[str]:
    topo = json.loads(WORLD_MAP.read_text(encoding='utf-8'))
    return {g['properties']['iso'] for g in topo['objects']['pays']['geometries']}


def iso3_on_map(iso2: str, iso3: dict[str, str], on_map: set[str]) -> str | None:
    code = iso3.get(iso2)
    code = MAP_CODES.get(code, code)
    return code if code in on_map else None


def tdwg_countries(table: str, iso3: dict[str, str], on_map: set[str]) -> dict[str, list[str]]:
    """ Pays de la carte (ISO alpha-3) de chaque région botanique TDWG de niveau 3, d'après la table de niveau 4
    (« L4 code*L4 country*L3 code*L4 ISOcode*... ») ; les territoires absents du fond de carte sont ignorés """
    regions: dict[str, list[str]] = {}
    for line in table.splitlines()[1:]:
        cells = line.strip().split('*')
        if len(cells) < 4:
            continue
        countries = regions.setdefault(cells[2], [])
        for iso2 in TDWG_ISO.get(cells[0], [cells[3]]):
            if (code := iso3_on_map(iso2, iso3, on_map)) and code not in countries:
                countries.append(code)
    return regions


def range_name(name: str) -> str:
    """ Nom cherché dans la WCVP, sans cultivar, forme commerciale, agrégat ni marqueur de rang :
    « Anubias barteri var. nana » -> « Anubias barteri nana », « Echinodorus grisebachii 'Bleherae' » ->
    « Echinodorus grisebachii » """
    name = re.sub(r'\(.*?\)|\'[^\']*\'|"[^"]*"|\bagg\.', ' ', name)
    return ' '.join(w for w in name.split() if w not in ('var.', 'subsp.', 'f.'))


def wcvp_usage(name: str) -> dict:
    """ Taxon accepté de la WCVP pour ce nom ; une variété absente de la liste se rabat sur son espèce """
    canonical = range_name(name)
    query = urllib.parse.urlencode({'datasetKey': WCVP_DATASET, 'q': canonical, 'limit': 100})
    _, body = fetch(f'https://api.gbif.org/v1/species/search?{query}', f'wcvp-search-{slug(canonical)}.json')
    found = [r for r in json.loads(body or '{}').get('results', []) if r.get('canonicalName') == canonical]
    accepted = [r for r in found if r.get('taxonomicStatus') == 'ACCEPTED']
    # Un nom accepté l'emporte sur ses homonymes mis en synonymie ; sinon le synonyme renvoie au taxon accepté
    keys = {r['key'] for r in accepted} or {r['acceptedKey'] for r in found if r.get('acceptedKey')}
    if len(keys) == 1:
        return species(keys.pop())
    if not keys and len(canonical.split()) > 2:
        return wcvp_usage(' '.join(canonical.split()[:2]))
    return {}


def wcvp_range(name: str, regions: dict[str, list[str]]) -> tuple[dict, list[str]]:
    """ Pays d'origine et pays d'introduction selon la WCVP, avec la fiche POWO (Plants of the World Online) """
    usage = wcvp_usage(name)
    if not usage:
        return {}, [f'WCVP : pas de taxon accepté unique pour {range_name(name)!r}']
    _, body = fetch(f'https://api.gbif.org/v1/species/{usage["key"]}/distributions?limit=1000',
                    f'wcvp-distributions-{usage["key"]}.json')
    native, introduced, unknown = [], [], []
    for record in json.loads(body or '{}').get('results', []):
        code = str(record.get('locationId', '')).removeprefix('TDWG:')
        if code not in regions:
            unknown.append(code)
        means = (record.get('establishmentMeans') or 'NATIVE').upper()
        target = native if means == 'NATIVE' else introduced if means == 'INTRODUCED' else None
        if target is not None:
            target += [c for c in regions.get(code, []) if c not in target]
    values = dict(source='POWO', url=usage.get('references') or f'https://www.gbif.org/species/{usage["key"]}',
                  nom=plain_name(usage) or usage.get('canonicalName'), natif=sorted(native),
                  introduit=sorted(c for c in introduced if c not in native))
    return values, [f'WCVP : région TDWG inconnue {code!r}' for code in unknown]


def gbif_range(key: int, flowgrow_regions: str | None, iso3: dict[str, str],
               on_map: set[str]) -> tuple[dict, list[str]]:
    """ Aire d'une mousse : pays où GBIF compte au moins MIN_RECORDS observations, sur les continents d'origine
    indiqués par Flowgrow (sans continents connus, tous les pays observés) """
    params = [('taxonKey', key), ('hasCoordinate', 'true'), ('hasGeospatialIssue', 'false'), ('limit', 0),
              ('facet', 'country'), ('facetLimit', 300)] + [('basisOfRecord', b) for b in OCCURRENCE_BASIS]
    _, body = fetch('https://api.gbif.org/v1/occurrence/search?' + urllib.parse.urlencode(params),
                    f'gbif-plant-countries-{key}.json')
    facets = json.loads(body or '{}').get('facets') or [{}]
    continents = set().union(*(FLOWGROW_REGIONS.get(r.strip(), set())
                               for r in (flowgrow_regions or '').split(',')))
    region_of = {c['iso2']: c.get('gbifRegion') for c in gbif_countries()}
    native = {code for count in facets[0].get('counts', []) if count['count'] >= MIN_RECORDS
              and (not continents or region_of.get(count['name']) in continents)
              and (code := iso3_on_map(count['name'], iso3, on_map))}
    values = dict(source='GBIF', url=f'https://www.gbif.org/species/{key}', natif=sorted(native), introduit=[])
    return values, [] if native else [f'GBIF : aucun pays observé pour le taxon {key}']


def plant_range(name: str, gbif_values: dict, flowgrow_regions: str | None) -> tuple[dict, list[str]]:
    """ Aire de répartition naturelle : WCVP pour les plantes vasculaires, observations GBIF pour les mousses """
    iso3 = {c['iso2']: c['iso3'] for c in gbif_countries()}
    on_map = map_codes()
    if gbif_values.get('embranchement') in BRYOPHYTES:
        return gbif_range(gbif_values['taxon'], flowgrow_regions, iso3, on_map)
    _, table = fetch(TDWG_LEVEL4, 'tdwg-level4.txt')
    return wcvp_range(name, tdwg_countries(table, iso3, on_map))


# --- Wikimedia Commons ------------------------------------------------------------------------------

def photos(name: str, titles: list[str], previous: list[dict] = (),
           external: list[dict] = ()) -> tuple[list[dict], list[str]]:
    """
    Télécharge les photos Commons d'une plante (<plante>-1.jpg, -2.jpg...) et renvoie leurs crédits. Les photos
    iNaturalist (`external`, revues une à une lors de leur ajout) suivent celles de Commons : elles sont gardées
    telles quelles avec leur crédit du passage précédent.
    """
    titles = [t if t.startswith('File:') else f'File:{t}' for t in titles]
    by_source = {c['source']: c for c in previous}
    kept = [by_source[e['source']] for e in external if e['source'] in by_source]
    credits, errors = download_photos(name, titles, PHOTOS_DIR, previous, keep=tuple(c['fichier'] for c in kept))
    errors += [f"{e['source']} : photo externe sans crédit enregistré"
               for e in external if e['source'] not in by_source]
    return credits + kept, errors


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
    if out['gbif']:
        out['aire'], problems = plant_range(fiche['nom_scientifique'], out['gbif'],
                                            out.get('flowgrow', {}).get('regions'))
        warnings += problems
    out['photos'], problems = photos(name, fiche.get('photos', []), (previous or {}).get('photos', []),
                                     fiche.get('photos_externes', []))
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

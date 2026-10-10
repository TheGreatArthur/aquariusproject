"""
Zones du globe de l'accueil : écorégions d'eau douce où vivent les poissons du catalogue

Freshwater Ecoregions of the World (FEOW, Abell et al. 2008, The Nature Conservancy et WWF, www.feow.org) découpe
les eaux douces du monde en 426 écorégions dessinées d'après leurs faunes de poissons. L'outil range dans ces
écorégions les points de la carte de répartition de chaque espèce (`data/occurrences.json` et `localites` des
fiches), puis écrit `frontend/public/maps/ecoregions.json` : pour chaque écorégion habitée, son numéro, son nom
(et ses traductions de `data/ecoregions_fr.json` et `data/ecoregions_ja.json`), son domaine biogéographique, son
type d'habitat, un point d'ancrage pour le globe, ses espèces et leurs observations.

Les conditions d'utilisation de FEOW (usage non commercial ou éducatif, citation et lien vers www.feow.org,
aucune modification) excluent de redistribuer des contours simplifiés : le shapefile ne sert qu'au calcul,
dans le cache `.cache/feow/` (non versionné), et seul le résultat est versionné, avec la citation.

Usage : venv/bin/python -m tools.build_ecoregions
"""

import html
import json
import math
import re
import sys
import zipfile
from collections import Counter
from pathlib import Path

from profiles import OCCURRENCES_FILE, PROFILES_DIR
from tools.fetch_sources import download, fetch

BACKEND_DIR = Path(__file__).resolve().parent.parent
CACHE_DIR = BACKEND_DIR / '.cache' / 'feow'
TRANSLATIONS_FILE = BACKEND_DIR / 'data' / 'ecoregions_fr.json'
JAPANESE_FILE = BACKEND_DIR / 'data' / 'ecoregions_ja.json'
OUTPUT_FILE = BACKEND_DIR.parent / 'frontend' / 'public' / 'maps' / 'ecoregions.json'

SHAPEFILE_URL = 'https://feow.org/files/downloads/GIS_hs_snapped.zip'
LIST_URL = 'https://feow.org/ecoregions/list?page={}'
DETAILS_URL = 'https://feow.org/ecoregions/details/{}'

# Un point de rive ou de delta peut tomber juste hors des contours : rattaché à l'écorégion la plus proche
MAX_SNAP_DEGREES = 0.3
# Une espèce n'est rangée dans une écorégion qu'avec au moins deux observations, ou un dixième des siennes :
# une observation isolée en bordure est le plus souvent une erreur de position
MIN_POINTS, MIN_SHARE = 2, 0.1

SOURCE = {
    'nom': 'Freshwater Ecoregions of the World (FEOW)',
    'auteurs': 'Abell, R. et al. 2008. Freshwater ecoregions of the world: a new map of biogeographic units for '
               'freshwater biodiversity conservation. BioScience 58(5): 403-414',
    'copyright': '© 2008 The Nature Conservancy et World Wildlife Fund, Inc.',
    'url': 'https://www.feow.org',
}

ROYAUMES = {
    'Afrotropic': 'Afrotropical', 'Australasia': 'Australasien', 'Indo-Malay': 'Indomalais', 'Nearctic': 'Néarctique',
    'Neotropic': 'Néotropical', 'Oceania': 'Océanien', 'Palearctic': 'Paléarctique',
}
HABITATS = {
    'Large lakes': 'grands lacs',
    'Large river deltas': 'deltas de grands fleuves',
    'Montane freshwaters': 'eaux de montagne',
    'Oceanic islands': 'îles océaniques',
    'Polar freshwaters': 'eaux polaires',
    'Temperate coastal rivers': 'fleuves côtiers tempérés',
    'Temperate floodplain rivers and wetlands': 'plaines inondables et zones humides tempérées',
    'Temperate upland rivers': 'rivières d\'altitude tempérées',
    'Tropical and subtropical coastal rivers': 'fleuves côtiers tropicaux et subtropicaux',
    'Tropical and subtropical floodplain rivers and wetland complexes':
        'plaines inondables et zones humides tropicales et subtropicales',
    'Tropical and subtropical upland rivers': 'rivières d\'altitude tropicales et subtropicales',
    'Xeric freshwaters and endorheic (closed) basins': 'eaux des régions arides et bassins fermés',
}


def translate(label: str | None, table: dict[str, str], warnings: list[str]) -> str | None:
    """ Libellé FEOW traduit (la liste FEOW n'est pas régulière sur les majuscules) ; inconnu : gardé et signalé """
    if label is None:
        return None
    found = {k.lower(): v for k, v in table.items()}.get(label.lower())
    if found is None:
        warnings.append(f'libellé FEOW sans traduction : {label!r}')
    return found or label


# --- Sources ----------------------------------------------------------------------------------------

def ecoregion_list() -> dict[int, dict]:
    """ Les 426 écorégions de la liste de feow.org : {numéro: {nom, royaume, habitat}} """
    regions, page = {}, 1
    while True:
        status, body = fetch(LIST_URL.format(page), f'feow-list-{page}.html')
        rows = parse_list(body) if status == 200 else []
        if not rows:
            return regions
        regions.update(rows)
        page += 1


def parse_list(markup: str) -> dict[int, dict]:
    """ Lignes « numéro | royaume | type d'habitat | nom » d'une page de la liste """
    rows = {}
    for row in re.findall(r'<tr[^>]*>(.*?)</tr>', markup, re.S):
        cells = [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', c))).strip()
                 for c in re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)]
        if len(cells) == 4 and cells[0].isdigit():
            rows[int(cells[0])] = {'royaume': cells[1], 'habitat': cells[2], 'nom': cells[3]}
    return rows


def shapefile_path() -> Path:
    """ Shapefile FEOW, téléchargé une fois (14 Mo) puis lu depuis le cache """
    archive = CACHE_DIR / 'GIS_hs_snapped.zip'
    if not archive.exists():
        archive.parent.mkdir(parents=True, exist_ok=True)
        archive.write_bytes(download(SHAPEFILE_URL))
    folder = CACHE_DIR / 'GIS_hs_snapped'
    if not folder.exists():
        with zipfile.ZipFile(archive) as z:
            z.extractall(CACHE_DIR)
    return folder / 'feow_hydrosheds.shp'


def load_shapes(path: Path) -> list[tuple[int, object]]:
    """ (numéro d'écorégion, géométrie shapely) ; une écorégion peut compter plusieurs enregistrements """
    import shapefile
    from shapely.geometry import shape

    with shapefile.Reader(str(path)) as reader:
        return [(int(rec['FEOW_ID']), shape(geom.__geo_interface__))
                for rec, geom in zip(reader.records(), reader.shapes())]


def species_points(profiles_dir: Path = PROFILES_DIR, occurrences_file: Path = OCCURRENCES_FILE) -> dict[str, list]:
    """ Points [longitude, latitude] de chaque espèce : observations GBIF et localités saisies dans les fiches """
    occurrences = json.loads(occurrences_file.read_text(encoding='utf-8')) if occurrences_file.exists() else {}
    points = {}
    for path in sorted(profiles_dir.glob('*.json')):
        profile = json.loads(path.read_text(encoding='utf-8'))
        name = profile['nom_scientifique']
        found = occurrences.get(name, {}).get('points', []) + profile.get('localites', [])
        if found:
            points[name] = [list(p) for p in found]
    return points


# --- Calcul -----------------------------------------------------------------------------------------

class Locator:
    """ Écorégion d'un point, par index spatial sur les contours FEOW """

    def __init__(self, shapes: list[tuple[int, object]]):
        from shapely import STRtree

        self.ids = [i for i, _ in shapes]
        self.tree = STRtree([g for _, g in shapes])

    def locate(self, points: list) -> list[int | None]:
        import shapely

        geoms = shapely.points(points)
        found: list[int | None] = [None] * len(points)
        for point_index, shape_index in zip(*self.tree.query(geoms, predicate='intersects')):
            found[point_index] = self.ids[shape_index]
        for i, region in enumerate(found):
            if region is None:
                nearest = self.tree.query_nearest(geoms[i], max_distance=MAX_SNAP_DEGREES)
                if len(nearest):
                    found[i] = self.ids[nearest[0]]
        return found


def assign(points: list, regions: list[int | None]) -> dict[int, list]:
    """ Écorégions retenues pour une espèce et ses points dans chacune (voir MIN_POINTS et MIN_SHARE) """
    by_region: dict[int, list] = {}
    for point, region in zip(points, regions):
        if region is not None:
            by_region.setdefault(region, []).append(point)
    needed = min(MIN_POINTS, max(1, math.ceil(MIN_SHARE * len(points))))
    return {region: pts for region, pts in by_region.items() if len(pts) >= needed}


def anchor(shapes: list[tuple[int, object]], region: int, points: list) -> list[float]:
    """
    Point d'ancrage d'une écorégion sur le globe : le centre visuel (pôle d'inaccessibilité) de sa plus grande
    partie, ou le point observé le plus proche du centre des observations s'il tombe hors de cette partie
    (écorégions en croissant ou en archipel)
    """
    from shapely import Point
    from shapely.ops import polylabel

    parts = [p for i, g in shapes if i == region for p in getattr(g, 'geoms', [g])]
    largest = max(parts, key=lambda p: p.area)
    label = polylabel(largest, tolerance=0.1)
    if not largest.contains(label):
        lon = sum(p[0] for p in points) / len(points)
        lat = sum(p[1] for p in points) / len(points)
        label = min((Point(p) for p in points), key=lambda p: p.distance(Point(lon, lat)))
    return [round(label.x, 2), round(label.y, 2)]


def build(shapes, regions_info: dict[int, dict], points_by_species: dict[str, list],
          translations: dict[str, str], japanese: dict[str, str] | None = None) -> tuple[dict, list[str]]:
    """ Contenu de ecoregions.json et avertissements ; `japanese` donne le nom japonais de chaque écorégion """
    japanese = japanese or {}
    locator = Locator(shapes)
    zones: dict[int, dict] = {}
    warnings = []
    for name, points in sorted(points_by_species.items()):
        kept = assign(points, locator.locate(points))
        if not kept:
            warnings.append(f'{name} : aucune écorégion retenue')
        for region, pts in kept.items():
            zone = zones.setdefault(region, {'especes': [], 'observations': set()})
            zone['especes'].append(name)
            zone['observations'].update(tuple(p) for p in pts)

    out = []
    for region, zone in sorted(zones.items()):
        info = regions_info.get(region, {})
        if not info:
            warnings.append(f'écorégion {region} absente de la liste FEOW')
        if str(region) not in translations:
            warnings.append(f"écorégion {region} ({info.get('nom')}) sans nom français dans ecoregions_fr.json")
        observations = sorted(zone['observations'])
        out.append(dict(
            id=region,
            nom=translations.get(str(region)) or info.get('nom', str(region)),
            nom_feow=info.get('nom'),
            nom_ja=japanese.get(str(region)) or info.get('nom', str(region)),
            royaume=translate(info.get('royaume'), ROYAUMES, warnings),
            habitat=translate(info.get('habitat'), HABITATS, warnings),
            url=DETAILS_URL.format(region),
            point=anchor(shapes, region, observations),
            especes=sorted(zone['especes']),
            observations=[list(p) for p in observations],
        ))
    return {'source': SOURCE, 'zones': out}, warnings


def main() -> int:
    translations = json.loads(TRANSLATIONS_FILE.read_text(encoding='utf-8')) if TRANSLATIONS_FILE.exists() else {}
    japanese = json.loads(JAPANESE_FILE.read_text(encoding='utf-8')) if JAPANESE_FILE.exists() else {}
    data, warnings = build(load_shapes(shapefile_path()), ecoregion_list(), species_points(), translations, japanese)
    OUTPUT_FILE.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    species = Counter(name for zone in data['zones'] for name in zone['especes'])
    print(f"{len(data['zones'])} écorégions, {len(species)} espèces, "
          f"{OUTPUT_FILE.stat().st_size / 1000:.0f} ko -> {OUTPUT_FILE.relative_to(BACKEND_DIR.parent)}")
    for warning in warnings:
        print('  !', warning)
    return 0


if __name__ == '__main__':
    sys.exit(main())

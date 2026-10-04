"""
Points de la carte de répartition : observations géolocalisées GBIF dans l'aire d'origine de chaque espèce

Pour chaque fiche de `data/profiles/`, interroge l'API d'occurrences GBIF (spécimens de musées, observations,
échantillons) limitée aux pays d'origine de la fiche, écarte les introductions déclarées, les points hors de
l'`emprise` de la fiche et les points isolés (erreurs de géoréférencement probables), arrondit au dixième de
degré et écrit `data/occurrences.json`.

Usage : venv/bin/python -m tools.build_occurrences [nom scientifique ...]
"""

import json
import math
import sys
import urllib.parse

from profiles import OCCURRENCES_FILE, PROFILES_DIR
from tools.fetch_sources import CACHE_DIR, GBIF_SPECIES_RANKS, fetch, slug

BASIS = ('PRESERVED_SPECIMEN', 'MATERIAL_SAMPLE', 'MATERIAL_CITATION', 'HUMAN_OBSERVATION', 'OBSERVATION',
         'MACHINE_OBSERVATION', 'OCCURRENCE')
EXCLUDED_MEANS = {'introduced', 'invasive', 'managed', 'naturalised', 'vagrant'}
PAGE, MAX_PAGES, MAX_POINTS = 300, 4, 400
ISOLATION_DEGREES = 3  # un point sans voisin dans ce rayon est écarté (si l'espèce a assez de points)


def iso2_codes() -> dict[str, str]:
    _, body = fetch('https://api.gbif.org/v1/enumeration/country', 'gbif-countries.json')
    return {c['iso3']: c['iso2'] for c in json.loads(body)}


def taxon_key(name: str) -> int | None:
    cache = CACHE_DIR / 'parsed' / f'{slug(name)}.json'
    if not cache.exists():
        return None
    gbif = json.loads(cache.read_text(encoding='utf-8'))['gbif']
    if gbif.get('rank') not in GBIF_SPECIES_RANKS:
        return None
    return gbif.get('acceptedUsageKey') or gbif.get('usageKey')


def occurrences(key: int, countries: list[str]) -> list[tuple[float, float]]:
    points = []
    for page in range(MAX_PAGES):
        params = [('taxonKey', key), ('hasCoordinate', 'true'), ('hasGeospatialIssue', 'false'),
                  ('occurrenceStatus', 'PRESENT'), ('limit', PAGE), ('offset', page * PAGE)]
        params += [('country', c) for c in countries] + [('basisOfRecord', b) for b in BASIS]
        url = 'https://api.gbif.org/v1/occurrence/search?' + urllib.parse.urlencode(params)
        _, body = fetch(url, f'gbif-occ-{key}-{"-".join(countries)}-{page}.json')
        data = json.loads(body or '{}')
        for r in data.get('results', []):
            if str(r.get('establishmentMeans', '')).lower() in EXCLUDED_MEANS:
                continue
            lon, lat = r.get('decimalLongitude'), r.get('decimalLatitude')
            if lon is not None and lat is not None and (lon, lat) != (0, 0):
                points.append((round(lon, 1), round(lat, 1)))
        if data.get('endOfRecords', True):
            break
    return points


def within(points: list[tuple[float, float]], emprise: list[float] | None) -> list[tuple[float, float]]:
    if not emprise:
        return points
    west, south, east, north = emprise
    return [p for p in points if west <= p[0] <= east and south <= p[1] <= north]


def without_isolated(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    if len(points) < 4:
        return points
    return [p for p in points
            if any(q != p and math.dist(p, q) <= ISOLATION_DEGREES for q in points)]


def thin(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """ Garde au plus MAX_POINTS points, répartis régulièrement dans la liste triée """
    if len(points) <= MAX_POINTS:
        return points
    step = len(points) / MAX_POINTS
    return [points[int(i * step)] for i in range(MAX_POINTS)]


def main(names: list[str]) -> None:
    # Lecture directe (sans validation) : les points peuvent être générés avant la rédaction des textes
    profiles = {p['nom_scientifique']: p for p in
                (json.loads(f.read_text(encoding='utf-8')) for f in sorted(PROFILES_DIR.glob('*.json')))}
    existing = json.loads(OCCURRENCES_FILE.read_text(encoding='utf-8')) if OCCURRENCES_FILE.exists() else {}
    iso2 = iso2_codes()

    for name, profile in profiles.items():
        if names and name not in names:
            continue
        key = taxon_key(name)
        countries = sorted({iso2[c] for c in profile['pays'] if c in iso2})
        if not key or not countries:
            existing.pop(name, None)
            print(f'{name:40} pas de points (taxon GBIF ou pays d\'origine inconnus)')
            continue
        points = sorted(set(within(occurrences(key, countries), profile.get('emprise'))))
        points = thin(sorted(without_isolated(points)))
        existing[name] = {'gbif': key, 'points': [list(p) for p in points]}
        print(f'{name:40} {len(points)} points')

    lines = [f'  {json.dumps(n, ensure_ascii=False)}: {json.dumps(existing[n], separators=(",", ":"))}'
             for n in sorted(existing)]
    OCCURRENCES_FILE.write_text('{\n' + ',\n'.join(lines) + '\n}\n', encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv[1:])

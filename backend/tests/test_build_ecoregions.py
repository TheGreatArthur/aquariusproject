""" Écorégions du globe : liste FEOW, rangement des observations, points d'ancrage, fichier versionné """

import json

import pytest
from shapely.geometry import Point, Polygon, box

import tools.build_ecoregions as be
from profiles import load_profiles

LIST_PAGE = """<table><thead><tr><th>ID</th><th>Realm</th><th>Major Habitat Type</th><th>Ecoregion</th></tr></thead>
<tr><td><a href="https://feow.org/ecoregions/details/314">314</a></td><td>Neotropic</td>
    <td>Tropical and subtropical floodplain rivers and wetland complexes</td><td>Rio Negro</td></tr>
<tr><td>559</td><td>Afrotropic</td><td>Large lakes</td><td>Lake Malawi &amp; Shire</td></tr>
</table>"""

# Deux écorégions carrées côte à côte : 1 de 0 à 10° de longitude, 2 de 10 à 20°
SHAPES = [(1, box(0, 0, 10, 10)), (2, box(10, 0, 20, 10))]


def test_parse_list():
    assert be.parse_list(LIST_PAGE) == {
        314: {'royaume': 'Neotropic', 'habitat': 'Tropical and subtropical floodplain rivers and wetland complexes',
              'nom': 'Rio Negro'},
        559: {'royaume': 'Afrotropic', 'habitat': 'Large lakes', 'nom': 'Lake Malawi & Shire'},
    }


def test_ecoregion_list_reads_every_page(monkeypatch):
    pages = {'feow-list-1.html': (200, LIST_PAGE), 'feow-list-2.html': (200, '<table></table>')}
    monkeypatch.setattr(be, 'fetch', lambda url, name: pages.get(name, (404, '')))

    assert sorted(be.ecoregion_list()) == [314, 559]


def test_points_are_located_and_snapped_to_the_nearest_region():
    locator = be.Locator(SHAPES)

    # Dedans, sur la rive (à 0,2° du bord), trop loin (à 1°)
    assert locator.locate([[5, 5], [15, 5], [20.2, 5], [25, 5]]) == [1, 2, 2, None]


@pytest.mark.parametrize('regions, expected', [
    # Peu d'observations : une seule suffit
    ([1, 1, 2], {1: 2, 2: 1}),
    # Beaucoup d'observations : un point isolé dans une écorégion voisine est écarté
    ([1] * 20 + [2], {1: 20}),
    ([1] * 20 + [2, 2], {1: 20, 2: 2}),
    ([1, None, None], {1: 1}),
])
def test_assign_ignores_isolated_points(regions, expected):
    points = [[i, 0] for i in range(len(regions))]

    assert {r: len(p) for r, p in be.assign(points, regions).items()} == expected


def test_anchor_is_inside_the_largest_part():
    shapes = [(1, box(0, 0, 10, 10)), (1, box(50, 50, 51, 51))]

    lon, lat = be.anchor(shapes, 1, [[1, 1]])

    assert 0 < lon < 10 and 0 < lat < 10


def test_anchor_of_a_crescent_stays_inside():
    # Croissant : le centre de son emprise tombe dans le creux, le point d'ancrage doit rester dans la forme
    crescent = Polygon([(0, 0), (10, 0), (10, 10), (0, 10), (0, 9), (9, 9), (9, 1), (0, 1)])

    lon, lat = be.anchor([(1, crescent)], 1, [[9.5, 5], [5, 0.5], [5, 9.5]])

    assert crescent.contains(Point(lon, lat))


def test_build_lists_inhabited_regions_with_their_species():
    info = {1: {'nom': 'West', 'royaume': 'Neotropic', 'habitat': 'Large lakes'},
            2: {'nom': 'East', 'royaume': 'Mars', 'habitat': 'Unknown'}}
    species = {'Aus bus': [[5, 5], [6, 6]], 'Cus dus': [[5, 5], [15, 5]]}

    data, warnings = be.build(SHAPES, info, species, {'1': 'Ouest'})

    assert data['source']['url'] == 'https://www.feow.org'
    west, east = data['zones']
    assert west['nom'] == 'Ouest' and west['nom_feow'] == 'West'
    assert (west['royaume'], west['habitat']) == ('Néotropical', 'grands lacs')
    assert west['especes'] == ['Aus bus', 'Cus dus'] and west['observations'] == [[5, 5], [6, 6]]
    # Sans traduction, le nom FEOW est gardé et signalé ; un libellé inconnu est repris tel quel
    assert (east['nom'], east['royaume'], east['habitat']) == ('East', 'Mars', 'Unknown')
    assert warnings == ['écorégion 2 (East) sans nom français dans ecoregions_fr.json']


def test_species_without_region_is_reported():
    data, warnings = be.build(SHAPES, {}, {'Aus bus': [[90, 45]]}, {})

    assert data['zones'] == [] and warnings == ['Aus bus : aucune écorégion retenue']


def test_species_points_join_gbif_observations_and_localities(tmp_path):
    profiles = tmp_path / 'profiles'
    profiles.mkdir()
    (profiles / 'a.json').write_text(json.dumps({'nom_scientifique': 'Aus bus', 'localites': [[1, 2]]}))
    (profiles / 'b.json').write_text(json.dumps({'nom_scientifique': 'Cus dus'}))
    occurrences = tmp_path / 'occurrences.json'
    occurrences.write_text(json.dumps({'Aus bus': {'points': [[3, 4]]}}))

    assert be.species_points(profiles, occurrences) == {'Aus bus': [[3, 4], [1, 2]]}


# --- Fichier versionné ------------------------------------------------------------------------------

def test_versioned_ecoregions_match_the_catalogue():
    data = json.loads(be.OUTPUT_FILE.read_text(encoding='utf-8'))
    species = set(load_profiles())

    assert data['source']['copyright'].startswith('© 2008 The Nature Conservancy')
    assert len(data['zones']) >= 100
    for zone in data['zones']:
        assert zone['nom'] and zone['nom_feow'] and zone['url'].startswith('https://feow.org/')
        assert -180 <= zone['point'][0] <= 180 and -90 <= zone['point'][1] <= 90
        assert zone['especes'] and set(zone['especes']) <= species, zone['id']
        assert zone['observations'], zone['id']


def test_every_versioned_zone_has_a_french_name():
    data = json.loads(be.OUTPUT_FILE.read_text(encoding='utf-8'))
    translations = json.loads(be.TRANSLATIONS_FILE.read_text(encoding='utf-8'))

    assert {str(z['id']) for z in data['zones']} <= set(translations)

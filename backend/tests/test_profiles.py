import json
from pathlib import Path

import pytest

from corrections import CORRECTIONS
from invertebrates import load_invertebrates
from normalize import COMPORTEMENTS, MODES_VIE
from profiles import load_occurrences, load_profiles, upsert_profiles, validate

WORLD_MAP = Path(__file__).resolve().parents[2] / 'frontend' / 'public' / 'maps' / 'world-50m.json'

PROFILE = dict(
    nom_scientifique='Paracheirodon axelrodi',
    nom_valide=None,
    auteur='(Schultz, 1956)',
    classification='Characiformes › Acestrorhamphidae',
    uicn='LC',
    repartition='Rio Negro et haut Orénoque',
    pays=['BRA', 'COL', 'VEN'],
    presentation='Décrit en 1956.',
    habitat='Eaux noires.',
    comportement='Poisson de banc.',
    sources=[{'nom': 'FishBase', 'url': 'https://www.fishbase.se/summary/Paracheirodon-axelrodi.html'}],
)


def test_valid_profile_has_no_error():
    assert validate(PROFILE) == []


@pytest.mark.parametrize('change, error', [
    ({'habitat': '  '}, 'habitat vide'),
    ({'uicn': 'XX'}, "uicn inconnu : 'XX'"),
    ({'pays': ['Brésil']}, 'pays'),
    ({'sources': []}, 'sources'),
    ({'sources': [{'nom': 'FishBase', 'url': 'http://fishbase.se'}]}, 'sources'),
    ({'emprise': [10, 0, 5, 1]}, 'emprise'),
    ({'localites': [[200, 0]]}, 'localites'),
])
def test_invalid_profile(change, error):
    errors = validate({**PROFILE, **change})

    assert any(e.startswith(error) for e in errors), errors


def test_versioned_profiles_are_valid_and_unique():
    profiles = load_profiles()

    assert len(profiles) >= 135


def test_versioned_profiles_use_countries_of_the_base_map():
    if not WORLD_MAP.exists():
        pytest.skip('fond de carte absent')
    topo = json.loads(WORLD_MAP.read_text(encoding='utf-8'))
    codes = {g['properties']['iso'] for g in topo['objects']['pays']['geometries']}

    unknown = {name: set(p['pays']) - codes for name, p in load_profiles().items() if set(p['pays']) - codes}
    assert unknown == {}


def test_occurrences_belong_to_a_profile_and_stay_in_its_bounding_box():
    # Fiches des poissons et des invertébrés (même champ `emprise`)
    profiles = {**load_profiles(), **{name: row['profil'] for name, row in load_invertebrates(occurrences={}).items()}}

    for name, points in load_occurrences().items():
        assert name in profiles
        if emprise := profiles[name].get('emprise'):
            west, south, east, north = emprise
            assert all(west <= lon <= east and south <= lat <= north for lon, lat in points), name


def test_corrections_keep_categories_and_ranges_consistent():
    for name, fields in CORRECTIONS.items():
        values = {field: value for field, (value, _reason) in fields.items()}
        if 'comportement' in values:
            assert values['comportement'] in COMPORTEMENTS, name
        if 'mode_vie' in values:
            assert values['mode_vie'] in MODES_VIE, name
        for prefix in ('ph', 'gh', 'temp'):
            if f'{prefix}_mini' in values:
                assert values[f'{prefix}_mini'] < values[f'{prefix}_maxi'], name


def test_profile_is_returned_with_the_fish_detail_only(client):
    from app import db

    orphans = upsert_profiles(db.session, {
        'Paracheirodon axelrodi': PROFILE,
        'Espèce absente': {**PROFILE, 'nom_scientifique': 'Espèce absente'},
    }, {'Paracheirodon axelrodi': [[-67.1, 1.9]]})
    db.session.commit()

    assert orphans == ['Espèce absente']
    profil = client.get('/poissons/1').get_json()['profil']
    assert profil['auteur'] == '(Schultz, 1956)'
    assert profil['pays'] == ['BRA', 'COL', 'VEN']
    assert profil['points'] == [[-67.1, 1.9]]
    assert 'id_poisson' not in profil
    assert client.get('/poissons/2').get_json()['profil'] is None
    assert all('profil' not in p for p in client.get('/poissons').get_json()['poissons'])


def test_upsert_updates_an_existing_profile(client):
    from app import db

    upsert_profiles(db.session, {'Paracheirodon axelrodi': PROFILE}, {})
    upsert_profiles(db.session, {'Paracheirodon axelrodi': {**PROFILE, 'uicn': 'NT', 'localites': [[-64.8, 2.1]]}}, {})
    db.session.commit()

    profil = client.get('/poissons/1').get_json()['profil']
    assert (profil['uicn'], profil['points']) == ('NT', [[-64.8, 2.1]])

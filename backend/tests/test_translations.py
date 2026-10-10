import pytest

import translations

FISH = {
    'Paracheirodon axelrodi': {'nom_commun': 'Cardinal tetra', 'profil': {'habitat': 'Blackwater streams.'}},
    'Pterophyllum scalare': {'nom_commun': 'Freshwater angelfish', 'inconnu': 'ignored'},
}


@pytest.fixture
def english(monkeypatch):
    monkeypatch.setattr(translations, 'load',
                        lambda lang, catalogue: FISH if (lang, catalogue) == ('en', 'fish') else {})


def test_list_in_english(client, english):
    noms = {p['id']: p['nom_commun'] for p in client.get('/poissons?lang=en').get_json()['poissons']}

    assert noms == {1: 'Cardinal tetra', 2: 'Freshwater angelfish'}


def test_french_without_lang_or_with_an_unknown_one(client, english):
    for query in ('', '?lang=de'):
        noms = {p['nom_commun'] for p in client.get(f'/poissons{query}').get_json()['poissons']}
        assert noms == {'Cardinalis', 'Scalaire'}


def test_missing_translation_keeps_french(client, english):
    noms = {p['nom_commun'] for p in client.get('/poissons?lang=ja').get_json()['poissons']}

    assert noms == {'Cardinalis', 'Scalaire'}


def test_translate_merges_profile_and_ignores_unknown_fields(english):
    item = {'nom_scientifique': 'Paracheirodon axelrodi', 'nom_commun': 'Cardinalis',
            'profil': {'habitat': 'Ruisseaux.', 'presentation': 'Texte.'}}

    out = translations.translate(item, 'fish', 'en')

    assert out['nom_commun'] == 'Cardinal tetra'
    assert out['profil'] == {'habitat': 'Blackwater streams.', 'presentation': 'Texte.'}
    assert translations.translate({**item, 'nom_scientifique': 'Pterophyllum scalare'}, 'fish', 'en').get('inconnu') \
        is None


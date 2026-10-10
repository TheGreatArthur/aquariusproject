import json

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



def _sources(catalogue: str) -> dict[str, dict]:
    """ French species of a catalogue, by scientific name, with their texts at the top level """
    data = translations.TRANSLATIONS_DIR.parent
    read = lambda folder: [json.loads(f.read_text(encoding='utf-8')) for f in (data / folder).glob('*.json')]  # noqa: E731
    if catalogue == 'fish':
        species = {d['nom_scientifique']: d for d in read('profiles')}
        for d in read('fish'):
            species.setdefault(d['nom_scientifique'], {})
        return species
    if catalogue == 'invertebrates':
        return {d['nom_scientifique']: d['profil'] for d in read('invertebrates')}
    return {d['nom_scientifique']: d for d in read('plants')}


TEXTS = {
    'fish': ('repartition', 'presentation', 'habitat', 'comportement'),
    'invertebrates': ('repartition', 'presentation', 'habitat', 'comportement', 'maintenance', 'alimentation',
                      'reproduction'),
    'plants': ('origine', 'presentation', 'culture'),
}


@pytest.mark.parametrize('catalogue', translations.CATALOGUES)
@pytest.mark.parametrize('lang', translations.LANGUAGES)
def test_every_species_is_translated(lang, catalogue):
    """ Every species of the versioned data has a common name and all its texts in English and Japanese """
    translations.load.cache_clear()
    traduites = translations.load(lang, catalogue)
    manques = []
    for nom, source in _sources(catalogue).items():
        entry = traduites.get(nom, {})
        textes = entry.get('profil', {}) if catalogue != 'plants' else entry
        manques += [f'{nom}: nom_commun'] if not entry.get('nom_commun') else []
        manques += [f'{nom}: {champ}' for champ in TEXTS[catalogue] if source.get(champ) and not textes.get(champ)]

    assert manques == []

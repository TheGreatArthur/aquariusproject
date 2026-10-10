import json
from pathlib import Path

import pytest
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from invertebrates import load_invertebrates, upsert_invertebrates, validate
from models import Base, Invertebre
from tools.commons import FREE_LICENCE

PHOTOS_DIR = Path(__file__).resolve().parents[2] / 'frontend' / 'public' / 'invertebrates'

AMANO = dict(
    nom_scientifique='Caridina multidentata', nom_commun='Crevette Amano', variete=None, groupe='crevette',
    famille='Atyidae', genre='Caridina', zone_geo='Asie', installation='aquarium', milieu='eau douce et eau saumâtre',
    ph_mini=6.8, ph_maxi=7.2, gh_mini=None, gh_maxi=None, kh_mini=None, kh_maxi=None, temp_mini=16, temp_maxi=28,
    taille=5.5, mesure_taille='longueur du corps', litrage_mini=60, nb_individus=5, longevite=None,
    comportement='pacifique', mode_vie='colonie', regime='détritivore', activite='diurne',
    reproduction='larves en eau saumâtre',
    photos=[{'fichier': 'caridina-multidentata-1.jpg', 'auteur': 'MdE', 'licence': 'CC BY-SA 3.0',
             'licence_url': 'https://creativecommons.org/licenses/by-sa/3.0',
             'source': 'https://commons.wikimedia.org/wiki/File:Amano.jpg', 'vue': 'animal'}],
    profil=dict(nom_valide=None, auteur='Stimpson, 1860', classification='Decapoda › Atyidae', uicn='LC',
                repartition='Japon et Taïwan', pays=['JPN', 'TWN'], presentation='Présentation.', habitat='Habitat.',
                comportement='Comportement.', maintenance='Entretien.', alimentation='Alimentation.',
                reproduction='Reproduction.'),
    sources=[{'nom': 'GBIF', 'url': 'https://www.gbif.org/species/4417537'}],
)


def test_valid_invertebrate_has_no_error():
    assert validate(AMANO) == []


@pytest.mark.parametrize('change, error', [
    ({'groupe': 'poisson'}, "groupe inconnu : 'poisson'"),
    ({'comportement': 'gentil'}, "comportement inconnu : 'gentil'"),
    ({'mode_vie': 'banc'}, "mode_vie inconnu : 'banc'"),
    ({'ph_mini': 8, 'ph_maxi': 6}, 'ph : plage 8–6'),
    ({'temp_maxi': None}, 'temp : plage'),
    ({'gh_mini': 5}, 'gh : plage 5–None'),
    ({'taille': 0}, 'taille : 0'),
    ({'photos': []}, 'photos : au moins une photo'),
    ({'profil': {**AMANO['profil'], 'habitat': ' '}}, 'profil.habitat vide'),
    ({'profil': {**AMANO['profil'], 'pays': ['Japon']}}, 'profil.pays'),
    ({'sources': [{'nom': 'X', 'url': 'http://x'}]}, 'sources'),
])
def test_invalid_invertebrate(change, error):
    errors = validate({**AMANO, **change})

    assert any(e.startswith(error) for e in errors), errors


def test_optional_values_may_be_missing():
    # Les sources ne donnent ni GH ni KH pour la plupart des espèces, ni la taille de nombreux escargots
    assert validate({**AMANO, 'taille': None, 'mode_vie': None, 'reproduction': None, 'nb_individus': None}) == []


def test_load_splits_photos_and_joins_points(tmp_path):
    (tmp_path / 'caridina-multidentata.json').write_text(json.dumps(AMANO), encoding='utf-8')

    rows = load_invertebrates(tmp_path, {'Caridina multidentata': [[130.5, 32.8]]})

    row = rows['Caridina multidentata']
    assert row['images'] == ['caridina-multidentata-1.jpg'] and row['credits'] == AMANO['photos']
    # La fiche a les mêmes champs que celle d'un poisson : points de la carte et sources compris
    assert row['profil']['points'] == [[130.5, 32.8]] and row['profil']['sources'] == AMANO['sources']
    assert 'photos' not in row and 'sources' not in row


def test_load_rejects_an_invalid_file(tmp_path):
    (tmp_path / 'amano.json').write_text(json.dumps({**AMANO, 'groupe': '?'}), encoding='utf-8')

    with pytest.raises(ValueError, match="amano.json : groupe inconnu : '\\?'"):
        load_invertebrates(tmp_path, {})


def test_upsert_keeps_ids_and_removes_deleted_files(tmp_path):
    engine = create_engine('sqlite://')
    Base.metadata.create_all(engine)
    (tmp_path / 'caridina-multidentata.json').write_text(json.dumps(AMANO), encoding='utf-8')
    rows = load_invertebrates(tmp_path, {})

    with Session(engine) as db:
        upsert_invertebrates(db, rows)
        db.commit()
        first = db.scalar(select(Invertebre))
        upsert_invertebrates(db, {name: {**row, 'taille': 6} for name, row in rows.items()})
        db.commit()
        assert [(i.id, i.taille) for i in db.scalars(select(Invertebre))] == [(first.id, 6)]

        upsert_invertebrates(db, {})
        db.commit()
        assert db.scalars(select(Invertebre)).all() == []
    engine.dispose()


def test_versioned_invertebrates_are_complete():
    rows = load_invertebrates()

    assert len(rows) >= 20
    for name, row in rows.items():
        # Les photos sont dans le front end et sous licence libre
        for credit in row['credits']:
            assert (PHOTOS_DIR / credit['fichier']).is_file(), credit['fichier']
            assert FREE_LICENCE.match(credit['licence']), (name, credit['licence'])


def load_versioned_invertebrates():
    from app import db

    upsert_invertebrates(db.session, load_invertebrates())
    db.session.commit()


def test_list_invertebres_with_main_photo(client):
    load_versioned_invertebrates()

    invertebres = client.get('/invertebres').get_json()['invertebres']

    amano = next(i for i in invertebres if i['nom_scientifique'] == 'Caridina multidentata')
    assert amano['image'] == 'caridina-multidentata-1.jpg'
    assert (amano['groupe'], amano['comportement'], amano['litrage_mini']) == ('crevette', 'pacifique', 60)
    # Champs lus par les règles du simulateur
    assert (amano['regime'], amano['reproduction']) == ('détritivore', 'larves en eau saumâtre')
    # La fiche descriptive n'est renvoyée que sur le détail, comme pour les poissons
    assert 'profil' not in amano and 'credits' not in amano


def test_get_invertebre_with_its_profile(client):
    load_versioned_invertebrates()
    invertebres = client.get('/invertebres').get_json()['invertebres']
    helena = next(i['id'] for i in invertebres if i['nom_scientifique'] == 'Clea helena')

    data = client.get(f'/invertebres/{helena}').get_json()

    assert data['profil']['nom_valide'] == 'Anentome helena'
    assert data['profil']['classification'] == 'Neogastropoda › Nassariidae'
    expected = {'presentation', 'habitat', 'comportement', 'maintenance', 'pays', 'points', 'sources'}
    assert expected <= set(data['profil'])
    assert len(data['images']) == len(data['credits']) == 3


def test_get_invertebre_not_found(client):
    assert client.get('/invertebres/999').status_code == 404

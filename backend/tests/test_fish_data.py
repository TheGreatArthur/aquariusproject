import json

import pytest
from sqlalchemy import create_engine, inspect, select, text
from sqlalchemy.orm import Session

from fish_data import load_fish, upsert_fish, validate
from models import Base, Famille, Poisson
from models.meta import create_schema

FISH = dict(
    nom_scientifique='Hemigrammus erythrozonus', nom_commun='Tétra lumineux', famille='Characidae',
    genre='Hemigrammus', zone_geo='Amérique du Sud', type_eau='douce', ph_mini=5.5, ph_maxi=7.5, kh=None,
    gh_mini=2, gh_maxi=15, temp_mini=24, temp_maxi=28, taille=4, litrage_mini=90, nb_individus=8, points=5,
    regime='Omnivore', mode_vie='banc', comportement='pacifique', robustesse='robuste', dispo='très courant',
    longevite=5, courant='doux', photos=['File:Glowlight tetra.jpg'],
    sources=[{'nom': 'Seriously Fish', 'url': 'https://www.seriouslyfish.com/species/hemigrammus-erythrozonus/'}],
)
CREDITS = [{'fichier': 'hemigrammus-erythrozonus-1.jpg', 'auteur': 'A. Author', 'licence': 'CC BY-SA 4.0',
            'licence_url': 'https://creativecommons.org/licenses/by-sa/4.0',
            'source': 'https://commons.wikimedia.org/wiki/File:Glowlight_tetra.jpg'}]


def test_valid_fish_has_no_error():
    assert validate(FISH, CREDITS) == []


@pytest.mark.parametrize('change, error', [
    ({'nom_commun': ' '}, 'nom_commun vide'),
    ({'comportement': 'gentil'}, "comportement inconnu : 'gentil'"),
    ({'mode_vie': 'troupeau'}, 'mode_vie inconnu'),
    ({'robustesse': ''}, 'robustesse inconnu'),
    ({'dispo': 'partout'}, 'dispo inconnu'),
    ({'zone_geo': 'Atlantide'}, 'zone_geo inconnu'),
    ({'courant': 'tempête'}, "courant inconnu : 'tempête'"),
    ({'ph_mini': 8, 'ph_maxi': 6}, 'ph : plage 8–6'),
    ({'temp_maxi': None}, 'temp : plage'),
    ({'litrage_mini': 5}, 'litrage_mini'),
    ({'nb_individus': 0}, 'nb_individus'),
    ({'sources': [{'nom': 'X', 'url': 'http://x'}]}, 'sources'),
])
def test_invalid_fish(change, error):
    errors = validate({**FISH, **change}, CREDITS)

    assert any(e.startswith(error) for e in errors), errors


def test_fish_needs_credited_photos():
    assert validate(FISH, []) == ['photos : au moins une photo téléchargée attendue (tools/fetch_fish_photos.py)']
    assert validate(FISH, [{**CREDITS[0], 'auteur': ''}])[0].startswith('photos : chaque photo')


def test_load_joins_the_photo_credits(tmp_path):
    fish_dir = tmp_path / 'fish'
    fish_dir.mkdir()
    (fish_dir / 'hemigrammus-erythrozonus.json').write_text(json.dumps(FISH), encoding='utf-8')
    photos = tmp_path / 'photos.json'
    photos.write_text(json.dumps({'hemigrammus-erythrozonus': CREDITS}), encoding='utf-8')

    fishes = load_fish(fish_dir, photos)

    assert fishes['Hemigrammus erythrozonus']['credits'] == CREDITS


def test_load_rejects_an_invalid_file(tmp_path):
    (tmp_path / 'tetra.json').write_text(json.dumps({**FISH, 'dispo': '?'}), encoding='utf-8')

    with pytest.raises(ValueError, match="tetra.json : dispo inconnu : '\\?'"):
        load_fish(tmp_path, tmp_path / 'absent.json')


def test_upsert_creates_then_updates_the_fish_with_its_labels():
    engine = create_engine('sqlite://')
    Base.metadata.create_all(engine)
    fish = {**FISH, 'credits': CREDITS}

    with Session(engine) as db:
        upsert_fish(db, {fish['nom_scientifique']: fish})
        db.commit()
        created = db.scalar(select(Poisson))
        assert (created.nom_commun, created.famille.nom, created.regime) == ('Tétra lumineux', 'Characidae', 'omnivore')
        assert created.images == ['hemigrammus-erythrozonus-1.jpg'] and created.credits == CREDITS

        upsert_fish(db, {fish['nom_scientifique']: {**fish, 'taille': 4.5}})
        db.commit()
        assert [(p.id, p.taille) for p in db.scalars(select(Poisson))] == [(created.id, 4.5)]
        assert db.scalars(select(Famille.nom)).all() == ['Characidae']
    engine.dispose()


def test_create_schema_adds_new_optional_columns_to_an_existing_database():
    engine = create_engine('sqlite://')
    Base.metadata.create_all(engine)
    with engine.begin() as connection:
        connection.execute(text('ALTER TABLE poisson DROP COLUMN credits'))

    assert create_schema(engine) == ['poisson.credits']
    assert 'credits' in {c['name'] for c in inspect(engine).get_columns('poisson')}
    assert create_schema(engine) == []
    engine.dispose()

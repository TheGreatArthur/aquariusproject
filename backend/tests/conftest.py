import os

import pytest

# Must be set before importing the app, which reads the DSN at import time
os.environ['AQUARIUS_DSN'] = 'sqlite://'

from app import app as flask_app, db  # noqa: E402
from models import (  # noqa: E402
    Base, Comportement, Dispo, Famille, Genre, ModeVie, Poisson, Robustesse, TypeEau, ZoneGeo,
)


@pytest.fixture
def client():
    with flask_app.app_context():
        Base.metadata.create_all(db.engine)
        characidae, cichlidae = Famille(nom='Characidae'), Famille(nom='Cichlidae')
        pacifique, agressif = Comportement(nom='pacifique'), Comportement(nom='agressif')
        banc = ModeVie(nom='banc')
        db.session.add_all([
            ZoneGeo(id=1, nom='Amérique du Sud'), TypeEau(id=1, nom='douce'),
            Robustesse(id=1, nom='robuste'), Dispo(id=1, nom='courant'),
        ])
        common = dict(
            mode_vie=banc, ph_mini=6, ph_maxi=7.5, gh_mini=3, gh_maxi=12, taille=4, nb_individus=10,
            id_zone_geo=1, id_type_eau=1, regime='omnivore', temp_mini=23, temp_maxi=28, id_robustesse=1,
            id_dispo=1, longevite=5, litrage_mini=100,
        )
        db.session.add_all([
            Poisson(id=1, nom_scientifique='Paracheirodon axelrodi', nom_commun='Cardinalis', famille=characidae,
                    genre=Genre(nom='Paracheirodon'), comportement=pacifique, images=['1.jpg', '1.1.jpg'], **common),
            Poisson(id=2, nom_scientifique='Pterophyllum scalare', nom_commun='Scalaire', famille=cichlidae,
                    genre=Genre(nom='Pterophyllum'), comportement=agressif, images=['2.jpg'], **common),
        ])
        db.session.commit()

        yield flask_app.test_client()

        db.session.remove()
        Base.metadata.drop_all(db.engine)

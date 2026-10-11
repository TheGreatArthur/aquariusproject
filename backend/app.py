""" API Flask d'Aquarius : catalogue des poissons, familles, invertébrés et plantes

Chaque route accepte `?lang=en` ou `?lang=ja` pour les noms communs et les textes des espèces (translations.py).
"""

import os
from pathlib import Path

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from models import Poisson, Famille, Invertebre, Plante
from translations import language, translate

# Instantané de la base pour la démo en ligne, ouvert en lecture seule (make demo-db)
DEMO_DB = Path(__file__).resolve().parent / 'demo' / 'aquarius.db'
DEMO_DSN = f'sqlite:///file:{DEMO_DB}?mode=ro&immutable=1&uri=true'

try:
    from config import DSN
except ModuleNotFoundError:
    # Déploiement (Vercel) : pas de config.py, l'API sert l'instantané sauf si AQUARIUS_DSN désigne une autre base
    DSN = os.environ.get('AQUARIUS_DSN', DEMO_DSN)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DSN
db = SQLAlchemy(app)

CORS(app)


@app.route('/poissons')
def poissons():
    """ Liste des poissons ; la recherche et le filtre par famille se font dans le navigateur, sur cette liste
    """
    lang = language()
    return {'poissons': [translate(p.as_dict(), 'fish', lang) for p in db.session.scalars(db.select(Poisson))]}


@app.route('/poissons/<int:id>')
def get_poisson(id: int):
    poisson: Poisson = db.session.get(Poisson, id)

    if not poisson:
        return 'Fish not found', 404

    # La fiche descriptive n'est renvoyée que sur le détail, pas dans la liste (textes longs, points de carte)
    return translate({**poisson.as_dict(), 'profil': poisson.profil.as_dict() if poisson.profil else None}, 'fish',
                     language())


@app.route('/poissons/familles')
def get_familles():
    familles = db.session.scalars(db.select(Famille).order_by(Famille.nom))

    return {'familles': [f.as_dict() for f in familles]}


# Champs de la liste des plantes : les textes et les sources ne sont renvoyés que sur le détail
PLANTE_LISTE = (
    'id', 'nom_scientifique', 'nom_commun', 'famille', 'type', 'positions', 'difficulte', 'croissance', 'lumiere_mini',
    'lumiere_maxi', 'co2', 'ph_mini', 'ph_maxi', 'temp_mini', 'temp_maxi', 'hauteur_mini', 'hauteur_maxi', 'usages',
)


@app.route('/plantes')
def plantes():
    """ Liste des plantes, avec leur photo principale """
    liste = db.session.scalars(db.select(Plante).order_by(Plante.nom_commun))
    lang = language()
    return {'plantes': [translate({**{k: getattr(p, k) for k in PLANTE_LISTE},
                                   'image': p.images[0] if p.images else None}, 'plants', lang)
                        for p in liste]}


@app.route('/plantes/<int:id>')
def get_plante(id: int):
    plante: Plante = db.session.get(Plante, id)

    if not plante:
        return 'Plant not found', 404

    return translate(plante.as_dict(), 'plants', language())


# Champs de la liste des invertébrés, comme pour les poissons : la fiche descriptive n'est renvoyée que sur le détail
INVERTEBRE_LISTE = (
    'id', 'nom_scientifique', 'nom_commun', 'variete', 'groupe', 'famille', 'installation', 'comportement', 'mode_vie',
    'taille', 'litrage_mini', 'nb_individus', 'ph_mini', 'ph_maxi', 'gh_mini', 'gh_maxi', 'temp_mini', 'temp_maxi',
    'regime', 'zone_geo', 'reproduction',
)


@app.route('/invertebres')
def invertebres():
    """ Liste des invertébrés (crevettes, crabes, escargots, écrevisses), avec leur photo principale """
    liste = db.session.scalars(db.select(Invertebre).order_by(Invertebre.nom_commun))
    lang = language()
    return {'invertebres': [translate({**{k: getattr(i, k) for k in INVERTEBRE_LISTE},
                                       'image': i.images[0] if i.images else None}, 'invertebrates', lang)
                            for i in liste]}


@app.route('/invertebres/<int:id>')
def get_invertebre(id: int):
    invertebre: Invertebre = db.session.get(Invertebre, id)

    if not invertebre:
        return 'Invertebrate not found', 404

    return translate(invertebre.as_dict(), 'invertebrates', language())

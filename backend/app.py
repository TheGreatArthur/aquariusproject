""" API Flask d'Aquarius : catalogue des poissons, familles et plantes
"""

from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, or_

from config import DSN
from models import Poisson, Genre, Famille, Comportement, Plante

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DSN
db = SQLAlchemy(app)

CORS(app)


@app.route('/poissons')
def poissons():
    """ Liste des poissons, avec recherche rapide (`q`) ou filtre sur la famille (`famille`)
    """
    rq = db.select(Poisson)
    if q := request.args.get('q'):
        # Filtrage rapide sur le début des noms ; `%` et `_` sont cherchés tels quels
        rq = rq.join(Famille).join(Genre).join(Comportement).where(
            or_(
                Poisson.nom_commun.istartswith(q, autoescape=True),
                Poisson.nom_scientifique.istartswith(q, autoescape=True),
                Famille.nom.istartswith(q, autoescape=True),
                Genre.nom.istartswith(q, autoescape=True),
                Comportement.nom.istartswith(q, autoescape=True),
            ))
    elif fam := request.args.get('famille'):
        # Filtrage exact sur le nom de la famille, sans tenir compte de la casse
        rq = rq.join(Famille).where(func.lower(Famille.nom) == fam.lower())

    return {'poissons': [p.as_dict() for p in db.session.scalars(rq)]}


@app.route('/poissons/<int:id>')
def get_poisson(id: int):
    poisson: Poisson = db.session.get(Poisson, id)

    if not poisson:
        return 'Fish not found', 404

    # La fiche descriptive n'est renvoyée que sur le détail, pas dans la liste (textes longs, points de carte)
    return {**poisson.as_dict(), 'profil': poisson.profil.as_dict() if poisson.profil else None}


@app.route('/poissons/familles')
def get_familles():
    familles = db.session.scalars(db.select(Famille).order_by(Famille.nom))

    return {'familles': [f.as_dict() for f in familles]}


# Champs de la liste des plantes : les textes et les sources ne sont renvoyés que sur le détail
PLANTE_LISTE = (
    'id', 'nom_scientifique', 'nom_commun', 'famille', 'type', 'positions', 'difficulte', 'croissance', 'lumiere_mini',
    'lumiere_maxi', 'co2', 'ph_mini', 'ph_maxi', 'temp_mini', 'temp_maxi', 'hauteur_mini', 'hauteur_maxi',
)


@app.route('/plantes')
def plantes():
    """ Liste des plantes, avec leur photo principale """
    liste = db.session.scalars(db.select(Plante).order_by(Plante.nom_commun))
    return {'plantes': [{**{k: getattr(p, k) for k in PLANTE_LISTE}, 'image': p.images[0] if p.images else None}
                        for p in liste]}


@app.route('/plantes/<int:id>')
def get_plante(id: int):
    plante: Plante = db.session.get(Plante, id)

    if not plante:
        return 'Plant not found', 404

    return plante.as_dict()

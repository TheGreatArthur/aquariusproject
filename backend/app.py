""" Application Flask de test
"""

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_

from config import DSN
from models import Poisson, Genre, Famille, Comportement

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DSN
db = SQLAlchemy(app)


@app.route('/poissons')
def poissons():
    """ Recherche de poissons avec filtrage sur le genre
    """
    #for i in range(1, 10):
    #    poisson: Poisson = db.session.get(Poisson, i)
    #    poisson.images=[f'{i}.jpg', f'img_{35+i}.png']
    #db.session.commit()

    rq = db.select(Poisson)
    if q := request.args.get('q'):
        # Filtrage rapide
        rq = rq.join(Famille).join(Genre).join(Comportement).where(
            or_(
            Poisson.nom_commun.ilike(q + '%'),
            Poisson.nom_scientifique.ilike(q + '%'),
            Famille.nom.ilike(q + '%'),
            Genre.nom.ilike(q + '%'),
            Comportement.nom.ilike(q + '%'),
            ))
    elif fam := request.args.get('famille'):
        # Filtrage exact sur le nom de la famille, pour le carrousel
        rq = rq.join(Famille).where(Famille.nom.ilike(fam))

    print(rq)    
    return {'poissons': [p.as_dict() for p in db.session.scalars(rq)]}


@app.route('/poissons/<id>')
def get_poisson(id: int):
    poisson: Poisson = db.session.get(Poisson, id)

    if not poisson:
        return 'Fish not found', 404
    
    return poisson.as_dict()

@app.route('/poissons/familles')
def get_familles():

    familles: Famille = db.session.scalars(db.select(Famille).order_by(Famille.nom))
    
    return {'familles': [f.as_dict() for f in familles]}

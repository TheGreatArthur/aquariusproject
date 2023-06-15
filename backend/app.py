""" Application Flask de test
"""

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_

from config import DSN
from models import Poisson, Genre, Famille

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
        rq = rq.join(Famille).join(Genre).where(
            or_(
            Poisson.nom_commun.ilike(q + '%'),
            Poisson.nom_scientifique.ilike(q + '%'),
            Famille.nom.ilike(q + '%'),
            Genre.nom.ilike(q + '%'),
            ))
        
    return {'poissons': [p.as_dict() for p in db.session.scalars(rq)]}


@app.route('/poissons/<id>')
def get_poisson(id: int):
    poisson: Poisson = db.session.get(Poisson, id)

    if not poisson:
        return 'Fish not found', 404
    
    return poisson.as_dict()

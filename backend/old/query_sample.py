from sqlalchemy import select, text
from sqlalchemy.orm import Session

from models import Poisson, Genre
from models.meta import get_engine

DSN = 'mysql+mysqldb://aquarius:aquAriuS@localhost/aquarius'
engine = get_engine(DSN)

with Session(engine) as db:
    rq = select(Poisson.nom_scientifique).join(Genre).where(Genre.nom.startswith('Tha'))
    print(rq)
    for p in db.scalars(rq):
        print(p)

with engine.connect() as conn:
    sql = text("""
    SELECT nom_scientifique
FROM poisson, genre
WHERE poisson.id_genre = genre.id 
AND genre.nom = 'Thayeria'
    """)
    print(conn.execute(sql).all())
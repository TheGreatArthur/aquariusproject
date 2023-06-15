import anodb
# parameters: driver, connection string, SQL file
db = anodb.DB("mysqldb", 'localhost', "queries.sql",
               options={'database': 'aquarius', 'user': 'aquarius','password':'aquAriuS'})

for p in db.get_poissons_by_genre(genre='Tha%'):
    print(p)

db.close()
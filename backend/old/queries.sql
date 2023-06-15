-- name: get_poissons
SELECT * FROM poisson;

-- name: get_poissons_by_genre
SELECT nom_scientifique
FROM poisson, genre
WHERE poisson.id_genre = genre.id 
AND genre.nom like :genre;
from .meta import Base
from .nomenclatures import Courant, Comportement, Dispo, Famille, Genre, ModeVie, Robustesse, TypeEau, ZoneGeo
from .plante import Plante
from .poisson import Poisson
from .profil import Profil

__all__ = [
    'Base', 'Courant', 'Comportement', 'Dispo', 'Famille', 'Genre', 'ModeVie', 'Robustesse', 'TypeEau', 'ZoneGeo',
    'Plante', 'Poisson', 'Profil', 'NOMENCLATURES',
]


# Tables de nomenclature d'un poisson : (classe, champ des données lues, colonne de la table poisson)
NOMENCLATURES = [
    (Famille, 'famille', 'id_famille'),
    (Genre, 'genre', 'id_genre'),
    (ZoneGeo, 'zone_geo', 'id_zone_geo'),
    (TypeEau, 'type_eau', 'id_type_eau'),
    (ModeVie, 'mode_vie', 'id_mode_vie'),
    (Robustesse, 'robustesse', 'id_robustesse'),
    (Comportement, 'comportement', 'id_comportement'),
    (Dispo, 'dispo', 'id_dispo'),
    (Courant, 'courant', 'id_courant'),
]

"""
Script de création et d'initialisation de la base
"""

from pathlib import Path

from openpyxl import load_workbook
from sqlalchemy.orm import Session
from sqlalchemy import delete, select

from config import DSN, EXCEL_FILE
from corrections import apply_corrections
from models import Poisson, Famille, Genre, ZoneGeo, Robustesse, Comportement, Dispo, Base, TypeEau, ModeVie, Courant
from models.meta import get_engine
from normalize import (
    clean, normalize_comportement, normalize_courant, normalize_famille, normalize_mode_vie, normalize_regime,
    normalize_zone,
)
from utils import get_or_create_id

engine = get_engine(DSN)

IMAGES_DIR = Path(__file__).resolve().parent.parent / 'frontend' / 'public' / 'images'

# Tables de nomenclature : (classe, champ du dictionnaire lu, colonne de la table poisson)
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


def get_images(code) -> list[str]:
    """ Liste des images d'un poisson (ex. : 1.jpg, 1.1.jpg, 1.2.jpg), image principale en premier
    """
    files = [f.name for f in IMAGES_DIR.glob(f'{code}.*') if f.stem == str(code) or f.stem.startswith(f'{code}.')]
    return sorted(files, key=lambda name: (name.count('.'), name))


def _number(value, unit: str = ''):
    """ '4cm' -> 4.0, '25 °C' -> 25.0, 5 -> 5.0
    """
    return float(str(value).replace(unit, '').strip())


def parse_row(row: tuple) -> dict:
    """ Lit une ligne du classeur et renvoie des valeurs nettoyées et normalisées (sans accès à la base)
    """
    gh_mini, _, gh_maxi = clean(row[8]).split()
    return dict(
        code=row[0],
        nom_scientifique=clean(row[1]),
        nom_commun=clean(row[2]),
        famille=normalize_famille(row[3]),
        genre=clean(row[4]),
        ph_mini=_number(row[5]),
        ph_maxi=_number(row[6]),
        kh=row[7],
        gh_mini=_number(gh_mini),
        gh_maxi=_number(gh_maxi),
        taille=_number(row[9], 'cm'),
        zone_geo=normalize_zone(row[10]),
        nb_individus=int(row[11]),
        type_eau=clean(row[12]),
        regime=normalize_regime(row[13]),
        mode_vie=normalize_mode_vie(row[14]),
        temp_mini=int(_number(row[15], '°C')),
        temp_maxi=int(_number(row[16], '°C')),
        robustesse=clean(row[17]),
        comportement=normalize_comportement(row[18]),
        dispo=clean(row[19]),
        longevite=int(_number(row[20], 'ans')),
        litrage_mini=int(_number(row[21], 'L')),
        courant=normalize_courant(row[22]),
        points=row[23],
    )


def to_params(db, fish: dict) -> dict:
    """ Remplace les libellés de nomenclature par leurs ids (créés au besoin)
    """
    params = {k: v for k, v in fish.items() if k != 'code'}
    for cls, field, column in NOMENCLATURES:
        params[column] = get_or_create_id(db, cls, nom=params.pop(field))
    params['images'] = get_images(fish['code'])
    return params


def delete_unused_nomenclatures(db) -> None:
    """ Supprime les libellés qui ne sont plus utilisés par aucun poisson (anciennes variantes)
    """
    for cls, _field, column in NOMENCLATURES:
        used = select(getattr(Poisson, column)).where(getattr(Poisson, column).is_not(None))
        db.execute(delete(cls).where(cls.id.not_in(used)))


if __name__ == '__main__':
    # Création des tables manquantes
    Base.metadata.create_all(bind=engine)

    try:
        wb = load_workbook(filename=EXCEL_FILE)
    except PermissionError:
        print("Vous devez fermer Excel d'abord")
        exit()
    except FileNotFoundError:
        print("Classeur Excel non trouvé !")
        exit()

    ws = wb.active

    with Session(engine) as db:
        for row in ws.iter_rows(min_row=2, values_only=True):
            fish = parse_row(row)
            excel_name = fish['nom_scientifique']
            params = to_params(db, apply_corrections(fish))
            # Un poisson renommé par corrections.py garde sa ligne (et son id) : recherche aussi sous l'ancien nom
            poisson = (db.scalar(select(Poisson).filter_by(nom_scientifique=params['nom_scientifique']))
                       or db.scalar(select(Poisson).filter_by(nom_scientifique=excel_name)))
            if poisson:
                print('Edition poisson', poisson)
                for k,v in params.items():
                    if getattr(poisson, k) != v:
                        print(k, ':', getattr(poisson, k), '->', v )
                        setattr(poisson, k, v)
            else:
                db.add(Poisson(**params))
                print('Création poisson', params['nom_scientifique'])

        db.flush()
        delete_unused_nomenclatures(db)
        db.commit()

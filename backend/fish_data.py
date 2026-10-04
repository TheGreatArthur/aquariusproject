"""
Poissons décrits par fichier : `data/fish/<espèce>.json`, en plus de ceux du classeur Excel

Chaque fichier donne toutes les valeurs d'un poisson du catalogue, dans les catégories du simulateur (voir
`normalize.py`), ses sources et les photos Wikimedia Commons retenues ; `tools/draft_fish.py` en écrit le
brouillon à partir des sources collectées par `tools/fetch_sources.py`, et `tools/fetch_fish_photos.py`
télécharge les photos et note leurs crédits dans `data/fish_photos.json`. Les fiches descriptives (textes,
carte de répartition) restent dans `data/profiles/`, comme pour les poissons du classeur.

Les poissons sont chargés par l'import Excel, ou seuls avec `python fish_data.py` (base déjà créée).
"""

import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from models import NOMENCLATURES, Poisson
from normalize import COMPORTEMENTS, MODES_VIE, normalize_courant, normalize_regime
from utils import get_or_create_id

DATA_DIR = Path(__file__).resolve().parent / 'data'
FISH_DIR = DATA_DIR / 'fish'
PHOTOS_FILE = DATA_DIR / 'fish_photos.json'

ROBUSTESSES = ('très robuste', 'robuste', 'tolérant', 'sensible', 'fragile')
DISPOS = ('très courant', 'courant', 'peu courant', 'occasionnel', 'rare')
ZONES = ('Amérique du Sud', 'Amérique centrale', 'Amérique du Nord', 'Afrique', 'Asie', 'Océanie', 'Europe')
TYPES_EAU = ('douce',)

TEXT_FIELDS = ('nom_scientifique', 'nom_commun', 'famille', 'genre', 'regime')
CHOICES = (('comportement', COMPORTEMENTS), ('mode_vie', MODES_VIE), ('robustesse', ROBUSTESSES),
           ('dispo', DISPOS), ('zone_geo', ZONES), ('type_eau', TYPES_EAU))
# (champ, plus petite et plus grande valeur plausibles)
RANGES = (('ph', 4, 9.5), ('gh', 0, 40), ('temp', 4, 36))
NUMBERS = (('taille', 0.5, 150), ('litrage_mini', 10, 5000), ('nb_individus', 1, 30), ('points', 1, 1000),
           ('longevite', 1, 50))
COLUMNS = ('nom_scientifique', 'nom_commun', 'famille', 'genre', 'zone_geo', 'type_eau', 'ph_mini', 'ph_maxi', 'kh',
           'gh_mini', 'gh_maxi', 'temp_mini', 'temp_maxi', 'taille', 'litrage_mini', 'nb_individus', 'points',
           'regime', 'mode_vie', 'comportement', 'robustesse', 'dispo', 'longevite', 'courant')


def validate(fish: dict, credits: list[dict]) -> list[str]:
    """ Erreurs d'un poisson décrit par fichier (liste vide s'il est valide) """
    errors = [f'{field} vide' for field in TEXT_FIELDS if not str(fish.get(field) or '').strip()]
    for field, allowed in CHOICES:
        if fish.get(field) not in allowed:
            errors.append(f'{field} inconnu : {fish.get(field)!r}')
    if fish.get('courant') is not None:
        try:
            normalize_courant(fish['courant'])
        except ValueError:
            errors.append(f"courant inconnu : {fish['courant']!r}")
    for field, low, high in RANGES:
        mini, maxi = fish.get(f'{field}_mini'), fish.get(f'{field}_maxi')
        if not isinstance(mini, (int, float)) or not isinstance(maxi, (int, float)) or not low <= mini <= maxi <= high:
            errors.append(f'{field} : plage {mini}–{maxi} invalide (attendu entre {low} et {high})')
    for field, low, high in NUMBERS:
        value = fish.get(field)
        if not isinstance(value, (int, float)) or not low <= value <= high:
            errors.append(f'{field} : {value!r} hors de [{low}, {high}]')
    sources = fish.get('sources')
    if not sources or not all(s.get('nom') and str(s.get('url', '')).startswith('https://') for s in sources):
        errors.append('sources : au moins une source, chacune avec un nom et une url https')
    if not credits:
        errors.append('photos : au moins une photo téléchargée attendue (tools/fetch_fish_photos.py)')
    elif not all(c.get('fichier') and c.get('auteur') and c.get('licence')
                 and str(c.get('source', '')).startswith('https://') for c in credits):
        errors.append('photos : chaque photo doit avoir un fichier, un auteur, une licence et une source https')
    return errors


def load_fish(directory: Path = FISH_DIR, photos_file: Path = PHOTOS_FILE) -> dict[str, dict]:
    """ Poissons indexés par nom scientifique, avec leurs crédits photo ; lève ValueError si l'un est invalide """
    photos = json.loads(photos_file.read_text(encoding='utf-8')) if photos_file.exists() else {}
    fishes = {}
    for path in sorted(directory.glob('*.json')):
        fish = json.loads(path.read_text(encoding='utf-8'))
        credits = photos.get(path.stem, [])
        if errors := validate(fish, credits):
            raise ValueError(f'{path.name} : ' + ', '.join(errors))
        if fish['nom_scientifique'] in fishes:
            raise ValueError(f"{path.name} : poisson en double ({fish['nom_scientifique']})")
        fishes[fish['nom_scientifique']] = {**fish, 'credits': credits}
    return fishes


def to_params(db: Session, fish: dict) -> dict:
    """ Colonnes de la table poisson ; les libellés de nomenclature sont remplacés par leurs ids (créés au besoin) """
    params = {column: fish.get(column) for column in COLUMNS}
    params['regime'] = normalize_regime(params['regime'])
    if params['courant']:
        params['courant'] = normalize_courant(params['courant'])
    for cls, field, column in NOMENCLATURES:
        params[column] = get_or_create_id(db, cls, nom=params.pop(field))
    params['images'] = [c['fichier'] for c in fish['credits']]
    params['credits'] = fish['credits']
    return params


def upsert_fish(db: Session, fishes: dict[str, dict]) -> None:
    """ Crée ou met à jour chaque poisson décrit par fichier (même id d'un chargement à l'autre) """
    existing = {p.nom_scientifique: p for p in db.scalars(select(Poisson))}
    for name, fish in fishes.items():
        params = to_params(db, fish)
        if name in existing:
            for key, value in params.items():
                setattr(existing[name], key, value)
        else:
            db.add(Poisson(**params))


if __name__ == '__main__':
    from config import DSN
    from models.meta import create_schema, get_engine
    from profiles import load_occurrences, load_profiles, upsert_profiles

    engine = get_engine(DSN)
    for column in create_schema(engine):
        print('Colonne ajoutée :', column)
    with Session(engine) as session:
        loaded = load_fish()
        upsert_fish(session, loaded)
        session.flush()
        upsert_profiles(session, load_profiles(), load_occurrences())
        session.commit()
    print(f'{len(loaded)} poissons chargés depuis data/fish/.')

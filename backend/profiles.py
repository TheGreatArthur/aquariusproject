"""
Fiches descriptives des poissons (présentation, habitat, comportement, répartition, sources)

Une fiche par espèce dans `data/profiles/<espèce>.json`, rédigée à partir de sources citées (FishBase,
Seriously Fish, GBIF...), et les points de la carte de répartition dans `data/occurrences.json`
(générés par `tools/build_occurrences.py`). Une fiche peut ajouter des `localites` [longitude, latitude]
saisies à la main (localité type...) quand GBIF n'a pas d'observation géolocalisée, et une `emprise`
[ouest, sud, est, nord] qui écarte les observations GBIF hors de l'aire décrite par les sources
(erreurs d'identification, introductions). Les fiches sont chargées en base par l'import Excel, ou seules
avec `python profiles.py` (base déjà importée).
"""

import json
import re
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Poisson, Profil

DATA_DIR = Path(__file__).resolve().parent / 'data'
PROFILES_DIR = DATA_DIR / 'profiles'
OCCURRENCES_FILE = DATA_DIR / 'occurrences.json'

TEXT_FIELDS = ('presentation', 'habitat', 'comportement', 'repartition')
UICN_CODES = {'EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'}
ISO3 = re.compile(r'^[A-Z]{3}$')


def validate(profile: dict) -> list[str]:
    """ Erreurs de contenu d'une fiche (liste vide si elle est valide) """
    errors = []
    if not profile.get('nom_scientifique'):
        errors.append('nom_scientifique manquant')
    for field in TEXT_FIELDS:
        if not str(profile.get(field) or '').strip():
            errors.append(f'{field} vide')
    if profile.get('uicn') is not None and profile['uicn'] not in UICN_CODES:
        errors.append(f"uicn inconnu : {profile['uicn']!r}")
    pays = profile.get('pays')
    if not isinstance(pays, list) or not all(isinstance(p, str) and ISO3.match(p) for p in pays):
        errors.append('pays : liste de codes ISO alpha-3 attendue (vide si l\'origine est inconnue)')
    localites = profile.get('localites', [])
    if not isinstance(localites, list) or not all(
            isinstance(p, list) and len(p) == 2 and -180 <= p[0] <= 180 and -90 <= p[1] <= 90 for p in localites):
        errors.append('localites : liste de [longitude, latitude] attendue')
    emprise = profile.get('emprise')
    if emprise is not None and not (isinstance(emprise, list) and len(emprise) == 4
                                    and emprise[0] < emprise[2] and emprise[1] < emprise[3]):
        errors.append('emprise : [ouest, sud, est, nord] attendu')
    sources = profile.get('sources')
    if not isinstance(sources, list) or not sources:
        errors.append('sources : au moins une source attendue')
    elif not all(isinstance(s, dict) and s.get('nom') and str(s.get('url', '')).startswith('https://')
                 for s in sources):
        errors.append('sources : chaque source doit avoir un nom et une url https')
    return errors


def load_profiles(directory: Path = PROFILES_DIR) -> dict[str, dict]:
    """ Fiches indexées par nom scientifique ; lève ValueError si une fiche est invalide """
    profiles = {}
    for path in sorted(directory.glob('*.json')):
        profile = json.loads(path.read_text(encoding='utf-8'))
        if errors := validate(profile):
            raise ValueError(f'{path.name} : ' + ', '.join(errors))
        if profile['nom_scientifique'] in profiles:
            raise ValueError(f"{path.name} : fiche en double pour {profile['nom_scientifique']}")
        profiles[profile['nom_scientifique']] = profile
    return profiles


def load_occurrences(path: Path = OCCURRENCES_FILE) -> dict[str, list]:
    """ Points [longitude, latitude] par nom scientifique """
    if not path.exists():
        return {}
    return {name: entry['points'] for name, entry in json.loads(path.read_text(encoding='utf-8')).items()}


def upsert_profiles(db: Session, profiles: dict[str, dict], occurrences: dict[str, list]) -> list[str]:
    """ Crée ou met à jour la fiche de chaque poisson ; renvoie les fiches sans poisson correspondant """
    fish_by_name = {p.nom_scientifique: p for p in db.scalars(select(Poisson))}
    for name, profile in profiles.items():
        poisson = fish_by_name.get(name)
        if not poisson:
            continue
        values = dict(
            nom_valide=profile.get('nom_valide'),
            auteur=profile.get('auteur'),
            classification=profile.get('classification'),
            uicn=profile.get('uicn'),
            presentation=profile['presentation'].strip(),
            habitat=profile['habitat'].strip(),
            comportement=profile['comportement'].strip(),
            repartition=profile['repartition'].strip(),
            pays=profile['pays'],
            points=occurrences.get(name, []) + profile.get('localites', []),
            sources=profile['sources'],
        )
        if poisson.profil is None:
            poisson.profil = Profil(**values)
        else:
            for key, value in values.items():
                setattr(poisson.profil, key, value)
    return sorted(set(profiles) - set(fish_by_name))


if __name__ == '__main__':
    from config import DSN
    from models.meta import create_schema, get_engine

    engine = get_engine(DSN)
    for column in create_schema(engine):
        print('Colonne ajoutée :', column)
    with Session(engine) as session:
        orphans = upsert_profiles(session, load_profiles(), load_occurrences())
        session.commit()
    for name in orphans:
        print('Fiche sans poisson en base :', name)
    print('Fiches chargées.')

"""
Invertébrés d'aquarium décrits par fichier (`data/invertebrates/<espèce>.json`), sur le modèle des poissons

Chaque fichier reprend les champs d'un poisson (paramètres d'eau, taille, volume et groupe minimum, longévité,
comportement, mode de vie, régime), précise le groupe (crevette, crabe, escargot, écrevisse), l'installation
(aquarium ou aquaterrarium) et le milieu, liste ses photos avec leurs crédits et contient sa fiche descriptive :
mêmes champs que celle d'un poisson (classification, statut UICN, répartition, pays, présentation, habitat,
comportement), plus l'entretien, l'alimentation et la reproduction en aquarium. Les points de la carte de
répartition viennent de `data/occurrences.json`, comme pour les poissons. Les invertébrés sont chargés par
l'import Excel, ou seuls avec `python invertebrates.py` ; un fichier supprimé retire l'espèce de la base.
"""

import json
import re
from pathlib import Path

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from models import Invertebre
from profiles import load_occurrences

INVERTEBRATES_DIR = Path(__file__).resolve().parent / 'data' / 'invertebrates'

GROUPES = ('crevette', 'crabe', 'escargot', 'écrevisse')
INSTALLATIONS = ('aquarium', 'aquaterrarium')
MILIEUX = ('eau douce', 'eau douce et eau saumâtre')
# Mêmes catégories de comportement que les poissons, pour que le simulateur puisse les traiter de la même façon
COMPORTEMENTS = ('pacifique', 'peu agressif', 'territorial', 'moyennement agressif', 'agressif', 'prédateur')
MODES_VIE = ('solitaire', 'seul ou en groupe', 'petit groupe', 'colonie')
REGIMES = ('omnivore', 'herbivore', 'brouteur', 'détritivore', 'filtreur', 'carnivore')
ACTIVITES = ('diurne', 'nocturne')
# Où se déroule le cycle : les larves de nombreuses crevettes et nérites ne survivent pas en eau douce
REPRODUCTIONS = ('en eau douce', 'larves en eau saumâtre', 'larves en mer', "larves hors de l'eau douce")
ZONES = ('Amérique du Sud', 'Amérique centrale', 'Amérique du Nord', 'Afrique', 'Asie', 'Océanie', 'Europe')
UICN = ('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD', 'NE')

CHOICES = (('groupe', GROUPES), ('installation', INSTALLATIONS), ('milieu', MILIEUX),
           ('comportement', COMPORTEMENTS), ('mode_vie', MODES_VIE), ('regime', REGIMES),
           ('activite', ACTIVITES), ('reproduction', REPRODUCTIONS), ('zone_geo', ZONES))
OPTIONAL_CHOICES = ('mode_vie', 'regime', 'activite', 'reproduction', 'zone_geo')
# (champ, valeur minimale, valeur maximale, plage obligatoire)
RANGES = (('ph', 4, 9.5, True), ('gh', 0, 40, False), ('kh', 0, 30, False), ('temp', 4, 36, True))
NUMBERS = (('taille', 0.3, 40), ('litrage_mini', 5, 2000), ('nb_individus', 1, 50), ('longevite', 1, 50))
TEXTS = ('nom_scientifique', 'nom_commun', 'famille', 'genre')
PROFILE_TEXTS = ('repartition', 'presentation', 'habitat', 'comportement', 'maintenance', 'alimentation',
                 'reproduction')
ISO3 = re.compile(r'^[A-Z]{3}$')


def validate(item: dict) -> list[str]:
    """ Erreurs de contenu d'un invertébré (liste vide s'il est valide) """
    errors = [f'{field} vide' for field in TEXTS if not str(item.get(field) or '').strip()]
    for field, allowed in CHOICES:
        value = item.get(field)
        if (value is not None or field not in OPTIONAL_CHOICES) and value not in allowed:
            errors.append(f'{field} inconnu : {value!r}')

    for field, low, high, required in RANGES:
        mini, maxi = item.get(f'{field}_mini'), item.get(f'{field}_maxi')
        if mini is None and maxi is None and not required:
            continue
        if not all(isinstance(v, (int, float)) for v in (mini, maxi)) or not low <= mini <= maxi <= high:
            errors.append(f'{field} : plage {mini}–{maxi} invalide (attendu entre {low} et {high})')
    for field, low, high in NUMBERS:
        value = item.get(field)
        if value is not None and not (isinstance(value, (int, float)) and low <= value <= high):
            errors.append(f'{field} : {value} hors de [{low}, {high}]')

    photos = item.get('photos')
    if not isinstance(photos, list) or not photos:
        errors.append('photos : au moins une photo attendue')
    elif not all(isinstance(p, dict) and p.get('fichier') and p.get('auteur') and p.get('licence')
                 and str(p.get('source', '')).startswith('https://') for p in photos):
        errors.append('photos : chaque photo doit avoir un fichier, un auteur, une licence et une source https')

    profil = item.get('profil') or {}
    errors += [f'profil.{field} vide' for field in PROFILE_TEXTS if not str(profil.get(field) or '').strip()]
    if profil.get('uicn') not in UICN:
        errors.append(f"profil.uicn inconnu : {profil.get('uicn')!r}")
    pays = profil.get('pays')
    if not isinstance(pays, list) or not all(isinstance(p, str) and ISO3.match(p) for p in pays):
        errors.append('profil.pays : liste de codes ISO alpha-3 attendue')

    sources = item.get('sources')
    if not sources or not all(s.get('nom') and str(s.get('url', '')).startswith('https://') for s in sources):
        errors.append('sources : au moins une source, chacune avec un nom et une url https')
    return errors


def to_row(item: dict, points: list) -> dict:
    """ Colonnes de la table `invertebre` : photos séparées en fichiers et crédits, fiche avec ses sources """
    row = {k: v for k, v in item.items() if k not in ('photos', 'profil', 'sources', 'notes')}
    row['images'] = [p['fichier'] for p in item['photos']]
    row['credits'] = item['photos']
    profil = {k: v.strip() if isinstance(v, str) else v for k, v in item['profil'].items()}
    row['profil'] = {**profil, 'points': points + profil.pop('localites', []), 'sources': item['sources']}
    return row


def load_invertebrates(directory: Path = INVERTEBRATES_DIR, occurrences: dict | None = None) -> dict[str, dict]:
    """ Lignes de la table `invertebre` indexées par nom scientifique ; lève ValueError si un fichier est invalide """
    occurrences = load_occurrences() if occurrences is None else occurrences
    rows = {}
    for path in sorted(directory.glob('*.json')):
        item = json.loads(path.read_text(encoding='utf-8'))
        if errors := validate(item):
            raise ValueError(f'{path.name} : ' + ', '.join(errors))
        if item['nom_scientifique'] in rows:
            raise ValueError(f"{path.name} : invertébré en double ({item['nom_scientifique']})")
        rows[item['nom_scientifique']] = to_row(item, occurrences.get(item['nom_scientifique'], []))
    return rows


def upsert_invertebrates(db: Session, rows: dict[str, dict]) -> None:
    """ Crée ou met à jour chaque invertébré (même id d'un chargement à l'autre) et retire ceux sans fichier """
    existing = {i.nom_scientifique: i for i in db.scalars(select(Invertebre))}
    for name, values in rows.items():
        if name in existing:
            for key, value in values.items():
                setattr(existing[name], key, value)
        else:
            db.add(Invertebre(**values))
    db.execute(delete(Invertebre).where(Invertebre.nom_scientifique.not_in(list(rows))))


if __name__ == '__main__':
    from config import DSN
    from models.meta import create_schema, get_engine

    engine = get_engine(DSN)
    for column in create_schema(engine):
        print('Colonne ajoutée :', column)
    with Session(engine) as session:
        loaded = load_invertebrates()
        upsert_invertebrates(session, loaded)
        session.commit()
    print(f'{len(loaded)} invertébrés chargés depuis data/invertebrates/.')

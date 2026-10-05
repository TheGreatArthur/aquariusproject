"""
Plantes d'aquarium : fiches rédigées (`data/plants/<plante>.json`) et données collectées (`data/plant_sources.json`)

Une fiche donne le nom commun, l'origine et les textes en français, les pages sources et les photos retenues ;
`tools/fetch_plants.py` en tire les paramètres de culture (Flowgrow), la hauteur en aquarium et le besoin en CO2
(Tropica), la taxonomie actuelle et le statut UICN (GBIF), les pays d'origine et d'introduction (WCVP de Kew) et
les crédits des photos. Les points de la carte de répartition viennent de `data/occurrences.json`, comme pour les
poissons. Une fiche peut compléter ou corriger une valeur collectée dans `valeurs`, en citant sa source dans
`sources`. Les plantes sont chargées en base par l'import Excel, ou seules avec `python plants.py` ; une fiche
supprimée retire la plante de la base.
"""

import json
from pathlib import Path

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from models import Plante
from profiles import ISO3, load_occurrences

DATA_DIR = Path(__file__).resolve().parent / 'data'
PLANTS_DIR = DATA_DIR / 'plants'
SOURCES_FILE = DATA_DIR / 'plant_sources.json'

TYPES = ('épiphyte', 'mousse', 'rosette', 'tige', 'tapissante', 'flottante', 'rhizome')
DIFFICULTES = ('très facile', 'facile', 'moyenne', 'difficile', 'très difficile')
CROISSANCES = ('très lente', 'lente', 'moyenne', 'rapide', 'très rapide')
LUMIERES = ('très faible', 'faible', 'moyenne', 'forte', 'très forte')
CO2 = ('faible', 'moyen', 'élevé')
UICN = ('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD', 'NE')

# Champs repris de Flowgrow tels quels
FLOWGROW_FIELDS = (
    'type', 'positions', 'usages', 'difficulte', 'croissance', 'lumiere_mini', 'lumiere_maxi', 'ph_mini', 'ph_maxi',
    'kh_mini', 'kh_maxi', 'temp_mini', 'temp_maxi', 'temp_opti_mini', 'temp_opti_maxi', 'multiplication', 'emergee',
)
TEXT_FIELDS = ('nom_commun', 'origine', 'presentation', 'culture')
# (champ, valeur minimale, valeur maximale) des plages vérifiées
RANGES = (('ph', 3, 10), ('kh', 0, 30), ('temp', 0, 40), ('temp_opti', 0, 40), ('hauteur', 1, 200))
REQUIRED = ('famille', 'type', 'difficulte', 'croissance', 'lumiere_mini', 'lumiere_maxi', 'ph_mini', 'ph_maxi',
            'temp_mini', 'temp_maxi')


def merge(fiche: dict, collected: dict, points: list | None = None) -> dict:
    """ Valeurs d'une plante pour la base : fiche rédigée + données collectées (+ points de la carte) """
    flowgrow, tropica, gbif, aire = (collected.get(k, {}) for k in ('flowgrow', 'tropica', 'gbif', 'aire'))
    values = {field: flowgrow.get(field) for field in FLOWGROW_FIELDS}
    for field in ('positions', 'usages', 'multiplication'):
        values[field] = values[field] or []
    # Hauteur moyenne deux mois après la plantation (Tropica), à défaut la hauteur indiquée par Flowgrow
    for field in ('hauteur_mini', 'hauteur_maxi'):
        values[field] = tropica.get(field, flowgrow.get(field))
    values['co2'] = tropica.get('co2')
    # Classification actuelle selon GBIF, à défaut celle de Flowgrow
    values['famille'] = gbif.get('famille') or flowgrow.get('famille')
    values['ordre'] = gbif.get('ordre') or flowgrow.get('ordre')
    values['auteur'] = gbif.get('auteur')
    values['nom_valide'] = gbif.get('nom_valide')
    values['uicn'] = gbif.get('uicn')
    # Aire de répartition naturelle : pays d'origine, pays où l'homme l'a introduite, observations
    values['pays'] = aire.get('natif', [])
    values['introduits'] = aire.get('introduit', [])
    values['points'] = points or []

    values['nom_scientifique'] = fiche['nom_scientifique'].strip()
    for field in TEXT_FIELDS:
        values[field] = str(fiche.get(field) or '').strip()
    values['images'] = collected.get('photos', [])

    powo = aire if aire.get('source') == 'POWO' else {}
    sources = [{'nom': nom, 'url': page['url']} for nom, page in (
        ('Flowgrow', flowgrow), ('Tropica', tropica), ('GBIF', gbif), ('POWO (Kew)', powo)) if page.get('url')]
    sources += [s for s in fiche.get('sources', []) if s.get('url') not in {x['url'] for x in sources}]
    values['sources'] = sources

    values.update(fiche.get('valeurs', {}))
    # Taxon de la WCVP dont l'aire est montrée, quand ce n'est ni le nom de la fiche ni son nom valide (l'espèce
    # d'une variété ou d'un cultivar, un nom accepté par Kew mais pas par GBIF)
    nom_aire = aire.get('nom') if 'pays' not in fiche.get('valeurs', {}) else None
    values['taxon_aire'] = nom_aire if nom_aire not in (values['nom_scientifique'], values['nom_valide']) else None
    return values


def validate(values: dict) -> list[str]:
    """ Erreurs de contenu d'une plante prête à charger (liste vide si elle est valide) """
    errors = []
    if not values.get('nom_scientifique'):
        errors.append('nom_scientifique manquant')
    errors += [f'{field} vide' for field in TEXT_FIELDS if not str(values.get(field) or '').strip()]
    errors += [f'{field} manquant' for field in REQUIRED if values.get(field) is None]

    for field, allowed in (('type', TYPES), ('difficulte', DIFFICULTES), ('croissance', CROISSANCES),
                           ('lumiere_mini', LUMIERES), ('lumiere_maxi', LUMIERES)):
        if values.get(field) is not None and values[field] not in allowed:
            errors.append(f'{field} inconnu : {values[field]!r}')
    if values.get('co2') is not None and values['co2'] not in CO2:
        errors.append(f"co2 inconnu : {values['co2']!r}")
    if values.get('uicn') is not None and values['uicn'] not in UICN:
        errors.append(f"uicn inconnu : {values['uicn']!r}")
    for field in ('pays', 'introduits'):
        codes = values.get(field, [])
        if not isinstance(codes, list) or not all(isinstance(c, str) and ISO3.match(c) for c in codes):
            errors.append(f'{field} : liste de codes ISO alpha-3 attendue')
    if values.get('lumiere_mini') in LUMIERES and values.get('lumiere_maxi') in LUMIERES \
            and LUMIERES.index(values['lumiere_mini']) > LUMIERES.index(values['lumiere_maxi']):
        errors.append('lumiere : minimum supérieur au maximum')

    for field, low, high in RANGES:
        mini, maxi = values.get(f'{field}_mini'), values.get(f'{field}_maxi')
        if (mini is None) != (maxi is None):
            errors.append(f'{field} : minimum et maximum vont ensemble')
        elif mini is not None and not low <= mini <= maxi <= high:
            errors.append(f'{field} : plage {mini}–{maxi} invalide (attendu entre {low} et {high})')
    if values.get('temp_opti_mini') is not None and values.get('temp_mini') is not None \
            and not values['temp_mini'] <= values['temp_opti_mini'] <= values['temp_opti_maxi'] <= values['temp_maxi']:
        errors.append('temp_opti : plage optimale hors des températures supportées')

    images = values.get('images')
    if not isinstance(images, list) or not images:
        errors.append('images : au moins une photo attendue')
    elif not all(isinstance(i, dict) and i.get('fichier') and i.get('auteur') and i.get('licence')
                 and str(i.get('source', '')).startswith('https://') for i in images):
        errors.append('images : chaque photo doit avoir un fichier, un auteur, une licence et une source https')
    sources = values.get('sources')
    if not sources or not all(s.get('nom') and str(s.get('url', '')).startswith('https://') for s in sources):
        errors.append('sources : au moins une source, chacune avec un nom et une url https')
    return errors


def load_plants(directory: Path = PLANTS_DIR, sources_file: Path = SOURCES_FILE,
                occurrences: dict | None = None) -> dict[str, dict]:
    """ Plantes indexées par nom scientifique ; lève ValueError si une plante est invalide """
    collected = json.loads(sources_file.read_text(encoding='utf-8')) if sources_file.exists() else {}
    occurrences = load_occurrences() if occurrences is None else occurrences
    plants = {}
    for path in sorted(directory.glob('*.json')):
        fiche = json.loads(path.read_text(encoding='utf-8'))
        values = merge(fiche, collected.get(path.stem, {}), occurrences.get(fiche['nom_scientifique']))
        if errors := validate(values):
            raise ValueError(f'{path.name} : ' + ', '.join(errors))
        if values['nom_scientifique'] in plants:
            raise ValueError(f"{path.name} : plante en double ({values['nom_scientifique']})")
        plants[values['nom_scientifique']] = values
    return plants


def upsert_plants(db: Session, plants: dict[str, dict]) -> None:
    """ Crée ou met à jour chaque plante (même id d'un chargement à l'autre) et retire celles sans fiche """
    existing = {p.nom_scientifique: p for p in db.scalars(select(Plante))}
    for name, values in plants.items():
        if name in existing:
            for key, value in values.items():
                setattr(existing[name], key, value)
        else:
            db.add(Plante(**values))
    db.execute(delete(Plante).where(Plante.nom_scientifique.not_in(list(plants))))


if __name__ == '__main__':
    from config import DSN
    from models.meta import create_schema, get_engine

    engine = get_engine(DSN)
    for column in create_schema(engine):
        print('Colonne ajoutée :', column)
    with Session(engine) as session:
        loaded = load_plants()
        upsert_plants(session, loaded)
        session.commit()
    print(f'{len(loaded)} plantes chargées.')

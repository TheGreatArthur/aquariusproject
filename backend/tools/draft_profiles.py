"""
Crée le brouillon de fiche `data/profiles/<espèce>.json` des poissons qui n'en ont pas encore

Les champs factuels sont pré-remplis depuis les sources collectées par `tools/fetch_sources.py` : nom valide,
auteur, classification et statut UICN (FishBase), pays d'origine (FishBase, statut indigène ou endémique) et
liens vers les sources. Les textes (présentation, habitat, comportement, répartition) restent à rédiger ;
une fiche existante n'est jamais écrasée.

Usage : venv/bin/python -m tools.draft_profiles [nom scientifique ...]
"""

import json
import sys

from sqlalchemy import select
from sqlalchemy.orm import Session

from config import DSN
from models import Poisson
from models.meta import get_engine
from profiles import PROFILES_DIR
from tools.fetch_sources import CACHE_DIR, GBIF_SPECIES_RANKS, slug


def draft(nom_scientifique: str, sources: dict) -> dict:
    fb, sf, gbif = sources.get('fishbase'), sources.get('seriouslyfish'), sources.get('gbif') or {}
    profile = dict(
        nom_scientifique=nom_scientifique,
        nom_valide=None,
        auteur=None,
        classification=None,
        uicn=None,
        repartition='',
        pays=[],
        presentation='',
        habitat='',
        comportement='',
        sources=[],
    )
    if fb:
        if fb['valid_name'] != sources['lookup']:
            profile['nom_valide'] = fb['valid_name']
        if fb['author']:
            profile['auteur'] = f"({fb['author']})" if fb['author_in_parentheses'] else fb['author']
        if fb['family']:
            profile['classification'] = ' › '.join(filter(None, (fb['order'], fb['family'])))
        profile['uicn'] = fb['iucn_code']
        profile['pays'] = sorted({c['iso3'] for c in fb['countries'] if c['status'] in ('native', 'endemic')})
        profile['sources'].append({'nom': 'FishBase', 'url': fb['url']})
    if sf:
        profile['sources'].append({'nom': 'Seriously Fish', 'url': sf['url']})
    if gbif.get('rank') in GBIF_SPECIES_RANKS and (key := gbif.get('acceptedUsageKey') or gbif.get('usageKey')):
        profile['sources'].append({'nom': 'GBIF', 'url': f'https://www.gbif.org/species/{key}'})
    return profile


def main(names: list[str]) -> None:
    if not names:
        with Session(get_engine(DSN)) as db:
            names = list(db.scalars(select(Poisson.nom_scientifique).order_by(Poisson.id)))

    PROFILES_DIR.mkdir(parents=True, exist_ok=True)
    for name in names:
        path = PROFILES_DIR / f'{slug(name)}.json'
        cache = CACHE_DIR / 'parsed' / f'{slug(name)}.json'
        if path.exists():
            continue
        if not cache.exists():
            print(f'{name} : sources absentes, lancer tools.fetch_sources d\'abord')
            continue
        profile = draft(name, json.loads(cache.read_text(encoding='utf-8')))
        path.write_text(json.dumps(profile, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('Brouillon créé :', path.name)


if __name__ == '__main__':
    main(sys.argv[1:])

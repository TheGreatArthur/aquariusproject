"""
Compare les valeurs de la base (après corrections) aux sources collectées par `tools/fetch_sources.py`

Pour chaque poisson : famille, région, taille, température, pH et dureté (GH) face à FishBase et Seriously Fish.
Une valeur est signalée quand elle sort nettement des plages publiées (marges ci-dessous), pas au moindre écart :
les plages de la base sont des recommandations d'aquarium, plus étroites que les extrêmes observés en nature.

Usage : venv/bin/python -m tools.compare_sources > .cache/sources/comparaison.md
"""

import json
import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from config import DSN
from models import Poisson
from models.meta import get_engine
from tools.fetch_sources import CACHE_DIR, slug

MARGIN = {'temp': 2, 'ph': 0.5, 'gh': 4}
NUM = r'(\d+(?:\.\d+)?|\?)'

CONTINENTS = {
    'South America': 'Amérique du Sud', 'Asia': 'Asie', 'Africa': 'Afrique', 'Oceania': 'Océanie',
    'North America': 'Amérique du Nord', 'Central America': 'Amérique centrale', 'Europe': 'Europe',
}


def _range(text: str | None, pattern: str) -> tuple[float, float] | None:
    if not text or not (m := re.search(pattern, text)):
        return None
    low, high = m.group(1), m.group(2)
    if low == '?' or high == '?':
        return None
    return float(low), float(high)


def fishbase_values(fb: dict) -> dict:
    ecology = fb.get('ecology')
    size = re.search(r'Max length : ([\d.]+) cm (SL|TL)', fb.get('size') or '')
    return dict(
        famille=fb.get('family'),
        ph=_range(ecology, rf'pH range: {NUM} - {NUM}'),
        gh=_range(ecology, rf'dH range: {NUM} - {NUM}'),
        temp=_range(ecology, r'(\d+)°C - (\d+)°C'),
        taille=(float(size.group(1)), size.group(2)) if size else None,
        continents=sorted({CONTINENTS.get(c['continent'], c['continent'])
                           for c in fb.get('countries', []) if c['status'] in ('native', 'endemic')}),
    )


def seriouslyfish_values(sf: dict) -> dict:
    facts = sf.get('facts', {})
    length = re.search(r'([\d.]+)\s*mm', facts.get('Length', ''))
    dash = r'([\d.]+)\s*[–-]\s*([\d.]+)'
    return dict(
        ph=_range(facts.get('pH'), dash),
        gh=_range(facts.get('Hardness'), dash),
        temp=_range(facts.get('Temp'), dash),
        taille=(float(length.group(1)) / 10, 'SL') if length else None,
    )


def check(p: Poisson, fb: dict, sf: dict) -> list[str]:
    issues = []
    for field, low, high in (('temp', p.temp_mini, p.temp_maxi), ('ph', p.ph_mini, p.ph_maxi),
                             ('gh', p.gh_mini, p.gh_maxi)):
        ranges = [r for r in (fb.get(field), sf.get(field)) if r]
        if not ranges:
            continue
        src_low, src_high = min(r[0] for r in ranges), max(r[1] for r in ranges)
        if low < src_low - MARGIN[field] or high > src_high + MARGIN[field] or low > src_high or high < src_low:
            issues.append(f'{field} {low}–{high} vs sources {src_low}–{src_high}')

    sizes = [s for s in (fb.get('taille'), sf.get('taille')) if s]
    if sizes:
        longest = max(v * (1.25 if kind == 'SL' else 1) for v, kind in sizes)  # longueur totale approchée
        if p.taille > longest * 1.4 or p.taille < longest * 0.6:
            issues.append(f'taille {p.taille} cm vs sources ~{longest:.1f} cm (LT)')

    family = fb.get('famille')
    if family and not p.famille.nom.lower().startswith(family.lower()[:8]):
        issues.append(f'famille {p.famille.nom} vs FishBase {family}')

    continents = fb.get('continents')
    if continents and p.zone_geo.nom not in continents:
        issues.append(f'zone {p.zone_geo.nom} vs FishBase {", ".join(continents)}')
    return issues


def main() -> None:
    print('| # | Poisson | Écarts |\n|---|---|---|')
    with Session(get_engine(DSN)) as db:
        for p in db.scalars(select(Poisson).order_by(Poisson.id)):
            path = CACHE_DIR / 'parsed' / f'{slug(p.nom_scientifique)}.json'
            data = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}
            fb = fishbase_values(data['fishbase']) if data.get('fishbase') else {}
            sf = seriouslyfish_values(data['seriouslyfish']) if data.get('seriouslyfish') else {}
            missing = [n for n, v in (('FishBase', fb), ('Seriously Fish', sf)) if not v]
            issues = check(p, fb, sf) + ([f'absent de {", ".join(missing)}'] if missing else [])
            if issues:
                print(f'| {p.id} | {p.nom_commun} (*{p.nom_scientifique}*) | {"<br>".join(issues)} |')


if __name__ == '__main__':
    main()

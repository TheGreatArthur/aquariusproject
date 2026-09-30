"""
Collecte des sources de référence pour chaque poisson de la base : GBIF, FishBase, Seriously Fish

Les pages sont mises en cache dans `.cache/sources/` (non versionné) et un résumé structuré par espèce
est écrit dans `.cache/sources/parsed/<espèce>.json`. Ces résumés servent à vérifier les valeurs de la base
(`tools/compare_sources.py`) et à rédiger les fiches de `data/profiles/` ; le texte des sources n'est
jamais recopié dans le dépôt.

Usage : venv/bin/python -m tools.fetch_sources [nom scientifique ...]
"""

import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.orm import Session

from config import DSN
from models import Poisson
from models.meta import get_engine

CACHE_DIR = Path(__file__).resolve().parent.parent / '.cache' / 'sources'
USER_AGENT = 'aquarius-data-check/1.0 (https://github.com/TheGreatArthur/aquariusproject)'
DELAY = 1.0  # secondes entre deux requêtes vers un même site

# Nom à chercher dans les sources quand celui de la base n'est pas un binôme valide
LOOKUP_NAMES = {
    'Danio rerio var. frankei': 'Danio rerio',
    'Placidochromis Electra': 'Placidochromis electra',
    'Laetacara Fulvipinnis': 'Laetacara fulvipinnis',
    'Badis': 'Badis badis',
    'Celestichthys erythromicron': 'Danio erythromicron',
}

# Fiches Seriously Fish publiées sous un autre nom que celui de la base
SERIOUSLYFISH_SLUGS = {
    'Astyanax jordani': 'astyanax-mexicanus',
    'Celestichthys erythromicron': 'celestichthys-erythromicron',
    'Fundulopanchax gardneri': 'fundulopanchax-gardneri-gardneri',
    'Rineloricaria sp. Red': 'rineloricaria-sp',
}

_last_call: dict[str, float] = {}


def slug(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def fetch(url: str, cache_name: str) -> tuple[int, str]:
    """ GET avec cache disque et délai de politesse ; renvoie (code HTTP, contenu) """
    path = CACHE_DIR / 'raw' / cache_name
    if path.exists():
        status, _, body = path.read_text(encoding='utf-8').partition('\n')
        return int(status), body

    host = urllib.parse.urlparse(url).netloc
    wait = DELAY - (time.monotonic() - _last_call.get(host, 0))
    if wait > 0:
        time.sleep(wait)
    _last_call[host] = time.monotonic()

    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            status, body = response.status, response.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        status, body = e.code, ''

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f'{status}\n{body}', encoding='utf-8')
    return status, body


def to_text(markup: str) -> str:
    markup = re.sub(r'(?is)<(script|style).*?</\1>', ' ', markup)
    text = html.unescape(re.sub(r'(?s)<[^>]+>', ' ', markup))
    return re.sub(r'\s+', ' ', text).strip()


def between(text: str, start: str, end: str) -> str | None:
    i = text.find(start)
    if i < 0:
        return None
    i += len(start)
    j = text.find(end, i)
    return text[i:j if j >= 0 else None].strip() or None


# --- GBIF -------------------------------------------------------------------------------------------

def gbif_match(name: str) -> dict:
    query = urllib.parse.urlencode({'name': name, 'kingdom': 'Animalia', 'verbose': 'false'})
    _, body = fetch(f'https://api.gbif.org/v1/species/match?{query}', f'gbif-match-{slug(name)}.json')
    data = json.loads(body or '{}')
    keys = ('usageKey', 'acceptedUsageKey', 'scientificName', 'canonicalName', 'status', 'matchType', 'rank',
            'family', 'order', 'speciesKey')
    return {k: data.get(k) for k in keys}


# --- FishBase ---------------------------------------------------------------------------------------

def fishbase(name: str) -> dict | None:
    url = f'https://www.fishbase.se/summary/{name.replace(" ", "-")}.html'
    status, body = fetch(url, f'fishbase-{slug(name)}.html')
    if status != 200 or 'Max length' not in body and 'Ecology' not in body:
        return None

    title = re.search(r'<title>([^<]*)', body)
    text = to_text(body)
    spec = re.search(r'CountryList\.php\?ID=(\d+)', body)
    classification = re.search(r'Classification - (?:([A-Z][a-z]+inae) )?([A-Z][a-z]+idae) ([A-Z][a-z]+formes)', text)
    # FishBase renvoie vers le nom valide quand on demande un synonyme : c'est le début du titre
    valid_name = re.split(r'\s*[,:]', title.group(1).strip())[0].strip() if title else name
    author = re.search(rf'Animalia {re.escape(valid_name)} (\( )?([A-Z][^()]*? , \d{{4}})', text)

    out = dict(
        url=url,
        title=title.group(1).strip() if title else None,
        valid_name=valid_name,
        spec_code=int(spec.group(1)) if spec else None,
        order=classification.group(3) if classification else None,
        family=classification.group(2) if classification else None,
        subfamily=classification.group(1) if classification else None,
        author=author.group(2).replace(' ,', ',') if author else None,
        author_in_parentheses=bool(author and author.group(1)),
        ecology=between(text, 'distribution range Ecology', 'Distribution Territories'),
        distribution=between(text, 'Faunafri', 'Size / Weight / Age'),
        size=between(text, 'Size / Weight / Age', 'Biology'),
        biology=between(text, '(e.g. epibenthic)', 'Life cycle and mating behavior'),
        iucn=between(text, 'IUCN Red List Status', 'CITES'),
        countries=[],
    )
    iucn = re.search(r'\((EX|EW|CR|EN|VU|NT|LC|DD)\)', out['iucn'] or '')
    out['iucn_code'] = iucn.group(1) if iucn else 'NE'
    if out['spec_code']:
        out['countries'] = fishbase_countries(out['spec_code'], name)
    return out


def fishbase_countries(spec_code: int, name: str) -> list[dict]:
    _, body = fetch(f'https://www.fishbase.se/Country/{spec_code}', f'fishbase-countries-{slug(name)}.html')
    rows = []
    for tr in BeautifulSoup(body, 'html.parser').select('table tr'):
        cells = [td.get_text(' ', strip=True) for td in tr.find_all('td')]
        if len(cells) >= 4:
            row = dict(continent=cells[0], country=cells[1], iso3=cells[2], status=cells[3])
            if row not in rows:
                rows.append(row)
    return rows


# --- Seriously Fish ---------------------------------------------------------------------------------

SF_SECTIONS = ('etymology', 'distribution', 'habitat', 'maintenance', 'water-conditions-notes', 'diet',
               'behaviour', 'dimorphism', 'reproduction', 'notes')


def seriouslyfish(name: str) -> dict | None:
    page = SERIOUSLYFISH_SLUGS.get(name, slug(name))
    url = f'https://www.seriouslyfish.com/species/{page}/'
    status, body = fetch(url, f'seriouslyfish-{page}.html')
    if status != 200 or 'Quick facts' not in body:
        return None

    soup = BeautifulSoup(body, 'html.parser')
    facts = {}
    for cell in soup.select('[class*="_cell_"]'):
        key, value = cell.select_one('[class*="_key_"]'), cell.select_one('[class*="_value_"]')
        if key and value:
            metric = value.select_one('.unit-metric') or value
            facts.setdefault(key.get_text(strip=True), metric.get_text(' ', strip=True))

    sections = {}
    for section_id in SF_SECTIONS:
        section = soup.find('section', id=section_id)
        if section:
            if section.h2:
                section.h2.decompose()
            for aside in section.find_all('aside'):
                aside.decompose()
            sections[section_id] = re.sub(r'\s+', ' ', section.get_text(' ', strip=True))

    h1 = soup.find('h1')
    return dict(url=url, name=h1.get_text(' ', strip=True) if h1 else None, facts=facts, sections=sections)


# --- Collecte ---------------------------------------------------------------------------------------

def collect(nom_scientifique: str) -> dict:
    lookup = LOOKUP_NAMES.get(nom_scientifique, nom_scientifique)
    gbif = gbif_match(lookup)
    candidates = [lookup]
    accepted = gbif.get('canonicalName')
    if accepted and accepted not in candidates:
        candidates.append(accepted)

    fb = next((r for n in candidates if (r := fishbase(n))), None)
    sf = next((r for n in [nom_scientifique, *candidates] if (r := seriouslyfish(n))), None)
    return dict(nom_scientifique=nom_scientifique, lookup=lookup, gbif=gbif, fishbase=fb, seriouslyfish=sf)


def main(names: list[str]) -> None:
    if not names:
        with Session(get_engine(DSN)) as db:
            names = list(db.scalars(select(Poisson.nom_scientifique).order_by(Poisson.id)))

    out_dir = CACHE_DIR / 'parsed'
    out_dir.mkdir(parents=True, exist_ok=True)
    for name in names:
        result = collect(name)
        (out_dir / f'{slug(name)}.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'{name:40} FishBase: {"oui" if result["fishbase"] else "NON":4} '
              f'Seriously Fish: {"oui" if result["seriouslyfish"] else "NON":4} GBIF: {result["gbif"].get("status")}')


if __name__ == '__main__':
    main(sys.argv[1:])

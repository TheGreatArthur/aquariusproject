"""
Photos Wikimedia Commons des poissons décrits par fichier (`data/fish/<espèce>.json`) et des poissons du classeur
(`data/workbook_photos.json` : titres Commons par espèce, sous le slug du nom scientifique)

- `--candidats [espèce...]` : liste les photos libres des catégories Commons de chaque espèce (nom du catalogue,
  nom valide de FishBase et de GBIF), les plus prometteuses d'abord, dans `.cache/commons/candidats/`, pour
  choisir à l'œil les photos à mettre dans le champ `photos` de la fiche (vérifier l'espèce sur la photo :
  les catégories de Commons contiennent parfois des erreurs d'identification) ;
- sans option : télécharge les photos listées par chaque fiche dans `frontend/public/images/` (<espèce>-1.jpg,
  -2.jpg...) et écrit leurs auteurs et licences dans `data/fish_photos.json`, lu par `fish_data.py`.

Usage : venv/bin/python -m tools.fetch_fish_photos [--candidats] [espèce ...]   (noms de fichiers sans .json)
"""

import json
import sys
from pathlib import Path

from fish_data import DATA_DIR, FISH_DIR, PHOTOS_FILE
from tools.commons import candidates, download_photos
from tools.fetch_sources import CACHE_DIR, GBIF_SPECIES_RANKS, SERIOUSLYFISH_SLUGS, slug

IMAGES_DIR = Path(__file__).resolve().parents[2] / 'frontend' / 'public' / 'images'
CANDIDATES_DIR = CACHE_DIR.parent / 'commons' / 'candidats'
WORKBOOK_PHOTOS = DATA_DIR / 'workbook_photos.json'


def photo_lists() -> dict[str, list[str]]:
    """ Titres Commons à télécharger par espèce : poissons décrits par fichier, puis poissons du classeur """
    lists = {path.stem: json.loads(path.read_text(encoding='utf-8')).get('photos', [])
             for path in sorted(FISH_DIR.glob('*.json'))}
    if WORKBOOK_PHOTOS.exists():
        lists.update(json.loads(WORKBOOK_PHOTOS.read_text(encoding='utf-8')))
    return lists


def categories(name: str) -> list[str]:
    """ Noms sous lesquels Commons peut classer l'espèce : nom du catalogue, noms valides, puis l'ancien nom
    sous lequel Seriously Fish la décrit (Pseudotropheus demasoni pour Chindongo demasoni) """
    names = [name]
    parsed = CACHE_DIR / 'parsed' / f'{slug(name)}.json'
    if parsed.exists():
        sources = json.loads(parsed.read_text(encoding='utf-8'))
        gbif = sources.get('gbif') or {}
        names.append((sources.get('fishbase') or {}).get('valid_name'))
        if gbif.get('rank') in GBIF_SPECIES_RANKS:
            names.append(gbif.get('canonicalName'))
    if name in SERIOUSLYFISH_SLUGS:
        names.append(SERIOUSLYFISH_SLUGS[name].replace('-', ' ').capitalize())
    return list(dict.fromkeys(n for n in names if n))


def list_candidates(stems: list[str]) -> None:
    CANDIDATES_DIR.mkdir(parents=True, exist_ok=True)
    for stem in stems:
        fish = json.loads((FISH_DIR / f'{stem}.json').read_text(encoding='utf-8'))
        found = candidates(categories(fish['nom_scientifique']))
        (CANDIDATES_DIR / f'{stem}.json').write_text(json.dumps(found, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'{stem} : {len(found)} photo(s) libre(s)')


def download(stems: list[str]) -> int:
    credits = json.loads(PHOTOS_FILE.read_text(encoding='utf-8')) if PHOTOS_FILE.exists() else {}
    failed = 0
    for stem, titles in photo_lists().items():
        if stems and stem not in stems:
            continue
        credits[stem], errors = download_photos(stem, titles, IMAGES_DIR, credits.get(stem, []))
        for error in errors:
            print(f'  ! {stem} : {error}')
        failed += bool(errors)
        # Écrit après chaque poisson : une interruption ne fait pas retélécharger les photos déjà enregistrées
        write_credits(credits)
    credits = write_credits(credits)
    print(f'{sum(len(c) for c in credits.values())} photos pour {len(credits)} poissons.')
    return 1 if failed else 0


def write_credits(credits: dict[str, list[dict]]) -> dict[str, list[dict]]:
    # Les espèces retirées disparaissent aussi des crédits
    listed = photo_lists()
    credits = {k: credits[k] for k in sorted(credits) if k in listed}
    PHOTOS_FILE.write_text(json.dumps(credits, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return credits


def main(args: list[str]) -> int:
    stems = [a for a in args if not a.startswith('--')]
    if '--candidats' in args:
        list_candidates(stems or sorted(p.stem for p in FISH_DIR.glob('*.json')))
        return 0
    return download(stems)


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

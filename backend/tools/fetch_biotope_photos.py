"""
Photos Wikimedia Commons des biotopes (milieux naturels et bacs qui les reproduisent)

Lit les titres Commons choisis dans `frontend/content/biotopes/photos.json`, télécharge les photos dans
`frontend/public/biotopes/` (<biotope>-1.jpg... pour la nature, <biotope>-bac-1.jpg... pour les bacs) et écrit leurs
auteurs et licences dans `frontend/content/biotopes/credits.json`, lu par les pages des biotopes.

Usage : venv/bin/python -m tools.fetch_biotope_photos
"""

import json
import sys
from pathlib import Path

from tools.commons import download_photos

FRONTEND = Path(__file__).resolve().parents[2] / 'frontend'
PHOTOS_FILE = FRONTEND / 'content' / 'biotopes' / 'photos.json'
CREDITS_FILE = FRONTEND / 'content' / 'biotopes' / 'credits.json'
IMAGES_DIR = FRONTEND / 'public' / 'biotopes'


def main() -> int:
    photos = json.loads(PHOTOS_FILE.read_text(encoding='utf-8'))
    previous = json.loads(CREDITS_FILE.read_text(encoding='utf-8')) if CREDITS_FILE.exists() else {}
    credits, errors = {}, []
    for biotope, lists in photos.items():
        credits[biotope] = {}
        for kind, name in (('nature', biotope), ('bacs', f'{biotope}-bac')):
            found, failed = download_photos(name, lists.get(kind, []), IMAGES_DIR,
                                            previous.get(biotope, {}).get(kind, []))
            credits[biotope][kind] = found
            errors += failed
    CREDITS_FILE.write_text(json.dumps(credits, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for error in errors:
        print(error, file=sys.stderr)
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())

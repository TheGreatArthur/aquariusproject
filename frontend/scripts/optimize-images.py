"""
Réduit les photos de public/images et public/families : 2000 px au plus sur le grand côté, JPEG progressif
qualité 82, orientation EXIF appliquée et profil de couleur conservé.

next/image redimensionne déjà les photos à l'affichage, mais il doit d'abord décoder l'original : des JPEG
de 4 000 px et 5 Mo ralentissent le premier affichage de chaque photo et alourdissent le dépôt.
Un fichier n'est remplacé que s'il gagne au moins 20 %, si bien qu'un second passage ne change rien.
Les fichiers qui ne sont pas des JPEG RVB (PNG, transparence) sont laissés tels quels.

Usage (Pillow requis, installé par backend/requirements-dev.txt) :
    backend/venv/bin/python frontend/scripts/optimize-images.py [--dry-run]
"""

import io
import sys
from pathlib import Path

from PIL import Image, ImageOps

PUBLIC = Path(__file__).resolve().parent.parent / 'public'
FOLDERS = ('images', 'families')
MAX_SIDE = 2000
QUALITY = 82
MIN_GAIN = 0.2


def optimize(path: Path) -> bytes | None:
    """ Contenu optimisé de la photo, ou None si elle doit rester telle quelle """
    with Image.open(path) as im:
        if im.format != 'JPEG' or im.mode != 'RGB':
            return None
        icc = im.info.get('icc_profile')
        im = ImageOps.exif_transpose(im)
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        out = io.BytesIO()
        im.save(out, 'JPEG', quality=QUALITY, optimize=True, progressive=True, icc_profile=icc)
    data = out.getvalue()
    return data if len(data) <= (1 - MIN_GAIN) * path.stat().st_size else None


def main(dry_run: bool) -> None:
    before = after = changed = 0
    for folder in FOLDERS:
        for path in sorted((PUBLIC / folder).iterdir()):
            if path.suffix.lower() not in ('.jpg', '.jpeg'):
                continue
            size = path.stat().st_size
            data = optimize(path)
            before += size
            after += len(data) if data else size
            if data:
                changed += 1
                if not dry_run:
                    path.write_bytes(data)
    print(f'{changed} photos réduites : {before / 1e6:.1f} Mo → {after / 1e6:.1f} Mo'
          + (' (simulation)' if dry_run else ''))


if __name__ == '__main__':
    main('--dry-run' in sys.argv[1:])

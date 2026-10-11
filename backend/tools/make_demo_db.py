"""
Instantané de la base pour la démo en ligne : copie compactée de la base locale dans demo/aquarius.db.

L'API déployée (Vercel) n'a ni classeur ni config.py : elle lit ce fichier en lecture seule. À relancer après
`make import` dès que les données changent, puis à committer.

Usage : venv/bin/python -m tools.make_demo_db
"""

import sqlite3
import sys
from pathlib import Path

from config import DSN

BACKEND = Path(__file__).resolve().parent.parent
CIBLE = BACKEND / 'demo' / 'aquarius.db'
TABLES = ('poisson', 'profil', 'plante', 'invertebre', 'famille')


def main() -> None:
    if not DSN.startswith('sqlite:///'):
        sys.exit(f'La démo attend une base SQLite locale, pas {DSN}')
    source = Path(DSN.removeprefix('sqlite:///'))

    CIBLE.parent.mkdir(exist_ok=True)
    temporaire = CIBLE.with_suffix('.tmp')
    temporaire.unlink(missing_ok=True)
    with sqlite3.connect(source) as src, sqlite3.connect(temporaire) as dst:
        src.backup(dst)
    with sqlite3.connect(temporaire) as dst:
        dst.execute('VACUUM')
        comptes = {t: dst.execute(f'SELECT count(*) FROM {t}').fetchone()[0] for t in TABLES}
    if not all(comptes.values()):
        temporaire.unlink()
        sys.exit(f'Base incomplète, instantané non écrit : {comptes}. Lancez make import.')
    temporaire.replace(CIBLE)
    print(f'{CIBLE.relative_to(BACKEND)} : {CIBLE.stat().st_size / 1e6:.1f} Mo, {comptes}')


if __name__ == '__main__':
    main()

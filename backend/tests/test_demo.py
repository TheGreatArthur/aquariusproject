"""Démo en ligne : sans config.py, l'API sert l'instantané demo/aquarius.db en lecture seule."""

import os
import subprocess
import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

from app import DEMO_DB, DEMO_DSN

BACKEND = Path(__file__).resolve().parent.parent


def test_snapshot_is_versioned_and_filled():
    assert DEMO_DB.exists(), 'Lancez make demo-db'
    with create_engine(DEMO_DSN).connect() as connexion:
        for table in ('poisson', 'plante', 'invertebre'):
            assert connexion.execute(text(f'SELECT count(*) FROM {table}')).scalar() > 0, table


@pytest.mark.parametrize('table', ['poisson', 'plante', 'invertebre'])
def test_snapshot_common_names_are_unique(table):
    # Deux espèces du même nom ne se distinguent pas dans la liste du simulateur
    with create_engine(DEMO_DSN).connect() as connexion:
        doublons = connexion.execute(text(
            f'SELECT lower(nom_commun) FROM {table} GROUP BY lower(nom_commun) HAVING count(*) > 1')).scalars().all()
    assert doublons == []


def test_snapshot_is_read_only():
    with create_engine(DEMO_DSN).connect() as connexion, pytest.raises(OperationalError):
        connexion.execute(text('CREATE TABLE essai (x INTEGER)'))


def test_api_without_config_serves_the_snapshot():
    # Comme sur Vercel : config.py absent (gitignore) et pas de AQUARIUS_DSN
    code = (
        "import sys; sys.modules['config'] = None\n"
        "from app import app, DSN, DEMO_DSN\n"
        "assert DSN == DEMO_DSN, DSN\n"
        "r = app.test_client().get('/poissons?lang=en')\n"
        "print(r.status_code, len(r.get_json()['poissons']))\n"
    )
    env = {k: v for k, v in os.environ.items() if k != 'AQUARIUS_DSN'}
    resultat = subprocess.run([sys.executable, '-c', code], cwd=BACKEND, env=env, capture_output=True, text=True)
    assert resultat.returncode == 0, resultat.stderr
    statut, nombre = resultat.stdout.split()
    assert statut == '200' and int(nombre) > 0

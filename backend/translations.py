""" Species data in English and Japanese

The catalogues are written in French. `data/i18n/<lang>/<catalogue>.json` give, for each species (key: its scientific
name), its common name and its texts in another language. The API swaps them in when a request asks for that
language with `?lang=en` or `?lang=ja`; a field without a translation stays in French.
"""

import json
from functools import cache
from pathlib import Path

from flask import request

TRANSLATIONS_DIR = Path(__file__).resolve().parent / 'data' / 'i18n'
LANGUAGES = ('en', 'ja')
CATALOGUES = ('fish', 'invertebrates', 'plants')


@cache
def load(lang: str, catalogue: str) -> dict[str, dict]:
    """ Translations of a catalogue: {scientific name: {field: text, 'profil': {field: text}}} """
    path = TRANSLATIONS_DIR / lang / f'{catalogue}.json'
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}


def language() -> str | None:
    """ Language asked by the request, None for French or an unknown language """
    lang = request.args.get('lang')
    return lang if lang in LANGUAGES else None


def translate(item: dict, catalogue: str, lang: str | None) -> dict:
    """ Species with its common name and texts in `lang` (French fields kept where no translation exists) """
    entry = load(lang, catalogue).get(item.get('nom_scientifique')) if lang else None
    if not entry:
        return item
    out = {**item, **{k: v for k, v in entry.items() if k != 'profil' and k in item}}
    if entry.get('profil') and item.get('profil'):
        out['profil'] = {**item['profil'], **{k: v for k, v in entry['profil'].items() if k in item['profil']}}
    return out

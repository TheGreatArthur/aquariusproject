""" Outils d'ajout de poissons par fichier : brouillon, règles du classeur et photos Commons, sans accès réseau """

import json

import pytest

import tools.commons as commons
import tools.fetch_fish_photos as ffp
import tools.fetch_sources as fs
from tools.draft_fish import draft, family_for, litres_for, nice, points_for, suggest_group, suggest_mode, zone_for

SOURCES = dict(
    nom_scientifique='Maylandia zebra',
    seriouslyfish=dict(
        url='https://www.seriouslyfish.com/species/maylandia-zebra/',
        facts={'Length': '♂ 152 · ♀ 120 mm SL', 'Temp': '22–28 °C', 'pH': '7.6–8.6', 'Hardness': '10–25 dGH',
               'Volume': '~205 litres'},
        sections={'behaviour': 'Keep a harem of one male to three females.', 'diet': 'Spirulina and algae.',
                  'habitat': 'Rocky zones of the lake.'},
    ),
    fishbase=dict(
        url='https://www.fishbase.se/summary/Maylandia-zebra.html', family='Cichlidae', order='Cichliformes',
        ecology='Freshwater; pH range: 8.0 - 8.0; dH range: 9 - 19; Tropical; 22°C - 28°C',
        size='Max length : 11.3 cm SL male/unsexed',
        countries=[{'continent': 'Africa', 'iso3': 'MWI', 'status': 'endemic'}],
    ),
)


def test_draft_applies_the_workbook_rules():
    fish = draft(SOURCES)

    assert (fish['famille'], fish['genre'], fish['zone_geo']) == ('Cichlidae africain', 'Maylandia', 'Afrique')
    assert (fish['ph_mini'], fish['ph_maxi'], fish['gh_mini'], fish['gh_maxi']) == (7.6, 8.6, 10, 25)
    assert (fish['temp_mini'], fish['temp_maxi']) == (22, 28)
    # Seriously Fish donne une longueur par sexe : on garde la plus grande
    assert fish['taille'] == 15.0
    # Volume Seriously Fish × 1,25, arrondi à 50 L au-delà de 200 L
    assert fish['litrage_mini'] == 250
    assert (fish['mode_vie'], fish['nb_individus'], fish['points']) == ('harem', 4, 20)
    assert fish['regime'] == 'herbivore'
    assert fish['nom_commun'] == fish['robustesse'] == fish['dispo'] == ''
    assert [s['nom'] for s in fish['sources']] == ['Seriously Fish', 'FishBase']


def test_draft_falls_back_on_fishbase_total_length():
    sources = {**SOURCES, 'seriouslyfish': None,
               'fishbase': {**SOURCES['fishbase'], 'size': 'Max length : 20.0 cm TL male/unsexed'}}

    fish = draft(sources)

    # Longueur totale ramenée à une longueur standard, volume pris dans la médiane du classeur
    assert fish['taille'] == 17.0
    assert fish['litrage_mini'] == litres_for(17.0) == 300


@pytest.mark.parametrize('value, expected', [(84, 80), (5, 10), (256, 250), (1130, 1150)])
def test_nice_rounds_volumes(value, expected):
    assert nice(value) == expected


@pytest.mark.parametrize('taille, points', [(2.5, 2), (6, 5), (7, 10), (15, 20), (59, 100), (130, 250)])
def test_points_follow_the_size(taille, points):
    assert points_for(taille) == points


def test_very_large_fish_need_a_public_aquarium():
    assert litres_for(130) == 5000


def test_zone_and_cichlid_family():
    mexico = [{'continent': 'North America', 'iso3': 'MEX', 'status': 'native'},
              {'continent': 'North America', 'iso3': 'GTM', 'status': 'native'},
              {'continent': 'North America', 'iso3': 'USA', 'status': 'introduced'}]

    assert zone_for(mexico) == 'Amérique centrale'
    assert family_for('Cichlidae', 'Amérique centrale') == 'Cichlidae américain'
    assert family_for('Acestrorhamphidae', 'Amérique du Sud') == 'Characidae'


def test_group_and_mode_suggestions():
    text = 'A schooling species, buy a group of at least 8-10 specimens.'

    assert (suggest_mode(text), suggest_group(text)) == ('banc', 8)
    assert suggest_mode('Best kept as a mated pair.') == 'couple'


def test_gbif_match_retries_with_the_fish_class(monkeypatch):
    calls = []

    def fetch(url, cache_name):
        calls.append(cache_name)
        if 'class=Actinopterygii' in url:
            return 200, json.dumps({'usageKey': 5788257, 'canonicalName': 'Trichogaster fasciata', 'rank': 'SPECIES'})
        return 200, json.dumps({'usageKey': 1, 'canonicalName': 'Animalia', 'rank': 'KINGDOM'})

    monkeypatch.setattr(fs, 'fetch', fetch)

    match = fs.gbif_match('Trichogaster fasciata')

    assert (match['usageKey'], match['rank']) == (5788257, 'SPECIES')
    assert calls == ['gbif-match-trichogaster-fasciata.json', 'gbif-match-trichogaster-fasciata-fish.json']


def test_photo_categories_use_valid_and_former_names(tmp_path, monkeypatch):
    parsed = tmp_path / 'parsed'
    parsed.mkdir()
    (parsed / 'chindongo-demasoni.json').write_text(json.dumps({
        'fishbase': {'valid_name': 'Chindongo demasoni'},
        'gbif': {'canonicalName': 'Animalia', 'rank': 'KINGDOM'},
    }), encoding='utf-8')
    monkeypatch.setattr(ffp, 'CACHE_DIR', tmp_path)

    # Le règne renvoyé par une correspondance GBIF ratée n'est pas une catégorie Commons à explorer
    assert ffp.categories('Chindongo demasoni') == ['Chindongo demasoni', 'Pseudotropheus demasoni']


def test_candidates_keep_free_photos_and_rank_aquarium_shots(monkeypatch):
    infos = [
        dict(titre='File:Zebra in a lake.jpg', description='', largeur=3000, hauteur=2000, mime='image/jpeg',
             licence='CC BY-SA 4.0', auteur='A'),
        dict(titre='File:Zebra aquarium.jpg', description='', largeur=2000, hauteur=1500, mime='image/jpeg',
             licence='CC BY 2.0', auteur='B'),
        dict(titre='File:Zebra copyright.jpg', description='', largeur=4000, hauteur=3000, mime='image/jpeg',
             licence='All rights reserved', auteur='C'),
        dict(titre='File:Zebra small.jpg', description='', largeur=320, hauteur=200, mime='image/jpeg',
             licence='CC0', auteur='D'),
        dict(titre='File:Zebra drawing.png', description='', largeur=2000, hauteur=1000, mime='image/png',
             licence='Public domain', auteur='E'),
    ]
    monkeypatch.setattr(commons, 'category_files', lambda category: [i['titre'] for i in infos])
    monkeypatch.setattr(commons, 'infos', lambda titles: [i for i in infos if i['titre'] in titles])

    found = commons.candidates(['Maylandia zebra'])

    assert [f['titre'] for f in found] == ['File:Zebra aquarium.jpg', 'File:Zebra in a lake.jpg']

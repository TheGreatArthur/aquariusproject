import json
from pathlib import Path

import pytest
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from models import Base, Plante
from plants import load_plants, merge, upsert_plants, validate
from tools.fetch_plants import FREE_LICENCE, PHOTOS_DIR, WORLD_MAP

FICHE = dict(
    nom_scientifique='Anubias barteri var. nana',
    nom_commun='Anubias nain',
    origine='Cameroun',
    presentation='Variété naine.',
    culture='Sur une racine.',
    sources=[{'nom': 'Wikipédia', 'url': 'https://fr.wikipedia.org/wiki/Anubias'}],
)

COLLECTED = dict(
    flowgrow=dict(url='https://www.flowgrow.de/db/aquaticplants/anubias-barteri-var-nana', ph_mini=5, ph_maxi=8,
                  kh_mini=0, kh_maxi=21, temp_mini=12, temp_maxi=30, temp_opti_mini=22, temp_opti_maxi=26,
                  hauteur_mini=5, hauteur_maxi=10, lumiere_mini='faible', lumiere_maxi='forte',
                  difficulte='très facile', croissance='lente', positions=['sur le décor'], usages=[],
                  multiplication=['division du rhizome'], type='épiphyte', emergee=True, famille='Araceae',
                  ordre='Alismatales'),
    tropica=dict(url='https://tropica.com/en/plants/plantdetails/x/1', hauteur_mini=5, hauteur_maxi=15, co2='faible'),
    gbif=dict(url='https://www.gbif.org/species/2871878', auteur='(Engl.) Crusio', famille='Araceae',
              ordre='Alismatales'),
    photos=[dict(fichier='anubias-1.jpg', auteur='M. Linnenbach', licence='CC BY-SA 4.0',
                 licence_url='https://creativecommons.org/licenses/by-sa/4.0',
                 source='https://commons.wikimedia.org/wiki/File:Zwerg-Speerblatt.jpg')],
)


def test_merge_combines_the_sources():
    values = merge(FICHE, COLLECTED)

    assert validate(values) == []
    assert (values['ph_mini'], values['ph_maxi'], values['difficulte']) == (5, 8, 'très facile')
    # Hauteur en aquarium de Tropica plutôt que celle de Flowgrow, besoin en CO2 de Tropica
    assert (values['hauteur_mini'], values['hauteur_maxi'], values['co2']) == (5, 15, 'faible')
    assert values['auteur'] == '(Engl.) Crusio' and values['nom_valide'] is None
    assert [s['nom'] for s in values['sources']] == ['Flowgrow', 'Tropica', 'GBIF', 'Wikipédia']
    # Sans aire collectée ni points, la carte n'a rien à montrer
    assert (values['pays'], values['introduits'], values['points'], values['uicn']) == ([], [], [], None)


def test_merge_adds_the_native_range_and_the_map_points():
    aire = dict(source='POWO', url='https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:85520-1',
                natif=['CMR', 'NGA'], introduit=['USA'])
    values = merge(FICHE, {**COLLECTED, 'aire': aire, 'gbif': {**COLLECTED['gbif'], 'uicn': 'LC'}}, [[9.5, 4.1]])

    assert validate(values) == []
    assert (values['pays'], values['introduits'], values['uicn']) == (['CMR', 'NGA'], ['USA'], 'LC')
    assert values['points'] == [[9.5, 4.1]]
    assert values['sources'][3] == {'nom': 'POWO (Kew)', 'url': aire['url']}
    assert values['taxon_aire'] is None


def test_range_of_the_species_is_named_for_a_variety():
    aire = dict(source='POWO', url='https://powo.science.kew.org/x', nom='Anubias barteri', natif=['CMR'], introduit=[])

    # L'Anubias nain n'a pas d'aire propre dans la WCVP : la carte montre celle de l'espèce, et la page le dit
    assert merge(FICHE, {**COLLECTED, 'aire': aire})['taxon_aire'] == 'Anubias barteri'
    assert merge({**FICHE, 'valeurs': {'pays': ['CMR']}}, {**COLLECTED, 'aire': aire})['taxon_aire'] is None


def test_moss_range_from_gbif_observations_is_not_a_source_page():
    values = merge(FICHE, {**COLLECTED, 'aire': dict(source='GBIF', url='https://www.gbif.org/species/1',
                                                     natif=['VNM'], introduit=[])})

    assert values['pays'] == ['VNM'] and 'POWO (Kew)' not in [s['nom'] for s in values['sources']]


def test_merge_prefers_gbif_taxonomy_and_falls_back_to_flowgrow():
    renamed = merge(FICHE, {**COLLECTED, 'gbif': {'famille': 'Hypnaceae', 'nom_valide': 'Ectropothecium barbieri'}})
    without_gbif = merge(FICHE, {**COLLECTED, 'gbif': {}})

    assert renamed['famille'] == 'Hypnaceae' and renamed['nom_valide'] == 'Ectropothecium barbieri'
    assert without_gbif['famille'] == 'Araceae' and without_gbif['ordre'] == 'Alismatales'


def test_merge_without_tropica_keeps_flowgrow_height():
    values = merge(FICHE, {**COLLECTED, 'tropica': {}})

    assert (values['hauteur_mini'], values['hauteur_maxi'], values['co2']) == (5, 10, None)


def test_fiche_values_complete_or_correct_the_collected_data():
    values = merge({**FICHE, 'valeurs': {'kh_mini': 2, 'co2': 'moyen'}}, COLLECTED)

    assert (values['kh_mini'], values['kh_maxi'], values['co2']) == (2, 21, 'moyen')


@pytest.mark.parametrize('change, error', [
    ({'culture': ' '}, 'culture vide'),
    ({'ph_mini': None, 'ph_maxi': None}, 'ph_mini manquant'),
    ({'ph_mini': 9}, 'ph : plage 9–8'),
    ({'kh_maxi': None}, 'kh : minimum et maximum'),
    ({'temp_opti_mini': 10}, 'temp_opti'),
    ({'type': 'arbre'}, "type inconnu : 'arbre'"),
    ({'lumiere_mini': 'forte', 'lumiere_maxi': 'faible'}, 'lumiere : minimum supérieur'),
    ({'co2': 'beaucoup'}, 'co2 inconnu'),
    ({'uicn': 'XX'}, 'uicn inconnu'),
    ({'pays': ['Cameroun']}, 'pays : liste de codes ISO'),
    ({'introduits': None}, 'introduits : liste de codes ISO'),
    ({'images': []}, 'images'),
    ({'images': [{'fichier': 'a.jpg', 'auteur': '', 'licence': 'CC0', 'source': 'https://x'}]}, 'images'),
    ({'sources': [{'nom': 'Flowgrow', 'url': 'http://flowgrow.de'}]}, 'sources'),
])
def test_invalid_plant(change, error):
    errors = validate({**merge(FICHE, COLLECTED), **change})

    assert any(e.startswith(error) for e in errors), errors


def test_load_rejects_an_invalid_fiche(tmp_path):
    (tmp_path / 'plante.json').write_text(json.dumps({**FICHE, 'culture': ''}), encoding='utf-8')
    sources = tmp_path / 'sources.json'
    sources.write_text(json.dumps({'plante': COLLECTED}), encoding='utf-8')

    with pytest.raises(ValueError, match='plante.json : culture vide'):
        load_plants(tmp_path, sources)


def test_versioned_plants_are_valid():
    plants = load_plants()

    assert len(plants) >= 10
    assert {p['type'] for p in plants.values()} >= {'épiphyte', 'mousse', 'rosette', 'tige', 'tapissante'}


def test_versioned_plants_have_three_free_photos_on_disk():
    for name, plant in load_plants().items():
        assert len(plant['images']) == 3, name
        for image in plant['images']:
            assert (PHOTOS_DIR / image['fichier']).exists(), image['fichier']
            assert FREE_LICENCE.match(image['licence']), image


def test_versioned_plants_have_a_native_range_on_the_world_map():
    topo = json.loads(WORLD_MAP.read_text(encoding='utf-8'))
    codes = {g['properties']['iso'] for g in topo['objects']['pays']['geometries']}
    plants = load_plants()

    without_range = sorted(name for name, p in plants.items() if not p['pays'])
    assert without_range == [], without_range
    for name, plant in plants.items():
        assert set(plant['pays'] + plant['introduits']) <= codes, name
        assert not set(plant['pays']) & set(plant['introduits']), name


def test_upsert_creates_updates_and_removes_plants():
    engine = create_engine('sqlite://')
    Base.metadata.create_all(engine)
    anubias = merge(FICHE, COLLECTED)
    fougere = {**anubias, 'nom_scientifique': 'Microsorum pteropus', 'nom_commun': 'Fougère de Java'}

    with Session(engine) as db:
        upsert_plants(db, {anubias['nom_scientifique']: anubias, fougere['nom_scientifique']: fougere})
        db.commit()
        anubias_id = db.scalar(select(Plante.id).filter_by(nom_scientifique='Anubias barteri var. nana'))

        upsert_plants(db, {anubias['nom_scientifique']: {**anubias, 'nom_commun': 'Anubias nana'}})
        db.commit()

        rows = db.scalars(select(Plante)).all()
        assert [(p.id, p.nom_commun) for p in rows] == [(anubias_id, 'Anubias nana')]
    engine.dispose()


def test_photos_dir_is_the_public_folder():
    assert PHOTOS_DIR == Path(__file__).resolve().parents[2] / 'frontend' / 'public' / 'plants'

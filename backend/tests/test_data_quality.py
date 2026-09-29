from sqlalchemy import select

import import_excel
from audit_data import audit, to_markdown
from corrections import CORRECTIONS, apply_corrections
from models import Comportement, Poisson

EXCEL_ROW = (
    1, 'Paracheirodon axelrodi', 'Cardinalis ', 'Characidae', 'Paracheirodon', 4, 6.5, None, '3 à 12', '4cm',
    'Amérique du Sud', 10, 'douce', 'omnivore ', 'banc ', '25 °C', '29 °C', 'tolérant ', 'Peu agressif',
    'très courant', '5 ans ', '100L', 'modéré, doux', 5,
)


def test_parse_row_cleans_and_normalizes():
    fish = import_excel.parse_row(EXCEL_ROW)

    assert fish['nom_commun'] == 'Cardinalis'
    assert (fish['gh_mini'], fish['gh_maxi'], fish['taille']) == (3, 12, 4)
    assert (fish['temp_mini'], fish['temp_maxi'], fish['litrage_mini'], fish['longevite']) == (25, 29, 100, 5)
    assert fish['comportement'] == 'peu agressif'
    assert fish['mode_vie'] == 'banc'
    assert fish['courant'] == 'doux, modéré'
    assert fish['robustesse'] == 'tolérant'
    assert fish['regime'] == 'omnivore'


def test_apply_corrections_overrides_known_fish():
    fish = apply_corrections({'nom_scientifique': 'Cichla ocellaris', 'comportement': 'peu agressif'})

    assert fish['comportement'] == 'prédateur'


def test_apply_corrections_leaves_other_fish_untouched():
    fish = {'nom_scientifique': 'Paracheirodon axelrodi', 'comportement': 'pacifique'}

    assert apply_corrections(dict(fish)) == fish


def test_every_correction_has_a_reason():
    for fields in CORRECTIONS.values():
        for value, reason in fields.values():
            assert value is not None and len(reason) > 20


def test_delete_unused_nomenclatures(client):
    from app import db

    db.session.add(Comportement(nom='Peu agressif '))  # ancienne variante, plus utilisée
    db.session.commit()

    import_excel.delete_unused_nomenclatures(db.session)
    db.session.commit()

    names = db.session.scalars(select(Comportement.nom)).all()
    assert sorted(names) == ['agressif', 'pacifique']
    assert db.session.scalars(select(Poisson)).all()  # les poissons sont conservés


def test_audit_flags_suspicious_values(client):
    fish = client.get('/poissons/1').get_json()
    fish.update(temp_maxi=34, gh_mini=20, gh_maxi=30, nb_individus=3, points=8, litrage_mini=20,
                nom_mode_vie='solitaire')

    checks = {issue.check for issue in audit([fish])}

    assert checks == {'Température inhabituelle', 'GH très élevé',
                      'Groupe minimum trop grand pour le volume minimum', 'Solitaire en groupe'}


def test_audit_flags_big_peaceful_carnivore(client):
    fish = client.get('/poissons/1').get_json()
    fish.update(taille=60, regime='carnivore', nom_comportement='peu agressif')

    assert [i.check for i in audit([fish])] == ['Grand carnivore classé paisible']


def test_audit_clean_fish_has_no_issue(client):
    assert audit([client.get('/poissons/1').get_json()]) == []


def test_to_markdown_groups_by_check(client):
    fish = client.get('/poissons/1').get_json()
    fish.update(temp_maxi=34)

    report = to_markdown(audit([fish]), 1)

    assert '## Température inhabituelle' in report
    assert '| Cardinalis (Paracheirodon axelrodi) | 23–34 °C' in report

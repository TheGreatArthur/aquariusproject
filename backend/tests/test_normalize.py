import pytest

from normalize import (
    clean, normalize_comportement, normalize_courant, normalize_mode_vie, normalize_regime, normalize_zone,
)


@pytest.mark.parametrize('raw, expected', [
    ('  Tétra Pinguin ', 'Tétra Pinguin'),
    ('agressif ,  prédateur ', 'agressif, prédateur'),
    (None, None),
    ('   ', None),
])
def test_clean(raw, expected):
    assert clean(raw) == expected


@pytest.mark.parametrize('raw, expected', [
    ('pacifique ', 'pacifique'),
    ('Peu agressif', 'peu agressif'),
    ('peu agressif ', 'peu agressif'),
    ('moyennement agressif', 'moyennement agressif'),
    ('pacifique mais territoriale', 'territorial'),
    ('agressif ', 'agressif'),
    ('agressif , prédateur ', 'prédateur'),
    ('agressif, prédateur', 'prédateur'),
    ('prédateur', 'prédateur'),
])
def test_normalize_comportement(raw, expected):
    assert normalize_comportement(raw) == expected


def test_normalize_comportement_rejects_unknown_label():
    with pytest.raises(ValueError, match='comportement'):
        normalize_comportement('câlin')


@pytest.mark.parametrize('raw, expected', [
    ('banc ', 'banc'),
    ('petit groupe ', 'petit groupe'),
    ('solitaire ', 'solitaire'),
    ('couple', 'couple'),
    ('harem (1♂ pour 3♀)', 'harem'),
    ('petit groupe (harem)', 'harem'),
    # Plusieurs options : on garde la plus sociale, pour n'alerter que si aucune n'est respectée
    ('solitaire ou couple ', 'couple'),
    ('couple ou petit groupe', 'petit groupe'),
    ('couple ou groupe', 'petit groupe'),
    ('petit groupe ou solitaire', 'petit groupe'),
    ('petit groupe, banc', 'banc'),
])
def test_normalize_mode_vie(raw, expected):
    assert normalize_mode_vie(raw) == expected


@pytest.mark.parametrize('raw, expected', [
    ('doux ', 'doux'),
    ('modéré, doux', 'doux, modéré'),
    ('doux, stagnant ', 'stagnant, doux'),
    ('modéré, lent , stagnant', 'stagnant, doux, modéré'),
    ('modéré, fort ', 'modéré, fort'),
    (None, None),
])
def test_normalize_courant(raw, expected):
    assert normalize_courant(raw) == expected


@pytest.mark.parametrize('raw, expected', [
    ('Carnivore, herbivore et planctophage', 'carnivore, herbivore et planctophage'),
    ('carnivore et omnivore ', 'carnivore et omnivore'),
    ('carnivore et détrivore', 'carnivore et détritivore'),
    ('Herbivore', 'herbivore'),
])
def test_normalize_regime(raw, expected):
    assert normalize_regime(raw) == expected


@pytest.mark.parametrize('raw, expected', [
    ('Asie ', 'Asie'),
    ('Indonésie', 'Asie'),
    ('Amérique du Sud', 'Amérique du Sud'),
])
def test_normalize_zone(raw, expected):
    assert normalize_zone(raw) == expected

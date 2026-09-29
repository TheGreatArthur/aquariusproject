"""
Normalisation des libellés saisis dans le classeur Excel

Le classeur contient des variantes d'un même libellé (espaces en trop, majuscules, synonymes).
Ces fonctions les ramènent à un petit nombre de catégories fixes, sur lesquelles s'appuient
les règles de compatibilité du simulateur.
"""

import re

# Comportements, du plus paisible au plus dangereux
COMPORTEMENTS = ['pacifique', 'peu agressif', 'territorial', 'moyennement agressif', 'agressif', 'prédateur']

# Modes de vie, du plus solitaire au plus grégaire
MODES_VIE = ['solitaire', 'couple', 'harem', 'petit groupe', 'banc']

# Courants, du plus faible au plus fort ('lent' est un synonyme de 'doux')
COURANTS = ['stagnant', 'doux', 'modéré', 'fort']
COURANT_SYNONYMES = {'lent': 'doux'}

# Zones géographiques ramenées au continent
ZONE_SYNONYMES = {'Indonésie': 'Asie'}

REGIME_CORRECTIONS = {'détrivore': 'détritivore'}


def clean(value: str | None) -> str | None:
    """ Supprime les espaces superflus (y compris avant les virgules) ; None si vide
    """
    if value is None:
        return None
    value = re.sub(r'\s+', ' ', str(value)).strip()
    value = re.sub(r'\s+,', ',', value)
    return value or None


def _options(value: str) -> list[str]:
    """ Découpe un libellé à plusieurs options : 'a, b ou c' -> ['a', 'b', 'c']
    """
    return [opt.strip() for opt in re.split(r',| ou | et ', value) if opt.strip()]


def normalize_comportement(value: str) -> str:
    """ Ramène un comportement à l'une des catégories de COMPORTEMENTS
    """
    value = clean(value).lower()
    if 'prédateur' in value:
        return 'prédateur'
    if 'territorial' in value:
        return 'territorial'
    if value in COMPORTEMENTS:
        return value
    raise ValueError(f'comportement inconnu : {value!r}')


def normalize_mode_vie(value: str) -> str:
    """ Ramène un mode de vie à l'une des catégories de MODES_VIE.

    Quand plusieurs options sont proposées ('solitaire ou couple'), on garde la plus sociale :
    le simulateur n'alerte alors que si aucune des options n'est respectée.
    """
    value = clean(value).lower()
    if 'harem' in value:
        return 'harem'
    found = []
    for option in _options(value):
        if option == 'groupe':
            option = 'petit groupe'
        if option not in MODES_VIE:
            raise ValueError(f'mode de vie inconnu : {value!r}')
        found.append(option)
    return max(found, key=MODES_VIE.index)


def normalize_courant(value: str | None) -> str | None:
    """ Liste de courants triée du plus faible au plus fort, sans doublon : 'stagnant, doux, modéré'
    """
    value = clean(value)
    if value is None:
        return None
    levels = set()
    for option in _options(value.lower()):
        option = COURANT_SYNONYMES.get(option, option)
        if option not in COURANTS:
            raise ValueError(f'courant inconnu : {value!r}')
        levels.add(option)
    return ', '.join(sorted(levels, key=COURANTS.index))


def normalize_regime(value: str) -> str:
    """ Régime alimentaire en minuscules, fautes connues corrigées
    """
    value = clean(value).lower()
    for wrong, right in REGIME_CORRECTIONS.items():
        value = value.replace(wrong, right)
    return value


def normalize_zone(value: str) -> str:
    """ Zone géographique, ramenée au continent quand c'est possible
    """
    value = clean(value)
    return ZONE_SYNONYMES.get(value, value)

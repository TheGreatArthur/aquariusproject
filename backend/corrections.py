"""
Corrections de données appliquées à l'import, par-dessus le classeur Excel

Chaque correction est versionnée ici avec sa justification, pour qu'elle soit relue en pull request.
Les valeurs douteuses non tranchées sont listées par `audit_data.py` (voir docs/data-audit.md),
pas corrigées à l'aveugle.
"""

# nom_scientifique -> {champ: (nouvelle valeur, justification)}
CORRECTIONS: dict[str, dict[str, tuple[object, str]]] = {
    'Cichla ocellaris': {
        'comportement': (
            'prédateur',
            'Cichla ocellaris (Mariposa, "peacock bass") is a piscivore reaching 60 cm; '
            'it was labelled "peu agressif", which hid every predation risk in the simulator.',
        ),
    },
}


def apply_corrections(fish: dict) -> dict:
    """ Applique les corrections connues à un poisson (dictionnaire de valeurs lues dans l'Excel)
    """
    for field, (value, _reason) in CORRECTIONS.get(fish['nom_scientifique'], {}).items():
        fish[field] = value
    return fish

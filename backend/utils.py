"""
Fonctions utilitaires
"""

from sqlalchemy import select


def get_or_create(db, cls, col: str = 'nom', flush_after_create=False, **kwargs) -> object:
    """ Renvoie, en la créant au besoin, une instance de la classe cls portant un nom donné.

    :param db: session SQLAlchemy
    :param cls: classe d'appartenance
    :param col: nom du champ à utiliser (par défaut, *'nom'*)
    :param flush_after_create: flush de dbsession en cas de création ?
    :param kwargs: paramètres supplémentaires
    """
    obj = db.scalar(select(cls).where(getattr(cls, col) == kwargs[col]))
    if not obj:
        obj = cls(**kwargs)
        db.add(obj)
        if flush_after_create:
            db.flush()
    return obj


def get_or_create_id(db, cls, col: str = 'nom', **kwargs) -> int:
    """ Renvoie, en la créant au besoin, l'id d'une instance de la classe cls portant un nom donné.

    :param db: session SQLAlchemy
    :param cls: classe d'appartenance
    :param col: nom du champ à utiliser (par défaut, *'nom'*)
    :param kwargs: paramètres supplémentaires
    :return: id de l'instance créée, ou None
    """
    return get_or_create(
        db, cls, col=col, flush_after_create=True, **kwargs).id if kwargs[col] else None

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

from models.meta import Base


class Nomenclature:
    """"""
    id: Mapped[int] = mapped_column(primary_key=True)
    nom: Mapped[str] = mapped_column(String(50))
    pos: Mapped[int | None] = mapped_column(index=True)


class Famille(Base, Nomenclature):
    """"""
    __tablename__ = 'famille'


class Genre(Base, Nomenclature):
    """"""
    __tablename__ = 'genre'


class ZoneGeo(Base, Nomenclature):
    """"""
    __tablename__ = 'zone_geo'


class TypeEau(Base, Nomenclature):
    """"""
    __tablename__ = 'type_eau'


class ModeVie(Base, Nomenclature):
    """"""
    __tablename__ = 'mode_vie'


class Robustesse(Base, Nomenclature):
    """"""
    __tablename__ = 'robustesse'


class Comportement(Base, Nomenclature):
    """"""
    __tablename__ = 'comportement'


class Dispo(Base, Nomenclature):
    """"""
    __tablename__ = 'dispo'


class Courant(Base, Nomenclature):
    """"""
    __tablename__ = 'courant'

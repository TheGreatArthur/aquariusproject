from sqlalchemy import JSON, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.meta import Base


class Profil(Base):
    """ Fiche descriptive d'un poisson : textes, répartition naturelle et sources (voir data/profiles/)
    """
    __tablename__ = 'profil'

    id: Mapped[int] = mapped_column(primary_key=True)
    id_poisson: Mapped[int] = mapped_column(ForeignKey('poisson.id', ondelete='CASCADE'), unique=True)
    # Nom valide actuel quand la taxonomie a changé depuis le nom d'usage en aquariophilie
    nom_valide: Mapped[str | None] = mapped_column(String(100))
    # Auteur et année de description, entre parenthèses si l'espèce a changé de genre depuis
    auteur: Mapped[str | None] = mapped_column(String(100))
    # Ordre › famille selon la classification actuelle
    classification: Mapped[str | None] = mapped_column(String(200))
    uicn: Mapped[str | None] = mapped_column(String(2))
    presentation: Mapped[str] = mapped_column(Text())
    habitat: Mapped[str] = mapped_column(Text())
    comportement: Mapped[str] = mapped_column(Text())
    repartition: Mapped[str] = mapped_column(String(300))
    # Codes ISO 3166 alpha-3 des pays où l'espèce est indigène
    pays: Mapped[list] = mapped_column(JSON())
    # Observations géolocalisées [longitude, latitude] dans l'aire d'origine (GBIF), pour la carte
    points: Mapped[list] = mapped_column(JSON())
    # [{"nom": "FishBase", "url": "https://..."}]
    sources: Mapped[list] = mapped_column(JSON())

    def as_dict(self) -> dict:
        out = super().as_dict()
        del out['id'], out['id_poisson']
        return out

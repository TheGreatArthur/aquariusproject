from sqlalchemy import ForeignKey, String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.meta import Base

class Poisson(Base):
    __tablename__ = 'poisson'

    id: Mapped[int] = mapped_column(primary_key=True)
    nom_scientifique: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    nom_commun: Mapped[str] = mapped_column(String(50), index=True)
    id_famille: Mapped[int] = mapped_column(ForeignKey('famille.id'), index=True)
    id_genre: Mapped[int] = mapped_column(ForeignKey('genre.id'), index=True)
    ph_mini: Mapped[float]
    ph_maxi: Mapped[float]
    kh: Mapped[float | None]
    gh_mini: Mapped[float]
    gh_maxi: Mapped[float]
    taille: Mapped[float]
    id_zone_geo: Mapped[int] = mapped_column(ForeignKey('zone_geo.id'), index=True)
    nb_individus: Mapped[int]
    id_type_eau: Mapped[int] = mapped_column(ForeignKey('type_eau.id'), index=True)
    regime: Mapped[str] = mapped_column(String(50))
    id_mode_vie: Mapped[int] = mapped_column(ForeignKey('mode_vie.id'), index=True)
    temp_mini: Mapped[int]
    temp_maxi: Mapped[int]
    id_robustesse: Mapped[int] = mapped_column(ForeignKey('robustesse.id'), index=True)
    id_comportement: Mapped[int] = mapped_column(ForeignKey('comportement.id'), index=True)
    id_dispo: Mapped[int] = mapped_column(ForeignKey('dispo.id'), index=True)
    longevite: Mapped[int]
    litrage_mini: Mapped[int]
    points: Mapped[int | None]
    id_courant: Mapped[int | None] = mapped_column(ForeignKey('courant.id'))
    images: Mapped[list|None] = mapped_column(JSON())

    # Relations
    famille: Mapped['Famille'] = relationship()
    genre: Mapped['Genre'] = relationship()
    comportement: Mapped['Comportement'] = relationship()
    
    
    def __str__(self) -> str:
        return f'<{self.__class__.__name__} {self.id} {self.nom_scientifique!r}>'

    def __repr__(self) -> str:
        return f'<{self.__class__.__name__} {self.id}>'

    def as_dict(self):
        out: dict = super().as_dict()
        out.update(
            nom_famille=self.famille.nom,
            nom_genre=self.genre.nom,
            nom_comportement=self.comportement.nom, 

            )
        return out
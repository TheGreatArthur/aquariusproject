from sqlalchemy import JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.meta import Base


class Plante(Base):
    """ Plante d'aquarium : paramètres de culture, fiche descriptive et photos (voir data/plants/ et plants.py)
    """
    __tablename__ = 'plante'

    id: Mapped[int] = mapped_column(primary_key=True)
    nom_scientifique: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    nom_commun: Mapped[str] = mapped_column(String(50), index=True)
    # Nom valide actuel quand la taxonomie a changé depuis le nom d'usage en aquariophilie
    nom_valide: Mapped[str | None] = mapped_column(String(100))
    auteur: Mapped[str | None] = mapped_column(String(100))
    famille: Mapped[str] = mapped_column(String(50), index=True)
    ordre: Mapped[str | None] = mapped_column(String(50))
    # Port de la plante : épiphyte, mousse, rosette, tige, tapissante ou flottante
    type: Mapped[str] = mapped_column(String(20), index=True)
    # Emplacements conseillés (premier plan, arrière-plan, sur le décor...) et autres usages (nano-aquarium...)
    positions: Mapped[list] = mapped_column(JSON())
    usages: Mapped[list] = mapped_column(JSON())
    difficulte: Mapped[str] = mapped_column(String(20))
    croissance: Mapped[str] = mapped_column(String(20))
    lumiere_mini: Mapped[str] = mapped_column(String(20))
    lumiere_maxi: Mapped[str] = mapped_column(String(20))
    # Besoin en CO2 : faible (facultatif), moyen ou élevé
    co2: Mapped[str | None] = mapped_column(String(20))
    ph_mini: Mapped[float]
    ph_maxi: Mapped[float]
    kh_mini: Mapped[float | None]
    kh_maxi: Mapped[float | None]
    # Températures supportées, et plage où la plante pousse le mieux
    temp_mini: Mapped[int]
    temp_maxi: Mapped[int]
    temp_opti_mini: Mapped[int | None]
    temp_opti_maxi: Mapped[int | None]
    # Hauteur en aquarium (cm)
    hauteur_mini: Mapped[float | None]
    hauteur_maxi: Mapped[float | None]
    multiplication: Mapped[list] = mapped_column(JSON())
    emergee: Mapped[bool | None]
    origine: Mapped[str] = mapped_column(String(300))
    presentation: Mapped[str] = mapped_column(Text())
    culture: Mapped[str] = mapped_column(Text())
    # [{"fichier": "...jpg", "auteur": "...", "licence": "CC BY-SA 4.0", "licence_url": "https://...", "source": "https://..."}]
    images: Mapped[list] = mapped_column(JSON())
    # [{"nom": "Flowgrow", "url": "https://..."}]
    sources: Mapped[list] = mapped_column(JSON())

    def __str__(self) -> str:
        return f'<{self.__class__.__name__} {self.id} {self.nom_scientifique!r}>'

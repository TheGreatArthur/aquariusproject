from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from models.meta import Base


class Invertebre(Base):
    """ Invertébré d'aquarium (crevette, crabe, escargot, écrevisse) : mêmes champs que les poissons pour l'eau,
    la taille, le volume et le comportement, fiche descriptive et photos (voir data/invertebrates/ et invertebrates.py)
    """
    __tablename__ = 'invertebre'

    id: Mapped[int] = mapped_column(primary_key=True)
    nom_scientifique: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    nom_commun: Mapped[str] = mapped_column(String(80), index=True)
    # Forme d'élevage documentée par la fiche (« Red Cherry »), quand la source ne décrit pas l'espèce sauvage
    variete: Mapped[str | None] = mapped_column(String(50))
    # crevette, crabe, escargot ou écrevisse
    groupe: Mapped[str] = mapped_column(String(20), index=True)
    famille: Mapped[str] = mapped_column(String(50), index=True)
    genre: Mapped[str] = mapped_column(String(50))
    zone_geo: Mapped[str | None] = mapped_column(String(30))
    # aquarium, ou aquaterrarium pour les crabes semi-terrestres ; eau douce, ou eau douce et eau saumâtre
    installation: Mapped[str] = mapped_column(String(20))
    milieu: Mapped[str] = mapped_column(String(30))
    ph_mini: Mapped[float]
    ph_maxi: Mapped[float]
    gh_mini: Mapped[float | None]
    gh_maxi: Mapped[float | None]
    kh_mini: Mapped[float | None]
    kh_maxi: Mapped[float | None]
    temp_mini: Mapped[float]
    temp_maxi: Mapped[float]
    # Taille maximale (cm) et ce qu'elle mesure : longueur du corps, largeur de la carapace...
    taille: Mapped[float | None]
    mesure_taille: Mapped[str | None] = mapped_column(String(60))
    litrage_mini: Mapped[int | None]
    nb_individus: Mapped[int | None]
    longevite: Mapped[int | None]
    comportement: Mapped[str] = mapped_column(String(30))
    mode_vie: Mapped[str | None] = mapped_column(String(30))
    regime: Mapped[str | None] = mapped_column(String(30))
    activite: Mapped[str | None] = mapped_column(String(20))
    # Où se déroule la reproduction : en eau douce, ou larves en eau saumâtre ou en mer
    reproduction: Mapped[str | None] = mapped_column(String(60))
    images: Mapped[list] = mapped_column(JSON())
    # Auteur, licence et type de vue de chaque photo, dans l'ordre de `images`
    credits: Mapped[list] = mapped_column(JSON())
    # Fiche descriptive, avec les mêmes champs que celle des poissons (classification, UICN, pays, points,
    # présentation, habitat, comportement, sources) et les conseils de maintenance propres aux invertébrés
    profil: Mapped[dict] = mapped_column(JSON())

    def __str__(self) -> str:
        return f'<{self.__class__.__name__} {self.id} {self.nom_scientifique!r}>'

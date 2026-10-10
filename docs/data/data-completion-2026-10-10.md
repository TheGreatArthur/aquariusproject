# Complétion des données — 10 octobre 2026

Bilan des valeurs manquantes des trois catalogues, de ce qui a été complété et des sources utilisées. Une valeur
n'est ajoutée que si une source citée la donne ; sinon elle reste vide et la page l'indique.

## Plantes (132)

| Donnée | Avant | Après | Source |
|---|---|---|---|
| Nom français | 122 plantes sans nom français | 78 | noms vernaculaires agrégés par GBIF (TAXREF et d'autres listes), Wikidata pour *Elodea canadensis* |
| Besoin en CO₂ | 122 sans valeur | 0 | Tropica, à défaut la concentration minimale conseillée par Flowgrow (jusqu'à 15 mg/l : faible, 20 : moyen, 25 et plus : élevé, seuils calés sur les plantes notées par Tropica) |
| Hauteur en aquarium | 110 sans valeur | 77 | Tropica (34 plantes reliées à leur fiche) |
| Port | 10 plantes flottantes classées « rosette » ou « tige » | corrigé | pictogramme « free-floating (surface) » de Flowgrow, désormais lu |
| Usages, multiplication | libellés Flowgrow ignorés | lus | accent coloré, rue hollandaise, plante isolée, bac ouvert, spores |

Les noms vernaculaires faux ou régionaux proposés par les sources ont été écartés (le nom d'une autre fougère pour
*Ceratopteris cornuta*, « Herbe mare »…). Les 77 plantes restantes n'ont de hauteur ni chez Flowgrow ni chez Tropica.

## Invertébrés (21)

| Donnée | Avant | Après | Source |
|---|---|---|---|
| Taille | 8 escargots sans taille | 0 | hauteur de la coquille adulte donnée par Fishipedia |
| Mode de vie, longévité du micro-crabe | vides | renseignés | Aquarium Dietzenbach |

Restent vides faute de source : le GH et le KH de 20 espèces, la longévité de 15, le groupe minimum de la crevette
bambou et du micro-crabe, la reproduction du micro-crabe (développement des larves en eau douce supposé, jamais
observé en aquarium). Les sources consultées (Fishipedia, Aquarium Glaser, Aquarium Dietzenbach) ne les donnent pas ;
Seriously Fish ne couvre pas les invertébrés.

## Poissons (304)

Les 135 poissons du classeur avaient trois photos chacun, ajoutées en 2023 sans auteur ni licence. 115 d'entre eux
ont désormais jusqu'à trois photos libres de Wikimedia Commons, choisies à l'œil sur des planches de candidates
(pas d'herbier, de dessin, de photo d'une autre espèce ou de forme d'élevage quand le type existe), avec leur auteur et
leur licence (`backend/data/workbook_photos.json`, crédits dans `backend/data/fish_photos.json`) ; leurs anciennes
images sont retirées du dépôt.

Les 20 autres n'ont aucune photo libre utilisable sur Commons et gardent leurs images d'origine, de licence inconnue :
*Tyttocharax tambopatensis*, *T. cochui*, *Thayeria ifati* (spécimens de musée seulement), *Hyphessobrycon
heterorhabdus* (dessin seulement), *Rasbora patrickyapi*, *Betta macrostoma*, *B. gladiator*, *Corydoras robineae*,
*Pseudacanthicus pirarara*, *Rineloricaria* sp. Red (photos du genre seulement), *Pseudohemiodon apithanos*,
*Tahuantinsuyoa macantzatza*, *Laetacara fulvipinnis*, *Aulonocara baenschi* (aucune photo du mâle jaune typique),
*A. gertrudae*, *Gastromyzon punctulatus*, *Channa pulchra*, *Metynnis luna*, *Aphyosemion celiae* et *Dario dario*.

Restent aussi sans nom français 37 poissons du classeur, surtout des *Corydoras*, *Otocinclus* et cichlidés nains
connus en aquariophilie sous leur nom scientifique : ni GBIF ni Wikidata ne leur donnent de nom vernaculaire.

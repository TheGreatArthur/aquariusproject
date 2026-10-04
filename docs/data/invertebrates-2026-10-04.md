# Catalogue d’invertébrés d’eau douce — collecte du 4 octobre 2026

48 références ont été collectées, dont 45 ont reçu une rédaction française originale. Le lot prêt contient 21 références et 63 photographies, soit exactement trois photos distinctes et vérifiées par référence : 7 crevettes, 4 écrevisses, 2 crabes et 8 escargots. 27 références restent à compléter ou sont exclues du lot de maintenance en eau douce ; leurs raisons individuelles figurent dans `backend/data/invertebrate_expansion/gaps.json`.

La rubrique `/invertebres` est intégrée au site, avec son lien entre Poissons et Plantes dans la navigation. Depuis le 5 octobre 2026, les invertébrés ont la même structure que les poissons ([ADR 0012](../adr/0012-invertebrates-like-fish.md)) : un fichier par espèce dans `backend/data/invertebrates/`, avec les noms de champs des poissons, une table `invertebre`, les routes `GET /invertebres` et `GET /invertebres/<id>`, et des pages construites comme celles des poissons. Les photos validées sont dans `frontend/public/invertebrates/`, renommées d'après le nom scientifique. Le dossier de collecte `backend/data/invertebrate_expansion/` reste la copie de travail locale de cette collecte ; il n'est pas lu par l'application.

## Sources et méthode

Fishipedia sert de source documentaire principale. Les listes publiques de crustacés et de mollusques ont été parcourues à partir de leurs liens, avec vérification de robots.txt, cache local, User-Agent identifié et espacement des requêtes. Les formes commerciales ne sont pas comptées comme des espèces supplémentaires. La source Neocaridina davidi présente la sélection Red Cherry ; cette portée est conservée dans le champ `variete` et dans les photographies choisies.

Les articles d’Aquarium Glaser complètent les crevettes filtreuses, et ceux d’Aquarium Dietzenbach précisent les besoins de Geosesarma notophorum et du micro-crabe Limnopilos naiyanetri. Ce dernier a été ajouté à la collecte pour inclure un crabe réellement aquatique, distinct du crabe vampire qui demande un aquaterrarium. Les correspondances GBIF doivent être exactes au rang espèce et d’une confiance d’au moins 95. Un synonyme peut correspondre à un nom accepté différent, conservé dans `nom_valide`, par exemple Anentome helena pour la source Clea helena.

Les paragraphes publiés sont des synthèses originales et propres à chaque référence : morphologie, port des pinces ou coquille, habitat, installation, alimentation et reproduction. Les articles sources complets et les extraits de travail restent uniquement dans le cache ignoré `backend/.cache/invertebrates/`. Les fiches exportées conservent les URL, dates et empreintes SHA-256 des pages documentaires. Les cache et métadonnées API des photographies sont dans `backend/.cache/invertebrate_photo_review/`.

## Paramètres et incohérences traitées

Les recommandations de maintenance et les mesures de l’habitat naturel sont deux objets distincts. Les GH/KH naturels ne sont pas utilisés comme recommandations d’élevage. Les valeurs absentes restent nulles. Une population minimale égale à zéro dans une source est écartée et signalée. Les valeurs fournies par des sites de maintenance restent des recommandations de ces sources, pas une certification expérimentale indépendante.

Le champ générique « reproduction en eau douce » d’Atyopsis moluccensis est contredit par l’article spécialisé d’Aquarium Glaser : les larves ont besoin d’un milieu marin. La contradiction est enregistrée. Pour Atya gabonensis, le texte spécifique indique que le cycle n’est pas réalisable en eau douce seule ; le champ générique contradictoire n’est pas repris. Les crabes Geosesarma sont marqués `aquaterrarium`, même lorsque le tableau générique de Fishipedia indique `Aquarium`. La température disponible ne distingue pas explicitement l’air de l’eau ; cette limite figure dans les notes.

Marosina serratirostris reste en attente d’une confirmation taxonomique au rang espèce. Caridina cf. babaulti « Green » reste en attente d’identité et d’images confirmées. Les deux Palaemon marins sont exclus du lot d’eau douce. Cardisoma armatum et les deux grandes Macrobrachium sans recommandations de maintenance suffisantes restent documentaires. Procambarus clarkii n’est pas proposé dans le lot destiné à une nouvelle acquisition en France métropolitaine : l’espèce figure dans l’annexe II-1 de l’[arrêté du 14 février 2018, version consultée le 4 octobre 2026](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000036629851).

## Photographies

196 candidates ont été inspectées visuellement. Les métadonnées viennent de l’API officielle Wikimedia Commons et de GBIF ; seules les licences de chaque média sont prises en compte. Les images iNaturalist téléchargées viennent du dépôt open-data documenté. Les photographies conservent auteur, licence, URL de licence, source, URL originale et SHA-256 du JPEG livré. Les versions locales sont normalisées en JPEG pour l’affichage ; elles gardent les conditions de leur licence source.

Les illustrations, timbres, vues trop floues, étiquettes de collections peu exploitables et doublons recadrés ont été écartés. Trois photos de Hippolyte desmarestii remontées pour Atyaephyra desmarestii ont été rejetées : ce sont des taxons différents. Certaines galeries d’escargots utilisent des photographies de coquilles de référence ; Cherax snowden comporte des photographies de spécimens scientifiques. Ces types de vues sont explicitement légendés. Il ne s’agit pas de trois photos d’animaux vivants garanties pour chaque fiche.

Les décisions sont dans `photo_review.json`. Le contrôle associe les métadonnées taxonomiques de la source à l’examen visuel ; il ne constitue pas une détermination indépendante par un spécialiste. Les références sans trois photos acceptables restent hors du lot prêt.

## Format des données et intégration

Le fichier `ready/catalogue.json` a une enveloppe `schema_version: 1`, `date_collecte`, `territoire_reference` et un tableau `profils`.

Chaque profil contient :

- `id` : slug stable, indépendant d’un identifiant SQL ; `categorie` : `crevette`, `crabe`, `escargot` ou `ecrevisse`.
- `nom_scientifique`, `nom_source`, `nom_valide`, `nom_commun`, `variete`, `famille`, `synonymes` : taxonomie et noms commerciaux sans fusion implicite.
- `presentation`, `maintenance`, `alimentation`, `reproduction` : paragraphes éditoriaux à afficher tels quels, sans les remplacer par un texte généré depuis les tableaux.
- `installation`, `environnement_adultes`, `milieu_reproduction` : champs distincts ; les phases larvaires marines ne rendent pas marine la maintenance des adultes.
- `parametres_maintenance` : température en °C, pH, GH en °dGH, KH en °dKH, volume minimal de la source en litres et taille minimale du groupe. Une plage est `{ "min": nombre, "max": nombre }` ou null ; les autres valeurs sont positives ou nulles.
- `parametres_habitat_naturel` : objet séparé, à ne pas injecter dans les règles de compatibilité de maintenance.
- `taille_max_cm`, `mesure_taille` : distinguer largeur de carapace, longueur corporelle et mesure non précisée par une source de mollusques.
- `images` : trois éléments exactement. `fichier` est relatif au répertoire `ready/` ; déplacer les fichiers vers un dossier dédié de la partie publique et adapter leur URL de rendu. Afficher les crédits et le `type_vue` : `animal`, `coquille` ou `specimen_photographie`.
- `sources`, `notes_donnees` : références, provenance et décisions sur les contradictions.

Ce format est celui de la collecte. Les fichiers publiés dans `backend/data/invertebrates/` en reprennent les valeurs, les textes et les crédits sous les noms de champs des poissons ; les paramètres du milieu naturel y sont résumés dans le texte d'habitat plutôt que conservés en tableau. La simulation demandera une modélisation propre de la prédation, du fouissage et des installations terrestres ; les données présentes ne suffisent pas à inventer une compatibilité universelle.

## Rejouer et vérifier

Le skill installé est `~/.codex/skills/aquarium-invertebrate-scraping/`. Depuis la racine du dépôt, utiliser l’environnement Python du backend :

```sh
backend/venv/bin/python ~/.codex/skills/aquarium-invertebrate-scraping/scripts/collect.py --repo "$PWD"
backend/venv/bin/python ~/.codex/skills/aquarium-invertebrate-scraping/scripts/collect_photos.py --repo "$PWD" --phase search
backend/venv/bin/python ~/.codex/skills/aquarium-invertebrate-scraping/scripts/collect_photos.py --repo "$PWD" --phase download
backend/venv/bin/python ~/.codex/skills/aquarium-invertebrate-scraping/scripts/gbif_photo_fill.py --repo "$PWD"
backend/venv/bin/python ~/.codex/skills/aquarium-invertebrate-scraping/scripts/review_sheets.py --repo "$PWD"
backend/venv/bin/python ~/.codex/skills/aquarium-invertebrate-scraping/scripts/build_bundle.py --repo "$PWD"
backend/venv/bin/python ~/.codex/skills/aquarium-invertebrate-scraping/scripts/publish_frontend.py --repo "$PWD"
```

De nouvelles images doivent être inspectées et recevoir une décision avant d’être livrées. `build_bundle.py` ne choisit que les médias approuvés et vérifie les doublons par empreinte. `validation.json` donne les comptes, `verification.json` conserve les résultats des contrôles : intégrité des 63 fichiers, empreintes des sources, séparation des paramètres, rejet des doublons et licences non commerciales, plages inversées et rejouabilité du lot. Les catalogues poissons et plantes ont été comparés avant et après la collecte et la construction.

L’aperçu a été contrôlé dans le navigateur : recherche « Amano », trois photos avec crédits, sections entretien et reproduction, puis filtre crabes distinguant aquarium et aquaterrarium. Les captures de contrôle sont [la fiche Amano](screenshots/invertebrates-amano.png) et [le catalogue](screenshots/invertebrates-catalogue.png).

## Enrichissement et validation du site

Trois escargots supplémentaires et Neocaridina palmata ont rejoint le lot complet. Les fiches Abeille (Caridina logemanni) et Tiger (Caridina mariae) ont été collectées et rédigées ; elles restent en attente de trois photos conformes. La fiche palmata distingue explicitement le taxon illustré, les colorations photographiées et les paramètres documentés pour Blue Pearl. Les informations d’activité, de sociabilité, de territorialité et de longévité disponibles sont conservées avec la provenance du profil.

La recherche photographique Commons a été étendue à 60 résultats par requête. Les dessins anatomiques et les images sans licence réutilisable ont été rejetés. La tentative complémentaire sur l’API iNaturalist a été arrêtée conformément à robots.txt, sans télécharger de photos d’observations par cette API ; voir `photo_access_report.json`.

Vérifications du site : 93 tests frontend réussis, lint des fichiers modifiés et compilation de production. Dans le navigateur : recherche Amano, changement de photo et de crédit, filtre crabes, menu tablette à 768 px et absence de débordement horizontal à 390 px. Le menu compact est utilisé jusqu’à 1024 px pour accueillir le nouveau lien sans chevauchement.

Captures du site intégré : [catalogue et navigation](screenshots/invertebrates-site-catalogue.png), [filtre crabes sur téléphone](screenshots/invertebrates-site-mobile.png).

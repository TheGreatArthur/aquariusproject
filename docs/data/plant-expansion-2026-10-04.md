# Extension des plantes — 4 octobre 2026

Le catalogue local est passé de 10 à 132 références : 122 nouvelles fiches françaises et 366 nouvelles photographies sont intégrées. Chaque fiche du catalogue a exactement trois photos créditées. Les dix fiches initiales, leurs sources et leurs identifiants ont été conservés.

220 nouvelles références de culture ont été collectées et comparées aux pages Flowgrow en cache. Elles couvrent 107 genres et 59 familles, avec des espèces, des formes commerciales et des cultivars. 98 références restent en préparation faute de trois photographies distinctes suffisamment identifiées et librement réutilisables ; elles ne sont pas affichées sur le site. L’objectif de plus de 200 références affichées n’est donc pas encore atteint.

## Collecte et sélection des photos

627 images candidates ont été inspectées. Les métadonnées ont été recherchées sur l’API officielle de Wikimedia Commons. Les lacunes ont été complétées par les occurrences GBIF et les photographies iNaturalist du dépôt ouvert, avec contrôle de la licence de chaque média et de son auteur. Les licences retenues sont domaine public, CC0, CC BY et CC BY-SA. Les illustrations, herbiers, photos du mauvais taxon, formes commerciales non confirmées et duplications repérées ont été écartés.

Le contrôle combine l’identité publiée par la source et une inspection visuelle ; il ne constitue pas une détermination botanique indépendante. Certaines images montrent une fleur, une forme émergée ou un habitat, plutôt qu’une plante cultivée sous l’eau. Les trois vues ne sont pas présentées comme trois stades de culture.

Les images publiées sont des JPEG optimisés, au plus 2000 pixels sur le grand côté. Le nom de l’auteur, la licence et sa page, ainsi que la page de la photographie sont conservés dans `backend/data/plant_sources.json` et affichés dans la galerie et sur la fiche.

## Sources et rédaction

[Flowgrow](https://www.flowgrow.de/db/aquaticplants) fournit les paramètres de culture et les régions d’origine structurées. Les textes français ont été rédigés à partir de ces faits, sans reprendre les articles. Les noms scientifiques servent de désignations affichées lorsqu’aucun nom français n’est vérifié. Les hauteurs sont celles de Flowgrow, sauf données Tropica déjà présentes ; les concentrations CO₂ de Flowgrow ne sont pas converties arbitrairement en catégories Tropica. Les températures optimales et les tolérances restent distinctes.

La classification repose sur Flowgrow, complétée par GBIF lorsqu’une correspondance taxonomique est disponible. Les candidats GBIF conservent l’URL de l’occurrence et l’évidence de correspondance. Les photographies Flowgrow et Tropica n’ont pas été copiées.

Les robots.txt des hôtes ont été consultés. Commons a été interrogé par son interface API officielle, avec User-Agent identifié, maxlag et requêtes séquentielles ; aucun crawl des chemins HTML interdits n’a été effectué. Les requêtes utilisent un cache et un intervalle d’au moins une seconde par hôte. Les refus d’accès ou limitations persistantes arrêtent la collecte.

## Traçabilité

- `backend/data/plant_expansion/records.json` : paramètres, URLs, dates, empreintes HTML et état de chaque référence.
- `photo_candidates.json`, `photo_candidates_gbif.json` : résultats et licences des sources, identité publiée et URLs originales.
- `photo_review.json` : décisions de revue visuelle ; `photo_taxon_exclusions.json` : exclusions propres aux formes commerciales.
- `photo_selection.json` : trois sources retenues par nouvelle fiche et empreintes des JPEG.
- `photo_gaps.json` : 98 références incomplètes, nombre de photos manquantes et motifs ; 270 photos restent à trouver pour compléter ce lot.
- `photo_import_validation.json`, `validation.json`, `manifest.json` : comptes réels de collecte et d’import.
- `frontend/public/plants/` et `backend/data/plants/` : fichiers publiés et fiches importables.

## Vérification effectuée

56 tests Python des plantes et de leurs parseurs, 10 tests frontend des utilitaires de plantes, et ESLint ciblé sur les trois composants d’affichage modifiés passent. L’API locale renvoie 132 plantes ; le détail Bacopa australis renvoie trois photos. La recherche et les trois boutons de galerie ont été contrôlés dans le navigateur, avec chargement des images et changement du crédit. Les libellés de sources ont été corrigés pour distinguer Commons et iNaturalist.

L’import a utilisé l’ensemble du catalogue, jamais le seul nouveau lot.

## Rejouer l’intégration et maintenir les données

Le dossier `backend/data/plant_expansion/` est la copie de travail locale de cette collecte (relevés, candidates, revues et sélection des photos) ; il n’est pas versionné et l’application ne le lit pas. Les fiches publiées (`backend/data/plants/`), les données collectées (`backend/data/plant_sources.json`) et les photos (`frontend/public/plants/`) suffisent à reconstruire le catalogue :

```sh
make plants-fetch   # Flowgrow, Tropica, GBIF, aire d’origine (WCVP) et photos Commons
make occurrences    # points de la carte de répartition (GBIF)
make plants         # chargement en base
```

Depuis le 5 octobre 2026, `make plants-fetch` garde les photos iNaturalist des fiches (`photos_externes`, avec leur crédit) après celles de Commons et lit les titres Commons écrits sans `File:` : une nouvelle collecte ne remplace plus ces galeries mixtes. Une nouvelle photo iNaturalist doit encore être revue et ajoutée à la main, avec son crédit, dans `plant_sources.json`. Les pages des plantes sont construites comme celles des poissons, avec la carte de leur aire d’origine ([ADR 0013](../adr/0013-plants-like-fish-native-range.md)).

## Reprise éditoriale des fiches

Les 122 nouvelles fiches ont ensuite été réécrites pour remplacer les introductions répétitives sur la famille et les listes de paramètres par des descriptions propres à chaque plante : feuillage, port, habitat, place dans le bac, changement de forme à la surface et entretien. Les sections de culture donnent désormais des gestes utiles, tout en conservant les limites documentées pour les espèces peu connues.

Les descriptions détaillées Flowgrow, y compris la version allemande lorsqu’elle est plus complète, servent de base. Douze fiches ont reçu des compléments issus de Tropica, des flores botaniques présentées par Kew ou d’autres publications identifiées sur leur fiche. Les textes sont des synthèses françaises originales, pas des traductions intégrales. Les photos et les paramètres structurés sont préservés, de même que les dix premières fiches.

Dans la copie de travail locale, `backend/data/plant_expansion/editorial/rewrites.json` conserve la version éditoriale canonique, `source_review.json` indique la provenance et la relecture, et `validation.json` contient le bilan. Les textes publiés sont ceux des fiches de `backend/data/plants/`. Les descriptions intégrales des sources restent dans le cache local, sans être publiées dans le dépôt.

Les 56 tests Python des plantes et de leurs parseurs passent après la réécriture et le catalogue complet de 132 références a été rechargé. Les fiches Bacopa australis et Bolbitis heudelotii ont été vérifiées dans le navigateur. Une exécution complète du réimport confirme que les 132 fiches restent identiques et que les 122 textes éditoriaux sont conservés.

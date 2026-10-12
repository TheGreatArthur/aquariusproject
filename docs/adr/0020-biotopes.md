# 0020. Biotopes: natural habitats grouping species, written as data from published measurements
Date: 2026-10-12
Status: Accepted, extended by [0021](0021-biotope-videos-and-more-habitats.md)

## Context
The catalogue lists fish, plants and invertebrates one by one, and the simulator checks whether a chosen group can
share a tank. Nothing showed which species actually live together in the wild, what their habitat looks like, or how
aquarists recreate it, although the data to start from already existed: the FEOW ecoregions of the home page globe,
the sourced habitat texts of every species profile, the native countries of the plants (WCVP) and their GBIF records.

## Decision
- **A "Biotopes" section in the main navigation**, with an index (`/biotopes`) and one page per biotope
  (`/biotopes/<slug>`), in French, English and Japanese. Six biotopes on four continents, chosen where at least two
  of the three catalogues are represented: Rio Negro (black water), forest streams of the Gulf of Guinea, Lake Malawi
  rocky shores, Southeast Asian peat swamps, Sri Lanka's wet zone streams, Florida springs and marshes.
- **Written as data, like the practical guide** ([ADR 0008](0008-practical-guide-content.md)):
  `frontend/content/biotopes/index.js` holds what does not depend on the language (species by scientific name,
  water measurements with their source, the example tank in the simulator's format, sources); `fr.js`, `en.js` and
  `ja.js` hold the texts with the same keys. A unit test checks the structure, that every species exists in the
  catalogue (the English names of `backend/data/i18n/`) and that every photo has its credit and a caption.
- **A species is listed only if its own profile places it in that habitat** (FishBase, Seriously Fish), or, for
  plants, if GBIF has records in the region (the query is linked in the sources). The ecoregions were too coarse
  for this: the Rio Negro basin, for instance, also holds white-water fish.
- **Water figures come from primary measurements, read in the raw source** (no summaries): Küchler et al. 2000 for
  the Rio Negro, Talling & Talling 1965 for Lake Malawi, Ng & Kottelat 1994 for the Selangor peat swamps, USGS data
  for Florida (fact sheet, Water Quality Portal samples and continuous records of the Ichetucknee River). Where no
  verifiable measurement was found (West African and Sri Lankan streams), the page gives the ranges of the species
  profiles and says so.
- **An example tank per biotope, evaluated live** by the compatibility engine (`TankPreview`, shared with the home
  page preview), with a button that loads it into the simulator; an existing saved tank is replaced only after
  confirmation. Each example was adjusted until the engine reports no blocking issue or warning.
- **Photos from Wikimedia Commons only, under free licences**, downloaded and credited by
  `backend/tools/fetch_biotope_photos.py` (`make biotope-photos`) with the same checks as the species photos. "Tanks
  recreating it" shows existing biotope tanks where a free photo exists (Rio Negro, Lake Malawi, peat swamps); for the
  other biotopes the section is left out rather than filled with an unlicensed picture.
- The species pages are fetched on the server (`getCatalogue()`), so the biotope pages are rendered with their
  species and tank in the HTML, like the species pages ([ADR 0019](0019-species-pages-rendered-on-the-server.md)).

## Alternatives considered
- **Biotopes in the database, served by the API**: would let other clients read them, but they are editorial
  content in three languages, closer to the guide than to the catalogue, and the API would only pass files through.
- **Grouping species automatically by ecoregion**: no writing needed, but the groups would mix habitats (black and
  white water, rock and sand) and say nothing about the water or how to recreate it.
- **Biotope tank photos from aquarist sites or contests**: many more examples, but under no free licence.

## Consequences
- Adding a biotope means a data entry, its texts in three languages and a list of Commons titles; the tests catch a
  missing caption, an unknown species or a broken source reference.
- The catalogue gaps become visible: no peat-swamp plant and few invertebrates outside Africa and Florida.
- Figures are tied to their sources: a reader can check every value, and a correction is made in one place.

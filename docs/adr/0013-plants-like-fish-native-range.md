# 0013. Plant pages built like fish pages, with a native range map
Date: 2026-10-05
Status: Accepted

## Context
The fish and invertebrate pages share one layout ([ADR 0012](0012-invertebrates-like-fish.md)): a catalogue with
the filter in the URL and pagination, then a page with a *Dans la nature* section whose range map shows the native
countries and the GBIF observations. The plant pages ([ADR 0009](0009-plants-scraped-data-and-free-photos.md)) had
their own layout and no geography at all: only an origin sentence ("Asie du Sud-Est").

At the same time, the catalogue grew from 10 to 132 plants (122 references added from Flowgrow, with photos from
Wikimedia Commons and iNaturalist, see [docs/data/plant-expansion-2026-10-04.md](../data/plant-expansion-2026-10-04.md)),
too many for one page without pagination.

A plant range has a difficulty fish ranges rarely have: many aquarium plants are invasive (water hyacinth, Brazilian
waterweed, Canadian waterweed, water lettuce…). Their GBIF observations cover every continent, so a map of all
observations would show where they were released, not where they come from.

## Decision
- **Native and introduced countries from the World Checklist of Vascular Plants** (WCVP, Royal Botanic Gardens,
  Kew), read through its GBIF checklist. For each plant, `tools/fetch_plants.py` finds the accepted WCVP taxon (a
  synonym leads to its accepted name; a variety or cultivar missing from the list falls back to its species) and its
  distribution in TDWG botanical regions, each marked native or introduced. The regions become countries with the
  level-4 table of the TDWG standard (ISO codes), corrected where the 2001 table is outdated or wrong
  (Slovenia coded as Sierra Leone, Belarus and Latvia as Russia, Namibia as South Africa) and without the
  microstates and islets that would colour a neighbour (Andorra in the Spain region, Kinmen in South-East China).
  Only the countries of the base map are kept. The POWO page of the taxon becomes a source of the plant. When the mapped
  taxon is neither the plant's name nor its valid name (the species of a variety or cultivar, such as *Anubias
  barteri* for the dwarf Anubias), the page names it.
- **Mosses**: the WCVP only lists vascular plants. A moss gets the countries where GBIF counts at least two
  observations, on the continents Flowgrow gives as its origin, and its page says so. A plant file can replace
  the countries in `valeurs` with a cited source: Java moss (*Taxiphyllum barbieri*) has only been recorded in the
  wild in Vietnam, where GBIF has no observation of it.
- **Points from GBIF, inside the native countries only**, with the same filters as the fish
  (`tools/build_occurrences.py`): introductions declared in the records, isolated points and points outside an
  optional `emprise` of the plant file are dropped.
- **Data**: `plant_sources.json` gains the native range (`aire`) and, under `gbif`, the accepted taxon, the phylum
  and the IUCN category; `occurrences.json` gains the points. The `plante` table gains `pays`, `introduits`,
  `points`, `taxon_aire` and `uicn` (Alembic migration).
- **Pages**: the catalogue and the detail page are built like the fish ones (filter by growth form in the URL,
  12 plants per page, French alphabetical order, the scientific name shown once when there is no French name). The
  page reuses the fish profile: presentation with classification and IUCN status, then *Habitat naturel* with the
  range map, where introduced countries are drawn in amber on the map and its globe, and the lists of native and
  introduced countries beside it, with a reminder never to release aquarium plants. *En aquarium* follows with the
  growing advice and the sources.
- **Photos**: `make plants-fetch` now keeps the iNaturalist photos picked by hand (`photos_externes`) after the
  Commons ones and accepts Commons titles written without `File:`, so running it again no longer deletes the
  galleries of the added plants. Running it again also revealed that the Commons cache named its files after a
  slug of the title: titles in non-Latin scripts (`矮珍珠.jpg`, `Яванский мох.jpg`) all became `file-jpg`, and
  titles differing only by case shared a file, so four fish showed a Java moss photo and three fish a duplicate.
  The cache name now includes a hash of the title, and the photos were downloaded again and checked by eye.

## Alternatives considered
- **All GBIF observations**: invasive plants would look native everywhere.
- **Flowgrow regions** ("Tropical South America"): too coarse for a map, and they say nothing about introductions.
- **POWO website or API directly**: the same WCVP data, but GBIF already serves it with the API, cache and tests
  used for the fish.
- **Filtering points by TDWG region polygons** rather than by country: more precise for species native to part of a
  large country (United States, Brazil, China), but it needs the region shapes and a geometry library; the country
  filter matches the fish maps.

## Consequences
- ✅ Fish, invertebrates and plants share the page structure and the range map.
- ✅ Each plant shows where it comes from and where people have introduced it, from a botanical reference that is
  cited on the page.
- ⚠️ Countries are coarse for large countries: a plant native to Florida colours the whole United States (the
  points show where it really grows).
- ⚠️ Moss ranges are approximations from observations, labelled as such.

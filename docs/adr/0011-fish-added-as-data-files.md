# 0011. More fish: species added as data files, with the workbook's house rules
Date: 2026-10-05
Status: Accepted

## Context
The catalogue had 135 species, all from the Excel workbook `backend/db.xlsx`, which is not versioned. The goal
was to reach about 300 freshwater species found in the hobby, each with its water parameters, simulator
categories, a French profile and free-licensed photos.

Constraints:
- new species must behave in the simulator like the 135 existing ones, so their derived values (minimum volume,
  population points, group size, lifespan) must follow the same rules;
- every figure must come from a source page, never from a summary written by a language model;
- the repository is public, so every photo needs its author and a free licence;
- the change must be reviewable in a pull request, which a binary workbook is not.

## Decision
- **One JSON file per species** in `backend/data/fish/<species>.json`, with the same fields as a workbook row plus
  the Commons files of its photos and its sources. `backend/fish_data.py` validates the files (known categories,
  plausible ranges, credited photos) and upserts them by scientific name after the workbook in `make import`,
  so ids stay stable; `make fish` loads them alone. Each species also gets a profile in `backend/data/profiles/`
  ([ADR 0006](0006-fish-profiles-and-sources.md)).
- **Measured values from the sources** collected by `tools/fetch_sources.py`: pH, hardness (°dGH), temperature,
  standard length and tank volume from Seriously Fish quick facts, FishBase when Seriously Fish has none (a total
  length is converted with a 0.85 factor); family, author, IUCN status and native countries from FishBase; the
  GBIF taxon for the range-map points. When GBIF cannot decide between homonyms (*Trichogaster* is also a
  springtail genus) it returns the kingdom, so the match is retried within ray-finned fishes.
- **House rules measured on the workbook**, applied by `tools/draft_fish.py`: minimum volume = Seriously Fish
  volume × 1.25 (the workbook median is 1.23), rounded to 10 L below 200 L and to 50 L above, or the workbook
  median for the same size when there is no volume; population points and lifespan by size class; group size read
  in the behaviour text, otherwise the median for the way of life. Family names stay those of the catalogue
  (FishBase's new Acestrorhamphidae and Stevardiidae stay Characidae, cichlids are split into African and
  American), and the zone is the continent with most native countries, Mexico and the isthmus counting as Central
  America.
- **Editorial fields chosen by hand**: behaviour, way of life, group, diet, current, hardiness, availability and
  French common name. The tool only suggests them; `draft_fish --revue` lists the source sentences behind each
  suggestion, and every value was reviewed. Obvious errors in a source were corrected and the corrected value
  kept in the file (a 30 cm *Julidochromis regani*, a pH of 3 for *Apistogramma agassizii*).
- **Photos from Wikimedia Commons** (CC0, public domain, CC BY, CC BY-SA). `tools/fetch_fish_photos.py
  --candidats` lists the free photos of the species' categories under its catalogue name, its valid names and the
  former name used by Seriously Fish (*Pseudotropheus demasoni* for *Chindongo demasoni*). Every photo was picked
  by eye on contact sheets, because Commons categories hold misidentified fish (tiger barbs filed as
  *Desmopuntius rhomboocellatus*, a frog among firemouth cichlids). Without options, the tool downloads up to three
  photos per species to `frontend/public/images/` and writes their credits to `backend/data/fish_photos.json`;
  a new `credits` column (Alembic migration) carries them to the gallery, which shows the author and licence.
- **Species without a usable free photo are left out** rather than shown with a wrong picture: *Hypancistrus
  inspector*, *Leporacanthicus galaxias*, *Nannostomus beckfordi*, *Corydoras concolor* and *C. similis*, and
  *Symphysodon discus*, for which Commons only has ornamental strains that do not show the wild species.
- **French texts written from the sources** (Seriously Fish, FishBase), never copied, with only the facts they
  state.

## Alternatives considered
- **New rows in the workbook**: not versioned and not reviewable; the workbook stays the source of the first 135.
- **Fully automatic categories**: the keyword suggestions are often wrong (a jewel cichlid suggested as a
  herbivore, a predator as peaceful), and the simulator's warnings depend on them.
- **Photos from Seriously Fish or FishBase**: copyrighted. **Generated images**: misleading for identification.
- **Keeping a species with a photo of a related species or a strain**: a gallery must show the species it names.

## Consequences
- ✅ The catalogue grows from 135 to 304 species; every value of a new species links back to its sources and every
  photo shows its author and licence.
- ✅ Adding a species is `fetch_sources`, `draft_fish`, the review of the draft, a profile, the photo choice, then
  `fetch_fish_photos` and `make fish`; the tests check every versioned file.
- ⚠️ The 436 photos add about 106 MB to the repository (2000 px at most, JPEG quality 82).
- ⚠️ Some species have only one or two free photos.
- ⚠️ A local database created before this change lacks the `credits` column: the loaders now add missing optional
  columns to existing tables, since local databases are not tracked by Alembic.

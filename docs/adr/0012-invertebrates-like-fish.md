# 0012. Invertebrates stored and served like fish
Date: 2026-10-05
Status: Accepted

## Context
A first integration of 21 shrimps, crabs, snails and crayfish (collected on 2026-10-04, see
[docs/data/invertebrates-2026-10-04.md](../data/invertebrates-2026-10-04.md)) shipped them as a static JSON bundle
imported by the Next.js pages, with their own field names (`parametres_maintenance.temperature_c.min`,
`categorie`, `biologie.Sociabilité`...) and a detail page laid out differently from the fish pages. The data never
reached the database or the API, could not be used by the simulator, and the pages had to be maintained twice.

The goal was to give invertebrates the same structure as fish, from the data files to the pages.

## Decision
- **One file per species** in `backend/data/invertebrates/<species>.json`, with the field names of a fish file:
  `ph_mini`/`ph_maxi`, `gh_*`, `kh_*`, `temp_*`, `taille`, `litrage_mini`, `nb_individus`, `longevite`,
  `comportement`, `mode_vie`, `regime`, plus what only invertebrates need: `groupe` (crevette, crabe, escargot,
  écrevisse), `installation` (aquarium or aquaterrarium), `milieu` (fresh or also brackish water), `activite`,
  `reproduction` (where the larvae develop) and `mesure_taille` (body length, carapace width...). Values the sources
  do not give stay `null` instead of being guessed (GH and KH for most species, the size of many snails).
- **The same profile as a fish** in `profil`: valid name, author, order › family, IUCN status, range, native
  countries, presentation, habitat and behaviour, plus maintenance, feeding and reproduction advice. The
  behaviour categories are those of the fish, so the simulator can use them later.
- **Sources**: the values and texts of the first collection (Fishipedia, Aquarium Glaser, Aquarium Dietzenbach);
  GBIF for the classification, author, IUCN status and observation points; the native countries listed by
  Fishipedia, or by the GBIF distribution when Fishipedia has none. A source is corrected when it contradicts the
  description of the species: *Cherax snowden* was described from West Papua (Indonesia), not Papua New Guinea.
  Habitat, behaviour and range are new French texts written from these sources.
- **Backend**: an `invertebre` table (Alembic migration), `invertebrates.py` to validate and upsert the files
  (`make import`, or `make invertebrates` alone), and `GET /invertebres` / `GET /invertebres/<id>` shaped like the
  fish endpoints. `tools/build_occurrences.py` also fetches their GBIF points, clipped to the native range for lake
  and island endemics; the home globe still shows fish only.
- **Frontend**: the catalogue and the detail page are copies of the fish ones (SWR, filter in the URL, pagination,
  same card, same statistics, water parameters and *Dans la nature* section with the range map, reused from
  `FishProfile`), followed by an *En aquarium* section. Photos keep their credits and the kind of view (animal,
  empty shell, museum specimen), shown under the gallery when it is not only living animals.

## Alternatives considered
- **Invertebrates in the `poisson` table** with a type column: every fish query, the families filter, the globe
  and the simulator would have needed a filter, and many fish fields (population points, availability) are unknown
  for invertebrates.
- **Keeping the static bundle and only restyling the pages**: still two data paths, no API, no simulator.

## Consequences
- ✅ Fish and invertebrates share the data layout, the loading path, the API shape and the page structure.
- ✅ Adding an invertebrate is one JSON file and its photos, checked by the tests.
- ⚠️ Invertebrates are not yet in the simulator: predation, burrowing and land areas need their own rules.
- ⚠️ Three species have no georeferenced GBIF observation; their map only shows the native countries.

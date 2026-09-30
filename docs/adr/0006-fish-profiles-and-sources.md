# 0006. Fish profiles, reference sources and range maps
Date: 2026-09-30
Status: Accepted

## Context
Each fish only had aquarium figures (water ranges, size, group, behaviour) typed in the Excel workbook, with
no source. The audit of [0004](0004-data-normalization-and-audit.md) listed 14 doubtful values but nobody had
checked the rest, and the fish pages had nothing to read about the animal itself: where it lives, how it
behaves, where its name comes from.

## Decision
- **Check every fish against reference sources.** `backend/tools/fetch_sources.py` caches FishBase, Seriously
  Fish and GBIF pages (not versioned: third-party content) and extracts the facts;
  `backend/tools/compare_sources.py` compares them with the base. Wrong values become reviewed entries of
  `backend/corrections.py`, each with its reason and sources; the result is summarized in
  [data-sources-check.md](../data-sources-check.md).
- **Profiles as versioned data.** One JSON file per species in `backend/data/profiles/` (presentation, habitat,
  behaviour, range summary, native countries, IUCN status, current valid name, sources). The texts are written
  in French from the sources, never copied. `tools/draft_profiles.py` pre-fills a new profile (author,
  classification, IUCN status, countries, links); `profiles.py` validates the files and loads them into a
  `profil` table (one-to-one with `poisson`) at the end of `make import`, or alone with `make profiles`.
- **API:** `GET /poissons/<id>` returns a `profil` object; the list endpoint does not, to stay light.
- **Range maps without a tile server.** The points are GBIF occurrences (museum specimens, observations)
  restricted to the native countries, an optional bounding box per profile and without isolated points
  (`tools/build_occurrences.py` → `data/occurrences.json`); hand-entered type localities fill the gaps. The
  front end draws them with d3-geo on a Natural Earth 1:50m base map with lakes and rivers
  (`frontend/public/maps/world-50m.json`, 545 kB, built by `scripts/build-world-map.sh`), plus a small globe.
- **Taxonomy:** aquarium names stay as they are; the profile shows the current valid name when a recent
  revision changed it (e.g. *Corydoras sterbai* → *Hoplisoma sterbai*). Family changes of 2024 are listed,
  not applied.

## Alternatives considered
- **Link to FishBase instead of writing texts:** no content on the site, and FishBase is written for
  scientists, in English.
- **Store the texts in the Excel workbook:** the workbook is not versioned; long texts would be unreviewable.
- **Leaflet with online tiles:** richer zoom, but depends on a third-party tile server (usage limits, keys,
  privacy) for a small map; the static base map fits the dark design and works offline.
- **Countries only, no points:** coarse for species living in a single lake or stream (Lake Kutubu, Río Acandí).

## Consequences
- ✅ 98 corrected values on 63 fish, each traceable to a source; the audit now lists 8 values, all confirmed.
- ✅ 135 fish pages with a presentation, a habitat section with a range map, a behaviour section and sources.
- ✅ Adding a species follows a documented path: fetch sources, draft the profile, write the texts, fetch points.
- ❌ The texts must be maintained by hand when the data changes; the tests only check their structure.
- ⚠️ Source pages can change or disappear; the cache and the links in each profile keep the check reproducible,
  and GBIF points can be refreshed with `make occurrences`.

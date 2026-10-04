# 0009. Aquarium plants: scraped growing data and free-licensed photos
Date: 2026-10-04
Status: Accepted

## Context
The catalogue only covered fish, while the practical guide already recommends plants (Anubias, Java fern,
Cryptocoryne…) that had no page of their own. The goal was a `plante` table filled by scraping about ten plants
that are common in the hobby, with their water parameters, family and growing needs, three photos each, and a
`/plantes` page listing them.

Constraints:
- the repository is public, so every photo must be reusable, with its author and licence shown;
- every figure must be traceable to a source (an earlier lesson: page summaries made by a language model
  invented numbers, so values are read from the raw pages);
- scraping must be polite, reproducible and testable without network access;
- texts are in French, written from the sources and never copied.

## Decision
- **One source per kind of value**, chosen for what it does best:
  - [Flowgrow](https://www.flowgrow.de/db/aquaticplants) (community plant database, whose `robots.txt`
    allows `/db/`): pH, KH, tolerated and optimum temperature, light, growth rate, difficulty, placement,
    propagation, emersed growth and growth form;
  - [Tropica](https://tropica.com/en/plants/) (the reference grower): average height two months after planting
    and CO₂ need;
  - [GBIF](https://www.gbif.org/) backbone: current order and family, author, and the valid name when the trade
    name has become a synonym (*Microsorum pteropus* → *Leptochilus pteropus*, *Taxiphyllum barbieri* →
    *Ectropothecium barbieri*, *Echinodorus grisebachii* → *Aquarius grisebachii*);
  - [Wikimedia Commons](https://commons.wikimedia.org/): photos under CC0, public domain, CC BY or CC BY-SA only.
- **`backend/tools/fetch_plants.py`** (`make plants-fetch`) parses the pages with BeautifulSoup, translates the
  labels into fixed French categories, writes `backend/data/plant_sources.json` (versioned, so the import works
  offline) and downloads the photos to `frontend/public/plants/` (2000 px at most, progressive JPEG quality 82,
  like `make images`). It reuses the cache and the one-second delay per host of `tools/fetch_sources.py`, with an
  identifying User-Agent, and refuses a photo whose licence is not free or whose author is unknown.
- **Hand-written files** `backend/data/plants/<plant>.json`: French common name, origin, presentation and growing
  advice, the Flowgrow and Tropica pages, and the Commons files picked after looking at every candidate (aquarium
  shots first, no herbarium sheets or drawings). A file can complete a missing value in `valeurs` and cite its
  source: Flowgrow has no pH or KH for *Echinodorus* 'Bleherae', taken from Quality Marine instead.
- **`backend/plants.py`** merges both files, validates the result (categories, ranges, optimum inside the
  tolerated temperatures, credits of each photo), upserts by scientific name so ids stay stable, and removes
  plants whose file was deleted. `make import` loads the plants with the fish; `make plants` loads them alone.
  An Alembic migration creates the `plante` table, separate from the fish nomenclature tables.
- **API and pages**: `GET /plantes` returns short fields and the main photo, `GET /plantes/<id>` everything.
  `/plantes` lists the plants with a search and a filter by growth form; `/plantes/[id]` shows the photos with the
  credit of the visible one, the water parameters (optimum band inside the tolerated temperatures), the placement
  and the texts. The gallery, range bar and prose components are shared with the fish pages.

## Alternatives considered
- **Scraping services** found on skills.sh (Firecrawl, Apify, Bright Data, ScrapeGraphAI): they need paid
  accounts and API keys, and two server-rendered sites do not need a headless browser.
- **Flowgrow or Tropica photos**: copyrighted.
- **Generated images**: they do not show real specimens, which is misleading for identification.
- **Flowgrow alone**: no height for eight of the ten plants, no pH or KH for *Echinodorus*.
- **Values only in the database**: not reviewable in a pull request; JSON files keep the data diffable, like the
  fish profiles of [ADR 0006](0006-fish-profiles-and-sources.md).

## Consequences
- ✅ Every value links back to its page (Flowgrow, Tropica, GBIF, or a cited source in `valeurs`), and every photo
  shows its author and licence on the plant page.
- ✅ Adding a plant is one JSON file, then `make plants-fetch` and `make plants`; the tests check the new file.
- ⚠️ The parsers depend on the markup of two sites. Tests on HTML fixtures catch regressions in the parsers, and
  the tool reports missing pages and unknown labels, but a redesign of a site would need new parsers.
- ⚠️ Tropica heights are measured two months after planting; large plants such as *Echinodorus* grow much taller,
  which the texts say.
- ⚠️ The thirty photos add 11 MB to the repository.
- ⚠️ GBIF follows recent splits that aquarists rarely use (*Aquarius* for *Echinodorus*): pages show the trade name
  first and the valid name next to it.

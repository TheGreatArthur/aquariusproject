# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Fish profiles ([ADR 0006](docs/adr/0006-fish-profiles-and-sources.md)): each of the 135 fish pages now has a
  "Dans la nature" section with a presentation (description, naming, taxonomy, IUCN status), the natural habitat
  with a range map (native countries, GBIF observations, rivers and lakes, locator globe), the behaviour and the
  sources. Texts are written in French from FishBase, Seriously Fish and GBIF and versioned in
  `backend/data/profiles/`; `GET /poissons/<id>` returns them as `profil`.
- `make sources`, `make occurrences` and `make profiles`, plus `backend/tools/` to fetch reference data,
  compare it with the base, draft new profiles and refresh the range-map points.
- Simulator: new compatibility engine ([ADR 0005](docs/adr/0005-compatibility-rules-engine.md),
  [rules](docs/compatibility-rules.md)) with 14 rules and three levels (blocking, to watch, good to know):
  shared water range across species, declared predators, mouth size, temperament gap, water current, biotope,
  solitary / aggressive / pair / harem species, delicate species, overpopulation, under-sized groups and
  incompatible families. All conflicts are reported, the shared water range is shown, and each species
  previews its risks before being added.
- Front-end unit tests with Vitest (26 tests), run by `make test` and in CI.
- Data quality ([ADR 0004](docs/adr/0004-data-normalization-and-audit.md)): the Excel import now normalizes
  labels into fixed categories (behaviour 9 → 6, way of life 15 → 5, water current 16 → 9 combinations,
  hardiness, availability, diet, region), applies reviewed corrections from `backend/corrections.py`
  and removes unused label variants.
- `make audit` writes `docs/data-audit.md`, the list of suspicious values to check by hand.
- API: each fish now exposes `nom_robustesse`, `nom_zone_geo` and `nom_courant`.
- Accessibility: labelled icon buttons, visible focus rings, `prefers-reduced-motion` support.
- One-command developer workflow: `make dev`, `make test`, `make lint`, `make build`, `make import`.
- Backend test suite (pytest, 11 tests) and GitHub Actions CI (ruff, pytest with coverage, ESLint, Next.js build).
- Architecture decision records in `docs/adr/`, PR and issue templates, MIT licence.
- `.env.example` for the front end; backend config driven by `AQUARIUS_DSN` / `AQUARIUS_EXCEL_FILE`.

### Changed
- **UI redesign** ([ADR 0003](docs/adr/0003-ui-redesign-tailwind.md)): Tailwind CSS design system (dark theme,
  teal accent, Space Grotesk / Inter), new header with mobile menu, footer, home page with a photo hero,
  "how it works" steps and family showcase, fish cards with search and family chips, fish detail page with
  photo gallery and water-parameter ranges, restyled simulator (water form, verdict, tank load bar) and
  contact form with sending status, "Guide pratique" preview and a custom 404 page.
- Routes renamed to lowercase: `/simulation`, `/contact`, matching the navigation links.
- Replaced React-Bootstrap, Sass, Font Awesome, react-icons and the range sliders with Tailwind CSS,
  Framer Motion and lucide-react.
- SQLite is now the default database, so a fresh clone runs without a MySQL server.
- README rewritten in English with architecture diagram and quick start.

### Fixed
- Fish data checked against FishBase and Seriously Fish ([report](docs/data-sources-check.md)): 98 values
  corrected on 63 fish in `backend/corrections.py`, including water ranges (tiger barb, *Corydoras sterbai*,
  *Aborichthys elongatus*…), sizes, families (Serrasalmidae, Botiidae, Gastromyzontidae, Nemacheilidae,
  Nothobranchiidae), regions (Central America for platys and swordtails, new "Océanie" for rainbowfishes),
  behaviours (tiger barb, *Betta gladiator*, *Gambusia*…), misspelt names and wrong common names
  ("Poisson-zèbre" for the zebra pleco, "Poisson du paradis" for a killifish). "Cyprinidé" is normalized to
  "Cyprinidae". A species renamed by a correction keeps its row and id on re-import.
- Simulator: an empty volume field no longer empties the tank, and saved tanks are refreshed with the latest
  fish data; adding a species adds its minimum group.
- Mariposa (*Cichla ocellaris*), a 60 cm piscivore, was labelled "peu agressif"; it is now "prédateur".
- Simulator: the external hot-linked images are replaced by local ones; the unused pH range slider and
  debug logs are removed.
- Fish detail page crashed on a freshly imported database: the Excel import now fills `poisson.images`.
- Excel import tested the *Points* column instead of *Courant* before setting the water current.
- `/Simulation/starting` failed to build on case-sensitive file systems (`results.js` was in `app/simulation/`).
- `/cours` was not a valid React page and broke the production build.
- `Flask-Cors` was missing from `requirements.txt`.

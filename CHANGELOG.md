# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **World globe on the home page** ([ADR 0010](docs/adr/0010-home-globe-freshwater-ecoregions.md)): a canvas globe
  that turns in any direction (mouse, finger, keyboard), zooms (buttons, pinch, +/-) and shows one marker per
  freshwater ecoregion where the catalogue fish live (121 zones from the Freshwater Ecoregions of the World,
  sized by number of species). Picking a zone, on the globe or in the list by realm, flies to it, lights up the
  observations of its species and lists the fish with a link to their page. `make ecoregions` places each
  species with its range-map points; `scripts/build-globe-map.sh` builds the light 1:110m base map that keeps
  the globe at 60 fps.
- **Plant catalogue** ([ADR 0009](docs/adr/0009-plants-scraped-data-and-free-photos.md)): a `plante` table
  (Alembic migration) with 10 aquarium plants common in the hobby, `GET /plantes` and `GET /plantes/<id>`, a
  `/plantes` page with a search and a filter by growth form, and a page per plant (photos with their credits,
  pH, KH, tolerated and ideal temperature, light, CO₂ need, height, placement, propagation, French presentation
  and growing advice). `make plants-fetch` scrapes the values from Flowgrow (water and growing parameters),
  Tropica (height in the tank, CO₂ need) and GBIF (current name and family) and downloads three photos per plant
  from Wikimedia Commons, free licences only; `make import` and `make plants` load them. The plants course links
  to the catalogue.
- **Practical guide** ([ADR 0008](docs/adr/0008-practical-guide-content.md)): `/cours` now holds six courses
  (nitrogen cycle, water parameters, temperature and equipment, plants and decor, maintenance, introducing and
  feeding fish) instead of four "coming soon" cards. Each course has a table of contents, reading time, key
  points and sources (UF/IFAS, OATA, RSPCA, Tropica, USGS, Emerson et al. 1975, Hovanec et al. 1998).
  Diagrams are computed from tested formulas: free ammonia by pH and temperature, oxygen saturation, CO₂ from
  KH and pH, hardness units (°dGH and French °f), typical cycling curves, a layout plan, the pH ranges of
  catalogue species (live from the API), plus a free ammonia calculator and an equipment calculator.
  The simulator and fish pages link to the water parameters course.
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
- Range bars write French decimals (6,5) like the course pages, and can show an ideal band inside the tolerated
  range. The gallery, range bar and prose components moved out of `components/fish/` to be shared.
- The header keeps its five links on one line between 768 and 1024 px (the Instagram icon shows from 1024 px).
- **Design review** ([rules](docs/design-rules.md)), keeping the dark theme and teal accent: the home hero fits
  on two lines with one CTA label ("Simuler un bac") used everywhere, the "three steps" section shows a real
  screenshot of the simulator instead of three numbered cards, glows, gradient text and extra uppercase labels
  are gone, and corner radii follow one scale. Fish cards and the family mosaic use two columns on phones,
  and the family label moved from the photo to the card text. Fish pages keep the gallery in view while
  scrolling and show the scientific name once when there is no common name. Simulator result cards put the
  risk of adding a species on its own line, and "Tout vider" asks for confirmation. Skip link, `theme-color`,
  balanced headings and non-breaking spaces before French punctuation. README screenshots updated.
- **Next.js 16 and React 19** ([ADR 0007](docs/adr/0007-nextjs-16-react-19.md)), with Turbopack for dev and
  build, Framer Motion 12, SWR 2.5, React Hook Form 7.89 and ESLint 9 (flat config, `npm run lint`). State copied
  from props or the URL through effects is now derived during render. The simulator is rendered in the browser
  only, so the saved tank is read without a hydration step; species that no longer suit the water are hidden
  from the tank instead of deleted, and come back when the water is changed back.
- Fish and family photos downscaled to 2000 px at most and re-encoded (progressive JPEG, quality 82):
  `public/images` and `public/families` go from 112 MB to 42 MB (largest file 0.42 MB instead of 5.5 MB)
  and the first display of a large photo is about twice as fast. `make images` runs
  `frontend/scripts/optimize-images.py` on new photos.
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

### Removed
- Cypress, installed but without any test (its binary download was already disabled in CI).

### Fixed
- Footer: the "Suivre" heading sat on the same line as the Instagram link.
- Form labels were uppercased, which displayed "pH" as "PH"; the tank load read "0 / — points" without a volume.
- Catalogue: typing a search while a family filter was active erased the first letter typed.
- Simulator: the saved tank and water are read after the first render, which removes the hydration error
  (the whole page was re-rendered in the browser) when a tank had been saved; unreadable or blocked local
  storage no longer breaks the page.
- Fish search ignores accents and matches anywhere in the names ("pleco" finds "Pléco zèbre", "neon" finds
  "Faux-néon"); every word must match. The catalogue loads the list once and filters it in the browser.
- API: `%` and `_` are searched as plain text in `q` and `famille`, `/poissons/<id>` only accepts numbers,
  and the search no longer prints its SQL query.
- Each page now has its own browser title and description; fish pages use the fish's common name.
- "Retour" on a fish page opened from a shared link goes to the catalogue instead of leaving the site.
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

### Security
- Next.js 13.4.7 → 13.5.11 (and `eslint-config-next`), which fixes the middleware authorization bypass
  (GHSA-f82v-jwr5-mffw) and the zod DoS; Vitest 3 → 4 and `npm audit fix` for the development tools.
  The remaining Next.js advisories (two critical) are fixed by the move to Next.js 16: `npm audit` reports
  0 vulnerabilities.

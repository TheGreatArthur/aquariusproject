# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
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
- Simulator: the external hot-linked images are replaced by local ones; the unused pH range slider and
  debug logs are removed.
- Fish detail page crashed on a freshly imported database: the Excel import now fills `poisson.images`.
- Excel import tested the *Points* column instead of *Courant* before setting the water current.
- `/Simulation/starting` failed to build on case-sensitive file systems (`results.js` was in `app/simulation/`).
- `/cours` was not a valid React page and broke the production build.
- `Flask-Cors` was missing from `requirements.txt`.

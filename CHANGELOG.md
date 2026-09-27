# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- One-command developer workflow: `make dev`, `make test`, `make lint`, `make build`, `make import`.
- Backend test suite (pytest, 11 tests) and GitHub Actions CI (ruff, pytest with coverage, ESLint, Next.js build).
- Architecture decision records in `docs/adr/`, PR and issue templates, MIT licence.
- `.env.example` for the front end; backend config driven by `AQUARIUS_DSN` / `AQUARIUS_EXCEL_FILE`.

### Changed
- SQLite is now the default database, so a fresh clone runs without a MySQL server.
- README rewritten in English with architecture diagram and quick start.

### Fixed
- Fish detail page crashed on a freshly imported database: the Excel import now fills `poisson.images`.
- Excel import tested the *Points* column instead of *Courant* before setting the water current.
- `/Simulation/starting` failed to build on case-sensitive file systems (`results.js` was in `app/simulation/`).
- `/cours` was not a valid React page and broke the production build.
- `Flask-Cors` was missing from `requirements.txt`.

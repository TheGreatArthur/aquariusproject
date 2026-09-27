# 0001. Next.js front end + Flask API
Date: 2026-09-27
Status: Accepted

> Documented retroactively: the decision was taken when the project started (2023).

## Context
Aquarius is a catalogue of aquarium fish plus a compatibility simulator. It needs a rich,
interactive UI (search, carousels, a "basket" of fish checked against tank parameters) and a
small read-only API over a relational dataset maintained in Excel. The project was also a
learning exercise in building a decoupled front end / back end.

## Decision
- **Front end:** Next.js 13 (App Router) with React 18, React-Bootstrap and Sass. Data is fetched
  client-side with SWR. Next.js rewrites `/api/*` to the Flask server, so the browser only talks
  to one origin.
- **Back end:** Flask + Flask-SQLAlchemy (SQLAlchemy 2 typed models), exposing JSON endpoints.
- **Validation logic** (over/under-population, cohabitation, predation) lives in the front end
  (`frontend/lib/validations`) because it only works on the user's basket.

## Alternatives considered
- **Next.js only (API routes + Prisma):** one language and one deployment, but the team already
  knew Python/SQLAlchemy and the Excel import is simpler in Python (openpyxl).
- **Django + templates:** batteries included, but a less dynamic UI and no React practice.
- **Create React App:** the project started from it; Next.js replaced it for routing and the
  built-in API proxy.

## Consequences
- ✅ Clear separation: the API can be reused (e.g. by a mobile app) and tested on its own.
- ✅ The `/api` rewrite avoids CORS issues in the browser.
- ❌ Two runtimes (Node + Python) to install and run; mitigated by `make dev`.
- ❌ Business rules in the browser can be bypassed; acceptable since nothing is persisted.

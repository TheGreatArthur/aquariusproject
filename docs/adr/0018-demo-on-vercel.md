# 0018. Public demo on Vercel, API reading a versioned database snapshot
Date: 2026-10-11
Status: Accepted

## Context
The project had no public demo. The front end is a Next.js 16 app; the API is a Flask app that only reads data
(GET routes). Its SQLite database is built locally from the Excel workbook (`make import`), and neither the
workbook nor the database nor `backend/config.py` are versioned, so an API deployed from Git would start empty.
The site serves about 300 MB of photos through `next/image`.

## Decision
- **Two Vercel projects from the same repository**, on the free Hobby plan: `frontend/` (Next.js) and
  `backend/` (Flask, detected from `app.py` and run as a Python function, Python 3.12 from `.python-version`).
  Vercel builds both from GitHub, so every push to `main` redeploys them; nothing is uploaded from a local folder
  except, once, the API (`backend/.vercelignore` keeps the virtualenv, the workbook and the local database out).
- **A versioned, read-only database snapshot**: `make demo-db` copies and compacts the local database into
  `backend/demo/aquarius.db` (2.5 MB). Without `config.py`, `app.py` opens it as a read-only, immutable SQLite file
  (`mode=ro&immutable=1`), unless `AQUARIUS_DSN` points elsewhere. The snapshot is refreshed and committed after
  `make import` when the data changes; a test runs the API without `config.py` against it.
- **The front end reaches the API through its existing `/api` rewrite**: `BACKEND_URL` is the API's production
  address, `NEXT_PUBLIC_SITE_URL` the site's, for the sitemap and share images.
- **Image transformations kept for a month** (`images.minimumCacheTTL`) because Vercel counts them against a
  monthly quota; `IMAGES_UNOPTIMIZED=1` serves the original photos if the quota runs out.

## Alternatives considered
- **API on Render or Railway**: the usual home for Flask, but the free plans put the service to sleep, so the first
  visit waits about a minute.
- **Hosted Postgres (Neon) filled from the local database**: closer to a real production setup, but it adds an
  account, credentials and an import step for data that never changes at run time.
- **Next.js API routes reading the data directly**: one deployment, but it would rewrite the API layer and its tests.

## Consequences
- ✅ Free, always-on demo; the site and the API redeploy on every merge into `main`.
- ✅ The repository builds the demo on its own, without the workbook.
- ⚠️ The snapshot can lag behind the data files: `make demo-db` must be run and committed after `make import`.
- ⚠️ Twenty fish, the family tiles and the home photo still use images of unknown licence (see
  `docs/data/data-completion-2026-10-10.md`); they are public on the demo as they are on GitHub.
- ⚠️ The contact form needs the EmailJS variables in the Vercel project, otherwise it shows its error message.

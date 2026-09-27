# 0002. SQL database fed from an Excel workbook, SQLite by default
Date: 2026-09-27
Status: Accepted

## Context
The fish data (135 species, 24 attributes each) is curated by hand in an Excel workbook
(`Poissons` sheet). The API needs to filter and join on it (family, genus, behaviour…).
Originally the app required a MySQL server and a git-ignored `config.py` with credentials,
so a fresh clone could not start without manual setup.

## Decision
- The **Excel workbook stays the source of truth**. `backend/import_excel.py` creates the schema
  and upserts every fish (matched on scientific name). Repeated values (family, genus, water type,
  behaviour…) are normalised into lookup tables.
- The database is accessed through **SQLAlchemy**, so the engine is just a URL (`AQUARIUS_DSN`).
  The default is a **local SQLite file** (`backend/aquarius.db`); MySQL/PostgreSQL remain possible
  by setting the variable.
- Schema changes after the initial creation go through **Alembic** migrations.
- Fish pictures live in `frontend/public/images` and are named after the Excel `code` column
  (`<code>.jpg`, `<code>.1.jpg`, …). The import stores the list in `poisson.images`.

## Alternatives considered
- **Serve the Excel file directly** (pandas in memory): no DB, but no SQL filtering/joins, and
  the data model would stay implicit.
- **MySQL only:** closest to production hosting, but heavy for local development and CI.
- **Admin UI to edit data:** more work than the project needs today; Excel is what the author uses.

## Consequences
- ✅ `make dev` works from a clean clone with no database server.
- ✅ Tests run against in-memory SQLite.
- ❌ SQLite and MySQL differ slightly (e.g. case-insensitive `LIKE`); `ilike` is used to stay portable.
- ❌ The workbook is not versioned in the repository (`*.xlsx` is git-ignored), so a fresh clone
  starts with an empty catalogue until `backend/db.xlsx` is provided.

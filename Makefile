# Aquarius — developer commands. Run `make help` for the list.

PY_VENV := backend/venv
PY      := $(PY_VENV)/bin/python
PIP     := $(PY_VENV)/bin/pip
BACKEND_PORT  ?= 5001
FRONTEND_PORT ?= 3000

.DEFAULT_GOAL := help
.PHONY: help setup install dev backend frontend import profiles sources occurrences images audit test lint build clean

help: ## Show available commands
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-10s %s\n", $$1, $$2}'

setup: install ## Install dependencies and create local config files
	@test -f backend/config.py || cp backend/config.py.DIST backend/config.py
	@test -f frontend/.env.local || cp frontend/.env.example frontend/.env.local

install: $(PY_VENV) frontend/node_modules

$(PY_VENV): backend/requirements.txt backend/requirements-dev.txt
	python3 -m venv $(PY_VENV)
	$(PIP) install -q -r backend/requirements-dev.txt
	@touch $(PY_VENV)

frontend/node_modules: frontend/package-lock.json
	cd frontend && CYPRESS_INSTALL_BINARY=0 npm ci
	@touch frontend/node_modules

dev: setup ## Start the Flask API and the Next.js front end
	@echo "API: http://localhost:$(BACKEND_PORT)  |  Web: http://localhost:$(FRONTEND_PORT)"
	@trap 'kill 0' INT TERM EXIT; \
	$(MAKE) --no-print-directory backend & \
	$(MAKE) --no-print-directory frontend & \
	wait

backend:
	cd backend && venv/bin/flask --app app run --debug --port $(BACKEND_PORT)

frontend:
	cd frontend && BACKEND_URL=$${BACKEND_URL:-http://localhost:$(BACKEND_PORT)} npx next dev -p $(FRONTEND_PORT)

import: setup ## Load backend/db.xlsx into the database
	cd backend && venv/bin/python import_excel.py

profiles: setup ## Load the fish profiles (backend/data) into an imported database
	cd backend && venv/bin/python profiles.py

sources: setup ## Fetch FishBase, Seriously Fish and GBIF data and compare it with the base
	cd backend && venv/bin/python -m tools.fetch_sources && venv/bin/python -m tools.compare_sources

occurrences: setup ## Refresh the range-map points from GBIF (backend/data/occurrences.json)
	cd backend && venv/bin/python -m tools.build_occurrences

images: setup ## Downscale new fish and family photos (2000 px, JPEG quality 82)
	$(PY) frontend/scripts/optimize-images.py

audit: setup ## Write the data audit report to docs/data-audit.md
	cd backend && venv/bin/python audit_data.py > ../docs/data-audit.md

test: setup ## Run backend (pytest) and front-end (Vitest) tests
	cd backend && venv/bin/python -m pytest --cov=. --cov-report=term-missing
	cd frontend && npm test

lint: setup ## Lint backend (ruff) and front end (ESLint)
	cd backend && venv/bin/ruff check .
	cd frontend && npx next lint

build: setup ## Production build of the front end
	cd frontend && npx next build

clean: ## Remove virtualenv, node_modules and build output
	rm -rf $(PY_VENV) frontend/node_modules frontend/.next

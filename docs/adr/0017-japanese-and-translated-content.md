# 0017. Japanese version, translated species data and guide, language menu
Date: 2026-10-10
Status: Accepted (extends [0015](0015-english-version-and-light-theme.md))

## Context
ADR 0015 added an English interface but left the content in French: species common names and texts, the practical
guide and its diagrams. The site now also needs a Japanese version, every species name and text in both languages,
and a way to pick the language from any page. The Instagram link in the header and footer is removed.

## Decision
- **Japanese under `/ja`**, built like English: `proxy.js` rewrites `/ja/...`, `t('français', 'English', '日本語')`
  takes a third argument everywhere (a unit test parses the code and fails on a `t()` call with fewer than three).
  Category values from the API are translated in `lib/glossary.ts`, country names come from Natural Earth's `NAME_JA`
  and ecoregion names from `backend/data/ecoregions_ja.json`.
- **A language menu in the header** (and a language list in the footer, where Instagram was) links to the same page
  in each language; links are plain `<a>` so the page reloads with the right `<html lang>`.
- **Species data is translated by the API**, not stored in the database: `backend/data/i18n/<lang>/<catalogue>.json`
  gives, for each species (key: its scientific name), its common name and texts. `?lang=en` or `?lang=ja` swaps them
  in on every list and detail route (`translations.py`); a missing field stays French. The front end adds `?lang=`
  through `api()`. The 304 fish, 132 plants and 21 invertebrates are translated; a backend test fails if a versioned
  species, or one of its texts, has no English or Japanese version.
- **Names**: the established English name; in Japanese the name used by Japanese shops when there is one (e.g.
  アベニーパファー, ラミーノーズ・テトラ), otherwise the scientific name in katakana.
- **The practical guide has one file per lesson and language** (`content/cours/en/`, `content/cours/ja/`) with the
  same slugs, section ids, blocks, diagrams and sources as the French one; a test compares their structure, so links
  and anchors stay valid. Diagrams translate their labels; `typo()` applies French spacing only in French, and the
  reading time of Japanese counts characters (500 a minute).

## Alternatives considered
- **Translated columns in the database**: the translations would have to go through the Excel import and every
  model; JSON files next to the other versioned data are reviewable and need no migration.
- **A translation service at build time**: unreviewed machine output for species texts, and a runtime dependency.
- **Translating the guide string by string inside the French file**: keeps one structure, but makes every lesson
  three times harder to read and edit.

## Consequences
- ✅ The whole site, species data and guide included, reads in French, English and Japanese.
- ✅ Adding or editing a species text in French shows up in English and Japanese only once its translation is
  written; the coverage test lists what is missing.
- ⚠️ Each text exists three times: corrections must be made in each language.
- ⚠️ The contact page keeps its Instagram card (the request was about the header and footer).

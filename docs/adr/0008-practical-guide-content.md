# 0008. Practical guide written as data, with computed diagrams
Date: 2026-10-04
Status: Accepted

## Context
The "Guide pratique" page (`/cours`) only listed four chapters marked "Bientôt". Beginners need the basics that
the simulator assumes: the nitrogen cycle, water chemistry (pH, GH, KH, CO₂), equipment, plants, maintenance and
how to introduce fish. The content must be accurate (every figure traceable to a source), readable on a phone,
in French with correct typography, and consistent with the [design rules](../design-rules.md).

## Decision
- **Six courses as plain data** in `frontend/content/cours/*.js`: sections of typed blocks (`p`, `liste`,
  `etapes`, `flux`, `colonnes`, `tableau`, `encadre`, `figure`) rendered by `components/cours/Blocs.js`.
  Strings use a light markup (`**bold**`, `*italic*` for species, `[link](/path)`) parsed by `lib/cours/texte.js`,
  which also inserts the French non-breaking spaces (before `: ; ? ! %`, inside « », between numbers and units).
- **Diagrams are components computed from formulas**, not images: un-ionised ammonia (Emerson et al. 1975),
  oxygen saturation (Benson & Krause, USGS tables), CO₂ from KH and pH, hardness units (°dGH ↔ °f), heater
  sizing (EHEIM table). The formulas live in `lib/cours/chimie.js` and `lib/cours/equipement.js` and are tested
  against the published tables. Two calculators (free ammonia, equipment for a given volume) are client
  components; the species pH chart reads the live catalogue through the API.
- **Static pages**: `/cours/[slug]` is prerendered with `generateStaticParams`, with a table of contents, reading
  time, key points, sources and previous / next links.
- **Content tests** (`lib/cours/__tests__/contenu.test.js`) fail on an unknown block or diagram, a broken internal
  link or anchor, a missing source, an em dash, three-dot ellipses or straight double quotes.
- **Sources**: university extension services (UF/IFAS), the trade association OATA, the RSPCA, Tropica,
  USGS, manufacturers' data and peer-reviewed papers. Texts are written from them, never copied.

## Alternatives considered
- **MDX**: natural for prose, but inline diagrams, French typography and link checks would need custom plugins,
  and the content would not be testable as data.
- **A headless CMS**: overkill for six pages maintained by the developer, and adds a runtime dependency.
- **Diagrams as images** (drawn or generated): heavier, not themable, not accessible, and their figures could not
  be checked by tests.

## Consequences
- ✅ Every number shown in a diagram comes from a tested function or a cited table.
- ✅ Adding a course is adding one data file to `content/cours/index.js`; the tests check it.
- ⚠️ Writing long prose in JavaScript strings is less comfortable than Markdown.
- ⚠️ The species pH chart needs the API; it shows a message if the catalogue cannot be loaded.

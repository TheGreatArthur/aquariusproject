# 0005. Compatibility rules engine with severities
Date: 2026-09-29
Status: Accepted

## Context
The simulator had 5 rules spread over `frontend/lib/validations`, plus a copy of one of them in the species
list. They compared free-text labels (`nom_comportement === 'agressif'` saw 2 of the 12 aggressive or
predatory species), stopped at the first conflict, used a fixed 7 cm size gap for predation, and had a single
level: any warning made the whole tank "not OK". Useful data (water current, hardiness, region, way of life)
was not used at all, and nothing checked that the species could share the same water.

With the labels now normalized at import ([0004](0004-data-normalization-and-audit.md)), the rules can rely
on fixed categories.

## Decision
- One module, `frontend/lib/compat`: small pure functions `rule(tank, environment) → issues[]`, each issue
  being `{ rule, severity, message, ids }`. `evaluate()` runs them all and returns the verdict, the issues
  sorted by severity, the fish involved and the water range shared by all species.
- Three severities: **error** (blocks: the population is incompatible), **warning** (to watch), **info**.
- 14 rules, documented in [compatibility-rules.md](../compatibility-rules.md), calibrated on the real data by
  counting how many of the 9,045 species pairs each rule flags.
- `issuesIfAdded()` previews the new conflicts a species would create, so the list warns *before* adding.
- Adding a species adds its minimum group at once instead of a single fish.
- Rules stay in the front end (they only need the tank, which lives in the browser) and are unit-tested
  with Vitest, which now runs in CI.

## Alternatives considered
- **Keep the rules as they were and patch the labels:** leaves the single-conflict and single-level issues.
- **Rules on the Flask API:** one source of truth for other clients, but a round trip on every change and
  nothing is persisted yet; can move later since the functions are pure.
- **Rules as data (JSON rule definitions):** attractive for non-developers, but the rules need arithmetic
  (ratios, overlaps, levels) that a DSL would have to reimplement. Only the incompatible family pairs are data.

## Consequences
- ✅ Every conflict is reported, with a clear level and the species involved; common water range shown.
- ✅ 26 unit tests with fixtures copied from real fish; rules are easy to add or tune.
- ❌ Rules depend on data quality: doubtful values (see `docs/data-audit.md`) produce false alerts.
- ⚠️ Thresholds (×3 for mouth size, 2 levels of temperament, 80 % load) are heuristics to review with
  experienced fishkeepers.

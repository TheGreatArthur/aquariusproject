# 0004. Data normalization, reviewed corrections and audit
Date: 2026-09-29
Status: Accepted

## Context
The fish data comes from an Excel workbook typed by hand (see [0002](0002-database-and-excel-import.md)).
The same idea is written in many ways: 9 behaviour labels for 5 ideas (`"peu agressif "`, `"Peu agressif"`,
`"agressif , prédateur "`…), 15 ways of life, 16 water currents, trailing spaces everywhere. Some values are
also doubtful (a 60 cm piscivore labelled "peu agressif", GH ranges up to 40, 34 °C for a tetra).

The simulator's compatibility rules need reliable categories: comparing free text made the "aggressive fish"
rule see only 2 of the 12 aggressive or predatory species.

## Decision
- **Normalize at import** (`backend/normalize.py`): trim spaces and map every label to a fixed category:
  behaviour `pacifique < peu agressif < territorial ≈ moyennement agressif < agressif < prédateur`,
  way of life `solitaire | couple | harem | petit groupe | banc`, water current as an ordered list of
  `stagnant < doux < modéré < fort`, region at continent level. When a label offers several options
  ("solitaire ou couple"), the most social one is kept so the simulator only warns when none is respected.
  Unknown labels raise an error instead of being stored silently.
- **Reviewed corrections as code** (`backend/corrections.py`): each override is keyed by scientific name and
  carries its justification, so it is reviewed in a pull request. Only certain fixes go there.
- **Audit instead of guessing** (`backend/audit_data.py`, `make audit` → `docs/data-audit.md`): plausibility
  checks (inverted ranges, unusual temperature/GH/pH, minimum group larger than the minimum tank, "solitary"
  fish kept in groups, big carnivores labelled peaceful). Doubtful values are listed for a human to check
  against a reliable source, not changed automatically.
- The workbook stays the source of truth; the import removes label variants no longer used.

## Alternatives considered
- **Fix the workbook by hand:** simplest, but the file is not versioned, fixes are invisible in review and
  new typos come back with the next edit.
- **Free-text matching in the front end** (`includes('agressif')`): brittle, duplicated in every rule.
- **Move the data to seed files in the repo now:** the right long-term target (versioned data, schema
  validation in CI), but a bigger change; this ADR is a step towards it.

## Consequences
- ✅ Rules can rely on a small, known set of values; unknown labels fail the import loudly.
- ✅ Every correction is traceable (who, why, when) in git history.
- ✅ The audit gives a concrete to-do list for the data review (14 values at the time of writing).
- ❌ Choosing the "most social" option loses a nuance ("solitaire ou couple" becomes "couple").
- ⚠️ GH units are ambiguous in the workbook (°d vs °f); to be settled during the data review.

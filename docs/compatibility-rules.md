# Compatibility rules

The simulator (`/simulation/starting`) first keeps only the species whose water parameters match the tank
(volume, and pH / GH / temperature when given). Then 14 rules check the tank itself.
Code: [`frontend/lib/compat`](../frontend/lib/compat) · tests: `npm test` in `frontend/`.

Severity: 🔴 **blocking** (the population is incompatible) · 🟠 **to watch** · 🔵 **good to know**.

| # | Rule | Data used | Triggered when | Severity |
|---|---|---|---|---|
| 1 | Shared water | pH, GH, temperature ranges | the ranges of all species have no common value for one parameter; otherwise the common range is shown | 🔴 |
| 2 | Declared predator | behaviour `prédateur`, size | a predator lives with fish at most half its size | 🔴 |
| 3 | Mouth size | diet contains `carnivore`, behaviour, size | a carnivore that is not peaceful is at least 3× longer than another fish (declared predators are covered by rule 2, peaceful carnivores such as discus are skipped) | 🟠 |
| 4 | Temperament gap | behaviour levels: pacifique 0, peu agressif 1, territorial / moyennement agressif 2, agressif 3, prédateur 4 | two species are 2 levels apart or more | 🟠 |
| 5 | Water current | current levels: stagnant 0, doux 1, modéré 2, fort 3 | the current ranges of two species are 2 levels apart or more | 🟠 |
| 6 | Biotope | region | all species come from the same region | 🔵 |
| 7 | Solitary species | way of life `solitaire` | more than one individual | 🟠 |
| 8 | Aggressive species together | behaviour `agressif` | more than one individual of the same species (e.g. bettas) | 🔴 |
| 9 | Pairs | way of life `couple` | odd number of individuals | 🔵 |
| 10 | Harem | way of life `harem` | not a multiple of 4 (1 male for 3 females) | 🔵 |
| 11 | Delicate species | hardiness `fragile` / `sensible`, minimum volume | tank under 60 L or under 1.5× the species' minimum volume | 🟠 |
| 12 | Overpopulation | points (≈ litres per fish) | total above 80 % of the volume (🟠), above 100 % (🔴) | 🟠 / 🔴 |
| 13 | Under-sized group | minimum group | fewer individuals than the minimum group | 🟠 |
| 14 | Incompatible families | family | Osphronemidae (gouramis, bettas) with Poeciliidae (guppies, platies…) | 🔴 |

Every rule reports **all** the conflicts it finds, with the fish involved. Before a species is added, the
list shows the new conflicts it would create (`issuesIfAdded`).

## Coverage on the real data
Share of the 9,045 possible species pairs flagged by each pairwise rule (135 fish):

| Rule | Pairs flagged |
|---|---|
| 1. Shared water (at least one parameter) | 29 % |
| 2. Declared predator | 6 % |
| 4. Temperament gap | 17 % |
| 5. Water current | 16 % |

The rules are only as good as the data: see [data-audit.md](data-audit.md) for the values still to check
(for example Corydoras sterbai's GH of 20–30 blocks it with most soft-water tetras).

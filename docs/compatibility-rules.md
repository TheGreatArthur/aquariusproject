# Compatibility rules

The simulator (`/simulation`) mixes fish, plants and invertebrates. It lists first the species that suit the tank
(volume, and pH / GH / temperature when given); species that do not suit it can still be shown and added, and rule 0
then blocks them. 23 rules check the tank. Each species gets an id unique across the three catalogues and the field
names of a fish ([`especes.ts`](../frontend/lib/compat/especes.ts)); a parameter a species does not give (the GH of
plants and of most invertebrates, the size of many snails) is ignored instead of read as 0.
Code: [`frontend/lib/compat`](../frontend/lib/compat) · tests: `npm test` in `frontend/`.

Severity: 🔴 **blocking** (the population is incompatible) · 🟠 **to watch** · 🔵 **good to know**.

| # | Rule | Data used | Triggered when | Severity |
|---|---|---|---|---|
| 0 | Your tank | volume, pH, GH, temperature entered | a species does not tolerate the water or needs a bigger tank | 🔴 |
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
| 12 | Overpopulation | points (≈ litres per fish; invertebrates 1 point per 3 cm, plants 0) | total above 80 % of the volume (🟠), above 100 % (🔴) | 🟠 / 🔴 |
| 13 | Under-sized group | minimum group | fewer individuals than the minimum group | 🟠 |
| 14 | Incompatible families | family | Osphronemidae (gouramis, bettas) with Poeciliidae (guppies, platies…) | 🔴 |
| 15 | Shrimps eaten | diet `omnivore` / `carnivore`, size | a fish at least 3× longer than a shrimp, even a peaceful one (rules 2 and 3 cover predators and aggressive carnivores) | 🟠 |
| 16 | Hunting invertebrates | group `écrevisse`, carnivorous shrimps, size | a crayfish of 8 cm or more lives with smaller animals; a smaller one or a carnivorous shrimp with shrimps (moulting) | 🟠 |
| 17 | Assassin snail | carnivorous snail | other snails in the tank | 🔴 |
| 18 | Land area | installation `aquaterrarium` | the species is in the tank (vampire crabs need an emerged part) | 🟠 |
| 19 | Larvae | reproduction `larves en eau saumâtre / en mer` | the species is in the tank: no breeding in fresh water | 🔵 |
| 20 | Shared light | plant light ranges (très faible → très forte) | two plants share no light level | 🟠 |
| 21 | CO₂ | plant CO₂ need `élevé` | a demanding plant is in the tank | 🔵 |
| 22 | Plant eaters | herbivorous fish of Serrasalmidae and cichlid families, crayfish of 8 cm or more, omnivorous snails | they live with plants that are not marked as cichlid-proof | 🟠 |

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

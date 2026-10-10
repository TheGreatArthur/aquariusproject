# 0014. One simulator for fish, plants and invertebrates
Date: 2026-10-10
Status: Accepted

## Context
The simulator only knew fish. Plants and invertebrates had their own catalogues and pages
([ADR 0012](0012-invertebrates-like-fish.md), [ADR 0013](0013-plants-like-fish-native-range.md)) but could not be added
to a tank, although they bring the most frequent beginner problems: shrimps eaten by fish, assassin snails, crayfish,
plants that need strong light or CO₂, fish that eat plants.

The page itself was hard to use: a landing page with one real option and one "coming soon" card, nothing listed
until a volume was entered, 304 fish without a search, and species silently hidden from the tank when the water changed.

## Decision
- **One page, `/simulation`** (the old `/simulation/starting` redirects to it): the tank first (volume, pH, GH,
  temperature, or a typical water in one click), then one list with a tab per catalogue and a search, and the tank
  beside it with its verdict, load and problems. On a phone, a bar at the bottom keeps the tank state in sight.
- **Same engine, more species**: `especes.js` turns a plant or an invertebrate into a species with the field names
  of a fish and an id unique across the three catalogues (`poisson-12`, `plante-12`). Rules skip what a species does
  not give (no GH for plants, no size for many snails) instead of reading it as 0. The saved tank becomes
  `[{ kind, ref, quantite }]`; an old fish-only tank is read once.
- **The water is a rule, not a filter**: species that do not suit the tank stay listed on request and in the tank,
  blocked by rule 0 with the reason, instead of disappearing.
- **Nine new rules** (15 to 22, see [docs/compatibility-rules.md](../compatibility-rules.md)): shrimps eaten by fish
  three times longer, crayfish and carnivorous shrimps, assassin snail, land area, larvae that need brackish water,
  shared light, CO₂, plant eaters. Invertebrates count one point per 3 cm in the load, plants none.

## Alternatives considered
- **Separate simulators per catalogue**: the conflicts that matter are between catalogues.
- **A bioload for invertebrates from the fish scale**: even halved, ten cherry shrimps would fill a 20 L tank,
  where shrimp keepers keep many more.

## Consequences
- ✅ One tank mixes the three catalogues, and the risks of each species show before it is added.
- ✅ Changing the water no longer hides species from the tank.
- ⚠️ The invertebrate and plant rules are heuristics from the catalogue data (diet, group, size, light, CO₂), not
  expert advice; the list of plant-eating fish families is short on purpose.
- ⚠️ The visual simulator prototype (`/simulation/visuel`) is left out for now.

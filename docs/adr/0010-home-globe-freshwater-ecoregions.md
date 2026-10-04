# 0010. Home page globe of freshwater ecoregions
Date: 2026-10-04
Status: Accepted

## Context
Arthur asked for an interactive globe on the home page: turn it in every direction, pick a geographic zone and see
the fish of the catalogue that live there, with zones finer than countries.

The data was already there: 133 of the 135 fish profiles have geolocated points in their native range (9,152 GBIF
observations and hand-entered localities, see [ADR 0006](0006-fish-profiles-and-sources.md)). What was missing was
a set of zones that makes sense for freshwater fish.

## Decision
- **Zones: the Freshwater Ecoregions of the World** (FEOW, Abell et al. 2008, The Nature Conservancy and WWF):
  426 ecoregions drawn from the distribution of freshwater fish ("Rio Negro", "Lake Malawi", "Mekong Delta"…),
  with boundaries updated in 2013 to follow HydroBASINS.
- **The FEOW boundaries are used for computing only.** The terms in the shapefile metadata allow non-commercial,
  educational or scientific use with the copyright notice, a citation and a link to www.feow.org, and forbid
  material modifications. Simplifying the boundaries for the web would be one, so they are not redistributed:
  `backend/tools/build_ecoregions.py` (`make ecoregions`) downloads the shapefile into the uncommitted cache,
  places every point of every species with a spatial index (points just off the shore snap to the nearest
  ecoregion within 0.3°), and keeps an ecoregion for a species with at least two of its points, or one if the
  species has ten points or fewer, so that one misplaced point does not add a zone. Only the result is
  versioned in `frontend/public/maps/ecoregions.json` (121 zones, 133 species, 127 kB): number, official
  name, French name (`backend/data/ecoregions_fr.json`), realm, habitat type, an anchor point (pole of
  inaccessibility of the largest part), species and their observations, with the citation and copyright.
- **Zones are markers, not shapes**: one marker per inhabited ecoregion, sized by its number of species. Picking a
  zone flies to it, zooms in, dims the other markers and lights up the observations of its species, which shows
  the real extent of the zone for these fish without its boundary.
- **Canvas and d3-geo, no 3D engine**: an orthographic projection redrawn on a canvas (d3-geo was already used by
  the range maps). Drag with the mouse or a finger turns the globe in any direction (the surface follows the
  pointer at any zoom, latitude stops at the poles), pinch or the buttons zoom, arrows and +/- work from the
  keyboard, and the zones are also listed by realm next to the globe for keyboard and screen reader users.
  The globe spins slowly until touched, not with `prefers-reduced-motion`, and only when on screen.
- **A lighter base map for the globe**: the 1:50m map of the range maps (48,700 points) gave 30 fps on a desktop
  and 9 on a throttled phone, as the globe is redrawn at every frame. `frontend/scripts/build-globe-map.sh`
  builds `public/maps/globe-110m.json` from Natural Earth 1:110m (land, large lakes, main rivers; 6,700 points,
  75 kB): 60 fps on a desktop, 30 on a phone with the CPU slowed down four times. The canvas resolution is capped
  at twice the CSS size. Data files are only loaded when the section comes near the screen.

## Alternatives considered
- **Countries**: too coarse (Brazil holds the Rio Negro, the Xingu and the Atlantic forest streams).
- **HydroBASINS river basins** (CC BY 4.0): free to modify, but their units are not drawn for fish; filled zones
  could later be rebuilt by merging HydroBASINS basins per ecoregion if the boundaries are wanted on the globe.
- **Hand-drawn regions** (Amazonia, African Great Lakes…): simple, but imprecise and arbitrary.
- **three.js / react-three-fiber or globe.gl**: a textured 3D globe, but a large dependency for an orthographic
  view that d3-geo already draws, and the decorative 3D of the first home page had been removed on purpose.
- **SVG**: every path re-projected and re-rendered by React at every frame was too slow with the base map.

## Consequences
- ✅ Zones are scientifically meaningful and every zone links to its FEOW page.
- ✅ The species lists are reproducible from versioned data (`make ecoregions`), and tests check the placing rule,
  the anchor points and that every zone lists catalogue species with a French name.
- ⚠️ `ecoregions.json` is derived from FEOW and falls under its terms (non-commercial, educational use with the
  notice), not under the MIT licence of the code.
- ⚠️ Zones are shown as markers only; their boundaries are not drawn.
- ⚠️ A species is only as well placed as its observations: the two aquarium forms without wild range (Danio
  "frankei", Rineloricaria sp. "Red") are not on the globe.

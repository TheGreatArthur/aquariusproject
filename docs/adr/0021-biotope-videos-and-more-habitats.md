# 0021. Biotope tank videos from YouTube, loaded on click, and five more habitats
Date: 2026-10-12
Status: Accepted

## Context
The first six biotopes ([ADR 0020](0020-biotopes.md)) showed tanks recreating them only where Wikimedia Commons had a
free photo: three habitats out of six, mostly public aquarium displays. Arthur asked for photos of specific biotope
tanks and for YouTube videos presenting them, for more Rift lake habitats in the style of Lake Malawi, for more
biotopes overall, and for the species of these habitats to be added to the catalogue when missing.

Free photos of hobby biotope tanks barely exist: Commons and the Flickr images indexed by Openverse hold a handful of
public aquarium displays and generic community tanks. The best pictures, those of the Biotope Aquarium Design
Contest, are under no free licence. Their authors publish videos on YouTube, though, often with the exact site they
reproduce in the title ("Rocky pool with thick riparian vegetation, Chaliyar River, Kerala").

## Decision
- **Two YouTube videos per biotope**, usually a contest tank tied to a precise locality and a longer presentation or
  build. They are stored in `frontend/content/biotopes/index.js` with their channel and title as published, and
  embedded, not copied: YouTube's terms allow the embedded player.
- **The player loads on click** (`components/biotopes/BiotopeVideo.js`): the page shows YouTube's thumbnail, served
  as is (`unoptimized`, so no Vercel image transformation), and a play button; clicking swaps in an iframe from
  `youtube-nocookie.com`. Visitors who do not play a video send nothing to YouTube beyond the thumbnail request, and
  a page does not load two players it may never use. A line under the section says that the videos are hosted by
  YouTube.
- **Each video was checked** with YouTube's oEmbed endpoint (it exists and allows embedding) and by its title and
  description (it shows a tank of that habitat). A test keeps the ids well-formed and unique.
- **Five more habitats**, chosen where the catalogue already had several species and where the habitat is a
  classic of biotope aquariums: Lake Tanganyika rocky shores and shell beds (same lake, very different tanks), the
  Xingu rapids, the rivers of the Western Ghats and the Usumacinta basin. Water figures come, as before, from primary
  measurements: Talling & Talling (1965) with the pH of Plisnier et al. (1996) for Lake Tanganyika,
  Rodrigues-Filho et al. (2015) for the Xingu, Salcedo-Garduño et al. (2022) for the lower Usumacinta. No accessible
  measurement was found for the Western Ghats rivers, so that page gives the ranges of the species profiles and says
  so.
- **Missing species are added through the usual pipelines** (`tools.fetch_sources`, `draft_fish`, `fetch_plants`,
  `build_occurrences`, `build_ecoregions`), with the same rules as the rest of the catalogue: a free photo, three for
  plants, a Flowgrow culture sheet for plants, and texts in three languages. Candidates that failed these rules were
  left out rather than bent: *Etroplus maculatus* and *Pseudosphromenus cupanus* (mostly brackish or lowland marsh
  fish, not Ghats rivers), *Geophagus argyrostictus* (no free photo), *Cryptocoryne cordata*, *Lagenandra ovata* and
  *Vallisneria americana* (no Flowgrow culture data, or a native range that does not reach the habitat in the World
  Checklist), *Cryptocoryne beckettii*, *C. walkeri* and *Lagenandra thwaitesii* (fewer than three free photos; the
  Sri Lanka page names them).

## Alternatives considered
- **Plain iframes on page load**: no client code, but every visit would load YouTube's player twice and contact
  Google before the visitor chooses anything.
- **Links to the videos only**: no third party at all, but no preview of the tank, which was the point of the request.
- **Tank photos from contest pages or aquarist sites**: exactly the pictures wanted, but not under a free licence.

## Consequences
- Every biotope now shows tanks recreating it, as videos, and photos where free ones exist (Rio Negro, Lake Malawi,
  peat swamps, Lake Tanganyika and its shell beds).
- A removed or private video leaves a dead thumbnail until its id is replaced; the oEmbed check is quick to rerun.
- The biotope pages depend on a third party for this one section; the rest of the page, including the photos and
  sources, does not.

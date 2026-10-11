# 0019. Species pages rendered on the server, one catalogue component
Date: 2026-10-12
Status: Accepted

## Context
Every species page (304 fish, 21 invertebrates, 132 plants, in three languages) was a client component that fetched
its data with SWR ([ADR 0001](0001-tech-stack.md)). The HTML sent by the server held the title and description
(computed by a `layout.js` for the metadata) but not the content: the species texts, water parameters and range were
missing for crawlers that do not run JavaScript and for link previews, and visitors first saw a skeleton. The same
species was also fetched twice, once by the layout on the server and once by the page in the browser. An unknown id
answered `200` with a "not found" message.

The three catalogues (`app/poissons`, `app/invertebres`, `app/plantes`) were three copies of the same 170 lines
(search, filter in the URL, pagination, loading and error states), so each fix had to be made three times. The fish
filter was a row of 50 family chips sorted by scientific name: three were visible on a phone, with no hint that the
row scrolled.

## Decision
- **Species pages fetch on the server.** `page.js` is a server component: `getSpecies()` (`lib/species-server.ts`)
  reads the species from the API in the page's language, and the page passes it to the existing client component
  (`fiche.js`), which renders it on the server and stays interactive in the browser (gallery, maps, back button).
  `generateMetadata` moved into `page.js` and calls the same function; Next.js memoises the identical `fetch`, so
  the API is called once per request. The `[id]/layout.js` files are deleted.
- **Unknown species answer 404** (`notFound()`, the site's 404 page). If the API cannot be reached, the page says the
  profile is unavailable and links back to the catalogue.
- **One `Catalogue` component** (`components/Catalogue.js`) holds the search, the URL filter, the pagination and the
  states; each `app/<catalogue>/catalogue.js` only gives its texts, its card, its search function and its filter.
- **The fish family filter is a drop-down list**, sorted by displayed name and built from the fish list itself (one
  request fewer); invertebrate groups and plant growth forms keep their chips (4 and 8 values).
- **24 species per page** instead of 12: 13 pages of fish instead of 26.

## Alternatives considered
- **Pass server data to SWR as `fallbackData`**: keeps SWR on the page, but the page would still fetch the species
  again in the browser for nothing, since it never changes while the page is open.
- **Static generation of every species page (`generateStaticParams`)**: fastest pages, but about 1,400 pages built
  at each deployment, and the pages already read request headers for the language (`proxy.js`).
- **Server-render the catalogues too**: their search and filters run in the browser on the full list, which the
  simulator shares through the SWR cache; their HTML matters less than the species pages, which carry the texts.

## Consequences
- The species texts are in the HTML; a visitor no longer sees a skeleton before the content, and the browser makes
  no API call to open a species page.
- The species fetch keeps the `revalidate: 3600` the metadata already used: after a data deployment, a species page
  can show the previous data for up to an hour.
- A slow API now delays the first byte of a species page instead of showing a skeleton.
- A new catalogue is a configuration file, not a copy; a change to the catalogue layout is made once.

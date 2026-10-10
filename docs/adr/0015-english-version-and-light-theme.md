# 0015. English version under /en and a light theme
Date: 2026-10-10
Status: Accepted

## Context
The site was French only and dark only. Visitors who do not read French could not use the catalogue or the
simulator, and the dark theme is hard to read in daylight. The data (common names, species texts, the practical guide)
is written in French and has no English source; translating ~10,000 words of lessons and every species text is a
separate content job.

## Decision
- **English interface under `/en`, French stays at the root.** `proxy.js` rewrites `/en/...` to the same pages and
  passes the language in a request header (always overwritten, so a French URL cannot be served in English). Server
  components read it with `getI18n()`, client components with `useI18n()` from `I18nProvider`. No route is moved, so
  pages under `app/` keep their paths.
- **Strings stay next to their markup** as `t('français', 'English')`: no keys, no message files. `href()` keeps
  internal links in the page language.
- **What is translated**: navigation, pages, metadata, catalogue filters, the simulator and the messages of the 23
  compatibility rules (the engine reads `locale` from the tank environment), the category values from the API
  (behaviour, diet, current, light... in `lib/glossary.js`), country names (`name` from Natural Earth in the base
  map), ecoregion names (FEOW's own English names).
- **What stays French**: species common names and texts, family names and the practical guide; English pages say so.
- **The language switch is a full page load**: the root layout, which carries `<html lang>` and the language, is not
  re-rendered on client navigation.
- **Light theme**: the Tailwind colours read CSS variables (`app/theme.css`, RGB channels so `bg-accent/30` keeps
  working); `html[data-theme="light"]` swaps them. An inline script sets `data-theme` before the first paint from the
  saved choice, else `prefers-color-scheme`; the header button switches and saves it. `globals.css` is unchanged.

## Alternatives considered
- **An `app/[lang]/` segment**: the standard Next.js layout, but it moves every page (and the uncommitted visual tank
  prototype) and changes the French URLs or needs the same rewrite anyway.
- **next-intl or message catalogues**: worth it with more languages or translators; for two languages written by the
  same people, keys only hide the text.
- **`dark:` variants on every class**: hundreds of edits for what one set of variables does.

## Consequences
- ✅ Every page and the simulator work in English, with `hreflang` alternates and English URLs in the sitemap.
- ✅ Light and dark themes follow the system until the visitor picks one.
- ⚠️ Reading the language header makes pages render on demand instead of at build time.
- ⚠️ English pages still show French species names and texts, and the lessons are French only.
- ⚠️ The range maps and the globe keep their dark ocean in the light theme.

# 0007. Upgrade to Next.js 16 and React 19
Date: 2026-10-01
Status: Accepted

## Context
The front end was on Next.js 13.4 with React 18 ([0003](0003-ui-redesign-tailwind.md) left the upgrade for
later). `npm audit` listed about 30 Next.js advisories, two of them critical (remote code execution in the
image optimizer, used by every fish photo). Moving to the last 13.x release (13.5.11) fixed only the middleware
bypass: the remaining advisories are fixed from Next.js 15.5.24, which needs React 19.

## Decision
- **Next.js 16.3.8 and React 19.3**, the current stable releases, rather than 15.5: same migration work
  (async route params, Suspense around `useSearchParams`, React 19 peers), longer support, and Turbopack is the
  default bundler for `next dev` and `next build`.
- **Libraries moved with React 19:** Framer Motion 12 (11 only supports React 18), SWR 2.5, React Hook Form 7.89.
- **ESLint 9 flat config** (`eslint.config.mjs`) with `eslint-config-next` 16, since `next lint` was removed;
  `npm run lint` runs `eslint .` locally and in CI.
- **Follow the new React hooks rules** (`react-hooks` 7, React Compiler checks) instead of disabling them:
  state that only mirrored props or URL values is now derived during render (catalogue family filter and
  pagination, mobile menu, simulator results and tank), `useWatch` replaces `watch`.
- **Client-only simulator.** The simulator reads the saved tank from `localStorage`, which the server cannot
  see. Its interactive part is loaded with `next/dynamic` and `ssr: false`, so the saved tank and water are read
  in the first render, without effects or a hydration mismatch; the page header stays server-rendered.
- **Static catalogue shell.** `/poissons` is a server page that renders the catalogue inside `<Suspense>`: the
  prerendered HTML has the header and a skeleton grid, the list and the URL filter load in the browser.

## Alternatives considered
- **Stay on 13.5.11:** no code change, but known critical advisories in production code paths.
- **Next.js 15.5 (latest 15.x):** fixes the advisories with React 19 too, but still allows synchronous `params`
  and `next lint` with deprecation warnings, so the same changes would be needed again for 16.
- **Disable `react-hooks/set-state-in-effect`:** fastest, but those effects caused extra renders and the
  hydration bug fixed earlier came from the same pattern.

## Consequences
- ✅ `npm audit` reports 0 vulnerabilities; production build and dev server use Turbopack.
- ✅ Fewer renders: no state copied from props or the URL through effects.
- ⚠️ Tank species that no longer suit the water are now hidden instead of deleted: they come back when the
  water is changed back, and stay in the saved tank meanwhile.
- ⚠️ The simulator form is not in the server HTML any more (a skeleton is shown until the script loads).
- ⚠️ Node.js 20.9+ is required (CI uses Node 20).

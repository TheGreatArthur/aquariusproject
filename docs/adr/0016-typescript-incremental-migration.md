# 0016. Incremental migration of the front end to TypeScript
Date: 2026-10-10
Status: Accepted

## Context
The front end grew to about 6,000 lines of JavaScript. Its riskiest part is `lib/`: the compatibility engine and
its 23 rules, which read many optional fields (no GH for plants, no size for many snails, null water values) and
where a missing `?? 0` silently changes a verdict. Nothing checked those shapes except the unit tests. Converting the
whole app at once would mix a large diff with the English version and the light theme still under review.

## Decision
- **TypeScript next to JavaScript**: `tsconfig.json` (replacing `jsconfig.json`, same `@/` alias) with `allowJs`, so
  `.js` and `.ts` files import each other and pages keep working while they are converted one by one.
- **`strict: true` for TypeScript files, `checkJs: false`**: converted code is fully checked, unconverted code is
  not checked at all, instead of a loose mode that would have to be tightened later.
- **`lib/` first**: every module of `lib/` (compatibility engine, catalogue helpers, globe maths, guide texts,
  languages) is converted. Shared shapes live in `lib/types.ts` (`Species`, `Environment`, `Issue`, `Rule`…), with
  the API's French field names.
- **Checked in CI**: `npm run typecheck` (`tsc --noEmit`) in the front-end job; `next build` also type-checks.
- Tests stay in JavaScript for now; Vitest runs them against the TypeScript modules unchanged.

## Alternatives considered
- **JSDoc types with `checkJs`**: no build change, but verbose, and the code base would move to TypeScript anyway.
- **Converting components and pages in the same change**: a much larger diff, harder to review, for less safety
  than the engine gives.

## Consequences
- ✅ The engine's optional fields are now explicit: the checker found the places that compared `null` sizes or
  `undefined` points (they now read them as 0, as JavaScript did).
- ✅ Components get types for everything they import from `lib/`.
- ⚠️ Pages, components and tests are still JavaScript and unchecked: convert them in later changes, starting with
  the simulator.
- ⚠️ `ApiItem` is a loose type for raw API objects until the API responses are typed.

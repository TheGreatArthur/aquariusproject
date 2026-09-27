# 0003. UI redesign: Tailwind CSS and Framer Motion
Date: 2026-09-27
Status: Accepted

## Context
The original UI mixed React-Bootstrap components, Sass modules, per-page wallpaper images and inline
styles. It looked like a default template, was hard to keep consistent (three icon libraries, two range
slider libraries, hard-coded pixel sizes, `window.innerWidth` checks for responsiveness) and had
accessibility gaps (clickable `<p>` and icons without labels, no focus styles).

We want a modern, consistent look that works on mobile first, without changing the business logic of the
simulator (tracked separately).

## Decision
- **Tailwind CSS 3** with design tokens in `frontend/tailwind.config.js`: a dark "abyss" palette
  (`background`, `surface`, `border`, `muted`) and a single teal accent that matches the planted-tank photos.
  Shared patterns (`.card`, `.btn-primary`, `.input`, `.chip`…) live in `app/globals.css` under `@layer components`.
- **Typography:** Space Grotesk for headings, Inter for body text, loaded with `next/font`.
- **Motion:** Framer Motion for scroll reveals (`components/Reveal.js`), run once per element.
  When the user asks for reduced motion, the duration is set to 0 but the initial/final states stay the
  same as the server render, which avoids both hydration mismatches and content stuck at `opacity: 0`.
- **Icons:** `lucide-react` only, pinned below v1: v1 creates a React context at import time, which breaks
  Server Components on Next.js 13.4.
- **Components:** shared UI in `frontend/components/` (header, footer, page header, fish card, gallery,
  range bar, pagination); routes renamed to lowercase (`/simulation`, `/contact`) to match the links and
  work on case-sensitive file systems.

## Alternatives considered
- **Keep React-Bootstrap and restyle it:** less churn, but fighting Bootstrap defaults to get a custom
  look, and it keeps a large CSS bundle.
- **CSS Modules / Sass only:** no new dependency, but no design tokens or utility classes; slower to keep
  spacing and colours consistent across pages.
- **shadcn/ui + Radix:** good accessible primitives, but it targets TypeScript and a newer Next.js/React;
  worth revisiting after the framework upgrade.
- **GSAP for motion:** more powerful than needed for simple reveals; adds weight.
- **A 3D accent in the hero** (React Three Fiber bubbles rising over the photo): prototyped, then removed
  after review — it distracted from the content and pulled in three.js for a purely decorative effect.

## Consequences
- ✅ One consistent visual language, responsive by default, visible focus states and labelled controls.
- ✅ 11 dependencies removed (Bootstrap, React-Bootstrap, Font Awesome ×4, react-icons,
  react-bootstrap-icons, two sliders, Sass); 6 added (framer-motion, lucide-react, clsx, and the
  tailwindcss / postcss / autoprefixer dev toolchain).
- ❌ First Load JS grows from ~78–114 kB to ~114–142 kB per route (Framer Motion, lucide).
- ❌ Dark theme only for now.
- ⚠️ Still on Next.js 13.4 / JavaScript: upgrading Next.js and moving to TypeScript are separate changes.

# Design rules

The front end keeps the identity of [ADR 0003](adr/0003-ui-redesign-tailwind.md): dark theme, one teal accent,
Space Grotesk for headings and Inter for text. These rules came out of a design review (October 2026) and apply
to every new page or component.

## Tokens and shapes
- **One accent**, `accent` (`#2DD4BF`), for actions, links and highlights. No gradient text, no glow
  shadows, no blurred colour blobs behind content.
- **Corner radius:** containers and images `rounded-2xl`, form controls and small tiles `rounded-xl`,
  buttons and chips `rounded-full`.
- **Numbers** that are compared (stats, ranges, quantities) use `tabular-nums`.

## Text
- Headings wrap with `text-wrap: balance`, paragraphs with `text-wrap: pretty` (set in `globals.css`).
- French punctuation: a non-breaking space before `?`, `!` and `:` in headings and short labels
  (`&nbsp;` in JSX, ` ` in strings) so they never start a line.
- No em dash in visible text. Missing values read "Non renseigné".
- Form labels are in sentence case (`.label`): uppercase turned "pH" into "PH".
- At most one small uppercase label (`.eyebrow`) every three sections of a page.

## Actions
- One label per intent: the simulator is always reached with **"Simuler un bac"** (`/simulation/starting`).
- Destructive actions ask for confirmation ("Tout vider" → "Confirmer" / "Annuler").
- Loading labels end with an ellipsis ("Envoi…").

## Layout
- The home hero holds four elements at most: eyebrow, headline (two lines on desktop), one sentence of
  subtext, two buttons.
- Use real visuals: fish photos or real screenshots of the app (`public/simulateur-apercu.webp`), never
  mock-ups built from divs.
- Grids are designed for phones too: two columns of fish cards and families below 640 px, and no empty
  cell in the family mosaic at any width.
- Labels go in the card body, not as pills over photos.

## Accessibility
- "Aller au contenu" skip link, `theme-color` matching the background, visible focus rings.
- Status changes (verdict, contact form) are announced with `role="status"`.
- Animations honour `prefers-reduced-motion` (`Reveal`, hero) and animate `transform` / `opacity` only.

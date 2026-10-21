# 0023. Thumbnails built with the site instead of Vercel image optimization
Date: 2026-10-21
Status: Accepted

## Context
The site shows about 1,300 photos (fish, plants, invertebrates, biotopes, home page) through `next/image`. On Vercel,
every photo × width × format is a transformation, and the free (Hobby) plan includes 5,000 a month: the site reached
7,400 within weeks. Past the quota, Vercel answers `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` for every size not
cached yet, so photos disappeared from pages. The stopgap (`IMAGES_UNOPTIMIZED=1`) served the stored photos
(about 250 KB, up to 2,000 px) even in 64 px markers and catalogue cards. Arthur wants to stay on the free plan.

## Decision
- **`npm run build` first runs `scripts/thumbnails.mjs`**: every photo in `public/` gets WebP copies 128, 384, 768
  and 1,280 px wide (quality 70, widths in `lib/thumbnails.json`), written to `public/_thumbs/<width>/<path>.webp`
  (git-ignored). Vercel runs this script, as it uses the `build` script of `package.json`.
- **A custom loader** (`lib/image-loader.ts`) gives `next/image` the smallest thumbnail at least as wide as the width
  asked, and the stored photo above 1,280 px. Pages keep their `sizes`, and browsers keep choosing the width from the
  `srcset`; the files are plain static files on the CDN, so no transformation is counted.
- **Only rebuilt when a photo changes**: thumbnails are kept in `.next/cache/thumbnails` under the hash of the photo,
  a folder Vercel restores between builds. A full run takes about 3 minutes (1,323 photos, 5,280 files), a cached
  one 5 seconds; thumbnails of removed photos leave the cache.
- **Without thumbnails** (`next dev`, or `next build` alone as in CI), `next.config.js` serves the stored photos
  (`unoptimized`), never through Vercel's optimizer.

## Alternatives considered
- **Vercel Pro** (20 $ a month): a larger quota, then usage billing that grows with visitors.
- **Committing the thumbnails**: no build step, but about 200 MB more in git history at every photo change.
- **An external image CDN or proxy** (Cloudinary, wsrv.nl…): another account or a third party seeing every visit.

## Consequences
- The deployment carries about 200 MB of thumbnails on top of the 340 MB of photos.
- A build after a cache loss takes about 3 minutes longer.
- A new photo needs nothing more: the next build makes its thumbnails. In `next dev`, a page shows the stored photos
  unless `npm run thumbnails` was run.
- `IMAGES_UNOPTIMIZED` is no longer read; the variable can be removed from the Vercel project.

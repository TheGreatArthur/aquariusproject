/**
 * Image de partage du site, en anglais (app/opengraph-image.jpg, 1200 × 630) : photo d'aquarium de l'accueil, logo,
 * nom et accroche, dans les polices et couleurs du site, rendue par Chromium (Playwright). Les fiches partagent leur
 * propre photo (generateMetadata). À relancer après un changement de logo, de couleurs ou d'accroche :
 *   node scripts/og-image.mjs
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

const RACINE = path.resolve(import.meta.dirname, '..');
const photo = (await readFile(path.join(RACINE, 'public', 'hero-aquascape.jpg'))).toString('base64');

// Couleurs du thème sombre (app/theme.css)
const FOND = 'rgb(5 11 18)';
const ACCENT = 'rgb(45 212 191)';
const TEXTE = 'rgb(232 241 247)';
const DISCRET = 'rgb(137 160 179)';

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@500;700&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: ${FOND}; font-family: Inter, sans-serif; }
  .photo { position: absolute; inset: 0; background: url(data:image/jpeg;base64,${photo}) 70% 50% / cover; }
  .voile { position: absolute; inset: 0;
    background: linear-gradient(90deg, ${FOND} 0%, rgb(5 11 18 / .92) 38%, rgb(5 11 18 / .35) 72%, rgb(5 11 18 / .15) 100%),
                linear-gradient(0deg, rgb(5 11 18 / .7) 0%, transparent 35%); }
  .contenu { position: absolute; left: 80px; top: 0; bottom: 0; width: 640px; display: flex; flex-direction: column;
    justify-content: center; gap: 28px; }
  .marque { display: flex; align-items: center; gap: 22px; }
  .marque svg { width: 84px; height: 84px; }
  .nom { font: 700 88px/1 'Space Grotesk', sans-serif; color: ${TEXTE}; letter-spacing: -0.02em; }
  .accroche { font: 500 46px/1.15 'Space Grotesk', sans-serif; color: ${TEXTE}; letter-spacing: -0.01em; }
  .themes { font: 400 26px/1.4 Inter, sans-serif; color: ${DISCRET}; }
  .adresse { position: absolute; right: 64px; bottom: 48px; font: 500 26px/1 Inter, sans-serif; color: ${ACCENT}; }
</style></head>
<body>
  <div class="photo"></div><div class="voile"></div>
  <div class="contenu">
    <div class="marque">
      <svg viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="${ACCENT}"/>
        <path d="M7 13c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0M7 19.5c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"
              fill="none" stroke="${FOND}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="nom">Aquarius</span>
    </div>
    <p class="accroche">Build a balanced<br>aquarium</p>
    <p class="themes">Fish · Plants · Invertebrates · Biotopes<br>and a compatibility simulator</p>
  </div>
  <div class="adresse">aquarius-pro.com</div>
</body></html>`;

const navigateur = await chromium.launch();
const onglet = await navigateur.newPage({ viewport: { width: 1200, height: 630 } });
await onglet.setContent(page, { waitUntil: 'networkidle' });
await onglet.evaluate(() => document.fonts.ready);
await onglet.screenshot({ path: path.join(RACINE, 'app', 'opengraph-image.jpg'), type: 'jpeg', quality: 86 });
await navigateur.close();
console.log('app/opengraph-image.jpg écrite');

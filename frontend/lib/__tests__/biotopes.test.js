import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { BIOTOPES, photosDu, TEXTES } from '@/content/biotopes';
import photos from '@/content/biotopes/photos.json';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
// Noms scientifiques de tout le catalogue : chaque espèce a ses noms anglais (test du backend sur data/i18n)
const catalogue = (fichier) => new Set(Object.keys(JSON.parse(readFileSync(`${ROOT}backend/data/i18n/en/${fichier}.json`, 'utf8'))));
const CATALOGUE = { poisson: catalogue('fish'), plante: catalogue('plants'), invertebre: catalogue('invertebrates') };

const forme = (textes) => Object.fromEntries(Object.entries(textes).map(([slug, t]) => [slug, {
  cles: Object.keys(t).sort(),
  milieu: t.milieu.length, eau: t.eau.length, vie: t.vie.length, aquarium: t.aquarium.length,
  legendes: Object.keys(t.legendes).sort(),
}]));

describe('biotopes', () => {
  it('ont des textes de même structure dans les trois langues', () => {
    expect(Object.keys(TEXTES.fr).sort()).toEqual(BIOTOPES.map((b) => b.slug).sort());
    expect(forme(TEXTES.en)).toEqual(forme(TEXTES.fr));
    expect(forme(TEXTES.ja)).toEqual(forme(TEXTES.fr));
  });

  it.each(BIOTOPES.map((b) => [b.slug, b]))('%s cite des espèces du catalogue', (slug, b) => {
    for (const [kind, noms] of Object.entries(b.especes))
      for (const nom of noms)
        expect(CATALOGUE[kind].has(nom), `${kind} ${nom}`).toBe(true);
    // Le bac d'exemple ne prend que des espèces du biotope
    for (const [kind, nom, quantite] of b.bac.population) {
      expect(b.especes[kind], `${kind} ${nom}`).toContain(nom);
      expect(quantite).toBeGreaterThan(0);
    }
  });

  it.each(BIOTOPES.map((b) => [b.slug, b]))('%s a ses sources, ses photos et leurs légendes', (slug, b) => {
    for (const { url } of b.sources)
      expect(url).toMatch(/^https:\/\//);
    for (const { source } of b.mesures)
      expect(b.sources[source], `source ${source}`).toBeDefined();

    const { nature, bacs } = photosDu(slug);
    expect(nature.length).toBe(photos[slug].nature.length);
    expect(bacs.length).toBe(photos[slug].bacs.length);
    for (const photo of [...nature, ...bacs]) {
      expect(existsSync(`${ROOT}frontend/public/biotopes/${photo.fichier}`), photo.fichier).toBe(true);
      expect(photo.auteur && photo.licence && photo.source).toBeTruthy();
      for (const textes of Object.values(TEXTES))
        expect(textes[slug].legendes[photo.fichier], photo.fichier).toBeTruthy();
    }
  });
});

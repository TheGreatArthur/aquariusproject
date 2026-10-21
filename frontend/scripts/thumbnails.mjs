/**
 * Miniatures WebP des photos de public/ : public/_thumbs/<largeur>/<chemin de la photo>.webp, aux largeurs de
 * lib/thumbnails.json, servies par lib/image-loader.ts à la place de l'optimisation d'images de Vercel (quota
 * mensuel de l'offre gratuite dépassé dès 1 300 photos). Lancé par `npm run build`.
 *
 * Les miniatures calculées restent dans .next/cache/thumbnails (cache de build que Vercel garde d'un déploiement à
 * l'autre), sous l'empreinte de la photo : seules les photos nouvelles ou modifiées sont recalculées.
 */

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import path from 'node:path';

import sharp from 'sharp';

const RACINE = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(RACINE, 'public');
const SORTIE = path.join(PUBLIC, '_thumbs');
const CACHE = path.join(RACINE, '.next', 'cache', 'thumbnails');
const { largeurs } = JSON.parse(await readFile(path.join(RACINE, 'lib', 'thumbnails.json'), 'utf8'));
const PHOTO = /\.(jpe?g|png|webp)$/i;
const QUALITE = 70;

async function photos (dossier) {
  const entrees = await readdir(dossier, { withFileTypes: true });
  const listes = await Promise.all(entrees.map((e) => {
    const chemin = path.join(dossier, e.name);
    if (e.isDirectory())
      return chemin === SORTIE ? [] : photos(chemin);
    return PHOTO.test(e.name) ? [chemin] : [];
  }));
  return listes.flat();
}

let calculees = 0;
const utilisees = new Set();

async function miniatures (photo) {
  const donnees = await readFile(photo);
  const empreinte = createHash('sha1').update(donnees).digest('hex').slice(0, 16);
  const relatif = path.relative(PUBLIC, photo);
  for (const largeur of largeurs) {
    const nom = `${empreinte}-${largeur}.webp`;
    const cache = path.join(CACHE, nom);
    utilisees.add(nom);
    if (!existsSync(cache)) {
      // rotate() applique l'orientation EXIF ; une photo plus petite que la largeur garde sa taille
      await writeFile(cache, await sharp(donnees).rotate().resize({ width: largeur, withoutEnlargement: true })
        .webp({ quality: QUALITE }).toBuffer());
      calculees++;
    }
    const cible = path.join(SORTIE, String(largeur), `${relatif}.webp`);
    await mkdir(path.dirname(cible), { recursive: true });
    await copyFile(cache, cible);
  }
}

const debut = Date.now();
await rm(SORTIE, { recursive: true, force: true });
await mkdir(CACHE, { recursive: true });
const liste = await photos(PUBLIC);
// Quelques photos à la fois : sharp répartit déjà chaque calcul sur plusieurs fils
const file = [...liste];
await Promise.all(Array.from({ length: Math.min(4, availableParallelism()) }, async () => {
  while (file.length)
    await miniatures(file.pop());
}));
// Le cache ne garde que les miniatures des photos actuelles
const perimees = (await readdir(CACHE)).filter((nom) => !utilisees.has(nom));
await Promise.all(perimees.map((nom) => rm(path.join(CACHE, nom))));

console.log(`Miniatures : ${liste.length} photos × ${largeurs.length} largeurs, ${calculees} calculées, `
  + `${utilisees.size - calculees} reprises du cache, ${perimees.length} retirées du cache `
  + `(${((Date.now() - debut) / 1000).toFixed(0)} s)`);

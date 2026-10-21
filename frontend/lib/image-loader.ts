/**
 * Adresse d'une photo de public/ pour une largeur d'affichage : la plus petite miniature assez large, fabriquée par
 * scripts/thumbnails.mjs, sinon la photo d'origine. Remplace l'optimisation d'images de Vercel (voir next.config.js).
 */

import { largeurs } from './thumbnails.json';

const PHOTO = /^\/(?!_thumbs\/).+\.(jpe?g|png|webp)$/i;

export default function imageLoader ({ src, width }: { src: string, width: number }) {
  const largeur = PHOTO.test(src) && largeurs.find((l) => l >= width);
  return largeur ? `/_thumbs/${largeur}${src}.webp` : src;
}

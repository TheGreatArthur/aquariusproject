/**
 * Utilitaires d'affichage des plantes
 */

import { searchKey } from '@/lib/fish';

/** Photos des plantes, dans public/plants */
export const plantPhoto = (fichier) => `/plants/${fichier}`;

/** Photo principale d'une plante de la liste (champ `image`) ou du détail (champ `images`) */
export const plantImage = (p) => plantPhoto((p.image ?? p.images?.[0])?.fichier ?? '');

/** Port de la plante : libellé d'une fiche, et libellé des filtres de la liste */
export const TYPES = {
  épiphyte: { label: 'Épiphyte', filtre: 'Épiphytes' },
  mousse: { label: 'Mousse', filtre: 'Mousses' },
  rosette: { label: 'Rosette', filtre: 'Rosettes' },
  tige: { label: 'Plante à tiges', filtre: 'Plantes à tiges' },
  tapissante: { label: 'Tapissante', filtre: 'Tapissantes' },
  flottante: { label: 'Flottante', filtre: 'Flottantes' },
  rhizome: { label: 'À rhizome', filtre: 'À rhizome' },
};

/** Types présents dans la liste, dans l'ordre des filtres */
export const typesPresents = (plantes) => Object.keys(TYPES).filter((t) => plantes.some((p) => p.type === t));

const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

/** « 5–15 cm », « 6 cm » si les bornes sont égales, null sans valeur */
export function formatRange (min, max, unit = '') {
  if (min == null || max == null)
    return null;
  const fmt = (v) => nombre.format(v);
  const suffix = unit ? ` ${unit}` : '';
  return min === max ? `${fmt(min)}${suffix}` : `${fmt(min)}–${fmt(max)}${suffix}`;
}

/** « faible à forte », ou un seul niveau */
export const lightLabel = (min, max) => (min === max ? min : `${min} à ${max}`);

/** Couleur du badge de difficulté */
export function difficultyTone (difficulte = '') {
  if (difficulte.includes('facile'))
    return 'calm';
  return difficulte === 'moyenne' ? 'warn' : 'danger';
}

/**
 * Recherche rapide : chaque mot saisi doit apparaître dans le nom commun, le nom scientifique,
 * la famille ou le port de la plante, sans tenir compte des accents
 */
export function matchesPlantSearch (p, terme) {
  const mots = searchKey(terme).split(/\s+/).filter(Boolean);
  if (!mots.length)
    return true;
  const texte = searchKey([p.nom_commun, p.nom_scientifique, p.famille, TYPES[p.type]?.label]
    .filter(Boolean).join(' '));
  return mots.every((mot) => texte.includes(mot));
}

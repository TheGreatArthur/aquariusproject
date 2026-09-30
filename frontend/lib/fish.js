/**
 * Utilitaires d'affichage des poissons
 */

/** Image principale d'un poisson */
export const fishImage = (p) => `/images/${p.images?.[0] ?? `${p.id}.jpg`}`;

/** Toutes les images d'un poisson */
export const fishImages = (p) => (p.images?.length ? p.images : [`${p.id}.jpg`]).map((img) => `/images/${img}`);

/** Texte ramené en minuscules sans accents, pour comparer « Pléco » et « pleco » */
export const searchKey = (text = '') => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/**
 * Recherche rapide : chaque mot saisi doit apparaître dans le nom commun, le nom scientifique,
 * la famille, le genre ou le comportement, n'importe où dans le texte et sans tenir compte des accents
 */
export function matchesSearch (p, terme) {
  const mots = searchKey(terme).split(/\s+/).filter(Boolean);
  if (!mots.length)
    return true;
  const texte = searchKey([p.nom_commun, p.nom_scientifique, p.nom_famille, p.nom_genre, p.nom_comportement]
    .filter(Boolean).join(' '));
  return mots.every((mot) => texte.includes(mot));
}

/**
 * Ton de couleur associé à un comportement (pacifique, agressif, prédateur...)
 * @returns {'calm'|'warn'|'danger'}
 */
export function behaviourTone (comportement = '') {
  const c = comportement.toLowerCase();
  if (c.includes('prédateur') || c.startsWith('agressif'))
    return 'danger';
  if (c.includes('agressif') || c.includes('territorial'))
    return 'warn';
  return 'calm';
}

export const TONE_CLASSES = {
  calm: 'border-success/30 bg-success/10 text-success',
  warn: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
};

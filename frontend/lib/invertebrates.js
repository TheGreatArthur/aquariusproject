import { searchKey } from '@/lib/fish';

/** Groupes d'invertébrés, dans l'ordre des filtres du catalogue */
export const GROUPS = {
  crevette: 'Crevettes',
  crabe: 'Crabes',
  escargot: 'Escargots',
  écrevisse: 'Écrevisses',
};

/** Photo d'un invertébré (`frontend/public/invertebrates/`), à partir de son nom de fichier */
export const invertebratePhoto = (fichier) => `/invertebrates/${fichier}`;

/** Photo principale : `image` dans la liste, première des `images` sur le détail */
export const invertebrateImage = (p) => invertebratePhoto(p.image ?? p.images?.[0] ?? '');

/** Les invertébrés dont la galerie montre aussi des coquilles vides ou des spécimens de collection */
export const nonLivingViews = (credits = []) => credits.some((c) => c.vue && c.vue !== 'animal');

/** Recherche sans tenir compte des accents ni de la casse, sur les noms, la famille, le groupe et le comportement */
export function matchesInvertebrateSearch (p, terme) {
  const text = searchKey([p.nom_commun, p.nom_scientifique, p.variete, p.famille, p.groupe, GROUPS[p.groupe],
    p.comportement].filter(Boolean).join(' '));
  return searchKey(terme).split(/\s+/).filter(Boolean).every((word) => text.includes(word));
}

/** Valeur arrondie et lisible (« 3 », « 5,5 ») d'un nombre facultatif, avec son unité */
export function formatValue (value, unit = '') {
  if (value == null)
    return 'Non renseigné';
  return `${String(value).replace('.', ',')}${unit ? ` ${unit}` : ''}`;
}

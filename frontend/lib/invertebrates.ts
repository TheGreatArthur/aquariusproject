import { searchKey } from '@/lib/fish';
import { translator } from '@/lib/i18n';
import type { ApiItem, Credit, Locale } from '@/lib/types';

/** Groupes d'invertébrés, dans l'ordre des filtres du catalogue */
export const GROUPS: Record<string, string> = {
  crevette: 'Crevettes',
  crabe: 'Crabes',
  escargot: 'Escargots',
  écrevisse: 'Écrevisses',
};

export const GROUPS_EN: Record<string, string> = { crevette: 'Shrimp', crabe: 'Crabs', escargot: 'Snails', écrevisse: 'Crayfish' };
export const GROUPS_JA: Record<string, string> = { crevette: 'エビ', crabe: 'カニ', escargot: '貝', écrevisse: 'ザリガニ' };

/** Photo d'un invertébré (`frontend/public/invertebrates/`), à partir de son nom de fichier */
export const invertebratePhoto = (fichier: string) => `/invertebrates/${fichier}`;

/** Photo principale : `image` dans la liste, première des `images` sur le détail */
export const invertebrateImage = (p: { image?: string, images?: string[] }) => invertebratePhoto(p.image ?? p.images?.[0] ?? '');

/** Les invertébrés dont la galerie montre aussi des coquilles vides ou des spécimens de collection */
export const nonLivingViews = (credits: Credit[] = []) => credits.some((c) => c.vue && c.vue !== 'animal');

/** Recherche sans tenir compte des accents ni de la casse, sur les noms, la famille, le groupe et le comportement */
export function matchesInvertebrateSearch (p: ApiItem, terme: string) {
  const text = searchKey([p.nom_commun, p.nom_scientifique, p.variete, p.famille, p.groupe, GROUPS[p.groupe],
    GROUPS_EN[p.groupe], GROUPS_JA[p.groupe], p.comportement].filter(Boolean).join(' '));
  return searchKey(terme).split(/\s+/).filter(Boolean).every((word) => text.includes(word));
}

/** Valeur arrondie et lisible (« 3 », « 5,5 ») d'un nombre facultatif, avec son unité, dans la langue de la page */
export function formatValue (value: number | null | undefined, unit = '', locale?: Locale) {
  const { t } = translator(locale);
  if (value == null)
    return t('Non renseigné', 'Not known', '情報なし');
  return `${t(String(value).replace('.', ','), String(value), String(value))}${unit ? ` ${unit}` : ''}`;
}

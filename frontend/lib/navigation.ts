/**
 * Liens de navigation du site
 */

export const NAV_LINKS = [
  { href: '/poissons', label: 'Poissons', en: 'Fish', ja: '魚' },
  { href: '/invertebres', label: 'Invertébrés', en: 'Invertebrates', ja: '無脊椎動物' },
  { href: '/plantes', label: 'Plantes', en: 'Plants', ja: '水草' },
  { href: '/simulation', label: 'Simulation', en: 'Simulator', ja: 'シミュレーター' },
  { href: '/cours', label: 'Guide pratique', en: 'Practical guide', ja: '実践ガイド' },
  { href: '/contact', label: 'Contact', en: 'Contact', ja: 'お問い合わせ' },
];

export const INSTAGRAM_URL = 'https://www.instagram.com/projet.aquarius.pro';

// Nombre de changements de page faits dans le site depuis le chargement (suivi par <Providers>)
let inAppNavigations = 0;

export const countNavigation = () => { inAppNavigations += 1; };

/** Vrai si « Retour » ramène à une page du site, faux si la page a été ouverte directement (lien partagé) */
export const hasPreviousPage = () => inAppNavigations > 0;

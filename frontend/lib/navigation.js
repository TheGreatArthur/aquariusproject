/**
 * Liens de navigation du site
 */

export const NAV_LINKS = [
  { href: '/poissons', label: 'Poissons', en: 'Fish' },
  { href: '/invertebres', label: 'Invertébrés', en: 'Invertebrates' },
  { href: '/plantes', label: 'Plantes', en: 'Plants' },
  { href: '/simulation', label: 'Simulation', en: 'Simulator' },
  { href: '/cours', label: 'Guide pratique', en: 'Practical guide' },
  { href: '/contact', label: 'Contact', en: 'Contact' },
];

export const INSTAGRAM_URL = 'https://www.instagram.com/projet.aquarius.pro';

// Nombre de changements de page faits dans le site depuis le chargement (suivi par <Providers>)
let inAppNavigations = 0;

export const countNavigation = () => { inAppNavigations += 1; };

/** Vrai si « Retour » ramène à une page du site, faux si la page a été ouverte directement (lien partagé) */
export const hasPreviousPage = () => inAppNavigations > 0;

/**
 * Liens de navigation du site
 */

export const NAV_LINKS = [
  { href: '/poissons', label: 'Poissons' },
  { href: '/invertebres', label: 'Invertébrés' },
  { href: '/plantes', label: 'Plantes' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/cours', label: 'Guide pratique' },
  { href: '/contact', label: 'Contact' },
];

export const INSTAGRAM_URL = 'https://www.instagram.com/projet.aquarius.pro';

// Nombre de changements de page faits dans le site depuis le chargement (suivi par <Providers>)
let inAppNavigations = 0;

export const countNavigation = () => { inAppNavigations += 1; };

/** Vrai si « Retour » ramène à une page du site, faux si la page a été ouverte directement (lien partagé) */
export const hasPreviousPage = () => inAppNavigations > 0;

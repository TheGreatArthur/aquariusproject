/**
 * Familles mises en avant sur la page d'accueil.
 * `nom` doit correspondre au nom de la famille en base (comparaison insensible à la casse).
 */

export const FEATURED_FAMILIES = [
  {
    nom: 'Characidae',
    image: '/families/characidae.jpg',
    description: 'Tétras et néons : petits poissons de banc, vifs et colorés.',
    en: 'Tetras and neons: small, lively and colourful shoaling fish.',
  },
  {
    nom: 'Cichlidae américain',
    image: '/families/cichlidae-americain.jpg',
    description: 'Scalaires, apistogrammas et discus, au comportement riche.',
    en: 'Angelfish, apistos and discus, with rich behaviour.',
  },
  {
    nom: 'Poeciliidae',
    image: '/families/poeciliidae.jpg',
    description: 'Guppys, platys et mollys : des vivipares faciles à maintenir.',
    en: 'Guppies, platies and mollies: easy livebearers.',
  },
  {
    nom: 'Callichthyidae',
    image: '/families/callichthyidae.jpg',
    description: 'Les corydoras, poissons-chats de fond grégaires et paisibles.',
    en: 'Corydoras, peaceful bottom-dwelling catfish that live in groups.',
  },
  {
    nom: 'Osphronemidae',
    image: '/families/osphronemidae.jpg',
    description: 'Gouramis et combattants, capables de respirer l\'air.',
    en: 'Gouramis and bettas, able to breathe air.',
  },
  {
    nom: 'Loricariidae',
    image: '/families/loricariidae.jpg',
    description: 'Ancistrus et plécos, brouteurs à bouche en ventouse.',
    en: 'Bristlenoses and plecos, grazers with sucker mouths.',
  },
  {
    nom: 'Danionidae',
    image: '/families/danionidae.jpg',
    description: 'Danios et rasboras, nageurs infatigables venus d\'Asie.',
    en: 'Danios and rasboras, tireless swimmers from Asia.',
  },
  {
    nom: 'Cichlidae africain',
    image: '/families/cichlidae-africain.jpg',
    description: 'Cichlidés des grands lacs, éclatants et territoriaux.',
    en: 'Rift lake cichlids, brilliant and territorial.',
  },
];

/** Lien vers la liste des poissons filtrée sur une famille */
export const familyHref = (nom) => `/poissons?famille=${encodeURIComponent(nom)}`;

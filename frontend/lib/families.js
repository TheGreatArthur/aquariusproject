/**
 * Familles mises en avant sur la page d'accueil.
 * `nom` doit correspondre au nom de la famille en base (comparaison insensible à la casse).
 */

export const FEATURED_FAMILIES = [
  {
    nom: 'Characidae',
    image: '/families/characidae.jpg',
    description: 'Tétras et néons : petits poissons de banc, vifs et colorés.',
  },
  {
    nom: 'Cichlidae américain',
    image: '/families/cichlidae-americain.jpg',
    description: 'Scalaires, apistogrammas et discus, au comportement riche.',
  },
  {
    nom: 'Poeciliidae',
    image: '/families/poeciliidae.jpg',
    description: 'Guppys, platys et mollys : des vivipares faciles à maintenir.',
  },
  {
    nom: 'Callichthyidae',
    image: '/families/callichthyidae.jpg',
    description: 'Les corydoras, poissons-chats de fond grégaires et paisibles.',
  },
  {
    nom: 'Osphronemidae',
    image: '/families/osphronemidae.jpg',
    description: 'Gouramis et combattants, capables de respirer l\'air.',
  },
  {
    nom: 'Loricariidae',
    image: '/families/loricariidae.jpg',
    description: 'Ancistrus et plécos, brouteurs à bouche en ventouse.',
  },
  {
    nom: 'Danionidae',
    image: '/families/danionidae.jpg',
    description: 'Danios et rasboras, nageurs infatigables venus d\'Asie.',
  },
  {
    nom: 'Cichlidae africain',
    image: '/families/cichlidae-africain.jpg',
    description: 'Cichlidés des grands lacs, éclatants et territoriaux.',
  },
];

/** Lien vers la liste des poissons filtrée sur une famille */
export const familyHref = (nom) => `/poissons?famille=${encodeURIComponent(nom)}`;

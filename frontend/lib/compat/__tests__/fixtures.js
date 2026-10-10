/**
 * Poissons de test, calqués sur les fiches réelles de la base (format de l'API)
 */

import { espece } from '@/lib/compat/especes';

let nextId = 1000;

export function fish (overrides = {}) {
  return {
    id: nextId++,
    nom_commun: 'Poisson',
    nom_famille: 'Characidae',
    nom_comportement: 'pacifique',
    nom_mode_vie: 'banc',
    nom_robustesse: 'tolérant',
    nom_zone_geo: 'Amérique du Sud',
    nom_courant: 'doux',
    regime: 'omnivore',
    taille: 4,
    nb_individus: 1,
    points: 5,
    litrage_mini: 60,
    ph_mini: 6, ph_maxi: 7.5,
    gh_mini: 3, gh_maxi: 12,
    temp_mini: 23, temp_maxi: 28,
    quantite: 1,
    ...overrides,
  };
}

export const cardinalis = (q = 10) => fish({
  id: 1, nom_commun: 'Cardinalis', taille: 4, nb_individus: 10, points: 5, litrage_mini: 100,
  ph_mini: 4, ph_maxi: 6.5, gh_mini: 3, gh_maxi: 12, temp_mini: 25, temp_maxi: 29, quantite: q,
});

export const neon = (q = 10) => fish({
  id: 3, nom_commun: 'Néon Bleu', taille: 3, nb_individus: 10, points: 5, litrage_mini: 80,
  ph_mini: 6, ph_maxi: 7.2, gh_mini: 4, gh_maxi: 10, temp_mini: 20, temp_maxi: 26, quantite: q,
});

export const scalaire = (q = 2) => fish({
  id: 30, nom_commun: 'Scalaire', nom_famille: 'Cichlidae américain', nom_comportement: 'peu agressif',
  nom_mode_vie: 'couple', regime: 'carnivore', taille: 15, nb_individus: 2, points: 20, litrage_mini: 200,
  ph_mini: 6, ph_maxi: 7.5, gh_mini: 3, gh_maxi: 15, temp_mini: 24, temp_maxi: 30, quantite: q,
});

export const discus = (q = 5) => fish({
  id: 31, nom_commun: 'Discus', nom_famille: 'Cichlidae américain', nom_mode_vie: 'petit groupe',
  nom_robustesse: 'sensible', regime: 'carnivore', taille: 15, nb_individus: 5, points: 30, litrage_mini: 350,
  ph_mini: 5, ph_maxi: 7, gh_mini: 1, gh_maxi: 8, temp_mini: 26, temp_maxi: 31, quantite: q,
});

export const channa = (q = 1) => fish({
  id: 60, nom_commun: 'Channa bleheri', nom_famille: 'Channidae', nom_comportement: 'prédateur',
  nom_mode_vie: 'solitaire', nom_zone_geo: 'Asie', regime: 'carnivore', taille: 18, nb_individus: 1, points: 50,
  litrage_mini: 200, ph_mini: 5.5, ph_maxi: 7.5, gh_mini: 5, gh_maxi: 12, temp_mini: 20, temp_maxi: 25, quantite: q,
});

export const combattant = (q = 1) => fish({
  id: 70, nom_commun: 'Combattant', nom_famille: 'Osphronemidae', nom_comportement: 'agressif',
  nom_mode_vie: 'solitaire', nom_zone_geo: 'Asie', nom_courant: 'stagnant, doux', taille: 6, nb_individus: 1,
  points: 10, litrage_mini: 30, ph_mini: 6, ph_maxi: 7.5, gh_mini: 5, gh_maxi: 15, temp_mini: 24, temp_maxi: 30,
  quantite: q,
});

export const guppy = (q = 4) => fish({
  id: 50, nom_commun: 'Guppy', nom_famille: 'Poeciliidae', nom_mode_vie: 'harem', nom_zone_geo: 'Amérique du Sud',
  taille: 4, nb_individus: 4, points: 5, litrage_mini: 60, ph_mini: 6.5, ph_maxi: 8, gh_mini: 6, gh_maxi: 15,
  temp_mini: 22, temp_maxi: 28, quantite: q,
});

export const danioRerio = (q = 6) => fish({
  id: 20, nom_commun: 'Danio rério', nom_famille: 'Danionidae', nom_zone_geo: 'Asie', nom_courant: 'modéré',
  taille: 5, nb_individus: 6, points: 5, litrage_mini: 60, ph_mini: 6.5, ph_maxi: 7.5, gh_mini: 5, gh_maxi: 15,
  temp_mini: 18, temp_maxi: 24, quantite: q,
});

export const silureDeVerre = (q = 6) => fish({
  id: 80, nom_commun: 'Silure de verre', nom_famille: 'Siluridae', nom_zone_geo: 'Asie', nom_courant: 'fort',
  regime: 'carnivore', taille: 12, nb_individus: 6, points: 10, litrage_mini: 150, ph_mini: 6, ph_maxi: 7.5,
  gh_mini: 5, gh_maxi: 15, temp_mini: 24, temp_maxi: 28, quantite: q,
});

export const labeo = (q = 1) => fish({
  id: 90, nom_commun: 'Labéo', nom_famille: 'Cyprinidé', nom_comportement: 'moyennement agressif',
  nom_mode_vie: 'solitaire', nom_zone_geo: 'Asie', nom_courant: 'modéré', taille: 12, nb_individus: 1,
  points: 20, litrage_mini: 200, ph_mini: 6.5, ph_maxi: 7.5, gh_mini: 5, gh_maxi: 15, temp_mini: 22, temp_maxi: 28,
  quantite: q,
});

export const rasboraNain = (q = 8) => fish({
  id: 40, nom_commun: 'Rasbora nain', nom_famille: 'Danionidae', nom_robustesse: 'fragile', nom_zone_geo: 'Asie',
  taille: 2, nb_individus: 8, points: 2, litrage_mini: 40, ph_mini: 5.5, ph_maxi: 7, gh_mini: 2, gh_maxi: 10,
  temp_mini: 24, temp_maxi: 28, quantite: q,
});

/** Invertébré et plante au format de l'API, passés par espece() comme dans le simulateur */
export const invertebre = (overrides = {}, q = 5) => ({
  ...espece('invertebre', {
    id: nextId++, nom_commun: 'Crevette', groupe: 'crevette', famille: 'Atyidae', comportement: 'pacifique',
    mode_vie: 'colonie', regime: 'détritivore', installation: 'aquarium', reproduction: 'en eau douce', taille: 3,
    nb_individus: 5, litrage_mini: 20, ph_mini: 6.5, ph_maxi: 7.5, gh_mini: null, gh_maxi: null, temp_mini: 20,
    temp_maxi: 28, zone_geo: 'Asie', ...overrides,
  }),
  quantite: q,
});

export const plante = (overrides = {}) => ({
  ...espece('plante', {
    id: nextId++, nom_commun: 'Plante', famille: 'Araceae', type: 'tige', lumiere_mini: 'faible', lumiere_maxi: 'forte',
    co2: null, usages: [], ph_mini: 6, ph_maxi: 8, temp_mini: 18, temp_maxi: 30, ...overrides,
  }),
  quantite: 1,
});

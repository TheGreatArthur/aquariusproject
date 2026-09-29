/**
 * Niveaux numériques des catégories normalisées par l'import (voir backend/normalize.py)
 */

// Tempérament, du plus paisible au plus dangereux
export const COMPORTEMENT_NIVEAUX = {
  'pacifique': 0,
  'peu agressif': 1,
  'territorial': 2,
  'moyennement agressif': 2,
  'agressif': 3,
  'prédateur': 4,
};

export const NIVEAU_AGRESSIF = 3;
export const NIVEAU_PREDATEUR = 4;

export const niveauComportement = (p) => COMPORTEMENT_NIVEAUX[p.nom_comportement] ?? 0;

// Courant, du plus faible au plus fort
export const COURANTS = ['stagnant', 'doux', 'modéré', 'fort'];

/**
 * Plage de courant d'un poisson sous forme de niveaux : 'doux, modéré' -> [1, 2] ; null si inconnue
 */
export function plageCourant (p) {
  const niveaux = (p.nom_courant ?? '').split(',')
    .map((c) => COURANTS.indexOf(c.trim()))
    .filter((n) => n >= 0);
  return niveaux.length ? [Math.min(...niveaux), Math.max(...niveaux)] : null;
}

export const estCarnivore = (p) => (p.regime ?? '').includes('carnivore');

export const ESPECES_DELICATES = ['fragile', 'sensible'];

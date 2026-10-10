/**
 * Règles propres aux invertébrés : crevettes mangées par les poissons, chasseurs, escargot assassin, installation
 */

import { estAnimal, estPoisson } from '../especes';
import { estCarnivore, NIVEAU_PREDATEUR, niveauComportement } from '../levels';
import { issue, liste } from '../utils';
import { gobeur, RATIO_BOUCHE } from './cohabitation';

// Au-delà, une écrevisse attrape aussi les poissons et les escargots (Cherax, Procambarus) ; en dessous, des crevettes
export const TAILLE_GRANDE_ECREVISSE = 8;

const invertebres = (panier, groupe) => panier.filter((p) => p.kind === 'invertebre' && (!groupe || p.groupe === groupe));

/**
 * 15. Crevettes mangées : un poisson omnivore ou carnivore au moins trois fois plus grand qu'une crevette la mange,
 * même s'il est pacifique (les carnivores agressifs et les prédateurs relèvent des règles 2 et 3)
 */
export function crevettes (panier) {
  const proies = invertebres(panier, 'crevette').filter((q) => q.taille);
  return panier.filter((p) => estPoisson(p) && /omnivore|carnivore/.test(p.regime ?? '') && !gobeur(p)
    && niveauComportement(p) < NIVEAU_PREDATEUR).flatMap((p) => {
    const mangees = proies.filter((q) => p.taille >= RATIO_BOUCHE * q.taille);
    return mangees.length
      ? [issue('crevettes', 'warning',
        `${p.nom_commun} (${p.taille} cm) mange les petites crevettes, surtout les jeunes : `
        + `${liste(mangees.map((q) => q.nom_commun))}. Prévoyez des cachettes denses (mousses, plantes fines).`,
        [p.id, ...mangees.map((q) => q.id)])]
      : [];
  });
}

/** 16. Écrevisses et crevettes carnivores : les grandes chassent tout ce qui est plus petit, les naines les crevettes */
export function chasseurs (panier) {
  return invertebres(panier).filter((p) => p.groupe === 'écrevisse' || (p.groupe === 'crevette' && estCarnivore(p)))
    .flatMap((p) => {
      const grande = p.taille >= TAILLE_GRANDE_ECREVISSE;
      const proies = panier.filter((q) => q.id !== p.id && estAnimal(q)
        && (grande ? (q.taille ?? 0) < p.taille : q.groupe === 'crevette'));
      return proies.length
        ? [issue('chasseurs', 'warning',
          `${p.nom_commun} (${p.taille} cm) attrape la nuit ${grande ? 'les animaux plus petits' : 'les crevettes en mue'} : `
          + `${liste(proies.map((q) => q.nom_commun))}.`, [p.id, ...proies.map((q) => q.id)])]
        : [];
    });
}

/** 17. Escargot carnivore (escargot assassin) : il mange les autres escargots */
export function escargots (panier) {
  return invertebres(panier, 'escargot').filter(estCarnivore).flatMap((p) => {
    const proies = invertebres(panier, 'escargot').filter((q) => q.id !== p.id);
    return proies.length
      ? [issue('escargots', 'error', `${p.nom_commun} mange les autres escargots : ${liste(proies.map((q) => q.nom_commun))}.`,
        [p.id, ...proies.map((q) => q.id)])]
      : [];
  });
}

/** 18. Espèce d'aquaterrarium (crabe vampire) : il lui faut une partie émergée */
export function aquaterrarium (panier) {
  return invertebres(panier).filter((p) => p.installation === 'aquaterrarium').map((p) => issue('aquaterrarium',
    'warning', `${p.nom_commun} vit en aquaterrarium : prévoyez une partie terrestre et un couvercle étanche.`, [p.id]));
}

/** 19. Larves qui ne se développent qu'en eau saumâtre ou en mer : pas de reproduction dans le bac */
export function larves (panier) {
  const especes = invertebres(panier).filter((p) => p.reproduction?.startsWith('larves'));
  return especes.length
    ? [issue('larves', 'info', `Pas de reproduction en eau douce pour ${liste(especes.map((p) => p.nom_commun))} : `
      + 'les larves ont besoin d\'eau saumâtre ou de mer.', [])]
    : [];
}

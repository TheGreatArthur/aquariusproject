/**
 * Règles propres aux invertébrés : crevettes mangées par les poissons, chasseurs, escargot assassin, installation
 */

import { translator } from '@/lib/i18n';
import type { Environment, Species } from '@/lib/types';

import { estAnimal, estPoisson } from '../especes';
import { estCarnivore, NIVEAU_PREDATEUR, niveauComportement } from '../levels';
import { issue, liste } from '../utils';
import { gobeur, RATIO_BOUCHE } from './cohabitation';

// Au-delà, une écrevisse attrape aussi les poissons et les escargots (Cherax, Procambarus) ; en dessous, des crevettes
export const TAILLE_GRANDE_ECREVISSE = 8;

const invertebres = (panier: Species[], groupe?: string) =>
  panier.filter((p) => p.kind === 'invertebre' && (!groupe || p.groupe === groupe));

/**
 * 15. Crevettes mangées : un poisson omnivore ou carnivore au moins trois fois plus grand qu'une crevette la mange,
 * même s'il est pacifique (les carnivores agressifs et les prédateurs relèvent des règles 2 et 3)
 */
export function crevettes (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  const proies = invertebres(panier, 'crevette').filter((q): q is Species & { taille: number } => !!q.taille);
  return panier.filter((p) => estPoisson(p) && /omnivore|carnivore/.test(p.regime ?? '') && !gobeur(p)
    && niveauComportement(p) < NIVEAU_PREDATEUR).flatMap((p) => {
    const mangees = proies.filter((q) => (p.taille ?? 0) >= RATIO_BOUCHE * q.taille);
    return mangees.length
      ? [issue('crevettes', 'warning',
        t(`${p.nom_commun} (${p.taille} cm) mange les petites crevettes, surtout les jeunes : `
          + `${liste(mangees.map((q) => q.nom_commun))}. Prévoyez des cachettes denses (mousses, plantes fines).`,
        `${p.nom_commun} (${p.taille} cm) eats small shrimp, especially the young: `
          + `${liste(mangees.map((q) => q.nom_commun), locale)}. Provide dense cover (mosses, fine-leaved plants).`),
        [p.id, ...mangees.map((q) => q.id)])]
      : [];
  });
}

/** 16. Écrevisses et crevettes carnivores : les grandes chassent tout ce qui est plus petit, les naines les crevettes */
export function chasseurs (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return invertebres(panier).filter((p) => p.groupe === 'écrevisse' || (p.groupe === 'crevette' && estCarnivore(p)))
    .flatMap((p) => {
      const grande = (p.taille ?? 0) >= TAILLE_GRANDE_ECREVISSE;
      const proies = panier.filter((q) => q.id !== p.id && estAnimal(q)
        && (grande ? (q.taille ?? 0) < (p.taille ?? 0) : q.groupe === 'crevette'));
      return proies.length
        ? [issue('chasseurs', 'warning',
          t(`${p.nom_commun} (${p.taille} cm) attrape la nuit ${grande ? 'les animaux plus petits' : 'les crevettes en mue'} : `
            + `${liste(proies.map((q) => q.nom_commun))}.`,
          `${p.nom_commun} (${p.taille} cm) catches ${grande ? 'smaller animals' : 'moulting shrimp'} at night: `
            + `${liste(proies.map((q) => q.nom_commun), locale)}.`), [p.id, ...proies.map((q) => q.id)])]
        : [];
    });
}

/** 17. Escargot carnivore (escargot assassin) : il mange les autres escargots */
export function escargots (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return invertebres(panier, 'escargot').filter(estCarnivore).flatMap((p) => {
    const proies = invertebres(panier, 'escargot').filter((q) => q.id !== p.id);
    return proies.length
      ? [issue('escargots', 'error', t(`${p.nom_commun} mange les autres escargots : ${liste(proies.map((q) => q.nom_commun))}.`,
        `${p.nom_commun} eats other snails: ${liste(proies.map((q) => q.nom_commun), locale)}.`),
      [p.id, ...proies.map((q) => q.id)])]
      : [];
  });
}

/** 18. Espèce d'aquaterrarium (crabe vampire) : il lui faut une partie émergée */
export function aquaterrarium (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return invertebres(panier).filter((p) => p.installation === 'aquaterrarium').map((p) => issue('aquaterrarium',
    'warning', t(`${p.nom_commun} vit en aquaterrarium : prévoyez une partie terrestre et un couvercle étanche.`,
      `${p.nom_commun} lives in a paludarium: provide a land area and a tight-fitting lid.`), [p.id]));
}

/** 19. Larves qui ne se développent qu'en eau saumâtre ou en mer : pas de reproduction dans le bac */
export function larves (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  const especes = invertebres(panier).filter((p) => p.reproduction?.startsWith('larves'));
  return especes.length
    ? [issue('larves', 'info', t(`Pas de reproduction en eau douce pour ${liste(especes.map((p) => p.nom_commun))} : `
      + 'les larves ont besoin d\'eau saumâtre ou de mer.',
    `No breeding in fresh water for ${liste(especes.map((p) => p.nom_commun), locale)}: `
      + 'the larvae need brackish or sea water.'), [])]
    : [];
}

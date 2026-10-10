/**
 * Règles de cohabitation entre espèces : prédation, tempérament, familles, biotope
 */

import { estAnimal } from '../especes';
import { estCarnivore, NIVEAU_PREDATEUR, niveauComportement } from '../levels';
import { translator } from '@/lib/i18n';

import { issue, liste } from '../utils';

// Animaux de taille connue (la taille de beaucoup d'escargots n'est pas renseignée)
const mesures = (panier) => panier.filter((p) => estAnimal(p) && p.taille);

// Paires de familles qui ne cohabitent pas, avec la raison affichée
export const FAMILLES_INCOMPATIBLES = [
  {
    familles: ['Osphronemidae', 'Poeciliidae'],
    raison: 'les gouramis et combattants s\'en prennent aux nageoires colorées des vivipares',
    reason: 'gouramis and bettas nip the colourful fins of livebearers',
  },
];

// Le grand poisson doit faire au moins ce multiple de la taille du petit pour pouvoir l'avaler
export const RATIO_BOUCHE = 3;

/** 2. Un prédateur déclaré mange les poissons qui font au plus la moitié de sa taille */
export function predateur (panier, { locale } = {}) {
  const { t } = translator(locale);
  return mesures(panier).filter((p) => niveauComportement(p) === NIVEAU_PREDATEUR).flatMap((p) => {
    const proies = mesures(panier).filter((q) => q.id !== p.id && q.taille <= p.taille / 2);
    return proies.length
      ? [issue('predateur', 'error',
        t(`${p.nom_commun} est un prédateur (${p.taille} cm) : il mangera ${liste(proies.map((q) => q.nom_commun))}.`,
          `${p.nom_commun} is a predator (${p.taille} cm): it will eat ${liste(proies.map((q) => q.nom_commun), locale)}.`),
        [p.id, ...proies.map((q) => q.id)])]
      : [];
  });
}

/**
 * 3. Taille de bouche : un carnivore non pacifique avale les poissons 3 fois plus petits que lui.
 * Les prédateurs déclarés relèvent de la règle 2 ; les carnivores pacifiques (discus…) sont exclus.
 */
export function bouche (panier, { locale } = {}) {
  const { t } = translator(locale);
  return mesures(panier).filter(gobeur).flatMap((p) => {
    const proies = mesures(panier).filter((q) => q.id !== p.id && p.taille >= RATIO_BOUCHE * q.taille);
    return proies.length
      ? [issue('bouche', 'warning',
        t(`${p.nom_commun} (${p.taille} cm, carnivore) peut gober ${liste(proies.map((q) => `${q.nom_commun} (${q.taille} cm)`))}.`,
          `${p.nom_commun} (${p.taille} cm, carnivore) can swallow `
          + `${liste(proies.map((q) => `${q.nom_commun} (${q.taille} cm)`), locale)}.`),
        [p.id, ...proies.map((q) => q.id)])]
      : [];
  });
}

/** Carnivore non pacifique, qui n'est pas un prédateur déclaré (règle 3) */
export function gobeur (p) {
  const niveau = niveauComportement(p);
  return estCarnivore(p) && niveau > 0 && niveau < NIVEAU_PREDATEUR;
}

/** 4. Écart de tempérament d'au moins 2 niveaux : les plus agressifs harcèlent les plus calmes */
export function agressivite (tout, { locale } = {}) {
  const { t, term } = translator(locale);
  const panier = tout.filter(estAnimal);
  if (panier.length < 2)
    return [];
  const niveaux = panier.map(niveauComportement);
  const max = Math.max(...niveaux);
  const min = Math.min(...niveaux);
  if (max - min < 2)
    return [];
  const agressifs = panier.filter((p) => niveauComportement(p) >= min + 2);
  const calmes = panier.filter((p) => niveauComportement(p) <= max - 2);
  const nom = (p) => `${p.nom_commun} (${term(p.nom_comportement)})`;
  return [issue('agressivite', 'warning',
    t(`Tempéraments trop différents : ${liste(agressifs.map(nom))} risque de harceler ${liste(calmes.map(nom))}.`,
      `Temperaments too far apart: ${liste(agressifs.map(nom), locale)} may harass ${liste(calmes.map(nom), locale)}.`),
    [...agressifs, ...calmes].map((p) => p.id))];
}

/** 14. Familles connues pour ne pas cohabiter */
export function familles (panier, { locale } = {}) {
  const { t } = translator(locale);
  return FAMILLES_INCOMPATIBLES.flatMap(({ familles: [fa, fb], raison, reason }) => {
    const a = panier.filter((p) => p.nom_famille === fa);
    const b = panier.filter((p) => p.nom_famille === fb);
    return a.length && b.length
      ? [issue('familles', 'error',
        t(`${liste(a.map((p) => p.nom_commun))} et ${liste(b.map((p) => p.nom_commun))} : ${raison}.`,
          `${liste(a.map((p) => p.nom_commun), locale)} and ${liste(b.map((p) => p.nom_commun), locale)}: ${reason}.`),
        [...a, ...b].map((p) => p.id))]
      : [];
  });
}

/** 6. Bac biotope : toutes les espèces viennent de la même région (information positive) */
export function biotope (tout, { locale } = {}) {
  const { t, term } = translator(locale);
  const panier = tout.filter(estAnimal);
  const zones = new Set(panier.map((p) => p.nom_zone_geo));
  const [zone] = zones;
  return panier.length >= 2 && zones.size === 1 && zone && zone !== 'International'
    ? [issue('biotope', 'info', t(`Bac biotope : toutes les espèces viennent de la région ${zone}.`,
      `Biotope tank: every species comes from ${term(zone)}.`), [])]
    : [];
}

/**
 * Règles de population : capacité du bac, taille et composition des groupes, espèces délicates
 */

import { ESPECES_DELICATES, NIVEAU_AGRESSIF, niveauComportement } from '../levels';
import { translator } from '@/lib/i18n';

import { issue } from '../utils';

export const SEUIL_BAC_PLEIN = 0.8;
export const LITRAGE_MIN_DELICATE = 60;
export const MARGE_DELICATE = 1.5;

/** Charge du bac : somme des points de chaque poisson (1 point ≈ 1 litre) */
export const totalPoints = (panier) => panier.reduce((total, p) => total + (p.points ?? 0) * p.quantite, 0);

/** 12. Surpopulation : avertissement au-delà de 80 % de la capacité, blocage au-delà de 100 % */
export function surpopulation (panier, { litrage, locale }) {
  const { t } = translator(locale);
  if (!litrage || !panier.length)
    return [];
  const total = totalPoints(panier);
  const charge = total / litrage;
  if (charge <= SEUIL_BAC_PLEIN)
    return [];
  const lourds = [...panier].sort((a, b) => b.points * b.quantite - a.points * a.quantite).slice(0, 2);
  const detail = t(`${total} points pour ${litrage} L (${Math.round(charge * 100)} %)`,
    `${total} points for ${litrage} L (${Math.round(charge * 100)}%)`);
  return charge > 1
    ? [issue('surpopulation', 'error', t(
      `Surpopulation : ${detail}. Les espèces les plus lourdes : ${lourds.map((p) => p.nom_commun).join(', ')}.`,
      `Overstocked: ${detail}. The heaviest species: ${lourds.map((p) => p.nom_commun).join(', ')}.`),
    lourds.map((p) => p.id))]
    : [issue('surpopulation', 'warning', t(`Bac presque plein : ${detail}.`, `Tank nearly full: ${detail}.`), [])];
}

/** 13. Sous-population : moins d'individus que le groupe minimum de l'espèce */
export function souspopulation (panier, { locale } = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.quantite < p.nb_individus).map((p) => issue('souspopulation', 'warning',
    t(`Groupe trop petit : ${p.quantite} ${p.nom_commun} au lieu de ${p.nb_individus} minimum.`,
      `Group too small: ${p.quantite} ${p.nom_commun} instead of at least ${p.nb_individus}.`), [p.id]));
}

/** 7. Espèce solitaire gardée à plusieurs */
export function solitaire (panier, { locale } = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.nom_mode_vie === 'solitaire' && p.quantite > 1).map((p) => issue('solitaire',
    'warning', t(`${p.nom_commun} vit en solitaire : gardez un seul individu (${p.quantite} prévus).`,
      `${p.nom_commun} lives alone: keep a single specimen (${p.quantite} planned).`), [p.id]));
}

/** 8. Plusieurs individus d'une espèce agressive (ex. : combattants) */
export function agressifs (panier, { locale } = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => niveauComportement(p) === NIVEAU_AGRESSIF && p.quantite > 1).map((p) => issue(
    'agressifs', 'error', t(`${p.quantite} ${p.nom_commun} ensemble : risque de combats entre individus.`,
      `${p.quantite} ${p.nom_commun} together: they may fight each other.`), [p.id]));
}

/** 9. Espèce vivant en couple : nombre pair conseillé */
export function couple (panier, { locale } = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.nom_mode_vie === 'couple' && p.quantite % 2).map((p) => issue('couple', 'info',
    t(`${p.nom_commun} vit en couple : prévoyez un nombre pair d'individus.`,
      `${p.nom_commun} lives in pairs: plan an even number.`), [p.id]));
}

/** 10. Espèce vivant en harem : 1 mâle pour 3 femelles */
export function harem (panier, { locale } = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.nom_mode_vie === 'harem' && p.quantite % 4).map((p) => issue('harem', 'info',
    t(`${p.nom_commun} vit en harem (1 mâle pour 3 femelles) : prévoyez des groupes de 4.`,
      `${p.nom_commun} lives in harems (1 male to 3 females): plan groups of 4.`), [p.id]));
}

/** 11. Espèce délicate dans un bac trop petit */
export function delicate (panier, { litrage, locale }) {
  const { t, term } = translator(locale);
  if (!litrage)
    return [];
  return panier.filter((p) => ESPECES_DELICATES.includes(p.nom_robustesse)).flatMap((p) => {
    const conseille = Math.max(LITRAGE_MIN_DELICATE, Math.ceil(p.litrage_mini * MARGE_DELICATE));
    return litrage < conseille
      ? [issue('delicate', 'warning', t(
        `${p.nom_commun} est une espèce ${p.nom_robustesse} : prévoyez un bac stable et maturé d'au moins `
          + `${conseille} L.`,
        `${p.nom_commun} is a ${term(p.nom_robustesse)} species: plan a stable, mature tank of at least `
          + `${conseille} L.`), [p.id])]
      : [];
  });
}

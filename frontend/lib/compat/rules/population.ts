/**
 * Règles de population : capacité du bac, taille et composition des groupes, espèces délicates
 */

import { translator } from '@/lib/i18n';
import type { Environment, Species } from '@/lib/types';

import { ESPECES_DELICATES, NIVEAU_AGRESSIF, niveauComportement } from '../levels';
import { issue } from '../utils';

export const SEUIL_BAC_PLEIN = 0.8;
export const LITRAGE_MIN_DELICATE = 60;
export const MARGE_DELICATE = 1.5;

/** Charge du bac : somme des points de chaque poisson (1 point ≈ 1 litre) */
export const totalPoints = (panier: Species[]) => panier.reduce((total, p) => total + (p.points ?? 0) * p.quantite, 0);

/** 12. Surpopulation : avertissement au-delà de 80 % de la capacité, blocage au-delà de 100 % */
export function surpopulation (panier: Species[], { litrage, locale }: Environment) {
  const { t } = translator(locale);
  if (!litrage || !panier.length)
    return [];
  const total = totalPoints(panier);
  const charge = total / litrage;
  if (charge <= SEUIL_BAC_PLEIN)
    return [];
  const poids = (p: Species) => (p.points ?? 0) * p.quantite;
  const lourds = [...panier].sort((a, b) => poids(b) - poids(a)).slice(0, 2);
  const detail = t(`${total} points pour ${litrage} L (${Math.round(charge * 100)} %)`,
    `${total} points for ${litrage} L (${Math.round(charge * 100)}%)`,
    `${litrage} L に対して ${total} ポイント（${Math.round(charge * 100)}%）`);
  return charge > 1
    ? [issue('surpopulation', 'error', t(
      `Surpopulation : ${detail}. Les espèces les plus lourdes : ${lourds.map((p) => p.nom_commun).join(', ')}.`,
      `Overstocked: ${detail}. The heaviest species: ${lourds.map((p) => p.nom_commun).join(', ')}.`,
      `過密です：${detail}。負荷の大きい種：${lourds.map((p) => p.nom_commun).join('、')}。`),
    lourds.map((p) => p.id))]
    : [issue('surpopulation', 'warning', t(`Bac presque plein : ${detail}.`, `Tank nearly full: ${detail}.`, `水槽がほぼ満杯です：${detail}。`), [])];
}

/** 13. Sous-population : moins d'individus que le groupe minimum de l'espèce */
export function souspopulation (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.quantite < (p.nb_individus ?? 1)).map((p) => issue('souspopulation', 'warning',
    t(`Groupe trop petit : ${p.quantite} ${p.nom_commun} au lieu de ${p.nb_individus} minimum.`,
      `Group too small: ${p.quantite} ${p.nom_commun} instead of at least ${p.nb_individus}.`,
      `群れが小さすぎます：${p.nom_commun}が${p.quantite}匹（最低${p.nb_individus}匹）。`), [p.id]));
}

/** 7. Espèce solitaire gardée à plusieurs */
export function solitaire (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.nom_mode_vie === 'solitaire' && p.quantite > 1).map((p) => issue('solitaire',
    'warning', t(`${p.nom_commun} vit en solitaire : gardez un seul individu (${p.quantite} prévus).`,
      `${p.nom_commun} lives alone: keep a single specimen (${p.quantite} planned).`,
      `${p.nom_commun}は単独で暮らします：1匹だけにしてください（現在${p.quantite}匹）。`), [p.id]));
}

/** 8. Plusieurs individus d'une espèce agressive (ex. : combattants) */
export function agressifs (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => niveauComportement(p) === NIVEAU_AGRESSIF && p.quantite > 1).map((p) => issue(
    'agressifs', 'error', t(`${p.quantite} ${p.nom_commun} ensemble : risque de combats entre individus.`,
      `${p.quantite} ${p.nom_commun} together: they may fight each other.`,
      `${p.nom_commun}を${p.quantite}匹一緒に：個体同士で争うおそれがあります。`), [p.id]));
}

/** 9. Espèce vivant en couple : nombre pair conseillé */
export function couple (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.nom_mode_vie === 'couple' && p.quantite % 2).map((p) => issue('couple', 'info',
    t(`${p.nom_commun} vit en couple : prévoyez un nombre pair d'individus.`,
      `${p.nom_commun} lives in pairs: plan an even number.`,
      `${p.nom_commun}はペアで暮らします：偶数で飼育してください。`), [p.id]));
}

/** 10. Espèce vivant en harem : 1 mâle pour 3 femelles */
export function harem (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  return panier.filter((p) => p.nom_mode_vie === 'harem' && p.quantite % 4).map((p) => issue('harem', 'info',
    t(`${p.nom_commun} vit en harem (1 mâle pour 3 femelles) : prévoyez des groupes de 4.`,
      `${p.nom_commun} lives in harems (1 male to 3 females): plan groups of 4.`,
      `${p.nom_commun}はハーレムで暮らします（オス1匹にメス3匹）：4匹単位で飼育してください。`), [p.id]));
}

/** 11. Espèce délicate dans un bac trop petit */
export function delicate (panier: Species[], { litrage, locale }: Environment) {
  const { t, term } = translator(locale);
  if (!litrage)
    return [];
  return panier.filter((p) => ESPECES_DELICATES.includes(p.nom_robustesse ?? '')).flatMap((p) => {
    const conseille = Math.max(LITRAGE_MIN_DELICATE, Math.ceil((p.litrage_mini ?? 0) * MARGE_DELICATE));
    return litrage < conseille
      ? [issue('delicate', 'warning', t(
        `${p.nom_commun} est une espèce ${p.nom_robustesse} : prévoyez un bac stable et maturé d'au moins `
          + `${conseille} L.`,
        `${p.nom_commun} is a ${term(p.nom_robustesse)} species: plan a stable, mature tank of at least `
          + `${conseille} L.`,
        `${p.nom_commun}は${term(p.nom_robustesse)}な種です：安定して立ち上がった`
          + `${conseille} L 以上の水槽を用意してください。`), [p.id])]
      : [];
  });
}

/**
 * Règles liées à l'eau : paramètres communs, courant
 */

import { translator } from '@/lib/i18n';
import type { Environment, Locale, Ranges, Species, WaterKey } from '@/lib/types';

import { plageCourant } from '../levels';
import { formatRange, issue, paires } from '../utils';

export const PARAMETRES: { key: WaterKey, label: string, en: string, ja: string, unit: string }[] = [
  { key: 'ph', label: 'pH', en: 'pH', ja: 'pH', unit: '' },
  { key: 'gh', label: 'GH', en: 'GH', ja: 'GH', unit: '°' },
  { key: 'temp', label: 'température', en: 'temperature', ja: '水温', unit: ' °C' },
];

// Espèces dont la fiche donne ce paramètre (pas de GH pour les plantes ni pour la plupart des invertébrés)
const avec = (panier: Species[], key: WaterKey) => panier.filter((p) => p[`${key}_mini`] != null);

// Bornes d'un paramètre, pour une espèce qui le donne
const mini = (p: Species, key: WaterKey) => p[`${key}_mini`] as number;
const maxi = (p: Species, key: WaterKey) => p[`${key}_maxi`] as number;

/**
 * Plages de pH, GH et température acceptées par toutes les espèces du bac ; null si le bac est vide.
 * Une plage vide vaut null, un paramètre qu'aucune espèce ne donne vaut undefined :
 * { ph: [6, 6.5], gh: null, temp: [25, 26] }
 */
export function commonRanges (panier: Species[]): Ranges | null {
  if (!panier.length)
    return null;
  return Object.fromEntries(PARAMETRES.map(({ key }) => {
    const especes = avec(panier, key);
    if (!especes.length)
      return [key, undefined];
    const min = Math.max(...especes.map((p) => mini(p, key)));
    const max = Math.min(...especes.map((p) => maxi(p, key)));
    return [key, min <= max ? [min, max] : null];
  })) as Ranges;
}

const plage = (p: Species, key: WaterKey, unit: string, locale?: Locale) =>
  formatRange(p[`${key}_mini`], p[`${key}_maxi`], unit, locale);

/** 1. Les espèces doivent partager une plage commune de pH, de GH et de température */
export function parametres (panier: Species[], { locale }: Environment = {}) {
  const { t } = translator(locale);
  const ranges = commonRanges(panier);
  if (!ranges || panier.length < 2)
    return [];
  return PARAMETRES.filter(({ key }) => ranges[key] === null).map(({ key, label, en, ja, unit }) => {
    // Les deux espèces responsables : le minimum le plus haut et le maximum le plus bas
    const haut = avec(panier, key).reduce((a, b) => (mini(b, key) > mini(a, key) ? b : a));
    const bas = avec(panier, key).reduce((a, b) => (maxi(b, key) < maxi(a, key) ? b : a));
    return issue('parametres', 'error',
      t(`Pas de ${label} commun : ${haut.nom_commun} (${plage(haut, key, unit)}) et ${bas.nom_commun} `
        + `(${plage(bas, key, unit)}) ne peuvent pas vivre dans la même eau.`,
      `No common ${en}: ${haut.nom_commun} (${plage(haut, key, unit, locale)}) and ${bas.nom_commun} `
        + `(${plage(bas, key, unit, locale)}) cannot live in the same water.`,
      `${ja}の共通範囲がありません：${haut.nom_commun}（${plage(haut, key, unit, locale)}）と${bas.nom_commun}`
        + `（${plage(bas, key, unit, locale)}）は同じ水では飼えません。`),
      [haut.id, bas.id]);
  });
}

/** 0. Espèces qui ne supportent pas l'eau ou le volume indiqués pour le bac */
export function votreEau (panier: Species[], { litrage, pH, gH, tempMoyenne, locale }: Environment = {}) {
  const { t } = translator(locale);
  const eau: Record<WaterKey, number | undefined> = { ph: pH, gh: gH, temp: tempMoyenne };
  return panier.flatMap((p) => {
    const hors = PARAMETRES
      .filter(({ key }) => {
        const valeur = eau[key];
        return valeur != null && p[`${key}_mini`] != null && (valeur < mini(p, key) || valeur > maxi(p, key));
      })
      .map(({ key, label, en, ja, unit }) => `${t(label, en, ja)} ${plage(p, key, unit, locale)}`);
    if (litrage && (p.litrage_mini ?? 0) > litrage)
      hors.push(t(`bac d'au moins ${p.litrage_mini} L`, `tank of at least ${p.litrage_mini} L`, `${p.litrage_mini} L 以上の水槽`));
    return hors.length
      ? [issue('eau', 'error', t(`${p.nom_commun} ne convient pas à votre bac (${hors.join(', ')}).`,
        `${p.nom_commun} does not suit your tank (${hors.join(', ')}).`,
        `${p.nom_commun}はあなたの水槽に合いません（${hors.join('、')}）。`), [p.id])]
      : [];
  });
}

/** 5. Deux espèces dont les courants préférés sont écartés d'au moins 2 niveaux */
export function courant (panier: Species[], { locale }: Environment = {}) {
  const { t, term } = translator(locale);
  return paires(panier).flatMap(([a, b]) => {
    const pa = plageCourant(a);
    const pb = plageCourant(b);
    if (!pa || !pb || Math.max(pa[0], pb[0]) - Math.min(pa[1], pb[1]) < 2)
      return [];
    const nom = (p: Species) => `${p.nom_commun} (${term(p.nom_courant)})`;
    return [issue('courant', 'warning',
      t(`Courant incompatible : ${nom(a)} et ${nom(b)} n'ont pas besoin du même brassage.`,
        `Incompatible current: ${nom(a)} and ${nom(b)} need different water flow.`,
        `水流が合いません：${nom(a)}と${nom(b)}は必要な水流が異なります。`),
      [a.id, b.id])];
  });
}

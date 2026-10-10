/**
 * Règles liées à l'eau : paramètres communs, courant
 */

import { plageCourant } from '../levels';
import { issue, paires, plageFr } from '../utils';

export const PARAMETRES = [
  { key: 'ph', label: 'pH', unit: '' },
  { key: 'gh', label: 'GH', unit: '°' },
  { key: 'temp', label: 'température', unit: ' °C' },
];

// Espèces dont la fiche donne ce paramètre (pas de GH pour les plantes ni pour la plupart des invertébrés)
const avec = (panier, key) => panier.filter((p) => p[`${key}_mini`] != null);

/**
 * Plages de pH, GH et température acceptées par toutes les espèces du bac ; null si le bac est vide.
 * Une plage vide vaut null, un paramètre qu'aucune espèce ne donne vaut undefined :
 * { ph: [6, 6.5], gh: null, temp: [25, 26] }
 */
export function commonRanges (panier) {
  if (!panier.length)
    return null;
  return Object.fromEntries(PARAMETRES.map(({ key }) => {
    const especes = avec(panier, key);
    if (!especes.length)
      return [key, undefined];
    const min = Math.max(...especes.map((p) => p[`${key}_mini`]));
    const max = Math.min(...especes.map((p) => p[`${key}_maxi`]));
    return [key, min <= max ? [min, max] : null];
  }));
}

const plage = (p, key, unit) => plageFr(p[`${key}_mini`], p[`${key}_maxi`], unit);

/** 1. Les espèces doivent partager une plage commune de pH, de GH et de température */
export function parametres (panier) {
  const ranges = commonRanges(panier);
  if (!ranges || panier.length < 2)
    return [];
  return PARAMETRES.filter(({ key }) => ranges[key] === null).map(({ key, label, unit }) => {
    // Les deux espèces responsables : le minimum le plus haut et le maximum le plus bas
    const haut = avec(panier, key).reduce((a, b) => (b[`${key}_mini`] > a[`${key}_mini`] ? b : a));
    const bas = avec(panier, key).reduce((a, b) => (b[`${key}_maxi`] < a[`${key}_maxi`] ? b : a));
    return issue('parametres', 'error',
      `Pas de ${label} commun : ${haut.nom_commun} (${plage(haut, key, unit)}) et ${bas.nom_commun} `
      + `(${plage(bas, key, unit)}) ne peuvent pas vivre dans la même eau.`,
      [haut.id, bas.id]);
  });
}

/** 0. Espèces qui ne supportent pas l'eau ou le volume indiqués pour le bac */
export function votreEau (panier, { litrage, pH, gH, tempMoyenne } = {}) {
  const eau = { ph: pH, gh: gH, temp: tempMoyenne };
  return panier.flatMap((p) => {
    const hors = PARAMETRES
      .filter(({ key }) => eau[key] != null && p[`${key}_mini`] != null
        && (eau[key] < p[`${key}_mini`] || eau[key] > p[`${key}_maxi`]))
      .map(({ key, label, unit }) => `${label} ${plage(p, key, unit)}`);
    if (litrage && p.litrage_mini > litrage)
      hors.push(`bac d'au moins ${p.litrage_mini} L`);
    return hors.length
      ? [issue('eau', 'error', `${p.nom_commun} ne convient pas à votre bac (${hors.join(', ')}).`, [p.id])]
      : [];
  });
}

/** 5. Deux espèces dont les courants préférés sont écartés d'au moins 2 niveaux */
export function courant (panier) {
  return paires(panier).flatMap(([a, b]) => {
    const pa = plageCourant(a);
    const pb = plageCourant(b);
    if (!pa || !pb || Math.max(pa[0], pb[0]) - Math.min(pa[1], pb[1]) < 2)
      return [];
    const nom = (p) => `${p.nom_commun} (${p.nom_courant})`;
    return [issue('courant', 'warning',
      `Courant incompatible : ${nom(a)} et ${nom(b)} n'ont pas besoin du même brassage.`,
      [a.id, b.id])];
  });
}

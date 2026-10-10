/**
 * Calculs de chimie de l'eau utilisés par les schémas du guide pratique.
 * Chaque formule cite sa source ; les tests la comparent aux tableaux publiés.
 */

const KELVIN = 273.15;

/**
 * Part d'ammoniac libre (NH₃, toxique) dans l'ammoniaque totale, selon le pH et la température.
 * Emerson et al. (1975), « Aqueous ammonia equilibrium calculations », J. Fish. Res. Board Can. 32:2379-2383 :
 * pKa = 0,09018 + 2729,92 / T (T en kelvins), fraction = 1 / (1 + 10^(pKa − pH)).
 * @returns {number} fraction entre 0 et 1
 */
export function fractionAmmoniac (pH: number, temperature: number) {
  const pKa = 0.09018 + 2729.92 / (temperature + KELVIN);
  return 1 / (1 + 10 ** (pKa - pH));
}

/**
 * CO₂ dissous estimé à partir du KH et du pH, en mg/L : CO₂ ≈ 3 × KH × 10^(7 − pH).
 * Approximation classique de l'équilibre des carbonates (pKa₁ ≈ 6,35 à 25 °C) ; elle surestime le CO₂ quand
 * d'autres acides (tourbe, bois, acides humiques) font baisser le pH.
 * @param {number} kh dureté carbonatée en degrés allemands (°dKH)
 */
export function co2DepuisKhPh (kh: number, pH: number) {
  return 3 * kh * 10 ** (7 - pH);
}

/**
 * Oxygène dissous à saturation dans l'eau douce, en mg/L, sous 1 atmosphère.
 * Benson et Krause (1984), équation reprise par l'USGS (tables DOTABLES) et les Standard Methods (APHA).
 */
export function oxygeneSaturation (temperature: number) {
  const T = temperature + KELVIN;
  const ln = -139.34411 + 1.575701e5 / T - 6.642308e7 / T ** 2 + 1.2438e10 / T ** 3 - 8.621949e11 / T ** 4;
  return Math.exp(ln);
}

// Dureté : 1 °dGH = 10 mg/L de CaO = 17,848 mg/L de CaCO₃ ; 1 °f = 10 mg/L de CaCO₃
export const MG_CACO3_PAR_DGH = 17.848;
export const MG_CACO3_PAR_DEGRE_FRANCAIS = 10;

/** Degrés allemands (°dGH ou °dKH) vers degrés français (°f) */
export const dghVersDegreFrancais = (dgh: number) => (dgh * MG_CACO3_PAR_DGH) / MG_CACO3_PAR_DEGRE_FRANCAIS;

/** Degrés français (°f, le TH des analyses d'eau en France) vers degrés allemands */
export const degreFrancaisVersDgh = (f: number) => (f * MG_CACO3_PAR_DEGRE_FRANCAIS) / MG_CACO3_PAR_DGH;

/** Arrondi à n décimales, pour l'affichage */
export const arrondi = (valeur: number, decimales = 1) => {
  const p = 10 ** decimales;
  return Math.round(valeur * p) / p;
};

import { describe, expect, it } from 'vitest';

import {
  co2DepuisKhPh, degreFrancaisVersDgh, dghVersDegreFrancais, fractionAmmoniac, oxygeneSaturation,
} from '@/lib/cours/chimie';

describe('fractionAmmoniac', () => {
  // Tableau 1 de « Ammonia in Aquatic Systems » (UF/IFAS FA16), calculé à partir d'Emerson et al. (1975)
  it.each([
    [7.0, 20, 0.0039],
    [7.6, 24, 0.0206],
    [8.0, 24, 0.0502],
    [7.4, 28, 0.0173],
    [8.0, 30, 0.0743],
    [8.6, 26, 0.1950],
  ])('pH %s à %s °C ≈ %s', (pH, temperature, attendu) => {
    expect(fractionAmmoniac(pH, temperature)).toBeCloseTo(attendu, 3);
  });

  it('augmente avec le pH et la température', () => {
    expect(fractionAmmoniac(8, 25)).toBeGreaterThan(fractionAmmoniac(7, 25));
    expect(fractionAmmoniac(7, 28)).toBeGreaterThan(fractionAmmoniac(7, 22));
  });
});

describe('oxygeneSaturation', () => {
  // USGS, tables de solubilité de l'oxygène dans l'eau douce (Benson et Krause), colonne 760 mm Hg
  it.each([[20, 9.09], [24, 8.42], [25, 8.26], [28, 7.83], [30, 7.56]])('%s °C ≈ %s mg/L', (temperature, attendu) => {
    expect(oxygeneSaturation(temperature)).toBeCloseTo(attendu, 1);
  });
});

describe('co2DepuisKhPh', () => {
  it('suit la règle 3 × KH × 10^(7 − pH)', () => {
    expect(co2DepuisKhPh(4, 7)).toBeCloseTo(12, 6);
    expect(co2DepuisKhPh(4, 6.6)).toBeCloseTo(30.1, 1);
  });
});

describe('conversions de dureté', () => {
  it('1 °dGH vaut 1,78 °f et inversement', () => {
    expect(dghVersDegreFrancais(1)).toBeCloseTo(1.7848, 4);
    expect(degreFrancaisVersDgh(17.848)).toBeCloseTo(10, 6);
  });
});

describe('chauffagePourVolume', () => {
  it('suit le tableau EHEIM', async () => {
    const { chauffagePourVolume } = await import('@/lib/cours/equipement');
    expect(chauffagePourVolume(54)).toBe(50);
    expect(chauffagePourVolume(100)).toBe(75);
    expect(chauffagePourVolume(240)).toBe(150);
    expect(chauffagePourVolume(2000)).toBeNull();
  });
});

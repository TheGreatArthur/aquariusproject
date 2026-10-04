/**
 * Repères d'équipement selon le volume du bac, utilisés par le calculateur du guide pratique.
 */

// Puissances des chauffages EHEIM thermocontrol selon le volume maximal conseillé (fiche fabricant)
export const CHAUFFAGES = [
  { litresMax: 25, watts: 25 },
  { litresMax: 60, watts: 50 },
  { litresMax: 100, watts: 75 },
  { litresMax: 150, watts: 100 },
  { litresMax: 200, watts: 125 },
  { litresMax: 300, watts: 150 },
  { litresMax: 400, watts: 200 },
  { litresMax: 600, watts: 250 },
  { litresMax: 1000, watts: 300 },
  { litresMax: 1200, watts: 400 },
];

/** Puissance de chauffage indicative pour un volume en litres, ou null au-delà du tableau */
export function chauffagePourVolume (litres) {
  return CHAUFFAGES.find(({ litresMax }) => litres <= litresMax)?.watts ?? null;
}

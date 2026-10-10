/**
 * Règles propres aux plantes : éclairage commun, CO2, animaux qui mangent les plantes
 */

import { estAnimal, estPoisson } from '../especes';
import { issue, liste } from '../utils';
import { TAILLE_GRANDE_ECREVISSE } from './invertebres';

export const LUMIERES = ['très faible', 'faible', 'moyenne', 'forte', 'très forte'];

// Poissons herbivores qui mangent les plantes, et pas seulement les algues (les loricariidés broutent les algues)
export const FAMILLES_MANGEUSES = ['Serrasalmidae', 'Cichlidae africain', 'Cichlidae américain'];

const plantes = (panier) => panier.filter((p) => p.kind === 'plante');
const niveau = (lumiere) => LUMIERES.indexOf(lumiere);

/** 20. Les plantes doivent partager un niveau d'éclairage */
export function lumiere (panier) {
  const especes = plantes(panier);
  if (especes.length < 2)
    return [];
  const forte = especes.reduce((a, b) => (niveau(b.lumiere_mini) > niveau(a.lumiere_mini) ? b : a));
  const faible = especes.reduce((a, b) => (niveau(b.lumiere_maxi) < niveau(a.lumiere_maxi) ? b : a));
  return niveau(forte.lumiere_mini) > niveau(faible.lumiere_maxi)
    ? [issue('lumiere', 'warning', `Éclairage incompatible : ${forte.nom_commun} demande une lumière au moins `
      + `${forte.lumiere_mini}, ${faible.nom_commun} au plus ${faible.lumiere_maxi}.`, [forte.id, faible.id])]
    : [];
}

/** 21. Plantes exigeantes en CO2 : un diffuseur est nécessaire */
export function co2 (panier) {
  const exigeantes = plantes(panier).filter((p) => p.co2 === 'élevé');
  return exigeantes.length
    ? [issue('co2', 'info', `${liste(exigeantes.map((p) => p.nom_commun))} : prévoyez un apport de CO₂.`, [])]
    : [];
}

/** 22. Animaux qui mangent les plantes tendres (celles qui résistent aux cichlidés sont épargnées) */
export function herbivores (panier) {
  const tendres = plantes(panier).filter((p) => !(p.usages ?? []).includes('résiste aux cichlidés'));
  const mangeurs = panier.filter((p) => estAnimal(p) && (
    (estPoisson(p) && /herbivore/.test(p.regime ?? '') && FAMILLES_MANGEUSES.includes(p.nom_famille))
    || (p.groupe === 'écrevisse' && p.taille >= TAILLE_GRANDE_ECREVISSE)
    || (p.groupe === 'escargot' && p.regime === 'omnivore')));
  return tendres.length && mangeurs.length
    ? [issue('herbivores', 'warning', `${liste(mangeurs.map((p) => p.nom_commun))} `
      + `${mangeurs.length > 1 ? 'mangent' : 'mange'} les plantes tendres : `
      + `${liste(tendres.map((p) => p.nom_commun))}. Préférez des plantes coriaces (Anubias, fougère de Java).`,
      [...mangeurs, ...tendres].map((p) => p.id))]
    : [];
}

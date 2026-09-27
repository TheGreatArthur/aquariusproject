/**
 * Validation d'une liste de poissons
 */

import souspopulation from './validations/souspopulation';
import surpopulation from './validations/surpopulation';
import cohabitation from './validations/cohabitation';
import cohabitation1 from './validations/cohabitation1';
import predationcm from './validations/predationcm';

// Liste des tests de validation individuels
export const VALIDATIONS = [
  surpopulation,  // Risque de surpopulation ?
  souspopulation, // Sous-population d'une ou plusieurs espèces ?
  cohabitation,   // Cohabitation agressifs/non-agressifs ?
  cohabitation1,  // Cohabitation entre Poecillidae et Osphronemidae
  predationcm,    // Cohabitation entre des poissons de différentes tailles...
];

/**
 * Fonction de validation de l'ajout d'un poisson à une liste.
 *
 * @param {*} panier Liste de poissons
 * @param {*} environnement Environnement (litrage, pH, etc.)
 * @returns {{ok: boolean}|{ok: boolean, messages: string[], ids: number[]}}
 */
export function validation(panier, environnement) {

  let ok = true;      // Succès ou non de la vaidation globale
  let messages = [];  // Messages d'erreur
  let ids = [];       // Ids des poissons concernés
  let out;

  // Exécution des tests de validation
  for (let v of VALIDATIONS) {
    out = v(panier, environnement);
    ok &&= out.ok;
    if (out.messages)
      messages = [...messages, ...out.messages];
    if (out.ids)
      ids = [...ids, ...out.ids];
  }

  return { ok, messages, ids };
}

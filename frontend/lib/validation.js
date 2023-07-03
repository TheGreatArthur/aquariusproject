/**
 * Validation d'une liste de poissons
 */

import souspopulation from './validations/souspopulation';
import surpopulation from './validations/surpopulation';
import cohabitation from './validations/cohabitation';

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

  // Liste des tests de validation individuels
  const validations = [
    surpopulation,  // Risque de surpopulation ?
    souspopulation, // Sous-population d'une ou plusieurs espèces ?
    cohabitation,   // Cohabitation agressifs/non-agressifs ?
  ];

  // Exécution des tests de validation
  for (let v of validations) {
    out = v(panier, environnement);
    ok &&= out.ok;
    if (out.messages)
      messages = [...messages, ...out.messages];
    if (out.ids)
      ids = [...ids, ...out.ids];
  }

  return { ok, messages, ids };
}

export function validationOld(p, listePoissons) {

  console.log(listePoissons);

  const isAgressiveFish = p.nom_comportement === 'agressif';
  const hasOtherSpecies = listePoissons.some((poisson) => poisson.id !== p.id);
  const hasMultipleAgressiveFish =
    isAgressiveFish && listePoissons.filter((poisson) => poisson.id === p.id).length > 1;

  const espece = p.nom_commun;
  const nombreExemplaires = listePoissons.reduce((total, poisson) => {
    if (poisson.nom_commun === espece) {
      return total + poisson.quantite;
    }
    return total;
  }, 0);

  const pointsEspece = p.points * nombreExemplaires;

  const hasIncompatibleFamilies =
    listePoissons.some((poisson) => poisson.nom_famille === 'Osphronemidae') &&
    listePoissons.some((poisson) => poisson.nom_famille === 'Poeciliidae');

  return (isAgressiveFish && hasOtherSpecies) || hasMultipleAgressiveFish || hasIncompatibleFamilies;
}

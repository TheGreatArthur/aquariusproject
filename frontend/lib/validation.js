import surpopulation from './validation/surpopulation';

/**
 * Fonction de validation de l'ajout d'un poisson à une liste.
 * Note : c'est une fonction JS pure, pas un composant React.
 *
 * @param {*} panier Liste de poissons
 * @param {*} environnement Environnement (litrage, pH, etc.)
 * @returns {boolean}
 */
export function validation (panier, environnement) {

  let ok = true,
    messages = [];

  // Risque de surpopulation ?
  const out = surpopulation(panier, environnement);
  ok &&= out.ok;
  if (out.msg)
    messages.push(out.msg);

  //

  return { ok, messages };
}

export function validationOld (p, listePoissons) {

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

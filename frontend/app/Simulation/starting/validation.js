/**
 * Fonction de validation de l'ajout d'un poisson.
 * Note : c'est une fonction JS pure, pas un composant React.
 * 
 * @param {*} p Poisson qu'on souhaite ajouter à la liste
 * @param {*} listePoissons Liste de poissons
 * @returns {boolean}
 */

export function validation(p, listePoissons) {
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
    listePoissons.some((poisson) => poisson.id_famille === 6) &&
    listePoissons.some((poisson) => poisson.id_famille === 11);

  const ajoutOk = (isAgressiveFish && hasOtherSpecies) || hasMultipleAgressiveFish || hasIncompatibleFamilies;

  return ajoutOk;
}

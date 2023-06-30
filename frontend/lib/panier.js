/**
 * Calcul du total des points d'un panier
 * @param panier
 * @returns {number}
 */
export function totalPoints (panier) {
  return panier.reduce((total, p) => total + p.points * p.quantite, 0);
}

import { totalPoints } from '@/lib/panier';

/**
 * Validation : cohabitation avec des poissons poecillidae et osphrnonemidae ?
 * @param panier
 * @param environnement
 * @returns {{ok: boolean}|{ok: boolean, messages: string[]}}
 */
export default function surpopulation(panier, environnement) {
  const osphronemidae = panier.filter((poisson) => poisson.nom_famille === 'Osphronemidae');
  const poeciliidae = panier.filter((poisson) => poisson.nom_famille === 'Poeciliidae');

  if (osphronemidae.length && poeciliidae.length) {
    const errorMessage = `Problème de cohabitation entre ${osphronemidae[0].nom_commun} et ${poeciliidae[0].nom_commun}`;
    return {
      ok: false,
      messages: [errorMessage],
      ids: [...osphronemidae.map(poisson => poisson.id), ...poeciliidae.map(poisson => poisson.id)]
    };
  }

  return { ok: true };
}

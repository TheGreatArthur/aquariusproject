import { totalPoints } from '@/lib/panier';

/**
 * Validation : différence de taille entre les poissons
 * @param panier
 * @param environnement
 * @returns {{ok: boolean}|{ok: boolean, messages: string[]}}
 */
export default function predationcm(panier, environnement) {
  const loricariidae = panier.filter((poisson) => poisson.nom_famille === 'Loricariidae');
  const balitoridae = panier.filter((poisson) => poisson.nom_famille === 'Balitoridae');
  const cobitidae = panier.filter((poisson) => poisson.nom_famille === 'Cobitidae');

  const otherPoissons = panier.filter((poisson) =>
    ![...loricariidae, ...balitoridae, ...cobitidae].includes(poisson)
  );

  for (let i = 0; i < otherPoissons.length; i++) {
    for (let j = i + 1; j < otherPoissons.length; j++) {
      const poisson1 = otherPoissons[i];
      const poisson2 = otherPoissons[j];

      const differenceTaille = Math.abs(poisson1.taille - poisson2.taille);
      if (differenceTaille >= 7) {
        const errorMessage = `Risque de prédation entre ${poisson1.nom_commun} et ${poisson2.nom_commun}`;
        return {
          ok: false,
          messages: [errorMessage],
          ids: [poisson1.id, poisson2.id]
        };
      }
    }
  }

  return { ok: true };
}

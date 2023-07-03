import { totalPoints } from '@/lib/panier';

/**
 * Validation : cohabitation avec des poissons agressifs ?
 * @param panier
 * @param environnement
 * @returns {{ok: boolean}|{ok: boolean, messages: string[]}}
 */
export default function surpopulation(panier, environnement) {

  const agressifs = panier.filter((p) => p.nom_comportement === 'agressif');
  const nonAgressifs = panier.filter((p) => p.nom_comportement !== 'agressif');
  console.log('A=', agressifs);
  console.log('NA=', nonAgressifs)

  return agressifs.length && nonAgressifs.length
    ? {
      ok: false,
      messages: [`Attention, poisson(s) agressif(s): ${agressifs.map(p => p.nom_commun).join(', ')}`],
      ids: [...agressifs.map(p => p.id), ...nonAgressifs.map(p => p.id)]
    }
    : { ok: true };
}

import { totalPoints } from '@/lib/panier';

/**
 * Validation : risque de surpopulation ?
 * @param panier
 * @param environnement
 * @returns {{ok: boolean}|{ok: boolean, messages: string[]}}
 */
export default function surpopulation (panier, environnement) {

  return totalPoints(panier) <= environnement.litrage
    ? { ok: true }
    : { ok: false, messages: ['Risque de surpopulation'] };
}

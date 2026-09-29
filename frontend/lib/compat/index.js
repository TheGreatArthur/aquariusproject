/**
 * Moteur de compatibilité du simulateur
 *
 * Chaque règle reçoit le bac (liste de poissons avec leur quantité) et l'environnement (litrage…),
 * et renvoie la liste des problèmes détectés : { rule, severity, message, ids }.
 */

import { agressivite, biotope, bouche, familles, predateur } from './rules/cohabitation';
import { commonRanges, courant, parametres } from './rules/eau';
import { agressifs, couple, delicate, harem, solitaire, souspopulation, surpopulation } from './rules/population';

export { commonRanges } from './rules/eau';
export { totalPoints } from './rules/population';

export const RULES = [
  parametres,     // 1. Plages de pH, GH et température communes
  predateur,      // 2. Prédateur déclaré avec des poissons deux fois plus petits
  bouche,         // 3. Carnivore trois fois plus grand qu'un autre poisson
  agressivite,    // 4. Tempéraments écartés d'au moins deux niveaux
  courant,        // 5. Courants préférés incompatibles
  biotope,        // 6. Toutes les espèces d'une même région (information)
  solitaire,      // 7. Espèce solitaire gardée à plusieurs
  agressifs,      // 8. Plusieurs individus d'une espèce agressive
  couple,         // 9. Espèce en couple : nombre pair
  harem,          // 10. Espèce en harem : groupes de 4
  delicate,       // 11. Espèce délicate dans un bac trop petit
  surpopulation,  // 12. Capacité du bac
  souspopulation, // 13. Groupe minimum
  familles,       // 14. Familles incompatibles
];

const GRAVITE = { error: 2, warning: 1, info: 0 };

/**
 * Évalue un bac
 * @returns {{ok: boolean, verdict: 'ok'|'warning'|'error', issues: object[], ids: number[], ranges: object|null}}
 */
export function evaluate (panier, environnement = {}) {
  const issues = RULES.flatMap((rule) => rule(panier, environnement))
    .sort((a, b) => GRAVITE[b.severity] - GRAVITE[a.severity]);
  const verdict = issues.some((i) => i.severity === 'error') ? 'error'
    : issues.some((i) => i.severity === 'warning') ? 'warning' : 'ok';
  const ids = [...new Set(issues.filter((i) => i.severity !== 'info').flatMap((i) => i.ids))];
  return { ok: verdict !== 'error', verdict, issues, ids, ranges: commonRanges(panier) };
}

/**
 * Nouveaux problèmes qu'entraînerait l'ajout d'une espèce (avec son groupe minimum), avant de l'ajouter
 * @returns {{severity: 'error'|'warning'|null, messages: string[]}}
 */
export function issuesIfAdded (panier, poisson, environnement = {}) {
  const present = panier.find((p) => p.id === poisson.id);
  const apres = present
    ? panier.map((p) => (p.id === poisson.id ? { ...p, quantite: p.quantite + 1 } : p))
    : [...panier, { ...poisson, quantite: Math.max(1, poisson.nb_individus) }];

  const avant = new Set(evaluate(panier, environnement).issues.map((i) => i.message));
  const nouveaux = evaluate(apres, environnement).issues
    .filter((i) => i.severity !== 'info' && i.rule !== 'souspopulation' && !avant.has(i.message));

  const severity = nouveaux.some((i) => i.severity === 'error') ? 'error' : nouveaux.length ? 'warning' : null;
  return { severity, messages: nouveaux.map((i) => i.message) };
}

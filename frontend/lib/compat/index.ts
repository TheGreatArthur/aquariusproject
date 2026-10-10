/**
 * Moteur de compatibilité du simulateur
 *
 * Chaque règle reçoit le bac (poissons, invertébrés et plantes avec leur quantité, voir especes.js) et
 * l'environnement (volume et eau saisis), et renvoie la liste des problèmes détectés : { rule, severity, message, ids }.
 */

import { agressivite, biotope, bouche, familles, predateur } from './rules/cohabitation';
import { commonRanges, courant, parametres, votreEau } from './rules/eau';
import { aquaterrarium, chasseurs, crevettes, escargots, larves } from './rules/invertebres';
import { co2, herbivores, lumiere } from './rules/plantes';
import { agressifs, couple, delicate, harem, solitaire, souspopulation, surpopulation } from './rules/population';
import type { CatalogueSpecies, Environment, Issue, Ranges, Rule, Severity, Species } from '@/lib/types';

export { commonRanges } from './rules/eau';
export { espece, estAnimal, TYPES } from './especes';
export { totalPoints } from './rules/population';

export const RULES: Rule[] = [
  votreEau,       // 0. Eau et volume saisis pour le bac
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
  crevettes,      // 15. Crevettes mangées par les poissons trois fois plus grands
  chasseurs,      // 16. Écrevisses et crevettes carnivores
  escargots,      // 17. Escargot assassin avec d'autres escargots
  aquaterrarium,  // 18. Partie terrestre nécessaire
  larves,         // 19. Larves en eau saumâtre ou en mer (information)
  lumiere,        // 20. Éclairage commun aux plantes
  co2,            // 21. Plantes exigeantes en CO2 (information)
  herbivores,     // 22. Animaux qui mangent les plantes tendres
];

const GRAVITE: Record<Severity, number> = { error: 2, warning: 1, info: 0 };

export interface Evaluation {
  ok: boolean;
  verdict: 'ok' | 'warning' | 'error';
  issues: Issue[];
  ids: Issue['ids'];
  ranges: Ranges | null;
}

/** Évalue un bac */
export function evaluate (panier: Species[], environnement: Environment = {}): Evaluation {
  const issues = RULES.flatMap((rule) => rule(panier, environnement))
    .sort((a, b) => GRAVITE[b.severity] - GRAVITE[a.severity]);
  const verdict = issues.some((i) => i.severity === 'error') ? 'error'
    : issues.some((i) => i.severity === 'warning') ? 'warning' : 'ok';
  const ids = [...new Set(issues.filter((i) => i.severity !== 'info').flatMap((i) => i.ids))];
  return { ok: verdict !== 'error', verdict, issues, ids, ranges: commonRanges(panier) };
}

/** Nouveaux problèmes qu'entraînerait l'ajout d'une espèce (avec son groupe minimum), avant de l'ajouter */
export function issuesIfAdded (panier: Species[], poisson: CatalogueSpecies, environnement: Environment = {})
  : { severity: 'error' | 'warning' | null, messages: string[] } {
  // L'eau du bac (règle 0) est affichée à part dans la liste : seuls comptent les conflits avec les autres espèces
  const present = panier.find((p) => p.id === poisson.id);
  const apres: Species[] = present
    ? panier.map((p) => (p.id === poisson.id ? { ...p, quantite: p.quantite + 1 } : p))
    : [...panier, { ...poisson, quantite: Math.max(1, poisson.nb_individus ?? 1) }];

  const avant = new Set(evaluate(panier, environnement).issues.map((i) => i.message));
  const nouveaux = evaluate(apres, environnement).issues
    .filter((i) => i.severity !== 'info' && !['souspopulation', 'eau'].includes(i.rule) && !avant.has(i.message));

  const severity = nouveaux.some((i) => i.severity === 'error') ? 'error' : nouveaux.length ? 'warning' : null;
  return { severity, messages: nouveaux.map((i) => i.message) };
}

/**
 * Utilitaires communs aux règles
 */

/**
 * Problème détecté par une règle
 * @param {string} rule Identifiant de la règle
 * @param {'error'|'warning'|'info'} severity Gravité
 * @param {string} message Message affiché
 * @param {number[]} ids Poissons concernés
 */
export const issue = (rule, severity, message, ids) => ({ rule, severity, message, ids });

/** Toutes les paires distinctes d'une liste */
export const paires = (items) => items.flatMap((a, i) => items.slice(i + 1).map((b) => [a, b]));

/** 'a', 'a et b', 'a, b et c' */
export function liste (noms) {
  return noms.length < 2 ? noms.join('') : `${noms.slice(0, -1).join(', ')} et ${noms.at(-1)}`;
}

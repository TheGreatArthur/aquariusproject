/**
 * Enregistrement / lecture dans le stockage local
 */

/**
 * Lecture depuis le stockage local
 * @param {string} key
 * @returns {any|null}
 */
export function lsGet (key) {
  if (typeof window == 'undefined')
    return null;
  const obj = localStorage.getItem(key);
  return obj ? JSON.parse(obj) : null;
}

/**
 * Enregistrement dans le stockage local
 * @param {string} key
 * @param {any} obj
 */
export function lsSet (key, obj) {
  if (typeof window == 'undefined')
    return;
  localStorage.setItem(key, JSON.stringify(obj));
}

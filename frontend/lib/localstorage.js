/**
 * Enregistrement / lecture dans le stickage locakl
 */

/**
 * Lecture depuis le stockage local
 * @param {string} key
 * @returns {any|null}
 */
export function lsGet (key) {
  const obj = localStorage.getItem(key);
  return obj ? JSON.parse(obj) : null;
}

/**
 * Enregistrement dans le stockaae local
 * @param {string} key
 * @param {any} obj
 */
export function lsSet (key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

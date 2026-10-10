/**
 * Enregistrement / lecture dans le stockage local
 *
 * Le stockage peut être indisponible (navigation privée, cookies bloqués) ou contenir une valeur illisible :
 * dans ces cas la lecture renvoie null et l'enregistrement est ignoré, sans casser la page.
 */

/** Lecture depuis le stockage local */
export function lsGet (key: string): any {
  if (typeof window == 'undefined')
    return null;
  try {
    const obj = localStorage.getItem(key);
    return obj ? JSON.parse(obj) : null;
  } catch {
    return null;
  }
}

/** Enregistrement dans le stockage local */
export function lsSet (key: string, obj: unknown) {
  if (typeof window == 'undefined')
    return;
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch {
    // Stockage plein ou refusé : l'état reste en mémoire pour la session
  }
}

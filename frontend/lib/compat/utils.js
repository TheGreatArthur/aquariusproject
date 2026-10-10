/**
 * Utilitaires communs aux règles
 */

import { translator } from '@/lib/i18n';

/**
 * Problème détecté par une règle
 * @param {string} rule Identifiant de la règle
 * @param {'error'|'warning'|'info'} severity Gravité
 * @param {string} message Message affiché
 * @param {(number|string)[]} ids Espèces concernées
 */
export const issue = (rule, severity, message, ids) => ({ rule, severity, message, ids });

/** Toutes les paires distinctes d'une liste */
export const paires = (items) => items.flatMap((a, i) => items.slice(i + 1).map((b) => [a, b]));

/** 'a', 'a et b', 'a, b et c' ('a, b and c' in English) */
export function liste (noms, locale) {
  return noms.length < 2 ? noms.join('')
    : `${noms.slice(0, -1).join(', ')} ${translator(locale).t('et', 'and')} ${noms.at(-1)}`;
}

const formats = {};

/** Plage de valeurs dans la langue de la page : '4–6,5' ou '4–6.5' (sans valeur : '–') */
export function formatRange (min, max, unit = '', locale) {
  if (min == null)
    return '–';
  const intl = translator(locale).intl;
  formats[intl] ??= new Intl.NumberFormat(intl, { maximumFractionDigits: 1 });
  return `${formats[intl].format(min)}–${formats[intl].format(max)}${unit}`;
}

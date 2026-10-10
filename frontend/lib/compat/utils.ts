/**
 * Utilitaires communs aux règles
 */

import { translator } from '@/lib/i18n';
import type { Issue, Locale, Severity } from '@/lib/types';

/** Problème détecté par une règle : identifiant de la règle, gravité, message affiché, espèces concernées */
export const issue = (rule: string, severity: Severity, message: string, ids: Issue['ids']): Issue =>
  ({ rule, severity, message, ids });

/** Toutes les paires distinctes d'une liste */
export const paires = <T>(items: T[]): [T, T][] => items.flatMap((a, i) => items.slice(i + 1).map((b): [T, T] => [a, b]));

/** 'a', 'a et b', 'a, b et c' ('a, b and c' in English, 'a、bとc' in Japanese) */
export function liste (noms: string[], locale?: Locale) {
  if (noms.length < 2)
    return noms.join('');
  const debut = noms.slice(0, -1);
  return translator(locale).t(`${debut.join(', ')} et `, `${debut.join(', ')} and `, `${debut.join('、')}と`) + noms.at(-1);
}

const formats: Record<string, Intl.NumberFormat> = {};

/** Plage de valeurs dans la langue de la page : '4–6,5' ou '4–6.5' (sans valeur : '–') */
export function formatRange (min: number | null | undefined, max: number | null | undefined, unit = '',
  locale?: Locale) {
  if (min == null)
    return '–';
  const intl = translator(locale).intl;
  formats[intl] ??= new Intl.NumberFormat(intl, { maximumFractionDigits: 1 });
  return `${formats[intl].format(min)}–${formats[intl].format(max ?? min)}${unit}`;
}

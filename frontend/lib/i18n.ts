/**
 * Site languages: French at the root (default), English under /en, Japanese under /ja.
 * Strings are written inline as t('français', 'English', '日本語') next to the markup that shows them.
 */

import { term } from '@/lib/glossary';
import type { Locale } from '@/lib/types';

export const LOCALES: Locale[] = ['fr', 'en', 'ja'];
export const DEFAULT_LOCALE: Locale = 'fr';

/** Name of each language in itself, for the language menu */
export const LANGUAGE_NAMES: Record<Locale, string> = { fr: 'Français', en: 'English', ja: '日本語' };

// Request headers set by proxy.js for server components
export const LOCALE_HEADER = 'x-aquarius-locale';
export const PATH_HEADER = 'x-aquarius-path';

// Languages served under a prefix (/en, /ja)
const PREFIXED = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

const prefixOf = (pathname: string) =>
  PREFIXED.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

/** '/en/poissons' -> { locale: 'en', path: '/poissons' } ; '/poissons' -> { locale: 'fr', path: '/poissons' } */
export function splitLocale (pathname = '/'): { locale: Locale, path: string } {
  const locale = prefixOf(pathname);
  return locale
    ? { locale, path: pathname.slice(locale.length + 1) || '/' }
    : { locale: DEFAULT_LOCALE, path: pathname };
}

/** Internal link in the given language: localize('/poissons?famille=x', 'ja') -> '/ja/poissons?famille=x' */
export function localize (href: string, locale: Locale | undefined) {
  if (!locale || locale === DEFAULT_LOCALE || !href.startsWith('/') || href.startsWith('/api/') || prefixOf(href))
    return href;
  return href === '/' ? `/${locale}` : `/${locale}${href.startsWith('/?') || href.startsWith('/#') ? href.slice(1) : href}`;
}

const INTL: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB', ja: 'ja-JP' };

/** Translation helpers for one language, shared by server (getI18n) and client (useI18n) components */
export function translator (locale: Locale = DEFAULT_LOCALE) {
  return {
    locale,
    // Number and date formats
    intl: INTL[locale],
    t: <T>(fr: T, en: T, ja: T) => (locale === 'ja' ? ja : locale === 'en' ? en : fr),
    href: (path: string) => localize(path, locale),
    // Category value from the API (see lib/glossary.ts)
    term: ((value: string | null | undefined) => term(value, locale)) as typeof term,
    // Data from the API in this language (see backend/translations.py)
    api: (path: string) => (locale === DEFAULT_LOCALE ? path : `${path}${path.includes('?') ? '&' : '?'}lang=${locale}`),
  };
}

/** Value of a locale header or cookie, or the default language */
export const asLocale = (value: string | null | undefined): Locale =>
  LOCALES.includes(value as Locale) ? value as Locale : DEFAULT_LOCALE;

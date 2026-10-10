/**
 * Site languages: French at the root (default), English under /en.
 * Strings are written inline as t('français', 'English') next to the markup that shows them.
 */

import { term } from '@/lib/glossary';

export const LOCALES = ['fr', 'en'];
export const DEFAULT_LOCALE = 'fr';

// Request headers set by proxy.js for server components
export const LOCALE_HEADER = 'x-aquarius-locale';
export const PATH_HEADER = 'x-aquarius-path';

const isEnglish = (pathname) => pathname === '/en' || pathname.startsWith('/en/');

/** '/en/poissons' -> { locale: 'en', path: '/poissons' } ; '/poissons' -> { locale: 'fr', path: '/poissons' } */
export function splitLocale (pathname = '/') {
  return isEnglish(pathname)
    ? { locale: 'en', path: pathname.slice(3) || '/' }
    : { locale: DEFAULT_LOCALE, path: pathname };
}

/** Internal link in the given language: localize('/poissons?famille=x', 'en') -> '/en/poissons?famille=x' */
export function localize (href, locale) {
  if (locale === DEFAULT_LOCALE || !href.startsWith('/') || href.startsWith('/api/') || isEnglish(href))
    return href;
  return href === '/' ? '/en' : `/en${href.startsWith('/?') || href.startsWith('/#') ? href.slice(1) : href}`;
}

/** Translation helpers for one language, shared by server (getI18n) and client (useI18n) components */
export function translator (locale = DEFAULT_LOCALE) {
  const en = locale === 'en';
  return {
    locale,
    // Number and date formats
    intl: en ? 'en-GB' : 'fr-FR',
    t: (fr, english) => (en ? english : fr),
    href: (path) => localize(path, locale),
    // Category value from the API (see lib/glossary.js)
    term: (value) => term(value, locale),
  };
}

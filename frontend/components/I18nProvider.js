'use client';

import { createContext, useContext, useMemo } from 'react';

import { DEFAULT_LOCALE, translator } from '@/lib/i18n';

const LocaleContext = createContext(DEFAULT_LOCALE);

export function I18nProvider ({ locale, children }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** { locale, intl, t(fr, en), href(path) } for client components */
export function useI18n () {
  const locale = useContext(LocaleContext);
  return useMemo(() => translator(locale), [locale]);
}

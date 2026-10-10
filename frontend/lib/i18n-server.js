import { headers } from 'next/headers';

import { DEFAULT_LOCALE, LOCALE_HEADER, PATH_HEADER, translator } from '@/lib/i18n';

/** Language of the current request (set by proxy.js), for server components and generateMetadata */
export async function getI18n () {
  const h = await headers();
  const i18n = translator(h.get(LOCALE_HEADER) === 'en' ? 'en' : DEFAULT_LOCALE);
  return { ...i18n, path: h.get(PATH_HEADER) ?? '/' };
}

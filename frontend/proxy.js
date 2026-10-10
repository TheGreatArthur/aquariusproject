import { NextResponse } from 'next/server';

import { DEFAULT_LOCALE, LOCALE_HEADER, PATH_HEADER, splitLocale } from '@/lib/i18n';

/**
 * /en/... serves the same pages as the French site (rewrite), with the language passed to server components in a
 * request header. The header is always overwritten, so a client cannot pick the language of a French URL.
 */
export function proxy (request) {
  const { locale, path } = splitLocale(request.nextUrl.pathname);
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  headers.set(PATH_HEADER, path);

  if (locale === DEFAULT_LOCALE)
    return NextResponse.next({ request: { headers } });
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Pages only: not the API, Next.js assets or public files
  matcher: ['/((?!api/|_next/|.*\\.[a-z0-9]+$).*)'],
};

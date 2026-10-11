import { notFound } from 'next/navigation';

import { getI18n } from '@/lib/i18n-server';
import { BACKEND_URL } from '@/lib/site';
import type { ApiItem } from '@/lib/types';

/**
 * One species read from the API on the server, in the page's language. The page and its metadata make the same
 * request, which Next.js sends once. Unknown species: 404 page; API unreachable: null.
 */
export async function getSpecies (catalogue: 'poissons' | 'invertebres' | 'plantes', id: string): Promise<ApiItem | null> {
  const { api } = await getI18n();
  const res = await fetch(api(`${BACKEND_URL}/${catalogue}/${encodeURIComponent(id)}`), { next: { revalidate: 3600 } })
    .catch(() => null);
  if (res?.status === 404)
    notFound();
  return res?.ok ? res.json() : null;
}

/** A whole catalogue list read on the server, in the page's language; empty if the API cannot be reached */
export async function getCatalogue (catalogue: 'poissons' | 'invertebres' | 'plantes'): Promise<ApiItem[]> {
  const { api } = await getI18n();
  const res = await fetch(api(`${BACKEND_URL}/${catalogue}`), { next: { revalidate: 3600 } }).catch(() => null);
  return res?.ok ? (await res.json())[catalogue] : [];
}

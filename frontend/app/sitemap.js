import { COURS } from '@/content/cours';
import { BACKEND_URL, SITE_URL } from '@/lib/site';

const PAGES = ['', '/poissons', '/invertebres', '/plantes', '/simulation', '/cours', '/contact'];
const CATALOGUES = [['poissons', 'poissons'], ['invertebres', 'invertebres'], ['plantes', 'plantes']];

/** Identifiants des fiches d'un catalogue ; sans API (build hors ligne), le sitemap garde les pages fixes */
async function fiches (route, liste) {
  try {
    const res = await fetch(`${BACKEND_URL}/${route}`, { next: { revalidate: 3600 } });
    return res.ok ? (await res.json())[liste].map((p) => `/${route}/${p.id}`) : [];
  } catch {
    return [];
  }
}

export default async function sitemap () {
  const especes = (await Promise.all(CATALOGUES.map(([route, liste]) => fiches(route, liste)))).flat();
  return [...PAGES, ...COURS.map(({ slug }) => `/cours/${slug}`), ...especes].map((path) => ({ url: `${SITE_URL}${path}` }));
}

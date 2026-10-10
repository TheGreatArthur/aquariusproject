/**
 * Titre et description de chaque fiche, calculés côté serveur (la page elle-même est rendue dans le navigateur)
 */

import { BACKEND_URL } from '@/lib/site';

export async function generateMetadata ({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/invertebres/${encodeURIComponent(id)}`, { next: { revalidate: 3600 } });
    if (!res.ok)
      return { title: 'Invertébré introuvable' };
    const p = await res.json();
    const image = p.images?.[0] && `/invertebrates/${p.images[0]}`;
    const title = p.nom_commun;
    const description = `${p.nom_commun} (${p.nom_scientifique}, ${p.famille}) : taille, volume minimum, `
      + 'paramètres d\'eau, comportement, habitat naturel et maintenance en aquarium.';
    // L'objet openGraph d'une fiche remplace celui du site : il reprend le titre et la description
    return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
  } catch {
    return { title: 'Fiche invertébré' }; // API indisponible : la page affichera son propre message
  }
}

export default function InvertebreLayout ({ children }) {
  return children;
}

/**
 * Titre et description de chaque fiche, calculés côté serveur (la page elle-même est rendue dans le navigateur)
 */

import { BACKEND_URL } from '@/lib/site';

export async function generateMetadata ({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/plantes/${encodeURIComponent(id)}`, { next: { revalidate: 3600 } });
    if (!res.ok)
      return { title: 'Plante introuvable' };
    const p = await res.json();
    const image = p.images?.[0] && `/plants/${p.images[0].fichier}`;
    const title = p.nom_commun;
    const description = `${p.nom_commun} (${p.nom_scientifique}, ${p.famille}) : pH, KH, température, lumière, `
      + 'hauteur, emplacement et entretien en aquarium.';
    // L'objet openGraph d'une fiche remplace celui du site : il reprend le titre et la description
    return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
  } catch {
    return { title: 'Fiche plante' }; // API indisponible : la page affichera son propre message
  }
}

export default function PlanteLayout ({ children }) {
  return children;
}

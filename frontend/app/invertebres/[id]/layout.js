/**
 * Titre et description de chaque fiche, calculés côté serveur (la page elle-même est rendue dans le navigateur)
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function generateMetadata ({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/invertebres/${encodeURIComponent(id)}`, { next: { revalidate: 3600 } });
    if (!res.ok)
      return { title: 'Invertébré introuvable' };
    const p = await res.json();
    return {
      title: p.nom_commun,
      description: `${p.nom_commun} (${p.nom_scientifique}, ${p.famille}) : taille, volume minimum, `
        + 'paramètres d\'eau, comportement, habitat naturel et maintenance en aquarium.',
    };
  } catch {
    return { title: 'Fiche invertébré' }; // API indisponible : la page affichera son propre message
  }
}

export default function InvertebreLayout ({ children }) {
  return children;
}

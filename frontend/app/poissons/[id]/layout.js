/**
 * Titre et description de chaque fiche, calculés côté serveur (la page elle-même est rendue dans le navigateur)
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function generateMetadata ({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/poissons/${encodeURIComponent(id)}`, { next: { revalidate: 3600 } });
    if (!res.ok)
      return { title: 'Poisson introuvable' };
    const p = await res.json();
    return {
      title: p.nom_commun,
      description: `${p.nom_commun} (${p.nom_scientifique}, ${p.nom_famille}) : taille, volume minimum, `
        + 'paramètres d\'eau, comportement et habitat naturel.',
    };
  } catch {
    return { title: 'Fiche poisson' }; // API indisponible : la page affichera son propre message
  }
}

export default function PoissonLayout ({ children }) {
  return children;
}

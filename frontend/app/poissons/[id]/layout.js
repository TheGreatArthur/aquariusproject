/**
 * Titre et description de chaque fiche, calculés côté serveur (la page elle-même est rendue dans le navigateur)
 */

import { getI18n } from '@/lib/i18n-server';
import { BACKEND_URL } from '@/lib/site';

export async function generateMetadata ({ params }) {
  const { id } = await params;
  const { t } = await getI18n();
  try {
    const res = await fetch(`${BACKEND_URL}/poissons/${encodeURIComponent(id)}`, { next: { revalidate: 3600 } });
    if (!res.ok)
      return { title: t('Poisson introuvable', 'Fish not found', '魚が見つかりません') };
    const p = await res.json();
    const image = p.images?.[0] && `/images/${p.images[0]}`;
    const title = p.nom_commun;
    const description = t(`${p.nom_commun} (${p.nom_scientifique}, ${p.nom_famille}) : taille, volume minimum, `
      + 'paramètres d\'eau, comportement et habitat naturel.', `${p.nom_commun} (${p.nom_scientifique}, `
      + `${p.nom_famille}): size, minimum volume, water parameters, behaviour and natural habitat.`, `${p.nom_commun}（${p.nom_scientifique}、`
      + `${p.nom_famille}）：サイズ、最小水量、水質、性格、自然の生息地。`);
    // L'objet openGraph d'une fiche remplace celui du site : il reprend le titre et la description
    return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
  } catch {
    return { title: t('Fiche poisson', 'Fish profile', '魚の図鑑') }; // API indisponible : la page affichera son propre message
  }
}

export default function PoissonLayout ({ children }) {
  return children;
}

/**
 * Titre et description de chaque fiche, calculés côté serveur (la page elle-même est rendue dans le navigateur)
 */

import { getI18n } from '@/lib/i18n-server';
import { BACKEND_URL } from '@/lib/site';

export async function generateMetadata ({ params }) {
  const { id } = await params;
  const { t } = await getI18n();
  try {
    const res = await fetch(`${BACKEND_URL}/invertebres/${encodeURIComponent(id)}`, { next: { revalidate: 3600 } });
    if (!res.ok)
      return { title: t('Invertébré introuvable', 'Invertebrate not found', '無脊椎動物が見つかりません') };
    const p = await res.json();
    const image = p.images?.[0] && `/invertebrates/${p.images[0]}`;
    const title = p.nom_commun;
    const description = t(`${p.nom_commun} (${p.nom_scientifique}, ${p.famille}) : taille, volume minimum, `
      + 'paramètres d\'eau, comportement, habitat naturel et maintenance en aquarium.', `${p.nom_commun} `
      + `(${p.nom_scientifique}, ${p.famille}): size, minimum volume, water parameters, behaviour, natural habitat `
      + 'and aquarium care.', `${p.nom_commun}（${p.nom_scientifique}、${p.famille}）：サイズ、最小水量、水質、行動、自然の生息地、`
      + '水槽での飼育。');
    // L'objet openGraph d'une fiche remplace celui du site : il reprend le titre et la description
    return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
  } catch {
    return { title: t('Fiche invertébré', 'Invertebrate profile', '無脊椎動物の図鑑') }; // API indisponible : la page affichera son propre message
  }
}

export default function InvertebreLayout ({ children }) {
  return children;
}

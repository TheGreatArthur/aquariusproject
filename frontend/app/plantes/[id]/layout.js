/**
 * Titre et description de chaque fiche, calculés côté serveur (la page elle-même est rendue dans le navigateur)
 */

import { getI18n } from '@/lib/i18n-server';
import { BACKEND_URL } from '@/lib/site';

export async function generateMetadata ({ params }) {
  const { id } = await params;
  const { t, api } = await getI18n();
  try {
    const res = await fetch(api(`${BACKEND_URL}/plantes/${encodeURIComponent(id)}`), { next: { revalidate: 3600 } });
    if (!res.ok)
      return { title: t('Plante introuvable', 'Plant not found', '水草が見つかりません') };
    const p = await res.json();
    const image = p.images?.[0] && `/plants/${p.images[0].fichier}`;
    const title = p.nom_commun;
    const description = t(`${p.nom_commun} (${p.nom_scientifique}, ${p.famille}) : pH, KH, température, lumière, `
      + 'hauteur, emplacement et entretien en aquarium.', `${p.nom_commun} (${p.nom_scientifique}, ${p.famille}): `
      + 'pH, KH, temperature, light, height, position and aquarium care.', `${p.nom_commun}（${p.nom_scientifique}、${p.famille}）：`
      + 'pH、KH、水温、光量、草丈、配置、水槽での育て方。');
    // L'objet openGraph d'une fiche remplace celui du site : il reprend le titre et la description
    return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
  } catch {
    return { title: t('Fiche plante', 'Plant profile', '水草の図鑑') }; // API indisponible : la page affichera son propre message
  }
}

export default function PlanteLayout ({ children }) {
  return children;
}

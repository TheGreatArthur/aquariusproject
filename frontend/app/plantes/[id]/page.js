import Fiche from './fiche';
import SpeciesUnavailable from '@/components/SpeciesUnavailable';
import { getI18n } from '@/lib/i18n-server';
import { getSpecies } from '@/lib/species-server';

export async function generateMetadata ({ params }) {
  const { t } = await getI18n();
  const p = await getSpecies('plantes', (await params).id);
  if (!p)
    return { title: t('Fiche plante', 'Plant profile', '水草の図鑑') };
  const image = p.images?.[0] && `/plants/${p.images[0].fichier}`;
  const title = p.nom_commun;
  const description = t(`${p.nom_commun} (${p.nom_scientifique}, ${p.famille}) : pH, KH, température, lumière, `
    + 'hauteur, emplacement et entretien en aquarium.', `${p.nom_commun} (${p.nom_scientifique}, ${p.famille}): `
    + 'pH, KH, temperature, light, height, position and aquarium care.', `${p.nom_commun}（${p.nom_scientifique}、${p.famille}）：`
    + 'pH、KH、水温、光量、草丈、配置、水槽での育て方。');
  // L'objet openGraph d'une fiche remplace celui du site : il reprend le titre et la description
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
}

export default async function PlantePage ({ params }) {
  const data = await getSpecies('plantes', (await params).id);
  return data ? <Fiche data={data}/> : <SpeciesUnavailable catalogue="/plantes"/>;
}

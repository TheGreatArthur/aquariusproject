import Fiche from './fiche';
import SpeciesUnavailable from '@/components/SpeciesUnavailable';
import { getI18n } from '@/lib/i18n-server';
import { getSpecies } from '@/lib/species-server';

export async function generateMetadata ({ params }) {
  const { t } = await getI18n();
  const p = await getSpecies('poissons', (await params).id);
  if (!p)
    return { title: t('Fiche poisson', 'Fish profile', '魚の図鑑') };
  const image = p.images?.[0] && `/images/${p.images[0]}`;
  const title = p.nom_commun;
  const description = t(`${p.nom_commun} (${p.nom_scientifique}, ${p.nom_famille}) : taille, volume minimum, `
    + 'paramètres d\'eau, comportement et habitat naturel.', `${p.nom_commun} (${p.nom_scientifique}, `
    + `${p.nom_famille}): size, minimum volume, water parameters, behaviour and natural habitat.`, `${p.nom_commun}（${p.nom_scientifique}、`
    + `${p.nom_famille}）：サイズ、最小水量、水質、性格、自然の生息地。`);
  // L'objet openGraph d'une fiche remplace celui du site : il reprend le titre et la description
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
}

export default async function PoissonPage ({ params }) {
  const data = await getSpecies('poissons', (await params).id);
  return data ? <Fiche data={data}/> : <SpeciesUnavailable catalogue="/poissons"/>;
}

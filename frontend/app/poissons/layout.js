import { getI18n } from '@/lib/i18n-server';

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    // Le gabarit est repris ici pour que les fiches des sous-pages gardent le suffixe « · Aquarius »
    title: { default: t('Les poissons', 'Fish', '魚'), template: '%s · Aquarius' },
    description: t('Catalogue des poissons d\'eau douce : taille, volume minimum, paramètres d\'eau et comportement '
      + 'de chaque espèce.', 'Freshwater fish catalogue: size, minimum volume, water parameters and behaviour of '
      + 'each species.', '淡水魚の図鑑：各種のサイズ、最小水量、水質、性格。'),
  };
}

export default function PoissonsLayout ({ children }) {
  return children;
}

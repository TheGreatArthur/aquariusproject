import { getI18n } from '@/lib/i18n-server';

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    // Le gabarit est repris ici pour que les fiches des sous-pages gardent le suffixe « · Aquarius »
    title: { default: t('Les plantes', 'Plants'), template: '%s · Aquarius' },
    description: t('Plantes d\'aquarium : pH, KH, température, lumière, hauteur et entretien de chaque espèce, '
      + 'avec des photos sous licence libre.', 'Aquarium plants: pH, KH, temperature, light, height and care of each '
      + 'species, with freely licensed photos.'),
  };
}

export default function PlantesLayout ({ children }) {
  return children;
}

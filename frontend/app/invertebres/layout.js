import { getI18n } from '@/lib/i18n-server';

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    title: { default: t('Les invertébrés', 'Invertebrates', '無脊椎動物'), template: '%s · Aquarius' },
    description: t('Crevettes, crabes, escargots et écrevisses d’aquarium : entretien, paramètres d’eau, alimentation, '
      + 'reproduction et photos créditées.', 'Aquarium shrimp, crabs, snails and crayfish: care, water parameters, '
      + 'feeding, breeding and credited photos.', '観賞用のエビ、カニ、貝、ザリガニ：飼育方法、水質、餌、繁殖、クレジット付きの写真。'),
  };
}
export default function InvertebresLayout ({ children }) {
  return children;
}

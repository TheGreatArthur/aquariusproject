import { getI18n } from '@/lib/i18n-server';

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    title: 'Contact',
    description: t('Une question, une erreur dans une fiche ou une espèce à ajouter : écrivez à l\'équipe Aquarius.',
      'A question, a mistake in a profile or a species to add: write to the Aquarius team.',
      'ご質問、図鑑の誤り、追加してほしい種があれば、Aquarius チームまでご連絡ください。'),
  };
}

export default function ContactLayout ({ children }) {
  return children;
}

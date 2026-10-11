import Link from 'next/link';

import { getI18n } from '@/lib/i18n-server';

/** Fiche qui n'a pas pu être chargée : l'API ne répond pas */
export default async function SpeciesUnavailable ({ catalogue }) {
  const { t, href } = await getI18n();
  return (
    <div className="container pt-40 text-center">
      <h1 className="text-3xl font-semibold">{t('Fiche indisponible', 'Profile unavailable', '図鑑を表示できません')}</h1>
      <p className="mt-3 text-muted">
        {t('Le catalogue ne répond pas. Réessayez dans un instant.', 'The catalogue is not responding. Try again in a moment.',
          'カタログが応答しません。しばらくしてからもう一度お試しください。')}
      </p>
      <Link href={href(catalogue)} className="btn-ghost mt-6">{t('Retour au catalogue', 'Back to the catalogue', '図鑑に戻る')}</Link>
    </div>
  );
}

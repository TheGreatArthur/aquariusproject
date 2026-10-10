import Link from 'next/link';

import { getI18n } from '@/lib/i18n-server';

export default async function NotFound () {
  const { t, href } = await getI18n();
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="eyebrow">{t('Erreur 404', 'Error 404', 'エラー 404')}</p>
      <h1 className="mt-4 text-5xl font-semibold sm:text-6xl">{t('Ce poisson s\'est échappé.', 'This fish got away.', 'この魚は逃げてしまいました。')}</h1>
      <p className="mt-4 max-w-md text-muted">
        {t('La page demandée n\'existe pas ou a été déplacée.', 'The page you asked for does not exist or has moved.', 'お探しのページは存在しないか、移動しました。')}
      </p>
      <div className="mt-8 flex gap-3">
        <Link href={href('/')} className="btn-primary">{t('Retour à l\'accueil', 'Back to home', 'ホームに戻る')}</Link>
        <Link href={href('/poissons')} className="btn-ghost">{t('Voir les poissons', 'Browse the fish', '魚を見る')}</Link>
      </div>
    </div>
  );
}

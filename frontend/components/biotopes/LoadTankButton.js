'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import { lsGet, lsSet } from '@/lib/localstorage';

/**
 * Ouvre le simulateur avec le bac d'exemple d'un biotope : son eau et sa population, enregistrées comme le simulateur
 * enregistre le bac du visiteur (clés « form_data » et « bac » du stockage local). Un bac déjà composé n'est remplacé
 * qu'après confirmation.
 */
export default function LoadTankButton ({ eau, contenu }) {
  const { t, href } = useI18n();
  const router = useRouter();

  const charger = () => {
    if (lsGet('bac')?.length && !window.confirm(t('Remplacer le bac enregistré dans le simulateur ?',
      'Replace the tank saved in the simulator?', 'シミュレーターに保存された水槽を置き換えますか？')))
      return;
    lsSet('form_data', Object.fromEntries(Object.entries(eau).map(([k, v]) => [k, String(v)])));
    lsSet('bac', contenu);
    router.push(href('/simulation'));
  };

  return (
    <button type="button" onClick={charger} className="btn-primary mt-5">
      {t('Ouvrir dans le simulateur', 'Open in the simulator', 'シミュレーターで開く')} <ArrowRight className="h-4 w-4"/>
    </button>
  );
}

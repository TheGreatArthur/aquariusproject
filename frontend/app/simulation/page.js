'use client';

import dynamic from 'next/dynamic';

import { useI18n } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';

// Le simulateur lit le bac enregistré dans le stockage local, que le serveur ne connaît pas :
// il n'est rendu que dans le navigateur, avec un squelette en attendant
const Simulator = dynamic(() => import('./simulator'), {
  ssr: false,
  loading: () => (
    <div className="container space-y-8" aria-busy="true">
      <div className="card h-40 animate-pulse bg-surface-elevated/60"/>
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="card h-96 animate-pulse bg-surface-elevated/60"/>
        <div className="card h-72 animate-pulse bg-surface-elevated/60"/>
      </div>
    </div>
  ),
});

export default function SimulationPage () {
  const { t } = useI18n();
  return <>
    <PageHeader eyebrow={t('Simulateur', 'Simulator')} title={t('Composez votre aquarium', 'Build your aquarium')}>
      {t('Indiquez votre bac, puis ajoutez poissons, plantes et invertébrés : chaque ajout est vérifié avant d\'entrer.',
        'Describe your tank, then add fish, plants and invertebrates: every addition is checked before it goes in.')}
    </PageHeader>
    <Simulator/>
  </>;
}

'use client';

import dynamic from 'next/dynamic';

import PageHeader from '@/components/PageHeader';

// Le simulateur lit le bac enregistré dans le stockage local, que le serveur ne connaît pas :
// il n'est rendu que dans le navigateur, avec un squelette en attendant
const Simulator = dynamic(() => import('./simulator'), {
  ssr: false,
  loading: () => (
    <div className="container grid items-start gap-8 lg:grid-cols-[22rem_1fr]" aria-busy="true">
      <div className="card h-72 animate-pulse bg-surface-elevated/60"/>
      <div className="card h-96 animate-pulse bg-surface-elevated/60"/>
    </div>
  ),
});

export default function SimulationStart () {
  return <>
    <PageHeader eyebrow="Simulateur" title="Aquarium de zéro">
      Renseignez votre eau : seules les espèces compatibles restent affichées. Ajoutez-les ensuite à votre bac.
    </PageHeader>
    <Simulator/>
  </>;
}

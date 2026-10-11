'use client';

import useSWR from 'swr';

import { useI18n } from '@/components/I18nProvider';
import TankPreview from '@/components/TankPreview';
import { espece } from '@/lib/compat';

// Bac d'exemple évalué par le vrai moteur : l'aperçu suit la langue, le thème et les données du catalogue
const EAU = { litrage: 200, pH: 6.8, gH: 8, tempMoyenne: 25 };
const POPULATION = { 'Paracheirodon innesi': 10, 'Corydoras panda': 6, 'Otocinclus affinis': 3 };

export default function SimulatorPreview () {
  const { api } = useI18n();
  // Même requête que les chiffres de l'accueil : aucun appel en plus
  const { data } = useSWR(api('/api/poissons'));

  const bac = (data?.poissons ?? []).filter((p) => POPULATION[p.nom_scientifique])
    .map((p) => ({ ...espece('poisson', p), quantite: POPULATION[p.nom_scientifique] }));

  if (!bac.length)
    return <div className="card h-[28rem] animate-pulse" aria-hidden="true"/>;
  return <TankPreview eau={EAU} bac={bac}/>;
}

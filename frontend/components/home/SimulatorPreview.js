'use client';

import useSWR from 'swr';

import Verdict from '@/app/simulation/verdict';
import { useI18n } from '@/components/I18nProvider';
import { espece, evaluate } from '@/lib/compat';

// Bac d'exemple évalué par le vrai moteur : l'aperçu suit la langue, le thème et les données du catalogue
const EAU = { litrage: 200, pH: 6.8, gH: 8, tempMoyenne: 25 };
const POPULATION = { 'Paracheirodon innesi': 10, 'Corydoras panda': 6, 'Otocinclus affinis': 3 };

const CHAMPS = [
  { name: 'litrage', label: 'Volume', en: 'Volume', ja: '容量', unit: ' L' },
  { name: 'pH', label: 'pH', en: 'pH', ja: 'pH', unit: '' },
  { name: 'gH', label: 'GH', en: 'GH', ja: 'GH', unit: '°' },
  { name: 'tempMoyenne', label: 'Temp.', en: 'Temp.', ja: '水温', unit: ' °C' },
];

export default function SimulatorPreview () {
  const { t, api, intl, locale } = useI18n();
  // Même requête que les chiffres de l'accueil : aucun appel en plus
  const { data } = useSWR(api('/api/poissons'));

  const bac = (data?.poissons ?? []).filter((p) => POPULATION[p.nom_scientifique])
    .map((p) => ({ ...espece('poisson', p), quantite: POPULATION[p.nom_scientifique] }));

  if (!bac.length)
    return <div className="card h-[28rem] animate-pulse" aria-hidden="true"/>;

  const { verdict, issues, ranges } = evaluate(bac, { ...EAU, locale });

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <p className="font-display font-semibold">{t('Exemple de bac', 'Example tank', '水槽の例')}</p>
        <dl className="mt-4 grid grid-cols-4 gap-2 text-sm">
          {CHAMPS.map(({ name, label, en, ja, unit }) => (
            <div key={name} className="rounded-lg bg-surface-elevated px-2.5 py-1.5">
              <dt className="text-xs text-muted">{t(label, en, ja)}</dt>
              <dd className="font-medium tabular-nums">{EAU[name].toLocaleString(intl)}{unit}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-4 space-y-1 text-sm text-foreground/85">
          {bac.map((p) => (
            <li key={p.ref}><span className="tabular-nums text-muted">{p.quantite} ×</span> {p.nom_commun}</li>
          ))}
        </ul>
      </div>
      <Verdict verdict={verdict} issues={issues} ranges={ranges}/>
    </div>
  );
}

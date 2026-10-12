'use client';

import Verdict from '@/app/simulation/verdict';
import { useI18n } from '@/components/I18nProvider';
import { evaluate } from '@/lib/compat';

const CHAMPS = [
  { name: 'litrage', label: 'Volume', en: 'Volume', ja: '容量', unit: ' L' },
  { name: 'pH', label: 'pH', en: 'pH', ja: 'pH', unit: '' },
  { name: 'gH', label: 'GH', en: 'GH', ja: 'GH', unit: '°' },
  { name: 'tempMoyenne', label: 'Temp.', en: 'Temp.', ja: '水温', unit: ' °C' },
];

/**
 * Bac d'exemple évalué par le moteur du simulateur : son eau, sa population et le verdict, dans la langue et le thème
 * de la page. `bac` : espèces au format du moteur (espece()) avec leur quantité.
 */
export default function TankPreview ({ eau, bac, children }) {
  const { t, intl, locale } = useI18n();
  const { verdict, issues, ranges } = evaluate(bac, { ...eau, locale });

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <p className="font-display font-semibold">{t('Exemple de bac', 'Example tank', '水槽の例')}</p>
        <dl className="mt-4 grid grid-cols-4 gap-2 text-sm">
          {CHAMPS.map(({ name, label, en, ja, unit }) => (
            <div key={name} className="rounded-lg bg-surface-elevated px-2.5 py-1.5">
              <dt className="text-xs text-muted">{t(label, en, ja)}</dt>
              <dd className="font-medium tabular-nums">{eau[name].toLocaleString(intl)}{unit}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-4 space-y-1 text-sm text-foreground/85">
          {bac.map((p) => (
            <li key={p.id}>
              {/* Une plante n'a pas de nombre d'individus utile à afficher */}
              {p.kind !== 'plante' && <span className="tabular-nums text-muted">{p.quantite} × </span>}
              {p.nom_commun}
            </li>
          ))}
        </ul>
        {children}
      </div>
      <Verdict verdict={verdict} issues={issues} ranges={ranges}/>
    </div>
  );
}

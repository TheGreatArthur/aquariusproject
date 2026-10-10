/**
 * Verdict de compatibilité : plage d'eau commune et problèmes classés par gravité
 */

import clsx from 'clsx';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import { formatRange } from '@/lib/compat/utils';

const SEVERITIES = {
  error: { label: 'Bloquant', en: 'Blocking', icon: AlertOctagon, text: 'text-danger', dot: 'bg-danger' },
  warning: { label: 'À surveiller', en: 'To watch', icon: AlertTriangle, text: 'text-warning', dot: 'bg-warning' },
  info: { label: 'Bon à savoir', en: 'Good to know', icon: Info, text: 'text-accent-glow', dot: 'bg-accent' },
};

const VERDICTS = {
  ok: { label: 'Population compatible', en: 'Compatible stocking', icon: CheckCircle2, text: 'text-success', border: 'border-success/40' },
  warning: { label: 'Compatible, avec des points à surveiller', en: 'Compatible, with points to watch', icon: AlertTriangle, text: 'text-warning',
    border: 'border-warning/40' },
  error: { label: 'Population incompatible', en: 'Incompatible stocking', icon: AlertOctagon, text: 'text-danger', border: 'border-danger/40' },
};

const RANGES = [
  { key: 'ph', label: 'pH', en: 'pH', unit: '' },
  { key: 'gh', label: 'GH', en: 'GH', unit: '°' },
  { key: 'temp', label: 'Temp.', en: 'Temp.', unit: ' °C' },
];

export default function Verdict ({ verdict, issues, ranges }) {
  const { t, locale } = useI18n();
  const { label, en, icon: Icon, text, border } = VERDICTS[verdict];

  return (
    <div role="status" className={clsx('card p-5', border)}>
      <p className={clsx('flex items-center gap-2 font-display font-semibold leading-snug', text)}>
        <Icon className="h-5 w-5"/> {t(label, en)}
      </p>

      {ranges && (
        <div className="mt-4">
          <p className="label">{t('Eau commune à toutes les espèces', 'Water shared by all species')}</p>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            {RANGES.map(({ key, label: name, en: nameEn, unit }) => (
              <div key={key} className="rounded-lg bg-surface-elevated px-2.5 py-1.5">
                <dt className="text-xs text-muted">{t(name, nameEn)}</dt>
                {/* undefined : aucune espèce du bac ne donne ce paramètre (le GH des plantes) */}
                <dd className={clsx('font-medium tabular-nums', ranges[key] === null && 'text-danger',
                  ranges[key] === undefined && 'text-muted')}>
                  {ranges[key] ? formatRange(...ranges[key], unit, locale) : ranges[key] === null ? t('aucune', 'none') : '–'}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {Object.entries(SEVERITIES).map(([severity, { label: title, en: titleEn, icon: SeverityIcon, text: color, dot }]) => {
        const items = issues.filter((i) => i.severity === severity);
        return items.length > 0 && (
          <div key={severity} className="mt-4">
            <p className={clsx('flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider', color)}>
              <SeverityIcon className="h-3.5 w-3.5"/> {t(title, titleEn)}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
              {items.map((i) => (
                <li key={i.message} className="flex gap-2">
                  <span className={clsx('mt-2 h-1 w-1 shrink-0 rounded-full', dot)}/>{i.message}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

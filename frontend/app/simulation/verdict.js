/**
 * Verdict de compatibilité : plage d'eau commune et problèmes classés par gravité
 */

import clsx from 'clsx';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const SEVERITIES = {
  error: { label: 'Bloquant', icon: AlertOctagon, text: 'text-danger', dot: 'bg-danger' },
  warning: { label: 'À surveiller', icon: AlertTriangle, text: 'text-warning', dot: 'bg-warning' },
  info: { label: 'Bon à savoir', icon: Info, text: 'text-accent-glow', dot: 'bg-accent' },
};

const VERDICTS = {
  ok: { label: 'Population compatible', icon: CheckCircle2, text: 'text-success', border: 'border-success/40' },
  warning: { label: 'Compatible, avec des points à surveiller', icon: AlertTriangle, text: 'text-warning',
    border: 'border-warning/40' },
  error: { label: 'Population incompatible', icon: AlertOctagon, text: 'text-danger', border: 'border-danger/40' },
};

const RANGES = [
  { key: 'ph', label: 'pH', unit: '' },
  { key: 'gh', label: 'GH', unit: '°' },
  { key: 'temp', label: 'Temp.', unit: ' °C' },
];

export default function Verdict ({ verdict, issues, ranges }) {
  const { label, icon: Icon, text, border } = VERDICTS[verdict];

  return (
    <div role="status" className={clsx('card p-5', border)}>
      <p className={clsx('flex items-center gap-2 font-display font-semibold leading-snug', text)}>
        <Icon className="h-5 w-5"/> {label}
      </p>

      {ranges && (
        <div className="mt-4">
          <p className="label">Eau commune à toutes les espèces</p>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            {RANGES.map(({ key, label: name, unit }) => (
              <div key={key} className="rounded-lg bg-surface-elevated px-2.5 py-1.5">
                <dt className="text-xs text-muted">{name}</dt>
                {/* undefined : aucune espèce du bac ne donne ce paramètre (le GH des plantes) */}
                <dd className={clsx('font-medium tabular-nums', ranges[key] === null && 'text-danger',
                  ranges[key] === undefined && 'text-muted')}>
                  {ranges[key] ? `${ranges[key][0]}–${ranges[key][1]}${unit}` : ranges[key] === null ? 'aucune' : '–'}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {Object.entries(SEVERITIES).map(([severity, { label: title, icon: SeverityIcon, text: color, dot }]) => {
        const items = issues.filter((i) => i.severity === severity);
        return items.length > 0 && (
          <div key={severity} className="mt-4">
            <p className={clsx('flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider', color)}>
              <SeverityIcon className="h-3.5 w-3.5"/> {title}
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

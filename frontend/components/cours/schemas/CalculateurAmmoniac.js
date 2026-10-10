'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';

import { useI18n } from '@/components/I18nProvider';
import { fractionAmmoniac } from '@/lib/cours/chimie';
import { typo } from '@/lib/cours/texte';

const nombre = (intl, decimales) => new Intl.NumberFormat(intl, { maximumFractionDigits: decimales, minimumFractionDigits: decimales });

// Seuils : OATA (maximum toléré brièvement) et UF/IFAS (lésions des tissus au-delà)
const SEUIL_OATA = 0.02;
const SEUIL_LESIONS = 0.05;

function Curseur ({ label, valeur, min, max, step, unite, onChange, decimales = 0 }) {
  const id = useId();
  const { intl } = useI18n();
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id} className="text-foreground/80">{label}</label>
        <span className="font-display font-semibold tabular-nums">{nombre(intl, decimales).format(valeur)}{unite}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={valeur}
             onChange={(e) => onChange(Number(e.target.value))}
             className="mt-2 w-full accent-accent"/>
    </div>
  );
}

/** Ammoniac libre (NH₃) à partir d'une mesure d'ammoniaque totale, du pH et de la température */
export default function CalculateurAmmoniac () {
  const { t, intl, locale } = useI18n();
  const [total, setTotal] = useState(0.5);
  const [pH, setPh] = useState(7.5);
  const [temperature, setTemperature] = useState(25);

  const libre = total * fractionAmmoniac(pH, temperature);
  const niveau = libre <= SEUIL_OATA ? 'ok' : libre <= SEUIL_LESIONS ? 'attention' : 'danger';
  const message = {
    ok: t('Sous le maximum de 0,02 mg/L recommandé par l’OATA : à surveiller, mais pas d’urgence.',
      'Below the 0.02 mg/L maximum recommended by OATA: keep an eye on it, but no emergency.',
      'OATA が推奨する上限 0.02 mg/L 未満：注意は必要ですが、緊急ではありません。'),
    attention: t('Au-dessus de 0,02 mg/L : changez une partie de l’eau et réduisez la nourriture.',
      'Above 0.02 mg/L: change part of the water and feed less.',
      '0.02 mg/L を超えています：水の一部を換え、餌を減らしてください。'),
    danger: t('Au-dessus de 0,05 mg/L, les branchies s’abîment : changez 25 à 50 % de l’eau aujourd’hui.',
      'Above 0.05 mg/L, the gills are damaged: change 25 to 50% of the water today.',
      '0.05 mg/L を超えるとえらが傷みます：今日中に水の25〜50%を換えてください。'),
  }[niveau];

  return (
    <div className="card grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
      <div className="space-y-5">
        <Curseur label={t('Ammoniaque totale mesurée', 'Measured total ammonia', '測定した総アンモニア')} valeur={total} min={0.25} max={4} step={0.25} unite={'\u00a0mg/L'}
                 decimales={2} onChange={setTotal}/>
        <Curseur label="pH" valeur={pH} min={6} max={8.6} step={0.1} unite="" decimales={1} onChange={setPh}/>
        <Curseur label={t('Température', 'Temperature', '水温')} valeur={temperature} min={18} max={32} step={1} unite={'\u00a0°C'} onChange={setTemperature}/>
      </div>

      <div role="status" className={clsx('rounded-2xl border p-5 sm:w-64', {
        'border-success/40 bg-success/5': niveau === 'ok',
        'border-warning/40 bg-warning/5': niveau === 'attention',
        'border-danger/40 bg-danger/5': niveau === 'danger',
      })}>
        <p className="text-sm text-muted">{t('Ammoniac libre (NH₃)', 'Free ammonia (NH₃)', '遊離アンモニア（NH₃）')}</p>
        <p className={clsx('mt-1 font-display text-3xl font-semibold tabular-nums', {
          'text-success': niveau === 'ok', 'text-warning': niveau === 'attention', 'text-danger': niveau === 'danger',
        })}>
          {nombre(intl, 3).format(libre)}&nbsp;mg/L
        </p>
        <p className="mt-2 text-sm text-foreground/80">{typo(message, locale)}</p>
      </div>
    </div>
  );
}

import clsx from 'clsx';

import { fractionAmmoniac } from '@/lib/cours/chimie';

const PH = [6.5, 7, 7.5, 8, 8.5];
const TEMPERATURES = [20, 22, 24, 26, 28, 30];
const pourcent = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 });
const nombre = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Classe de fond selon la part d'ammoniac libre */
const fond = (f) => (f < 0.01 ? 'bg-success/10 text-success' : f < 0.05 ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger');

/** Part d'ammoniac libre (NH₃) dans l'ammoniaque totale mesurée, selon le pH et la température (Emerson et al., 1975) */
export default function TableauAmmoniac () {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[30rem] border-collapse text-center text-sm tabular-nums">
        <caption className="sr-only">Part d&apos;ammoniac libre selon le pH (lignes) et la température (colonnes)</caption>
        <thead className="bg-surface-elevated/70">
          <tr>
            <th scope="col" className="px-3 py-2.5 text-left font-display font-semibold">pH</th>
            {TEMPERATURES.map((t) => (
              <th key={t} scope="col" className="px-3 py-2.5 font-display font-semibold">{t}&nbsp;°C</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PH.map((pH) => (
            <tr key={pH} className="border-t border-border/70">
              <th scope="row" className="px-3 py-2 text-left font-medium">{nombre.format(pH)}</th>
              {TEMPERATURES.map((t) => {
                const f = fractionAmmoniac(pH, t);
                return <td key={t} className={clsx('px-3 py-2 font-medium', fond(f))}>{pourcent.format(f)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

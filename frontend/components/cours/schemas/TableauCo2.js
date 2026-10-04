import clsx from 'clsx';

import { co2DepuisKhPh } from '@/lib/cours/chimie';
import { typo } from '@/lib/cours/texte';

const KH = [1, 2, 3, 4, 6, 8, 10];
const PH = [6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6];
const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

// Zones : besoins des plantes selon Tropica (Medium 10-15 mg/L, Advanced 15-30 mg/L), au-delà à surveiller
const ZONES = [
  { max: 10, nom: 'Moins de 10 mg/L : suffisant pour les plantes faciles', classe: 'bg-transparent text-foreground/60' },
  { max: 15, nom: '10 à 15 mg/L : plantes « Medium »', classe: 'bg-accent/20 text-accent-glow' },
  { max: 30, nom: '15 à 30 mg/L : plantes exigeantes', classe: 'bg-accent/50 text-foreground' },
  { max: Infinity, nom: 'Plus de 30 mg/L : surveillez la respiration des poissons', classe: 'bg-danger/25 text-danger' },
];
const zone = (co2) => ZONES.find((z) => co2 < z.max);

/** CO₂ dissous estimé selon le KH et le pH (CO₂ ≈ 3 × KH × 10^(7 − pH)) */
export default function TableauCo2 () {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[34rem] border-collapse text-center text-sm tabular-nums">
          <caption className="sr-only">CO₂ dissous en mg/L selon le KH (lignes) et le pH (colonnes)</caption>
          <thead className="bg-surface-elevated/70">
            <tr>
              <th scope="col" className="px-2 py-2.5 text-left font-display font-semibold">KH \ pH</th>
              {PH.map((ph) => <th key={ph} scope="col" className="px-2 py-2.5 font-display font-semibold">{nombre.format(ph)}</th>)}
            </tr>
          </thead>
          <tbody>
            {KH.map((kh) => (
              <tr key={kh} className="border-t border-border/70">
                <th scope="row" className="px-2 py-2 text-left font-medium">{kh}&nbsp;°d</th>
                {PH.map((ph) => {
                  const co2 = co2DepuisKhPh(kh, ph);
                  return <td key={ph} className={clsx('px-2 py-2', zone(co2).classe)}>{Math.round(co2)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-2 text-sm sm:grid-cols-2">
        {ZONES.map((z) => (
          <li key={z.nom} className="flex items-center gap-2">
            <span aria-hidden="true" className={clsx('h-3 w-3 shrink-0 rounded-sm ring-1 ring-border', z.classe)}/>
            {typo(z.nom)}
          </li>
        ))}
      </ul>
    </div>
  );
}

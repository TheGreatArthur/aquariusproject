'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { useI18n } from '@/components/I18nProvider';

const MIN = 4;
const MAX = 9.5;
const pos = (ph) => `${((ph - MIN) / (MAX - MIN)) * 100}%`;
const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

// Zones de l'échelle : eau acide, proche de la neutralité, basique
const ZONES = [
  { de: MIN, a: 6.5, nom: 'acide', classe: 'bg-accent/10' },
  { de: 6.5, a: 7.5, nom: 'neutre', classe: 'bg-surface-elevated' },
  { de: 7.5, a: MAX, nom: 'basique', classe: 'bg-warning/10' },
];

/**
 * Plages de pH de quelques espèces du catalogue, lues dans l'API pour rester à jour
 * @param {{ especes: string[] }} props noms scientifiques, dans l'ordre d'affichage
 */
export default function PlagesPh ({ especes }) {
  const { href, api } = useI18n();
  const { data, error } = useSWR(api('/api/poissons'));

  if (error)
    return <p className="card p-5 text-sm text-muted">Les plages des espèces n&apos;ont pas pu être chargées.</p>;

  const parNom = new Map((data?.poissons ?? []).map((p) => [p.nom_scientifique, p]));
  const lignes = especes.map((nom) => parNom.get(nom)).filter(Boolean);

  return (
    <div className="card p-4 sm:p-6">
      <div className="relative sm:ml-[12rem]">
        <div className="flex h-6 overflow-hidden rounded-md text-[0.7rem] text-muted">
          {ZONES.map((z) => (
            <span key={z.nom} className={`${z.classe} flex items-center justify-center`}
                  style={{ width: `${((z.a - z.de) / (MAX - MIN)) * 100}%` }}>
              {z.nom}
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-3 space-y-3" aria-busy={!data}>
        {!data && Array.from({ length: especes.length }, (_, i) => (
          <li key={i} className="h-7 animate-pulse rounded bg-surface-elevated/60"/>
        ))}
        {lignes.map((p) => (
          <li key={p.id} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-4">
            <Link href={href(`/poissons/${p.id}`)} className="flex min-w-0 items-baseline justify-between gap-2 text-sm hover:text-accent-glow sm:block">
              <span className="block truncate">{p.nom_commun}</span>
              <span className="block text-xs text-muted">GH&nbsp;{nombre.format(p.gh_mini)}-{nombre.format(p.gh_maxi)}&nbsp;°dGH</span>
            </Link>
            <div className="relative h-5 rounded-full bg-surface-elevated/60"
                 role="img" aria-label={`${p.nom_commun} : pH ${nombre.format(p.ph_mini)} à ${nombre.format(p.ph_maxi)}`}>
              <span className="absolute inset-y-0 flex items-center justify-center rounded-full bg-accent text-[0.68rem] font-semibold tabular-nums text-background"
                    style={{ left: pos(p.ph_mini), width: `calc(${pos(p.ph_maxi)} - ${pos(p.ph_mini)})` }}>
                {nombre.format(p.ph_mini)}-{nombre.format(p.ph_maxi)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative mt-2 h-4 text-[0.7rem] tabular-nums text-muted sm:ml-[12rem]" aria-hidden="true">
        {[4, 5, 6, 7, 8, 9].map((v) => (
          <span key={v} className="absolute -translate-x-1/2" style={{ left: pos(v) }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

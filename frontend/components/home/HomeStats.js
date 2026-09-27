'use client';

import useSWR from 'swr';

import { VALIDATIONS } from '@/lib/validation';

export default function HomeStats () {
  const { data: poissons } = useSWR('/api/poissons');
  const { data: familles } = useSWR('/api/poissons/familles');

  const stats = [
    { value: poissons?.poissons.length, label: 'espèces référencées' },
    { value: familles?.familles.length, label: 'familles' },
    { value: VALIDATIONS.length, label: 'règles de compatibilité' },
  ];

  return (
    <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-6">
      {stats.map(({ value, label }) => (
        <div key={label}>
          <dt className="sr-only">{label}</dt>
          <dd className="font-display text-3xl font-semibold text-foreground">
            {value ?? <span className="inline-block h-8 w-10 animate-pulse rounded bg-surface-elevated"/>}
          </dd>
          <dd className="mt-1 text-xs text-muted">{label}</dd>
        </div>
      ))}
    </dl>
  );
}

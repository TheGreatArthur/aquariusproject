'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import PlantCard from '@/components/plants/PlantCard';
import { matchesPlantSearch, TYPES, typesPresents } from '@/lib/plants';

export default function PlantesPage () {
  const [terme, setTerme] = useState('');
  const [type, setType] = useState('');
  const { data, error, isLoading } = useSWR('/api/plantes');

  const plantes = useMemo(() => (data?.plantes ?? [])
    .filter((p) => (!type || p.type === type) && matchesPlantSearch(p, terme)), [data, type, terme]);
  const types = useMemo(() => typesPresents(data?.plantes ?? []), [data]);

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Les plantes"
        aside={data && (
          <p className="text-sm text-muted">
            <span className="font-display text-2xl font-semibold text-foreground">{plantes.length}</span> espèces
          </p>
        )}
      >
        Les plantes les plus courantes en aquariophilie : paramètres d&apos;eau, lumière, hauteur et place dans le bac.
      </PageHeader>

      <section className="container">
        {/* Filtres */}
        <div className="sticky top-16 z-30 -mx-4 border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
          <label className="relative block">
            <span className="sr-only">Rechercher une plante</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>
            <input
              type="search"
              className="input !rounded-full !pl-11"
              placeholder="Anubias, mousse, Araceae, tige…"
              value={terme}
              onChange={(e) => setTerme(e.target.value)}
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label="Filtrer par port">
            {['', ...types].map((t) => (
              <button
                key={t || 'toutes'}
                type="button"
                className={clsx('chip shrink-0', type === t && 'chip-active')}
                aria-pressed={type === t}
                onClick={() => setType(t)}
              >
                {t ? TYPES[t].filtre : 'Toutes'}
              </button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        {error ? (
          <p className="card mt-10 p-8 text-center text-danger">
            Impossible de charger les plantes. Vérifiez que l&apos;API est démarrée.
          </p>
        ) : isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="card aspect-[3/4] animate-pulse bg-surface-elevated/60"/>
            ))}
          </div>
        ) : plantes.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-display text-xl">Aucune plante trouvée</p>
            <p className="mt-2 text-sm text-muted">Essayez un autre terme ou un autre filtre.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {plantes.map((p, i) => <PlantCard key={p.id} plante={p} priority={i < 4}/>)}
          </div>
        )}

        <p className="mt-12 text-xs text-muted">
          Paramètres de culture : Flowgrow. Hauteur en aquarium et besoin en CO₂ : Tropica. Classification : GBIF.
          Photos : Wikimedia Commons, sous licence libre, avec leurs auteurs sur chaque fiche.
        </p>
      </section>
    </>
  );
}

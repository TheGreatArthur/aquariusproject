'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import PlantCard from '@/components/plants/PlantCard';
import { matchesPlantSearch, TYPES, typesPresents } from '@/lib/plants';

const PLANTES_PER_PAGE = 12;

/** En-tête du catalogue, avec le nombre de plantes affichées une fois la liste chargée */
export function CatalogueHeader ({ count }) {
  return (
    <PageHeader
      eyebrow="Catalogue"
      title="Les plantes"
      aside={count != null && (
        <p className="text-sm text-muted">
          <span className="font-display text-2xl font-semibold text-foreground">{count}</span> références
        </p>
      )}
    >
      Espèces, formes et cultivars d&apos;aquarium : recherchez par nom, famille ou port, puis découvrez leur aire
      d&apos;origine sur chaque fiche.
    </PageHeader>
  );
}

/** Grille d'attente, pendant le chargement de la liste */
export function CatalogueSkeleton () {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="card aspect-[3/4] animate-pulse bg-surface-elevated/60"/>
      ))}
    </div>
  );
}

export default function Catalogue () {
  const params = useSearchParams(); // Paramètres d'URL
  const router = useRouter();
  const pathname = usePathname();

  const [terme, setTerme] = useState('');
  // Le port vient de l'URL, ce qui suit aussi les liens /plantes?type=... des fiches
  const type = params.get('type') ?? '';

  // La liste complète est chargée une fois et filtrée dans le navigateur
  const { data, error, isLoading } = useSWR('/api/plantes');

  // La page courante ne vaut que pour la recherche en cours : toute nouvelle recherche repart de la page 1
  const recherche = `${type}|${terme}`;
  const [pagination, setPagination] = useState({ recherche, page: 1 });
  const currentPage = pagination.recherche === recherche ? pagination.page : 1;

  const setTypeUrl = (t) =>
    router.replace(t ? `${pathname}?type=${encodeURIComponent(t)}` : pathname, { scroll: false });

  const chooseType = (t) => {
    setTerme('');
    setTypeUrl(t);
  };

  // Taper une recherche retire le filtre de port, sans effacer le texte saisi
  const onSearch = (value) => {
    setTerme(value);
    if (type)
      setTypeUrl('');
  };

  const changePage = (page) => {
    setPagination({ recherche, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ordre alphabétique français (« Égérie » avec les E, pas après les Z comme dans l'ordre de la base)
  const plantes = useMemo(() => (data?.plantes ?? [])
    .filter((p) => type ? p.type === type : matchesPlantSearch(p, terme))
    .sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, 'fr', { sensitivity: 'base' })), [data, type, terme]);
  const types = useMemo(() => typesPresents(data?.plantes ?? []), [data]);

  // Pagination
  const totalPages = Math.ceil(plantes.length / PLANTES_PER_PAGE);
  const currentPlantes = plantes.slice((currentPage - 1) * PLANTES_PER_PAGE, currentPage * PLANTES_PER_PAGE);

  return (
    <>
      <CatalogueHeader count={data ? plantes.length : null}/>

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
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label="Filtrer par port">
            <button
              type="button"
              className={clsx('chip shrink-0', !type && 'chip-active')}
              onClick={() => chooseType('')}
            >
              Toutes
            </button>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                className={clsx('chip shrink-0', type === t && 'chip-active')}
                onClick={() => chooseType(t)}
              >
                {TYPES[t].filtre}
              </button>
            ))}
          </div>
        </div>

        {type && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            Port : <span className="text-foreground">{TYPES[type]?.filtre ?? type}</span>
            <button type="button" onClick={() => chooseType('')} className="rounded-full p-1 hover:text-foreground"
                    aria-label="Retirer le filtre de port">
              <X className="h-4 w-4"/>
            </button>
          </p>
        )}

        {/* Résultats */}
        {error ? (
          <p className="card mt-10 p-8 text-center text-danger">
            Impossible de charger les plantes. Vérifiez que l&apos;API est démarrée.
          </p>
        ) : isLoading ? (
          <CatalogueSkeleton/>
        ) : plantes.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-display text-xl">Aucune plante trouvée</p>
            <p className="mt-2 text-sm text-muted">Essayez un autre terme ou retirez le filtre de port.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {currentPlantes.map((p, i) => <PlantCard key={p.id} plante={p} priority={i < 4}/>)}
          </div>
        )}

        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage}/>
        </div>

        <p className="mt-12 text-xs text-muted">
          Paramètres de culture : Flowgrow. Hauteur : Tropica, à défaut Flowgrow ; besoin en CO₂ : Tropica, à défaut
          déduit de la concentration conseillée par Flowgrow. Noms français : noms vernaculaires de GBIF et Wikidata.
          Classification et statut UICN : GBIF. Aire d&apos;origine : liste mondiale des
          plantes vasculaires de Kew (WCVP) et observations GBIF. Photos : Wikimedia Commons et iNaturalist, sous
          licence libre, avec leurs auteurs sur chaque fiche.
        </p>
      </section>
    </>
  );
}

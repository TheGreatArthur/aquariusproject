'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import InvertebrateCard from '@/components/invertebrates/InvertebrateCard';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import { GROUPS, matchesInvertebrateSearch } from '@/lib/invertebrates';

const INVERTEBRES_PER_PAGE = 12;

/** En-tête du catalogue, avec le nombre d'espèces affichées une fois la liste chargée */
export function CatalogueHeader ({ count }) {
  return (
    <PageHeader
      eyebrow="Catalogue"
      title="Les invertébrés"
      aside={count != null && (
        <p className="text-sm text-muted">
          <span className="font-display text-2xl font-semibold text-foreground">{count}</span> espèces
        </p>
      )}
    >
      Crevettes, crabes, escargots et écrevisses : recherchez par nom commun, nom scientifique, famille ou comportement.
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
  // Le groupe vient de l'URL, comme la famille du catalogue des poissons
  const groupe = params.get('groupe') ?? '';

  // La liste complète est chargée une fois et filtrée dans le navigateur
  const { data, error, isLoading } = useSWR('/api/invertebres');

  // La page courante ne vaut que pour la recherche en cours : toute nouvelle recherche repart de la page 1
  const recherche = `${groupe}|${terme}`;
  const [pagination, setPagination] = useState({ recherche, page: 1 });
  const currentPage = pagination.recherche === recherche ? pagination.page : 1;

  const setGroupeUrl = (nom) =>
    router.replace(nom ? `${pathname}?groupe=${encodeURIComponent(nom)}` : pathname, { scroll: false });

  const chooseGroupe = (nom) => {
    setTerme('');
    setGroupeUrl(nom);
  };

  // Taper une recherche retire le filtre de groupe, sans effacer le texte saisi
  const onSearch = (value) => {
    setTerme(value);
    if (groupe)
      setGroupeUrl('');
  };

  const changePage = (page) => {
    setPagination({ recherche, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ordre alphabétique français (« Écrevisse » avec les E, pas après les Z comme dans l'ordre de la base)
  const invertebres = useMemo(() => (data?.invertebres ?? [])
    .filter((p) => groupe ? p.groupe === groupe : matchesInvertebrateSearch(p, terme))
    .sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, 'fr', { sensitivity: 'base' })), [data, groupe, terme]);

  // Pagination
  const totalPages = Math.ceil(invertebres.length / INVERTEBRES_PER_PAGE);
  const currentInvertebres = invertebres.slice((currentPage - 1) * INVERTEBRES_PER_PAGE,
    currentPage * INVERTEBRES_PER_PAGE);

  return (
    <>
      <CatalogueHeader count={data ? invertebres.length : null}/>

      <section className="container">
        {/* Filtres */}
        <div className="sticky top-16 z-30 -mx-4 border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
          <label className="relative block">
            <span className="sr-only">Rechercher un invertébré</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>
            <input
              type="search"
              className="input !rounded-full !pl-11"
              placeholder="Amano, Red Cherry, Neritidae, pacifique…"
              value={terme}
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label="Filtrer par groupe">
            <button
              type="button"
              className={clsx('chip shrink-0', !groupe && 'chip-active')}
              onClick={() => chooseGroupe('')}
            >
              Tous
            </button>
            {Object.entries(GROUPS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={clsx('chip shrink-0', groupe === key && 'chip-active')}
                onClick={() => chooseGroupe(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {groupe && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            Groupe : <span className="text-foreground">{GROUPS[groupe] ?? groupe}</span>
            <button type="button" onClick={() => chooseGroupe('')} className="rounded-full p-1 hover:text-foreground"
                    aria-label="Retirer le filtre de groupe">
              <X className="h-4 w-4"/>
            </button>
          </p>
        )}

        {/* Résultats */}
        {error ? (
          <p className="card mt-10 p-8 text-center text-danger">
            Impossible de charger les invertébrés. Vérifiez que l&apos;API est démarrée.
          </p>
        ) : isLoading ? (
          <CatalogueSkeleton/>
        ) : invertebres.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-display text-xl">Aucun invertébré trouvé</p>
            <p className="mt-2 text-sm text-muted">Essayez un autre terme ou retirez le filtre de groupe.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {currentInvertebres.map((p, i) => <InvertebrateCard key={p.id} invertebre={p} priority={i < 4}/>)}
          </div>
        )}

        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage}/>
        </div>
      </section>
    </>
  );
}

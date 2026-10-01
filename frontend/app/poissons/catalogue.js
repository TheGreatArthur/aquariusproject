'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import FishCard from '@/components/fish/FishCard';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import { matchesSearch } from '@/lib/fish';

const POISSONS_PER_PAGE = 12;

/** En-tête du catalogue, avec le nombre d'espèces affichées une fois la liste chargée */
export function CatalogueHeader ({ count }) {
  return (
    <PageHeader
      eyebrow="Catalogue"
      title="Les poissons"
      aside={count != null && (
        <p className="text-sm text-muted">
          <span className="font-display text-2xl font-semibold text-foreground">{count}</span> espèces
        </p>
      )}
    >
      Recherchez par nom commun, nom scientifique, famille, genre ou comportement.
    </PageHeader>
  );
}

/** Grille d'attente, pendant le chargement de la liste */
export function CatalogueSkeleton () {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  // La famille vient de l'URL, ce qui suit aussi les liens /poissons?famille=... (accueil, fiches)
  const famille = params.get('famille') ?? '';

  // La liste complète est chargée une fois (même cache que le simulateur) et filtrée dans le navigateur
  const { data, error, isLoading } = useSWR('/api/poissons');
  const { data: dataFamilles } = useSWR('/api/poissons/familles');

  // La page courante ne vaut que pour la recherche en cours : toute nouvelle recherche repart de la page 1
  const recherche = `${famille}|${terme}`;
  const [pagination, setPagination] = useState({ recherche, page: 1 });
  const currentPage = pagination.recherche === recherche ? pagination.page : 1;

  const setFamilleUrl = (nom) =>
    router.replace(nom ? `${pathname}?famille=${encodeURIComponent(nom)}` : pathname, { scroll: false });

  const chooseFamille = (nom) => {
    setTerme('');
    setFamilleUrl(nom);
  };

  // Taper une recherche retire le filtre de famille, sans effacer le texte saisi
  const onSearch = (value) => {
    setTerme(value);
    if (famille)
      setFamilleUrl('');
  };

  const changePage = (page) => {
    setPagination({ recherche, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const poissons = useMemo(() => (data?.poissons ?? []).filter((p) => famille
    ? p.nom_famille?.toLowerCase() === famille.toLowerCase()
    : matchesSearch(p, terme)), [data, famille, terme]);

  // Pagination
  const totalPages = Math.ceil(poissons.length / POISSONS_PER_PAGE);
  const currentPoissons = poissons.slice((currentPage - 1) * POISSONS_PER_PAGE, currentPage * POISSONS_PER_PAGE);

  return (
    <>
      <CatalogueHeader count={data ? poissons.length : null}/>

      <section className="container">
        {/* Filtres */}
        <div className="sticky top-16 z-30 -mx-4 border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
          <label className="relative block">
            <span className="sr-only">Rechercher un poisson</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>
            <input
              type="search"
              className="input !rounded-full !pl-11"
              placeholder="Néon, Corydoras, Cichlidae, pacifique…"
              value={terme}
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label="Filtrer par famille">
            <button
              type="button"
              className={clsx('chip shrink-0', !famille && 'chip-active')}
              onClick={() => chooseFamille('')}
            >
              Toutes
            </button>
            {dataFamilles?.familles.map((f) => (
              <button
                key={f.id}
                type="button"
                className={clsx('chip shrink-0', famille.toLowerCase() === f.nom.toLowerCase() && 'chip-active')}
                onClick={() => chooseFamille(f.nom)}
              >
                {f.nom}
              </button>
            ))}
          </div>
        </div>

        {famille && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            Famille : <span className="text-foreground">{famille}</span>
            <button type="button" onClick={() => chooseFamille('')} className="rounded-full p-1 hover:text-foreground"
                    aria-label="Retirer le filtre de famille">
              <X className="h-4 w-4"/>
            </button>
          </p>
        )}

        {/* Résultats */}
        {error ? (
          <p className="card mt-10 p-8 text-center text-danger">
            Impossible de charger les poissons. Vérifiez que l&apos;API est démarrée.
          </p>
        ) : isLoading ? (
          <CatalogueSkeleton/>
        ) : poissons.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-display text-xl">Aucun poisson trouvé</p>
            <p className="mt-2 text-sm text-muted">Essayez un autre terme ou retirez le filtre de famille.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentPoissons.map((p, i) => <FishCard key={p.id} poisson={p} priority={i < 4}/>)}
          </div>
        )}

        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage}/>
        </div>
      </section>
    </>
  );
}

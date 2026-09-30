'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import FishCard from '@/components/fish/FishCard';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import { matchesSearch } from '@/lib/fish';

const POISSONS_PER_PAGE = 12;

export default function Poissons () {
  const params = useSearchParams(); // Paramètres d'URL
  const router = useRouter();
  const pathname = usePathname();

  const [terme, setTerme] = useState('');
  const [famille, setFamille] = useState(() => params.get('famille') ?? '');
  const [currentPage, setCurrentPage] = useState(1);

  // Suit les liens externes vers /poissons?famille=... (accueil, fiches)
  useEffect(() => {
    setFamille(params.get('famille') ?? '');
  }, [params]);

  // La liste complète est chargée une fois (même cache que le simulateur) et filtrée dans le navigateur
  const { data, error, isLoading } = useSWR('/api/poissons');
  const { data: dataFamilles } = useSWR('/api/poissons/familles');

  // Réinitialise la pagination à chaque recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [terme, famille]);

  const chooseFamille = (nom) => {
    setFamille(nom);
    setTerme('');
    router.replace(nom ? `${pathname}?famille=${encodeURIComponent(nom)}` : pathname, { scroll: false });
  };

  const onSearch = (value) => {
    setTerme(value);
    if (famille)
      chooseFamille('');
  };

  const changePage = (page) => {
    setCurrentPage(page);
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
      <PageHeader
        eyebrow="Catalogue"
        title="Les poissons"
        aside={data && (
          <p className="text-sm text-muted">
            <span className="font-display text-2xl font-semibold text-foreground">{poissons.length}</span> espèces
          </p>
        )}
      >
        Recherchez par nom commun, nom scientifique, famille, genre ou comportement.
      </PageHeader>

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
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="card aspect-[3/4] animate-pulse bg-surface-elevated/60"/>
            ))}
          </div>
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

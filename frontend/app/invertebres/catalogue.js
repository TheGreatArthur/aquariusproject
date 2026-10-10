'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import InvertebrateCard from '@/components/invertebrates/InvertebrateCard';
import { useI18n } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import { splitLocale } from '@/lib/i18n';
import { GROUPS, GROUPS_EN, matchesInvertebrateSearch } from '@/lib/invertebrates';

const INVERTEBRES_PER_PAGE = 12;

/** En-tête du catalogue, avec le nombre d'espèces affichées une fois la liste chargée */
export function CatalogueHeader ({ count }) {
  const { t } = useI18n();
  return (
    <PageHeader
      eyebrow={t('Catalogue', 'Catalogue')}
      title={t('Les invertébrés', 'Invertebrates')}
      aside={count != null && (
        <p className="text-sm text-muted">
          <span className="font-display text-2xl font-semibold text-foreground">{count}</span> {t('espèces', 'species')}
        </p>
      )}
    >
      {t('Crevettes, crabes, escargots et écrevisses : recherchez par nom commun, nom scientifique, famille ou comportement.',
        'Shrimp, crabs, snails and crayfish: search by common name, scientific name, family or behaviour.')}
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
  const { t, href, locale } = useI18n();
  const { path } = splitLocale(usePathname());

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
    router.replace(href(nom ? `${path}?groupe=${encodeURIComponent(nom)}` : path), { scroll: false });

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

  // Ordre alphabétique (« Écrevisse » avec les E, pas après les Z comme dans l'ordre de la base)
  const invertebres = useMemo(() => (data?.invertebres ?? [])
    .filter((p) => groupe ? p.groupe === groupe : matchesInvertebrateSearch(p, terme))
    .sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, locale, { sensitivity: 'base' })), [data, groupe, terme, locale]);

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
            <span className="sr-only">{t('Rechercher un invertébré', 'Search for an invertebrate')}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>
            <input
              type="search"
              className="input !rounded-full !pl-11"
              placeholder={t('Amano, Red Cherry, Neritidae, pacifique…', 'Amano, Red Cherry, Neritidae, snail…')}
              value={terme}
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label={t('Filtrer par groupe', 'Filter by group')}>
            <button
              type="button"
              className={clsx('chip shrink-0', !groupe && 'chip-active')}
              onClick={() => chooseGroupe('')}
            >
              {t('Tous', 'All')}
            </button>
            {Object.entries(GROUPS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={clsx('chip shrink-0', groupe === key && 'chip-active')}
                onClick={() => chooseGroupe(key)}
              >
                {t(label, GROUPS_EN[key])}
              </button>
            ))}
          </div>
        </div>

        {groupe && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            {t('Groupe :', 'Group:')} <span className="text-foreground">{t(GROUPS[groupe], GROUPS_EN[groupe]) ?? groupe}</span>
            <button type="button" onClick={() => chooseGroupe('')} className="rounded-full p-1 hover:text-foreground"
                    aria-label={t('Retirer le filtre de groupe', 'Remove the group filter')}>
              <X className="h-4 w-4"/>
            </button>
          </p>
        )}

        {/* Résultats */}
        {error ? (
          <p className="card mt-10 p-8 text-center text-danger">
            {t('Impossible de charger les invertébrés. Vérifiez que l\'API est démarrée.', 'Could not load the invertebrates. Check that the API is running.')}
          </p>
        ) : isLoading ? (
          <CatalogueSkeleton/>
        ) : invertebres.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-display text-xl">{t('Aucun invertébré trouvé', 'No invertebrate found')}</p>
            <p className="mt-2 text-sm text-muted">
              {t('Essayez un autre terme ou retirez le filtre de groupe.', 'Try another term or remove the group filter.')}
            </p>
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

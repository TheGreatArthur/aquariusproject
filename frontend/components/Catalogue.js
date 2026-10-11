'use client';

import { Suspense, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import { splitLocale } from '@/lib/i18n';

const PER_PAGE = 12;

/**
 * Catalogue d'espèces (poissons, invertébrés, plantes) : recherche, filtre lu dans l'URL, pagination.
 * Les textes sont des triplets [fr, en, ja] ; `config` décrit le catalogue (voir app/<catalogue>/catalogue.js).
 */
export default function Catalogue (config) {
  return (
    // Le filtre est lu dans l'URL : la page statique affiche l'en-tête et la grille d'attente
    <Suspense fallback={<><CatalogueHeader texts={config.texts}/><section className="container"><Skeleton/></section></>}>
      <CatalogueContent {...config}/>
    </Suspense>
  );
}

function CatalogueHeader ({ texts, count }) {
  const { t } = useI18n();
  return (
    <PageHeader
      eyebrow={t('Catalogue', 'Catalogue', '図鑑')}
      title={t(...texts.title)}
      aside={count != null && (
        <p className="text-sm text-muted">
          <span className="font-display text-2xl font-semibold text-foreground">{count}</span> {t(...texts.unit)}
        </p>
      )}
    >
      {t(...texts.intro)}
    </PageHeader>
  );
}

function Skeleton () {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="card aspect-[3/4] animate-pulse bg-surface-elevated/60"/>
      ))}
    </div>
  );
}

function CatalogueContent ({ api: endpoint, liste, param, filterKey, options, label, matches, sort, Card, texts, children }) {
  const params = useSearchParams();
  const router = useRouter();
  const i18n = useI18n();
  const { t, href, locale, api } = i18n;
  // Le chemin sans /en : href() remet la langue de la page
  const { path } = splitLocale(usePathname());

  const [terme, setTerme] = useState('');
  // Le filtre vient de l'URL, ce qui suit aussi les liens /poissons?famille=... (accueil, fiches)
  const filtre = params.get(param) ?? '';

  // La liste complète est chargée une fois (même cache que le simulateur) et filtrée dans le navigateur
  const { data, error, isLoading } = useSWR(api(endpoint));
  const items = useMemo(() => data?.[liste] ?? [], [data, liste]);
  const choix = useMemo(() => options(items, i18n), [items, options, i18n]);

  // La page courante ne vaut que pour la recherche en cours : toute nouvelle recherche repart de la page 1
  const recherche = `${filtre}|${terme}`;
  const [pagination, setPagination] = useState({ recherche, page: 1 });
  const currentPage = pagination.recherche === recherche ? pagination.page : 1;

  const setFiltreUrl = (value) =>
    router.replace(href(value ? `${path}?${param}=${encodeURIComponent(value)}` : path), { scroll: false });

  const choose = (value) => {
    setTerme('');
    setFiltreUrl(value);
  };

  // Taper une recherche retire le filtre, sans effacer le texte saisi
  const onSearch = (value) => {
    setTerme(value);
    if (filtre)
      setFiltreUrl('');
  };

  const changePage = (page) => {
    setPagination({ recherche, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resultats = useMemo(() => {
    const found = items.filter((p) => filtre
      ? p[filterKey]?.toLowerCase() === filtre.toLowerCase()
      : matches(p, terme));
    // Ordre alphabétique (« Écrevisse » avec les E, pas après les Z comme dans l'ordre de la base)
    return sort ? found.sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, locale, { sensitivity: 'base' })) : found;
  }, [items, filtre, filterKey, matches, terme, sort, locale]);

  const totalPages = Math.ceil(resultats.length / PER_PAGE);
  const page = resultats.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  // Valeur du filtre telle que la liste l'écrit (l'URL peut différer par la casse)
  const actif = choix.find((v) => v.toLowerCase() === filtre.toLowerCase()) ?? filtre;

  return (
    <>
      <CatalogueHeader texts={texts} count={data ? resultats.length : null}/>

      <section className="container">
        {/* Filtres */}
        <div className="sticky top-16 z-30 -mx-4 border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
          <label className="relative block">
            <span className="sr-only">{t(...texts.search)}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>
            <input
              type="search"
              className="input !rounded-full !pl-11"
              placeholder={t(...texts.placeholder)}
              value={terme}
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label={t(...texts.filter)}>
            <button type="button" className={clsx('chip shrink-0', !filtre && 'chip-active')} onClick={() => choose('')}>
              {t(...texts.all)}
            </button>
            {choix.map((v) => (
              <button key={v} type="button" className={clsx('chip shrink-0', actif === v && 'chip-active')}
                      onClick={() => choose(v)}>
                {label(v, i18n)}
              </button>
            ))}
          </div>
        </div>

        {filtre && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            {t(...texts.current)} <span className="text-foreground">{label(actif, i18n) ?? actif}</span>
            <button type="button" onClick={() => choose('')} className="rounded-full p-1 hover:text-foreground"
                    aria-label={t(...texts.remove)}>
              <X className="h-4 w-4"/>
            </button>
          </p>
        )}

        {/* Résultats */}
        {error ? (
          <p className="card mt-10 p-8 text-center text-danger">{t(...texts.error)}</p>
        ) : isLoading ? (
          <Skeleton/>
        ) : resultats.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-display text-xl">{t(...texts.empty)}</p>
            <p className="mt-2 text-sm text-muted">{t(...texts.emptyHint)}</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {page.map((p, i) => <Card key={p.id} item={p} priority={i < 4}/>)}
          </div>
        )}

        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage}/>
        </div>

        {children}
      </section>
    </>
  );
}

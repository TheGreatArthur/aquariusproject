'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import PlantCard from '@/components/plants/PlantCard';
import { splitLocale } from '@/lib/i18n';
import { matchesPlantSearch, TYPES, typesPresents } from '@/lib/plants';

const PLANTES_PER_PAGE = 12;

/** En-tête du catalogue, avec le nombre de plantes affichées une fois la liste chargée */
export function CatalogueHeader ({ count }) {
  const { t } = useI18n();
  return (
    <PageHeader
      eyebrow={t('Catalogue', 'Catalogue')}
      title={t('Les plantes', 'Plants')}
      aside={count != null && (
        <p className="text-sm text-muted">
          <span className="font-display text-2xl font-semibold text-foreground">{count}</span> {t('références', 'entries')}
        </p>
      )}
    >
      {t('Espèces, formes et cultivars d\'aquarium : recherchez par nom, famille ou port, puis découvrez leur aire '
        + 'd\'origine sur chaque fiche.', 'Aquarium species, forms and cultivars: search by name, family or growth form, '
        + 'then see where they come from on each profile.')}
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
  // Le port vient de l'URL, ce qui suit aussi les liens /plantes?type=... des fiches
  const type = params.get('type') ?? '';

  // La liste complète est chargée une fois et filtrée dans le navigateur
  const { data, error, isLoading } = useSWR('/api/plantes');

  // La page courante ne vaut que pour la recherche en cours : toute nouvelle recherche repart de la page 1
  const recherche = `${type}|${terme}`;
  const [pagination, setPagination] = useState({ recherche, page: 1 });
  const currentPage = pagination.recherche === recherche ? pagination.page : 1;

  const setTypeUrl = (nom) =>
    router.replace(href(nom ? `${path}?type=${encodeURIComponent(nom)}` : path), { scroll: false });

  const chooseType = (nom) => {
    setTerme('');
    setTypeUrl(nom);
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

  // Ordre alphabétique (« Égérie » avec les E, pas après les Z comme dans l'ordre de la base)
  const plantes = useMemo(() => (data?.plantes ?? [])
    .filter((p) => type ? p.type === type : matchesPlantSearch(p, terme))
    .sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, locale, { sensitivity: 'base' })), [data, type, terme, locale]);
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
            <span className="sr-only">{t('Rechercher une plante', 'Search for a plant')}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>
            <input
              type="search"
              className="input !rounded-full !pl-11"
              placeholder={t('Anubias, mousse, Araceae, tige…', 'Anubias, moss, Araceae, stem…')}
              value={terme}
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]" role="group" aria-label={t('Filtrer par port', 'Filter by growth form')}>
            <button
              type="button"
              className={clsx('chip shrink-0', !type && 'chip-active')}
              onClick={() => chooseType('')}
            >
              {t('Toutes', 'All')}
            </button>
            {types.map((key) => (
              <button
                key={key}
                type="button"
                className={clsx('chip shrink-0', type === key && 'chip-active')}
                onClick={() => chooseType(key)}
              >
                {t(TYPES[key].filtre, TYPES[key].filter)}
              </button>
            ))}
          </div>
        </div>

        {type && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            {t('Port :', 'Growth form:')} <span className="text-foreground">{t(TYPES[type]?.filtre, TYPES[type]?.filter) ?? type}</span>
            <button type="button" onClick={() => chooseType('')} className="rounded-full p-1 hover:text-foreground"
                    aria-label={t('Retirer le filtre de port', 'Remove the growth form filter')}>
              <X className="h-4 w-4"/>
            </button>
          </p>
        )}

        {/* Résultats */}
        {error ? (
          <p className="card mt-10 p-8 text-center text-danger">
            {t('Impossible de charger les plantes. Vérifiez que l\'API est démarrée.', 'Could not load the plants. Check that the API is running.')}
          </p>
        ) : isLoading ? (
          <CatalogueSkeleton/>
        ) : plantes.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <p className="font-display text-xl">{t('Aucune plante trouvée', 'No plant found')}</p>
            <p className="mt-2 text-sm text-muted">
              {t('Essayez un autre terme ou retirez le filtre de port.', 'Try another term or remove the growth form filter.')}
            </p>
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
          {t('Paramètres de culture : Flowgrow. Hauteur : Tropica, à défaut Flowgrow ; besoin en CO₂ : Tropica, à défaut '
            + 'déduit de la concentration conseillée par Flowgrow. Noms français : noms vernaculaires de GBIF et Wikidata. '
            + 'Classification et statut UICN : GBIF. Aire d\'origine : liste mondiale des plantes vasculaires de Kew (WCVP) '
            + 'et observations GBIF. Photos : Wikimedia Commons et iNaturalist, sous licence libre, avec leurs auteurs '
            + 'sur chaque fiche.',
          'Growing parameters: Flowgrow. Height: Tropica, else Flowgrow; CO₂ needs: Tropica, else derived from the '
            + 'concentration Flowgrow recommends. French names: GBIF and Wikidata vernacular names. Classification and '
            + 'IUCN status: GBIF. Native range: Kew World Checklist of Vascular Plants (WCVP) and GBIF observations. '
            + 'Photos: Wikimedia Commons and iNaturalist, under free licences, credited on each profile.')}
        </p>
      </section>
    </>
  );
}

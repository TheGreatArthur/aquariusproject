import { Suspense } from 'react';

import Catalogue, { CatalogueHeader, CatalogueSkeleton } from './catalogue';

// Le catalogue lit le filtre de famille dans l'URL : la page statique affiche l'en-tête et la grille d'attente
export default function PoissonsPage () {
  return (
    <Suspense fallback={<><CatalogueHeader/><section className="container"><CatalogueSkeleton/></section></>}>
      <Catalogue/>
    </Suspense>
  );
}

import { Suspense } from 'react';

import Catalogue, { CatalogueHeader, CatalogueSkeleton } from './catalogue';

// Le catalogue lit le filtre de groupe dans l'URL : la page statique affiche l'en-tête et la grille d'attente
export default function InvertebresPage () {
  return (
    <Suspense fallback={<><CatalogueHeader/><section className="container"><CatalogueSkeleton/></section></>}>
      <Catalogue/>
    </Suspense>
  );
}

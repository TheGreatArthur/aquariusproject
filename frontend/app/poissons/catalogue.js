'use client';

import Catalogue from '@/components/Catalogue';
import FishCard from '@/components/fish/FishCard';
import { matchesSearch } from '@/lib/fish';

const TEXTS = {
  title: ['Les poissons', 'Fish', '魚'],
  unit: ['espèces', 'species', '種'],
  intro: ['Recherchez par nom commun, nom scientifique, famille, genre ou comportement.',
    'Search by common name, scientific name, family, genus or behaviour.', '和名、学名、科、属、性格で検索できます。'],
  search: ['Rechercher un poisson', 'Search for a fish', '魚を検索'],
  placeholder: ['Néon, Corydoras, Cichlidae, pacifique…', 'Neon, Corydoras, Cichlidae, Betta…',
    'ネオンテトラ、コリドラス、カラシン科、ベタ…'],
  filter: ['Filtrer par famille', 'Filter by family', '科で絞り込む'],
  all: ['Toutes', 'All', 'すべて'],
  current: ['Famille :', 'Family:', '科：'],
  remove: ['Retirer le filtre de famille', 'Remove the family filter', '科の絞り込みを解除'],
  error: ['Impossible de charger les poissons. Vérifiez que l\'API est démarrée.',
    'Could not load the fish. Check that the API is running.', '魚を読み込めませんでした。API が起動しているか確認してください。'],
  empty: ['Aucun poisson trouvé', 'No fish found', '該当する魚はいません'],
  emptyHint: ['Essayez un autre terme ou retirez le filtre de famille.', 'Try another term or remove the family filter.',
    '別の言葉で検索するか、科の絞り込みを解除してください。'],
};

// Familles présentes dans la liste, dans l'ordre alphabétique de leur nom affiché
const familles = (poissons, { term, locale }) => [...new Set(poissons.map((p) => p.nom_famille).filter(Boolean))]
  .sort((a, b) => term(a).localeCompare(term(b), locale));
const nomFamille = (nom, { term }) => term(nom);
const Card = ({ item, priority }) => <FishCard poisson={item} priority={priority}/>;

export default function PoissonsCatalogue () {
  return (
    <Catalogue api="/api/poissons" liste="poissons" param="famille" filterKey="nom_famille"
               options={familles} label={nomFamille} matches={matchesSearch} Card={Card} texts={TEXTS}/>
  );
}

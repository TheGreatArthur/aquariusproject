'use client';

import Catalogue from '@/components/Catalogue';
import InvertebrateCard from '@/components/invertebrates/InvertebrateCard';
import { GROUPS, GROUPS_EN, GROUPS_JA, matchesInvertebrateSearch } from '@/lib/invertebrates';

const TEXTS = {
  title: ['Les invertébrés', 'Invertebrates', '無脊椎動物'],
  unit: ['espèces', 'species', '種'],
  intro: ['Crevettes, crabes, escargots et écrevisses : recherchez par nom commun, nom scientifique, famille ou comportement.',
    'Shrimp, crabs, snails and crayfish: search by common name, scientific name, family or behaviour.',
    'エビ、カニ、貝、ザリガニ：和名、学名、科、性格で検索できます。'],
  search: ['Rechercher un invertébré', 'Search for an invertebrate', '無脊椎動物を検索'],
  placeholder: ['Amano, Red Cherry, Neritidae, pacifique…', 'Amano, Red Cherry, Neritidae, snail…',
    'ヤマトヌマエビ、レッドチェリー、アマオブネガイ科、貝…'],
  filter: ['Filtrer par groupe', 'Filter by group', 'グループで絞り込む'],
  all: ['Tous', 'All', 'すべて'],
  current: ['Groupe :', 'Group:', 'グループ：'],
  remove: ['Retirer le filtre de groupe', 'Remove the group filter', 'グループの絞り込みを解除'],
  error: ['Impossible de charger les invertébrés. Vérifiez que l\'API est démarrée.',
    'Could not load the invertebrates. Check that the API is running.', '無脊椎動物を読み込めませんでした。API が起動しているか確認してください。'],
  empty: ['Aucun invertébré trouvé', 'No invertebrate found', '該当する無脊椎動物はありません'],
  emptyHint: ['Essayez un autre terme ou retirez le filtre de groupe.', 'Try another term or remove the group filter.',
    '別の言葉で検索するか、グループの絞り込みを解除してください。'],
};

const groupes = () => Object.keys(GROUPS);
const nomGroupe = (key, { t }) => t(GROUPS[key], GROUPS_EN[key], GROUPS_JA[key]);
const Card = ({ item, priority }) => <InvertebrateCard invertebre={item} priority={priority}/>;

export default function InvertebresCatalogue () {
  return (
    <Catalogue api="/api/invertebres" liste="invertebres" param="groupe" filterKey="groupe" sort
               options={groupes} label={nomGroupe} matches={matchesInvertebrateSearch} Card={Card} texts={TEXTS}/>
  );
}

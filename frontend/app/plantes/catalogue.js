'use client';

import Catalogue from '@/components/Catalogue';
import { useI18n } from '@/components/I18nProvider';
import PlantCard from '@/components/plants/PlantCard';
import { matchesPlantSearch, TYPES, typesPresents } from '@/lib/plants';

const TEXTS = {
  title: ['Les plantes', 'Plants', '水草'],
  unit: ['références', 'entries', '件'],
  intro: ['Espèces, formes et cultivars d\'aquarium : recherchez par nom, famille ou port, puis découvrez leur aire '
    + 'd\'origine sur chaque fiche.', 'Aquarium species, forms and cultivars: search by name, family or growth form, '
    + 'then see where they come from on each profile.', '水草の種、品種、園芸品種：名前、科、草姿で検索し、各ページで原産地を確認できます。'],
  search: ['Rechercher une plante', 'Search for a plant', '水草を検索'],
  placeholder: ['Anubias, mousse, Araceae, tige…', 'Anubias, moss, Araceae, stem…', 'アヌビアス、コケ、サトイモ科、有茎草…'],
  filter: ['Filtrer par port', 'Filter by growth form', '草姿で絞り込む'],
  all: ['Toutes', 'All', 'すべて'],
  current: ['Port :', 'Growth form:', '草姿：'],
  remove: ['Retirer le filtre de port', 'Remove the growth form filter', '草姿の絞り込みを解除'],
  error: ['Impossible de charger les plantes. Vérifiez que l\'API est démarrée.',
    'Could not load the plants. Check that the API is running.', '水草を読み込めませんでした。API が起動しているか確認してください。'],
  empty: ['Aucune plante trouvée', 'No plant found', '該当する水草はありません'],
  emptyHint: ['Essayez un autre terme ou retirez le filtre de port.', 'Try another term or remove the growth form filter.',
    '別の言葉で検索するか、草姿の絞り込みを解除してください。'],
};

const nomType = (key, { t }) => t(TYPES[key]?.filtre, TYPES[key]?.filter, TYPES[key]?.filterJa);
const Card = ({ item, priority }) => <PlantCard plante={item} priority={priority}/>;

export default function PlantesCatalogue () {
  const { t } = useI18n();
  return (
    <Catalogue api="/api/plantes" liste="plantes" param="type" filterKey="type" sort
               options={typesPresents} label={nomType} matches={matchesPlantSearch} Card={Card} texts={TEXTS}>
      <p className="mt-12 text-xs text-muted">
        {t('Paramètres de culture : Flowgrow. Hauteur : Tropica, à défaut Flowgrow ; besoin en CO₂ : Tropica, à défaut '
          + 'déduit de la concentration conseillée par Flowgrow. Noms français : noms vernaculaires de GBIF et Wikidata. '
          + 'Classification et statut UICN : GBIF. Aire d\'origine : liste mondiale des plantes vasculaires de Kew (WCVP) '
          + 'et observations GBIF. Photos : Wikimedia Commons et iNaturalist, sous licence libre, avec leurs auteurs '
          + 'sur chaque fiche.',
        'Growing parameters: Flowgrow. Height: Tropica, else Flowgrow; CO₂ needs: Tropica, else derived from the '
          + 'concentration Flowgrow recommends. French names: GBIF and Wikidata vernacular names. Classification and '
          + 'IUCN status: GBIF. Native range: Kew World Checklist of Vascular Plants (WCVP) and GBIF observations. '
          + 'Photos: Wikimedia Commons and iNaturalist, under free licences, credited on each profile.',
        '育成データ：Flowgrow。草丈：Tropica、なければ Flowgrow。CO₂ の必要量：Tropica、なければ Flowgrow の推奨濃度から算出。'
          + 'フランス語名：GBIF と Wikidata の通称。分類と IUCN のステータス：GBIF。原産地：キュー王立植物園の世界維管束植物チェックリスト（WCVP）'
          + 'と GBIF の観察記録。写真：Wikimedia Commons と iNaturalist の自由ライセンス写真（各ページに撮影者を記載）。')}
      </p>
    </Catalogue>
  );
}

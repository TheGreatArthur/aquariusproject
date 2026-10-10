import { getI18n } from '@/lib/i18n-server';

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    title: t('Simulateur', 'Simulator', 'シミュレーター'),
    description: t('Indiquez le volume et l\'eau de votre bac, ajoutez poissons, plantes et invertébrés : le simulateur '
      + 'vérifie leur cohabitation et la charge du bac.', 'Enter the volume and water of your tank, add fish, plants and '
      + 'invertebrates: the simulator checks that they get along and how heavily the tank is stocked.', '水槽の容量と水質を入力し、魚、水草、無脊椎動物を追加すると、シミュレーターが相性と'
      + '飼育密度をチェックします。'),
  };
}

export default function SimulationLayout ({ children }) {
  return children;
}

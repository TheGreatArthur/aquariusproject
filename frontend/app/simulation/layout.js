import { getI18n } from '@/lib/i18n-server';

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    title: t('Simulateur', 'Simulator'),
    description: t('Indiquez le volume et l\'eau de votre bac, ajoutez poissons, plantes et invertébrés : le simulateur '
      + 'vérifie leur cohabitation et la charge du bac.', 'Enter the volume and water of your tank, add fish, plants and '
      + 'invertebrates: the simulator checks that they get along and how heavily the tank is stocked.'),
  };
}

export default function SimulationLayout ({ children }) {
  return children;
}

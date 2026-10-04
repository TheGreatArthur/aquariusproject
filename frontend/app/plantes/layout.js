export const metadata = {
  // Le gabarit est repris ici pour que les fiches des sous-pages gardent le suffixe « · Aquarius »
  title: { default: 'Les plantes', template: '%s · Aquarius' },
  description: 'Plantes d\'aquarium : pH, KH, température, lumière, hauteur et entretien de chaque espèce, '
    + 'avec des photos sous licence libre.',
};

export default function PlantesLayout ({ children }) {
  return children;
}

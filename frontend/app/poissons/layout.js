export const metadata = {
  // Le gabarit est repris ici pour que les fiches des sous-pages gardent le suffixe « · Aquarius »
  title: { default: 'Les poissons', template: '%s · Aquarius' },
  description: 'Catalogue des poissons d\'eau douce : taille, volume minimum, paramètres d\'eau et comportement '
    + 'de chaque espèce.',
};

export default function PoissonsLayout ({ children }) {
  return children;
}

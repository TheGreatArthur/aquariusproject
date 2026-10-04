import { describe, expect, it } from 'vitest';

import { formatValue, invertebrateImage, matchesInvertebrateSearch, nonLivingViews } from '@/lib/invertebrates';
import { NAV_LINKS } from '@/lib/navigation';

// Forme renvoyée par GET /invertebres, comme la liste des poissons
const amano = {
  id: 6, nom_commun: 'Crevette Amano', nom_scientifique: 'Caridina multidentata', variete: null, groupe: 'crevette',
  famille: 'Atyidae', comportement: 'pacifique', image: 'caridina-multidentata-1.jpg',
};
const crayfish = { ...amano, nom_commun: 'Écrevisse bleue', nom_scientifique: 'Procambarus alleni', groupe: 'écrevisse',
  famille: 'Cambaridae', comportement: 'moyennement agressif' };

describe('invertebrate catalogue', () => {
  it('finds common names, scientific names, families and groups without accents', () => {
    expect(matchesInvertebrateSearch(amano, 'amano crevette')).toBe(true);
    expect(matchesInvertebrateSearch(amano, 'caridina multidentata')).toBe(true);
    expect(matchesInvertebrateSearch(amano, 'atyidae pacifique')).toBe(true);
    expect(matchesInvertebrateSearch(amano, 'ecrevisse')).toBe(false);
    expect(matchesInvertebrateSearch(crayfish, 'ecrevisses')).toBe(true);
  });

  it('serves the main photo from the list and the detail', () => {
    expect(invertebrateImage(amano)).toBe('/invertebrates/caridina-multidentata-1.jpg');
    expect(invertebrateImage({ images: ['clea-helena-1.jpg'] })).toBe('/invertebrates/clea-helena-1.jpg');
  });

  it('flags galleries that also show empty shells or museum specimens', () => {
    expect(nonLivingViews([{ vue: 'animal' }, { vue: 'animal' }])).toBe(false);
    expect(nonLivingViews([{ vue: 'animal' }, { vue: 'coquille' }])).toBe(true);
  });

  it('keeps values missing from the sources unknown instead of zero', () => {
    expect(formatValue(null, 'cm')).toBe('Non renseigné');
    expect(formatValue(5.5, 'cm')).toBe('5,5 cm');
  });

  it('places the navbar link between fish and plants', () => {
    expect(NAV_LINKS.slice(0, 3).map((link) => link.href)).toEqual(['/poissons', '/invertebres', '/plantes']);
  });
});

import { describe, expect, it } from 'vitest';

import {
  difficultyTone, formatRange, lightLabel, matchesPlantSearch, plantImage, plantProfil, rangeFromKew, typesPresents,
} from '@/lib/plants';

const fougere = {
  nom_commun: 'Fougère de Java',
  nom_scientifique: 'Microsorum pteropus',
  famille: 'Polypodiaceae',
  type: 'épiphyte',
  image: { fichier: 'microsorum-pteropus-1.jpg' },
};

describe('plantImage', () => {
  it('uses the main photo of the list or of the details', () => {
    expect(plantImage(fougere)).toBe('/plants/microsorum-pteropus-1.jpg');
    expect(plantImage({ images: [{ fichier: 'a-1.jpg' }, { fichier: 'a-2.jpg' }] })).toBe('/plants/a-1.jpg');
  });
});

describe('formatRange', () => {
  it('writes French decimals and a non-breaking space before the unit', () => {
    expect(formatRange(4.5, 8)).toBe('4,5–8');
    expect(formatRange(5, 15, 'cm')).toBe('5–15 cm');
  });

  it('writes a single value when both bounds are equal', () => {
    expect(formatRange(6, 6, '°C')).toBe('6 °C');
  });

  it('returns null without a value', () => {
    expect(formatRange(null, null, 'cm')).toBeNull();
    expect(formatRange(5, undefined)).toBeNull();
  });
});

describe('lightLabel', () => {
  it('joins two levels and keeps a single one', () => {
    expect(lightLabel('faible', 'forte')).toBe('faible à forte');
    expect(lightLabel('moyenne', 'moyenne')).toBe('moyenne');
  });
});

describe('difficultyTone', () => {
  it('maps the difficulty to a badge tone', () => {
    expect(difficultyTone('très facile')).toBe('calm');
    expect(difficultyTone('facile')).toBe('calm');
    expect(difficultyTone('moyenne')).toBe('warn');
    expect(difficultyTone('difficile')).toBe('danger');
  });
});

describe('matchesPlantSearch', () => {
  it('searches names, family and plant type without accents', () => {
    expect(matchesPlantSearch(fougere, 'fougere')).toBe(true);
    expect(matchesPlantSearch(fougere, 'PTEROPUS')).toBe(true);
    expect(matchesPlantSearch(fougere, 'polypod')).toBe(true);
    expect(matchesPlantSearch(fougere, 'epiphyte')).toBe(true);
  });

  it('requires every word', () => {
    expect(matchesPlantSearch(fougere, 'java fougère')).toBe(true);
    expect(matchesPlantSearch(fougere, 'java mousse')).toBe(false);
  });

  it('matches everything without a search', () => {
    expect(matchesPlantSearch(fougere, '  ')).toBe(true);
  });
});

describe('typesPresents', () => {
  it('lists the types of the plants in the filter order', () => {
    const plantes = [{ type: 'tige' }, { type: 'épiphyte' }, { type: 'tige' }, { type: 'mousse' }];

    expect(typesPresents(plantes)).toEqual(['épiphyte', 'mousse', 'tige']);
  });
});

describe('plantProfil', () => {
  const plante = {
    ...fougere,
    nom_valide: null,
    auteur: '(Blume) Copel.',
    ordre: 'Polypodiales',
    uicn: 'LC',
    origine: 'Asie du Sud-Est : rochers des ruisseaux',
    presentation: 'Une fougère ; elle pousse sur le bois.',
    pays: ['THA', 'VNM'],
    introduits: [],
    points: [[100.5, 13.7]],
    sources: [{ nom: 'POWO (Kew)', url: 'https://powo.science.kew.org/taxon/x' }],
  };

  it('gives a plant the fields of a fish profile', () => {
    const profil = plantProfil(plante);

    expect(profil.classification).toBe('Polypodiales › Polypodiaceae');
    expect(profil.repartition).toBe('Asie du Sud-Est\u00a0: rochers des ruisseaux');
    expect(profil.presentation).toBe('Une fougère\u00a0; elle pousse sur le bois.');
    expect([profil.pays, profil.introduits, profil.points, profil.uicn])
      .toEqual([['THA', 'VNM'], [], [[100.5, 13.7]], 'LC']);
  });

  it('keeps the GBIF author only with the name used in aquaria', () => {
    expect(plantProfil(plante).auteur).toBe('(Blume) Copel.');
    // L'auteur relevé est celui du nom d'usage, pas celui du nom valide
    expect(plantProfil({ ...plante, nom_valide: 'Leptochilus pteropus' }).auteur).toBeNull();
  });

  it('has an empty map without range data', () => {
    const profil = plantProfil({ ...plante, pays: undefined, introduits: undefined, points: undefined });

    expect([profil.pays, profil.introduits, profil.points]).toEqual([[], [], []]);
  });

  it('knows whether the countries come from Kew or from GBIF observations (mosses)', () => {
    expect(rangeFromKew(plante)).toBe(true);
    expect(rangeFromKew({ ...plante, sources: [{ nom: 'GBIF', url: 'https://www.gbif.org/species/1' }] })).toBe(false);
  });
});

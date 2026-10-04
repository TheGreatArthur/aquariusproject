import { describe, expect, it } from 'vitest';

import {
  difficultyTone, formatRange, lightLabel, matchesPlantSearch, plantImage, typesPresents,
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

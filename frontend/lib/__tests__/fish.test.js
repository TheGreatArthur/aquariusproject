import { describe, expect, it } from 'vitest';

import { matchesSearch, searchKey } from '@/lib/fish';

const pleco = {
  nom_commun: 'Pléco zèbre',
  nom_scientifique: 'Hypancistrus zebra',
  nom_famille: 'Loricariidae',
  nom_genre: 'Hypancistrus',
  nom_comportement: 'territorial',
};

describe('searchKey', () => {
  it('drops accents and case', () => {
    expect(searchKey('Néon Épineux')).toBe('neon epineux');
  });
});

describe('matchesSearch', () => {
  it('ignores accents in both directions', () => {
    expect(matchesSearch(pleco, 'pleco')).toBe(true);
    expect(matchesSearch(pleco, 'ZEBRE')).toBe(true);
    expect(matchesSearch({ nom_commun: 'Pleco' }, 'pléco')).toBe(true);
  });

  it('matches inside a name, not only at the start', () => {
    expect(matchesSearch(pleco, 'zebra')).toBe(true);
    expect(matchesSearch(pleco, 'ricariid')).toBe(true);
  });

  it('requires every word, across fields', () => {
    expect(matchesSearch(pleco, 'pleco territorial')).toBe(true);
    expect(matchesSearch(pleco, 'pleco pacifique')).toBe(false);
  });

  it('keeps every fish for an empty search', () => {
    expect(matchesSearch(pleco, '   ')).toBe(true);
  });

  it('treats SQL wildcards as plain text', () => {
    expect(matchesSearch(pleco, '%')).toBe(false);
  });
});

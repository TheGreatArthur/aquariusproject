import { describe, expect, it } from 'vitest';

import { evaluate } from '@/lib/compat';
import { cardinalis, channa, danioRerio } from '@/lib/compat/__tests__/fixtures';
import { term } from '@/lib/glossary';
import { localize, splitLocale, translator } from '@/lib/i18n';

describe('locale routing', () => {
  it('reads the language from the /en prefix', () => {
    expect(splitLocale('/en/poissons/3')).toEqual({ locale: 'en', path: '/poissons/3' });
    expect(splitLocale('/en')).toEqual({ locale: 'en', path: '/' });
    expect(splitLocale('/poissons')).toEqual({ locale: 'fr', path: '/poissons' });
    expect(splitLocale('/entretien')).toEqual({ locale: 'fr', path: '/entretien' });
  });

  it('prefixes internal links in English only', () => {
    expect(localize('/poissons?famille=Characidae', 'en')).toBe('/en/poissons?famille=Characidae');
    expect(localize('/', 'en')).toBe('/en');
    expect(localize('/poissons', 'fr')).toBe('/poissons');
    expect(localize('/api/poissons', 'en')).toBe('/api/poissons');
    expect(localize('https://www.feow.org', 'en')).toBe('https://www.feow.org');
    expect(localize('/en/plantes', 'en')).toBe('/en/plantes');
  });

  it('picks the string of the page language', () => {
    expect(translator('en').t('Poissons', 'Fish')).toBe('Fish');
    expect(translator('fr').t('Poissons', 'Fish')).toBe('Poissons');
    expect(translator().href('/cours')).toBe('/cours');
  });
});

describe('category values', () => {
  it('translates single and compound values', () => {
    expect(term('pacifique', 'en')).toBe('peaceful');
    expect(term('carnivore et omnivore', 'en')).toBe('carnivore and omnivore');
    expect(term('doux, modéré', 'en')).toBe('gentle, moderate');
    expect(term('valeur inconnue', 'en')).toBe('valeur inconnue');
    expect(term('pacifique', 'fr')).toBe('pacifique');
  });
});

describe('compatibility messages', () => {
  it('are written in the page language', () => {
    const en = evaluate([channa(), cardinalis(), danioRerio()], { locale: 'en' }).issues.map((i) => i.message);

    expect(en).toContainEqual(expect.stringMatching(/is a predator .*: it will eat .* and /));
    expect(en).toContainEqual(expect.stringMatching(/^No common temperature: /));
    expect(evaluate([channa(), cardinalis()]).issues[0].message).toContain('est un prédateur');
  });
});

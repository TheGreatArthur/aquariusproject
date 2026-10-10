import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { evaluate } from '@/lib/compat';
import { cardinalis, channa, danioRerio } from '@/lib/compat/__tests__/fixtures';
import { term } from '@/lib/glossary';
import { localize, splitLocale, translator } from '@/lib/i18n';

const ROOT = path.resolve(import.meta.dirname, '../..');

describe('locale routing', () => {
  it('reads the language from the /en prefix', () => {
    expect(splitLocale('/en/poissons/3')).toEqual({ locale: 'en', path: '/poissons/3' });
    expect(splitLocale('/en')).toEqual({ locale: 'en', path: '/' });
    expect(splitLocale('/poissons')).toEqual({ locale: 'fr', path: '/poissons' });
    expect(splitLocale('/entretien')).toEqual({ locale: 'fr', path: '/entretien' });
    expect(splitLocale('/ja/plantes')).toEqual({ locale: 'ja', path: '/plantes' });
    expect(splitLocale('/jardin')).toEqual({ locale: 'fr', path: '/jardin' });
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
    expect(translator('en').t('Poissons', 'Fish', '魚')).toBe('Fish');
    expect(translator('ja').t('Poissons', 'Fish', '魚')).toBe('魚');
    expect(translator('fr').t('Poissons', 'Fish', '魚')).toBe('Poissons');
    expect(translator().href('/cours')).toBe('/cours');
    expect(translator('ja').href('/cours')).toBe('/ja/cours');
    expect(translator('ja').api('/api/poissons')).toBe('/api/poissons?lang=ja');
    expect(translator('fr').api('/api/poissons')).toBe('/api/poissons');
  });
});

describe('category values', () => {
  it('translates single and compound values', () => {
    expect(term('pacifique', 'en')).toBe('peaceful');
    expect(term('carnivore et omnivore', 'en')).toBe('carnivore and omnivore');
    expect(term('doux, modéré', 'en')).toBe('gentle, moderate');
    expect(term('valeur inconnue', 'en')).toBe('valeur inconnue');
    expect(term('pacifique', 'fr')).toBe('pacifique');
    expect(term('pacifique', 'ja')).toBe('温和');
    expect(term('carnivore et omnivore', 'ja')).toBe('肉食・雑食');
  });
});

describe('compatibility messages', () => {
  it('are written in the page language', () => {
    const en = evaluate([channa(), cardinalis(), danioRerio()], { locale: 'en' }).issues.map((i) => i.message);

    expect(en).toContainEqual(expect.stringMatching(/is a predator .*: it will eat .* and /));
    expect(en).toContainEqual(expect.stringMatching(/^No common temperature: /));
    expect(evaluate([channa(), cardinalis()]).issues[0].message).toContain('est un prédateur');
    expect(evaluate([channa(), cardinalis()], { locale: 'ja' }).issues[0].message).toContain('は捕食魚');
  });
});

describe('interface strings', () => {
  it('give every t() call its French, English and Japanese text', () => {
    const missing = [];
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory())
        return entry.name !== '__tests__' && walk(file);
      if (!/\.(js|ts)$/.test(entry.name))
        return;
      const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true,
        file.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JSX);
      const visit = (node) => {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 't'
          && node.arguments.length !== 3 && !ts.isSpreadElement(node.arguments[0]))
          missing.push(`${path.relative(ROOT, file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
        ts.forEachChild(node, visit);
      };
      visit(source);
    });
    ['app', 'components', 'lib'].forEach((dir) => walk(path.join(ROOT, dir)));

    expect(missing).toEqual([]);
  });
});

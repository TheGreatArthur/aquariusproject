import { describe, expect, it } from 'vitest';

import { COURS, getCours } from '@/content/cours';
import { chainesDuCours, segments, tempsDeLecture, typo } from '@/lib/cours/texte';

// Doit correspondre à components/cours/schemas/index.js et components/cours/icones.js
const SCHEMAS = ['CalculateurAmmoniac', 'CalculateurEquipement', 'CourbeOxygene', 'CourbesCyclage', 'EchelleDurete',
  'PlagesPh', 'PlanAquarium', 'TableauAmmoniac', 'TableauCo2'];
const ICONES = ['Beaker', 'CalendarCheck', 'Fish', 'Leaf', 'RefreshCw', 'Thermometer'];
const BLOCS = ['p', 'liste', 'etapes', 'flux', 'colonnes', 'tableau', 'encadre', 'figure'];
const PAGES = ['/poissons', '/plantes', '/simulation', '/cours'];

describe('typographie', () => {
  it('insère des espaces insécables avant la ponctuation haute et dans les guillemets', () => {
    expect(typo('Pourquoi ? « Simple » : 25 °C et 50 %')).toBe('Pourquoi ? « Simple » : 25 °C et 50 %');
  });

  it('découpe le balisage léger', () => {
    expect(segments('Le **KH**, *Nitrospira* et [le simulateur](/simulation).')).toEqual([
      { type: 'texte', texte: 'Le ' },
      { type: 'gras', texte: 'KH' },
      { type: 'texte', texte: ', ' },
      { type: 'italique', texte: 'Nitrospira' },
      { type: 'texte', texte: ' et ' },
      { type: 'lien', texte: 'le simulateur', href: '/simulation' },
      { type: 'texte', texte: '.' },
    ]);
  });
});

describe('contenu des cours', () => {
  it('a des identifiants uniques', () => {
    expect(new Set(COURS.map((c) => c.slug)).size).toBe(COURS.length);
    for (const c of COURS)
      expect(new Set(c.sections.map((s) => s.id)).size, c.slug).toBe(c.sections.length);
  });

  it.each(COURS.map((c) => [c.slug, c]))('%s est complet', (slug, c) => {
    expect(c.titre && c.resume).toBeTruthy();
    expect(ICONES).toContain(c.icone);
    expect(c.aRetenir.length).toBeGreaterThanOrEqual(3);
    expect(c.sources.length).toBeGreaterThanOrEqual(3);
    for (const { url } of c.sources)
      expect(url).toMatch(/^https:\/\//);
    for (const section of c.sections)
      for (const bloc of section.blocs) {
        expect(BLOCS, `${slug}#${section.id}`).toContain(bloc.type);
        if (bloc.type === 'figure')
          expect(SCHEMAS).toContain(bloc.schema);
      }
    expect(tempsDeLecture(c)).toBeGreaterThanOrEqual(3);
  });

  it.each(COURS.map((c) => [c.slug, c]))('%s respecte les règles de rédaction', (slug, c) => {
    for (const chaine of chainesDuCours(c)) {
      expect(chaine, 'tiret cadratin').not.toMatch(/—/);
      expect(chaine, 'points de suspension en trois points').not.toMatch(/\.\.\./);
      expect(chaine, 'guillemets droits').not.toMatch(/"/);
      expect((chaine.match(/\*\*/g) ?? []).length % 2, `gras non fermé : ${chaine}`).toBe(0);
    }
  });

  it.each(COURS.map((c) => [c.slug, c]))('%s n\'a que des liens internes valides', (slug, c) => {
    const liens = chainesDuCours(c).flatMap(segments).filter((s) => s.type === 'lien' && s.href.startsWith('/'));
    for (const { href } of liens) {
      const [chemin, ancre] = href.split('#');
      const cours = chemin.startsWith('/cours/') ? getCours(chemin.slice('/cours/'.length)) : null;
      const valide = PAGES.includes(chemin) || /^\/poissons\/\d+$/.test(chemin) || cours;
      expect(valide, href).toBeTruthy();
      if (ancre)
        expect(cours?.sections.map((s) => s.id), href).toContain(ancre);
    }
  });
});

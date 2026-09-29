import { describe, expect, it } from 'vitest';

import { commonRanges, evaluate, issuesIfAdded, RULES } from '@/lib/compat';
import {
  cardinalis, channa, combattant, danioRerio, discus, fish, guppy, labeo, neon, rasboraNain, scalaire, silureDeVerre,
} from './fixtures';

const ENV = { litrage: 400 };
const rules = (panier, env = ENV) => evaluate(panier, env).issues.map((i) => `${i.rule}:${i.severity}`);

describe('engine', () => {
  it('exposes the 14 rules', () => {
    expect(RULES).toHaveLength(14);
  });

  it('is compatible for a peaceful South American school', () => {
    const result = evaluate([cardinalis(), neon()], ENV);

    expect(result.verdict).toBe('ok');
    expect(result.ok).toBe(true);
  });

  it('reports every conflict, not only the first one', () => {
    const result = evaluate([cardinalis(), neon(), scalaire(), channa()], ENV);

    const bouche = result.issues.filter((i) => i.rule === 'bouche');
    expect(bouche).toHaveLength(1);
    expect(bouche[0].message).toContain('Néon Bleu');
    expect(bouche[0].message).toContain('Cardinalis');
  });

  it('is empty without fish', () => {
    expect(evaluate([], ENV)).toMatchObject({ ok: true, verdict: 'ok', issues: [], ranges: null });
  });
});

describe('1. water parameters shared by all species', () => {
  it('computes the common range', () => {
    expect(commonRanges([cardinalis(), neon()])).toEqual({ ph: [6, 6.5], gh: [4, 10], temp: [25, 26] });
  });

  it('blocks species without a common temperature', () => {
    const issues = evaluate([cardinalis(), danioRerio()], ENV).issues.filter((i) => i.rule === 'parametres');

    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ severity: 'error', ids: [1, 20] });
    expect(issues[0].message).toContain('température');
  });
});

describe('2. declared predator', () => {
  it('blocks a predator with fish half its size or smaller', () => {
    const issue = evaluate([channa(), cardinalis()], ENV).issues.find((i) => i.rule === 'predateur');

    expect(issue).toMatchObject({ severity: 'error', ids: [60, 1] });
  });

  it('ignores fish more than half its size', () => {
    expect(rules([channa(), fish({ taille: 10, quantite: 1 })])).not.toContain('predateur:error');
  });
});

describe('3. mouth size', () => {
  it('warns when a non-peaceful carnivore is 3 times bigger', () => {
    expect(rules([scalaire(), neon()])).toContain('bouche:warning');
  });

  it('does not flag peaceful carnivores such as discus', () => {
    expect(rules([discus(), cardinalis()])).not.toContain('bouche:warning');
  });
});

describe('4. temperament gap', () => {
  it('warns when temperaments are 2 levels apart', () => {
    expect(rules([labeo(), cardinalis()])).toContain('agressivite:warning');
  });

  it('accepts close temperaments', () => {
    expect(rules([scalaire(), fish({ taille: 10, quantite: 1 })])).not.toContain('agressivite:warning');
  });
});

describe('5. water current', () => {
  it('warns when currents are 2 levels apart', () => {
    expect(rules([silureDeVerre(), cardinalis()])).toContain('courant:warning');
  });

  it('accepts neighbouring currents', () => {
    expect(rules([danioRerio(), fish({ nom_courant: 'doux', temp_mini: 20, temp_maxi: 24 })]))
      .not.toContain('courant:warning');
  });
});

describe('6. biotope', () => {
  it('reports a single-region tank as information', () => {
    const result = evaluate([cardinalis(), neon()], ENV);

    expect(result.issues.find((i) => i.rule === 'biotope')).toMatchObject({ severity: 'info' });
    expect(result.verdict).toBe('ok');
  });
});

describe('7-10. group composition', () => {
  it('warns about several solitary fish', () => {
    expect(rules([labeo(2)])).toContain('solitaire:warning');
  });

  it('blocks two fish of the same aggressive species', () => {
    expect(rules([combattant(2)])).toContain('agressifs:error');
  });

  it('suggests an even number for pairs', () => {
    expect(rules([scalaire(3)])).toContain('couple:info');
    expect(rules([scalaire(2)])).not.toContain('couple:info');
  });

  it('suggests multiples of 4 for harems', () => {
    expect(rules([guppy(5)])).toContain('harem:info');
    expect(rules([guppy(8)])).not.toContain('harem:info');
  });
});

describe('11. delicate species', () => {
  it('warns in a small tank', () => {
    expect(rules([rasboraNain()], { litrage: 50 })).toContain('delicate:warning');
  });

  it('accepts a big enough tank', () => {
    expect(rules([rasboraNain()], { litrage: 100 })).not.toContain('delicate:warning');
  });
});

describe('12. overpopulation', () => {
  it('warns above 80 % and blocks above 100 % of the capacity', () => {
    expect(rules([cardinalis(10)], { litrage: 60 })).toContain('surpopulation:warning');
    expect(rules([cardinalis(10)], { litrage: 40 })).toContain('surpopulation:error');
    expect(rules([cardinalis(10)], { litrage: 100 })).not.toContain('surpopulation:warning');
  });
});

describe('13. under-sized group', () => {
  it('warns below the minimum group', () => {
    const issue = evaluate([cardinalis(4)], ENV).issues.find((i) => i.rule === 'souspopulation');

    expect(issue).toMatchObject({ severity: 'warning', ids: [1] });
    expect(issue.message).toContain('4 Cardinalis au lieu de 10');
  });
});

describe('14. incompatible families', () => {
  it('blocks gouramis/bettas with livebearers', () => {
    expect(rules([combattant(), guppy()])).toContain('familles:error');
  });
});

describe('issuesIfAdded', () => {
  it('predicts the new conflicts of a species before adding it', () => {
    const result = issuesIfAdded([cardinalis(), neon()], channa(0), ENV);

    expect(result.severity).toBe('error');
    expect(result.messages.join(' ')).toContain('Channa bleheri');
  });

  it('ignores conflicts that already exist and under-sized groups', () => {
    expect(issuesIfAdded([cardinalis(4)], neon(0), ENV)).toEqual({ severity: null, messages: [] });
  });
});

import { describe, expect, it } from 'vitest';

import { commonRanges, evaluate, issuesIfAdded, RULES } from '@/lib/compat';
import { espece, pointsInvertebre } from '@/lib/compat/especes';
import {
  cardinalis, channa, combattant, danioRerio, discus, fish, guppy, invertebre, labeo, neon, plante, rasboraNain,
  scalaire, silureDeVerre,
} from './fixtures';

const ENV = { litrage: 400 };
const rules = (panier, env = ENV) => evaluate(panier, env).issues.map((i) => `${i.rule}:${i.severity}`);

describe('engine', () => {
  it('exposes the 23 rules', () => {
    expect(RULES).toHaveLength(23);
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

describe('species of the three catalogues', () => {
  it('gives each species a unique id and the field names of a fish', () => {
    const cherry = espece('invertebre', { id: 7, nom_commun: 'Red Cherry', famille: 'Atyidae', comportement: 'pacifique',
      mode_vie: 'colonie', zone_geo: 'Asie', taille: 3, nb_individus: null });
    const anubias = espece('plante', { id: 7, nom_commun: 'Anubias', famille: 'Araceae' });

    expect([cherry.id, anubias.id, espece('poisson', { id: 7 }).id]).toEqual(['invertebre-7', 'plante-7', 'poisson-7']);
    expect(cherry).toMatchObject({ ref: 7, nom_famille: 'Atyidae', nom_comportement: 'pacifique', nb_individus: 1 });
    expect([cherry.points, anubias.points]).toEqual([1, 0]);
  });

  it('counts one point per 3 cm of invertebrate', () => {
    expect([pointsInvertebre(3), pointsInvertebre(5.5), pointsInvertebre(15), pointsInvertebre(null)]).toEqual([1, 2, 5, 1]);
  });

  it('ignores plants in the fish rules and parameters a species does not give', () => {
    const result = evaluate([cardinalis(), plante({ ph_mini: 5, ph_maxi: 8 }), invertebre({ ph_mini: 6, ph_maxi: 7 })], ENV);

    expect(result.ranges).toEqual({ ph: [6, 6.5], gh: [3, 12], temp: [25, 28] });
    expect(result.issues.filter((i) => i.rule === 'agressivite')).toEqual([]);
    expect(commonRanges([plante()]).gh).toBeUndefined();
  });
});

describe('0. water and volume of the tank', () => {
  it('blocks a species outside the water or too big for the tank', () => {
    const env = { litrage: 60, pH: 7.8, tempMoyenne: 26 };

    expect(evaluate([cardinalis()], env).issues.find((i) => i.rule === 'eau').message)
      .toBe('Cardinalis ne convient pas à votre bac (pH 4–6.5, bac d\'au moins 100 L).');
    expect(rules([neon()], { litrage: 100 })).not.toContain('eau:error');
  });
});

describe('15-19. invertebrates', () => {
  it('warns that an omnivorous fish three times bigger eats shrimps', () => {
    const gourami = fish({ nom_commun: 'Gourami', regime: 'omnivore', taille: 12 });

    expect(rules([gourami, invertebre()])).toContain('crevettes:warning');
    expect(rules([neon(), invertebre()])).not.toContain('crevettes:warning');
  });

  it('lets big crayfish hunt every smaller animal and dwarf ones only shrimps', () => {
    const cherax = invertebre({ nom_commun: 'Cherax', groupe: 'écrevisse', regime: 'omnivore', taille: 15 }, 1);
    const cpo = invertebre({ nom_commun: 'CPO', groupe: 'écrevisse', regime: 'omnivore', taille: 4 }, 2);
    const nerite = invertebre({ nom_commun: 'Nérite', groupe: 'escargot', regime: 'brouteur', taille: null }, 1);

    const big = evaluate([cherax, neon(), nerite], ENV).issues.find((i) => i.rule === 'chasseurs');
    expect(big.message).toContain('Néon Bleu et Nérite');
    expect(rules([cpo, neon()])).not.toContain('chasseurs:warning');
    expect(rules([cpo, invertebre()])).toContain('chasseurs:warning');
  });

  it('blocks an assassin snail with other snails', () => {
    const assassin = invertebre({ nom_commun: 'Escargot assassin', groupe: 'escargot', regime: 'carnivore', taille: null }, 1);
    const nerite = invertebre({ nom_commun: 'Nérite', groupe: 'escargot', regime: 'brouteur', taille: null }, 1);

    expect(rules([assassin, nerite])).toContain('escargots:error');
    expect(rules([assassin, neon()])).not.toContain('escargots:error');
  });

  it('asks for a land area and tells when larves need brackish water', () => {
    const vampire = invertebre({ nom_commun: 'Crabe vampire', groupe: 'crabe', installation: 'aquaterrarium' }, 3);
    const amano = invertebre({ nom_commun: 'Amano', reproduction: 'larves en eau saumâtre' });

    expect(rules([vampire])).toContain('aquaterrarium:warning');
    expect(rules([amano])).toContain('larves:info');
  });
});

describe('20-22. plants', () => {
  it('warns when plants share no light level', () => {
    const rotala = plante({ nom_commun: 'Rotala', lumiere_mini: 'forte', lumiere_maxi: 'très forte' });
    const anubias = plante({ nom_commun: 'Anubias', lumiere_mini: 'très faible', lumiere_maxi: 'faible' });

    expect(rules([rotala, anubias])).toContain('lumiere:warning');
    expect(rules([rotala, plante()])).not.toContain('lumiere:warning');
  });

  it('tells which plants need CO2', () => {
    expect(rules([plante({ co2: 'élevé' })])).toContain('co2:info');
  });

  it('warns about plant eaters, except for tough plants', () => {
    const dollar = fish({ nom_commun: 'Dollar argenté', nom_famille: 'Serrasalmidae', regime: 'herbivore', taille: 15 });
    const anubias = plante({ nom_commun: 'Anubias', usages: ['résiste aux cichlidés'] });

    expect(rules([dollar, plante()])).toContain('herbivores:warning');
    expect(rules([dollar, anubias])).not.toContain('herbivores:warning');
    // Les loricariidés broutent les algues, pas les plantes
    expect(rules([fish({ nom_famille: 'Loricariidae', regime: 'herbivore, alguivore' }), plante()]))
      .not.toContain('herbivores:warning');
  });
});

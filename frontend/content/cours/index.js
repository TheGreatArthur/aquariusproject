/**
 * Cours du guide pratique, dans l'ordre de lecture conseillé.
 * Chaque cours est un objet de données (sections et blocs) rendu par app/cours/[slug]/page.js. Les versions anglaise
 * (en/) et japonaise (ja/) ont la même structure : mêmes slugs, mêmes identifiants de section, mêmes blocs.
 */

import accueillirPoissons from './accueillir-poissons';
import cycleAzote from './cycle-azote';
import entretien from './entretien';
import parametresEau from './parametres-eau';
import plantesDecor from './plantes-decor';
import temperatureEquipement from './temperature-equipement';
import accueillirPoissonsEn from './en/accueillir-poissons';
import cycleAzoteEn from './en/cycle-azote';
import entretienEn from './en/entretien';
import parametresEauEn from './en/parametres-eau';
import plantesDecorEn from './en/plantes-decor';
import temperatureEquipementEn from './en/temperature-equipement';
import accueillirPoissonsJa from './ja/accueillir-poissons';
import cycleAzoteJa from './ja/cycle-azote';
import entretienJa from './ja/entretien';
import parametresEauJa from './ja/parametres-eau';
import plantesDecorJa from './ja/plantes-decor';
import temperatureEquipementJa from './ja/temperature-equipement';

export const COURS = [cycleAzote, parametresEau, temperatureEquipement, plantesDecor, entretien, accueillirPoissons];

export const COURS_PAR_LANGUE = {
  fr: COURS,
  en: [cycleAzoteEn, parametresEauEn, temperatureEquipementEn, plantesDecorEn, entretienEn, accueillirPoissonsEn],
  ja: [cycleAzoteJa, parametresEauJa, temperatureEquipementJa, plantesDecorJa, entretienJa, accueillirPoissonsJa],
};

/** Cours dans la langue de la page (français par défaut) */
export const listeDesCours = (locale) => COURS_PAR_LANGUE[locale] ?? COURS;

export const getCours = (slug, locale) => listeDesCours(locale).find((c) => c.slug === slug) ?? null;

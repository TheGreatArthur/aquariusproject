/**
 * Cours du guide pratique, dans l'ordre de lecture conseillé.
 * Chaque cours est un objet de données (sections et blocs) rendu par app/cours/[slug]/page.js.
 */

import accueillirPoissons from './accueillir-poissons';
import cycleAzote from './cycle-azote';
import entretien from './entretien';
import parametresEau from './parametres-eau';
import plantesDecor from './plantes-decor';
import temperatureEquipement from './temperature-equipement';

export const COURS = [cycleAzote, parametresEau, temperatureEquipement, plantesDecor, entretien, accueillirPoissons];

export const getCours = (slug) => COURS.find((c) => c.slug === slug) ?? null;

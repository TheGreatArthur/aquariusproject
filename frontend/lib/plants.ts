/**
 * Utilitaires d'affichage des plantes
 */

import { typo } from '@/lib/cours/texte';
import { searchKey } from '@/lib/fish';
import { translator } from '@/lib/i18n';
import type { ApiItem, Locale } from '@/lib/types';

/** Photo d'une plante, avec son crédit */
type Photo = { fichier: string };

/** Photos des plantes, dans public/plants */
export const plantPhoto = (fichier: string) => `/plants/${fichier}`;

/** Photo principale d'une plante de la liste (champ `image`) ou du détail (champ `images`) */
export const plantImage = (p: { image?: Photo, images?: Photo[] }) => plantPhoto((p.image ?? p.images?.[0])?.fichier ?? '');

/** Port de la plante : libellé d'une fiche, et libellé des filtres de la liste */
export const TYPES: Record<string, { label: string, filtre: string, en: string, filter: string, ja: string, filterJa: string }> = {
  épiphyte: { label: 'Épiphyte', filtre: 'Épiphytes', en: 'Epiphyte', filter: 'Epiphytes', ja: '着生植物', filterJa: '着生植物' },
  mousse: { label: 'Mousse', filtre: 'Mousses', en: 'Moss', filter: 'Mosses', ja: 'コケ', filterJa: 'コケ' },
  rosette: { label: 'Rosette', filtre: 'Rosettes', en: 'Rosette', filter: 'Rosettes', ja: 'ロゼット型', filterJa: 'ロゼット型' },
  tige: { label: 'Plante à tiges', filtre: 'Plantes à tiges', en: 'Stem plant', filter: 'Stem plants', ja: '有茎草', filterJa: '有茎草' },
  tapissante: { label: 'Tapissante', filtre: 'Tapissantes', en: 'Carpeting', filter: 'Carpeting', ja: '前景草', filterJa: '前景草' },
  flottante: { label: 'Flottante', filtre: 'Flottantes', en: 'Floating', filter: 'Floating', ja: '浮草', filterJa: '浮草' },
  rhizome: { label: 'À rhizome', filtre: 'À rhizome', en: 'Rhizome', filter: 'Rhizomes', ja: '根茎植物', filterJa: '根茎植物' },
};

/** Types présents dans la liste, dans l'ordre des filtres */
export const typesPresents = (plantes: ApiItem[]) => Object.keys(TYPES).filter((t) => plantes.some((p) => p.type === t));

/** « 5–15 cm », « 6 cm » si les bornes sont égales, null sans valeur ; nombres dans la langue de la page */
export function formatRange (min: number | null | undefined, max: number | null | undefined, unit = '',
  locale?: Locale) {
  if (min == null || max == null)
    return null;
  const fmt = (v: number) => v.toLocaleString(translator(locale).intl, { maximumFractionDigits: 1 });
  const suffix = unit ? ` ${unit}` : '';
  return min === max ? `${fmt(min)}${suffix}` : `${fmt(min)}–${fmt(max)}${suffix}`;
}

/** « faible à forte » (« low to high »), ou un seul niveau */
export function lightLabel (min: string, max: string, locale?: Locale) {
  const { t, term } = translator(locale);
  return min === max ? term(min) : t(`${min} à ${max}`, `${term(min)} to ${term(max)}`, `${term(min)}〜${term(max)}`);
}

/** Couleur du badge de difficulté */
export function difficultyTone (difficulte = '') {
  if (difficulte.includes('facile'))
    return 'calm';
  return difficulte === 'moyenne' ? 'warn' : 'danger';
}

/**
 * Recherche rapide : chaque mot saisi doit apparaître dans le nom commun, le nom scientifique,
 * la famille ou le port de la plante, sans tenir compte des accents
 */
export function matchesPlantSearch (p: ApiItem, terme: string) {
  const mots = searchKey(terme).split(/\s+/).filter(Boolean);
  if (!mots.length)
    return true;
  const texte = searchKey([p.nom_commun, p.nom_scientifique, p.famille, TYPES[p.type]?.label,
    TYPES[p.type]?.en, TYPES[p.type]?.ja]
    .filter(Boolean).join(' '));
  return mots.every((mot) => texte.includes(mot));
}

/** Les pays d'origine viennent de la liste mondiale des plantes vasculaires de Kew (sinon, mousses : de GBIF) */
export const rangeFromKew = (p: ApiItem) => p.sources.some((s: { nom: string }) => s.nom === 'POWO (Kew)');

/**
 * Fiche « Dans la nature » d'une plante, avec les champs de celle d'un poisson (voir FishProfile). L'auteur relevé
 * sur GBIF est celui du nom d'usage : il n'accompagne pas le nom valide quand la plante a été renommée.
 */
export function plantProfil (p: ApiItem) {
  return {
    nom_valide: p.nom_valide,
    auteur: p.nom_valide ? null : p.auteur,
    classification: p.ordre ? `${p.ordre} › ${p.famille}` : p.famille,
    uicn: p.uicn,
    repartition: typo(p.origine),
    pays: p.pays ?? [],
    introduits: p.introduits ?? [],
    points: p.points ?? [],
    presentation: typo(p.presentation),
    sources: p.sources,
  };
}

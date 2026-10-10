/**
 * Texte des cours : typographie française et balisage léger.
 *
 * Les cours sont écrits en chaînes simples (content/cours/*.js). On y utilise :
 * **gras**, *italique* (noms d'espèces) et [lien](/chemin ou https://…).
 */

const NBSP = ' ';

/**
 * Espaces insécables de la typographie française : avant « : ; ? ! % » et à l'intérieur des guillemets,
 * ainsi qu'entre un nombre et son unité courante, pour qu'une ligne ne commence jamais par un signe isolé.
 */
export function typo (texte: string) {
  return texte
    .replace(/ ([:;?!%»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) (°C|°dGH|°dKH|°f|°d|mg\/L|L\b|W\b|cm\b|mm\b|h\b|min\b|%|lm)/g, `$1${NBSP}$2`);
}

/** Bloc d'un cours (paragraphe, liste, tableau, schéma...) : seules ses chaînes sont lues ici */
interface Bloc {
  texte?: string;
  titre?: string;
  legende?: string;
  items?: (string | { titre: string, texte: string })[];
  lignes?: string[][];
  colonnes?: string[];
}

export interface Cours {
  titre: string;
  resume: string;
  aRetenir?: string[];
  sections: { titre: string, blocs: Bloc[] }[];
}

export interface Segment {
  type: 'texte' | 'gras' | 'italique' | 'lien';
  texte: string;
  href?: string;
}

const BALISE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/;

/** Découpe une chaîne balisée en segments à afficher */
export function segments (source: string): Segment[] {
  return typo(source).split(BALISE).filter(Boolean).map((morceau) => {
    if (morceau.startsWith('**') && morceau.endsWith('**'))
      return { type: 'gras', texte: morceau.slice(2, -2) };
    if (morceau.startsWith('*') && morceau.endsWith('*') && morceau.length > 2)
      return { type: 'italique', texte: morceau.slice(1, -1) };
    const lien = morceau.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (lien)
      return { type: 'lien', texte: lien[1], href: lien[2] };
    return { type: 'texte', texte: morceau };
  });
}

/** Texte brut sans balisage (temps de lecture, recherche) */
export const texteBrut = (source: string) => segments(source).map((s) => s.texte).join('');

/** Toutes les chaînes d'un cours, pour le temps de lecture et les vérifications */
export function chainesDuCours (cours: Cours) {
  const chaines: (string | undefined)[] = [cours.titre, cours.resume, ...(cours.aRetenir ?? [])];
  for (const section of cours.sections) {
    chaines.push(section.titre);
    for (const bloc of section.blocs) {
      if (bloc.texte) chaines.push(bloc.texte);
      if (bloc.titre) chaines.push(bloc.titre);
      if (bloc.legende) chaines.push(bloc.legende);
      for (const item of bloc.items ?? [])
        chaines.push(...(typeof item === 'string' ? [item] : [item.titre, item.texte]));
      for (const ligne of bloc.lignes ?? []) chaines.push(...ligne);
      for (const colonne of bloc.colonnes ?? []) chaines.push(colonne);
    }
  }
  return chaines.filter((c): c is string => typeof c === 'string');
}

/** Temps de lecture en minutes, à 200 mots par minute */
export function tempsDeLecture (cours: Cours) {
  const mots = chainesDuCours(cours).map(texteBrut).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 200));
}

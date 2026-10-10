/**
 * Shapes shared by the catalogues and the compatibility engine. Field names are those of the API (French).
 */

export type Locale = 'fr' | 'en';

/** Catalogue a species comes from */
export type Kind = 'poisson' | 'invertebre' | 'plante';

export type Severity = 'error' | 'warning' | 'info';

/** Water parameters given as a min–max range on every catalogue */
export type WaterKey = 'ph' | 'gh' | 'temp';

/** Photo credit of a species page */
export interface Credit {
  auteur: string;
  licence: string;
  licence_url?: string | null;
  source?: string;
  vue?: string;
}

/**
 * Species as the engine reads it: a fish, or a plant or an invertebrate renamed to the fish field names
 * (see compat/especes.ts), with the number kept in the tank
 */
export interface Species {
  id: number | string;
  /** Id in its own catalogue, once `id` is made unique across catalogues */
  ref?: number;
  kind?: Kind;
  nom_commun: string;
  nom_scientifique?: string;
  quantite: number;
  /** Load in the tank, 1 point ≈ 1 litre */
  points?: number;
  /** Minimum group size */
  nb_individus?: number;
  taille?: number | null;
  litrage_mini?: number | null;
  ph_mini?: number | null;
  ph_maxi?: number | null;
  gh_mini?: number | null;
  gh_maxi?: number | null;
  temp_mini?: number | null;
  temp_maxi?: number | null;
  nom_comportement?: string | null;
  nom_mode_vie?: string | null;
  nom_courant?: string | null;
  nom_famille?: string | null;
  nom_zone_geo?: string | null;
  nom_robustesse?: string | null;
  regime?: string | null;
  // Invertebrates
  groupe?: string;
  installation?: string;
  reproduction?: string | null;
  // Plants
  type?: string;
  lumiere_mini?: string;
  lumiere_maxi?: string;
  co2?: string | null;
  usages?: string[];
}

/** Species of a catalogue, before it is put in the tank */
export type CatalogueSpecies = Omit<Species, 'quantite'>;

/** Raw item of an API list, before compat/especes.ts renames its fields */
export type ApiItem = { id: number } & Record<string, any>;

/** Tank values entered in the simulator, and the page language for the messages */
export interface Environment {
  litrage?: number;
  pH?: number;
  gH?: number;
  tempMoyenne?: number;
  locale?: Locale;
}

/** Problem found by a rule */
export interface Issue {
  rule: string;
  severity: Severity;
  message: string;
  /** Species involved */
  ids: (number | string)[];
}

export type Rule = (panier: Species[], environnement: Environment) => Issue[];

/** Common range of a water parameter: [min, max], null if the species share none, undefined if none gives it */
export type Ranges = Record<WaterKey, [number, number] | null | undefined>;

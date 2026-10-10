/**
 * English labels of the category values stored in French by the API (behaviour, diet, current, light...).
 * Species names, descriptions and family names stay as the API gives them.
 */

const EN = {
  // Behaviour and social life
  'pacifique': 'peaceful',
  'peu agressif': 'slightly aggressive',
  'territorial': 'territorial',
  'moyennement agressif': 'moderately aggressive',
  'agressif': 'aggressive',
  'prédateur': 'predator',
  'solitaire': 'solitary',
  'couple': 'pair',
  'harem': 'harem',
  'petit groupe': 'small group',
  'banc': 'shoal',
  'colonie': 'colony',
  'seul ou en groupe': 'alone or in a group',
  // Current
  'stagnant': 'still',
  'doux': 'gentle',
  'modéré': 'moderate',
  'fort': 'strong',
  // Hardiness
  'fragile': 'fragile',
  'sensible': 'sensitive',
  'tolérant': 'tolerant',
  'robuste': 'hardy',
  'très robuste': 'very hardy',
  // Regions
  'Afrique': 'Africa',
  'Amérique centrale': 'Central America',
  'Amérique du Nord': 'North America',
  'Amérique du Sud': 'South America',
  'Asie': 'Asia',
  'Europe': 'Europe',
  'Océanie': 'Oceania',
  // Diet
  'carnivore': 'carnivore',
  'omnivore': 'omnivore',
  'herbivore': 'herbivore',
  'planctophage': 'planktivore',
  'alguivore': 'algae eater',
  'brouteur': 'grazer',
  'détritivore': 'detritivore',
  'filtreur': 'filter feeder',
  // Invertebrates
  'crabe': 'crab',
  'crevette': 'shrimp',
  'escargot': 'snail',
  'écrevisse': 'crayfish',
  'aquarium': 'aquarium',
  'aquaterrarium': 'paludarium',
  'en eau douce': 'in fresh water',
  'larves en eau saumâtre': 'larvae in brackish water',
  'larves en mer': 'larvae in the sea',
  'larves hors de l\'eau douce': 'larvae outside fresh water',
  // Plants: light, CO2, growth, difficulty
  'très faible': 'very low',
  'faible': 'low',
  'moyen': 'medium',
  'moyenne': 'medium',
  'forte': 'high',
  'très forte': 'very high',
  'élevé': 'high',
  'très lente': 'very slow',
  'lente': 'slow',
  'rapide': 'fast',
  'très rapide': 'very fast',
  'très facile': 'very easy',
  'facile': 'easy',
  'difficile': 'difficult',
  'très difficile': 'very difficult',
  // Plants: position, type, uses
  'premier plan': 'foreground',
  'plan intermédiaire': 'midground',
  'arrière-plan': 'background',
  'en surface': 'floating',
  'sur le décor': 'on hardscape',
  'flottante': 'floating',
  'mousse': 'moss',
  'rhizome': 'rhizome',
  'rosette': 'rosette',
  'tapissante': 'carpeting',
  'tige': 'stem',
  'épiphyte': 'epiphyte',
  'accent coloré': 'colour accent',
  'bac ouvert': 'open-top tank',
  'frayère': 'spawning site',
  'nano-aquarium': 'nano tank',
  'plante isolée': 'specimen plant',
  'rue hollandaise': 'Dutch street',
  'résiste aux cichlidés': 'cichlid-proof',
  'tapis': 'carpet',
};

/**
 * Category value in the page language. Compound values are translated part by part:
 * term('carnivore et omnivore', 'en') -> 'carnivore and omnivore'; unknown values are returned as they are.
 */
export function term (value, locale) {
  if (locale !== 'en' || value == null)
    return value;
  return EN[value] ?? String(value).split(/(, | et )/)
    .map((part) => (part === ' et ' ? ' and ' : EN[part] ?? part))
    .join('');
}

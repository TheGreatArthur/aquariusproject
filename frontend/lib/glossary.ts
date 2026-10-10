/**
 * English and Japanese labels of the category values stored in French by the API (behaviour, diet, current,
 * light...). Species names and texts come translated from the API itself (backend/translations.py).
 */

const GLOSSARY: Record<string, [en: string, ja: string]> = {
  // Behaviour and social life
  'pacifique': ['peaceful', '温和'],
  'peu agressif': ['slightly aggressive', 'やや攻撃的'],
  'territorial': ['territorial', '縄張り性'],
  'moyennement agressif': ['moderately aggressive', 'やや気が荒い'],
  'agressif': ['aggressive', '攻撃的'],
  'prédateur': ['predator', '捕食性'],
  'solitaire': ['solitary', '単独'],
  'couple': ['pair', 'ペア'],
  'harem': ['harem', 'ハーレム'],
  'petit groupe': ['small group', '小さな群れ'],
  'banc': ['shoal', '群れ'],
  'colonie': ['colony', 'コロニー'],
  'seul ou en groupe': ['alone or in a group', '単独または群れ'],
  'diurne': ['diurnal', '昼行性'],
  'nocturne': ['nocturnal', '夜行性'],
  // Current
  'stagnant': ['still', '止水'],
  'doux': ['gentle', '弱い'],
  'modéré': ['moderate', '中程度'],
  'fort': ['strong', '強い'],
  // Hardiness
  'fragile': ['fragile', 'デリケート'],
  'sensible': ['sensitive', '敏感'],
  'tolérant': ['tolerant', '適応力のある'],
  'robuste': ['hardy', '丈夫'],
  'très robuste': ['very hardy', 'とても丈夫'],
  // Regions
  'Afrique': ['Africa', 'アフリカ'],
  'Amérique centrale': ['Central America', '中米'],
  'Amérique du Nord': ['North America', '北米'],
  'Amérique du Sud': ['South America', '南米'],
  'Asie': ['Asia', 'アジア'],
  'Europe': ['Europe', 'ヨーロッパ'],
  'Océanie': ['Oceania', 'オセアニア'],
  // Diet
  'carnivore': ['carnivore', '肉食'],
  'omnivore': ['omnivore', '雑食'],
  'herbivore': ['herbivore', '草食'],
  'planctophage': ['planktivore', 'プランクトン食'],
  'alguivore': ['algae eater', 'コケ食'],
  'brouteur': ['grazer', 'コケや付着物を食べる'],
  'détritivore': ['detritivore', 'デトリタス食'],
  'filtreur': ['filter feeder', 'ろ過食'],
  // Invertebrates
  'crabe': ['crab', 'カニ'],
  'crevette': ['shrimp', 'エビ'],
  'escargot': ['snail', '貝'],
  'écrevisse': ['crayfish', 'ザリガニ'],
  'aquarium': ['aquarium', '水槽'],
  'aquaterrarium': ['paludarium', 'アクアテラリウム'],
  'eau douce': ['fresh water', '淡水'],
  'eau douce et eau saumâtre': ['fresh and brackish water', '淡水と汽水'],
  'en eau douce': ['in fresh water', '淡水で'],
  'larves en eau saumâtre': ['larvae in brackish water', '幼生は汽水で育つ'],
  'larves en mer': ['larvae in the sea', '幼生は海で育つ'],
  'larves hors de l\'eau douce': ['larvae outside fresh water', '幼生は淡水以外で育つ'],
  'hauteur de la coquille': ['shell height', '殻高'],
  'largeur de la carapace': ['carapace width', '甲幅'],
  'longueur du corps': ['body length', '体長'],
  // Plants: light, CO2, growth, difficulty
  'très faible': ['very low', 'とても弱い'],
  'faible': ['low', '弱い'],
  'moyen': ['medium', '中程度'],
  'moyenne': ['medium', '中程度'],
  'forte': ['high', '強い'],
  'très forte': ['very high', 'とても強い'],
  'élevé': ['high', '多い'],
  'très lente': ['very slow', 'とても遅い'],
  'lente': ['slow', '遅い'],
  'rapide': ['fast', '速い'],
  'très rapide': ['very fast', 'とても速い'],
  'très facile': ['very easy', 'とても簡単'],
  'facile': ['easy', '簡単'],
  'difficile': ['difficult', '難しい'],
  'très difficile': ['very difficult', 'とても難しい'],
  // Plants: position, type, uses, propagation
  'premier plan': ['foreground', '前景'],
  'plan intermédiaire': ['midground', '中景'],
  'arrière-plan': ['background', '後景'],
  'en surface': ['floating', '水面'],
  'sur le décor': ['on hardscape', '流木や石への活着'],
  'flottante': ['floating', '浮草'],
  'mousse': ['moss', 'コケ'],
  'rhizome': ['rhizome', '根茎'],
  'rosette': ['rosette', 'ロゼット型'],
  'tapissante': ['carpeting', '前景草'],
  'tige': ['stem', '有茎草'],
  'épiphyte': ['epiphyte', '着生植物'],
  'accent coloré': ['colour accent', '色のアクセント'],
  'bac ouvert': ['open-top tank', 'オープンアクアリウム'],
  'frayère': ['spawning site', '産卵床'],
  'nano-aquarium': ['nano tank', '小型水槽'],
  'plante isolée': ['specimen plant', '単植向き'],
  'rue hollandaise': ['Dutch street', 'オランダ式レイアウトの列植'],
  'résiste aux cichlidés': ['cichlid-proof', 'シクリッドに強い'],
  'tapis': ['carpet', '絨毯状'],
  'boutures': ['cuttings', '挿し木'],
  'stolons': ['runners', 'ランナー'],
  'graines': ['seeds', '種子'],
  'spores': ['spores', '胞子'],
  'fragmentation': ['fragmentation', '断片からの再生'],
  'division du rhizome': ['rhizome division', '根茎の株分け'],
  'séparation des rejets': ['separating offshoots', '子株の株分け'],
  'plantules sur les feuilles': ['plantlets on the leaves', '葉にできる子株'],
  'plantules sur les racines': ['plantlets on the roots', '根にできる子株'],
  'plantules sur la hampe florale': ['plantlets on the flower stalk', '花茎にできる子株'],
  // Families named after their region
  'Cichlidae africain': ['African Cichlidae', 'アフリカン・シクリッド'],
  'Cichlidae américain': ['American Cichlidae', 'アメリカン・シクリッド'],
};

const AND = { en: ' and ', ja: '・' };

/**
 * Category value in the page language. Compound values are translated part by part:
 * term('carnivore et omnivore', 'en') -> 'carnivore and omnivore'; unknown values are returned as they are.
 */
export function term (value: string, locale?: string): string;
export function term (value: string | null | undefined, locale?: string): string | null | undefined;
export function term (value: string | null | undefined, locale?: string) {
  if ((locale !== 'en' && locale !== 'ja') || value == null)
    return value;
  const i = locale === 'en' ? 0 : 1;
  const one = (part: string) => GLOSSARY[part]?.[i] ?? part;
  if (GLOSSARY[value])
    return one(value);
  return String(value).split(/(, | et )/)
    .map((part) => (part === ' et ' ? AND[locale] : part === ', ' && locale === 'ja' ? '、' : one(part)))
    .join('');
}

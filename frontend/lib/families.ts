/**
 * Familles mises en avant sur la page d'accueil.
 * `nom` doit correspondre au nom de la famille en base (comparaison insensible à la casse).
 * `position` : point de la photo à garder visible quand la carte la recadre (object-position), là où est le poisson,
 * plutôt que le centre de la photo ; le bas des cartes est couvert par le texte.
 */

export const FEATURED_FAMILIES = [
  {
    nom: 'Characidae',
    image: '/families/characidae.jpg',
    description: 'Tétras et néons : petits poissons de banc, vifs et colorés.',
    en: 'Tetras and neons: small, lively and colourful shoaling fish.',
    ja: 'テトラとネオン：群れで泳ぐ、活発で色鮮やかな小型魚。',
  },
  {
    nom: 'Cichlidae américain',
    image: '/families/cichlidae-americain.jpg',
    position: '50% 22%',
    description: 'Scalaires, apistogrammas et discus, au comportement riche.',
    en: 'Angelfish, apistos and discus, with rich behaviour.',
    ja: 'エンゼルフィッシュ、アピストグラマ、ディスカス。行動が豊かな魚たち。',
  },
  {
    nom: 'Poeciliidae',
    image: '/families/poeciliidae.jpg',
    description: 'Guppys, platys et mollys : des vivipares faciles à maintenir.',
    en: 'Guppies, platies and mollies: easy livebearers.',
    ja: 'グッピー、プラティ、モーリー：飼いやすい卵胎生魚。',
  },
  {
    nom: 'Callichthyidae',
    image: '/families/callichthyidae.jpg',
    position: '62% 40%',
    description: 'Les corydoras, poissons-chats de fond grégaires et paisibles.',
    en: 'Corydoras, peaceful bottom-dwelling catfish that live in groups.',
    ja: 'コリドラス：群れで暮らす、おとなしい底生のナマズ。',
  },
  {
    nom: 'Osphronemidae',
    image: '/families/osphronemidae.jpg',
    position: '38% 35%',
    description: 'Gouramis et combattants, capables de respirer l\'air.',
    en: 'Gouramis and bettas, able to breathe air.',
    ja: 'グラミーとベタ：空気呼吸ができる魚。',
  },
  {
    nom: 'Loricariidae',
    image: '/families/loricariidae.jpg',
    position: '42% 40%',
    description: 'Ancistrus et plécos, brouteurs à bouche en ventouse.',
    en: 'Bristlenoses and plecos, grazers with sucker mouths.',
    ja: 'アンシストルスとプレコ：吸盤状の口でコケを食べる魚。',
  },
  {
    nom: 'Danionidae',
    image: '/families/danionidae.jpg',
    position: '65% 50%',
    description: 'Danios et rasboras, nageurs infatigables venus d\'Asie.',
    en: 'Danios and rasboras, tireless swimmers from Asia.',
    ja: 'ダニオとラスボラ：アジア生まれの疲れ知らずの泳ぎ手。',
  },
  {
    nom: 'Cichlidae africain',
    image: '/families/cichlidae-africain.jpg',
    position: '58% 45%',
    description: 'Cichlidés des grands lacs, éclatants et territoriaux.',
    en: 'Rift lake cichlids, brilliant and territorial.',
    ja: 'アフリカ大地溝帯の湖のシクリッド：鮮やかで縄張り意識が強い。',
  },
];

/** Lien vers la liste des poissons filtrée sur une famille */
export const familyHref = (nom: string) => `/poissons?famille=${encodeURIComponent(nom)}`;

/**
 * Biotopes : milieux naturels qui réunissent des espèces du catalogue (poissons, plantes, invertébrés).
 *
 * Ce fichier garde ce qui ne dépend pas de la langue : espèces (noms scientifiques du catalogue), mesures de l'eau
 * dans la nature avec leur source, bac d'exemple (eau et population, au format du simulateur), sources et vidéos YouTube
 * de bacs qui le reproduisent (titre et chaîne tels que publiés). Les textes sont dans fr.js, en.js et ja.js, avec les
 * mêmes clés. Photos : photos.json (titres Commons choisis) et credits.json (écrit par
 * backend/tools/fetch_biotope_photos.py).
 *
 * Une espèce n'est listée que si elle vit dans ce milieu d'après sa fiche (FishBase, Seriously Fish) ou, pour les
 * plantes, d'après les observations GBIF de la région (lien dans les sources).
 */

import credits from './credits.json';
import en from './en';
import fr from './fr';
import ja from './ja';

// Titres des sources dans leur langue d'origine, communs aux trois versions du site
const SF = (nom, slug) => ({ titre: `Seriously Fish: ${nom}`, url: `https://www.seriouslyfish.com/species/${slug}/` });
const gbif = (titre, params) => ({ titre: `GBIF occurrences: ${titre}`, url: `https://www.gbif.org/occurrence/search?${params}` });
const video = (id, chaine, titre) => ({ id, chaine, titre });
// Les deux lacs du Rift partagent la même source de mesures
const LACS_RIFT = {
  titre: 'Talling & Talling (1965), The chemical composition of African lake waters. Internationale Revue der gesamten '
    + 'Hydrobiologie 50(3): 421-463, with the Lake Tanganyika pH of Plisnier et al. (1996, LTR Technical Document '
    + 'TD/46), tables reproduced by M. K. Oliver, Malawi Cichlid Homepage',
  url: 'https://malawicichlids.com/mw01011.htm',
};
const TANGANYIKA = [
  { param: 'ph', min: 9.0, max: 9.1, source: 0 },
  { param: 'conductivite', min: 606, max: 620, source: 0 },
  { param: 'gh', min: 10.4, max: 12.5, source: 0 },
  { param: 'kh', min: 16.9, max: 19.1, source: 0 },
];

export const BIOTOPES = [
  {
    slug: 'rio-negro',
    mesures: [
      { param: 'ph', min: 3.9, max: 6.1, source: 0 },
      { param: 'conductivite', min: 8.8, max: 28.6, source: 0 },
    ],
    especes: {
      poisson: ['Paracheirodon axelrodi', 'Hemigrammus bleheri', 'Nannostomus eques', 'Nannostomus marginatus',
        'Nannostomus trifasciatus', 'Carnegiella strigata', 'Hyphessobrycon socolofi', 'Corydoras adolfoi',
        'Dicrossus filamentosus', 'Pterophyllum altum', 'Satanoperca daemon'],
      plante: ['Tonina fluviatilis', 'Mayaca fluviatilis', 'Cabomba aquatica', 'Phyllanthus fluitans'],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 240, pH: 5.5, gH: 3, tempMoyenne: 26 },
      population: [['poisson', 'Paracheirodon axelrodi', 15], ['poisson', 'Carnegiella strigata', 8],
        ['poisson', 'Nannostomus marginatus', 8], ['poisson', 'Corydoras adolfoi', 8],
        ['poisson', 'Dicrossus filamentosus', 2], ['plante', 'Phyllanthus fluitans', 1]],
    },
    sources: [
      { titre: 'Küchler, Miekeley & Forsberg (2000), A contribution to the chemical characterization of rivers in the '
          + 'Rio Negro Basin, Brazil. Journal of the Brazilian Chemical Society 11(3): 286-292',
        url: 'https://www.scielo.br/j/jbchs/a/frgjRVJCP5dvkV7CvYc7y3n/?lang=en' },
      SF('Paracheirodon axelrodi', 'paracheirodon-axelrodi'),
      SF('Carnegiella strigata', 'carnegiella-strigata'),
      gbif('Tonina fluviatilis (Paepalanthus fluviatilis), Rio Negro basin',
        'taxon_key=11054326&has_coordinate=true&decimal_latitude=-3.4,2.2&decimal_longitude=-70.5,-59.8'),
    ],
    videos: [
      video('LDxZmIjfx-U', 'Biotope Aquarium', '#BADC2018 / Brazil, Rio Negro, flooded forest at the source of a small igarapé in Cambeua, 480 L'),
      video('rpzAoq2PDUo', 'AlexB_aquatics', 'Duplicating a Rio Negro Tributary- a super shallow Corydoras Biotope aquarium'),
    ],
  },
  {
    slug: 'xingu',
    mesures: [
      { param: 'ph', min: 5.0, max: 8.4, source: 0 },
      { param: 'conductivite', min: 10, max: 80, source: 0 },
      { param: 'temperature', min: 27, max: 33, source: 0 },
    ],
    especes: {
      poisson: ['Hypancistrus zebra', 'Baryancistrus chrysolomus', 'Scobinancistrus aureatus', 'Pseudacanthicus pirarara',
        'Peckoltia vittata', 'Acnodon normani'],
      plante: [],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 400, pH: 6.8, gH: 5, tempMoyenne: 28 },
      population: [['poisson', 'Hypancistrus zebra', 1], ['poisson', 'Baryancistrus chrysolomus', 1]],
    },
    sources: [
      { titre: 'Rodrigues-Filho et al. (2015), Spatial patterns of water quality in Xingu River Basin (Amazonia) prior '
          + 'to the Belo Monte dam impoundment. Brazilian Journal of Biology 75(3 suppl. 1), table 3 (stations of the '
          + 'Xingu River, 2012-2014)',
        url: 'https://doi.org/10.1590/1519-6984.02914BM' },
      SF('Hypancistrus zebra', 'hypancistrus-zebra'),
      SF('Baryancistrus chrysolomus', 'baryancistrus-chrysolomus'),
    ],
    videos: [
      video('jHLvJDHDbVE', 'Biotope Aquarium', '#BADC2018 / The shallow waters of Gorgulho da Rita, Rio Xingu, Para, Brazil, 420 L'),
      video('pNcgHeFROHs', 'Tropical Fish Hub', 'Creating Rio Xingu Biotope Aquarium for L46 Zebra Plecos'),
    ],
  },
  {
    slug: 'afrique-ouest',
    mesures: [],
    especes: {
      poisson: ['Pelvicachromis pulcher', 'Pelvicachromis taeniatus', 'Fundulopanchax gardneri',
        'Fundulopanchax sjostedti', 'Aphyosemion australe', 'Arnoldichthys spilopterus', 'Pantodon buchholzi',
        'Erpetoichthys calabaricus'],
      plante: ['Anubias barteri var. nana', 'Bolbitis heudelotii', 'Crinum natans', 'Crinum calamistratum',
        'Ceratopteris cornuta', 'Ottelia ulvifolia'],
      invertebre: ['Atya gabonensis'],
    },
    bac: {
      eau: { litrage: 200, pH: 6.9, gH: 4, tempMoyenne: 25 },
      population: [['poisson', 'Arnoldichthys spilopterus', 10], ['poisson', 'Fundulopanchax gardneri', 4],
        ['invertebre', 'Atya gabonensis', 3], ['plante', 'Anubias barteri var. nana', 1],
        ['plante', 'Bolbitis heudelotii', 1], ['plante', 'Crinum natans', 1]],
    },
    sources: [
      SF('Pelvicachromis pulcher', 'pelvicachromis-pulcher'),
      SF('Fundulopanchax gardneri', 'fundulopanchax-gardneri-gardneri'),
      { titre: 'Fishipedia: Atya gabonensis', url: 'https://www.fishipedia.fr/fr/crustacea/atya-gabonensis' },
      gbif('Anubias barteri, Cameroon', 'taxon_key=2871871&country=CM&has_coordinate=true'),
      gbif('Ottelia ulvifolia, Cameroon', 'taxon_key=5329480&country=CM&has_coordinate=true'),
    ],
    videos: [
      video('cbb0QnDNDVk', 'Biotope Aquarium', '#BADC2022 / A stream that supplies water to the volcanic lake Barombi ba Kotto - Cameroon, 144 L'),
      video('pMadTpiJ2Xc', 'BIOTOPE AQUARIUM Project', '#BAC2025 Moliwe River, Southwest Region, Cameroon. By Frank Reinders'),
    ],
  },
  {
    slug: 'lac-malawi',
    mesures: [
      { param: 'ph', min: 8.5, max: 8.6, source: 0 },
      { param: 'conductivite', min: 210, max: 220, source: 0 },
      { param: 'gh', min: 3.4, max: 4.8, source: 0 },
      { param: 'kh', min: 6.6, max: 7.2, source: 0 },
    ],
    especes: {
      poisson: ['Maylandia zebra', 'Maylandia estherae', 'Labidochromis caeruleus', 'Chindongo demasoni',
        'Chindongo saulosi', 'Melanochromis auratus', 'Iodotropheus sprengerae', 'Aulonocara jacobfreibergi',
        'Aulonocara stuartgranti', 'Copadichromis borleyi', 'Placidochromis electra', 'Sciaenochromis fryeri',
        'Nimbochromis venustus'],
      plante: ['Vallisneria spiralis'],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 300, pH: 8, gH: 12, tempMoyenne: 26 },
      population: [['poisson', 'Labidochromis caeruleus', 8], ['poisson', 'Iodotropheus sprengerae', 8],
        ['poisson', 'Chindongo saulosi', 8]],
    },
    sources: [
      LACS_RIFT,
      SF('Labidochromis caeruleus', 'labidochromis-caeruleus'),
      SF('Maylandia zebra', 'maylandia-zebra'),
    ],
    videos: [
      video('7sOTpDO-GaA', 'Biotope Aquarium', '#BADC2022 / Mbowe Island, Lake Malawi, Malawi, 400 L'),
      video('qHyW3Z1wiX8', 'przemek_bl', 'The Piece of Africa - Malawi biotope tank 720l'),
    ],
  },
  {
    slug: 'lac-tanganyika',
    mesures: TANGANYIKA,
    especes: {
      poisson: ['Tropheus moorii', 'Julidochromis regani', 'Julidochromis marlieri', 'Neolamprologus brichardi',
        'Neolamprologus leleupi', 'Altolamprologus calvus', 'Cyprichromis leptosoma', 'Cyphotilapia frontosa',
        'Synodontis petricola'],
      plante: ['Vallisneria spiralis'],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 300, pH: 8.5, gH: 12, tempMoyenne: 25 },
      population: [['poisson', 'Julidochromis regani', 2], ['poisson', 'Neolamprologus leleupi', 2],
        ['poisson', 'Altolamprologus calvus', 2], ['poisson', 'Synodontis petricola', 4]],
    },
    sources: [
      LACS_RIFT,
      SF('Julidochromis regani', 'julidochromis-regani'),
      SF('Altolamprologus calvus', 'altolamprologus-calvus'),
      gbif('Vallisneria spiralis, Lake Tanganyika',
        'taxon_key=2865526&has_coordinate=true&decimal_latitude=-8.8,-3.3&decimal_longitude=29.0,31.3'),
    ],
    videos: [
      video('gzL0b7J4f4c', 'Biotope Aquarium', '#BADC2019 / Africa, Lake Tanganyika, Congo, Rocky bottom with open space, 1680 L'),
      video('xErSe-0Ly1c', 'Biotope Aquarium', '#BADC2018 / Lake Tanganyika at Chimba biotope, 140 L'),
    ],
  },
  {
    slug: 'tanganyika-coquilles',
    mesures: TANGANYIKA,
    especes: {
      poisson: ['Neolamprologus multifasciatus', 'Neolamprologus similis', 'Lamprologus ocellatus'],
      plante: [],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 80, pH: 8.5, gH: 12, tempMoyenne: 25 },
      population: [['poisson', 'Neolamprologus similis', 5]],
    },
    sources: [
      LACS_RIFT,
      SF('Neolamprologus similis', 'neolamprologus-similis'),
      SF('Neolamprologus multifasciatus', 'neolamprologus-multifasciatus'),
      { titre: 'FishBase: Neolamprologus similis', url: 'https://www.fishbase.se/summary/Neolamprologus-similis.html' },
    ],
    videos: [
      video('m2ZVJK-MsH8', 'Gab Aqua', 'Ces poissons vivent dans des coquilles (Biotope lac tanganyika, on fait l\'aquarium)'),
      video('HAcpOWMEIdM', 'Jimmy Gimbal', 'So You Want a Lake Tanganyikan Shell Dweller Bio-Tope?'),
    ],
  },
  {
    slug: 'tourbieres-asie',
    mesures: [
      { param: 'ph', min: 3.5, max: 5.5, source: 0 },
    ],
    especes: {
      poisson: ['Boraras brigittae', 'Boraras maculatus', 'Boraras merah', 'Sphaerichthys osphromenoides',
        'Parosphromenus deissneri', 'Trigonostigma heteromorpha', 'Trigonostigma hengeli', 'Rasbora einthovenii',
        'Rasbora patrickyapi', 'Desmopuntius rhomboocellatus', 'Pangio kuhlii'],
      plante: ['Cryptocoryne longicauda', 'Utricularia aurea'],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 120, pH: 5.8, gH: 2, tempMoyenne: 27 },
      population: [['poisson', 'Boraras merah', 12], ['poisson', 'Sphaerichthys osphromenoides', 6],
        ['poisson', 'Pangio kuhlii', 6], ['plante', 'Cryptocoryne longicauda', 1]],
    },
    sources: [
      { titre: 'Ng & Kottelat (1994), Revision of the Betta waseri species group (Teleostei: Belontiidae). Raffles '
          + 'Bulletin of Zoology 42(3): 593-611', url: 'https://lkcnhm.nus.edu.sg/app/uploads/2017/04/42rbz593-611.pdf' },
      SF('Boraras merah', 'boraras-merah'),
      SF('Sphaerichthys osphromenoides', 'sphaerichthys-osphromenoides'),
      gbif('Cryptocoryne longicauda, Borneo', 'taxon_key=2869206&has_coordinate=true&decimal_latitude=-4.2,7.1&decimal_longitude=108.5,119.3'),
    ],
    videos: [
      video('xO4Bdddoeiw', 'Biotope Aquarium', '#BADC2018 / Peat swamp forest in Selangor, Malaysia, 375 L'),
      video('ILYj8p4a3dc', 'Tropical Fish Hub', 'Creating a Peat Swamp Blackwater Biotope Riparium'),
    ],
  },
  {
    slug: 'sri-lanka',
    mesures: [],
    especes: {
      poisson: ['Puntius titteya', 'Rasboroides vaterifloris', 'Pethia nigrofasciata'],
      plante: ['Cryptocoryne wendtii', 'Aponogeton crispus'],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 150, pH: 6.5, gH: 7, tempMoyenne: 25 },
      population: [['poisson', 'Puntius titteya', 8], ['poisson', 'Rasboroides vaterifloris', 8],
        ['poisson', 'Pethia nigrofasciata', 8], ['plante', 'Cryptocoryne wendtii', 1],
        ['plante', 'Aponogeton crispus', 1]],
    },
    sources: [
      SF('Puntius titteya', 'puntius-titteya'),
      SF('Rasboroides vaterifloris', 'rasboroides-vaterifloris'),
      gbif('Cryptocoryne wendtii, Sri Lanka', 'taxon_key=2869214&country=LK'),
    ],
    videos: [
      video('oGmb-z42T7M', 'Biotope Aquarium', '#BADC2018 / Kelani river  Rocky shore shallow stream, wet zone, Sri Lanka, 112 L'),
      video('YqigDukHuL0', 'Gab Aqua', 'un AQUARIUM pour BARBUS CERISE ! Biotope, Sri Lanka'),
    ],
  },
  {
    slug: 'ghats-occidentaux',
    mesures: [],
    especes: {
      poisson: ['Sahyadria denisonii', 'Dawkinsia filamentosa', 'Dawkinsia arulius', 'Carinotetraodon travancoricus',
        'Aplocheilus lineatus'],
      plante: ['Cryptocoryne spiralis', 'Lagenandra meeboldii', 'Aponogeton natans', 'Rotala rotundifolia'],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 450, pH: 7, gH: 8, tempMoyenne: 23 },
      population: [['poisson', 'Sahyadria denisonii', 8], ['poisson', 'Dawkinsia filamentosa', 10],
        ['plante', 'Cryptocoryne spiralis', 1], ['plante', 'Lagenandra meeboldii', 1],
        ['plante', 'Rotala rotundifolia', 1]],
    },
    sources: [
      SF('Sahyadria denisonii', 'sahyadria-denisonii'),
      SF('Dawkinsia filamentosa', 'dawkinsia-filamentosa'),
      gbif('Lagenandra meeboldii, India', 'taxon_key=2870421&country=IN&has_coordinate=true'),
      gbif('Cryptocoryne spiralis, Western Ghats',
        'taxon_key=2869170&country=IN&has_coordinate=true&decimal_latitude=8,21&decimal_longitude=72.5,78'),
    ],
    videos: [
      video('O9GYtoWZ2H8', 'Biotope Aquarium', '#BADC2020 / Rocky pool with thick riparian vegetation, Chaliyar River, Kerala, India, 216'),
      video('29QhQJpf9cg', 'Shifu Tanks', 'Indian Biotope Aquarium Setup - Periyar River | Biotope Aquarium Contest 2023'),
    ],
  },
  {
    slug: 'usumacinta',
    mesures: [
      { param: 'ph', min: 7.5, max: 8.9, source: 0 },
      { param: 'temperature', min: 23, max: 33.9, source: 0 },
    ],
    especes: {
      poisson: ['Thorichthys meeki', 'Trichromis salvini', 'Rocio octofasciata', 'Xiphophorus hellerii',
        'Xiphophorus maculatus', 'Poecilia mexicana', 'Poecilia velifera'],
      plante: ['Ceratophyllum demersum', 'Najas guadalupensis', 'Heteranthera dubia', 'Ludwigia helminthorrhiza',
        'Hydrocotyle verticillata'],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 150, pH: 7.6, gH: 14, tempMoyenne: 25 },
      population: [['poisson', 'Xiphophorus hellerii', 4], ['poisson', 'Xiphophorus maculatus', 4],
        ['plante', 'Ceratophyllum demersum', 1], ['plante', 'Heteranthera dubia', 1],
        ['plante', 'Najas guadalupensis', 1]],
    },
    sources: [
      { titre: 'Salcedo-Garduño, Galaviz-Villa & Pérez-Vázquez (2022), Determining water quality of the lower basin of '
          + 'the Usumacinta River in Tabasco, Mexico. Agro Productividad 15(8), table 1',
        url: 'https://doi.org/10.32854/agrop.v15i8.2205' },
      SF('Thorichthys meeki', 'thorichthys-meeki'),
      SF('Xiphophorus hellerii', 'xiphophorus-hellerii'),
      gbif('Heteranthera dubia, Usumacinta basin',
        'taxon_key=2766116&has_coordinate=true&decimal_latitude=15.5,18.7&decimal_longitude=-93.6,-90.0'),
    ],
    videos: [
      video('eqJ0J71WUYE', 'Biotope Aquarium', '#BADC2018 / Subin River, shallow grassy river bank area, Usumacinta drainage, Guatemala, 375 L'),
      video('clYQuIh2Jz4', 'dnbiotopes', 'Biotope aquarium - Rio Usumacinta, Mexico - meeki and P. velifera tank'),
    ],
  },
  {
    slug: 'floride',
    mesures: [
      { param: 'ph', min: 6.5, max: 8.4, source: 1 },
      { param: 'conductivite', min: 268, max: 278, source: 2 },
      { param: 'gh', min: 7.8, max: 9, source: 1 },
      { param: 'temperature', min: 21, max: 24, source: 0 },
    ],
    especes: {
      poisson: ['Elassoma evergladei', 'Jordanella floridae', 'Heterandria formosa', 'Gambusia holbrooki',
        'Poecilia latipinna'],
      plante: ['Hemianthus glomeratus', 'Bacopa caroliniana', 'Ludwigia arcuata', 'Ludwigia glandulosa',
        'Sagittaria subulata', 'Nymphoides aquatica', 'Proserpinaca palustris', 'Juncus repens',
        'Najas guadalupensis', 'Limnobium spongia', 'Ceratophyllum demersum'],
      invertebre: ['Procambarus alleni'],
    },
    bac: {
      eau: { litrage: 80, pH: 7.4, gH: 10, tempMoyenne: 22 },
      population: [['poisson', 'Elassoma evergladei', 6], ['poisson', 'Heterandria formosa', 6],
        ['plante', 'Hemianthus glomeratus', 1], ['plante', 'Bacopa caroliniana', 1],
        ['plante', 'Sagittaria subulata', 1], ['plante', 'Ceratophyllum demersum', 1]],
    },
    sources: [
      { titre: 'U.S. Geological Survey (1995), Springs of Florida. Fact Sheet FS-151-95',
        url: 'https://pubs.usgs.gov/fs/1995/0151/report.pdf' },
      { titre: 'Water Quality Portal (USGS): Ichetucknee River at US 27, samples 1966-1993 (pH, hardness)',
        url: 'https://www.waterqualitydata.us/provider/NWIS/USGS-FL/USGS-02322700/' },
      { titre: 'USGS Water Data: Ichetucknee River at US 27 near Hildreth, continuous records (temperature, conductance)',
        url: 'https://waterdata.usgs.gov/monitoring-location/USGS-02322700/' },
      SF('Jordanella floridae', 'jordanella-floridae'),
      gbif('Hemianthus glomeratus (Micranthemum glomeratum), Florida', 'taxon_key=3172190&country=US&state_province=Florida'),
    ],
    videos: [
      video('w_0I60r0qdY', 'Biotope Aquarium', '#BADC2018 / Everglades Park, wetland, Florida, USA, 360 L'),
      video('CSJmQBVRJWs', 'ZenAqua', 'I Set Up A Florida Swamp in My Bedroom'),
    ],
  },
];

export const TEXTES = { fr, en, ja };

export const getBiotope = (slug) => BIOTOPES.find((b) => b.slug === slug) ?? null;

/** Textes d'un biotope dans la langue de la page (français par défaut) */
export const textesDu = (slug, locale) => (TEXTES[locale] ?? fr)[slug];

/** Photos d'un biotope, dans l'ordre choisi : la première du milieu naturel sert d'image principale */
export const photosDu = (slug) => credits[slug] ?? { nature: [], bacs: [] };

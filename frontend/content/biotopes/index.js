/**
 * Biotopes : milieux naturels qui réunissent des espèces du catalogue (poissons, plantes, invertébrés).
 *
 * Ce fichier garde ce qui ne dépend pas de la langue : espèces (noms scientifiques du catalogue), mesures de l'eau
 * dans la nature avec leur source, bac d'exemple (eau et population, au format du simulateur) et sources. Les textes
 * sont dans fr.js, en.js et ja.js, avec les mêmes clés. Photos : photos.json (titres Commons choisis) et credits.json
 * (écrit par backend/tools/fetch_biotope_photos.py).
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
  },
  {
    slug: 'afrique-ouest',
    mesures: [],
    especes: {
      poisson: ['Pelvicachromis pulcher', 'Pelvicachromis taeniatus', 'Fundulopanchax gardneri',
        'Fundulopanchax sjostedti', 'Aphyosemion australe', 'Arnoldichthys spilopterus', 'Pantodon buchholzi',
        'Erpetoichthys calabaricus'],
      plante: ['Anubias barteri var. nana', 'Bolbitis heudelotii', 'Crinum natans', 'Crinum calamistratum'],
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
      { titre: 'Talling & Talling (1965), The chemical composition of African lake waters. Internationale Revue der '
          + 'gesamten Hydrobiologie 50(3): 421-463, table reproduced by M. K. Oliver, Malawi Cichlid Homepage',
        url: 'https://malawicichlids.com/mw01011.htm' },
      SF('Labidochromis caeruleus', 'labidochromis-caeruleus'),
      SF('Maylandia zebra', 'maylandia-zebra'),
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
      plante: [],
      invertebre: [],
    },
    bac: {
      eau: { litrage: 120, pH: 5.8, gH: 2, tempMoyenne: 27 },
      population: [['poisson', 'Boraras merah', 12], ['poisson', 'Sphaerichthys osphromenoides', 6],
        ['poisson', 'Pangio kuhlii', 6]],
    },
    sources: [
      { titre: 'Ng & Kottelat (1994), Revision of the Betta waseri species group (Teleostei: Belontiidae). Raffles '
          + 'Bulletin of Zoology 42(3): 593-611', url: 'https://lkcnhm.nus.edu.sg/app/uploads/2017/04/42rbz593-611.pdf' },
      SF('Boraras merah', 'boraras-merah'),
      SF('Sphaerichthys osphromenoides', 'sphaerichthys-osphromenoides'),
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
  },
];

export const TEXTES = { fr, en, ja };

export const getBiotope = (slug) => BIOTOPES.find((b) => b.slug === slug) ?? null;

/** Textes d'un biotope dans la langue de la page (français par défaut) */
export const textesDu = (slug, locale) => (TEXTES[locale] ?? fr)[slug];

/** Photos d'un biotope, dans l'ordre choisi : la première du milieu naturel sert d'image principale */
export const photosDu = (slug) => credits[slug] ?? { nature: [], bacs: [] };

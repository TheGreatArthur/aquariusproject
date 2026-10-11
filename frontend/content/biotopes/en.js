/**
 * Biotope texts in English (same keys as fr.js and ja.js). Light markup of the practical guide: *italic*, **bold**,
 * [link](url). Figures come from the measurements and sources in index.js.
 */

const textes = {
  'rio-negro': {
    nom: 'Rio Negro, the black waters of the Amazon',
    region: 'Brazil, Colombia, Venezuela',
    type: 'Black water',
    resume: 'An Amazon tributary with tea-coloured water, very acidic and almost free of minerals, home to the '
      + 'cardinal tetra, pencilfish and hatchetfish.',
    milieu: [
      'The Rio Negro drains forests growing on deeply leached sandy soils. Rainwater seeps through a thick litter of '
        + 'leaves and picks up humic substances that stain it dark brown to black; the river erodes little and carries '
        + 'almost no sediment. It is the model of Amazonian **black water**, as opposed to the muddy **white water** '
        + 'of the Solimões and the **clear water** of rivers such as the Tapajós.',
      'At Manaus, the Rio Negro meets the Solimões to form the Amazon: the two waters flow side by side before mixing '
        + 'over about a hundred kilometres downstream. Every year the flood submerges the riverside forest, the '
        + '**igapó**, and fish spread out among trunks, roots and dead leaves.',
    ],
    eau: [
      'Küchler and colleagues measured a pH of 3.9 to 6.1 in the Negro basin (3.89 in the Rio Téa), against 6.9 to 7 '
        + 'in the Solimões, and a conductivity of 9 to 29 µS/cm, three to ten times lower. The acidity comes mostly '
        + 'from dissolved humic and fulvic acids; calcium and magnesium are almost absent.',
      'Such poor water feeds little aquatic life. In aquariums, the species of this biotope tolerate somewhat harder '
        + 'water, but most of them breed only in soft, acidic water.',
    ],
    vie: [
      'It is home mainly to small shoaling characins (cardinal tetras, rummy-nose tetras, Socolof\'s tetras), '
        + 'pencilfish and hatchetfish that hunt insects at the surface, *Corydoras* on the leaf litter, and cichlids: '
        + 'the chessboard cichlid, the altum angelfish of the upper Rio Negro and *Satanoperca daemon* over sand.',
      'Submerged plants are scarce: the canopy, the dark water and the lack of minerals hold them back. Where light '
        + 'gets through grow floating plants and a few species of soft, acidic water such as *Tonina fluviatilis*, '
        + '*Mayaca fluviatilis* or *Cabomba aquatica*, all recorded in the basin according to GBIF. No invertebrate of '
        + 'the catalogue lives there.',
    ],
    aquarium: [
      'Very soft water: reverse-osmosis or filtered rainwater, pH 5 to 6.5 and conductivity as low as possible, water '
        + 'changes included.',
      'A fine sand bottom, roots and branches, and a layer of dead leaves (catappa, oak) that release tannins and '
        + 'stain the water.',
      'Dim light, filtered by floating plants. *Tonina*, on the contrary, needs strong light and CO₂: it belongs in a '
        + 'brighter tank.',
      'A tight lid: hatchetfish jump.',
      'Warm water (25 to 28 °C) and gentle filtration; a stable pH matters more than an exact value.',
    ],
    bac: 'A 240 L tank for a shoal of cardinal tetras, hatchetfish, dwarf pencilfish, Adolfo\'s *Corydoras* and a pair '
      + 'of chessboard cichlids, under floating plants. Adolfo\'s *Corydoras* cap the temperature at 26 °C.',
    legendes: {
      'rio-negro-1.jpg': 'The Meeting of Waters near Manaus: the black water of the Rio Negro (top) runs along the '
        + 'sediment-laden white water of the Solimões.',
      'rio-negro-2.jpg': 'Anavilhanas National Park (Novo Airão, Amazonas): forest and sandstone on the dark waters of '
        + 'the Rio Negro.',
      'rio-negro-3.jpg': 'A tree standing in water at Anavilhanas: in the rainy season the riverside forest is flooded.',
      'rio-negro-bac-1.jpg': 'Amazon black-water biotope tank at Warsaw Zoo, with a pair of angelfish (*Pterophyllum* sp. '
        + '"Manacapuru").',
    },
  },

  'afrique-ouest': {
    nom: 'Forest streams of the Gulf of Guinea',
    region: 'Nigeria, Cameroon, Gabon',
    type: 'Forest streams',
    resume: 'Creeks, swamps and streams under the coastal rainforest, from the Niger Delta to Gabon: the home of the '
      + 'kribensis, *Fundulopanchax* killifish and dwarf anubias.',
    milieu: [
      'Along the Gulf of Guinea, the coastal rainforest is crossed by creeks, streams and swamps. In the lowlands the '
        + 'water is calm and overgrown with plants; some pools and raffia swamps dry out from time to time. On slopes, '
        + 'such as around Mount Cameroon, streams run over stones.',
      'Two habitats thus sit side by side: calm, shallow water where *Pelvicachromis* and killifish live, and streams '
        + 'with a steady current, where dwarf anubias and the fern *Bolbitis* cling to stones and wood, and where the '
        + 'African fan shrimp feeds on particles carried by the current.',
    ],
    eau: [
      'The profiles of these species, drawn from FishBase and Seriously Fish, describe soft, slightly acidic to neutral '
        + 'and warm water: 22 to 26 °C for *Fundulopanchax* killifish, near-neutral water at 24 to 30 °C for the fan '
        + 'shrimp.',
      'Near the coast, some kribensis populations live in brackish water. The fan shrimp needs it for its larvae, '
        + 'which develop in brackish water or at sea: it does not breed in fresh water.',
    ],
    vie: [
      'The kribensis (*Pelvicachromis pulcher*) and its cousin *P. taeniatus* spawn in caves and guard their fry. The '
        + 'killifish *Fundulopanchax gardneri* and *F. sjostedti*, and *Aphyosemion australe* further south, live in '
        + 'the calm forest waters. The African red-eyed tetra shoals in the streams of south-western Nigeria, the '
        + 'butterflyfish lies in wait for insects at the surface, and the reedfish, an elongated bichir, searches '
        + 'vegetated bottoms.',
      'Dwarf anubias, *Bolbitis heudelotii* and *Crinum natans*, which grows in the mud of permanent streams, are '
        + 'recorded in Cameroon according to GBIF; *Crinum calamistratum* is known only from rivers in Cameroon.',
    ],
    aquarium: [
      'A sand bottom, stones and roots; anubias and *Bolbitis* are tied to the hardscape rather than planted.',
      'Soft, slightly acidic to neutral water (pH 6 to 7), between 24 and 26 °C.',
      'A strong current in part of the tank for the fan shrimp, and fine food in suspension.',
      'Caves (coconut shells, upturned pots) if you keep *Pelvicachromis*, which defend a territory around them.',
      'A lid: killifish and the butterflyfish jump.',
    ],
    bac: 'A 200 L tank: a shoal of African red-eyed tetras, a harem of Gardneri killifish (one male and three females), '
      + 'three fan shrimp, dwarf anubias, *Bolbitis* and a *Crinum natans*. The territorial kribensis would harass '
      + 'these peaceful species: it does better in a tank of its own.',
    legendes: {
      'afrique-ouest-1.jpg': 'A rocky stream near the Mboué falls, Cameroon.',
      'afrique-ouest-2.jpg': 'A creek at Idenau, in the South-West Region of Cameroon, at the foot of Mount Cameroon.',
    },
  },

  'lac-malawi': {
    nom: 'Lake Malawi, the rocky shore',
    region: 'Malawi, Mozambique, Tanzania',
    type: 'Rift lake',
    resume: 'Algae-covered rock piles in clear, alkaline water: the realm of the mbuna, cichlids found in no other '
      + 'lake.',
    milieu: [
      'Lake Malawi fills a trough of the East African Rift, between Malawi, Mozambique and Tanzania. Its shores '
        + 'alternate sandy beaches, plant beds and rocky coasts, where boulders of every size are piled up under water.',
      'Many mbuna live on a single reef or around a single island: *Chindongo saulosi* only on Taiwanee Reef near '
        + 'Chizumulu Island, *C. demasoni* at Pombo Rocks, and the yellow form of *Labidochromis caeruleus* between '
        + 'Charo and Lion\'s Cove. Between rocks and sand, the intermediate zone belongs to *Aulonocara*, which feed '
        + 'above the sand.',
    ],
    eau: [
      'According to the measurements compiled by Talling and Talling (1965), the lake\'s surface water has a pH of 8.5 '
        + 'to 8.6 and a conductivity of 210 to 220 µS/cm. It is alkaline but not very hard: 3.4 to 4.8 °dGH for a '
        + 'carbonate hardness of 6.6 to 7.2 °dKH, far below Lake Tanganyika, which exceeds 600 µS/cm.',
      'In aquariums, mbuna are often kept in harder water, as their profiles reflect: they cope with it as long as the '
        + 'pH stays clearly alkaline and stable.',
    ],
    vie: [
      'Mbuna (*Maylandia*, *Labidochromis*, *Chindongo*, *Melanochromis*, *Iodotropheus*) scrape the film of algae '
        + 'and micro-organisms covering the rocks, the **aufwuchs**. Males defend a few rocks and many species live in '
        + 'harems. Above them, *Copadichromis borleyi* shoals in open water; *Sciaenochromis fryeri* and *Nimbochromis '
        + 'venustus* hunt small fish.',
      'Plants are missing on rocky shores; further out, on calm bottoms, grow beds of *Vallisneria*, also visited by '
        + '*Labidochromis caeruleus*. No invertebrate of the catalogue lives in the lake.',
    ],
    aquarium: [
      'Stable rock piles set directly on the bottom glass, before the sand, with plenty of caves and nooks to break up '
        + 'territories.',
      'Alkaline, stable water: pH 7.8 to 8.5, 24 to 27 °C; coral sand or a little bicarbonate helps hold the pH.',
      'Species of different colours, in harems (one male for three females), to spread aggression and avoid '
        + 'hybrids.',
      'Plant-based food (spirulina), close to the aufwuchs they graze in the lake.',
      'Few plants: mbuna eat soft leaves; *Vallisneria* holds out better.',
    ],
    bac: 'A 300 L tank for three mildly to moderately aggressive mbuna, in groups of eight: yellow *Labidochromis*, rusty '
      + 'cichlid and *Chindongo saulosi*. The pH of 8 and water harder than the lake\'s follow their profiles.',
    legendes: {
      'lac-malawi-1.jpg': 'Mbuna at Mitande Rocks, Thumbi West Island, in Lake Malawi National Park.',
      'lac-malawi-2.jpg': 'Mbuna grazing aufwuchs on a rock slab in the lake.',
      'lac-malawi-3.jpg': 'Taiwanee Reef near Chizumulu Island, the only place where *Chindongo saulosi* lives.',
      'lac-malawi-4.jpg': 'A rocky shore of Lake Malawi.',
      'lac-malawi-bac-1.jpg': 'African rift lake cichlid tank at Artis Zoo, Amsterdam: piled rocks and sand.',
      'lac-malawi-bac-2.jpg': 'Lake Malawi cichlid tank at the Georgia Aquarium, Atlanta.',
    },
  },

  'tourbieres-asie': {
    nom: 'Black-water peat swamps of Southeast Asia',
    region: 'Malaysia, Sumatra, Borneo',
    type: 'Peat swamps',
    resume: 'Under the swamp forest, brown, very acidic water almost free of minerals, home to tiny rasboras, '
      + 'chocolate gouramis and kuhli loaches.',
    milieu: [
      'In the lowlands of the Malay Peninsula, Sumatra and Borneo, the forest grows on a thick bed of peat: wood and '
        + 'leaves that do not decay in stagnant water. The streams and pools crossing it flow slowly under a dense '
        + 'canopy, over a bed of leaves, branches and roots.',
      'These forests are giving way to oil palm and rubber plantations, drainage and peat fires: several fish of this '
        + 'biotope now survive only in degraded forest remnants.',
    ],
    eau: [
      'Ng and Kottelat (1994) recorded a pH of 3.5 to 3.7 in the peat swamps of Selangor, Malaysia, and of 4 to 5.5 in '
        + 'black-water streams with thick leaf litter. Stained by humic acids, the water is almost free of minerals, '
        + 'and the canopy lets hardly any light through.',
      'In aquariums these species often accept slightly less acidic water, but it must stay very soft, above all for '
        + 'the delicate chocolate gourami.',
    ],
    vie: [
      '*Boraras*, which do not exceed 2 cm, and harlequin rasboras shoal among the roots. The chocolate gourami, which '
        + 'broods its eggs in its mouth, and the licorice gourami of Bangka Island stay in the vegetation; kuhli loaches '
        + 'gather by the dozen in the leaf litter. Gouramis breathe air at the surface.',
      'Plants are mostly *Cryptocoryne* adapted to shade and acidity; the catalogue has no peat-swamp species yet, and '
        + 'no invertebrate of the catalogue lives there.',
    ],
    aquarium: [
      'Very soft reverse-osmosis water, pH 5 to 6.5; catappa leaves and a little peat for colour and acidity.',
      'A fine sand bottom covered with dead leaves, roots and branches where kuhlis and *Boraras* find shelter.',
      'Dim light and floating plants; shade plants (*Cryptocoryne*, ferns) if you want some green.',
      'A stable, well-run-in tank without strong current, with a lid keeping warm, humid air above the water for the '
        + 'gouramis.',
    ],
    bac: 'A 120 L tank: a shoal of *Boraras merah*, a group of chocolate gouramis and kuhli loaches, in water at pH 5.8 '
      + 'and 2 °dGH. Kuhlis need at least 120 L, and chocolate gouramis very soft water and a well-established tank.',
    legendes: {
      'tourbieres-asie-1.jpg': 'The Sebangau River and its riverside peat forest near Palangka Raya (Central Kalimantan, '
        + 'Borneo).',
      'tourbieres-asie-2.jpg': 'Black water in a peat swamp forest in Selangor, Malaysia.',
      'tourbieres-asie-3.jpg': 'A black-water river winds through the peat forest in Kalimantan.',
      'tourbieres-asie-4.jpg': 'Pandanus (rasau) on the black water in Sebangau National Park.',
      'tourbieres-asie-bac-1.jpg': 'Asian black-water biotope tank with a samurai gourami (*Sphaerichthys vaillanti*), '
        + 'a cousin of the chocolate gourami.',
    },
  },

  'sri-lanka': {
    nom: 'Wet zone streams of Sri Lanka',
    region: 'South-western Sri Lanka',
    type: 'Shaded streams',
    resume: 'Cool, shaded streams under the rainforest of the island\'s south-west, refuge of barbs and rasboras found '
      + 'nowhere else, and of Wendt\'s cryptocoryne.',
    milieu: [
      'South-western Sri Lanka, the "wet zone", receives 2,000 to 3,000 mm of rain a year and was once covered by '
        + 'lowland rainforest. Its streams run down from the hills, such as those of the Sinharaja Forest Reserve, into '
        + 'the Kelani, Kalu, Gin and Nilwala basins.',
      'The cherry barb lives in heavily shaded, shallow, slow-flowing rivulets over silt covered with leaves; the '
        + 'vateria flower rasbora prefers clear, cool, calm streams, and the black ruby barb clear water over gravel or '
        + 'sand, up to 300 m above sea level.',
    ],
    eau: [
      'The profiles of these fish describe clear, soft to moderately soft water, slightly acidic to neutral (pH 6 to 7 '
        + 'for the cherry barb) and rather cool for the tropics: 22 to 27 °C, in the shade of the forest.',
    ],
    vie: [
      'Three fish of the catalogue are endemic to this zone: the cherry barb (*Puntius titteya*), the vateria flower '
        + 'rasbora (*Rasboroides vaterifloris*) and the black ruby barb (*Pethia nigrofasciata*). They live in shoals; '
        + 'the vateria flower rasbora eats insects that fall into the water and detritus.',
      'Wendt\'s cryptocoryne and *Aponogeton crispus*, a plant of seasonal pools, are native to the island. No '
        + 'invertebrate of the catalogue lives there.',
    ],
    aquarium: [
      'A bottom of sand and silt, dead leaves, roots and a few pebbles.',
      'Clumps of cryptocoryne in the foreground and an *Aponogeton* at the back; medium, diffused light.',
      'Soft to moderately soft water, pH 6 to 7, 23 to 26 °C, and a gentle current.',
      'Shoals of at least eight fish per species; the sensitive vateria flower rasbora needs a well-established tank.',
    ],
    bac: 'A 150 L tank with the three endemic fish in shoals of eight, Wendt\'s cryptocorynes and an *Aponogeton '
      + 'crispus*.',
    legendes: {
      'sri-lanka-1.jpg': 'A small creek of the Kelani basin at Kitulgala: slow, stained water and forested banks.',
      'sri-lanka-2.jpg': 'A stream in the Sinharaja Forest Reserve.',
      'sri-lanka-3.jpg': 'The Kataran Oya at Kitulgala, in the Kelani basin.',
    },
  },

  floride: {
    nom: 'Springs and marshes of Florida',
    region: 'Florida, United States',
    type: 'Springs and marshes',
    resume: 'Crystal-clear spring rivers and grassy marshes on limestone: a subtropical biotope home to the Everglades '
      + 'pygmy sunfish, the flagfish and the Florida crayfish.',
    milieu: [
      'Florida rests on a thick bed of limestone, that of the Floridan aquifer. Rainwater seeps into it, dissolves the '
        + 'rock and flows out through hundreds of springs (the USGS counted 320) feeding clear rivers such as the '
        + 'Ichetucknee. Further south, the Everglades are a vast plain of grassy marshes, sloughs and ponds.',
      'The climate is subtropical: marsh water cools down in winter, while spring water keeps an almost constant '
        + 'temperature, around 21 °C in the north of the state and 24 °C in central Florida.',
    ],
    eau: [
      'Coming from limestone, the water is hard and alkaline. In the Ichetucknee River, 25 USGS samples taken between '
        + '1966 and 1993 give a pH of 6.5 to 8.4 (median 7.8) and a hardness of 140 to 160 mg/L as CaCO₃, that is 7.8 '
        + 'to 9 °dGH; conductivity was 268 to 278 µS/cm in autumn 2026.',
      'It is the opposite of the Rio Negro: mineral-rich, clear, calcium-rich water in which plants grow well in full '
        + 'light.',
    ],
    vie: [
      'The fish are small and suited to shallow, plant-choked water: the Everglades pygmy sunfish (3 cm) spawns in '
        + 'vegetation, preferably on hornwort; the flagfish lives on the peninsula; the least killifish, one of the '
        + 'smallest livebearers, and the eastern mosquitofish stay near the surface; the sailfin molly also lives in '
        + 'brackish coastal water.',
      'Plants abound: *Hemianthus glomeratus*, native to Florida, *Bacopa caroliniana*, *Ludwigia*, *Sagittaria '
        + 'subulata*, *Nymphoides aquatica*, all recorded in Florida according to GBIF. The Florida crayfish '
        + '(*Procambarus alleni*) is endemic to Florida; its bright blue colour is a form selected in captivity.',
    ],
    aquarium: [
      'Moderately hard, slightly alkaline water (pH 7 to 8), cool for a tropical tank: 20 to 24 °C.',
      'Plenty of plants and good light: *Hemianthus*, *Bacopa* and *Sagittaria*, hornwort at the surface.',
      'Small fish among themselves: the shy Everglades pygmy sunfish does not hold its own against lively fish.',
      'The Florida crayfish in a separate tank: it catches small fish and cuts plants.',
    ],
    bac: 'A planted 80 L tank for a group of Everglades pygmy sunfish and least killifish, at 22 °C and pH 7.4, with '
      + '*Hemianthus glomeratus*, *Bacopa caroliniana*, *Sagittaria subulata* and hornwort.',
    legendes: {
      'floride-1.jpg': 'The Anhinga Trail from the air, in Everglades National Park: ponds and grassy marshes of Taylor '
        + 'Slough.',
      'floride-2.jpg': 'The spring-fed Ichetucknee River: crystal-clear water and submerged plant beds.',
      'floride-3.jpg': 'The Everglades from the air: marshland as far as the eye can see.',
      'floride-4.jpg': 'Plant beds and floating leaves in the Ichetucknee River.',
    },
  },
};

export default textes;

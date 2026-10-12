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
        + 'recorded in Cameroon according to GBIF; *Crinum calamistratum* is known only from rivers in Cameroon. The '
        + 'water fern *Ceratopteris cornuta* and *Ottelia ulvifolia*, with broad wavy leaves, grow in the calm waters of '
        + 'the region.',
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
      'Plants are mostly *Cryptocoryne* adapted to shade and acidity, such as *C. longicauda*, recorded in the forest '
        + 'streams of Borneo according to GBIF; the bladderwort *Utricularia aurea*, a rootless carnivorous plant, floats '
        + 'in still water. No invertebrate of the catalogue lives there.',
    ],
    aquarium: [
      'Very soft reverse-osmosis water, pH 5 to 6.5; catappa leaves and a little peat for colour and acidity.',
      'A fine sand bottom covered with dead leaves, roots and branches where kuhlis and *Boraras* find shelter.',
      'Dim light and floating plants; shade plants (*Cryptocoryne*, ferns) if you want some green.',
      'A stable, well-run-in tank without strong current, with a lid keeping warm, humid air above the water for the '
        + 'gouramis.',
    ],
    bac: 'A 120 L tank: a shoal of *Boraras merah*, a group of chocolate gouramis, kuhli loaches and a *Cryptocoryne '
      + 'longicauda*, in water at pH 5.8 and 2 °dGH. Kuhlis need at least 120 L, and chocolate gouramis very soft water and a well-established tank.',
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
      'Wendt\'s cryptocoryne and *Aponogeton crispus*, a plant of seasonal pools, are native to the island, like '
        + 'other plants of its streams (*Cryptocoryne beckettii*, *C. walkeri*, *Lagenandra thwaitesii*) that do not '
        + 'yet have a free photo to enter the catalogue. No invertebrate of the catalogue lives there.',
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

  xingu: {
    nom: 'Xingu rapids, the river of plecos',
    region: 'Pará, Brazil',
    type: 'Clear-water rapids',
    resume: 'A clear-water tributary of the Amazon tumbling over rock slabs, in warm, highly oxygenated water: the Volta '
      + 'Grande, the only refuge of the zebra pleco.',
    milieu: [
      'The Xingu flows down from the Brazilian plateau to the Amazon, which it joins in the state of Pará. Downstream '
        + 'of Altamira it makes a great bend, the **Volta Grande**, through a series of rapids: channels, rocky islands, '
        + 'slabs and boulders resting on sand, between which the water speeds up.',
      'It is a **clear-water** river, transparent and poor in sediment, very different from the black water of the Rio '
        + 'Negro. Since 2016, the Belo Monte dam has diverted much of the flow of the Volta Grande, the only known '
        + 'habitat of the zebra pleco, listed as critically endangered by the IUCN.',
    ],
    eau: [
      'Rodrigues-Filho and colleagues (2015) monitored the water quality of the basin from 2012 to 2014, before the '
        + 'dam was filled. At the river stations, the pH ranged from 5.0 to 8.4 (6.95 on average), conductivity stayed '
        + 'very low, at 10 to 80 µS/cm (30 on average), and the water was warm: 27 to 33 °C. It is also transparent and '
        + 'well oxygenated.',
      'In the aquarium, aim for soft, near-neutral, warm water with strong water movement: rapids fish cope poorly with '
        + 'a lack of oxygen.',
    ],
    vie: [
      'The Xingu is famous for its loricariids, known to aquarists by "L" numbers. The zebra pleco (*Hypancistrus '
        + 'zebra*, L46), mostly carnivorous, lives in the cracks of the Volta Grande rocks; *Baryancistrus chrysolomus* '
        + '(L47) grazes algae under the large slabs; *Scobinancistrus aureatus* and *Pseudacanthicus pirarara* shelter '
        + 'in deep crevices. *Peckoltia vittata* also lives in other Amazon tributaries. Above them, *Acnodon normani*, '
        + 'a relative of the pacus that also tears scales off other fish, swims in groups.',
      'In the current, the only underwater plants are podostemads, which cling flat to the rocks of the rapids and '
        + 'cannot be grown in aquariums. No plant or invertebrate of the catalogue lives there.',
    ],
    aquarium: [
      'Stacked flat stones with cracks and narrow caves (slate, clay tubes): one shelter per pleco.',
      'A bottom of pale sand and pebbles, little wood, and no plants, or epiphytes tied to the rocks.',
      'Soft, warm water (27 to 30 °C), pH 6.5 to 7.5, with a circulation pump and strong oxygenation.',
      'Protein-rich prey and pellets for the zebra pleco, plant-based food for *Baryancistrus*.',
    ],
    bac: 'A 400 L tank, mostly for the floor area, with one zebra pleco and one *Baryancistrus chrysolomus*, which their '
      + 'profiles describe as solitary and territorial. pH 6.8 and 28 °C lie within their shared ranges.',
    legendes: {
      'xingu-1.jpg': 'Xingu rapids near Vitória do Xingu (Pará): rocks, channels and clear water.',
      'xingu-2.jpg': 'The Xingu between the two sites of the Belo Monte dam.',
      'xingu-3.jpg': 'A sandy beach on the Xingu: the clear water shows the bottom.',
    },
  },

  'lac-tanganyika': {
    nom: 'Lake Tanganyika, the rocky shores',
    region: 'Tanzania, DR Congo, Burundi, Zambia',
    type: 'Great Rift lake',
    resume: 'One of the oldest lakes in the world: very hard, alkaline water, rock rubble where *Tropheus*, '
      + '*Julidochromis* and lamprologines live, and shoals of *Cyprichromis* in open water.',
    milieu: [
      'Lake Tanganyika stretches for nearly 670 km along the African Rift, between Tanzania, the Democratic Republic of '
        + 'the Congo, Burundi and Zambia. Nearly 1,500 m deep, it is the second deepest lake in the world after Baikal, '
        + 'but only its surface waters hold enough oxygen for fish.',
      'Its shores alternate sandy beaches, plant beds, beds of empty shells and rocky coasts. On the latter, boulders '
        + 'and slabs pile up to several tens of metres deep, and each species has its own zone: the algae-covered '
        + 'surface of the rocks, the cracks, the caves or the open water above.',
    ],
    eau: [
      'According to Talling and Talling (1965), the surface water has a conductivity of 606 to 620 µS/cm, three times '
        + 'that of Lake Malawi. It is very rich in magnesium: 10.4 to 12.5 °dGH for a carbonate hardness of 16.9 to '
        + '19.1 °dKH. Plisnier and colleagues (1996) measured a mean surface pH of 9.01 to 9.06 over a year, at '
        + 'Bujumbura, Kigoma and Mpulungu.',
      'The lake water is also very stable and almost free of nitrate. In the aquarium, the main things to reproduce '
        + 'are the high pH and the hardness, with regular water changes: these cichlids tolerate nitrogen waste poorly.',
    ],
    vie: [
      '*Tropheus* graze the algae film of shallow rocks in groups. *Julidochromis* and the lemon cichlid '
        + '(*Neolamprologus leleupi*) slip into the cracks, the fairy cichlid (*N. brichardi*) lives in colonies where '
        + 'the young of earlier broods help guard the fry, and the very flat *Altolamprologus calvus* hunts in the '
        + 'crevices. *Cyprichromis leptosoma* shoals in open water along the drop-offs, the frontosa (*Cyphotilapia '
        + 'frontosa*) lives deeper, and *Synodontis petricola*, a small catfish, hides among the rocks.',
      'Beds of *Vallisneria* grow in sheltered bays and are recorded around the lake according to GBIF. The lake also '
        + 'holds endemic shrimps, crabs and snails, but none is in the catalogue.',
    ],
    aquarium: [
      'Rocks stacked securely up to the top of the tank, with narrow cracks for *Julidochromis* and lamprologines, and '
        + 'fine sand on the bottom.',
      'Hard, alkaline water, pH 8 to 9, 24 to 27 °C; coral sand or Rift lake salts help hold the pH and hardness.',
      'Few fish for the volume, and species from different zones (cracks, rock surface, open water) to spread out '
        + 'the territories.',
      'Frequent water changes and medium lighting, which lets algae grow on the rocks.',
    ],
    bac: 'A 300 L tank: a pair of *Julidochromis regani*, a pair of lemon cichlids, a pair of *Altolamprologus calvus* '
      + 'and four *Synodontis petricola*, in water at pH 8.5, 12 °dGH and 25 °C. *Vallisneria* is left out: its '
      + 'profile does not go above pH 8.',
    legendes: {
      'lac-tanganyika-1.jpg': 'The lakeshore in Gombe Stream National Park, Tanzania: pebbles, clear water and forest '
        + 'down to the edge.',
      'lac-tanganyika-2.jpg': 'Scientific dive over a sand and rock bottom in the lake.',
      'lac-tanganyika-3.jpg': 'Young *Boulengerochromis microlepis*, the largest cichlid in the world, leave their nest '
        + 'at night under their parents\' guard.',
      'lac-tanganyika-bac-1.jpg': 'The large Lake Tanganyika tank of the Gliwice palm house, Poland: stacked rocks and '
        + 'frontosas.',
    },
  },

  'tanganyika-coquilles': {
    nom: 'Lake Tanganyika, the shell beds',
    region: 'Tanzania, DR Congo, Zambia',
    type: 'Shell beds',
    resume: 'On the sandy floor of the lake, fields of empty snail shells serve as shelter and nest for tiny cichlids, '
      + 'the shell dwellers.',
    milieu: [
      '*Neothauma tanganyicense*, a large snail endemic to the lake, leaves behind a thick shell that does not dissolve '
        + 'in the alkaline water. On some sandy bottoms, between about 10 and 45 m deep, these shells pile up into vast '
        + 'beds, where they are almost the only shelter.',
      'Several lamprologines have specialised in these shells: they hide, spawn and raise their fry in them. Males of '
        + '*Lamprologus callipterus*, a larger species, even carry shells to build heaps where their females spawn.',
    ],
    eau: [
      'It is Lake Tanganyika water: a conductivity of 606 to 620 µS/cm, 10.4 to 12.5 °dGH and 16.9 to 19.1 °dKH '
        + 'according to Talling and Talling (1965), and a pH close to 9 at the surface (Plisnier and colleagues, 1996).',
      'The profiles of these fish give a pH of 7.5 to 9.5 and hard water: Rift lake water suits them.',
    ],
    vie: [
      '*Neolamprologus multifasciatus*, which does not exceed 4 cm, is among the smallest cichlids: its colonies cover '
        + 'entire beds, each fish defending a few shells and a few centimetres around them. *N. similis*, whose pale '
        + 'bars continue onto the head, lives the same way. The ocellated shell dweller (*Lamprologus ocellatus*) is '
        + 'more solitary: it buries its shell and fiercely defends the entrance.',
      'No plant grows on these bottoms, and no invertebrate of the catalogue lives there.',
    ],
    aquarium: [
      'A fairly deep layer of fine sand, which the fish dig constantly, and many more shells than fish; Roman snail '
        + '(escargot) shells replace those of *Neothauma*.',
      'A small tank is enough: 80 to 100 L for a colony of a single species.',
      'Hard, alkaline water, pH 8 to 9, 24 to 27 °C.',
      'One shell-dwelling species per tank; in a larger tank, neighbours from other zones, such as *Cyprichromis* in '
        + 'open water.',
      'Live or frozen prey (brine shrimp, cyclops): dry food alone is not enough.',
    ],
    bac: 'An 80 L tank for a colony of five *Neolamprologus similis*, in water at pH 8.5 and 12 °dGH, with at least two '
      + 'shells per fish and more females than males.',
    legendes: {
      'tanganyika-coquilles-1.jpg': 'A small cichlid hiding in an empty snail shell among the sponges of the lake '
        + 'floor, in Zambia.',
      'tanganyika-coquilles-bac-1.jpg': '*Neolamprologus multifasciatus* among a heap of shells, in an aquarium.',
      'tanganyika-coquilles-bac-2.jpg': 'A male *N. multifasciatus* guarding its territory.',
    },
  },

  'ghats-occidentaux': {
    nom: 'Rivers of the Western Ghats',
    region: 'Kerala and Karnataka, India',
    type: 'Monsoon rivers',
    resume: 'Rocky rivers running down the mountains of southwestern India and swelling with each monsoon: home of '
      + 'the Denison barb and the Malabar pufferfish.',
    milieu: [
      'The Western Ghats form a mountain range parallel to the southwest coast of India, one of the great biodiversity '
        + 'hotspots of the planet. The southwest monsoon brings most of the rain, from June to September: Kerala '
        + 'rivers such as the Chaliyar, the Chalakudy or the Periyar swell, then fall again, leaving pools between the '
        + 'rocks in the dry season.',
      'In their middle course, clear water runs over slabs, pebbles and sand under dense vegetation. Further down, the '
        + 'rivers slow down in the coastal plains and the backwaters, where the water turns brackish.',
    ],
    eau: [
      'The profiles of these fish describe clear, highly oxygenated water, soft to moderately hard, pH 6.5 to 7.8, '
        + 'and cool for the tropics: 15 to 25 °C for the Denison barb.',
      'The monsoon renews the water every year, with sudden floods; in the dry season, isolated pools warm up.',
    ],
    vie: [
      'The Denison barb (*Sahyadria denisonii*), listed as endangered by the IUCN, gathers in rocky pools; the '
        + 'filament barb (*Dawkinsia filamentosa*) shoals down to the coastal plains, and the Arulius barb '
        + '(*D. arulius*) lives on the eastern slope, in the Kaveri basin. The Malabar pufferfish (*Carinotetraodon '
        + 'travancoricus*) favours slow, densely vegetated water, and the striped panchax (*Aplocheilus lineatus*) '
        + 'waits for prey just below the surface.',
      '*Cryptocoryne spiralis* and *Lagenandra meeboldii* grow on the banks and in the riverbeds, spending the dry '
        + 'season out of the water; *Aponogeton natans* and round-leaf rotala occupy pools and still water. All are '
        + 'recorded in the region according to GBIF.',
    ],
    aquarium: [
      'A bottom of sand and pebbles, rounded stones and a few roots; plants along the sides and open swimming space '
        + 'in the middle.',
      'Clear, soft to moderately hard water, pH 6.5 to 7.5, between 22 and 25 °C, well oxygenated and with a moderate '
        + 'current.',
      'A large tank: Denison and filament barbs swim constantly and live in shoals of 8 to 10.',
      'The Malabar pufferfish, a fin nipper, in its own planted tank.',
    ],
    bac: 'A 450 L tank with a shoal of eight Denison barbs and ten filament barbs, *Cryptocoryne spiralis*, a '
      + '*Lagenandra meeboldii* and rotala, in water at pH 7 and 23 °C. Their profiles ask for at least 300 L for each '
      + 'of these barbs.',
    legendes: {
      'ghats-occidentaux-1.jpg': 'The Chalakudy in the Vettilapara area: boulders, rapids and Ghats forest in the mist.',
      'ghats-occidentaux-2.jpg': 'The Chaliyar near Nilambur, at the foot of the Ghats.',
      'ghats-occidentaux-3.jpg': 'Slabs and pools of the Chalakudy at Thumboormuzhi.',
    },
  },

  usumacinta: {
    nom: 'Rivers of the Usumacinta basin',
    region: 'Mexico (Chiapas, Tabasco), Guatemala',
    type: 'Large limestone river',
    resume: 'The largest river in Mesoamerica, with warm, limestone water: the realm of the firemouth cichlid, '
      + 'Salvin\'s cichlid, swordtails and mollies.',
    milieu: [
      'The Usumacinta rises in the highlands of Guatemala, forms part of the border with Chiapas, cuts through the Boca '
        + 'del Cerro canyon, then spreads out over the marshy plains of Tabasco before joining the Grijalva and the '
        + 'Gulf of Mexico.',
      'Its basin largely drains limestone, like the neighbouring Petén and Yucatán. Habitats are very varied: the main '
        + 'channel and its sandbanks, clear tributaries, lagoons, marshes and weed-choked ditches, where most of the '
        + 'region\'s aquarium fish live.',
    ],
    eau: [
      'Salcedo-Garduño and colleagues (2022) analysed the water of the lower Usumacinta, in Tabasco, from June 2017 to '
        + 'May 2018: a pH of 7.5 to 8.9 and a temperature of 23 to 33.9 °C, warmest in May, at the end of the dry '
        + 'season. Dissolved solids also rose in the dry season.',
      'The profiles of the region\'s fish call for neutral to alkaline, moderately hard water; the Atlantic molly '
        + 'wants harder water than the cichlids and swordtails.',
    ],
    vie: [
      'The firemouth cichlid (*Thorichthys meeki*), Salvin\'s cichlid (*Trichromis salvini*) and the Jack Dempsey '
        + '(*Rocio octofasciata*) defend territories near the bottom; Salvin\'s cichlid also hunts in the current. '
        + 'Swordtails (*Xiphophorus hellerii*), platies (*X. maculatus*) and the Atlantic molly (*Poecilia mexicana*) '
        + 'live in groups in calm, vegetated water; the sailfin molly (*P. velifera*) only reaches the lower basin, '
        + 'near the coastal lagoons.',
      'The plant beds mix hornwort, southern naiad and water stargrass, with floating plants such as *Ludwigia '
        + 'helminthorrhiza* and pennyworts on the banks, all recorded in the basin according to GBIF.',
    ],
    aquarium: [
      'A bottom of sand and gravel, a few limestone rocks and roots; the cichlids dig.',
      'Neutral to alkaline water (pH 7.5 to 8), moderately hard, between 24 and 28 °C.',
      'Hardy plants in clumps (hornwort, water stargrass) and floating plants, where livebearer fry hide.',
      'The territorial cichlids apart from the peaceful livebearers: a pair of firemouths in at least 140 L, or a tank '
        + 'of swordtails and platies.',
    ],
    bac: 'A 150 L tank for the livebearers: four swordtails and four platies (one male for three females), with '
      + 'hornwort, water stargrass and naiad, at pH 7.6 and 14 °dGH. The Atlantic molly is left out: its profile asks '
      + 'for harder water than the swordtails\'.',
    legendes: {
      'usumacinta-1.jpg': 'The Usumacinta canyon at Boca del Cerro, near Tenosique (Tabasco), seen by drone.',
      'usumacinta-2.jpg': 'The Usumacinta near Yaxchilán: Chiapas (Mexico) on the left, Guatemala on the right.',
      'usumacinta-3.jpg': 'The river in the plains of Tabasco, at Balancán.',
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

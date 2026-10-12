/**
 * Textes des biotopes en français (mêmes clés en anglais et en japonais). Balisage léger du guide pratique :
 * *italique*, **gras**, [lien](url). Les chiffres viennent des mesures et des sources de index.js.
 */

const textes = {
  'rio-negro': {
    nom: 'Rio Negro, les eaux noires d\'Amazonie',
    region: 'Brésil, Colombie, Venezuela',
    type: 'Eaux noires',
    resume: 'Un affluent de l\'Amazone aux eaux couleur de thé, très acides et presque sans minéraux, où vivent le '
      + 'cardinalis, les poissons-crayons et les poissons-hachettes.',
    milieu: [
      'Le rio Negro draine des forêts posées sur des sols sableux très lessivés. L\'eau de pluie traverse une épaisse '
        + 'litière de feuilles et se charge de substances humiques qui la colorent de brun foncé à noir ; le fleuve, '
        + 'peu érosif, ne transporte presque pas de sédiments. C\'est le modèle des **eaux noires** amazoniennes, par '
        + 'opposition aux **eaux blanches** boueuses du Solimões et aux **eaux claires** de rivières comme le Tapajós.',
      'À Manaus, le rio Negro rejoint le Solimões pour former l\'Amazone : les deux eaux coulent côte à côte avant de '
        + 'se mélanger, sur une centaine de kilomètres en aval. Chaque année, la crue inonde la forêt riveraine, '
        + 'l\'**igapó**, et les poissons se dispersent entre les troncs, les racines et les feuilles mortes.',
    ],
    eau: [
      'Küchler et ses collègues ont mesuré dans le bassin du Negro un pH de 3,9 à 6,1 (3,89 dans le rio Téa), contre '
        + '6,9 à 7 dans le Solimões, et une conductivité de 9 à 29 µS/cm, trois à dix fois plus faible. L\'acidité '
        + 'vient surtout des acides humiques et fulviques dissous ; le calcium et le magnésium sont presque absents.',
      'Une eau aussi pauvre nourrit peu de vie aquatique. En aquarium, les espèces de ce biotope supportent une eau un '
        + 'peu plus dure, mais c\'est dans une eau douce et acide que la plupart se reproduisent.',
    ],
    vie: [
      'On y trouve surtout de petits characidés qui vivent en bancs (cardinalis, nez rouges, tétras de Socolof), des '
        + 'poissons-crayons et des poissons-hachettes qui chassent les insectes en surface, des *Corydoras* sur la '
        + 'litière, et des cichlidés : cichlidé damier, scalaire altum du haut rio Negro et *Satanoperca daemon* sur '
        + 'les fonds sableux.',
      'Les plantes immergées sont rares : la canopée, l\'eau sombre et le manque de minéraux limitent leur croissance. '
        + 'Là où la lumière passe poussent des plantes flottantes et quelques espèces d\'eau douce et acide, comme '
        + '*Tonina fluviatilis*, *Mayaca fluviatilis* ou *Cabomba aquatica*, toutes observées dans le bassin d\'après '
        + 'GBIF. Aucun invertébré du catalogue n\'y vit.',
    ],
    aquarium: [
      'Une eau très douce : eau osmosée ou de pluie filtrée, pH 5 à 6,5 et conductivité aussi basse que possible, y '
        + 'compris pour les changements d\'eau.',
      'Un sol de sable fin, des racines et des branches, et une couche de feuilles mortes (catappa, chêne) qui libère '
        + 'des tanins et teinte l\'eau.',
      'Une lumière faible, tamisée par des plantes flottantes. *Tonina* demande au contraire beaucoup de lumière et du '
        + 'CO₂ : elle a sa place dans un bac plus éclairé.',
      'Un couvercle bien fermé : les poissons-hachettes sautent.',
      'Une eau chaude (25 à 28 °C) et une filtration douce ; un pH stable compte plus qu\'une valeur précise.',
    ],
    bac: 'Un bac de 240 L pour un banc de cardinalis, des poissons-hachettes, des poissons-crayons nains, des '
      + '*Corydoras* d\'Adolfo et un couple de cichlidés damier, sous des plantes flottantes. Les *Corydoras* d\'Adolfo '
      + 'limitent la température à 26 °C.',
    legendes: {
      'rio-negro-1.jpg': 'La Rencontre des eaux près de Manaus : l\'eau noire du rio Negro (en haut) longe l\'eau '
        + 'blanche, chargée de sédiments, du Solimões.',
      'rio-negro-2.jpg': 'Parc national d\'Anavilhanas (Novo Airão, Amazonas) : forêt et grès au bord des eaux sombres '
        + 'du rio Negro.',
      'rio-negro-3.jpg': 'Un arbre les pieds dans l\'eau à Anavilhanas : à la saison des pluies, la forêt riveraine est '
        + 'inondée.',
      'rio-negro-bac-1.jpg': 'Bac biotope d\'eaux noires amazoniennes au zoo de Varsovie, avec un couple de scalaires '
        + '(*Pterophyllum* sp. « Manacapuru »).',
    },
  },

  'afrique-ouest': {
    nom: 'Ruisseaux forestiers du golfe de Guinée',
    region: 'Nigeria, Cameroun, Gabon',
    type: 'Ruisseaux de forêt',
    resume: 'Des criques, des marais et des ruisseaux sous la forêt humide côtière, du delta du Niger au Gabon : le '
      + 'pays du kribensis, des killis *Fundulopanchax* et de l\'Anubias nain.',
    milieu: [
      'Le long du golfe de Guinée, la forêt humide côtière est parcourue de criques, de ruisseaux et de marais. Dans '
        + 'les zones basses, l\'eau est calme et envahie de plantes ; certaines mares et marais à raphias s\'assèchent '
        + 'de temps en temps. Sur les pentes, comme autour du mont Cameroun, les ruisseaux courent sur les pierres.',
      'Deux milieux se côtoient donc : les eaux calmes et peu profondes où vivent les *Pelvicachromis* et les killis, '
        + 'et les ruisseaux au courant soutenu, où l\'Anubias nain et la fougère *Bolbitis* s\'accrochent aux pierres '
        + 'et au bois, et où la crevette balais se nourrit des particules apportées par le courant.',
    ],
    eau: [
      'Les fiches de ces espèces, tirées de FishBase et de Seriously Fish, décrivent une eau douce, légèrement acide à '
        + 'neutre et chaude : 22 à 26 °C pour les killis *Fundulopanchax*, une eau proche de la neutralité et 24 à '
        + '30 °C pour la crevette balais.',
      'Près des côtes, certaines populations de kribensis vivent en eau saumâtre. La crevette balais en a besoin pour '
        + 'ses larves, qui se développent en eau saumâtre ou en mer : elle ne se reproduit pas en eau douce.',
    ],
    vie: [
      'Le kribensis (*Pelvicachromis pulcher*) et son cousin *P. taeniatus* pondent dans une grotte et gardent leurs '
        + 'alevins. Les killis *Fundulopanchax gardneri* et *F. sjostedti*, et *Aphyosemion australe* plus au sud, '
        + 'vivent dans les eaux calmes de la forêt. Le tétra à grandes écailles forme des bancs dans les ruisseaux du '
        + 'sud-ouest du Nigeria, le poisson-papillon guette les insectes en surface et le poisson-roseau, un polyptère '
        + 'allongé, fouille les fonds végétalisés.',
      'L\'Anubias nain, la *Bolbitis heudelotii* et *Crinum natans*, qui pousse dans la vase des cours d\'eau '
        + 'permanents, sont observés au Cameroun d\'après GBIF ; *Crinum calamistratum* n\'est connu que de rivières '
        + 'du Cameroun.',
    ],
    aquarium: [
      'Un sol de sable, des pierres et des racines ; l\'Anubias et la *Bolbitis* se fixent sur le décor plutôt que '
        + 'dans le sol.',
      'Une eau douce, légèrement acide à neutre (pH 6 à 7), entre 24 et 26 °C.',
      'Un courant marqué sur une partie du bac pour la crevette balais, et une nourriture fine en suspension.',
      'Des grottes (noix de coco, pots retournés) si l\'on garde des *Pelvicachromis*, qui défendent un territoire '
        + 'autour.',
      'Un couvercle : les killis et le poisson-papillon sautent.',
    ],
    bac: 'Un bac de 200 L : un banc de tétras à grandes écailles, un harem de killis Gardneri (un mâle et trois '
      + 'femelles), trois crevettes balais, de l\'Anubias nain, de la *Bolbitis* et un *Crinum natans*. Le kribensis, '
      + 'territorial, harcèlerait ces espèces paisibles : il vit mieux dans son propre bac.',
    legendes: {
      'afrique-ouest-1.jpg': 'Un cours d\'eau rocheux près des chutes de Mboué, au Cameroun.',
      'afrique-ouest-2.jpg': 'Une crique à Idenau, dans la région du Sud-Ouest du Cameroun, au pied du mont Cameroun.',
    },
  },

  'lac-malawi': {
    nom: 'Lac Malawi, la côte rocheuse',
    region: 'Malawi, Mozambique, Tanzanie',
    type: 'Grand lac du Rift',
    resume: 'Des éboulis de roches couverts d\'algues dans une eau claire et alcaline : le domaine des mbunas, des '
      + 'cichlidés qu\'on ne trouve dans aucun autre lac.',
    milieu: [
      'Le lac Malawi occupe une fosse du Rift est-africain, entre le Malawi, le Mozambique et la Tanzanie. Ses rives '
        + 'alternent plages de sable, herbiers et côtes rocheuses, où des blocs de toutes tailles s\'empilent sous '
        + 'l\'eau.',
      'Beaucoup de mbunas ne vivent que sur un récif ou autour d\'une île : *Chindongo saulosi* seulement au récif de '
        + 'Taiwanee, près de l\'île de Chizumulu, *C. demasoni* aux rochers de Pombo, et la forme jaune du '
        + '*Labidochromis caeruleus* entre Charo et Lion\'s Cove. Entre les rochers et le sable, la zone intermédiaire '
        + 'est le domaine des *Aulonocara*, qui se nourrissent au-dessus du sable.',
    ],
    eau: [
      'D\'après les mesures compilées par Talling et Talling (1965), l\'eau de surface du lac a un pH de 8,5 à 8,6 et '
        + 'une conductivité de 210 à 220 µS/cm. Elle est alcaline mais peu dure : 3,4 à 4,8 °dGH pour une dureté '
        + 'carbonatée de 6,6 à 7,2 °dKH, bien moins que le lac Tanganyika, qui dépasse 600 µS/cm.',
      'En aquarium, on garde souvent les mbunas dans une eau plus dure, ce que reflètent leurs fiches : ils s\'en '
        + 'accommodent, à condition que le pH reste nettement alcalin et stable.',
    ],
    vie: [
      'Les mbunas (*Maylandia*, *Labidochromis*, *Chindongo*, *Melanochromis*, *Iodotropheus*) raclent le film '
        + 'd\'algues et de micro-organismes qui couvre les rochers, l\'**aufwuchs**. Les mâles défendent quelques '
        + 'rochers et beaucoup d\'espèces vivent en harem. Au-dessus, *Copadichromis borleyi* forme des bancs en pleine '
        + 'eau ; *Sciaenochromis fryeri* et *Nimbochromis venustus* chassent de petits poissons.',
      'Les plantes manquent sur les côtes rocheuses ; plus loin, sur les fonds calmes, poussent des herbiers de '
        + '*Vallisneria*, que fréquente aussi le *Labidochromis caeruleus*. Aucun invertébré du catalogue ne vit dans '
        + 'le lac.',
    ],
    aquarium: [
      'Des empilements de roches stables posés directement sur la vitre du fond, avant le sable, avec beaucoup de '
        + 'grottes et de recoins pour casser les territoires.',
      'Une eau alcaline et stable : pH 7,8 à 8,5, 24 à 27 °C ; un sable corallien ou un peu de bicarbonate aide à '
        + 'tenir le pH.',
      'Des espèces de couleurs différentes, en harem (un mâle pour trois femelles), pour répartir l\'agressivité et '
        + 'éviter les croisements.',
      'Une nourriture végétale (spiruline), proche de l\'aufwuchs qu\'ils broutent dans le lac.',
      'Peu de plantes : les mbunas mangent les feuilles tendres ; la *Vallisneria* résiste mieux.',
    ],
    bac: 'Un bac de 300 L pour trois mbunas peu à moyennement agressifs, en groupes de huit : *Labidochromis* jaune, '
      + 'cichlidé rouille et *Chindongo saulosi*. Le pH 8 et une eau plus dure que celle du lac reprennent les valeurs '
      + 'de leurs fiches.',
    legendes: {
      'lac-malawi-1.jpg': 'Mbunas aux rochers de Mitande, île de Thumbi West, dans le parc national du lac Malawi.',
      'lac-malawi-2.jpg': 'Mbunas broutant l\'aufwuchs sur une dalle rocheuse du lac.',
      'lac-malawi-3.jpg': 'Le récif de Taiwanee, près de l\'île de Chizumulu, seul endroit où vit *Chindongo saulosi*.',
      'lac-malawi-4.jpg': 'Une côte rocheuse du lac Malawi.',
      'lac-malawi-bac-1.jpg': 'Bac de cichlidés des grands lacs africains au zoo Artis d\'Amsterdam : roches empilées '
        + 'et sable.',
      'lac-malawi-bac-2.jpg': 'Bac de cichlidés du lac Malawi au Georgia Aquarium, à Atlanta.',
    },
  },

  'tourbieres-asie': {
    nom: 'Tourbières d\'eaux noires d\'Asie du Sud-Est',
    region: 'Malaisie, Sumatra, Bornéo',
    type: 'Tourbières',
    resume: 'Sous la forêt marécageuse, une eau brune et très acide, presque sans minéraux, peuplée de minuscules '
      + 'rasboras, de gouramis chocolat et de loches kuhli.',
    milieu: [
      'Dans les plaines de la péninsule Malaise, de Sumatra et de Bornéo, la forêt pousse sur un épais sol de tourbe : '
        + 'du bois et des feuilles qui ne se décomposent pas dans l\'eau stagnante. Les ruisseaux et les mares qui la '
        + 'traversent coulent lentement sous une canopée dense, sur un fond de feuilles, de branches et de racines.',
      'Ces forêts reculent devant les plantations de palmiers à huile et d\'hévéas, le drainage et les incendies de '
        + 'tourbe : plusieurs poissons de ce biotope ne survivent plus que dans des restes de forêt dégradés.',
    ],
    eau: [
      'Ng et Kottelat (1994) ont relevé un pH de 3,5 à 3,7 dans les tourbières de Selangor, en Malaisie, et de 4 à '
        + '5,5 dans des ruisseaux d\'eaux noires à la litière épaisse. Teintée par les acides humiques, l\'eau est '
        + 'presque dépourvue de minéraux, et la canopée y laisse à peine passer la lumière.',
      'En aquarium, ces espèces acceptent souvent une eau un peu moins acide, mais elle doit rester très douce, surtout '
        + 'pour le gourami chocolat, fragile.',
    ],
    vie: [
      'Les *Boraras*, qui ne dépassent pas 2 cm, et les rasboras arlequins forment des bancs entre les racines. Le '
        + 'gourami chocolat, qui incube ses œufs dans la bouche, et le gourami réglisse de l\'île de Bangka se tiennent '
        + 'dans la végétation ; les kuhlis se regroupent par dizaines dans la litière. Les gouramis '
        + 'respirent l\'air en surface.',
      'Les plantes sont surtout des *Cryptocoryne* adaptées à l\'ombre et à l\'acidité ; le catalogue n\'a pas encore '
        + 'd\'espèce de tourbière, et aucun invertébré du catalogue n\'y vit.',
    ],
    aquarium: [
      'Une eau osmosée, très douce, pH 5 à 6,5 ; des feuilles de catappa et un peu de tourbe pour la teinte et '
        + 'l\'acidité.',
      'Un fond de sable fin couvert de feuilles mortes, des racines et des branches où les kuhlis et les *Boraras* '
        + 'trouvent abri.',
      'Une lumière faible et des plantes flottantes ; des plantes d\'ombre (*Cryptocoryne*, fougères) si l\'on veut '
        + 'du vert.',
      'Un bac stable et bien établi, sans courant fort, avec un couvercle qui garde l\'air chaud et humide au-dessus '
        + 'de l\'eau pour les gouramis.',
    ],
    bac: 'Un bac de 120 L : un banc de *Boraras merah*, un groupe de gouramis chocolat et des kuhlis, dans une eau à '
      + 'pH 5,8 et 2 °dGH. Les kuhlis demandent au moins 120 L, et les gouramis chocolat une eau très douce et un bac '
      + 'bien établi.',
    legendes: {
      'tourbieres-asie-1.jpg': 'La rivière Sebangau et sa forêt riveraine sur tourbe, près de Palangka Raya (Kalimantan '
        + 'central, Bornéo).',
      'tourbieres-asie-2.jpg': 'Eau noire dans une forêt marécageuse de tourbe du Selangor, en Malaisie.',
      'tourbieres-asie-3.jpg': 'Une rivière d\'eau noire serpente dans la forêt de tourbe, à Kalimantan.',
      'tourbieres-asie-4.jpg': 'Pandanus (rasau) au bord de l\'eau noire, dans le parc national de Sebangau.',
      'tourbieres-asie-bac-1.jpg': 'Bac biotope d\'eaux noires asiatiques avec un gourami samouraï (*Sphaerichthys '
        + 'vaillanti*), cousin du gourami chocolat.',
    },
  },

  'sri-lanka': {
    nom: 'Ruisseaux de la zone humide du Sri Lanka',
    region: 'Sud-ouest du Sri Lanka',
    type: 'Ruisseaux ombragés',
    resume: 'Des ruisseaux frais et ombragés sous la forêt humide du sud-ouest de l\'île, refuge de barbus et de '
      + 'rasboras qui ne vivent nulle part ailleurs, et de la Cryptocoryne de Wendt.',
    milieu: [
      'Le sud-ouest du Sri Lanka, la « zone humide », reçoit 2 000 à 3 000 mm de pluie par an et portait autrefois '
        + 'une forêt tropicale de basse altitude. Ses ruisseaux descendent des collines, comme ceux de la réserve '
        + 'forestière de Sinharaja, vers les bassins de la Kelani, de la Kalu, de la Gin et de la Nilwala.',
      'Le barbu cerise fréquente des rigoles très ombragées, peu profondes et lentes, sur un fond de limon couvert de '
        + 'feuilles ; le rasbora perle de feu préfère des ruisseaux clairs, frais et calmes, et le barbu à tête '
        + 'pourpre les eaux claires sur gravier ou sable, jusqu\'à 300 m d\'altitude.',
    ],
    eau: [
      'Les fiches de ces poissons décrivent une eau claire, douce à moyennement douce, légèrement acide à neutre '
        + '(pH 6 à 7 pour le barbu cerise) et plutôt fraîche pour les tropiques : 22 à 27 °C, à l\'ombre de la forêt.',
    ],
    vie: [
      'Trois poissons du catalogue sont endémiques de cette zone : le barbu cerise (*Puntius titteya*), le rasbora '
        + 'perle de feu (*Rasboroides vaterifloris*) et le barbu à tête pourpre (*Pethia nigrofasciata*). Ils vivent '
        + 'en bancs ; le rasbora perle de feu mange des insectes tombés à l\'eau et des débris.',
      'La Cryptocoryne de Wendt et l\'*Aponogeton crispus*, une plante des mares saisonnières, sont originaires de '
        + 'l\'île. Aucun invertébré du catalogue n\'y vit.',
    ],
    aquarium: [
      'Un fond de sable et de limon, des feuilles mortes, des racines et quelques galets.',
      'Des massifs de Cryptocoryne au premier plan et un *Aponogeton* à l\'arrière ; une lumière moyenne et tamisée.',
      'Une eau douce à moyennement douce, pH 6 à 7, 23 à 26 °C, et un courant léger.',
      'Des bancs d\'au moins huit poissons par espèce ; le rasbora perle de feu, sensible, demande un bac bien établi.',
    ],
    bac: 'Un bac de 150 L avec les trois poissons endémiques en bancs de huit, des Cryptocoryne de Wendt et un '
      + '*Aponogeton crispus*.',
    legendes: {
      'sri-lanka-1.jpg': 'Une petite crique du bassin de la Kelani à Kitulgala : eau lente et teintée, rives couvertes '
        + 'de forêt.',
      'sri-lanka-2.jpg': 'Un ruisseau de la réserve forestière de Sinharaja.',
      'sri-lanka-3.jpg': 'La Kataran Oya à Kitulgala, dans le bassin de la Kelani.',
    },
  },

  floride: {
    nom: 'Sources et marais de Floride',
    region: 'Floride, États-Unis',
    type: 'Sources et marais',
    resume: 'Des rivières de source limpides et des marais herbeux sur un sol calcaire : un biotope subtropical où '
      + 'vivent la perche pygmée des Everglades, le killi drapeau et l\'écrevisse bleue.',
    milieu: [
      'La Floride repose sur un épais socle calcaire, celui de l\'aquifère floridien. L\'eau de pluie s\'y infiltre, '
        + 'dissout la roche et ressort par des centaines de sources (l\'USGS en comptait 320) qui alimentent des '
        + 'rivières limpides comme l\'Ichetucknee. Plus au sud, les Everglades forment une immense plaine de marais '
        + 'herbeux, de chenaux et de mares.',
      'Le climat est subtropical : l\'eau des marais se refroidit en hiver, alors que celle des sources garde une '
        + 'température presque constante, autour de 21 °C dans le nord de l\'État et de 24 °C dans le centre.',
    ],
    eau: [
      'Venue du calcaire, l\'eau est dure et alcaline. Dans la rivière Ichetucknee, 25 prélèvements de l\'USGS entre '
        + '1966 et 1993 donnent un pH de 6,5 à 8,4 (7,8 en médiane) et une dureté de 140 à 160 mg/L de CaCO₃, soit '
        + '7,8 à 9 °dGH ; la conductivité y était de 268 à 278 µS/cm à l\'automne 2026.',
      'C\'est l\'inverse du rio Negro : une eau minéralisée, limpide et riche en calcium, où les plantes poussent bien '
        + 'en pleine lumière.',
    ],
    vie: [
      'Les poissons sont petits et adaptés aux eaux peu profondes envahies de plantes : la perche pygmée des '
        + 'Everglades (3 cm) pond dans la végétation, de préférence sur les cornifles ; le killi drapeau vit dans la '
        + 'péninsule ; le poisson moustique, l\'un des plus petits vivipares, et la gambusie se tiennent en surface ; '
        + 'le molly lyre fréquente aussi les eaux saumâtres des côtes.',
      'Les plantes sont nombreuses : *Hemianthus glomeratus*, originaire de Floride, *Bacopa caroliniana*, '
        + '*Ludwigia*, *Sagittaria subulata*, *Nymphoides aquatica*, toutes observées en Floride d\'après GBIF. '
        + 'L\'écrevisse bleue (*Procambarus alleni*) est endémique de Floride ; sa robe bleu vif est une forme '
        + 'sélectionnée en élevage.',
    ],
    aquarium: [
      'Une eau moyennement dure et légèrement alcaline (pH 7 à 8), fraîche pour un bac tropical : 20 à 24 °C.',
      'Beaucoup de plantes et une bonne lumière : *Hemianthus*, *Bacopa* et *Sagittaria*, du cornifle en surface.',
      'De petits poissons entre eux : la perche pygmée des Everglades, discrète, ne tient pas face à des poissons '
        + 'vifs.',
      'L\'écrevisse bleue dans un bac à part : elle attrape les petits poissons et coupe les plantes.',
    ],
    bac: 'Un bac planté de 80 L pour un groupe de perches pygmées des Everglades et de poissons moustiques, à 22 °C et '
      + 'pH 7,4, avec *Hemianthus glomeratus*, *Bacopa caroliniana*, *Sagittaria subulata* et du cornifle.',
    legendes: {
      'floride-1.jpg': 'L\'Anhinga Trail vue d\'avion, dans le parc national des Everglades : mares et marais herbeux de '
        + 'Taylor Slough.',
      'floride-2.jpg': 'La rivière Ichetucknee, alimentée par des sources : eau limpide et herbiers immergés.',
      'floride-3.jpg': 'Les Everglades vues d\'avion : une plaine de marais à perte de vue.',
      'floride-4.jpg': 'Herbiers et feuilles flottantes dans la rivière Ichetucknee.',
    },
  },
};

export default textes;

/** Cours : les paramètres de l'eau (pH, GH, KH, CO₂) */
const cours = {
  slug: 'parametres-eau',
  titre: 'Les paramètres de l\'eau',
  resume: 'pH, GH, KH et CO₂ : ce que mesurent ces valeurs, comment lire l\'analyse de votre eau du robinet et choisir des poissons qui s\'y plairont.',
  icone: 'Beaker',
  sections: [
    {
      id: 'mesurer',
      titre: 'Ce qu\'il faut mesurer',
      blocs: [
        {
          type: 'p',
          texte: 'Une eau limpide n\'est pas forcément saine : l\'ammoniaque et les nitrites sont invisibles. Les tests, en bandelettes ou en réactifs à gouttes (plus précis), font partie de l\'équipement de base. L\'OATA conseille de mesurer au moins une fois par semaine, et plus souvent au démarrage du bac ou après l\'arrivée de nouveaux poissons.',
        },
        {
          type: 'tableau',
          colonnes: ['Paramètre', 'Ce qu\'il indique', 'Repère'],
          lignes: [
            ['Ammoniaque (NH₃/NH₄⁺)', 'Déchets des poissons non encore traités', 'Zéro ; jamais plus de 0,02 mg/L d\'ammoniac libre (OATA)'],
            ['Nitrites (NO₂⁻)', 'Étape intermédiaire du cycle de l\'azote', 'Zéro ; jamais plus de 0,2 mg/L (OATA)'],
            ['Nitrates (NO₃⁻)', 'Produit final du cycle, s\'accumule', 'Moins de 50 mg/L au-dessus de l\'eau du robinet (OATA)'],
            ['pH', 'Acidité de l\'eau', 'Selon les espèces, le plus souvent entre 6 et 8'],
            ['GH', 'Dureté totale : calcium et magnésium', 'Selon les espèces'],
            ['KH', 'Carbonates : stabilité du pH', 'Évite les chutes brutales de pH'],
            ['Température', 'Métabolisme des poissons', 'Selon les espèces, souvent 24 à 27 °C'],
            ['Oxygène dissous', 'Respiration', 'Au moins 6 mg/L (OATA)'],
          ],
          legende: 'Les valeurs propres à chaque espèce figurent sur [sa fiche](/poissons) et sont vérifiées par le simulateur.',
        },
      ],
    },
    {
      id: 'ph',
      titre: 'Le pH : acide ou basique',
      blocs: [
        {
          type: 'p',
          texte: 'Le pH mesure l\'acidité de l\'eau sur une échelle de 0 à 14 : 7 est neutre, en dessous l\'eau est acide, au-dessus elle est basique (on dit aussi alcaline). L\'échelle est logarithmique : une eau à pH 6 est dix fois plus acide qu\'une eau à pH 7, et cent fois plus qu\'une eau à pH 8.',
        },
        {
          type: 'p',
          texte: 'Chaque espèce s\'est adaptée à un milieu précis : rivières acides et très pauvres en minéraux d\'Amazonie pour de nombreux tétras, eaux plutôt dures pour les vivipares d\'Amérique centrale, lacs très basiques du Rift africain pour les cichlidés du Malawi et du Tanganyika.',
        },
        {
          type: 'figure',
          schema: 'PlagesPh',
          props: {
            especes: [
              'Paracheirodon axelrodi', 'Pterophyllum scalare', 'Trigonostigma heteromorpha', 'Betta splendens',
              'Poecilia reticulata', 'Xiphophorus maculatus', 'Aulonocara baenschi', 'Neolamprologus brichardi',
            ],
          },
          legende: 'Plages de pH de quelques espèces du catalogue, avec leur dureté (GH, en °dGH). Un bac commun réunit des espèces dont les plages se recouvrent : c\'est ce que vérifie [le simulateur](/simulation/starting).',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'La stabilité avant tout',
          texte: 'Un pH stable, même un peu en dehors de la plage idéale, vaut mieux que des corrections répétées qui le font varier. L\'eau de chaque changement doit avoir une dureté, un pH et une température proches de ceux du bac.',
        },
      ],
    },
    {
      id: 'durete',
      titre: 'GH et KH : la dureté',
      blocs: [
        {
          type: 'p',
          texte: 'Le **GH** (dureté générale) mesure les ions calcium et magnésium dissous : c\'est ce qui rend une eau « calcaire ». Le **KH** (dureté carbonatée, appelée TAC dans les analyses françaises) mesure les carbonates et bicarbonates. Ce sont eux qui neutralisent les acides produits dans le bac, notamment par la nitrification : avec un KH très bas, le pH peut chuter brutalement.',
        },
        {
          type: 'p',
          texte: 'Les tests d\'aquariophilie et les fiches Aquarius expriment la dureté en **degrés allemands** (°dGH et °dKH). Les analyses d\'eau en France donnent le TH en **degrés français** (°f). Un degré allemand vaut 10 mg/L d\'oxyde de calcium, soit 17,8 mg/L de carbonate de calcium, et un degré français 10 mg/L de carbonate de calcium. Donc 1 °dGH ≈ 1,78 °f : un TH de 20 °f correspond à environ 11 °dGH.',
        },
        {
          type: 'figure',
          schema: 'EchelleDurete',
          legende: 'Classes de dureté de l\'eau en degrés français (Wikipédia, « Dureté de l\'eau »), avec leur équivalent en degrés allemands.',
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: 'Connaître l\'eau de votre robinet',
          texte: 'Les résultats du contrôle sanitaire de l\'eau potable sont publics, commune par commune, sur [le site du ministère de la Santé](https://www.eaupotable.sante.gouv.fr/). Repérez la ligne « Titre hydrotimétrique » (TH, en °f) et divisez-la par 1,78 pour obtenir le GH en °dGH ; le TAC donne de la même façon le KH. Vous y trouverez aussi le taux de nitrates de départ.',
        },
      ],
    },
    {
      id: 'co2',
      titre: 'Le CO₂, le KH et le pH',
      blocs: [
        {
          type: 'p',
          texte: 'Le CO₂ dissous, rejeté par la respiration des poissons et des bactéries ou injecté pour les plantes, forme de l\'acide carbonique et fait baisser le pH. Quand le KH est connu, le pH permet donc d\'estimer le CO₂ : **CO₂ ≈ 3 × KH × 10^(7 − pH)**, en mg/L avec le KH en °dKH.',
        },
        {
          type: 'figure',
          schema: 'TableauCo2',
          legende: 'CO₂ dissous estimé (mg/L) selon le KH et le pH, avec les besoins des plantes selon Tropica. Valable seulement si le CO₂ est le seul acide de l\'eau : la tourbe, le bois ou les feuilles de catappa font baisser le pH et faussent l\'estimation.',
        },
        {
          type: 'p',
          texte: 'Selon Tropica, les plantes « faciles » se passent d\'apport de CO₂, même si un peu (3 à 5 mg/L) vaut mieux que rien ; les plantes « Medium » demandent 10 à 15 mg/L et les plus exigeantes 15 à 30 mg/L. Pour suivre le CO₂ sans calcul, un **contrôleur permanent** (drop checker) rempli d\'une solution de référence à 4 °dKH vire au vert entre 25 et 35 mg/L environ.',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'CO₂ injecté et poissons',
          texte: 'Le CO₂ s\'accumule quand les plantes ne l\'absorbent plus, c\'est-à-dire la nuit. Coupez l\'injection en même temps que l\'éclairage et surveillez les poissons : s\'ils respirent vite près de la surface, réduisez le débit et agitez davantage la surface.',
        },
      ],
    },
    {
      id: 'adapter',
      titre: 'Adapter son eau, ou ses poissons',
      blocs: [
        {
          type: 'p',
          texte: 'Le plus simple, et le plus stable, est de choisir des poissons adaptés à l\'eau du robinet. Une eau dure et basique convient aux vivipares, aux arcs-en-ciel ou aux cichlidés africains ; une eau douce aux tétras, rasboras et corydoras. Le simulateur filtre justement le catalogue à partir de votre pH, de votre GH et de votre température.',
        },
        {
          type: 'p',
          texte: 'Si vous tenez à des espèces d\'une autre eau, modifiez-la progressivement et préparez l\'eau des changements de la même façon :',
        },
        {
          type: 'liste',
          items: [
            '**Adoucir** : couper l\'eau du robinet avec de l\'eau osmosée (filtre à osmose inverse) ou déminéralisée, en mesurant le GH et le KH obtenus. Une eau entièrement osmosée n\'a plus de pouvoir tampon.',
            '**Acidifier doucement** : tourbe dans le filtre, racines et feuilles de catappa libèrent des acides humiques qui font baisser le pH et teintent l\'eau en ambre.',
            '**Durcir** : du sable de corail ou des roches calcaires (elles moussent au contact du vinaigre) font monter le GH, le KH et le pH.',
            'Évitez les produits « pH moins » ou « pH plus » employés seuls : sans agir sur le KH, ils provoquent des variations brutales.',
          ],
        },
      ],
    },
  ],
  aRetenir: [
    'Testez l\'eau au moins une fois par semaine : ammoniaque et nitrites à zéro, nitrates bas.',
    'Le pH mesure l\'acidité, le GH le calcium et le magnésium, le KH les carbonates qui stabilisent le pH.',
    '1 °dGH ≈ 1,78 °f : divisez le TH de votre analyse d\'eau par 1,78 pour obtenir le GH.',
    'Choisissez des poissons adaptés à votre eau plutôt que de la corriger en permanence.',
  ],
  sources: [
    { nom: 'OATA, « Water quality criteria »', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'OATA, « How to test water quality in your freshwater tank »', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-test-water-quality-in-your-freshwater-tank-aquarium/' },
    { nom: 'Wikipédia, « Dureté de l\'eau »', url: 'https://fr.wikipedia.org/wiki/Duret%C3%A9_de_l%27eau' },
    { nom: 'Ministère de la Santé, qualité de l\'eau potable par commune', url: 'https://www.eaupotable.sante.gouv.fr/' },
    { nom: 'Tropica, « Fertiliser and CO2 »', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/fertiliser-and-co2/' },
    { nom: 'Aquarium Science, « Measuring CO2 »', url: 'https://aquariumscience.org/15-6-6-measuring-co2/' },
    { nom: 'Université de Floride (UF/IFAS), « Ammonia in Aquatic Systems »', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
  ],
};

export default cours;

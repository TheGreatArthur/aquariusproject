/** Cours : température et équipement */
const cours = {
  slug: 'temperature-equipement',
  titre: 'Température et équipement',
  resume: 'Choisir le bac, le chauffage, le filtre et l\'éclairage, et comprendre pourquoi une eau chaude manque vite d\'oxygène.',
  icone: 'Thermometer',
  sections: [
    {
      id: 'bac',
      titre: 'Le bac et son emplacement',
      blocs: [
        {
          type: 'p',
          texte: 'Prenez le bac le plus grand que vous puissiez installer, en pensant à la taille adulte des poissons. Un grand volume d\'eau est plus stable : la température, le pH et les déchets y varient moins vite qu\'en petit bac. À volume égal, un bac large et peu profond offre plus de surface pour les échanges d\'oxygène qu\'un bac haut.',
        },
        {
          type: 'liste',
          items: [
            'À l\'abri du soleil direct, des radiateurs et des courants d\'air, qui font varier la température et favorisent les algues.',
            'Sur un meuble plan et solide, prévu pour le poids du bac plein : un litre d\'eau pèse un kilo, sans compter le verre, le sol et le décor.',
            'Loin du bruit, des vibrations et des passages fréquents, et à portée d\'une prise et d\'un point d\'eau pour l\'entretien.',
          ],
        },
        {
          type: 'figure',
          schema: 'CalculateurEquipement',
          legende: 'Ordres de grandeur pour un bac d\'eau douce, à ajuster selon la population et les plantes.',
        },
      ],
    },
    {
      id: 'chauffage',
      titre: 'Chauffage et température',
      blocs: [
        {
          type: 'p',
          texte: 'La plupart des poissons tropicaux vivent entre 24 et 28 °C ; la plage de chaque espèce figure sur sa fiche. Un chauffage thermostaté, immergé près de la sortie du filtre pour répartir la chaleur, maintient cette température. Contrôlez-la avec un thermomètre indépendant, au cas où le thermostat se dérèglerait.',
        },
        {
          type: 'tableau',
          colonnes: ['Puissance', 'Volume conseillé'],
          lignes: [
            ['25 W', '20 à 25 L'],
            ['50 W', '25 à 60 L'],
            ['75 W', '60 à 100 L'],
            ['100 W', '100 à 150 L'],
            ['150 W', '200 à 300 L'],
            ['200 W', '300 à 400 L'],
          ],
          legende: 'Puissances recommandées par EHEIM pour ses chauffages thermocontrol. Dans une pièce fraîche, prenez la taille au-dessus ; dans un grand bac, deux chauffages répartissent mieux la chaleur et se relaient si l\'un tombe en panne.',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'Trop chaud est aussi dangereux',
          texte: 'En été, l\'eau peut dépasser 30 °C. Une eau chaude contient moins d\'oxygène, alors que les poissons en consomment davantage, et l\'ammoniaque y est plus toxique. Réduisez la durée d\'éclairage, ouvrez le couvercle et ventilez la surface plutôt que d\'ajouter des glaçons, qui provoquent des chocs de température.',
        },
      ],
    },
    {
      id: 'oxygene',
      titre: 'Oxygène et brassage',
      blocs: [
        {
          type: 'p',
          texte: 'L\'oxygène entre dans l\'eau par la surface : plus elle est agitée, plus les échanges sont rapides. Or la quantité d\'oxygène qu\'une eau peut contenir baisse quand elle se réchauffe. À 25 °C, une eau saturée n\'en contient que 8,3 mg/L.',
        },
        {
          type: 'figure',
          schema: 'CourbeOxygene',
          legende: 'Oxygène dissous à saturation dans l\'eau douce au niveau de la mer (tables de l\'USGS, équation de Benson et Krause). L\'OATA recommande au moins 6 mg/L : un bac tropical n\'a qu\'une petite marge, consommée par les poissons, les bactéries du filtre et les plantes la nuit.',
        },
        {
          type: 'p',
          texte: 'Des poissons qui restent en surface la bouche ouverte manquent d\'oxygène. Orientez la sortie du filtre vers la surface pour qu\'elle ondule, ou ajoutez un diffuseur d\'air relié à une petite pompe.',
        },
      ],
    },
    {
      id: 'filtration',
      titre: 'La filtration',
      blocs: [
        {
          type: 'p',
          texte: 'Le filtre fait circuler l\'eau, retient les particules et surtout héberge les bactéries du [cycle de l\'azote](/cours/cycle-azote). Aucun poisson ne devrait vivre sans filtre bien entretenu. L\'eau y traverse en général plusieurs couches :',
        },
        {
          type: 'flux',
          items: [
            { titre: 'Mécanique', sousTitre: 'mousse, ouate', texte: 'Retient les particules. À rincer dès que le débit baisse.', ton: 'neutre' },
            { titre: 'Biologique', sousTitre: 'céramique, mousse à gros pores', texte: 'Abrite les bactéries. À rincer seulement dans l\'eau du bac.', ton: 'ok' },
            { titre: 'Chimique', sousTitre: 'facultative : charbon actif', texte: 'Retire colorants et traces de médicaments. S\'épuise, à remplacer.', ton: 'attention' },
          ],
          legende: 'Ordre des masses filtrantes : les particules sont arrêtées avant d\'atteindre le support des bactéries.',
        },
        {
          type: 'tableau',
          colonnes: ['Type de filtre', 'Pour quel bac', 'À savoir'],
          lignes: [
            ['Interne', 'Petits et moyens bacs', 'Économique, mais prend de la place dans le bac'],
            ['Externe (à cuve)', 'Bacs moyens à grands', 'Beaucoup de volume pour les masses filtrantes, silencieux, caché dans le meuble'],
            ['Suspendu (en cascade)', 'Petits et moyens bacs', 'Facile à entretenir ; agite bien la surface'],
            ['Mousse et pompe à air', 'Petits bacs, alevins, crevettes', 'Courant doux, n\'aspire pas les petits animaux'],
          ],
        },
        {
          type: 'p',
          texte: 'Tropica conseille un débit de **3 à 5 fois le volume du bac par heure** : 450 à 750 L/h pour 150 litres. Le débit annoncé sur la boîte est mesuré sans masses filtrantes ; le débit réel est plus faible. Les poissons de petite taille ou aux longues nageoires, comme le combattant, préfèrent un courant doux.',
        },
      ],
    },
    {
      id: 'eclairage',
      titre: 'L\'éclairage',
      blocs: [
        {
          type: 'p',
          texte: 'La lumière sert aux plantes et au plaisir des yeux ; les poissons ont surtout besoin d\'un rythme jour et nuit régulier. Pour comparer des éclairages, Tropica conseille de regarder les **lumens** plutôt que les watts : 10 à 20 lumens par litre suffisent aux plantes faciles, 20 à 40 aux plantes « Medium », et au-delà de 40 pour les plus exigeantes.',
        },
        {
          type: 'p',
          texte: 'Dans un bac neuf, Tropica recommande 6 heures d\'éclairage par jour pendant les deux à trois premières semaines, puis 8 à 10 heures. Une prise programmable garde des horaires constants.',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'Des algues qui envahissent le bac',
          texte: 'Elles profitent d\'un déséquilibre entre lumière et nutriments. Réduisez d\'abord la durée d\'éclairage, limitez la nourriture et changez l\'eau plus souvent ; des plantes à croissance rapide leur font concurrence.',
        },
      ],
    },
    {
      id: 'liste',
      titre: 'La liste de départ',
      blocs: [
        {
          type: 'colonnes',
          colonnes: [
            { titre: 'Le bac', items: ['Aquarium en verre ou en acrylique', 'Meuble adapté au poids', 'Couvercle'] },
            { titre: 'La technique', items: ['Filtre', 'Chauffage thermostaté et thermomètre', 'Éclairage (indispensable aux plantes)'] },
            { titre: 'L\'entretien', items: ['Conditionneur d\'eau', 'Tests : ammoniaque, nitrites, nitrates, pH et dureté', 'Siphon et seau réservé au bac'] },
          ],
        },
        {
          type: 'p',
          texte: 'Le sol, les plantes et le décor font l\'objet du [cours suivant](/cours/plantes-decor).',
        },
      ],
    },
  ],
  aRetenir: [
    'Un grand bac est plus stable qu\'un petit : prévoyez la taille adulte des poissons.',
    'Comptez un débit de filtre de 3 à 5 fois le volume par heure et un chauffage adapté au volume.',
    'Une eau chaude contient moins d\'oxygène : agitez la surface, surtout en été.',
    'Commencez par 6 heures de lumière par jour, puis 8 à 10 heures une fois le bac installé.',
  ],
  sources: [
    { nom: 'OATA, « How to set up and look after a freshwater tank »', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'RSPCA, « Fish environment »', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
    { nom: 'USGS, « Dissolved Oxygen » (tables de solubilité)', url: 'https://pubs.usgs.gov/tm/09/a6.2/tm9a6.2.pdf' },
    { nom: 'OATA, « Water quality criteria »', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'EHEIM thermocontrol, puissances par volume (fiche produit)', url: 'https://charterhouse-aquatics.com/products/eheim-thermocontrol-electronic-aquarium-heater' },
    { nom: 'Tropica, « Water circulation »', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/water-circulation/' },
    { nom: 'Tropica, « The right light for your aquarium »', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/light/' },
    { nom: 'Tropica, « Starting a new aquarium »', url: 'https://tropica.com/en/guide/get-the-right-start/growing-in/' },
  ],
};

export default cours;

/** Cours : l'entretien courant */
const cours = {
  slug: 'entretien',
  titre: 'L\'entretien courant',
  resume: 'Une routine de quelques minutes par jour et d\'une demi-heure par semaine : changements d\'eau, filtre, tests et signes d\'alerte.',
  icone: 'CalendarCheck',
  sections: [
    {
      id: 'routine',
      titre: 'Une routine simple',
      blocs: [
        {
          type: 'p',
          texte: 'Les poissons dépendent entièrement de vous. La plupart des tâches sont rapides ; l\'important est de les faire régulièrement, et de noter les résultats des tests pour repérer une dérive.',
        },
        {
          type: 'colonnes',
          colonnes: [
            {
              titre: 'Chaque jour',
              items: [
                'Observer les poissons pendant le repas : nage, appétit, respiration',
                'Vérifier la température',
                'S\'assurer que le filtre et le chauffage fonctionnent',
                'Retirer la nourriture non mangée',
              ],
            },
            {
              titre: 'Chaque semaine',
              items: [
                'Changer 10 à 25 % de l\'eau',
                'Siphonner les débris du sol',
                'Nettoyer les vitres',
                'Tester l\'ammoniaque, les nitrites et les nitrates',
              ],
            },
            {
              titre: 'Chaque mois',
              items: [
                'Rincer les masses filtrantes dans l\'eau retirée du bac',
                'Tailler les plantes, retirer les feuilles abîmées',
                'Contrôler le pH et la dureté',
                'Nettoyer le rotor de la pompe du filtre',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'changer-eau',
      titre: 'Changer l\'eau pas à pas',
      blocs: [
        {
          type: 'etapes',
          items: [
            { titre: 'Préparez l\'eau neuve', texte: 'À la même température que le bac, avec un conditionneur dosé pour le volume ajouté.' },
            { titre: 'Coupez le chauffage et le filtre', texte: 'Un chauffage hors de l\'eau peut casser ou surchauffer, et une pompe ne doit pas tourner à vide.' },
            { titre: 'Siphonnez', texte: 'Avec un siphon à amorçage, jamais à la bouche : l\'eau d\'un bac peut contenir des bactéries dangereuses pour l\'homme. Passez la cloche dans le sol pour aspirer les débris.' },
            { titre: 'Rincez les masses filtrantes si besoin', texte: 'Dans un seau d\'eau retirée du bac, jamais sous le robinet.' },
            { titre: 'Remplissez doucement', texte: 'En versant l\'eau sur une soucoupe ou contre la main pour ne pas soulever le sol.' },
            { titre: 'Rallumez et vérifiez', texte: 'Le filtre doit repartir (amorcez-le s\'il a pris de l\'air) et le chauffage se rallumer.' },
          ],
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: 'Pourquoi un conditionneur ?',
          texte: 'L\'eau du robinet est désinfectée au chlore, parfois à la chloramine, toxiques pour les poissons et les bactéries du filtre. Le chlore s\'évapore si l\'eau repose plusieurs jours, mais pas la chloramine, beaucoup plus stable. Un conditionneur neutralise les deux en quelques secondes.',
        },
      ],
    },
    {
      id: 'quantite',
      titre: 'Combien d\'eau changer',
      blocs: [
        {
          type: 'p',
          texte: 'L\'OATA conseille jusqu\'à 25 % par semaine, Tropica environ 30 % une fois le bac équilibré. La bonne quantité dépend de la population, de la nourriture et des plantes : laissez-vous guider par les nitrates, qui doivent rester bas. Plusieurs petits changements valent mieux qu\'un seul très gros, qui bouleverse la chimie de l\'eau.',
        },
        {
          type: 'tableau',
          colonnes: ['Si vous mesurez…', 'Que faire'],
          lignes: [
            ['De l\'ammoniaque ou des nitrites', 'Ne nourrissez pas pendant un à trois jours, changez 25 à 50 % de l\'eau et recommencez les jours suivants jusqu\'au retour à zéro. Vérifiez le filtre.'],
            ['Des nitrates qui montent d\'une semaine à l\'autre', 'Changez plus d\'eau ou plus souvent, réduisez la nourriture, ajoutez des plantes à croissance rapide.'],
            ['Un pH qui baisse', 'Mesurez le KH : un KH épuisé laisse le pH chuter. Des changements d\'eau réguliers apportent de nouveaux carbonates.'],
            ['Une température anormale', 'Contrôlez le chauffage avec un thermomètre indépendant ; en été, ventilez la surface.'],
          ],
          legende: 'Mesures correctives tirées des recommandations de l\'Université de Floride et de l\'OATA.',
        },
      ],
    },
    {
      id: 'filtre',
      titre: 'Entretenir le filtre',
      blocs: [
        {
          type: 'liste',
          items: [
            'Nettoyez-le quand son débit baisse, en général une fois par mois, pas plus souvent que nécessaire.',
            'Pressez les mousses dans l\'eau retirée du bac : l\'objectif est d\'enlever la boue, pas de les rendre neuves.',
            'Ne nettoyez pas les masses biologiques en même temps que les autres, et ne les remplacez jamais toutes à la fois.',
            'Démontez et rincez le rotor de la pompe : des débris enroulés autour réduisent le débit.',
          ],
        },
      ],
    },
    {
      id: 'alerte',
      titre: 'Repérer les signes d\'alerte',
      blocs: [
        {
          type: 'p',
          texte: 'Chaque poisson a ses habitudes. Un changement est souvent le premier signe d\'un problème d\'eau ou d\'une maladie :',
        },
        {
          type: 'colonnes',
          colonnes: [
            { titre: 'Comportement', items: ['Reste en surface ou posé au fond', 'Nage désordonnée', 'Se cache plus que d\'habitude', 'Agressivité inhabituelle'] },
            { titre: 'Respiration et appétit', items: ['Opercules qui battent vite', 'Bouche ouverte en surface', 'Refuse la nourriture', 'Amaigrissement'] },
            { titre: 'Apparence', items: ['Points blancs sur le corps', 'Filaments cotonneux', 'Nageoires abîmées ou écailles manquantes', 'Couleurs ternes ou foncées'] },
          ],
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'Le premier réflexe : tester l\'eau',
          texte: 'Avant tout médicament, mesurez l\'ammoniaque, les nitrites, les nitrates, le pH et la température : une eau dégradée est la cause la plus fréquente des problèmes, et un traitement n\'y changerait rien. Demandez conseil à votre animalerie ou à un vétérinaire si les symptômes persistent.',
        },
      ],
    },
    {
      id: 'vacances',
      titre: 'Partir en vacances',
      blocs: [
        {
          type: 'liste',
          items: [
            'Un bac équilibré supporte deux à trois semaines sans changement d\'eau : faites-en un la veille du départ.',
            'Demandez à une personne de confiance de passer chaque jour vérifier le bac et nourrir les poissons, avec des portions préparées à l\'avance.',
            'Un distributeur automatique doit être essayé avant le départ et vérifié pendant votre absence.',
            'Évitez les blocs de nourriture « vacances » : ils libèrent beaucoup de nourriture d\'un coup, qui pourrit dans l\'eau.',
            'Mieux vaut sous-nourrir que suralimenter : les poissons supportent bien mieux le jeûne qu\'une eau polluée.',
          ],
        },
      ],
    },
  ],
  aRetenir: [
    'Changez 10 à 30 % de l\'eau chaque semaine, à la bonne température et traitée au conditionneur.',
    'Rincez le filtre dans l\'eau du bac, jamais sous le robinet, et jamais toutes les masses à la fois.',
    'Testez l\'eau chaque semaine et notez les résultats.',
    'Au moindre comportement anormal, testez l\'eau avant de traiter.',
  ],
  sources: [
    { nom: 'OATA, « How to set up and look after a freshwater tank »', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'OATA, « Water quality criteria »', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'RSPCA, « Fish environment »', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
    { nom: 'RSPCA, « What to feed your fish »', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/diet' },
    { nom: 'Tropica, « Water circulation »', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/water-circulation/' },
    { nom: 'Université de Floride (UF/IFAS), « Ammonia in Aquatic Systems »', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Aquarium Co-Op, « Water Dechlorinator »', url: 'https://www.aquariumcoop.com/blogs/aquarium/water-conditioner-for-fish' },
  ],
};

export default cours;

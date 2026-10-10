/** Cours : choisir, acclimater et nourrir ses poissons */
const cours = {
  slug: 'accueillir-poissons',
  titre: 'Accueillir et nourrir ses poissons',
  resume: 'Choisir des poissons sains et compatibles, les acclimater sans choc, les mettre en quarantaine et les nourrir sans polluer l\'eau.',
  icone: 'Fish',
  sections: [
    {
      id: 'choisir',
      titre: 'Choisir des poissons compatibles',
      blocs: [
        {
          type: 'p',
          texte: 'Renseignez-vous sur chaque espèce avant de l\'acheter : taille adulte, eau, vie en banc ou en solitaire, tempérament. Certaines espèces doivent vivre en groupe, d\'autres sont territoriales ou agressives et ne supportent pas leurs voisines. Le [simulateur](/simulation) croise ces informations pour vous et signale les cohabitations à risque.',
        },
        {
          type: 'p',
          texte: 'Pour un premier bac tropical, l\'OATA cite des espèces robustes : tétras, guppys, mollys, platys, xiphos, corydoras et gouramis. Parcourez-les dans [le catalogue](/poissons) pour comparer leurs besoins.',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'Reconnaître un poisson en bonne santé',
          items: [
            'Des yeux clairs et brillants, des nageoires entières et des écailles intactes.',
            'Ni plaie, ni bosse, ni tache blanche ou cotonneuse.',
            'Une nage normale pour l\'espèce et une respiration régulière.',
            'Ne prenez pas un poisson qui paraît sain s\'il partage son bac avec des poissons malades.',
          ],
        },
      ],
    },
    {
      id: 'acclimater',
      titre: 'Le transport et l\'acclimatation',
      blocs: [
        {
          type: 'p',
          texte: 'Avant l\'achat, vérifiez que l\'ammoniaque et les nitrites de votre bac sont à zéro. Rentrez directement : la lumière vive, les températures extrêmes, le bruit et les secousses stressent les poissons dans leur sachet. À la maison, il faut ensuite les habituer progressivement à la température et à la chimie de votre eau.',
        },
        {
          type: 'flux',
          items: [
            { titre: 'Éteignez la lumière', texte: 'Sortez le sachet de son emballage à l\'abri d\'une lumière vive.', ton: 'neutre' },
            { titre: 'Faites flotter le sachet', sousTitre: 'au moins 10 minutes', texte: 'La température du sachet rejoint celle du bac.', ton: 'neutre' },
            { titre: 'Mélangez les eaux', sousTitre: 'pendant une vingtaine de minutes', texte: 'Ajoutez un peu d\'eau du bac dans le sachet, à plusieurs reprises.', ton: 'neutre' },
            { titre: 'Transférez à l\'épuisette', texte: 'Sans verser l\'eau du sachet dans le bac.', ton: 'ok' },
          ],
          legende: 'La méthode du sachet flottant décrite par l\'OATA.',
        },
        {
          type: 'p',
          texte: 'Pour les espèces sensibles, ou si l\'eau du magasin est très différente de la vôtre, la **méthode du goutte-à-goutte** est plus douce : on place les poissons et leur eau dans un récipient où l\'eau du bac arrive goutte à goutte, jusqu\'à ce que les deux eaux soient identiques. Elle prend d\'une à plusieurs heures, par exemple pour des discus.',
        },
        {
          type: 'p',
          texte: 'Laissez la lumière éteinte le reste de la journée et surveillez les nouveaux venus et la qualité de l\'eau pendant la première semaine.',
        },
      ],
    },
    {
      id: 'quarantaine',
      titre: 'La quarantaine',
      blocs: [
        {
          type: 'p',
          texte: 'Un poisson peut porter une maladie sans en montrer les signes. La quarantaine consiste à garder les nouveaux venus dans un **bac séparé pendant deux à quatre semaines** avant de les introduire dans le bac principal. Elle est particulièrement utile si votre bac n\'a pas accueilli de nouveaux poissons depuis longtemps.',
        },
        {
          type: 'liste',
          items: [
            'Un petit bac équipé d\'un chauffage, d\'un filtre déjà mature (ou d\'une masse filtrante prélevée dans le bac principal) et de quelques cachettes.',
            'La même eau que le bac principal : remplissez-le autant que possible avec de l\'eau de celui-ci.',
            'Nourrissez normalement et changez l\'eau chaque semaine.',
            'Utilisez une épuisette et un siphon réservés à ce bac.',
            'Sans signe de maladie à la fin de la période, les poissons peuvent rejoindre le bac principal.',
          ],
        },
      ],
    },
    {
      id: 'nourrir',
      titre: 'Nourrir sans excès',
      blocs: [
        {
          type: 'p',
          texte: 'La RSPCA conseille de donner ce que les poissons mangent en **deux à cinq minutes**, en deux ou trois petits repas par jour plutôt qu\'un seul gros. Toute nourriture non consommée se décompose en ammoniaque : la suralimentation est l\'une des principales causes d\'eau polluée.',
        },
        {
          type: 'liste',
          items: [
            '**Variez** : flocons ou granulés de base, complétés par des proies congelées (daphnies, artémias) bien décongelées.',
            '**Pensez au fond** : les poissons de fond et de pleine eau ont besoin de nourriture qui coule, en pastilles ou en granulés.',
            '**Respectez les horaires** : les espèces nocturnes, comme certains poissons-chats, se nourrissent le soir, lumière éteinte.',
            '**Adaptez au régime** : les plécos et autres brouteurs ont besoin de végétaux (courgette, épinard) et parfois de bois à racler. Le régime de chaque espèce figure sur sa fiche.',
          ],
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'Dans le doute, donnez moins',
          texte: 'Un poisson supporte bien quelques jours de jeûne, beaucoup moins une eau chargée en ammoniaque. Si de la nourriture reste au fond après le repas, retirez-la et réduisez les portions.',
        },
      ],
    },
    {
      id: 'relacher',
      titre: 'Ne jamais relâcher un poisson',
      blocs: [
        {
          type: 'p',
          texte: 'Un poisson d\'aquarium relâché dans la nature meurt le plus souvent ; s\'il survit, il peut nuire gravement à la faune locale. La [gambusie](/poissons/74), introduite dans le monde entier contre les moustiques, menace aujourd\'hui de petites espèces locales jusque dans le sud de l\'Europe. Ne videz pas non plus l\'eau, le sol ou les plantes d\'un bac dans un cours d\'eau. Si vous ne pouvez plus garder un poisson, proposez-le à une animalerie, un club ou un autre aquariophile.',
        },
      ],
    },
  ],
  aRetenir: [
    'Choisissez des espèces compatibles avec votre eau et entre elles, et des poissons en bonne santé.',
    'Acclimatez en douceur : sachet flottant au moins 10 minutes, puis mélange progressif des eaux.',
    'Une quarantaine de deux à quatre semaines protège le bac principal.',
    'Nourrissez ce qui est mangé en deux à cinq minutes ; mieux vaut moins que trop.',
  ],
  sources: [
    { nom: 'OATA, « How to set up and look after a freshwater tank »', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'RSPCA, « What to feed your fish »', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/diet' },
    { nom: 'Maidenhead Aquatics, « Do I need to quarantine my new fish? »', url: 'https://www.fishkeeper.co.uk/faq/do-i-need-to-quarantine-my-new-fish-and-if-so-how-do-i-do-it' },
    { nom: 'Université de Floride (UF/IFAS), « Ammonia in Aquatic Systems »', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Fiche Aquarius de la gambusie (FishBase)', url: 'https://www.fishbase.se/summary/Gambusia-holbrooki.html' },
  ],
};

export default cours;

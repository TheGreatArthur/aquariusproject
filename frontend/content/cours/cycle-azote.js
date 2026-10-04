/** Cours : le cycle de l'azote et le démarrage d'un bac */
const cours = {
  slug: 'cycle-azote',
  titre: 'Le cycle de l\'azote',
  resume: 'Comment un aquarium se débarrasse des déchets de ses poissons, et comment démarrer un bac sans les mettre en danger.',
  icone: 'RefreshCw',
  sections: [
    {
      id: 'dechets',
      titre: 'D\'où viennent les déchets',
      blocs: [
        {
          type: 'p',
          texte: 'Comme tous les animaux, les poissons transforment leur nourriture en énergie et rejettent des déchets azotés. Chez eux, ce déchet est surtout de l\'**ammoniaque**, éliminée en grande partie par les branchies et, en plus petite quantité, par l\'urine. Les restes de nourriture, les excréments et les feuilles mortes en produisent aussi en se décomposant. Plus un poisson mange, plus il en rejette, et même à jeun il en produit.',
        },
        {
          type: 'p',
          texte: 'Dans une rivière, ces déchets sont dilués dans un volume d\'eau immense. Un aquarium est au contraire un petit volume fermé : sans traitement, l\'ammoniaque s\'y accumule en quelques jours. Après l\'oxygène, c\'est le paramètre de l\'eau qui compte le plus pour la santé des poissons.',
        },
      ],
    },
    {
      id: 'bacteries',
      titre: 'Des bactéries qui font le travail',
      blocs: [
        {
          type: 'p',
          texte: 'Le **cycle de l\'azote**, ou nitrification, est assuré par des bactéries qui vivent en fine pellicule (un biofilm) sur toutes les surfaces du bac : surtout dans les masses filtrantes, mais aussi sur le sol, le décor et les vitres. Elles transforment l\'ammoniaque en deux étapes.',
        },
        {
          type: 'flux',
          items: [
            { titre: 'Poissons et nourriture', sousTitre: 'excrétion, restes, débris', texte: 'La source de l\'azote, en continu.', ton: 'neutre' },
            { titre: 'Ammoniaque', sousTitre: 'NH₄⁺ et NH₃', texte: 'Très toxique, surtout sous sa forme NH₃.', ton: 'danger' },
            { titre: 'Nitrites', sousTitre: 'NO₂⁻', texte: 'Toxiques, même à faible concentration.', ton: 'attention' },
            { titre: 'Nitrates', sousTitre: 'NO₃⁻', texte: 'Peu toxiques ; retirés par les changements d\'eau et en partie par les plantes.', ton: 'ok' },
          ],
          legende: 'Les bactéries qui oxydent l\'ammoniaque (*Nitrosomonas*, *Nitrosospira*) produisent des nitrites ; d\'autres (*Nitrospira*, *Nitrobacter*) les transforment en nitrates.',
        },
        {
          type: 'p',
          texte: 'Les livres d\'aquariophilie ont longtemps attribué la seconde étape aux *Nitrobacter*. En analysant le biofilm de filtres d\'aquariums d\'eau douce, l\'équipe de Timothy Hovanec a montré en 1998 que ce sont en réalité surtout des bactéries du genre *Nitrospira* qui transforment les nitrites.',
        },
        {
          type: 'p',
          texte: 'Ces bactéries ont besoin d\'**oxygène** et consomment des carbonates : la nitrification produit de l\'acide et fait baisser le pH si l\'eau n\'est pas assez tamponnée. Un filtre bien oxygéné et une eau qui garde un peu de dureté carbonatée (le KH, voir [les paramètres de l\'eau](/cours/parametres-eau#durete)) les aident à travailler.',
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: 'Et les nitrates ?',
          texte: 'Le filtre ne les élimine pas : ils s\'accumulent jusqu\'au prochain changement d\'eau. L\'OATA, l\'association britannique des professionnels de l\'aquariophilie, recommande de ne pas dépasser 50 mg/L au-dessus du taux de l\'eau du robinet ; les espèces sensibles préfèrent nettement moins.',
        },
      ],
    },
    {
      id: 'toxicite',
      titre: 'Pourquoi l\'ammoniaque est si dangereuse',
      blocs: [
        {
          type: 'p',
          texte: 'Dans l\'eau, l\'ammoniaque existe sous deux formes en équilibre : l\'ion **ammonium** (NH₄⁺), peu toxique, et l\'**ammoniac libre** (NH₃), environ cent fois plus toxique pour les poissons. La part de chaque forme dépend du pH et de la température : plus l\'eau est basique et chaude, plus il y a d\'ammoniac libre.',
        },
        {
          type: 'figure',
          schema: 'TableauAmmoniac',
          legende: 'Part d\'ammoniac libre (NH₃) dans l\'ammoniaque totale, calculée avec l\'équation d\'Emerson et al. (1975), qui sert aussi au tableau de référence de l\'Université de Floride.',
        },
        {
          type: 'p',
          texte: 'À pH 8 et 26 °C, 5,7 % de l\'ammoniaque mesurée est déjà sous forme d\'ammoniac libre : 1 mg/L d\'ammoniaque totale en contient donc 0,057 mg/L. Or l\'OATA demande de rester à zéro et de ne jamais dépasser 0,02 mg/L d\'ammoniac libre, et l\'Université de Floride indique qu\'au-delà de 0,05 mg/L les tissus des poissons, à commencer par les branchies, s\'abîment. Vers 2 mg/L, les espèces sensibles meurent.',
        },
        {
          type: 'figure',
          schema: 'CalculateurAmmoniac',
          legende: 'Les tests vendus en animalerie mesurent l\'ammoniaque totale (NH₃ + NH₄⁺) : ce calculateur en déduit l\'ammoniac libre. C\'est un ordre de grandeur, car selon les marques le résultat est exprimé en NH₄⁺ ou en azote.',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'Le piège d\'une eau acide qui remonte',
          texte: 'À pH 6,5, l\'ammoniaque est presque entièrement sous forme d\'ammonium, peu toxique. Si le pH remonte d\'un coup, par exemple lors d\'un très gros changement d\'eau avec une eau du robinet plus basique, la même quantité devient brutalement bien plus dangereuse. Changez l\'eau souvent et par petites quantités plutôt que rarement et massivement.',
        },
      ],
    },
    {
      id: 'cyclage',
      titre: 'Démarrer un bac : le cyclage',
      blocs: [
        {
          type: 'p',
          texte: 'Un filtre neuf ne contient pas encore ces bactéries. Il faut les laisser se multiplier avant d\'introduire des poissons : c\'est le **cyclage**, ou maturation du filtre. Selon l\'Université de Floride, un biofiltre neuf demande six à huit semaines pour traiter efficacement l\'ammoniaque et les nitrites. Une eau chaude, un apport régulier d\'ammoniaque et un ensemencement en bactéries peuvent raccourcir ce délai.',
        },
        {
          type: 'figure',
          schema: 'CourbesCyclage',
          legende: 'Allure typique des mesures pendant un cyclage : l\'ammoniaque monte puis disparaît quand les premières bactéries s\'installent, les nitrites prennent le relais puis disparaissent à leur tour, et les nitrates s\'accumulent. Courbes indicatives : la durée réelle varie d\'un bac à l\'autre.',
        },
        {
          type: 'p',
          texte: 'L\'OATA décrit deux méthodes : démarrer avec quelques poissons robustes, ou sans poisson en apportant soi-même de l\'ammoniaque. La seconde évite d\'exposer des animaux aux pics d\'ammoniaque et de nitrites : c\'est celle que nous conseillons.',
        },
        {
          type: 'etapes',
          items: [
            {
              titre: 'Installez et remplissez le bac',
              texte: 'Eau du robinet traitée avec un conditionneur, filtre, chauffage, sol et plantes en place. Laissez tourner 24 à 48 heures pour vérifier le matériel et atteindre la bonne température.',
            },
            {
              titre: 'Apportez une source d\'ammoniaque',
              texte: 'Un produit de maturation à base d\'ammoniaque ou du chlorure d\'ammonium, dosé selon la notice pour atteindre environ 2 mg/L. Des bactéries vendues en flacon, ou une poignée de masse filtrante d\'un bac sain, accélèrent le démarrage.',
            },
            {
              titre: 'Mesurez tous les deux ou trois jours',
              texte: 'Ammoniaque, nitrites, nitrates et pH. Ajoutez une nouvelle dose quand l\'ammoniaque retombe. Gardez le pH au-dessus de 6,5 et l\'eau vers 25 à 28 °C : les bactéries ralentissent nettement dans une eau acide ou froide.',
            },
            {
              titre: 'Vérifiez que le filtre suit',
              texte: 'Le cyclage est terminé quand une dose d\'environ 2 mg/L d\'ammoniaque est ramenée à zéro, sans nitrites, en moins de 24 heures, et que des nitrates apparaissent.',
            },
            {
              titre: 'Changez l\'eau, puis peuplez progressivement',
              texte: 'Un grand changement d\'eau fait baisser les nitrates accumulés. Introduisez ensuite les poissons par petits groupes : à chaque arrivée, les bactéries mettent quelques jours à s\'adapter à la charge supplémentaire.',
            },
          ],
        },
        {
          type: 'encadre',
          ton: 'danger',
          titre: 'Le « syndrome du bac neuf »',
          texte: 'Trop de poissons dans un bac qui n\'a pas cyclé, ou trop de poissons ajoutés d\'un coup, provoquent une montée d\'ammoniaque et de nitrites que le filtre ne peut pas encore traiter : poissons malades, voire morts dans les premières semaines. Calculez la charge de votre future population avec [le simulateur](/simulation/starting) avant d\'acheter.',
        },
      ],
    },
    {
      id: 'filtre',
      titre: 'Préserver les bactéries du filtre',
      blocs: [
        {
          type: 'liste',
          items: [
            'Ne rincez jamais les masses filtrantes sous le robinet : le chlore tue les bactéries. Rincez-les dans l\'eau retirée du bac lors d\'un changement d\'eau.',
            'Ne remplacez pas toutes les masses filtrantes en même temps : vous perdriez la colonie et le bac recommencerait un cycle.',
            'N\'arrêtez pas le filtre plus de quelques heures : privées d\'eau oxygénée, les bactéries dépérissent.',
            'Traitez toujours l\'eau neuve avec un conditionneur, qui neutralise le chlore et la chloramine.',
          ],
        },
        {
          type: 'p',
          texte: 'La suite de la routine est détaillée dans [l\'entretien courant](/cours/entretien).',
        },
      ],
    },
  ],
  aRetenir: [
    'Les poissons produisent de l\'ammoniaque en permanence ; des bactéries la transforment en nitrites, puis en nitrates.',
    'L\'ammoniaque et les nitrites doivent rester à zéro ; les nitrates s\'éliminent par les changements d\'eau.',
    'Plus le pH et la température sont élevés, plus l\'ammoniaque est toxique.',
    'Un bac neuf doit cycler plusieurs semaines avant d\'accueillir des poissons, ajoutés ensuite progressivement.',
  ],
  sources: [
    { nom: 'Université de Floride (UF/IFAS), « Ammonia in Aquatic Systems »', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Emerson et al. (1975), « Aqueous Ammonia Equilibrium Calculations »', url: 'https://doi.org/10.1139/f75-274' },
    { nom: 'Hovanec et al. (1998), « Nitrospira-Like Bacteria Associated with Nitrite Oxidation in Freshwater Aquaria »', url: 'https://journals.asm.org/doi/10.1128/aem.64.1.258-264.1998' },
    { nom: 'OATA, « Water quality criteria »', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'OATA, « How to set up and look after a freshwater tank »', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'Aquarium Science, « Cycling with Ammonia »', url: 'https://aquariumscience.org/index.php/2-4-cycling-with-ammonia/' },
    { nom: 'RSPCA, « Fish environment »', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
  ],
};

export default cours;

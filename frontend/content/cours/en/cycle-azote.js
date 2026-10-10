/** Lesson: the nitrogen cycle and starting a tank (English version of ../cycle-azote.js) */
const cours = {
  slug: 'cycle-azote',
  titre: 'The nitrogen cycle',
  resume: 'How an aquarium gets rid of its fish’s waste, and how to start a tank without putting them at risk.',
  icone: 'RefreshCw',
  sections: [
    {
      id: 'dechets',
      titre: 'Where the waste comes from',
      blocs: [
        {
          type: 'p',
          texte: 'Like all animals, fish turn their food into energy and release nitrogen waste. In fish, this waste is mainly **ammonia**, most of it released through the gills and a smaller amount in the urine. Leftover food, droppings and dead leaves also produce it as they decompose. The more a fish eats, the more it releases, and it produces some even when not fed.',
        },
        {
          type: 'p',
          texte: 'In a river, this waste is diluted in a huge volume of water. An aquarium, on the other hand, is a small, closed volume: without treatment, ammonia builds up within a few days. After oxygen, it is the water parameter that matters most for fish health.',
        },
      ],
    },
    {
      id: 'bacteries',
      titre: 'Bacteria that do the work',
      blocs: [
        {
          type: 'p',
          texte: 'The **nitrogen cycle**, or nitrification, is carried out by bacteria that live as a thin film (a biofilm) on every surface in the tank: mainly in the filter media, but also on the substrate, the decor and the glass. They convert ammonia in two steps.',
        },
        {
          type: 'flux',
          items: [
            { titre: 'Fish and food', sousTitre: 'excretion, leftovers, debris', texte: 'The source of nitrogen, all the time.', ton: 'neutre' },
            { titre: 'Ammonia', sousTitre: 'NH₄⁺ and NH₃', texte: 'Highly toxic, especially in its NH₃ form.', ton: 'danger' },
            { titre: 'Nitrite', sousTitre: 'NO₂⁻', texte: 'Toxic, even at low concentrations.', ton: 'attention' },
            { titre: 'Nitrate', sousTitre: 'NO₃⁻', texte: 'Not very toxic; removed by water changes and partly by plants.', ton: 'ok' },
          ],
          legende: 'Bacteria that oxidise ammonia (*Nitrosomonas*, *Nitrosospira*) produce nitrite; others (*Nitrospira*, *Nitrobacter*) turn it into nitrate.',
        },
        {
          type: 'p',
          texte: 'Fishkeeping books long credited the second step to *Nitrobacter*. By analysing the biofilm in freshwater aquarium filters, Timothy Hovanec’s team showed in 1998 that it is actually mostly bacteria of the genus *Nitrospira* that convert nitrite.',
        },
        {
          type: 'p',
          texte: 'These bacteria need **oxygen** and consume carbonates: nitrification produces acid and lowers the pH if the water is not buffered enough. A well-oxygenated filter and water that keeps some carbonate hardness (the KH, see [water parameters](/cours/parametres-eau#durete)) help them work.',
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: 'What about nitrate?',
          texte: 'The filter does not remove it: it builds up until the next water change. OATA, the UK’s ornamental aquatic trade association, recommends not exceeding 50 mg/L above the level in your tap water; sensitive species prefer much less.',
        },
      ],
    },
    {
      id: 'toxicite',
      titre: 'Why ammonia is so dangerous',
      blocs: [
        {
          type: 'p',
          texte: 'In water, ammonia exists in two forms in equilibrium: the **ammonium** ion (NH₄⁺), which is not very toxic, and **free ammonia** (NH₃), about a hundred times more toxic to fish. The share of each form depends on pH and temperature: the more alkaline and warmer the water, the more free ammonia there is.',
        },
        {
          type: 'figure',
          schema: 'TableauAmmoniac',
          legende: 'Share of free ammonia (NH₃) in total ammonia, calculated with the equation of Emerson et al. (1975), which is also used for the University of Florida’s reference table.',
        },
        {
          type: 'p',
          texte: 'At pH 8 and 26 °C, 5.7% of the measured ammonia is already in the form of free ammonia: 1 mg/L of total ammonia therefore contains 0.057 mg/L. Yet OATA asks for zero and never more than 0.02 mg/L of free ammonia, and the University of Florida states that above 0.05 mg/L fish tissues, starting with the gills, are damaged. At around 2 mg/L, sensitive species die.',
        },
        {
          type: 'figure',
          schema: 'CalculateurAmmoniac',
          legende: 'The test kits sold in shops measure total ammonia (NH₃ + NH₄⁺): this calculator works out the free ammonia. It is an order of magnitude, as depending on the brand the result is given as NH₄⁺ or as nitrogen.',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'The trap of acidic water whose pH rises',
          texte: 'At pH 6.5, ammonia is almost entirely in the form of ammonium, which is not very toxic. If the pH rises suddenly, for example during a very large water change with more alkaline tap water, the same amount suddenly becomes far more dangerous. Change the water often and in small amounts rather than rarely and massively.',
        },
      ],
    },
    {
      id: 'cyclage',
      titre: 'Starting a tank: cycling',
      blocs: [
        {
          type: 'p',
          texte: 'A new filter does not yet contain these bacteria. They must be allowed to multiply before fish are added: this is **cycling**, or maturing the filter. According to the University of Florida, a new biofilter needs six to eight weeks to process ammonia and nitrite effectively. Warm water, a steady supply of ammonia and seeding with bacteria can shorten this time.',
        },
        {
          type: 'figure',
          schema: 'CourbesCyclage',
          legende: 'Typical pattern of readings during cycling: ammonia rises then disappears as the first bacteria settle in, nitrite takes over and then disappears in turn, and nitrate builds up. Indicative curves: the actual time varies from tank to tank.',
        },
        {
          type: 'p',
          texte: 'OATA describes two methods: starting with a few hardy fish, or without fish by adding ammonia yourself. The second avoids exposing animals to ammonia and nitrite spikes: it is the one we recommend.',
        },
        {
          type: 'etapes',
          items: [
            {
              titre: 'Set up and fill the tank',
              texte: 'Tap water treated with a conditioner, filter, heater, substrate and plants in place. Let it run for 24 to 48 hours to check the equipment and reach the right temperature.',
            },
            {
              titre: 'Add a source of ammonia',
              texte: 'An ammonia-based cycling product or ammonium chloride, dosed according to the instructions to reach about 2 mg/L. Bottled bacteria, or a handful of filter media from a healthy tank, speed up the start.',
            },
            {
              titre: 'Test every two or three days',
              texte: 'Ammonia, nitrite, nitrate and pH. Add a new dose when the ammonia drops. Keep the pH above 6.5 and the water at around 25 to 28 °C: the bacteria slow down markedly in acidic or cold water.',
            },
            {
              titre: 'Check that the filter keeps up',
              texte: 'Cycling is complete when a dose of about 2 mg/L of ammonia is brought back to zero, with no nitrite, in less than 24 hours, and nitrate appears.',
            },
            {
              titre: 'Change the water, then stock gradually',
              texte: 'A large water change brings down the accumulated nitrate. Then add the fish in small groups: with each arrival, the bacteria take a few days to adjust to the extra load.',
            },
          ],
        },
        {
          type: 'encadre',
          ton: 'danger',
          titre: '“New tank syndrome”',
          texte: 'Too many fish in a tank that has not cycled, or too many fish added at once, cause a rise in ammonia and nitrite that the filter cannot yet handle: sick fish, or even deaths in the first weeks. Work out the load of your future stock with [the simulator](/simulation) before buying.',
        },
      ],
    },
    {
      id: 'filtre',
      titre: 'Protecting the filter bacteria',
      blocs: [
        {
          type: 'liste',
          items: [
            'Never rinse filter media under the tap: chlorine kills the bacteria. Rinse them in the water removed from the tank during a water change.',
            'Do not replace all the filter media at the same time: you would lose the colony and the tank would start a new cycle.',
            'Do not switch the filter off for more than a few hours: deprived of oxygenated water, the bacteria die off.',
            'Always treat new water with a conditioner, which neutralises chlorine and chloramine.',
          ],
        },
        {
          type: 'p',
          texte: 'The rest of the routine is detailed in [routine maintenance](/cours/entretien).',
        },
      ],
    },
  ],
  aRetenir: [
    'Fish produce ammonia all the time; bacteria turn it into nitrite, then into nitrate.',
    'Ammonia and nitrite must stay at zero; nitrate is removed by water changes.',
    'The higher the pH and temperature, the more toxic ammonia is.',
    'A new tank must cycle for several weeks before receiving fish, which are then added gradually.',
  ],
  sources: [
    { nom: 'University of Florida (UF/IFAS), “Ammonia in Aquatic Systems”', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Emerson et al. (1975), “Aqueous Ammonia Equilibrium Calculations”', url: 'https://doi.org/10.1139/f75-274' },
    { nom: 'Hovanec et al. (1998), “Nitrospira-Like Bacteria Associated with Nitrite Oxidation in Freshwater Aquaria”', url: 'https://journals.asm.org/doi/10.1128/aem.64.1.258-264.1998' },
    { nom: 'OATA, “Water quality criteria”', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'OATA, “How to set up and look after a freshwater tank”', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'Aquarium Science, “Cycling with Ammonia”', url: 'https://aquariumscience.org/index.php/2-4-cycling-with-ammonia/' },
    { nom: 'RSPCA, “Fish environment”', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
  ],
};

export default cours;

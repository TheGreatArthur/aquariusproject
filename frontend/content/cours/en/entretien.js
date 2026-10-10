/** Lesson: routine maintenance (English version of ../entretien.js) */
const cours = {
  slug: 'entretien',
  titre: 'Routine maintenance',
  resume: 'A routine of a few minutes a day and half an hour a week: water changes, filter, tests and warning signs.',
  icone: 'CalendarCheck',
  sections: [
    {
      id: 'routine',
      titre: 'A simple routine',
      blocs: [
        {
          type: 'p',
          texte: 'Fish depend entirely on you. Most tasks are quick; what matters is doing them regularly, and writing down the test results to spot any drift.',
        },
        {
          type: 'colonnes',
          colonnes: [
            {
              titre: 'Every day',
              items: [
                'Watch the fish at feeding time: swimming, appetite, breathing',
                'Check the temperature',
                'Make sure the filter and heater are working',
                'Remove uneaten food',
              ],
            },
            {
              titre: 'Every week',
              items: [
                'Change 10 to 25% of the water',
                'Siphon debris from the substrate',
                'Clean the glass',
                'Test ammonia, nitrite and nitrate',
              ],
            },
            {
              titre: 'Every month',
              items: [
                'Rinse the filter media in water removed from the tank',
                'Trim the plants, remove damaged leaves',
                'Check pH and hardness',
                'Clean the filter pump’s impeller',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'changer-eau',
      titre: 'Changing the water step by step',
      blocs: [
        {
          type: 'etapes',
          items: [
            { titre: 'Prepare the new water', texte: 'At the same temperature as the tank, with conditioner dosed for the volume added.' },
            { titre: 'Switch off the heater and filter', texte: 'A heater out of water can crack or overheat, and a pump must not run dry.' },
            { titre: 'Siphon', texte: 'With a self-priming siphon, never by mouth: tank water can contain bacteria that are dangerous to humans. Push the bell into the substrate to suck up the debris.' },
            { titre: 'Rinse the filter media if needed', texte: 'In a bucket of water removed from the tank, never under the tap.' },
            { titre: 'Refill gently', texte: 'Pour the water onto a saucer or against your hand so as not to stir up the substrate.' },
            { titre: 'Switch back on and check', texte: 'The filter must restart (prime it if it has taken in air) and the heater must come back on.' },
          ],
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: 'Why a conditioner?',
          texte: 'Tap water is disinfected with chlorine, sometimes chloramine, which are toxic to fish and to the filter bacteria. Chlorine evaporates if the water stands for several days, but not chloramine, which is much more stable. A conditioner neutralises both in seconds.',
        },
      ],
    },
    {
      id: 'quantite',
      titre: 'How much water to change',
      blocs: [
        {
          type: 'p',
          texte: 'OATA advises up to 25% a week, Tropica about 30% once the tank has settled. The right amount depends on the stock, the feeding and the plants: let the nitrate level guide you, as it should stay low. Several small changes are better than one very large one, which upsets the water chemistry.',
        },
        {
          type: 'tableau',
          colonnes: ['If you measure…', 'What to do'],
          lignes: [
            ['Ammonia or nitrite', 'Do not feed for one to three days, change 25 to 50% of the water and repeat on the following days until it is back to zero. Check the filter.'],
            ['Nitrate rising from week to week', 'Change more water or more often, feed less, add fast-growing plants.'],
            ['A falling pH', 'Measure the KH: an exhausted KH lets the pH crash. Regular water changes bring in fresh carbonates.'],
            ['An abnormal temperature', 'Check the heater with a separate thermometer; in summer, fan the surface.'],
          ],
          legende: 'Corrective measures taken from the recommendations of the University of Florida and OATA.',
        },
      ],
    },
    {
      id: 'filtre',
      titre: 'Looking after the filter',
      blocs: [
        {
          type: 'liste',
          items: [
            'Clean it when its flow drops, usually once a month, no more often than needed.',
            'Squeeze the sponges in water removed from the tank: the aim is to remove the sludge, not to make them like new.',
            'Do not clean the biological media at the same time as the others, and never replace them all at once.',
            'Take out and rinse the pump’s impeller: debris wrapped around it reduces the flow.',
          ],
        },
      ],
    },
    {
      id: 'alerte',
      titre: 'Spotting warning signs',
      blocs: [
        {
          type: 'p',
          texte: 'Every fish has its habits. A change is often the first sign of a water problem or a disease:',
        },
        {
          type: 'colonnes',
          colonnes: [
            { titre: 'Behaviour', items: ['Stays at the surface or rests on the bottom', 'Erratic swimming', 'Hides more than usual', 'Unusual aggression'] },
            { titre: 'Breathing and appetite', items: ['Gill covers beating fast', 'Mouth open at the surface', 'Refuses food', 'Weight loss'] },
            { titre: 'Appearance', items: ['White spots on the body', 'Cottony threads', 'Damaged fins or missing scales', 'Dull or darkened colours'] },
          ],
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'First reflex: test the water',
          texte: 'Before any medication, measure ammonia, nitrite, nitrate, pH and temperature: poor water is the most common cause of problems, and a treatment would change nothing. Ask your fish shop or a vet for advice if the symptoms persist.',
        },
      ],
    },
    {
      id: 'vacances',
      titre: 'Going on holiday',
      blocs: [
        {
          type: 'liste',
          items: [
            'A balanced tank can go two to three weeks without a water change: do one the day before you leave.',
            'Ask someone you trust to drop by every day to check the tank and feed the fish, with portions prepared in advance.',
            'An automatic feeder must be tried out before you leave and checked while you are away.',
            'Avoid “holiday” food blocks: they release a lot of food at once, which rots in the water.',
            'Underfeeding is better than overfeeding: fish cope far better with fasting than with polluted water.',
          ],
        },
      ],
    },
  ],
  aRetenir: [
    'Change 10 to 30% of the water every week, at the right temperature and treated with conditioner.',
    'Rinse the filter in tank water, never under the tap, and never all the media at once.',
    'Test the water every week and write down the results.',
    'At the slightest unusual behaviour, test the water before treating.',
  ],
  sources: [
    { nom: 'OATA, “How to set up and look after a freshwater tank”', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'OATA, “Water quality criteria”', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'RSPCA, “Fish environment”', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
    { nom: 'RSPCA, “What to feed your fish”', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/diet' },
    { nom: 'Tropica, “Water circulation”', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/water-circulation/' },
    { nom: 'University of Florida (UF/IFAS), “Ammonia in Aquatic Systems”', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Aquarium Co-Op, “Water Dechlorinator”', url: 'https://www.aquariumcoop.com/blogs/aquarium/water-conditioner-for-fish' },
  ],
};

export default cours;

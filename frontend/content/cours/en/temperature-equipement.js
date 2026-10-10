/** Lesson: temperature and equipment (English version of ../temperature-equipement.js) */
const cours = {
  slug: 'temperature-equipement',
  titre: 'Temperature and equipment',
  resume: 'Choosing the tank, heater, filter and lighting, and understanding why warm water quickly runs short of oxygen.',
  icone: 'Thermometer',
  sections: [
    {
      id: 'bac',
      titre: 'The tank and where to put it',
      blocs: [
        {
          type: 'p',
          texte: 'Get the largest tank you can set up, bearing in mind the adult size of the fish. A large volume of water is more stable: temperature, pH and waste change more slowly than in a small tank. For the same volume, a wide, shallow tank offers more surface for oxygen exchange than a tall one.',
        },
        {
          type: 'liste',
          items: [
            'Away from direct sunlight, radiators and draughts, which make the temperature swing and encourage algae.',
            'On a level, sturdy stand designed for the weight of the full tank: a litre of water weighs a kilo, not counting the glass, substrate and decor.',
            'Away from noise, vibration and busy walkways, and within reach of a socket and a tap for maintenance.',
          ],
        },
        {
          type: 'figure',
          schema: 'CalculateurEquipement',
          legende: 'Orders of magnitude for a freshwater tank, to be adjusted according to the stock and plants.',
        },
      ],
    },
    {
      id: 'chauffage',
      titre: 'Heating and temperature',
      blocs: [
        {
          type: 'p',
          texte: 'Most tropical fish live between 24 and 28 °C; each species’ range is given on its profile. A thermostatic heater, placed near the filter outlet to spread the heat, keeps the water at this temperature. Check it with a separate thermometer, in case the thermostat fails.',
        },
        {
          type: 'tableau',
          colonnes: ['Power', 'Recommended volume'],
          lignes: [
            ['25 W', '20 to 25 L'],
            ['50 W', '25 to 60 L'],
            ['75 W', '60 to 100 L'],
            ['100 W', '100 to 150 L'],
            ['150 W', '200 to 300 L'],
            ['200 W', '300 to 400 L'],
          ],
          legende: 'Power ratings recommended by EHEIM for its thermocontrol heaters. In a cool room, go one size up; in a large tank, two heaters spread the heat better and take over if one fails.',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'Too hot is dangerous too',
          texte: 'In summer, the water can exceed 30 °C. Warm water holds less oxygen while the fish use more of it, and ammonia is more toxic. Shorten the lighting period, open the lid and fan the surface rather than adding ice cubes, which cause temperature shocks.',
        },
      ],
    },
    {
      id: 'oxygene',
      titre: 'Oxygen and water movement',
      blocs: [
        {
          type: 'p',
          texte: 'Oxygen enters the water through the surface: the more it is agitated, the faster the exchange. Yet the amount of oxygen water can hold falls as it warms up. At 25 °C, saturated water holds only 8.3 mg/L.',
        },
        {
          type: 'figure',
          schema: 'CourbeOxygene',
          legende: 'Dissolved oxygen at saturation in fresh water at sea level (USGS tables, Benson and Krause equation). OATA recommends at least 6 mg/L: a tropical tank has only a small margin, used up by the fish, the filter bacteria and the plants at night.',
        },
        {
          type: 'p',
          texte: 'Fish that stay at the surface with their mouths open are short of oxygen. Point the filter outlet towards the surface so that it ripples, or add an air stone connected to a small pump.',
        },
      ],
    },
    {
      id: 'filtration',
      titre: 'Filtration',
      blocs: [
        {
          type: 'p',
          texte: 'The filter moves the water, traps particles and above all houses the bacteria of the [nitrogen cycle](/cours/cycle-azote). No fish should live without a well-maintained filter. The water usually passes through several layers:',
        },
        {
          type: 'flux',
          items: [
            { titre: 'Mechanical', sousTitre: 'sponge, filter wool', texte: 'Traps particles. Rinse as soon as the flow drops.', ton: 'neutre' },
            { titre: 'Biological', sousTitre: 'ceramic, coarse sponge', texte: 'Houses the bacteria. Rinse only in tank water.', ton: 'ok' },
            { titre: 'Chemical', sousTitre: 'optional: activated carbon', texte: 'Removes dyes and traces of medication. Gets used up, replace it.', ton: 'attention' },
          ],
          legende: 'Order of the filter media: particles are stopped before they reach the bacteria’s home.',
        },
        {
          type: 'tableau',
          colonnes: ['Filter type', 'For which tank', 'Good to know'],
          lignes: [
            ['Internal', 'Small and medium tanks', 'Cheap, but takes up space in the tank'],
            ['External (canister)', 'Medium to large tanks', 'Plenty of room for filter media, quiet, hidden in the stand'],
            ['Hang-on-back', 'Small and medium tanks', 'Easy to maintain; agitates the surface well'],
            ['Sponge and air pump', 'Small tanks, fry, shrimp', 'Gentle current, does not suck in small animals'],
          ],
        },
        {
          type: 'p',
          texte: 'Tropica advises a flow of **3 to 5 times the tank volume per hour**: 450 to 750 L/h for 150 litres. The flow stated on the box is measured without filter media; the real flow is lower. Small or long-finned fish, such as the betta, prefer a gentle current.',
        },
      ],
    },
    {
      id: 'eclairage',
      titre: 'Lighting',
      blocs: [
        {
          type: 'p',
          texte: 'Light is for the plants and for our enjoyment; the fish mainly need a regular day and night rhythm. To compare lights, Tropica advises looking at **lumens** rather than watts: 10 to 20 lumens per litre are enough for easy plants, 20 to 40 for “Medium” plants, and over 40 for the most demanding.',
        },
        {
          type: 'p',
          texte: 'In a new tank, Tropica recommends 6 hours of light a day for the first two to three weeks, then 8 to 10 hours. A timer plug keeps the schedule constant.',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'Algae taking over the tank',
          texte: 'They take advantage of an imbalance between light and nutrients. First shorten the lighting period, feed less and change the water more often; fast-growing plants compete with them.',
        },
      ],
    },
    {
      id: 'liste',
      titre: 'The starter list',
      blocs: [
        {
          type: 'colonnes',
          colonnes: [
            { titre: 'The tank', items: ['Glass or acrylic aquarium', 'Stand built for the weight', 'Lid'] },
            { titre: 'The equipment', items: ['Filter', 'Thermostatic heater and thermometer', 'Lighting (essential for plants)'] },
            { titre: 'Maintenance', items: ['Water conditioner', 'Tests: ammonia, nitrite, nitrate, pH and hardness', 'Gravel siphon and a bucket kept for the tank'] },
          ],
        },
        {
          type: 'p',
          texte: 'The substrate, plants and decor are covered in the [next lesson](/cours/plantes-decor).',
        },
      ],
    },
  ],
  aRetenir: [
    'A large tank is more stable than a small one: plan for the adult size of the fish.',
    'Allow a filter flow of 3 to 5 times the volume per hour and a heater suited to the volume.',
    'Warm water holds less oxygen: agitate the surface, especially in summer.',
    'Start with 6 hours of light a day, then 8 to 10 hours once the tank is established.',
  ],
  sources: [
    { nom: 'OATA, “How to set up and look after a freshwater tank”', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'RSPCA, “Fish environment”', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
    { nom: 'USGS, “Dissolved Oxygen” (solubility tables)', url: 'https://pubs.usgs.gov/tm/09/a6.2/tm9a6.2.pdf' },
    { nom: 'OATA, “Water quality criteria”', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'EHEIM thermocontrol, power by volume (product page)', url: 'https://charterhouse-aquatics.com/products/eheim-thermocontrol-electronic-aquarium-heater' },
    { nom: 'Tropica, “Water circulation”', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/water-circulation/' },
    { nom: 'Tropica, “The right light for your aquarium”', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/light/' },
    { nom: 'Tropica, “Starting a new aquarium”', url: 'https://tropica.com/en/guide/get-the-right-start/growing-in/' },
  ],
};

export default cours;

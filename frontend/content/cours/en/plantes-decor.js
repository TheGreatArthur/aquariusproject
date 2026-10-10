/** Lesson: plants and hardscape (English version of ../plantes-decor.js) */
const cours = {
  slug: 'plantes-decor',
  titre: 'Plants and hardscape',
  resume: 'Creating a layout with depth, choosing easy plants, planting them according to their type and getting through the first three months.',
  icone: 'Leaf',
  sections: [
    {
      id: 'pourquoi',
      titre: 'Why live plants',
      blocs: [
        {
          type: 'liste',
          items: [
            '**They clean the water**: they absorb part of the nitrate and ammonium produced by the fish.',
            '**They hold back algae**: fast-growing plants use up the nutrients that algae thrive on.',
            '**They shelter the fish**: shy or territorial species need hiding places, and fry need refuges.',
          ],
        },
        {
          type: 'p',
          texte: 'A tank without live plants can work, provided the water is changed more often; but plants make the balance easier and the tank more natural.',
        },
      ],
    },
    {
      id: 'composer',
      titre: 'Designing the layout',
      blocs: [
        {
          type: 'p',
          texte: 'Tropica advises sketching the layout before starting, placing the *hardscape* first (substrate, rocks, roots) and then the plants. Two principles give a tank depth:',
        },
        {
          type: 'liste',
          items: [
            '**A sloping substrate**: 3 to 4 cm of gravel at the front and 6 to 8 cm at the back.',
            '**Tiered plants**: low ones in the foreground, medium ones in the middle, tall ones at the back and sides, to keep an open swimming space in front.',
          ],
        },
        {
          type: 'figure',
          schema: 'PlanAquarium',
          legende: 'Place the focal point of the layout, a handsome stone or root, on a line of thirds rather than in the centre: the composition looks more natural. The slope of the substrate follows Tropica’s recommendations.',
        },
      ],
    },
    {
      id: 'materiaux',
      titre: 'Substrate, rocks and roots',
      blocs: [
        {
          type: 'liste',
          items: [
            '**The substrate**: gravel of 0.8 to 4 mm lets water flow around the roots. Under this gravel, a 0.5 to 1 cm layer of nutrient substrate feeds heavy-rooting plants. Fine sand suits fish that dig in the bottom, such as corydoras.',
            '**Rocks**: some, made of limestone, raise the hardness and pH. A drop of vinegar that fizzes on the rock gives away limestone: keep it for hard-water tanks. Set large stones on a sheet of polystyrene to protect the bottom glass, before adding the substrate.',
            '**Roots**: they often float at first and release tannins that colour the water amber. Soak them for several days, changing the water, before putting them in.',
            'Avoid sharp or painted objects and decor not intended for aquariums: they can injure fish or release substances into the water.',
          ],
        },
      ],
    },
    {
      id: 'plantes',
      titre: 'Choosing easy plants',
      blocs: [
        {
          type: 'p',
          texte: 'Tropica sorts its plants into three categories. **Easy** plants tolerate low light and do without added CO₂: they are the ones that do best in a first tank.',
        },
        {
          type: 'tableau',
          colonnes: ['Plant', 'Type', 'Position', 'Good to know'],
          lignes: [
            ['*Anubias barteri* var. *nana*', 'Rhizome', 'Foreground, on rock or root', 'One of the easiest; likes shade'],
            ['*Microsorum pteropus* (Java fern)', 'Rhizome', 'Midground, on rock or root', 'Attaches to the decor, grows slowly'],
            ['*Cryptocoryne wendtii* ’Green’', 'Rosette', 'Foreground or midground', 'Low maintenance, tolerates shade'],
            ['*Echinodorus* ’Reni’', 'Rosette', 'Midground', 'Small red and green *Echinodorus*, suited to small tanks'],
            ['*Bacopa caroliniana*', 'Stem', 'Background', 'Replanted cuttings form new plants'],
            ['*Vallisneria*', 'Runners', 'Background', 'Long ribbon-like leaves, spreads on its own'],
            ['*Taxiphyllum barbieri* (Java moss)', 'Moss', 'On rock or root', 'Ideal shelter for fry and shrimp'],
            ['*Limnobium laevigatum*', 'Floating', 'Surface', 'Shades the plants below'],
          ],
          legende: 'A selection of easy plants based on Tropica’s catalogue and planting guide. Parameters, photos and growing tips: see [the plant catalogue](/plantes).',
        },
      ],
    },
    {
      id: 'planter',
      titre: 'Planting according to plant type',
      blocs: [
        {
          type: 'p',
          texte: 'The easiest way is to plant in a tank filled with only a few centimetres of water, keeping the leaves moist with a spray bottle. Remove the pot and the rock wool from each plant, then:',
        },
        {
          type: 'liste',
          items: [
            '**Stems**: trim the roots to about 4 cm, remove the lower leaves and plant the stems one by one, in a group.',
            '**Rosettes**: trim the roots to about 4 cm, separate the plants and remove the oldest leaves.',
            '**Rhizomes** (*Anubias*, *Microsorum*): never bury the rhizome, it would rot. Tie the plant to a root or rock with thread, or wedge it between two stones.',
            '**Mosses**: divide them into small tufts, laid on the decor or tied to it.',
            '**Floating plants**: simply place them on the surface, bearing in mind the shade they will cast.',
          ],
        },
      ],
    },
    {
      id: 'demarrage',
      titre: 'The first three months',
      blocs: [
        {
          type: 'p',
          texte: 'According to Tropica, the first 90 days are decisive: the plants adapt while algae find fertile ground. These habits help you get through this period:',
        },
        {
          type: 'etapes',
          items: [
            { titre: 'Limit the light', texte: '6 hours a day for the first two to three weeks, then 8 to 10 hours.' },
            { titre: 'Change plenty of water at first', texte: 'Tropica advises 25 to 50% twice a week for three to four weeks, then about 25% a week.' },
            { titre: 'Little or no fertiliser in the first month', texte: 'The plants arrive well fed from the nursery: above all they need to develop their roots.' },
            { titre: 'Add fast-growing plants', texte: 'Fast growers such as *Egeria* or *Limnophila* absorb excess nutrients; you can remove them later.' },
            { titre: 'Add the fish without rushing', texte: 'Wait until the plants have settled and the filter has [cycled](/cours/cycle-azote#cyclage), then add them gradually.' },
          ],
        },
      ],
    },
  ],
  aRetenir: [
    'Live plants absorb part of the waste, hold back algae and provide hiding places.',
    'A sloping substrate and tiered plants give the layout depth.',
    'Test rocks with vinegar and soak roots before putting them in.',
    'Never bury the rhizome of Anubias and Java ferns.',
  ],
  sources: [
    { nom: 'Tropica, “Hardscape and substrate”', url: 'https://tropica.com/en/guide/get-the-right-start/hardscape-and-substrate/' },
    { nom: 'Tropica, “Planting”', url: 'https://tropica.com/en/guide/get-the-right-start/planting/' },
    { nom: 'Tropica, “Starting a new aquarium”', url: 'https://tropica.com/en/guide/get-the-right-start/growing-in/' },
    { nom: 'Tropica, 1-2-Grow! catalogue', url: 'https://tropica.com/en/plants/1-2-grow/' },
    { nom: 'Tropica, “The right light for your aquarium”', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/light/' },
    { nom: 'OATA, “How to set up and look after a freshwater tank”', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
  ],
};

export default cours;

/** Lesson: choosing, acclimatising and feeding fish (English version of ../accueillir-poissons.js) */
const cours = {
  slug: 'accueillir-poissons',
  titre: 'Welcoming and feeding your fish',
  resume: 'Choosing healthy, compatible fish, acclimatising them without shock, quarantining them and feeding them without polluting the water.',
  icone: 'Fish',
  sections: [
    {
      id: 'choisir',
      titre: 'Choosing compatible fish',
      blocs: [
        {
          type: 'p',
          texte: 'Read up on each species before buying it: adult size, water, shoaling or solitary life, temperament. Some species must live in a group, others are territorial or aggressive and do not tolerate their neighbours. The [simulator](/simulation) cross-checks this information for you and flags risky combinations.',
        },
        {
          type: 'p',
          texte: 'For a first tropical tank, OATA lists hardy species: tetras, guppies, mollies, platies, swordtails, corydoras and gouramis. Browse them in [the catalogue](/poissons) to compare their needs.',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'Recognising a healthy fish',
          items: [
            'Clear, bright eyes, whole fins and intact scales.',
            'No wounds, lumps, or white or cottony spots.',
            'Normal swimming for the species and steady breathing.',
            'Do not take a fish that looks healthy if it shares its tank with sick fish.',
          ],
        },
      ],
    },
    {
      id: 'acclimater',
      titre: 'Transport and acclimatisation',
      blocs: [
        {
          type: 'p',
          texte: 'Before buying, check that the ammonia and nitrite in your tank are at zero. Go straight home: bright light, extreme temperatures, noise and jolts stress the fish in their bag. At home, they then need to be gradually accustomed to the temperature and chemistry of your water.',
        },
        {
          type: 'flux',
          items: [
            { titre: 'Turn off the light', texte: 'Take the bag out of its packaging away from bright light.', ton: 'neutre' },
            { titre: 'Float the bag', sousTitre: 'at least 10 minutes', texte: 'The temperature in the bag matches that of the tank.', ton: 'neutre' },
            { titre: 'Mix the waters', sousTitre: 'over about twenty minutes', texte: 'Add a little tank water to the bag, several times.', ton: 'neutre' },
            { titre: 'Transfer with a net', texte: 'Without pouring the bag water into the tank.', ton: 'ok' },
          ],
          legende: 'The floating bag method described by OATA.',
        },
        {
          type: 'p',
          texte: 'For sensitive species, or if the shop’s water is very different from yours, the **drip method** is gentler: the fish and their water are placed in a container into which tank water drips slowly, until the two waters are identical. It takes from one to several hours, for example for discus.',
        },
        {
          type: 'p',
          texte: 'Leave the light off for the rest of the day and keep an eye on the newcomers and the water quality during the first week.',
        },
      ],
    },
    {
      id: 'quarantaine',
      titre: 'Quarantine',
      blocs: [
        {
          type: 'p',
          texte: 'A fish can carry a disease without showing any signs. Quarantine means keeping newcomers in a **separate tank for two to four weeks** before introducing them into the main tank. It is especially useful if your tank has not received new fish for a long time.',
        },
        {
          type: 'liste',
          items: [
            'A small tank equipped with a heater, an already mature filter (or filter media taken from the main tank) and a few hiding places.',
            'The same water as the main tank: fill it with water from it as much as possible.',
            'Feed normally and change the water every week.',
            'Use a net and siphon kept only for this tank.',
            'If there are no signs of disease at the end of the period, the fish can join the main tank.',
          ],
        },
      ],
    },
    {
      id: 'nourrir',
      titre: 'Feeding without excess',
      blocs: [
        {
          type: 'p',
          texte: 'The RSPCA advises giving what the fish eat in **two to five minutes**, in two or three small meals a day rather than one large one. Any uneaten food breaks down into ammonia: overfeeding is one of the main causes of polluted water.',
        },
        {
          type: 'liste',
          items: [
            '**Vary the diet**: basic flakes or granules, supplemented with frozen prey (daphnia, brine shrimp) that has been fully thawed.',
            '**Think of the bottom**: bottom and midwater fish need food that sinks, as tablets or granules.',
            '**Respect feeding times**: nocturnal species, such as some catfish, feed in the evening, with the lights off.',
            '**Match the diet**: plecos and other grazers need vegetables (courgette, spinach) and sometimes wood to rasp. Each species’ diet is given on its profile.',
          ],
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'When in doubt, give less',
          texte: 'A fish copes well with a few days of fasting, much less with water loaded with ammonia. If food remains on the bottom after the meal, remove it and reduce the portions.',
        },
      ],
    },
    {
      id: 'relacher',
      titre: 'Never release a fish',
      blocs: [
        {
          type: 'p',
          texte: 'An aquarium fish released into the wild usually dies; if it survives, it can seriously harm the local wildlife. The [mosquitofish](/poissons/74), introduced worldwide to fight mosquitoes, now threatens small local species as far as southern Europe. Never empty a tank’s water, substrate or plants into a river or stream either. If you can no longer keep a fish, offer it to a fish shop, a club or another hobbyist.',
        },
      ],
    },
  ],
  aRetenir: [
    'Choose species compatible with your water and with each other, and healthy fish.',
    'Acclimatise gently: float the bag for at least 10 minutes, then mix the waters gradually.',
    'A quarantine of two to four weeks protects the main tank.',
    'Feed what is eaten in two to five minutes; less is better than too much.',
  ],
  sources: [
    { nom: 'OATA, “How to set up and look after a freshwater tank”', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'RSPCA, “What to feed your fish”', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/diet' },
    { nom: 'Maidenhead Aquatics, “Do I need to quarantine my new fish?”', url: 'https://www.fishkeeper.co.uk/faq/do-i-need-to-quarantine-my-new-fish-and-if-so-how-do-i-do-it' },
    { nom: 'University of Florida (UF/IFAS), “Ammonia in Aquatic Systems”', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Aquarius profile of the mosquitofish (FishBase)', url: 'https://www.fishbase.se/summary/Gambusia-holbrooki.html' },
  ],
};

export default cours;

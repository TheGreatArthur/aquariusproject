/** Lesson: water parameters (English version of ../parametres-eau.js) */
const cours = {
  slug: 'parametres-eau',
  titre: 'Water parameters',
  resume: 'pH, GH, KH and CO₂: what these values measure, how to read your tap water report and choose fish that will thrive in it.',
  icone: 'Beaker',
  sections: [
    {
      id: 'mesurer',
      titre: 'What to measure',
      blocs: [
        {
          type: 'p',
          texte: 'Clear water is not necessarily healthy water: ammonia and nitrite are invisible. Test kits, as strips or liquid reagents (more accurate), are part of the basic equipment. OATA advises testing at least once a week, and more often when the tank is new or after new fish arrive.',
        },
        {
          type: 'tableau',
          colonnes: ['Parameter', 'What it shows', 'Guideline'],
          lignes: [
            ['Ammonia (NH₃/NH₄⁺)', 'Fish waste not yet processed', 'Zero; never more than 0.02 mg/L of free ammonia (OATA)'],
            ['Nitrite (NO₂⁻)', 'Intermediate step of the nitrogen cycle', 'Zero; never more than 0.2 mg/L (OATA)'],
            ['Nitrate (NO₃⁻)', 'End product of the cycle, builds up', 'Less than 50 mg/L above tap water (OATA)'],
            ['pH', 'Acidity of the water', 'Depends on the species, usually between 6 and 8'],
            ['GH', 'General hardness: calcium and magnesium', 'Depends on the species'],
            ['KH', 'Carbonates: pH stability', 'Prevents sudden pH crashes'],
            ['Temperature', 'Fish metabolism', 'Depends on the species, often 24 to 27 °C'],
            ['Dissolved oxygen', 'Breathing', 'At least 6 mg/L (OATA)'],
          ],
          legende: 'The values for each species are given on [its profile](/poissons) and checked by the simulator.',
        },
      ],
    },
    {
      id: 'ph',
      titre: 'pH: acidic or alkaline',
      blocs: [
        {
          type: 'p',
          texte: 'pH measures the acidity of water on a scale from 0 to 14: 7 is neutral, below that the water is acidic, above it is basic (also called alkaline). The scale is logarithmic: water at pH 6 is ten times more acidic than water at pH 7, and a hundred times more than water at pH 8.',
        },
        {
          type: 'p',
          texte: 'Each species has adapted to a specific environment: the acidic, very mineral-poor rivers of Amazonia for many tetras, rather hard water for the livebearers of Central America, the very alkaline lakes of the African Rift for the cichlids of Malawi and Tanganyika.',
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
          legende: 'pH ranges of a few species from the catalogue, with their hardness (GH, in °dGH). A community tank brings together species whose ranges overlap: that is what [the simulator](/simulation) checks.',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'Stability above all',
          texte: 'A stable pH, even slightly outside the ideal range, is better than repeated corrections that make it swing. The water for each change should have a hardness, pH and temperature close to those of the tank.',
        },
      ],
    },
    {
      id: 'durete',
      titre: 'GH and KH: hardness',
      blocs: [
        {
          type: 'p',
          texte: '**GH** (general hardness) measures dissolved calcium and magnesium ions: it is what makes water “hard” and leaves limescale. **KH** (carbonate hardness, sometimes called alkalinity) measures carbonates and bicarbonates. They neutralise the acids produced in the tank, notably by nitrification: with a very low KH, the pH can crash suddenly.',
        },
        {
          type: 'p',
          texte: 'Aquarium tests and Aquarius profiles give hardness in **German degrees** (°dGH and °dKH). Water reports may use other units: **French degrees** (°f) in France, or milligrams per litre of calcium carbonate (mg/L CaCO₃, also called ppm) in many other countries. One German degree equals 10 mg/L of calcium oxide, or 17.8 mg/L of calcium carbonate, and one French degree 10 mg/L of calcium carbonate. So 1 °dGH ≈ 1.78 °f ≈ 17.8 mg/L CaCO₃: a hardness of 200 mg/L CaCO₃ (20 °f) is about 11 °dGH.',
        },
        {
          type: 'figure',
          schema: 'EchelleDurete',
          legende: 'Water hardness classes in French degrees (Wikipedia, “Dureté de l’eau”), with their equivalent in German degrees.',
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: 'Know your tap water',
          texte: 'Your water supplier publishes the results of its drinking water tests; in France they are available town by town on [the Ministry of Health’s website](https://www.eaupotable.sante.gouv.fr/). Find the total hardness and divide it by 17.8 if it is in mg/L CaCO₃, or by 1.78 if it is in °f, to get the GH in °dGH; the alkalinity gives the KH in the same way. You will also find the starting nitrate level there.',
        },
      ],
    },
    {
      id: 'co2',
      titre: 'CO₂, KH and pH',
      blocs: [
        {
          type: 'p',
          texte: 'Dissolved CO₂, released by the breathing of fish and bacteria or injected for plants, forms carbonic acid and lowers the pH. When the KH is known, the pH therefore gives an estimate of CO₂: **CO₂ ≈ 3 × KH × 10^(7 − pH)**, in mg/L with the KH in °dKH.',
        },
        {
          type: 'figure',
          schema: 'TableauCo2',
          legende: 'Estimated dissolved CO₂ (mg/L) by KH and pH, with plant needs according to Tropica. Only valid if CO₂ is the only acid in the water: peat, wood or catappa leaves lower the pH and skew the estimate.',
        },
        {
          type: 'p',
          texte: 'According to Tropica, “easy” plants do without added CO₂, although a little (3 to 5 mg/L) is better than nothing; “Medium” plants need 10 to 15 mg/L and the most demanding 15 to 30 mg/L. To follow CO₂ without calculating, a **drop checker** filled with a 4 °dKH reference solution turns green between about 25 and 35 mg/L.',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'Injected CO₂ and fish',
          texte: 'CO₂ builds up when plants stop absorbing it, that is, at night. Switch off the injection at the same time as the lights and watch the fish: if they breathe fast near the surface, reduce the flow and increase surface agitation.',
        },
      ],
    },
    {
      id: 'adapter',
      titre: 'Adapting the water, or the fish',
      blocs: [
        {
          type: 'p',
          texte: 'The simplest and most stable approach is to choose fish suited to your tap water. Hard, alkaline water suits livebearers, rainbowfish or African cichlids; soft water suits tetras, rasboras and corydoras. The simulator filters the catalogue precisely by your pH, GH and temperature.',
        },
        {
          type: 'p',
          texte: 'If you are set on species from different water, change it gradually and prepare the water for changes in the same way:',
        },
        {
          type: 'liste',
          items: [
            '**Soften**: mix tap water with reverse osmosis or demineralised water, measuring the resulting GH and KH. Pure reverse osmosis water has no buffering capacity left.',
            '**Acidify gently**: peat in the filter, roots and catappa leaves release humic acids that lower the pH and tint the water amber.',
            '**Harden**: coral sand or limestone rocks (they fizz when vinegar is dropped on them) raise the GH, KH and pH.',
            'Avoid “pH down” or “pH up” products used on their own: without acting on the KH, they cause sudden swings.',
          ],
        },
      ],
    },
  ],
  aRetenir: [
    'Test the water at least once a week: ammonia and nitrite at zero, nitrate low.',
    'pH measures acidity, GH calcium and magnesium, KH the carbonates that stabilise the pH.',
    '1 °dGH ≈ 1.78 °f ≈ 17.8 mg/L CaCO₃: convert the hardness from your water report to get the GH.',
    'Choose fish suited to your water rather than correcting it all the time.',
  ],
  sources: [
    { nom: 'OATA, “Water quality criteria”', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'OATA, “How to test water quality in your freshwater tank”', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-test-water-quality-in-your-freshwater-tank-aquarium/' },
    { nom: 'Wikipedia (French), “Dureté de l’eau”', url: 'https://fr.wikipedia.org/wiki/Duret%C3%A9_de_l%27eau' },
    { nom: 'French Ministry of Health, drinking water quality by town', url: 'https://www.eaupotable.sante.gouv.fr/' },
    { nom: 'Tropica, “Fertiliser and CO2”', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/fertiliser-and-co2/' },
    { nom: 'Aquarium Science, “Measuring CO2”', url: 'https://aquariumscience.org/15-6-6-measuring-co2/' },
    { nom: 'University of Florida (UF/IFAS), “Ammonia in Aquatic Systems”', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
  ],
};

export default cours;

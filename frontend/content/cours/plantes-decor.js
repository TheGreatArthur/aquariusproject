/** Cours : plantes et décor */
const cours = {
  slug: 'plantes-decor',
  titre: 'Plantes et décor',
  resume: 'Composer un décor qui a de la profondeur, choisir des plantes faciles, les planter selon leur type et passer le cap des trois premiers mois.',
  icone: 'Leaf',
  sections: [
    {
      id: 'pourquoi',
      titre: 'Pourquoi des plantes vivantes',
      blocs: [
        {
          type: 'liste',
          items: [
            '**Elles assainissent l\'eau** : elles absorbent une partie des nitrates et de l\'ammonium produits par les poissons.',
            '**Elles freinent les algues** : les plantes à croissance rapide consomment les nutriments dont les algues profitent.',
            '**Elles abritent les poissons** : les espèces timides ou territoriales ont besoin de cachettes, et les alevins de refuges.',
          ],
        },
        {
          type: 'p',
          texte: 'Un bac sans plantes vivantes peut fonctionner, à condition de changer l\'eau plus souvent ; mais les plantes rendent l\'équilibre plus facile et le bac plus naturel.',
        },
      ],
    },
    {
      id: 'composer',
      titre: 'Composer le décor',
      blocs: [
        {
          type: 'p',
          texte: 'Tropica conseille de dessiner l\'aménagement avant de commencer, en plaçant d\'abord le décor minéral (le *hardscape* : sol, roches, racines) puis les plantes. Deux principes donnent de la profondeur à un bac :',
        },
        {
          type: 'liste',
          items: [
            '**Un sol en pente** : 3 à 4 cm de gravier à l\'avant et 6 à 8 cm à l\'arrière.',
            '**Des plantes étagées** : les basses au premier plan, les moyennes au milieu, les hautes à l\'arrière et sur les côtés, pour garder un espace de nage dégagé devant.',
          ],
        },
        {
          type: 'figure',
          schema: 'PlanAquarium',
          legende: 'Placez le point fort du décor, une belle pierre ou une racine, sur une ligne des tiers plutôt qu\'au centre : la composition paraît plus naturelle. La pente du sol suit les recommandations de Tropica.',
        },
      ],
    },
    {
      id: 'materiaux',
      titre: 'Sol, roches et racines',
      blocs: [
        {
          type: 'liste',
          items: [
            '**Le sol** : un gravier de 0,8 à 4 mm laisse circuler l\'eau autour des racines. Sous ce gravier, une couche de 0,5 à 1 cm de substrat nutritif nourrit les plantes à racines puissantes. Le sable fin convient aux poissons qui fouillent le fond, comme les corydoras.',
            '**Les roches** : certaines, calcaires, font monter la dureté et le pH. Une goutte de vinaigre qui mousse sur la roche trahit le calcaire : réservez-la aux bacs d\'eau dure. Posez les grosses pierres sur une plaque de polystyrène pour protéger la vitre du fond, avant de verser le sol.',
            '**Les racines** : elles flottent souvent au début et libèrent des tanins qui colorent l\'eau en ambre. Faites-les tremper plusieurs jours, en changeant l\'eau, avant de les installer.',
            'Évitez les objets coupants ou peints et les décors non destinés à l\'aquarium : ils peuvent blesser les poissons ou relâcher des substances dans l\'eau.',
          ],
        },
      ],
    },
    {
      id: 'plantes',
      titre: 'Choisir des plantes faciles',
      blocs: [
        {
          type: 'p',
          texte: 'Tropica classe ses plantes en trois catégories. Les plantes **faciles** (Easy) supportent un éclairage faible et se passent d\'apport de CO₂ : ce sont celles qui réussissent le mieux pour un premier bac.',
        },
        {
          type: 'tableau',
          colonnes: ['Plante', 'Type', 'Place', 'À savoir'],
          lignes: [
            ['*Anubias barteri* var. *nana*', 'Rhizome', 'Premier plan, sur roche ou racine', 'Une des plus faciles ; aime l\'ombre'],
            ['*Microsorum pteropus* (fougère de Java)', 'Rhizome', 'Plan moyen, sur roche ou racine', 'Se fixe sur le décor, pousse lentement'],
            ['*Cryptocoryne wendtii* \'Green\'', 'Rosette', 'Premier plan ou plan moyen', 'Peu d\'entretien, supporte l\'ombre'],
            ['*Echinodorus* \'Reni\'', 'Rosette', 'Plan moyen', 'Petit *Echinodorus* rouge et vert, adapté aux petits bacs'],
            ['*Bacopa caroliniana*', 'Tige', 'Arrière-plan', 'Les boutures replantées forment de nouveaux pieds'],
            ['*Vallisneria*', 'Stolons', 'Arrière-plan', 'Longues feuilles en ruban, se multiplie seule'],
            ['*Taxiphyllum barbieri* (mousse de Java)', 'Mousse', 'Sur roche ou racine', 'Abri idéal pour les alevins et les crevettes'],
            ['*Limnobium laevigatum*', 'Flottante', 'Surface', 'Fait de l\'ombre aux plantes du dessous'],
          ],
          legende: 'Une sélection de plantes faciles d\'après le catalogue et le guide de plantation de Tropica.',
        },
      ],
    },
    {
      id: 'planter',
      titre: 'Planter selon le type de plante',
      blocs: [
        {
          type: 'p',
          texte: 'Le plus simple est de planter dans un bac rempli de quelques centimètres d\'eau seulement, en gardant les feuilles humides avec un vaporisateur. Retirez le pot et la laine de roche de chaque plante, puis :',
        },
        {
          type: 'liste',
          items: [
            '**Tiges** : raccourcissez les racines à environ 4 cm, retirez les feuilles du bas et plantez les tiges une par une, en groupe.',
            '**Rosettes** : raccourcissez les racines à environ 4 cm, séparez les pieds et retirez les feuilles les plus anciennes.',
            '**Rhizomes** (*Anubias*, *Microsorum*) : n\'enterrez jamais le rhizome, il pourrirait. Attachez la plante sur une racine ou une roche avec du fil, ou coincez-la entre deux pierres.',
            '**Mousses** : divisez-les en petites touffes, posées sur le décor ou fixées dessus.',
            '**Plantes flottantes** : posez-les simplement à la surface, en tenant compte de l\'ombre qu\'elles feront.',
          ],
        },
      ],
    },
    {
      id: 'demarrage',
      titre: 'Les trois premiers mois',
      blocs: [
        {
          type: 'p',
          texte: 'Selon Tropica, les 90 premiers jours sont décisifs : les plantes s\'adaptent pendant que les algues trouvent un terrain favorable. Ces habitudes aident à passer ce cap :',
        },
        {
          type: 'etapes',
          items: [
            { titre: 'Limitez la lumière', texte: '6 heures par jour pendant les deux à trois premières semaines, puis 8 à 10 heures.' },
            { titre: 'Changez beaucoup d\'eau au début', texte: 'Tropica conseille 25 à 50 % deux fois par semaine pendant trois à quatre semaines, puis environ 25 % par semaine.' },
            { titre: 'Peu ou pas d\'engrais le premier mois', texte: 'Les plantes arrivent bien nourries de la pépinière : elles ont surtout besoin de développer leurs racines.' },
            { titre: 'Ajoutez des plantes rapides', texte: 'Des plantes à croissance rapide, comme *Egeria* ou *Limnophila*, absorbent les nutriments en excès ; vous pourrez les retirer plus tard.' },
            { titre: 'Introduisez les poissons sans hâte', texte: 'Attendez que les plantes soient installées et que le filtre ait [cyclé](/cours/cycle-azote#cyclage), puis ajoutez-les progressivement.' },
          ],
        },
      ],
    },
  ],
  aRetenir: [
    'Les plantes vivantes absorbent une partie des déchets, freinent les algues et offrent des cachettes.',
    'Un sol en pente et des plantes étagées donnent de la profondeur au décor.',
    'Testez les roches au vinaigre et faites tremper les racines avant de les installer.',
    'N\'enterrez jamais le rhizome des Anubias et des fougères de Java.',
  ],
  sources: [
    { nom: 'Tropica, « Hardscape and substrate »', url: 'https://tropica.com/en/guide/get-the-right-start/hardscape-and-substrate/' },
    { nom: 'Tropica, « Planting »', url: 'https://tropica.com/en/guide/get-the-right-start/planting/' },
    { nom: 'Tropica, « Starting a new aquarium »', url: 'https://tropica.com/en/guide/get-the-right-start/growing-in/' },
    { nom: 'Tropica, catalogue 1-2-Grow!', url: 'https://tropica.com/en/plants/1-2-grow/' },
    { nom: 'Tropica, « The right light for your aquarium »', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/light/' },
    { nom: 'OATA, « How to set up and look after a freshwater tank »', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
  ],
};

export default cours;

/** レッスン：水草とレイアウト（../plantes-decor.js の日本語版） */
const cours = {
  slug: 'plantes-decor',
  titre: '水草とレイアウト',
  resume: '奥行きのあるレイアウトをつくり、育てやすい水草を選び、種類に合わせて植え、最初の3か月を乗り切る方法。',
  icone: 'Leaf',
  sections: [
    {
      id: 'pourquoi',
      titre: 'なぜ生きた水草なのか',
      blocs: [
        {
          type: 'liste',
          items: [
            '**水をきれいにする**：魚が出す硝酸塩やアンモニウムの一部を吸収する。',
            '**コケを抑える**：成長の速い水草が、コケの好む栄養を使ってしまう。',
            '**魚の隠れ家になる**：臆病な種や縄張りをもつ種には隠れ場所が、稚魚には逃げ場が必要である。',
          ],
        },
        {
          type: 'p',
          texte: '生きた水草のない水槽でも、換水を増やせば成り立つ。しかし水草があるとバランスがとりやすくなり、水槽も自然に見える。',
        },
      ],
    },
    {
      id: 'composer',
      titre: 'レイアウトを考える',
      blocs: [
        {
          type: 'p',
          texte: 'Tropica は、始める前にレイアウトをスケッチし、まず底床、石、流木などの*ハードスケープ*を配置してから水草を植えるようすすめている。水槽に奥行きを出すには、2つの原則がある。',
        },
        {
          type: 'liste',
          items: [
            '**傾斜をつけた底床**：手前は砂利 3〜4 cm、奥は 6〜8 cm。',
            '**段になった水草**：背の低い水草を前景に、中くらいのものを中景に、背の高いものを後景と両脇に植え、手前に泳ぐ空間を残す。',
          ],
        },
        {
          type: 'figure',
          schema: 'PlanAquarium',
          legende: 'レイアウトの見せ場となる美しい石や流木は、中央ではなく三分割線の上に置くと、構図が自然に見える。底床の傾斜は Tropica の推奨に従っている。',
        },
      ],
    },
    {
      id: 'materiaux',
      titre: '底床、石、流木',
      blocs: [
        {
          type: 'liste',
          items: [
            '**底床**：粒の大きさ 0.8〜4 mm の砂利なら、根の周りを水が通る。その下に 0.5〜1 cm の栄養系ソイル（肥料入りの下床）を敷くと、根を張る水草に栄養を与えられる。コリドラスのように底をあさる魚には細かい砂が向く。',
            '**石**：石灰質の石は硬度と pH を上げる。酢をかけて泡立つ石は石灰質である。こうした石は硬水の水槽だけに使う。大きな石は、底床を入れる前に発泡スチロールの板の上に置き、底のガラスを守る。',
            '**流木**：最初は浮くことが多く、水を琥珀色に染めるタンニンを出す。入れる前に、水を替えながら数日間水に浸けておく。',
            'とがった物、塗装された物、アクアリウム用でない飾りは避ける。魚を傷つけたり、水に有害な物質を出したりすることがある。',
          ],
        },
      ],
    },
    {
      id: 'plantes',
      titre: '育てやすい水草を選ぶ',
      blocs: [
        {
          type: 'p',
          texte: 'Tropica は水草を3つの区分に分けている。**育てやすい**（Easy）水草は弱い照明でも育ち、CO₂ の添加もいらないので、はじめての水槽で最もうまくいく。',
        },
        {
          type: 'tableau',
          colonnes: ['水草', 'タイプ', '配置', '知っておきたいこと'],
          lignes: [
            ['*Anubias barteri* var. *nana*（アヌビアス・ナナ）', '根茎', '前景、石や流木に活着', '最も育てやすいもののひとつ。日陰を好む'],
            ['*Microsorum pteropus*（ミクロソリウム）', '根茎', '中景、石や流木に活着', 'レイアウト素材に活着し、ゆっくり育つ'],
            ['*Cryptocoryne wendtii* ’Green’', 'ロゼット型', '前景または中景', '手間がかからず、日陰にも強い'],
            ['*Echinodorus* ’Reni’', 'ロゼット型', '中景', '赤と緑の小型エキノドルスで、小型水槽向き'],
            ['*Bacopa caroliniana*（バコパ・カロリニアナ）', '有茎草', '後景', '差し戻した先端が新しい株になる'],
            ['*Vallisneria*（バリスネリア）', 'ランナー', '後景', 'リボン状の長い葉で、自然に増える'],
            ['*Taxiphyllum barbieri*（ウィローモス）', 'コケ', '石や流木の上', '稚魚やエビの理想的な隠れ家'],
            ['*Limnobium laevigatum*（アマゾンフロッグピット）', '浮草', '水面', '下の水草に影をつくる'],
          ],
          legende: 'Tropica のカタログと植栽ガイドをもとに選んだ育てやすい水草。水質、写真、育て方のこつは[水草のカタログ](/plantes)を参照。',
        },
      ],
    },
    {
      id: 'planter',
      titre: '水草の種類に合わせて植える',
      blocs: [
        {
          type: 'p',
          texte: '最も簡単なのは、水槽に数センチだけ水を入れた状態で植え、霧吹きで葉を湿らせておく方法である。それぞれの水草からポットとロックウールを外し、次のように植える。',
        },
        {
          type: 'liste',
          items: [
            '**有茎草**：根を約 4 cm に切りそろえ、下の葉を取り、1本ずつまとめて植える。',
            '**ロゼット型**：根を約 4 cm に切りそろえ、株を分け、古い葉を取り除く。',
            '**根茎の水草**（*Anubias*、*Microsorum*）：根茎は決して埋めない。腐ってしまう。糸で流木や石にくくりつけるか、2つの石の間に挟む。',
            '**コケ**：小さな房に分けて、レイアウト素材の上に置くか、くくりつける。',
            '**浮草**：水面に浮かべるだけでよいが、下にできる影を考えておく。',
          ],
        },
      ],
    },
    {
      id: 'demarrage',
      titre: '最初の3か月',
      blocs: [
        {
          type: 'p',
          texte: 'Tropica によると、最初の90日が勝負である。水草が環境に慣れていく一方で、コケも増えやすい条件がそろう。次の習慣がこの時期を乗り切る助けになる。',
        },
        {
          type: 'etapes',
          items: [
            { titre: '光を控える', texte: '最初の2〜3週間は1日6時間、その後は8〜10時間。' },
            { titre: '最初はたっぷり換水する', texte: 'Tropica は、3〜4週間は週2回 25〜50%、その後は週に約 25% の換水をすすめている。' },
            { titre: '最初の1か月は肥料を控える', texte: '水草は育成場からたっぷり栄養をもらって届く。何より根を伸ばすことが必要である。' },
            { titre: '成長の速い水草を加える', texte: '*Egeria*（アナカリス）や *Limnophila* のような成長の速い水草は余分な栄養を吸収する。あとで取り除いてもよい。' },
            { titre: '魚は急がずに入れる', texte: '水草が根づき、フィルターの[サイクリング](/cours/cycle-azote#cyclage)が済むのを待ってから、少しずつ入れる。' },
          ],
        },
      ],
    },
  ],
  aRetenir: [
    '生きた水草は汚れの一部を吸収し、コケを抑え、隠れ家になる。',
    '傾斜をつけた底床と段になった水草が、レイアウトに奥行きを与える。',
    '石は酢で確かめ、流木は入れる前に水に浸けておく。',
    'アヌビアスやミクロソリウムの根茎は決して埋めない。',
  ],
  sources: [
    { nom: 'Tropica「Hardscape and substrate」', url: 'https://tropica.com/en/guide/get-the-right-start/hardscape-and-substrate/' },
    { nom: 'Tropica「Planting」', url: 'https://tropica.com/en/guide/get-the-right-start/planting/' },
    { nom: 'Tropica「Starting a new aquarium」', url: 'https://tropica.com/en/guide/get-the-right-start/growing-in/' },
    { nom: 'Tropica、1-2-Grow! カタログ', url: 'https://tropica.com/en/plants/1-2-grow/' },
    { nom: 'Tropica「The right light for your aquarium」', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/light/' },
    { nom: 'OATA「How to set up and look after a freshwater tank」', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
  ],
};

export default cours;

/** レッスン：日々のメンテナンス（../entretien.js の日本語版） */
const cours = {
  slug: 'entretien',
  titre: '日々のメンテナンス',
  resume: '毎日数分、毎週30分ほどの手入れ。換水、フィルター、水質検査、注意すべきサイン。',
  icone: 'CalendarCheck',
  sections: [
    {
      id: 'routine',
      titre: 'シンプルな手入れの習慣',
      blocs: [
        {
          type: 'p',
          texte: '魚はすべてを飼い主に頼っている。ほとんどの作業はすぐに終わるが、大切なのは定期的に行うこと、そして変化に気づけるよう検査結果を記録しておくことである。',
        },
        {
          type: 'colonnes',
          colonnes: [
            {
              titre: '毎日',
              items: [
                '餌の時間に魚を観察する：泳ぎ方、食欲、呼吸',
                '水温を確かめる',
                'フィルターとヒーターが動いているか確かめる',
                '食べ残しを取り除く',
              ],
            },
            {
              titre: '毎週',
              items: [
                '水の 10〜25% を換える',
                '底床のごみを吸い出す',
                'ガラス面を掃除する',
                'アンモニア、亜硝酸、硝酸塩を測る',
              ],
            },
            {
              titre: '毎月',
              items: [
                '水槽から抜いた水でろ材をすすぐ',
                '水草をトリミングし、傷んだ葉を取り除く',
                'pH と硬度を確かめる',
                'フィルターのポンプのインペラーを掃除する',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'changer-eau',
      titre: '換水の手順',
      blocs: [
        {
          type: 'etapes',
          items: [
            { titre: '新しい水を用意する', texte: '水槽と同じ水温にし、足す水量に合わせてカルキ抜きを入れる。' },
            { titre: 'ヒーターとフィルターを止める', texte: '水から出たヒーターは割れたり過熱したりすることがあり、ポンプも空回りさせてはいけない。' },
            { titre: '水を吸い出す', texte: '呼び水式のホースを使い、決して口で吸わない。水槽の水には人に危険なバクテリアがいることがある。ホースの先を底床に差し込んで、ごみを吸い出す。' },
            { titre: '必要ならろ材をすすぐ', texte: '水槽から抜いた水を入れたバケツの中ですすぎ、決して水道水では洗わない。' },
            { titre: 'ゆっくり水を足す', texte: '底床が舞い上がらないよう、皿や手のひらに当てながら注ぐ。' },
            { titre: '電源を入れて確かめる', texte: 'フィルターが再び動くこと（空気をかんでいたら呼び水をする）とヒーターが入ることを確かめる。' },
          ],
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: 'なぜカルキ抜きが必要なのか',
          texte: '水道水は塩素、ときにクロラミンで消毒されており、どちらも魚やフィルターのバクテリアに有毒である。塩素は数日汲み置けば抜けるが、ずっと安定したクロラミンは抜けない。カルキ抜きは両方を数秒で中和する。',
        },
      ],
    },
    {
      id: 'quantite',
      titre: 'どれくらい換水するか',
      blocs: [
        {
          type: 'p',
          texte: 'OATA は週に 25% まで、Tropica は水槽が安定したら約 30% をすすめている。適量は生体の数、餌の量、水草によって変わるので、低く保つべき硝酸塩の値を目安にする。一度に大量に換えると水質が大きく変わるので、少量ずつ何度かに分けて換えるほうがよい。',
        },
        {
          type: 'tableau',
          colonnes: ['測定で…', 'どうするか'],
          lignes: [
            ['アンモニアや亜硝酸が出たら', '1〜3日餌を止め、水の 25〜50% を換え、ゼロに戻るまで翌日以降もくり返す。フィルターを点検する。'],
            ['硝酸塩が週ごとに増えていたら', '換水の量か回数を増やし、餌を減らし、成長の速い水草を加える。'],
            ['pH が下がっていたら', 'KH を測る。KH が尽きると pH が急に下がる。定期的な換水で新しい炭酸塩が補われる。'],
            ['水温がおかしかったら', '別の水温計でヒーターを確かめる。夏は水面に風を当てる。'],
          ],
          legende: 'フロリダ大学と OATA の推奨にもとづく対処法。',
        },
      ],
    },
    {
      id: 'filtre',
      titre: 'フィルターの手入れ',
      blocs: [
        {
          type: 'liste',
          items: [
            '流量が落ちたら掃除する。ふつうは月に1回で、必要以上に頻繁にはしない。',
            'スポンジは水槽から抜いた水の中でもみ洗いする。目的は汚泥を落とすことで、新品同様にすることではない。',
            '生物ろ材はほかのろ材と同時に洗わず、決して全部を一度に交換しない。',
            'ポンプのインペラーを外してすすぐ。巻きついたごみが流量を落とす。',
          ],
        },
      ],
    },
    {
      id: 'alerte',
      titre: '注意すべきサインを見つける',
      blocs: [
        {
          type: 'p',
          texte: '魚にはそれぞれの習性がある。いつもと違う様子は、水質の問題や病気の最初のサインであることが多い。',
        },
        {
          type: 'colonnes',
          colonnes: [
            { titre: '行動', items: ['水面にとどまる、または底でじっとしている', '泳ぎ方がおかしい', 'いつもより隠れている', 'いつになく攻撃的'] },
            { titre: '呼吸と食欲', items: ['えらぶたの動きが速い', '水面で口を開けている', '餌を食べない', 'やせてきた'] },
            { titre: '見た目', items: ['体に白い点がある', '綿のような糸状のものがついている', 'ひれが傷んでいる、鱗がはがれている', '体色がくすむ、黒ずむ'] },
          ],
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'まずは水を測る',
          texte: '薬を使う前に、アンモニア、亜硝酸、硝酸塩、pH、水温を測る。問題の原因で最も多いのは水質の悪化で、その場合は薬を使っても何も変わらない。症状が続くなら、ショップや獣医師に相談しよう。',
        },
      ],
    },
    {
      id: 'vacances',
      titre: '旅行に出かけるとき',
      blocs: [
        {
          type: 'liste',
          items: [
            '安定した水槽なら、2〜3週間は換水しなくても大丈夫である。出発の前日に換水しておく。',
            '信頼できる人に毎日水槽を見に来てもらい、あらかじめ小分けしておいた餌を与えてもらう。',
            '自動給餌器は出発前に試運転し、留守中も確認してもらう。',
            '「旅行用」の固形の餌は避ける。一度に大量の餌が溶け出し、水中で腐る。',
            '与えすぎるより少なめのほうがよい。魚は汚れた水よりも、絶食のほうがずっと耐えられる。',
          ],
        },
      ],
    },
  ],
  aRetenir: [
    '毎週、水の 10〜30% を、適温でカルキ抜きした水と換える。',
    'フィルターは水槽の水ですすぎ、決して水道水では洗わず、ろ材を一度に全部替えない。',
    '毎週水を測り、結果を記録する。',
    '少しでもおかしな行動が見えたら、治療の前に水を測る。',
  ],
  sources: [
    { nom: 'OATA「How to set up and look after a freshwater tank」', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'OATA「Water quality criteria」', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'RSPCA「Fish environment」', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
    { nom: 'RSPCA「What to feed your fish」', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/diet' },
    { nom: 'Tropica「Water circulation」', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/water-circulation/' },
    { nom: 'フロリダ大学（UF/IFAS）「Ammonia in Aquatic Systems」', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Aquarium Co-Op「Water Dechlorinator」', url: 'https://www.aquariumcoop.com/blogs/aquarium/water-conditioner-for-fish' },
  ],
};

export default cours;

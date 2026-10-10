/** レッスン：窒素循環と水槽の立ち上げ（../cycle-azote.js の日本語版） */
const cours = {
  slug: 'cycle-azote',
  titre: '窒素循環',
  resume: '水槽が魚の排泄物をどう処理するのか、そして魚を危険にさらさずに水槽を立ち上げる方法。',
  icone: 'RefreshCw',
  sections: [
    {
      id: 'dechets',
      titre: '排泄物はどこから来るのか',
      blocs: [
        {
          type: 'p',
          texte: 'ほかの動物と同じく、魚も食べた餌をエネルギーに変え、窒素を含む老廃物を出す。魚の場合、この老廃物は主に**アンモニア**で、大部分はえらから、少しは尿から排出される。食べ残し、ふん、枯れ葉も分解されるときにアンモニアを出す。たくさん食べる魚ほど多く出し、餌を食べていなくても出し続ける。',
        },
        {
          type: 'p',
          texte: '川では、こうした老廃物は膨大な量の水で薄められる。ところが水槽は小さく閉じた水の量しかないので、処理しなければアンモニアは数日でたまってしまう。酸素の次に、魚の健康にとって最も重要な水質項目である。',
        },
      ],
    },
    {
      id: 'bacteries',
      titre: '働いてくれるバクテリア',
      blocs: [
        {
          type: 'p',
          texte: '**窒素循環**（硝化）を担うのは、水槽のあらゆる表面に薄い膜（バイオフィルム）としてすみつくバクテリアである。主にろ材にいるが、底床、レイアウト素材、ガラス面にもいる。バクテリアはアンモニアを2段階で変化させる。',
        },
        {
          type: 'flux',
          items: [
            { titre: '魚と餌', sousTitre: '排泄、食べ残し、ごみ', texte: '窒素の発生源で、絶えず供給される。', ton: 'neutre' },
            { titre: 'アンモニア', sousTitre: 'NH₄⁺ と NH₃', texte: '毒性が非常に強く、特に NH₃ の形が危険。', ton: 'danger' },
            { titre: '亜硝酸', sousTitre: 'NO₂⁻', texte: '低い濃度でも有毒。', ton: 'attention' },
            { titre: '硝酸塩', sousTitre: 'NO₃⁻', texte: '毒性は低い。換水で取り除かれ、一部は水草が吸収する。', ton: 'ok' },
          ],
          legende: 'アンモニアを酸化するバクテリア（*Nitrosomonas*、*Nitrosospira*）が亜硝酸をつくり、別のバクテリア（*Nitrospira*、*Nitrobacter*）がそれを硝酸塩に変える。',
        },
        {
          type: 'p',
          texte: 'アクアリウムの本では長い間、2段階目は *Nitrobacter* の働きとされてきた。しかし1998年、ティモシー・ホバネックらの研究チームが淡水水槽のフィルターのバイオフィルムを分析し、亜硝酸を変化させているのは実は主に *Nitrospira* 属のバクテリアであることを示した。',
        },
        {
          type: 'p',
          texte: 'これらのバクテリアは**酸素**を必要とし、炭酸塩を消費する。硝化によって酸が生じるため、水の緩衝力が足りないと pH が下がる。酸素の豊富なフィルターと、ある程度の炭酸塩硬度（KH、[水質](/cours/parametres-eau#durete)を参照）を保った水が、バクテリアの働きを助ける。',
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: '硝酸塩はどうなる？',
          texte: 'フィルターでは取り除かれず、次の換水までたまり続ける。イギリスの観賞魚業界団体 OATA は、水道水の値より 50 mg/L 以上高くしないよう推奨している。敏感な種はそれよりずっと低い値を好む。',
        },
      ],
    },
    {
      id: 'toxicite',
      titre: 'アンモニアがなぜそれほど危険なのか',
      blocs: [
        {
          type: 'p',
          texte: '水中のアンモニアは2つの形でつり合いを保っている。毒性の低い**アンモニウムイオン**（NH₄⁺）と、魚に対しておよそ100倍も毒性の強い**遊離アンモニア**（NH₃）である。それぞれの割合は pH と水温で決まり、水がアルカリ性で温かいほど遊離アンモニアが多くなる。',
        },
        {
          type: 'figure',
          schema: 'TableauAmmoniac',
          legende: '総アンモニアに占める遊離アンモニア（NH₃）の割合。エマーソンら（1975年）の式で計算したもので、フロリダ大学の参照表にも使われている。',
        },
        {
          type: 'p',
          texte: 'pH 8、水温 26 °C では、測定したアンモニアの 5.7% がすでに遊離アンモニアになっている。つまり総アンモニア 1 mg/L のうち 0.057 mg/L が遊離アンモニアである。OATA は遊離アンモニアをゼロに保ち、決して 0.02 mg/L を超えないよう求めており、フロリダ大学によれば 0.05 mg/L を超えると、えらをはじめとする魚の組織が傷つく。2 mg/L 前後で敏感な種は死んでしまう。',
        },
        {
          type: 'figure',
          schema: 'CalculateurAmmoniac',
          legende: '市販の試薬が測るのは総アンモニア（NH₃ + NH₄⁺）である。この計算ツールはそこから遊離アンモニアを求める。メーカーによって結果が NH₄⁺ 換算か窒素換算かが異なるため、あくまで目安である。',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: '酸性の水の pH が上がるときの落とし穴',
          texte: 'pH 6.5 では、アンモニアのほぼすべてが毒性の低いアンモニウムの形をとっている。ところが、たとえばよりアルカリ性の水道水で大量に換水して pH が急に上がると、同じ量のアンモニアが突然ずっと危険になる。まれに大量に換えるより、少量ずつこまめに換水しよう。',
        },
      ],
    },
    {
      id: 'cyclage',
      titre: '水槽の立ち上げ：サイクリング',
      blocs: [
        {
          type: 'p',
          texte: '新しいフィルターには、まだこのバクテリアがいない。魚を入れる前にバクテリアを増やす必要があり、これを**サイクリング**（フィルターの熟成）という。フロリダ大学によると、新しい生物ろ過がアンモニアと亜硝酸を十分に処理できるようになるまで6〜8週間かかる。温かい水、アンモニアの定期的な供給、バクテリアの添加によって、この期間を短くできる。',
        },
        {
          type: 'figure',
          schema: 'CourbesCyclage',
          legende: 'サイクリング中の測定値の典型的な推移。最初のバクテリアが定着するとアンモニアは上がってから消え、続いて亜硝酸が増えてやがて消え、硝酸塩はたまっていく。曲線は目安で、実際の期間は水槽によって異なる。',
        },
        {
          type: 'p',
          texte: 'OATA は2つの方法を紹介している。丈夫な魚を数匹入れて始める方法と、魚を入れずに自分でアンモニアを加える方法である。後者なら、アンモニアや亜硝酸の急上昇に生き物をさらさずにすむので、こちらをおすすめする。',
        },
        {
          type: 'etapes',
          items: [
            {
              titre: '水槽を設置して水を張る',
              texte: 'カルキ抜きで処理した水道水を入れ、フィルター、ヒーター、底床、水草をセットする。24〜48 時間運転して、器具の動作を確かめ、適温にする。',
            },
            {
              titre: 'アンモニア源を加える',
              texte: 'アンモニアを含む立ち上げ用の製品や塩化アンモニウムを、説明書に従って約 2 mg/L になるように加える。市販のバクテリア剤や、健康な水槽のろ材をひとつかみ入れると、立ち上がりが早くなる。',
            },
            {
              titre: '2〜3日ごとに測定する',
              texte: 'アンモニア、亜硝酸、硝酸塩、pH を測る。アンモニアが下がったら、また加える。pH は 6.5 より上に、水温は 25〜28 °C 前後に保つ。酸性の水や冷たい水では、バクテリアの働きがはっきり鈍る。',
            },
            {
              titre: 'フィルターが追いついているか確かめる',
              texte: '約 2 mg/L のアンモニアが 24 時間以内にゼロになり、亜硝酸も出ず、硝酸塩が現れれば、サイクリングは完了である。',
            },
            {
              titre: '換水してから、少しずつ魚を入れる',
              texte: '大きく換水して、たまった硝酸塩を減らす。そのあと魚は少数ずつ入れる。新しく入れるたびに、バクテリアが増えた負荷に慣れるまで数日かかる。',
            },
          ],
        },
        {
          type: 'encadre',
          ton: 'danger',
          titre: '「新しい水槽症候群」',
          texte: 'サイクリングが済んでいない水槽に魚を入れすぎたり、一度にたくさん追加したりすると、フィルターがまだ処理しきれないアンモニアと亜硝酸が増え、最初の数週間で魚が病気になったり死んだりする。購入前に[シミュレーター](/simulation)で、予定している生体の負荷を計算しよう。',
        },
      ],
    },
    {
      id: 'filtre',
      titre: 'フィルターのバクテリアを守る',
      blocs: [
        {
          type: 'liste',
          items: [
            'ろ材を水道水で洗ってはいけない。塩素がバクテリアを殺してしまう。換水のときに水槽から抜いた水ですすぐ。',
            'ろ材を一度に全部交換しない。バクテリアのコロニーが失われ、水槽がまた一から立ち上げ直しになる。',
            'フィルターを数時間以上止めない。酸素を含んだ水が届かないと、バクテリアは死んでいく。',
            '新しい水には必ずカルキ抜きを使い、塩素やクロラミンを中和する。',
          ],
        },
        {
          type: 'p',
          texte: 'その後の日常の手入れは[日々のメンテナンス](/cours/entretien)で詳しく説明している。',
        },
      ],
    },
  ],
  aRetenir: [
    '魚は絶えずアンモニアを出し、バクテリアがそれを亜硝酸、さらに硝酸塩に変える。',
    'アンモニアと亜硝酸はゼロに保つ。硝酸塩は換水で取り除く。',
    'pH と水温が高いほど、アンモニアの毒性は強くなる。',
    '新しい水槽は魚を迎える前に数週間サイクリングし、その後も魚は少しずつ入れる。',
  ],
  sources: [
    { nom: 'フロリダ大学（UF/IFAS）「Ammonia in Aquatic Systems」', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Emerson et al.（1975）「Aqueous Ammonia Equilibrium Calculations」', url: 'https://doi.org/10.1139/f75-274' },
    { nom: 'Hovanec et al.（1998）「Nitrospira-Like Bacteria Associated with Nitrite Oxidation in Freshwater Aquaria」', url: 'https://journals.asm.org/doi/10.1128/aem.64.1.258-264.1998' },
    { nom: 'OATA「Water quality criteria」', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'OATA「How to set up and look after a freshwater tank」', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'Aquarium Science「Cycling with Ammonia」', url: 'https://aquariumscience.org/index.php/2-4-cycling-with-ammonia/' },
    { nom: 'RSPCA「Fish environment」', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
  ],
};

export default cours;

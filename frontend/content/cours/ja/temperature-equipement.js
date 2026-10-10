/** レッスン：水温と器具（../temperature-equipement.js の日本語版） */
const cours = {
  slug: 'temperature-equipement',
  titre: '水温と器具',
  resume: '水槽、ヒーター、フィルター、照明の選び方と、温かい水がすぐに酸素不足になる理由。',
  icone: 'Thermometer',
  sections: [
    {
      id: 'bac',
      titre: '水槽と置き場所',
      blocs: [
        {
          type: 'p',
          texte: '魚の成魚の大きさを考えて、置けるかぎり大きな水槽を選ぼう。水量が多いほど安定し、水温、pH、汚れの変化が小さな水槽より緩やかになる。同じ水量なら、背の高い水槽より、幅が広く浅い水槽のほうが酸素を交換する水面が広い。',
        },
        {
          type: 'liste',
          items: [
            '直射日光、暖房器具、すきま風を避ける。水温が変動し、コケが増える原因になる。',
            '水を満たした水槽の重さに耐える、水平で頑丈な台に置く。水1リットルは1キロで、さらにガラス、底床、レイアウト素材の重さが加わる。',
            '騒音、振動、人通りの多い場所を避け、手入れのためにコンセントと水場の近くに置く。',
          ],
        },
        {
          type: 'figure',
          schema: 'CalculateurEquipement',
          legende: '淡水水槽の目安。飼う生体や水草に合わせて調整する。',
        },
      ],
    },
    {
      id: 'chauffage',
      titre: 'ヒーターと水温',
      blocs: [
        {
          type: 'p',
          texte: '熱帯魚の多くは 24〜28 °C で暮らす。種ごとの範囲はそれぞれのページに載っている。サーモスタット付きのヒーターをフィルターの排水口の近くに沈めると、熱がまんべんなく行き渡り、水温を保てる。サーモスタットが故障したときのために、別の水温計で確認する。',
        },
        {
          type: 'tableau',
          colonnes: ['ワット数', '推奨される水量'],
          lignes: [
            ['25 W', '20〜25 L'],
            ['50 W', '25〜60 L'],
            ['75 W', '60〜100 L'],
            ['100 W', '100〜150 L'],
            ['150 W', '200〜300 L'],
            ['200 W', '300〜400 L'],
          ],
          legende: 'EHEIM がサーモコントロール・ヒーターに推奨するワット数。寒い部屋ではひとつ上のサイズを選ぶ。大きな水槽ではヒーターを2本にすると熱が行き渡りやすく、片方が故障してももう片方が補う。',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: '高すぎる水温も危険',
          texte: '夏には水温が 30 °C を超えることがある。温かい水は酸素が少ないのに魚の消費量は増え、アンモニアの毒性も強まる。氷を入れると急な温度変化を招くので、照明時間を短くし、ふたを開け、水面に風を当てて冷やす。',
        },
      ],
    },
    {
      id: 'oxygene',
      titre: '酸素と水流',
      blocs: [
        {
          type: 'p',
          texte: '酸素は水面から水に溶け込み、水面が波立つほど交換が速くなる。ところが、水に溶ける酸素の量は水温が上がるほど減る。25 °C の水は、飽和していても 8.3 mg/L しか酸素を含まない。',
        },
        {
          type: 'figure',
          schema: 'CourbeOxygene',
          legende: '海抜 0 m の淡水における飽和溶存酸素量（USGS の表、ベンソンとクラウスの式）。OATA は 6 mg/L 以上を推奨している。熱帯魚水槽には小さな余裕しかなく、それも魚、フィルターのバクテリア、夜の水草に使われてしまう。',
        },
        {
          type: 'p',
          texte: '魚が口を開けて水面に集まっているなら酸素不足である。フィルターの排水口を水面に向けて波立たせるか、小型のエアポンプにつないだエアストーンを入れる。',
        },
      ],
    },
    {
      id: 'filtration',
      titre: 'ろ過',
      blocs: [
        {
          type: 'p',
          texte: 'フィルターは水を循環させ、ごみを取り除き、何より[窒素循環](/cours/cycle-azote)のバクテリアのすみかになる。よく手入れされたフィルターなしで魚を飼ってはならない。水はふつう、いくつかの層を通る。',
        },
        {
          type: 'flux',
          items: [
            { titre: '物理ろ過', sousTitre: 'スポンジ、ウールマット', texte: 'ごみを取り除く。流量が落ちたらすぐにすすぐ。', ton: 'neutre' },
            { titre: '生物ろ過', sousTitre: 'セラミック、目の粗いスポンジ', texte: 'バクテリアのすみか。すすぐのは水槽の水だけで。', ton: 'ok' },
            { titre: '化学ろ過', sousTitre: '任意：活性炭', texte: '色素や薬の残りを取り除く。効果が切れたら交換する。', ton: 'attention' },
          ],
          legende: 'ろ材の順番：ごみはバクテリアのすみかに届く前に止められる。',
        },
        {
          type: 'tableau',
          colonnes: ['フィルターの種類', '向いている水槽', '知っておきたいこと'],
          lignes: [
            ['水中フィルター', '小〜中型水槽', '安価だが、水槽内の場所をとる'],
            ['外部フィルター', '中〜大型水槽', 'ろ材をたっぷり入れられ、静かで、水槽台の中に隠せる'],
            ['外掛けフィルター', '小〜中型水槽', '手入れが簡単で、水面をよく波立たせる'],
            ['スポンジフィルターとエアポンプ', '小型水槽、稚魚、エビ', '水流が穏やかで、小さな生き物を吸い込まない'],
          ],
        },
        {
          type: 'p',
          texte: 'Tropica は**1時間に水槽の水量の3〜5倍**の流量をすすめている。150 リットルなら毎時 450〜750 L である。箱に書かれた流量はろ材なしで測ったもので、実際の流量はそれより少ない。ベタのように小さな魚やひれの長い魚は、穏やかな水流を好む。',
        },
      ],
    },
    {
      id: 'eclairage',
      titre: '照明',
      blocs: [
        {
          type: 'p',
          texte: '光は水草のためと見て楽しむためのもので、魚に必要なのは主に規則正しい昼と夜のリズムである。照明を比べるとき、Tropica はワット数より**ルーメン**を見るようすすめている。育てやすい水草には1リットルあたり 10〜20 ルーメン、「Medium」の水草には 20〜40、最も難しい水草には 40 以上が目安である。',
        },
        {
          type: 'p',
          texte: '立ち上げたばかりの水槽では、Tropica は最初の2〜3週間は1日6時間、その後は8〜10時間の照明をすすめている。タイマーを使えば点灯時間を一定に保てる。',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: 'コケが水槽に広がったら',
          texte: 'コケは光と栄養のバランスの崩れにつけこむ。まず照明時間を短くし、餌を減らし、換水の回数を増やす。成長の速い水草はコケと競合してくれる。',
        },
      ],
    },
    {
      id: 'liste',
      titre: 'はじめにそろえるもの',
      blocs: [
        {
          type: 'colonnes',
          colonnes: [
            { titre: '水槽', items: ['ガラスまたはアクリルの水槽', '重さに耐える水槽台', 'ふた'] },
            { titre: '器具', items: ['フィルター', 'サーモスタット付きヒーターと水温計', '照明（水草には欠かせない）'] },
            { titre: '手入れ用品', items: ['カルキ抜き', '試薬：アンモニア、亜硝酸、硝酸塩、pH、硬度', 'プロホース（底床クリーナー）と水槽専用のバケツ'] },
          ],
        },
        {
          type: 'p',
          texte: '底床、水草、レイアウトは[次のレッスン](/cours/plantes-decor)で扱う。',
        },
      ],
    },
  ],
  aRetenir: [
    '大きな水槽は小さな水槽より安定する。魚の成魚の大きさを見込んでおく。',
    'フィルターの流量は1時間に水量の3〜5倍、ヒーターは水量に合ったものを選ぶ。',
    '温かい水は酸素が少ない。特に夏は水面を波立たせる。',
    '照明は1日6時間から始め、水槽が安定したら8〜10時間にする。',
  ],
  sources: [
    { nom: 'OATA「How to set up and look after a freshwater tank」', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'RSPCA「Fish environment」', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/environment' },
    { nom: 'USGS「Dissolved Oxygen」（溶解度表）', url: 'https://pubs.usgs.gov/tm/09/a6.2/tm9a6.2.pdf' },
    { nom: 'OATA「Water quality criteria」', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'EHEIM サーモコントロール、水量別のワット数（製品ページ）', url: 'https://charterhouse-aquatics.com/products/eheim-thermocontrol-electronic-aquarium-heater' },
    { nom: 'Tropica「Water circulation」', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/water-circulation/' },
    { nom: 'Tropica「The right light for your aquarium」', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/light/' },
    { nom: 'Tropica「Starting a new aquarium」', url: 'https://tropica.com/en/guide/get-the-right-start/growing-in/' },
  ],
};

export default cours;

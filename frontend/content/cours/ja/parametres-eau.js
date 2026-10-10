/** レッスン：水質（../parametres-eau.js の日本語版） */
const cours = {
  slug: 'parametres-eau',
  titre: '水質',
  resume: 'pH、GH、KH、CO₂。これらの値が何を測っているのか、水道水の水質データの読み方、そしてその水に合う魚の選び方。',
  icone: 'Beaker',
  sections: [
    {
      id: 'mesurer',
      titre: '何を測るか',
      blocs: [
        {
          type: 'p',
          texte: '澄んだ水が健康な水とは限らない。アンモニアや亜硝酸は目に見えないからである。試験紙や、より正確な液体試薬は基本の道具のひとつである。OATA は少なくとも週に1回、立ち上げ直後や新しい魚を入れたあとはもっと頻繁に測るようすすめている。',
        },
        {
          type: 'tableau',
          colonnes: ['項目', '何がわかるか', '目安'],
          lignes: [
            ['アンモニア（NH₃/NH₄⁺）', 'まだ処理されていない魚の排泄物', 'ゼロ。遊離アンモニアは決して 0.02 mg/L を超えないこと（OATA）'],
            ['亜硝酸（NO₂⁻）', '窒素循環の途中段階', 'ゼロ。決して 0.2 mg/L を超えないこと（OATA）'],
            ['硝酸塩（NO₃⁻）', '循環の最終産物で、たまっていく', '水道水より 50 mg/L 以上高くしない（OATA）'],
            ['pH', '水の酸性度', '種によるが、多くは 6〜8'],
            ['GH', '総硬度：カルシウムとマグネシウム', '種による'],
            ['KH', '炭酸塩：pH の安定', 'pH の急低下を防ぐ'],
            ['水温', '魚の代謝', '種によるが、多くは 24〜27 °C'],
            ['溶存酸素', '呼吸', '6 mg/L 以上（OATA）'],
          ],
          legende: '種ごとの値は[その種のページ](/poissons)に載っており、シミュレーターがチェックする。',
        },
      ],
    },
    {
      id: 'ph',
      titre: 'pH：酸性かアルカリ性か',
      blocs: [
        {
          type: 'p',
          texte: 'pH は水の酸性度を 0〜14 の目盛りで表す。7 が中性で、それより低いと酸性、高いと塩基性（アルカリ性ともいう）である。目盛りは対数なので、pH 6 の水は pH 7 の水の10倍、pH 8 の水の100倍酸性が強い。',
        },
        {
          type: 'p',
          texte: '種ごとに特定の環境に適応している。多くのテトラはアマゾンの酸性でミネラルのとても少ない川に、中米の卵胎生魚はやや硬い水に、マラウイ湖やタンガニーカ湖のシクリッドはアフリカ大地溝帯のとてもアルカリ性の強い湖に適応している。',
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
          legende: 'カタログの数種の pH の範囲と硬度（GH、°dGH）。混泳水槽では範囲が重なる種どうしを集める。それをチェックするのが[シミュレーター](/simulation)である。',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: '何よりも安定が大切',
          texte: '理想の範囲から少し外れていても安定した pH のほうが、何度も調整して変動させるよりよい。換水に使う水は、硬度、pH、水温を水槽の水に近づけておく。',
        },
      ],
    },
    {
      id: 'durete',
      titre: 'GH と KH：硬度',
      blocs: [
        {
          type: 'p',
          texte: '**GH**（総硬度）は溶けているカルシウムイオンとマグネシウムイオンの量を表し、水を「硬く」して水あかの原因になる。**KH**（炭酸塩硬度、アルカリ度ともいう）は炭酸塩と炭酸水素塩の量を表す。これらは水槽内、特に硝化で生じる酸を中和する。KH がとても低いと、pH が急に下がることがある。',
        },
        {
          type: 'p',
          texte: 'アクアリウム用の試薬や Aquarius の種のページでは、硬度を**ドイツ硬度**（°dGH、°dKH）で表す。水質データでは別の単位が使われることがあり、日本を含む多くの国では炭酸カルシウム換算の mg/L（mg/L CaCO₃）、フランスでは**フランス硬度**（°f）が使われる。ドイツ硬度1度は酸化カルシウム 10 mg/L、つまり炭酸カルシウム 17.8 mg/L に相当し、フランス硬度1度は炭酸カルシウム 10 mg/L である。したがって 1 °dGH ≈ 1.78 °f ≈ 17.8 mg/L CaCO₃ となり、硬度 50 mg/L（日本の水道水によくある値）は約 2.8 °dGH にあたる。',
        },
        {
          type: 'figure',
          schema: 'EchelleDurete',
          legende: 'フランス硬度による水の硬度区分（フランス語版ウィキペディア「Dureté de l’eau」）とドイツ硬度での目安。',
        },
        {
          type: 'encadre',
          ton: 'info',
          titre: '水道水の水質を知る',
          texte: '水道事業者は飲料水の水質検査結果を公表している（日本では各自治体の水道局のサイト、フランスでは[保健省のサイト](https://www.eaupotable.sante.gouv.fr/)で市町村ごとに見られる）。総硬度を探し、mg/L CaCO₃ なら 17.8 で、°f なら 1.78 で割ると °dGH の GH になる。アルカリ度からも同じようにして KH がわかる。硝酸塩のもとの値もそこで確認できる。',
        },
      ],
    },
    {
      id: 'co2',
      titre: 'CO₂、KH、pH',
      blocs: [
        {
          type: 'p',
          texte: '魚やバクテリアの呼吸で出たり、水草のために添加したりした CO₂ は、水に溶けて炭酸になり、pH を下げる。そのため KH がわかっていれば、pH から CO₂ を見積もれる。**CO₂ ≈ 3 × KH × 10^(7 − pH)**（mg/L、KH は °dKH）である。',
        },
        {
          type: 'figure',
          schema: 'TableauCo2',
          legende: 'KH と pH から見積もった溶存 CO₂（mg/L）と、Tropica による水草の必要量。CO₂ が水中の唯一の酸である場合にしか成り立たない。ピート、流木、マジックリーフ（カタッパの葉）は pH を下げ、見積もりを狂わせる。',
        },
        {
          type: 'p',
          texte: 'Tropica によると、「育てやすい」水草は CO₂ を添加しなくても育つが、少し（3〜5 mg/L）あるほうがよい。「Medium」の水草は 10〜15 mg/L、最も難しい水草は 15〜30 mg/L を必要とする。計算せずに CO₂ を確かめるには、4 °dKH の基準液を入れた**ドロップチェッカー**を使う。約 25〜35 mg/L で緑色に変わる。',
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: 'CO₂ の添加と魚',
          texte: '水草が CO₂ を吸収しなくなる夜には、CO₂ がたまっていく。照明と同時に添加を止め、魚の様子を見る。水面近くで速く呼吸しているようなら、添加量を減らし、水面をもっと波立たせる。',
        },
      ],
    },
    {
      id: 'adapter',
      titre: '水を合わせるか、魚を合わせるか',
      blocs: [
        {
          type: 'p',
          texte: '最も簡単で安定するのは、水道水に合った魚を選ぶことである。硬くアルカリ性の水には卵胎生魚、レインボーフィッシュ、アフリカン・シクリッドが、軟らかい水にはテトラ、ラスボラ、コリドラスが向く。シミュレーターは、あなたの水の pH、GH、水温からカタログを絞り込める。',
        },
        {
          type: 'p',
          texte: '別の水質の種をどうしても飼いたいなら、水を少しずつ変え、換水用の水も同じように用意する。',
        },
        {
          type: 'liste',
          items: [
            '**軟らかくする**：水道水を RO 水（逆浸透膜で処理した水）や純水で割り、できた水の GH と KH を測る。RO 水だけでは緩衝力がまったくない。',
            '**穏やかに酸性にする**：フィルターに入れたピート、流木、マジックリーフは腐植酸を出して pH を下げ、水を琥珀色に染める。',
            '**硬くする**：サンゴ砂や石灰岩（酢をかけると泡立つ）は GH、KH、pH を上げる。',
            '「pH ダウン」や「pH アップ」の製品だけを使うのは避ける。KH に働きかけないので、急な変動を招く。',
          ],
        },
      ],
    },
  ],
  aRetenir: [
    '少なくとも週に1回は水を測る。アンモニアと亜硝酸はゼロ、硝酸塩は低く。',
    'pH は酸性度、GH はカルシウムとマグネシウム、KH は pH を安定させる炭酸塩を表す。',
    '1 °dGH ≈ 1.78 °f ≈ 17.8 mg/L CaCO₃。水質データの硬度を換算して GH を求める。',
    '水を絶えず調整するより、自分の水に合った魚を選ぶ。',
  ],
  sources: [
    { nom: 'OATA「Water quality criteria」', url: 'https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf' },
    { nom: 'OATA「How to test water quality in your freshwater tank」', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-test-water-quality-in-your-freshwater-tank-aquarium/' },
    { nom: 'フランス語版ウィキペディア「Dureté de l’eau」', url: 'https://fr.wikipedia.org/wiki/Duret%C3%A9_de_l%27eau' },
    { nom: 'フランス保健省、市町村別の飲料水の水質', url: 'https://www.eaupotable.sante.gouv.fr/' },
    { nom: 'Tropica「Fertiliser and CO2」', url: 'https://tropica.com/en/guide/make-your-aquarium-a-success/fertiliser-and-co2/' },
    { nom: 'Aquarium Science「Measuring CO2」', url: 'https://aquariumscience.org/15-6-6-measuring-co2/' },
    { nom: 'フロリダ大学（UF/IFAS）「Ammonia in Aquatic Systems」', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
  ],
};

export default cours;

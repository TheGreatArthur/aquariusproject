/** レッスン：魚の選び方、水合わせ、餌やり（../accueillir-poissons.js の日本語版） */
const cours = {
  slug: 'accueillir-poissons',
  titre: '魚の迎え入れと餌やり',
  resume: '健康で相性のよい魚を選び、ショックを与えずに水合わせをし、トリートメントを行い、水を汚さずに餌を与える方法。',
  icone: 'Fish',
  sections: [
    {
      id: 'choisir',
      titre: '相性のよい魚を選ぶ',
      blocs: [
        {
          type: 'p',
          texte: '買う前に、それぞれの種について成魚の大きさ、水質、群れで暮らすか単独か、性格を調べておこう。群れで飼わなければならない種もいれば、縄張り意識が強かったり攻撃的だったりして同居魚を許さない種もいる。[シミュレーター](/simulation)がこうした情報を照らし合わせ、危ない組み合わせを知らせてくれる。',
        },
        {
          type: 'p',
          texte: 'はじめての熱帯魚水槽には、OATA は丈夫な種としてテトラ、グッピー、モーリー、プラティ、ソードテール、コリドラス、グラミーを挙げている。[カタログ](/poissons)でそれぞれの必要な条件を比べてみよう。',
        },
        {
          type: 'encadre',
          ton: 'astuce',
          titre: '健康な魚の見分け方',
          items: [
            '目が澄んで輝き、ひれが欠けておらず、鱗もそろっている。',
            '傷、こぶ、白い点や綿のような斑点がない。',
            'その種らしい泳ぎ方をし、呼吸が規則正しい。',
            '健康に見えても、病気の魚と同じ水槽にいる魚は買わない。',
          ],
        },
      ],
    },
    {
      id: 'acclimater',
      titre: '持ち帰りと水合わせ',
      blocs: [
        {
          type: 'p',
          texte: '買う前に、水槽のアンモニアと亜硝酸がゼロであることを確かめておく。買ったらまっすぐ帰る。強い光、極端な温度、騒音、揺れは袋の中の魚にストレスを与える。家に着いたら、水温と水質に少しずつ慣らしていく必要がある。',
        },
        {
          type: 'flux',
          items: [
            { titre: '照明を消す', texte: '強い光を避けて、袋を包みから取り出す。', ton: 'neutre' },
            { titre: '袋を浮かべる', sousTitre: '少なくとも10分', texte: '袋の水温が水槽の水温にそろう。', ton: 'neutre' },
            { titre: '水を混ぜる', sousTitre: '20分ほどかけて', texte: '水槽の水を少しずつ、何回かに分けて袋に入れる。', ton: 'neutre' },
            { titre: '網ですくって移す', texte: '袋の水は水槽に入れない。', ton: 'ok' },
          ],
          legende: 'OATA が紹介している、袋を浮かべる方法。',
        },
        {
          type: 'p',
          texte: '敏感な種や、店の水が自分の水槽の水とかなり違う場合は、**点滴法**のほうが穏やかである。魚を袋の水ごと容器に移し、そこに水槽の水を一滴ずつ落として、2つの水が同じになるまで待つ。ディスカスなどでは1時間から数時間かかる。',
        },
        {
          type: 'p',
          texte: 'その日は照明を消したままにし、最初の1週間は新しく入れた魚と水質をよく見ておく。',
        },
      ],
    },
    {
      id: 'quarantaine',
      titre: 'トリートメント（隔離）',
      blocs: [
        {
          type: 'p',
          texte: '魚は症状を見せずに病気をもっていることがある。トリートメントとは、新しく迎えた魚をメイン水槽に入れる前に、**別の水槽で2〜4週間**飼うことである。メイン水槽に長い間新しい魚を入れていない場合は特に役立つ。',
        },
        {
          type: 'liste',
          items: [
            'ヒーター、立ち上げ済みのフィルター（またはメイン水槽から取ったろ材）、いくつかの隠れ家を備えた小さな水槽を用意する。',
            'メイン水槽と同じ水にする。できるだけメイン水槽の水を入れる。',
            'ふだんどおり餌を与え、毎週換水する。',
            'この水槽専用の網とホースを使う。',
            '期間の終わりに病気のサインがなければ、メイン水槽に移してよい。',
          ],
        },
      ],
    },
    {
      id: 'nourrir',
      titre: '与えすぎない餌やり',
      blocs: [
        {
          type: 'p',
          texte: 'RSPCA は、**2〜5分**で食べきれる量を、1日1回にまとめるより2〜3回に分けて与えるようすすめている。食べ残しはすべて分解されてアンモニアになり、餌の与えすぎは水が汚れる大きな原因のひとつである。',
        },
        {
          type: 'liste',
          items: [
            '**変化をつける**：基本のフレークや顆粒に、しっかり解凍した冷凍餌（ミジンコ、ブラインシュリンプ）を加える。',
            '**底の魚を忘れない**：底や中層にいる魚には、タブレットや顆粒など沈む餌が必要である。',
            '**時間帯に合わせる**：一部のナマズのような夜行性の種は、照明を消した夕方に食べる。',
            '**食性に合わせる**：プレコなどのコケを食べる魚には野菜（ズッキーニ、ホウレンソウ）や、ときに削る流木が必要である。種ごとの食性はそれぞれのページに載っている。',
          ],
        },
        {
          type: 'encadre',
          ton: 'attention',
          titre: '迷ったら少なめに',
          texte: '魚は数日の絶食にはよく耐えるが、アンモニアの多い水にはずっと弱い。食後に餌が底に残っていたら取り除き、量を減らす。',
        },
      ],
    },
    {
      id: 'relacher',
      titre: '魚を決して放さない',
      blocs: [
        {
          type: 'p',
          texte: '自然に放された観賞魚はたいてい死んでしまう。生き延びれば、その土地の生き物に深刻な害を与えることがある。蚊の駆除のため世界中に放された[カダヤシの仲間](/poissons/74)は、今では南ヨーロッパにまで及ぶ地域で小さな在来種を脅かしている。水槽の水、底床、水草も川や池に捨ててはならない。飼えなくなった魚は、ショップ、愛好会、ほかの愛好家に引き取ってもらおう。',
        },
      ],
    },
  ],
  aRetenir: [
    '自分の水と互いの相性に合った種を、健康な個体で選ぶ。',
    '水合わせは穏やかに。少なくとも10分袋を浮かべ、そのあと少しずつ水を混ぜる。',
    '2〜4週間のトリートメントがメイン水槽を守る。',
    '餌は2〜5分で食べきれる量に。多すぎるより少なめのほうがよい。',
  ],
  sources: [
    { nom: 'OATA「How to set up and look after a freshwater tank」', url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/' },
    { nom: 'RSPCA「What to feed your fish」', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/fish/diet' },
    { nom: 'Maidenhead Aquatics「Do I need to quarantine my new fish?」', url: 'https://www.fishkeeper.co.uk/faq/do-i-need-to-quarantine-my-new-fish-and-if-so-how-do-i-do-it' },
    { nom: 'フロリダ大学（UF/IFAS）「Ammonia in Aquatic Systems」', url: 'https://ask.ifas.ufl.edu/publication/FA031' },
    { nom: 'Aquarius のガンブシア・ホルブルッキのページ（FishBase）', url: 'https://www.fishbase.se/summary/Gambusia-holbrooki.html' },
  ],
};

export default cours;

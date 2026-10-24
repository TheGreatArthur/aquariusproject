import Texte from '@/components/cours/Texte';
import PageHeader from '@/components/PageHeader';
import { getI18n } from '@/lib/i18n-server';

const TITRE = ['Conditions d\'utilisation et mentions légales', 'Terms of use and legal notice', '利用規約と法的表示'];
const MISE_A_JOUR = ['Dernière mise à jour : 12 octobre 2026.', 'Last updated: 12 October 2026.', '最終更新：2026年10月12日'];

// Une section par sujet ; paragraphes en [français, anglais, japonais], balisage léger de Texte ([lien](url), **gras**)
const SECTIONS = [
  {
    id: 'editeur',
    titre: ['Éditeur', 'Publisher', '運営者'],
    texte: [[
      'Aquarius est un projet personnel et non commercial, édité par Arthur Litschig. Pour toute question, utilisez le '
        + '[formulaire de contact](/contact).',
      'Aquarius is a personal, non-commercial project published by Arthur Litschig. For any question, use the '
        + '[contact form](/contact).',
      'Aquarius は Arthur Litschig が運営する個人の非営利プロジェクトです。お問い合わせは[お問い合わせフォーム](/contact)'
        + 'からどうぞ。',
    ]],
  },
  {
    id: 'hebergement',
    titre: ['Hébergement', 'Hosting', 'ホスティング'],
    texte: [[
      'Le site et son API sont hébergés par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.',
      'The site and its API are hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States.',
      'サイトと API は Vercel Inc.（440 N Barranca Ave #4133, Covina, CA 91723, アメリカ合衆国）がホスティングしています。',
    ]],
  },
  {
    id: 'utilisation',
    titre: ['Objet et utilisation', 'Purpose and use', 'サイトの目的と利用'],
    texte: [[
      'Aquarius propose un catalogue d\'espèces d\'eau douce, un guide pratique, des biotopes et un simulateur de bac. '
        + 'L\'accès est libre et gratuit, sans compte. En utilisant le site, vous acceptez ces conditions ; l\'éditeur '
        + 'peut les modifier à tout moment, et la version en ligne fait foi.',
      'Aquarius offers a catalogue of freshwater species, a practical guide, biotopes and a tank simulator. Access is '
        + 'free, with no account. By using the site you accept these terms; the publisher may change them at any time, '
        + 'and the online version applies.',
      'Aquarius は淡水生物の図鑑、実践ガイド、ビオトープ、水槽シミュレーターを提供しています。利用は無料で、アカウントは'
        + '不要です。サイトを利用することで本規約に同意したものとみなします。運営者はいつでも本規約を変更でき、公開中の版が'
        + '適用されます。',
    ]],
  },
  {
    id: 'contenus',
    titre: ['Contenus et licences', 'Content and licences', 'コンテンツとライセンス'],
    texte: [[
      'Le code du site est publié sous licence MIT. Les photos viennent de Wikimedia Commons et d\'iNaturalist, sous '
        + 'licence libre (domaine public, CC0, CC BY ou CC BY-SA) : leur auteur et leur licence sont indiqués sous '
        + 'chaque photo, et leur réutilisation suit ces licences.',
      'The site\'s code is published under the MIT licence. The photos come from Wikimedia Commons and iNaturalist '
        + 'under free licences (public domain, CC0, CC BY or CC BY-SA): their author and licence are shown under each '
        + 'photo, and reusing them follows these licences.',
      'サイトのコードは MIT ライセンスで公開しています。写真は Wikimedia Commons と iNaturalist の自由なライセンス（パブリック'
        + 'ドメイン、CC0、CC BY、CC BY-SA）のもので、各写真の下に撮影者とライセンスを記しています。再利用はそれぞれの'
        + 'ライセンスに従ってください。',
    ], [
      'Les textes des fiches sont rédigés à partir des sources citées sur chaque page (FishBase, Seriously Fish, GBIF, '
        + 'Flowgrow, Tropica…), sans en recopier le texte. Les vidéos des pages Biotopes restent la propriété de leurs '
        + 'auteurs et sont hébergées par YouTube.',
      'The profile texts are written from the sources cited on each page (FishBase, Seriously Fish, GBIF, Flowgrow, '
        + 'Tropica…), without copying their text. The videos on the Biotopes pages belong to their authors and are '
        + 'hosted by YouTube.',
      '各ページの文章は、そのページに挙げた出典（FishBase、Seriously Fish、GBIF、Flowgrow、Tropica など）をもとに書いた'
        + 'もので、本文を転載してはいません。ビオトープのページの動画はそれぞれの作者に帰属し、YouTube で公開されています。',
    ]],
  },
  {
    id: 'donnees',
    titre: ['Données personnelles', 'Personal data', '個人情報'],
    texte: [[
      'Le site ne crée pas de compte et ne dépose pas de cookie. Vos choix (thème, bac du simulateur) sont enregistrés '
        + 'dans votre navigateur et ne quittent pas votre appareil. L\'hébergeur peut conserver des journaux techniques '
        + '(adresse IP, pages demandées) pour faire fonctionner et protéger le service. L\'audience est mesurée par Vercel '
        + 'Web Analytics, sans cookie : chaque visite est comptée de façon anonyme (page vue, page d\'origine, pays, type '
        + 'd\'appareil et navigateur), le visiteur n\'étant reconnu que par une empreinte de la requête effacée au bout de '
        + '24 heures ; seuls des chiffres agrégés sont consultés.',
      'The site creates no account and sets no cookie. Your choices (theme, simulator tank) are saved in your browser '
        + 'and do not leave your device. The host may keep technical logs (IP address, pages requested) to run and '
        + 'protect the service. Visits are measured by Vercel Web Analytics, without cookies: each visit is counted '
        + 'anonymously (page viewed, referring page, country, device type and browser), the visitor being recognised only '
        + 'by a hash of the request that is discarded after 24 hours; only aggregated figures are looked at.',
      'このサイトはアカウントを作らず、Cookie を使いません。テーマやシミュレーターの水槽などの設定はブラウザに保存され、'
        + '端末の外には出ません。ホスティング事業者は、サービスの運用と保護のために技術的なログ（IP アドレス、表示したページ）を'
        + '保存することがあります。アクセス数は Vercel Web Analytics で Cookie を使わずに計測します。各訪問は匿名で数えられ'
        + '（表示したページ、参照元、国、端末の種類とブラウザ）、訪問者はリクエストから作られ 24 時間後に破棄されるハッシュで'
        + 'のみ識別されます。確認するのは集計した数値だけです。',
    ], [
      'Le formulaire de contact transmet vos nom, prénom, adresse e-mail, sujet et message à l\'éditeur, par e-mail, '
        + 'directement depuis l\'API du site vers sa messagerie, sans service tiers. Ces données servent uniquement à '
        + 'vous répondre, à votre demande ; elles sont conservées au plus un an après le dernier échange, puis supprimées.',
      'The contact form sends your last name, first name, email address, subject and message to the publisher by email, '
        + 'straight from the site\'s API to the publisher\'s mail server, with no third-party service. This data is '
        + 'only used to answer you, at your request; it is kept for at most one year after the last exchange, then '
        + 'deleted.',
      'お問い合わせフォームは、お名前、メールアドレス、件名、メッセージを、外部のサービスを通さずサイトの API から運営者の'
        + 'メールサーバーへ直接送ります。これらの情報はご依頼に応じて返信するためだけに使い、最後のやり取りから最長1年で'
        + '削除します。',
    ], [
      'Vous pouvez demander à consulter, corriger ou supprimer vos données par le même formulaire, et adresser une '
        + 'réclamation à la [CNIL](https://www.cnil.fr). Les vidéos YouTube des pages Biotopes ne se chargent qu\'au clic, '
        + 'depuis youtube-nocookie.com ; YouTube applique alors ses propres règles de confidentialité.',
      'You can ask to see, correct or delete your data through the same form, and lodge a complaint with the French '
        + 'data protection authority, the [CNIL](https://www.cnil.fr). The YouTube videos on the Biotopes pages only load '
        + 'when you click, from youtube-nocookie.com; YouTube\'s own privacy rules then apply.',
      '同じフォームから、ご自身の情報の確認・訂正・削除を依頼できます。フランスのデータ保護機関 [CNIL](https://www.cnil.fr) '
        + 'に苦情を申し立てることもできます。ビオトープのページの YouTube 動画はクリックしたときだけ youtube-nocookie.com から'
        + '読み込まれ、その際は YouTube のプライバシー規定が適用されます。',
    ]],
  },
  {
    id: 'responsabilite',
    titre: ['Responsabilité', 'Liability', '免責事項'],
    texte: [[
      'Les informations du site et les verdicts du simulateur sont donnés à titre indicatif : ils ne remplacent ni '
        + 'l\'observation de vos animaux ni l\'avis d\'un professionnel. L\'éditeur s\'efforce de les tenir exacts sans '
        + 'pouvoir garantir l\'absence d\'erreur ; signalez-les par le formulaire de contact. Les liens vers d\'autres '
        + 'sites sont fournis pour information, sans responsabilité sur leur contenu.',
      'The information on the site and the simulator\'s verdicts are indicative only: they replace neither watching '
        + 'your animals nor a professional\'s advice. The publisher tries to keep them accurate but cannot guarantee '
        + 'they are error-free; please report mistakes through the contact form. Links to other sites are given for '
        + 'information, with no responsibility for their content.',
      'サイトの情報とシミュレーターの判定は目安です。生き物の観察や専門家の助言に代わるものではありません。運営者は正確さに'
        + '努めていますが、誤りがないことは保証できません。誤りはお問い合わせフォームからお知らせください。外部サイトへの'
        + 'リンクは参考のためのもので、その内容には責任を負いません。',
    ]],
  },
  {
    id: 'droit',
    titre: ['Droit applicable', 'Governing law', '準拠法'],
    texte: [[
      'Ces conditions sont régies par le droit français.',
      'These terms are governed by French law.',
      '本規約はフランス法に準拠します。',
    ]],
  },
];

export async function generateMetadata () {
  const { t } = await getI18n();
  return { title: t(...TITRE) };
}

export default async function CguPage () {
  const { t } = await getI18n();
  return <>
    <PageHeader eyebrow={t('CGU', 'Terms', '規約')} title={t(...TITRE)}>{t(...MISE_A_JOUR)}</PageHeader>
    <div className="container max-w-3xl space-y-12">
      {SECTIONS.map(({ id, titre, texte }) => (
        <section key={id} id={id} aria-labelledby={`${id}-titre`} className="scroll-mt-24">
          <h2 id={`${id}-titre`} className="text-xl font-semibold sm:text-2xl">{t(...titre)}</h2>
          {texte.map((paragraphe) => (
            <p key={paragraphe[0].slice(0, 40)} className="mt-4 leading-relaxed text-foreground/85">
              <Texte>{t(...paragraphe)}</Texte>
            </p>
          ))}
        </section>
      ))}
    </div>
  </>;
}

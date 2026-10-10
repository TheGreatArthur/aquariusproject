'use client';

import { Sprout } from 'lucide-react';

import FishProfile, { Block, Countries, Fact, ProfileSources } from '@/components/fish/FishProfile';
import { useI18n } from '@/components/I18nProvider';
import Prose from '@/components/Prose';
import Reveal from '@/components/Reveal';
import { typo } from '@/lib/cours/texte';
import { plantProfil, rangeFromKew } from '@/lib/plants';

/** À droite de la carte : pays d'origine, pays où l'homme l'a introduite, et la source de ces listes */
function RangeFacts ({ plante: p }) {
  const { t } = useI18n();
  const kew = rangeFromKew(p);
  const introduits = p.introduits ?? [];
  return (
    <dl className="grid content-start gap-6">
      <Fact label={kew ? t('Pays d\'origine', 'Native countries', '原産国') : t('Pays où elle est observée', 'Countries where it is observed', '観察されている国')}>
        {/* Une variété ou un cultivar n'a pas d'aire propre dans la liste de Kew : c'est celle de son espèce */}
        {p.taxon_aire && <p className="text-xs text-muted">
          {t('Aire de l\'espèce', 'Range of the species', '種')} <i>{p.taxon_aire}</i> {t('selon Kew :', 'according to Kew:', 'の分布（キュー植物園による）：')}
        </p>}
        <Countries codes={p.pays} className="mt-2" limit={18}/>
      </Fact>
      {kew && (
        <Fact label={t('Introduite par l\'homme', 'Introduced by people', '人為的な移入')}>
          {introduits.length > 0 ? (
            <>
              <p className="text-foreground/85">
                {t(`Hors de son aire d'origine, dans ${introduits.length} pays :`,
                  `Outside its native range, in ${introduits.length} countries:`,
                  `原産地以外では${introduits.length}か国に移入：`)}
              </p>
              <Countries codes={introduits} label={t('Pays d\'introduction', 'Countries of introduction', '移入された国')} className="mt-2" limit={18}
                         chipClassName="!border-warning/30 !text-warning"/>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {t('Une plante d\'aquarium ne doit jamais rejoindre la nature : jeter des boutures ou vider un bac dans '
                  + 'un cours d\'eau peut suffire à l\'installer.', 'An aquarium plant must never reach the wild: '
                  + 'throwing away cuttings or emptying a tank into a stream can be enough to establish it.', '水草を自然に放してはいけません。切れ端を捨てたり、水槽の水を川に流したりするだけで定着することがあります。')}
              </p>
            </>
          ) : (
            <p className="text-foreground/85">
              {t('Aucune introduction signalée hors de son aire d\'origine.', 'No introduction reported outside its native range.', '原産地以外での移入の報告はありません。')}
            </p>
          )}
        </Fact>
      )}
      <p className="text-xs leading-relaxed text-muted">
        {kew
          ? t('Pays : liste mondiale des plantes vasculaires de Kew (WCVP). Points : observations GBIF dans les pays d\'origine.',
            'Countries: Kew World Checklist of Vascular Plants (WCVP). Dots: GBIF observations in the native countries.',
            '国：キュー王立植物園の世界維管束植物チェックリスト（WCVP）。点：原産国での GBIF の観察記録。')
          : t('Les mousses ne figurent pas dans la liste mondiale des plantes vasculaires de Kew : pays où GBIF compte '
            + 'au moins deux observations sur les continents d\'origine indiqués par Flowgrow, sauf source citée.',
          'Mosses are not in the Kew checklist of vascular plants: countries where GBIF has at least two observations '
            + 'on the native continents given by Flowgrow, unless a source is cited.',
          'コケ類はキューの維管束植物チェックリストに含まれません：Flowgrow が示す原産大陸で、GBIF に2件以上の'
            + '観察記録がある国を表示しています（出典を示した場合を除く）。')}
      </p>
    </dl>
  );
}

/**
 * Fiche descriptive d'une plante, construite comme celle d'un poisson : « Dans la nature » (présentation,
 * classification, statut UICN, carte de répartition), puis « En aquarium » (culture) et les sources
 */
export default function PlantProfile ({ plante }) {
  const { t, locale } = useI18n();
  return (
    <>
      <FishProfile profil={plantProfil(plante, locale)} nomScientifique={plante.nom_scientifique} withSources={false}
                   habitatAside={<RangeFacts plante={plante}/>}/>

      <section className="mt-24" aria-labelledby="aquarium-title">
        <Reveal>
          <h2 id="aquarium-title" className="text-3xl font-semibold sm:text-4xl">{t('En aquarium', 'In the aquarium', '水槽での育て方')}</h2>
        </Reveal>

        <div className="mt-10 grid gap-6">
          <Reveal>
            <Block icon={Sprout} title={t('Culture en aquarium', 'Growing in the aquarium', '水槽での栽培')} id="culture-title">
              <div className="mt-5 max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={typo(plante.culture, locale)}/>
              </div>
            </Block>
          </Reveal>

          <ProfileSources sources={plante.sources}/>
        </div>
      </section>
    </>
  );
}

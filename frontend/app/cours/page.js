import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

import { ICONES } from '@/components/cours/icones';
import Texte from '@/components/cours/Texte';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { COURS } from '@/content/cours';
import { getI18n } from '@/lib/i18n-server';
import { tempsDeLecture } from '@/lib/cours/texte';

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    title: t('Guide pratique', 'Practical guide', '実践ガイド'),
    description: t('Six cours pour bien démarrer en aquariophilie d\'eau douce : cycle de l\'azote, paramètres de l\'eau, '
      + 'équipement, plantes et décor, entretien, accueil des poissons.', 'Six lessons to get started in freshwater '
      + 'fishkeeping: nitrogen cycle, water parameters, equipment, plants and hardscape, maintenance, adding fish.', '淡水アクアリウムを始めるための6つのレッスン：窒素循環、水質、器具、水草とレイアウト、メンテナンス、'
      + '魚の迎え入れ。'),
  };
}

export default async function GuidePratique () {
  const { t, href, locale } = await getI18n();
  return (
    <>
      <PageHeader eyebrow={t('Guide pratique', 'Practical guide', '実践ガイド')} title={t('Les bases de l\'aquariophilie', 'Fishkeeping basics', 'アクアリウムの基本')}>
        {t('Six cours à lire dans l\'ordre pour démarrer un bac d\'eau douce, avec des schémas, des calculateurs et '
          + 'les sources de chaque chiffre.', 'Six lessons to read in order to start a freshwater tank, with diagrams, '
          + 'calculators and the source of every figure.', '淡水水槽を始めるために順番に読む6つのレッスン。図解、計算ツール、すべての数値の出典つき。')}
      </PageHeader>

      <section className="container" aria-label={t('Cours', 'Lessons', 'レッスン')}>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURS.map((cours, i) => {
            const Icone = ICONES[cours.icone];
            return (
              <Reveal as="li" key={cours.slug} delay={(i % 3) * 0.06}>
                <Link href={href(`/cours/${cours.slug}`)} className="card card-hover group flex h-full flex-col p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icone className="h-5 w-5"/>
                  </span>
                  <h2 className="mt-5 text-xl font-semibold transition group-hover:text-accent-glow">{cours.titre}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted"><Texte>{cours.resume}</Texte></p>
                  <p className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-accent"/> {tempsDeLecture(cours)}&nbsp;min
                    </span>
                    <span className="flex items-center gap-1 text-foreground/80 group-hover:text-accent-glow">
                      {t('Lire', 'Read', '読む')} <ArrowRight className="h-3.5 w-3.5"/>
                    </span>
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </ol>

        <p className="mt-10 max-w-2xl text-sm text-muted">
          {t('Prêt à composer votre bac\u00a0? Le ', 'Ready to plan your tank? The ', '水槽の計画を始めましょう。')}
          <Link href={href('/simulation')} className="text-accent-glow hover:underline">{t('simulateur', 'simulator', 'シミュレーター')}</Link>
          {t(' vérifie l\'eau, la population et les cohabitations de votre future sélection.',
            ' checks the water, stocking and tankmates of your future selection.',
            'が、選んだ生体の水質、飼育数、混泳相性をチェックします。')}
        </p>
      </section>
    </>
  );
}

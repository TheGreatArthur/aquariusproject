import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import PhotoCredit from '@/components/PhotoCredit';
import Reveal from '@/components/Reveal';
import { getI18n } from '@/lib/i18n-server';

// Photo libre (CC0) qu'aucune autre section de l'accueil n'utilise
const PHOTO = {
  auteur: 'Dileepkumardr', licence: 'CC0', licence_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  source: 'https://commons.wikimedia.org/wiki/File:Nature_Aquarium_Aquascape.jpg',
};

export default async function CallToAction () {
  const { t, href } = await getI18n();
  return (
    <section className="container pt-8">
      <Reveal className="relative isolate grid overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/15 via-surface to-surface md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Sur ordinateur, la photo occupe la droite et se fond dans la carte vers le texte */}
        <div className="relative aspect-[16/9] md:order-last md:aspect-auto md:[mask-image:linear-gradient(to_right,transparent,black_35%)]">
          <Image src="/cta-aquascape.jpg" alt="" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover"/>
          <PhotoCredit credit={PHOTO} className="absolute bottom-2 right-3 text-[0.7rem] text-white/75"/>
        </div>
        <div className="px-6 py-12 sm:px-14 sm:py-16">
          <h2 className="text-3xl font-semibold sm:text-4xl">{t('Prêt à imaginer votre prochain bac ?', 'Ready to plan your next tank?', '次の水槽を計画してみませんか？')}</h2>
          <p className="mt-4 text-muted">
            {t('Testez une population avant d\'acheter vos poissons : c\'est gratuit et vos choix restent '
              + 'enregistrés dans votre navigateur.',
            'Try out a stocking plan before buying your fish: it is free and your choices stay saved in your browser.',
            '魚を買う前に組み合わせを試せます。無料で、選んだ内容はブラウザに保存されます。')}
          </p>
          <Link href={href('/simulation')} className="btn-primary mt-8 !px-6 !py-3 text-base">
            {t('Simuler un bac', 'Plan a tank', '水槽をシミュレート')} <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

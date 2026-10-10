import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Reveal from '@/components/Reveal';
import { getI18n } from '@/lib/i18n-server';

export default async function CallToAction () {
  const { t, href } = await getI18n();
  return (
    <section className="container pt-8">
      <Reveal className="relative isolate overflow-hidden rounded-2xl border border-border px-6 py-16 sm:px-14">
        <Image
          src="/families/cichlidae-americain.jpg"
          alt=""
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="-z-20 object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/30"/>
        <div className="max-w-lg">
          <h2 className="text-3xl font-semibold sm:text-4xl">{t('Prêt à imaginer votre prochain bac\u00a0?', 'Ready to plan your next tank?')}</h2>
          <p className="mt-4 text-muted">
            {t('Testez une population avant d\'acheter vos poissons : c\'est gratuit et vos choix restent '
              + 'enregistrés dans votre navigateur.',
            'Try out a stocking plan before buying your fish: it is free and your choices stay saved in your browser.')}
          </p>
          <Link href={href('/simulation')} className="btn-primary mt-8 !px-6 !py-3 text-base">
            {t('Simuler un bac', 'Plan a tank')} <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

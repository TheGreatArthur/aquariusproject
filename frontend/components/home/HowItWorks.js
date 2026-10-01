import Image from 'next/image';
import { Droplets, ListChecks, ShieldCheck } from 'lucide-react';

import HomeStats from '@/components/home/HomeStats';
import Reveal from '@/components/Reveal';

const STEPS = [
  {
    icon: Droplets,
    title: 'Décrivez votre eau',
    text: 'Volume du bac, pH, GH et température : seules les espèces adaptées restent proposées.',
  },
  {
    icon: ListChecks,
    title: 'Composez votre population',
    text: 'Ajoutez des espèces et ajustez leur nombre, groupe minimum compris.',
  },
  {
    icon: ShieldCheck,
    title: 'Vérifiez la compatibilité',
    text: 'Surpopulation, agressivité, prédation ou familles incompatibles : chaque risque est signalé.',
  },
];

export default function HowItWorks () {
  return (
    <section className="relative border-y border-border/60 bg-surface/40 py-24" aria-labelledby="how-title">
      <div className="container grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
        <div>
          <Reveal className="max-w-xl">
            <h2 id="how-title" className="text-3xl font-semibold sm:text-4xl">
              Trois étapes pour un bac équilibré.
            </h2>
          </Reveal>

          <ol className="mt-10 max-w-xl space-y-8">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08} className="flex gap-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5"/>
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <HomeStats/>
          </Reveal>
        </div>

        {/* Capture réelle du simulateur : l'eau saisie et le verdict d'une population */}
        <Reveal delay={0.1} className="mx-auto w-full max-w-sm lg:max-w-none">
          <Image
            src="/simulateur-apercu.webp"
            alt="Le simulateur : eau d'un bac de 200 litres et verdict « compatible, avec des points à surveiller »"
            width={768}
            height={1184}
            sizes="(min-width: 1024px) 26rem, 24rem"
            className="h-auto w-full rounded-2xl border border-border"
          />
        </Reveal>
      </div>
    </section>
  );
}

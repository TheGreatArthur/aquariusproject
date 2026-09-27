import { Droplets, ListChecks, ShieldCheck } from 'lucide-react';

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
      <div className="container">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Le simulateur</p>
          <h2 id="how-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
            Trois étapes pour un bac équilibré.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.1} className="card relative p-7">
              <span className="absolute right-6 top-5 font-display text-5xl font-semibold text-border">
                0{i + 1}
              </span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-5 w-5"/>
              </span>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

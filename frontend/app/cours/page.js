import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

import { ICONES } from '@/components/cours/icones';
import Texte from '@/components/cours/Texte';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { COURS } from '@/content/cours';
import { tempsDeLecture } from '@/lib/cours/texte';

export const metadata = {
  title: 'Guide pratique',
  description: 'Six cours pour bien démarrer en aquariophilie d\'eau douce : cycle de l\'azote, paramètres de l\'eau, '
    + 'équipement, plantes et décor, entretien, accueil des poissons.',
};

export default function GuidePratique () {
  return (
    <>
      <PageHeader eyebrow="Guide pratique" title="Les bases de l'aquariophilie">
        Six cours à lire dans l&apos;ordre pour démarrer un bac d&apos;eau douce, avec des schémas, des calculateurs et
        les sources de chaque chiffre.
      </PageHeader>

      <section className="container" aria-label="Cours">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURS.map((cours, i) => {
            const Icone = ICONES[cours.icone];
            return (
              <Reveal as="li" key={cours.slug} delay={(i % 3) * 0.06}>
                <Link href={`/cours/${cours.slug}`} className="card card-hover group flex h-full flex-col p-6">
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
                      Lire <ArrowRight className="h-3.5 w-3.5"/>
                    </span>
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </ol>

        <p className="mt-10 max-w-2xl text-sm text-muted">
          Prêt à composer votre bac&nbsp;? Le <Link href="/simulation/starting" className="text-accent-glow hover:underline">simulateur</Link> vérifie
          l&apos;eau, la population et les cohabitations de votre future sélection.
        </p>
      </section>
    </>
  );
}

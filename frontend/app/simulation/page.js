import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export const metadata = { title: 'Simulation' };

const OPTIONS = [
  {
    title: 'Aquarium de zéro',
    text: 'Partez d\'un bac vide : indiquez son volume et son eau, puis composez une population compatible.',
    image: '/hero-aquascape.jpg',
    href: '/simulation/starting',
    cta: 'Commencer',
  },
  {
    title: 'Aquarium en fonctionnement',
    text: 'Vérifiez un bac déjà peuplé et testez l\'ajout de nouvelles espèces.',
    image: '/families/cichlidae-americain.jpg',
    href: null, // Pas encore disponible
    cta: 'Bientôt disponible',
  },
];

export default function SimulationHomePage () {
  return (
    <>
      <PageHeader eyebrow="Simulateur" title="Par où commencer ?">
        Choisissez votre point de départ. Vos choix sont enregistrés dans votre navigateur.
      </PageHeader>

      <section className="container grid gap-6 md:grid-cols-2">
        {OPTIONS.map((o, i) => {
          const body = (
            <>
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={o.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw"
                       className="object-cover transition duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"/>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h2 className="text-2xl font-semibold">{o.title}</h2>
                <p className="mt-2 text-muted">{o.text}</p>
                <span className={o.href ? 'btn-primary mt-6 self-start' : 'btn-ghost mt-6 self-start opacity-60'}>
                  {o.href ? <>{o.cta} <ArrowRight className="h-4 w-4"/></> : <><Clock className="h-4 w-4"/> {o.cta}</>}
                </span>
              </div>
            </>
          );

          return (
            <Reveal key={o.title} delay={i * 0.08}>
              {o.href
                ? <Link href={o.href} className="card card-hover group flex h-full flex-col overflow-hidden">{body}</Link>
                : <div className="card group flex h-full flex-col overflow-hidden" aria-disabled="true">{body}</div>}
            </Reveal>
          );
        })}
      </section>
    </>
  );
}

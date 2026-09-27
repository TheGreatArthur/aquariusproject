import { Beaker, Leaf, RefreshCw, Thermometer } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export const metadata = { title: 'Guide pratique' };

const TOPICS = [
  { icon: RefreshCw, title: 'Le cycle de l\'azote', text: 'Démarrer un bac et comprendre l\'ammoniaque, les nitrites et les nitrates.' },
  { icon: Beaker, title: 'Paramètres de l\'eau', text: 'pH, GH, KH : ce qu\'ils mesurent et comment les stabiliser.' },
  { icon: Thermometer, title: 'Température et équipement', text: 'Chauffage, filtration, éclairage : dimensionner son matériel.' },
  { icon: Leaf, title: 'Plantes et décor', text: 'Choisir des plantes faciles et aménager des zones de refuge.' },
];

export default function Cours () {
  return (
    <>
      <PageHeader eyebrow="Guide pratique" title="Les bases de l'aquariophilie">
        Le guide est en cours de rédaction. Voici les premiers chapitres prévus.
      </PageHeader>

      <section className="container grid gap-5 sm:grid-cols-2">
        {TOPICS.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.06} className="card p-6">
            <div className="flex items-start justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-5 w-5"/>
              </span>
              <span className="chip">Bientôt</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </Reveal>
        ))}
      </section>
    </>
  );
}

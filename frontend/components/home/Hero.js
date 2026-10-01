'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Fish } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

export default function Hero () {
  const reduce = useReducedMotion();

  // Mêmes états avec ou sans animations réduites, pour ne pas rester bloqué sur l'opacité 0 du rendu serveur
  const item = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-24">
      {/* Photo d'aquascape, fondue dans le fond sombre */}
      <div className="absolute inset-y-0 right-0 -z-20 w-full md:w-[68%]">
        <Image
          src="/hero-aquascape.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 68vw, 100vw"
          className="object-cover object-center opacity-50 md:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10"/>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60"/>
      </div>

      <div className="container">
        <div className="max-w-4xl">
          <motion.p className="eyebrow" {...item(0)}>
            <Fish className="h-4 w-4"/> Aquariophilie d&apos;eau douce
          </motion.p>

          <motion.h1 className="mt-5 text-hero font-semibold" {...item(0.08)}>
            Composez un aquarium qui vit en <span className="text-accent">harmonie</span>.
          </motion.h1>

          <motion.p className="mt-6 max-w-xl text-lg text-muted" {...item(0.16)}>
            Choisissez vos poissons selon le volume et l&apos;eau de votre bac. Aquarius signale les cohabitations
            à risque avant l&apos;achat.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap gap-3" {...item(0.24)}>
            <Link href="/simulation/starting" className="btn-primary !px-6 !py-3 text-base">
              Simuler un bac <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link href="/poissons" className="btn-ghost !px-6 !py-3 text-base">
              Explorer les espèces
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

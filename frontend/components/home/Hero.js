'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Fish } from 'lucide-react';

import HomeStats from '@/components/home/HomeStats';

// Le canvas 3D est chargé côté client uniquement, après le rendu initial
const BubblesScene = dynamic(() => import('@/components/home/BubblesScene'), { ssr: false });

const EASE = [0.22, 1, 0.36, 1];

export default function Hero () {
  const reduce = useReducedMotion();
  // La préférence « animations réduites » n'est connue que côté client : la scène 3D est montée après
  // l'hydratation pour que le HTML serveur et le premier rendu client restent identiques
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Mêmes états avec ou sans animations réduites, pour ne pas rester bloqué sur l'opacité 0 du rendu serveur
  const item = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28">
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

      {/* Halo lumineux */}
      <div
        aria-hidden="true"
        className="absolute -left-32 top-1/3 -z-10 h-[30rem] w-[30rem] rounded-full bg-accent/15 blur-[120px]"
      />

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {mounted && !reduce && <BubblesScene/>}
      </div>

      <div className="container">
        <div className="max-w-3xl">
          <motion.p className="eyebrow" {...item(0)}>
            <Fish className="h-4 w-4"/> Aquariophilie d&apos;eau douce
          </motion.p>

          <motion.h1 className="mt-5 text-hero font-semibold" {...item(0.08)}>
            Composez un aquarium <span className="gradient-text">qui vit en harmonie.</span>
          </motion.h1>

          <motion.p className="mt-6 max-w-xl text-lg text-muted" {...item(0.16)}>
            Choisissez vos poissons selon le volume et les paramètres de votre eau. Aquarius vérifie la
            population, les comportements et les cohabitations à risque avant qu&apos;il ne soit trop tard.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap gap-3" {...item(0.24)}>
            <Link href="/simulation/starting" className="btn-primary !px-6 !py-3 text-base">
              Lancer la simulation <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link href="/poissons" className="btn-ghost !px-6 !py-3 text-base">
              Explorer les espèces
            </Link>
          </motion.div>

          <motion.div {...item(0.32)}>
            <HomeStats/>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

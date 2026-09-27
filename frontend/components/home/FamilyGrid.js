'use client';

import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

import Reveal from '@/components/Reveal';
import { FEATURED_FAMILIES, familyHref } from '@/lib/families';

export default function FamilyGrid () {
  const { data } = useSWR('/api/poissons');

  // Nombre d'espèces par famille (clé en minuscules)
  const counts = {};
  for (const p of data?.poissons ?? [])
    counts[p.nom_famille?.toLowerCase()] = (counts[p.nom_famille?.toLowerCase()] ?? 0) + 1;

  return (
    <section className="container py-24" aria-labelledby="familles-title">
      <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="eyebrow">Familles</p>
          <h2 id="familles-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
            Des tétras aux cichlidés, trouvez vos futurs pensionnaires.
          </h2>
        </div>
        <Link href="/poissons" className="btn-ghost self-start md:self-auto">
          Toutes les espèces <ArrowUpRight className="h-4 w-4"/>
        </Link>
      </Reveal>

      <div className="mt-12 grid auto-rows-[15rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_FAMILIES.map((f, i) => (
          <Reveal
            key={f.nom}
            delay={(i % 4) * 0.06}
            className={clsx(i === 0 && 'sm:col-span-2 sm:row-span-2', i === 1 && 'lg:col-span-2')}
          >
            <Link
              href={familyHref(f.nom)}
              className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={f.image}
                alt=""
                fill
                sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"/>
              <div className="relative p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className={clsx('font-semibold', i === 0 ? 'text-2xl' : 'text-lg')}>{f.nom}</h3>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-accent opacity-0 transition group-hover:opacity-100"/>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-foreground/75">{f.description}</p>
                {counts[f.nom.toLowerCase()] && (
                  <p className="mt-3 text-xs font-medium text-accent-glow">
                    {counts[f.nom.toLowerCase()]} espèces
                  </p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

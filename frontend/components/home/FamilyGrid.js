'use client';

import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import Reveal from '@/components/Reveal';
import { FEATURED_FAMILIES, familyHref } from '@/lib/families';

export default function FamilyGrid () {
  const { t, href } = useI18n();
  const { data } = useSWR('/api/poissons');

  // Nombre d'espèces par famille (clé en minuscules)
  const counts = {};
  for (const p of data?.poissons ?? [])
    counts[p.nom_famille?.toLowerCase()] = (counts[p.nom_famille?.toLowerCase()] ?? 0) + 1;

  return (
    <section className="container py-24" aria-labelledby="familles-title">
      <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-xl">
          <h2 id="familles-title" className="text-3xl font-semibold sm:text-4xl">
            {t('Des tétras aux cichlidés, trouvez vos futurs pensionnaires.', 'From tetras to cichlids, find your future residents.')}
          </h2>
        </div>
        <Link href={href('/poissons')} className="btn-ghost self-start md:self-auto">
          {t('Toutes les espèces', 'All species')} <ArrowUpRight className="h-4 w-4"/>
        </Link>
      </Reveal>

      {/* Mosaïque sans case vide : la première famille en grand, la dernière sur toute la largeur sous 1024 px */}
      <div className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:gap-4 lg:grid-cols-4">
        {FEATURED_FAMILIES.map((f, i) => (
          <Reveal
            key={f.nom}
            delay={(i % 4) * 0.06}
            className={clsx(
              i === 0 && 'col-span-2 sm:row-span-2',
              i === 1 && 'lg:col-span-2',
              i === FEATURED_FAMILIES.length - 1 && 'col-span-2 lg:col-span-1',
            )}
          >
            <Link
              href={href(familyHref(f.nom))}
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
              <div className="relative p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className={clsx('min-w-0 font-semibold', i === 0 ? 'text-2xl' : 'text-[0.95rem] sm:text-lg')}>
                    {f.nom}
                  </h3>
                  <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-accent opacity-0 transition group-hover:opacity-100 sm:block"/>
                </div>
                <p className="mt-1 hidden text-sm text-foreground/75 sm:line-clamp-2">{t(f.description, f.en)}</p>
                {counts[f.nom.toLowerCase()] && (
                  <p className="mt-2 text-xs font-medium text-accent-glow sm:mt-3">
                    {counts[f.nom.toLowerCase()]} {t('espèces', 'species')}
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

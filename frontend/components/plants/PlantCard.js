import Image from 'next/image';
import Link from 'next/link';
import { FlaskConical, Ruler, Sun, Thermometer } from 'lucide-react';

import DifficultyBadge from '@/components/plants/DifficultyBadge';
import { formatRange, lightLabel, plantImage, TYPES } from '@/lib/plants';

export default function PlantCard ({ plante: p, priority = false }) {
  return (
    <Link href={`/plantes/${p.id}`} className="card card-hover group flex h-full min-w-0 flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        <Image
          src={plantImage(p)}
          alt={p.nom_commun}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 30vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="break-words text-base font-semibold leading-snug transition group-hover:text-accent-glow sm:text-lg">
          {p.nom_commun}
        </h3>
        <p className="truncate text-xs italic text-muted sm:text-sm">{p.nom_scientifique}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <DifficultyBadge difficulte={p.difficulte}/>
          <span className="truncate text-xs text-muted">{TYPES[p.type]?.label}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Sun className="h-3.5 w-3.5 shrink-0 text-accent"/>
          <span className="truncate"><span className="sr-only sm:not-sr-only">Lumière </span>{lightLabel(p.lumiere_mini, p.lumiere_maxi)}</span>
        </p>

        <dl className="mt-auto grid grid-cols-2 gap-1 border-t border-border/70 pt-3 text-[0.7rem] tabular-nums text-muted sm:mt-4 sm:grid-cols-3 sm:gap-2 sm:pt-4 sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-1.5" title="Hauteur en aquarium">
            <Ruler className="hidden h-3.5 w-3.5 shrink-0 text-accent sm:block"/><dt className="sr-only">Hauteur</dt>
            <dd className="whitespace-nowrap">{formatRange(p.hauteur_mini, p.hauteur_maxi, 'cm') ?? '–'}</dd>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5" title="pH">
            <FlaskConical className="hidden h-3.5 w-3.5 shrink-0 text-accent sm:block"/><dt className="sr-only">pH</dt>
            <dd className="whitespace-nowrap"><span aria-hidden="true">pH </span>{formatRange(p.ph_mini, p.ph_maxi)}</dd>
          </div>
          {/* Trois valeurs ne tiennent pas dans une carte de téléphone : la température attend la fiche */}
          <div className="hidden items-center gap-1.5 sm:flex" title="Température">
            <Thermometer className="hidden h-3.5 w-3.5 shrink-0 text-accent sm:block"/><dt className="sr-only">Température</dt>
            <dd className="whitespace-nowrap">{p.temp_mini}–{p.temp_maxi}°</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

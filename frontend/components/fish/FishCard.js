import Image from 'next/image';
import Link from 'next/link';
import { Droplet, Ruler, Thermometer } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import { fishImage } from '@/lib/fish';

export default function FishCard ({ poisson: p, priority = false }) {
  return (
    <Link href={`/poissons/${p.id}`} className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        <Image
          src={fishImage(p)}
          alt={p.nom_commun}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full border border-border/80 bg-background/70 px-2.5 py-0.5 text-xs text-foreground/90 backdrop-blur">
          {p.nom_famille}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug transition group-hover:text-accent-glow">{p.nom_commun}</h3>
        <p className="text-sm italic text-muted">{p.nom_scientifique}</p>

        <div className="mt-3">
          <BehaviourBadge comportement={p.nom_comportement}/>
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-border/70 pt-4 text-xs text-muted">
          <div className="flex items-center gap-1.5" title="Taille adulte">
            <Ruler className="h-3.5 w-3.5 text-accent"/><dt className="sr-only">Taille</dt><dd>{p.taille} cm</dd>
          </div>
          <div className="flex items-center gap-1.5" title="Volume minimum">
            <Droplet className="h-3.5 w-3.5 text-accent"/><dt className="sr-only">Volume</dt><dd>{p.litrage_mini} L</dd>
          </div>
          <div className="flex items-center gap-1.5" title="Température">
            <Thermometer className="h-3.5 w-3.5 text-accent"/><dt className="sr-only">Température</dt>
            <dd>{p.temp_mini}–{p.temp_maxi}°</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

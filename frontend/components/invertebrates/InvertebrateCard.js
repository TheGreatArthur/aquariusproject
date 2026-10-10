import Image from 'next/image';
import Link from 'next/link';
import { Droplet, Ruler, Thermometer } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import { useI18n } from '@/components/I18nProvider';
import { formatValue, GROUPS, GROUPS_EN, GROUPS_JA, invertebrateImage } from '@/lib/invertebrates';

/** Carte du catalogue, construite comme celle des poissons : photo, noms, comportement, taille, volume et eau */
export default function InvertebrateCard ({ invertebre: p, priority = false }) {
  // Sans nom commun, le fichier reprend le nom scientifique : on ne l'affiche qu'une fois
  const { t, href, locale } = useI18n();
  const sansNomCommun = p.nom_commun.trim().toLowerCase() === p.nom_scientifique.trim().toLowerCase();

  return (
    <Link href={href(`/invertebres/${p.id}`)} className="card card-hover group flex h-full min-w-0 flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        <Image
          src={invertebrateImage(p)}
          alt={p.nom_commun}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 30vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className={sansNomCommun
          ? 'break-words text-base font-semibold italic leading-snug transition group-hover:text-accent-glow sm:text-lg'
          : 'break-words text-base font-semibold leading-snug transition group-hover:text-accent-glow sm:text-lg'}>
          {p.nom_commun}
        </h3>
        {!sansNomCommun && <p className="truncate text-xs italic text-muted sm:text-sm">{p.nom_scientifique}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <BehaviourBadge comportement={p.comportement}/>
          <span className="truncate text-xs text-muted">{t(GROUPS[p.groupe], GROUPS_EN[p.groupe], GROUPS_JA[p.groupe])} · {p.famille}</span>
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-1 border-t border-border/70 pt-3 text-[0.7rem] tabular-nums text-muted sm:mt-4 sm:gap-2 sm:pt-4 sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-1.5" title={t('Taille adulte', 'Adult size', '成体のサイズ')}>
            <Ruler className="hidden h-3.5 w-3.5 shrink-0 text-accent sm:block"/><dt className="sr-only">{t('Taille', 'Size', 'サイズ')}</dt>
            <dd className="whitespace-nowrap">{p.taille != null ? formatValue(p.taille, 'cm', locale) : '—'}</dd>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5" title={t('Volume minimum', 'Minimum volume', '最小水量')}>
            <Droplet className="hidden h-3.5 w-3.5 shrink-0 text-accent sm:block"/><dt className="sr-only">Volume</dt>
            <dd className="whitespace-nowrap">{p.litrage_mini != null ? `${p.litrage_mini} L` : '—'}</dd>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5" title={t('Température', 'Temperature', '水温')}>
            <Thermometer className="hidden h-3.5 w-3.5 shrink-0 text-accent sm:block"/><dt className="sr-only">{t('Température', 'Temperature', '水温')}</dt>
            <dd className="whitespace-nowrap">{p.temp_mini}–{p.temp_maxi}°</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

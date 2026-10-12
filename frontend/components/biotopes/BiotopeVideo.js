'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';

/**
 * Vidéo YouTube d'un bac biotope. La page n'affiche que la vignette : le lecteur (youtube-nocookie, sans cookie
 * avant la lecture) ne se charge qu'au clic, ce qui évite d'envoyer chaque visiteur chez YouTube.
 */
export default function BiotopeVideo ({ id, titre, chaine }) {
  const { t } = useI18n();
  const [lecture, setLecture] = useState(false);

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-surface">
        {lecture ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={titre}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
                  className="absolute inset-0 h-full w-full"/>
        ) : (
          <button type="button" onClick={() => setLecture(true)} className="group absolute inset-0"
                  aria-label={t(`Lire la vidéo : ${titre}`, `Play the video: ${titre}`, `動画を再生：${titre}`)}>
            {/* Vignette servie telle quelle par YouTube : pas de transformation comptée par Vercel */}
            <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill unoptimized
                   className="object-cover"/>
            <span className="absolute inset-0 grid place-items-center bg-background/30 transition group-hover:bg-background/10">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-background shadow-lg transition group-hover:scale-105">
                <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" aria-hidden="true"/>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-sm">
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer"
           className="text-foreground/85 underline-offset-4 hover:text-accent-glow hover:underline">{titre}</a>
        <p className="mt-1 text-xs text-muted">{chaine} · YouTube</p>
      </figcaption>
    </figure>
  );
}

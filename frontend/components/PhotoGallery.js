'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

/**
 * Photo principale et vignettes ; `credits` (facultatif, dans l'ordre des photos) affiche l'auteur et la licence
 * de la photo visible : { auteur, licence, licence_url, source }
 */
export default function PhotoGallery ({ images, alt, credits }) {
  const [active, setActive] = useState(0);
  const credit = credits?.[active];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-fade-in object-cover"
        />
      </div>

      {credit && (
        <p className="mt-2 text-xs text-muted">
          Photo : <a href={credit.source} target="_blank" rel="noopener noreferrer"
                     className="underline-offset-4 hover:text-accent-glow hover:underline">{credit.auteur}</a>
          {', '}
          {credit.licence_url ? (
            <a href={credit.licence_url} target="_blank" rel="noopener noreferrer license"
               className="underline-offset-4 hover:text-accent-glow hover:underline">{credit.licence}</a>
          ) : credit.licence}
          {', via Wikimedia Commons'}
        </p>
      )}

      {images.length > 1 && (
        <div className="mt-3 flex gap-3" role="group" aria-label="Photos">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              aria-pressed={i === active}
              className={clsx(
                'relative aspect-[4/3] w-24 overflow-hidden rounded-xl border transition',
                i === active ? 'border-accent ring-1 ring-accent' : 'border-border opacity-60 hover:opacity-100',
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover"/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { useI18n } from '@/components/I18nProvider';
import PhotoCredit from '@/components/PhotoCredit';

/**
 * Photo principale et vignettes ; `credits` (facultatif, dans l'ordre des photos) affiche l'auteur et la licence
 * de la photo visible : { auteur, licence, licence_url, source }
 */
export default function PhotoGallery ({ images, alt, credits }) {
  const { t } = useI18n();
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

      {credit && <PhotoCredit credit={credit}/>}

      {images.length > 1 && (
        <div className="mt-3 flex gap-3" role="group" aria-label={t('Photos', 'Photos', '写真')}>
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

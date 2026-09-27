'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

export default function FishGallery ({ images, alt }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface">
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
                i === active ? 'border-accent shadow-glow' : 'border-border opacity-60 hover:opacity-100',
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

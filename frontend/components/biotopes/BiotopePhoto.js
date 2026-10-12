import Image from 'next/image';

import Texte from '@/components/cours/Texte';
import PhotoCredit from '@/components/PhotoCredit';

/** Photo d'un biotope (milieu naturel ou bac), avec sa légende, son auteur et sa licence */
export default function BiotopePhoto ({ credit, legende, sizes, priority = false }) {
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
        <Image src={`/biotopes/${credit.fichier}`} alt={legende?.replace(/\*/g, '') ?? ''} fill sizes={sizes}
               priority={priority} className="object-cover"/>
      </div>
      <figcaption>
        {legende && <p className="mt-3 text-sm text-foreground/85"><Texte>{legende}</Texte></p>}
        <PhotoCredit credit={credit} className="mt-1 text-xs text-muted"/>
      </figcaption>
    </figure>
  );
}

import { Fragment } from 'react';
import Link from 'next/link';

import { getI18n } from '@/lib/i18n-server';
import { segments } from '@/lib/cours/texte';

/** Chaîne balisée d'un cours (**gras**, *italique*, [lien](url)) avec la typographie de la langue de la page */
export default async function Texte ({ children }) {
  if (typeof children !== 'string')
    return children ?? null;

  const { locale, href } = await getI18n();
  return segments(children, locale).map((s, i) => {
    switch (s.type) {
      case 'gras':
        return <strong key={i} className="font-semibold text-foreground">{s.texte}</strong>;
      case 'italique':
        return <i key={i}>{s.texte}</i>;
      case 'lien':
        return s.href.startsWith('/') ? (
          <Link key={i} href={href(s.href)} className="text-accent-glow underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
            {s.texte}
          </Link>
        ) : (
          <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
             className="text-accent-glow underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
            {s.texte}
          </a>
        );
      default:
        return <Fragment key={i}>{s.texte}</Fragment>;
    }
  });
}

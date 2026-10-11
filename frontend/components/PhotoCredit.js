'use client';

import { useI18n } from '@/components/I18nProvider';

/** Auteur et licence d'une photo, avec les liens vers sa page source et sa licence : { auteur, licence, licence_url, source } */
export default function PhotoCredit ({ credit, className = 'mt-2 text-xs text-muted' }) {
  const { t } = useI18n();
  return (
    <p className={className}>
      {t('Photo :', 'Photo:', '写真：')} <a href={credit.source} target="_blank" rel="noopener noreferrer"
                 className="underline-offset-4 hover:text-accent-glow hover:underline">{credit.auteur}</a>
      {', '}
      {credit.licence_url ? (
        <a href={credit.licence_url} target="_blank" rel="noopener noreferrer license"
           className="underline-offset-4 hover:text-accent-glow hover:underline">{credit.licence}</a>
      ) : credit.licence}
      {credit.source?.startsWith('https://commons.wikimedia.org/') && ', via Wikimedia Commons'}
      {credit.source?.startsWith('https://www.inaturalist.org/') && ', via iNaturalist'}
    </p>
  );
}

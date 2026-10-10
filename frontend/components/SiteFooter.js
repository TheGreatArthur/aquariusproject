import Link from 'next/link';

import { Logo } from '@/components/icons';
import { LANGUAGE_NAMES, localize, LOCALES } from '@/lib/i18n';
import { getI18n } from '@/lib/i18n-server';
import { NAV_LINKS } from '@/lib/navigation';

export default async function SiteFooter () {
  const { t, href: to, locale, path } = await getI18n();
  return (
    <footer className="relative mt-24 border-t border-border/70">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href={to('/')} className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <Logo className="h-7 w-7 text-accent"/>
            Aquarius
          </Link>
          <p className="mt-3 text-sm text-muted">
            {t('Un catalogue d\'espèces d\'eau douce et un simulateur pour composer un aquarium équilibré, '
              + 'sans surpopulation ni cohabitation à risque.',
            'A catalogue of freshwater species and a simulator to build a balanced aquarium, without overstocking '
              + 'or risky tankmates.',
            '淡水生物の図鑑と、過密飼育や相性の悪い混泳を避けてバランスのよい水槽を組み立てるシミュレーター。')}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted">{t('Explorer', 'Explore', 'サイト内')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map(({ href, label, en, ja }) => (
              <li key={href}>
                <Link href={to(href)} className="text-foreground/80 transition hover:text-accent-glow">{t(label, en, ja)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted">{t('Langue', 'Language', '言語')}</h2>
          {/* Même page dans chaque langue, avec rechargement : la mise en page racine porte la langue */}
          <ul className="mt-4 space-y-2 text-sm">
            {LOCALES.map((l) => (
              <li key={l}>
                <a href={localize(path, l)} hrefLang={l} lang={l} aria-current={l === locale ? 'true' : undefined}
                   className={l === locale ? 'text-accent-glow' : 'text-foreground/80 transition hover:text-accent-glow'}>
                  {LANGUAGE_NAMES[l]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/50">
        <p className="container py-5 text-xs text-muted">
          © {new Date().getFullYear()} {t('Projet Aquarius. Les conseils fournis sont indicatifs : observez toujours vos poissons.',
            'Aquarius project. This advice is indicative only: always watch your fish.',
            'Aquarius プロジェクト。ここでのアドバイスは目安です。魚の様子を必ず観察してください。')}
        </p>
      </div>
    </footer>
  );
}

import Link from 'next/link';

import { InstagramIcon, Logo } from '@/components/icons';
import { getI18n } from '@/lib/i18n-server';
import { INSTAGRAM_URL, NAV_LINKS } from '@/lib/navigation';

export default async function SiteFooter () {
  const { t, href: to } = await getI18n();
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
              + 'or risky tankmates.')}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted">{t('Explorer', 'Explore')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map(({ href, label, en }) => (
              <li key={href}>
                <Link href={to(href)} className="text-foreground/80 transition hover:text-accent-glow">{t(label, en)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted">{t('Suivre', 'Follow')}</h2>
          <p className="mt-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-foreground/80 transition hover:text-accent-glow"
            >
              <InstagramIcon className="h-4 w-4"/>
              @projet.aquarius.pro
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-border/50">
        <p className="container py-5 text-xs text-muted">
          © {new Date().getFullYear()} {t('Projet Aquarius. Les conseils fournis sont indicatifs : observez toujours vos poissons.',
            'Aquarius project. This advice is indicative only: always watch your fish.')}
        </p>
      </div>
    </footer>
  );
}

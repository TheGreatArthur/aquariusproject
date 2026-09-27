import Link from 'next/link';

import { InstagramIcon, Logo } from '@/components/icons';
import { INSTAGRAM_URL, NAV_LINKS } from '@/lib/navigation';

export default function SiteFooter () {
  return (
    <footer className="relative mt-24 border-t border-border/70">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <Logo className="h-7 w-7 text-accent"/>
            Aquarius
          </Link>
          <p className="mt-3 text-sm text-muted">
            Un catalogue d&apos;espèces d&apos;eau douce et un simulateur pour composer un aquarium équilibré,
            sans surpopulation ni cohabitation à risque.
          </p>
        </div>

        <div>
          <h2 className="eyebrow !text-muted">Explorer</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-foreground/80 transition hover:text-accent-glow">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow !text-muted">Suivre</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/80 transition hover:text-accent-glow"
          >
            <InstagramIcon className="h-4 w-4"/>
            @projet.aquarius.pro
          </a>
        </div>
      </div>

      <div className="border-t border-border/50">
        <p className="container py-5 text-xs text-muted">
          © {new Date().getFullYear()} Projet Aquarius. Les conseils fournis sont indicatifs : observez toujours vos poissons.
        </p>
      </div>
    </footer>
  );
}

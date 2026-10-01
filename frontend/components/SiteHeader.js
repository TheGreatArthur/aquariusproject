'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

import { InstagramIcon, Logo } from '@/components/icons';
import { INSTAGRAM_URL, NAV_LINKS } from '@/lib/navigation';

export default function SiteHeader () {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Page sur laquelle le menu mobile a été ouvert : il se referme de lui-même au changement de page
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <nav className="container flex h-16 items-center justify-between" aria-label="Navigation principale">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <Logo className="h-7 w-7 text-accent"/>
          Aquarius
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'relative rounded-full px-4 py-2 text-sm transition-colors',
                  isActive(href) ? 'text-foreground' : 'text-muted hover:text-foreground',
                )}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent"/>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full p-2 text-muted transition hover:text-accent-glow sm:inline-flex"
            aria-label="Instagram du projet Aquarius"
          >
            <InstagramIcon className="h-5 w-5"/>
          </a>
          <Link href="/simulation" className="btn-primary hidden !py-2 sm:inline-flex">
            Simuler un bac
          </Link>
          <button
            type="button"
            className="inline-flex rounded-full p-2 text-muted hover:text-foreground md:hidden"
            onClick={() => setOpenOn(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="container animate-fade-in pb-6 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    'block rounded-xl px-4 py-3 font-display text-lg',
                    isActive(href) ? 'bg-surface text-accent-glow' : 'text-foreground',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

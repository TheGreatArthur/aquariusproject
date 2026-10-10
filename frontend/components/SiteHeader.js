'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import { Logo } from '@/components/icons';
import LanguageMenu from '@/components/LanguageMenu';
import ThemeToggle from '@/components/ThemeToggle';
import { splitLocale } from '@/lib/i18n';
import { NAV_LINKS } from '@/lib/navigation';

export default function SiteHeader () {
  const { t, href: to } = useI18n();
  const pathname = usePathname();
  const { path } = splitLocale(pathname);
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

  const isActive = (href) => path === href || path.startsWith(`${href}/`);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <nav className="container flex h-16 items-center justify-between" aria-label={t('Navigation principale', 'Main navigation', 'メインナビゲーション')}>
        <Link href={to('/')} className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <Logo className="h-7 w-7 text-accent"/>
          Aquarius
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ href, label, en, ja }) => (
            <li key={href}>
              <Link
                href={to(href)}
                className={clsx(
                  'relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm transition-colors lg:px-4',
                  isActive(href) ? 'text-foreground' : 'text-muted hover:text-foreground',
                )}
              >
                {t(label, en, ja)}
                {isActive(href) && (
                  <span className="absolute inset-x-2.5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent lg:inset-x-4"/>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageMenu/>
          <ThemeToggle/>
          <Link href={to('/simulation')} className="btn-primary hidden !py-2 sm:inline-flex">
            {t('Simuler un bac', 'Plan a tank', '水槽をシミュレート')}
          </Link>
          <button
            type="button"
            className="inline-flex rounded-full p-2 text-muted hover:text-foreground lg:hidden"
            onClick={() => setOpenOn(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('Fermer le menu', 'Close menu', 'メニューを閉じる') : t('Ouvrir le menu', 'Open menu', 'メニューを開く')}
          >
            {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="container animate-fade-in pb-6 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, en, ja }) => (
              <li key={href}>
                <Link
                  href={to(href)}
                  className={clsx(
                    'block rounded-xl px-4 py-3 font-display text-lg',
                    isActive(href) ? 'bg-surface text-accent-glow' : 'text-foreground',
                  )}
                >
                  {t(label, en, ja)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

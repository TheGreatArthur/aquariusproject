'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Check, ChevronDown, Languages } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import { LANGUAGE_NAMES, localize, LOCALES, splitLocale } from '@/lib/i18n';

/**
 * Language menu of the header: the same page in each language. The links reload the page, because the root layout,
 * rendered once, carries the language; the search (catalogue filter) is kept.
 */
export default function LanguageMenu () {
  const { locale, t } = useI18n();
  const { path } = splitLocale(usePathname());
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open)
      return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="language-menu"
              aria-label={t('Langue', 'Language', '言語')}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium text-muted transition hover:text-foreground">
        <Languages className="h-4 w-4"/>
        <span className="uppercase">{locale}</span>
        <ChevronDown className={clsx('h-3.5 w-3.5 transition', open && 'rotate-180')}/>
      </button>
      {open && (
        <ul id="language-menu" className="card absolute right-0 top-full z-50 mt-2 min-w-[10rem] animate-fade-in p-1.5 !bg-surface shadow-xl">
          {LOCALES.map((l) => (
            <li key={l}>
              <a href={localize(path, l)} hrefLang={l} lang={l} aria-current={l === locale ? 'true' : undefined}
                 onClick={(e) => { e.currentTarget.href += window.location.search; }}
                 className={clsx('flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition',
                   l === locale ? 'text-accent-glow' : 'text-foreground hover:bg-surface-elevated')}>
                {LANGUAGE_NAMES[l]}
                {l === locale && <Check className="h-4 w-4"/>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

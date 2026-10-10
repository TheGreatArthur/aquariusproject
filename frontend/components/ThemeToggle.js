'use client';

import { Moon, Sun } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';

export const THEME_KEY = 'aquarius-theme';

/**
 * Inline script run before the first paint: the saved choice, else the system preference. Kept as a string so it
 * runs without waiting for React.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem('${THEME_KEY}');`
  + 'if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";'
  + 'document.documentElement.dataset.theme=t}catch(e){}';

/** Light / dark switch; the icon follows data-theme in CSS, so the server and client markup match */
export default function ThemeToggle () {
  const { t } = useI18n();

  const toggle = () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing: the choice lasts for this page only
    }
  };

  return (
    <button type="button" onClick={toggle} title={t('Thème clair ou sombre', 'Light or dark theme', 'ライト／ダークテーマ')}
            aria-label={t('Changer de thème', 'Switch theme', 'テーマを切り替え')}
            className="inline-flex rounded-full p-2 text-muted transition hover:text-accent-glow">
      <Sun className="h-5 w-5 [[data-theme=light]_&]:hidden"/>
      <Moon className="hidden h-5 w-5 [[data-theme=light]_&]:block"/>
    </button>
  );
}

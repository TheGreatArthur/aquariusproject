/**
 * Mise en page par défaut
 */

import { Inter, Space_Grotesk } from 'next/font/google';

import { I18nProvider } from '@/components/I18nProvider';
import Providers from '@/components/Providers';
import { SITE_URL } from '@/lib/site';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { THEME_SCRIPT } from '@/components/ThemeToggle';
import { localize } from '@/lib/i18n';
import { getI18n } from '@/lib/i18n-server';
import './globals.css';
import './theme.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export async function generateMetadata () {
  const { t, path } = await getI18n();
  return {
    // Les images de partage (opengraph-image.jpg, photo de chaque fiche) deviennent des adresses absolues
    metadataBase: new URL(SITE_URL),
    openGraph: { siteName: 'Aquarius', locale: t('fr_FR', 'en_GB', 'ja_JP'), type: 'website' },
    twitter: { card: 'summary_large_image' },
    title: {
      default: t('Aquarius · Composez un aquarium en harmonie', 'Aquarius · Build a balanced aquarium',
        'Aquarius · 調和のとれた水槽づくり'),
      template: '%s · Aquarius',
    },
    description: t(
      'Catalogue de poissons d\'aquarium d\'eau douce et simulateur de compatibilité : '
        + 'paramètres d\'eau, population et cohabitation.',
      'Freshwater aquarium fish catalogue and compatibility simulator: water parameters, stocking and tankmates.',
      '淡水観賞魚の図鑑と相性シミュレーター：水質、飼育数、混泳をチェック。',
    ),
    alternates: { languages: { fr: path, en: localize(path, 'en'), ja: localize(path, 'ja'), 'x-default': path } },
  };
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#050B12' },
  ],
};

export default async function RootLayout ({ children }) {
  const { locale, t } = await getI18n();
  return (
    <html lang={locale} className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Thème choisi ou celui du système, appliqué avant le premier affichage */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}/>
      </head>
      <body className="grain flex min-h-screen flex-col">
        <a href="#contenu" className="skip-link">{t('Aller au contenu', 'Skip to content', '本文へ移動')}</a>
        <I18nProvider locale={locale}>
          <Providers>
            <SiteHeader/>
            <main id="contenu" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
            <SiteFooter/>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}

/**
 * Mise en page par défaut
 */

import { Inter, Space_Grotesk } from 'next/font/google';

import Providers from '@/components/Providers';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata = {
  title: {
    default: 'Aquarius · Composez un aquarium en harmonie',
    template: '%s · Aquarius',
  },
  description: 'Catalogue de poissons d\'aquarium d\'eau douce et simulateur de compatibilité : '
    + 'paramètres d\'eau, population et cohabitation.',
};

export const viewport = {
  themeColor: '#050B12',
};

export default function RootLayout ({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${display.variable}`}>
      <body className="grain flex min-h-screen flex-col">
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <Providers>
          <SiteHeader/>
          <main id="contenu" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
          <SiteFooter/>
        </Providers>
      </body>
    </html>
  );
}

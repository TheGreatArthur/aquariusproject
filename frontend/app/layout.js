/**
 * Mise en page par défaut
 */

'use client';

import { Inter } from 'next/font/google';
import { SWRConfig } from 'swr';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title:       'Aqua Next',
  description: 'Tout sur les poissons',
};

export default function RootLayout ({ children }) {
  return (
    <SWRConfig value={{ fetcher: (resource, init) => fetch(resource, init).then(res => res.json()) }}>
      <html lang="fr">
        <body className={inter.className}>{children}</body>
      </html>
    </SWRConfig>
  );
}

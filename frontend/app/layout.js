/**
 * Mise en page par défaut
 */

'use client';

import { Inter } from 'next/font/google';
import { SWRConfig } from 'swr';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from '@/app/nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout ({ children }) {
  return (
    <SWRConfig value={{ fetcher: (resource, init) => fetch(resource, init).then(res => res.json()) }}>
      <html lang="fr">
        <body className={inter.className}>
          <NavBar/>
          {children}
        </body>
      </html>
    </SWRConfig>
  );
}

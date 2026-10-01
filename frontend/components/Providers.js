'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SWRConfig } from 'swr';

import { countNavigation } from '@/lib/navigation';

const fetcher = (resource, init) => fetch(resource, init).then((res) => {
  if (!res.ok)
    throw new Error(`HTTP ${res.status}`);
  return res.json();
});

/** Compte les changements de page après le premier affichage */
function NavigationTracker () {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current)
      first.current = false;
    else
      countNavigation();
  }, [pathname]);

  return null;
}

export default function Providers ({ children }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <NavigationTracker/>
      {children}
    </SWRConfig>
  );
}

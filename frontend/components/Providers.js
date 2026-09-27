'use client';

import { SWRConfig } from 'swr';

const fetcher = (resource, init) => fetch(resource, init).then((res) => {
  if (!res.ok)
    throw new Error(`HTTP ${res.status}`);
  return res.json();
});

export default function Providers ({ children }) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}

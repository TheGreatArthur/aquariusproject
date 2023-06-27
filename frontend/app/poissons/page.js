'use client';

import { useState } from 'react';
import useSWR from 'swr';
import styles from '@/app/page.module.css';
import TablePoissons from './results';


export default function Poissons () {

  const [terme, setTerme] = useState('');
  const { data, error } = useSWR(`/api/poissons?q=${terme}`);

  if (error)
    return <h1>Error</h1>;

  return <main className={styles.main}>

    <h1>Liste des poissons</h1>

    {/* Champ de filtrage rapide */}
    <input type="text" value={terme} onChange={e => setTerme(e.target.value)}/>

    {/* Table des résultats */}
    {data && <TablePoissons poissons={data.poissons}/>}

  </main>;
}

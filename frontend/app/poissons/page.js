'use client'

import { useState } from 'react';
import useSWR from 'swr';
import Table from 'react-bootstrap/Table';
import styles from '@/app/page.module.css';


export default function Poissons() {

  const [terme, setTerme] = useState('');
  const { data, error } = useSWR(`/api/poissons?q=${terme}`);

  if (error) {
    return <h1>Error</h1>;
  }


  return (
    <main className={styles.main}>
      <h1>Liste des poissons</h1>

      <input type="text" value={terme} onChange={e => setTerme(e.target.value)}/>

      {data && (
        <Table>
          <thead>
            <tr>
              <th>Nom commun</th>
              <th>Nom scientifique</th>
              <th>Famille</th>
            </tr>
          </thead>
          <tbody>
            {data.poissons.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={`/images/${p.id}.jpg`} alt={p.nom_commun} width="90" height="70" /> 
                  <a href={`/poissons/${p.id}`}>{p.nom_commun}</a>
                </td>
                <td>{p.nom_scientifique}</td>
                <td>{p.nom_famille}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </main>
  );
}

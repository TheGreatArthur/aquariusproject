'use client'

import useSWR from 'swr'
import Table from 'react-bootstrap/Table'
import styles from '@/app/page.module.css'


export default function Poissons() {

    const { data, error } = useSWR('/api/poissons')

    if (error)
        return <h1>Error</h1>

    return <main className={styles.main}>
        <h1>Liste des poissons</h1>

<input type="text"/>

        {data && <Table>
            <thead>
                <tr>
                    <th>Nom commun</th>
                    <th>Nom scientifique</th>
                </tr>
            </thead>
            <tbody>
                {data.poissons.map(p => <tr key={p.id}>
                    <td>
                        <a href={`/poissons/${p.id}`}>{p.nom_commun}</a>
                    </td>
                    <td>{p.nom_scientifique}</td>
                </tr>)}
            </tbody>
        </Table>}

    </main>
}
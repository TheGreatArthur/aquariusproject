'use client'

import Link from 'next/link';
import useSWR from 'swr'
import styles from '@/app/page.module.css'
import Table from 'react-bootstrap/Table'

export default function Poisson({ params }) {

    const id = params.id
    const { data, error } = useSWR(`/api/poissons/${id}`)

    return <main className={styles.main}>
        {data && <>
            <h1>{data.nom_commun}</h1>

            <Table>
                <tr>
                    <th>Nom scientifique</th>
                    <td>{data.nom_scientifique}</td>
                </tr>
                <tr>
                    <th>Famille</th>
                    <td>{data.nom_famille}</td>
                </tr>
                <tr>
                    <th>Genre</th>
                    <td>{data.nom_genre}</td>
                </tr>
                {Object.keys(data).map(k => <tr>
                    <th>{k}</th>
                    <td>{data[k]}</td>

                </tr>)}
            </Table>

            <Link href='/poissons'>Retour à la liste</Link>
        </>}
    </main>;
}
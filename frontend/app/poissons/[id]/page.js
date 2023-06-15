'use client'

import Link from 'next/link';
import useSWR from 'swr'
import styles from '@/app/page.module.css'
import Table from 'react-bootstrap/Table'
import Carousel from 'react-bootstrap/Carousel';

export default function Poisson({ params }) {

    const id = params.id
    const { data, error } = useSWR(`/api/poissons/${id}`)

    return (
        <main className={styles.main}>
            {data && (
                <>
                    <h1>{data.nom_commun}</h1>

                    {/* Carousel of Images */}
                    <Carousel className="carousel-container">
                        {data.images.map(img => (
                            <Carousel.Item key={img}>
                                <img className="carousel-image" src={`/images/${img}`} alt={img} />
                            </Carousel.Item>
                        ))}
                    </Carousel>

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
                        <tr>
                            <th>pH minimum</th>
                            <td>{data.ph_mini}</td>
                        </tr>
                        <tr>
                            <th>pH maximum</th>
                            <td>{data.ph_maxi}</td>
                        </tr>
                        <tr>
                            <th>gH minimum</th>
                            <td>{data.gh_mini}</td>
                        </tr>
                        <tr>
                            <th>gH maximum</th>
                            <td>{data.gh_maxi}</td>
                        </tr>
                        <tr>
                            <th>Litrage minimum</th>
                            <td>{data.litrage_mini}</td>
                        </tr>
                        <tr>
                            <th>Individus minimum</th>
                            <td>{data.nb_individus}</td>
                        </tr>
                        <tr>
                            <th>Mode de vie</th>
                            <td>{data.gh_mini}</td>
                        </tr>
                        <tr>
                            <th>gH minimum</th>
                            <td>{data.gh_mini}</td>
                        </tr>

                        
                    </Table>

                    <Link href='/poissons'>Retour à la liste</Link>
                </>
            )}

            <style jsx>{`
                .carousel-container {
                    width: 50%;
                    margin: 0 auto;
                }

                .carousel-image {
                    max-height: 400px;
                    object-fit: cover;
                }
            `}</style>
        </main>
    );
}

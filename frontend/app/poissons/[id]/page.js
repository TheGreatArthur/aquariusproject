'use client'

import Link from 'next/link';
import useSWR from 'swr';
import styles from '@/app/page.module.css';
import Table from 'react-bootstrap/Table';
import Carousel from 'react-bootstrap/Carousel';

export default function Poisson({ params }) {
  const id = params.id;
  const { data, error } = useSWR(`/api/poissons/${id}`);

  return (
    <main className={styles.main}>
      {data && (
        <>
          <h1>{data.nom_commun}</h1>

          {/* Carousel of Images */}
          <Carousel className="carousel-container">
            {data.images.map((img) => (
              <Carousel.Item key={img}>
                <div className="carousel-image-container">
                  <img className="carousel-image" src={`/images/${img}`} alt={img} />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          <Table>
            <tbody>
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
                <th>Taille moyenne</th>
                <td>{data.taille} cm</td>
              </tr>
              <tr>
                <th>Longévité</th>
                <td>{data.longevite} ans</td>
              </tr>
              <tr>
                <th>Comportement</th>
                <td>{data.nom_comportement}</td>
              </tr>
              <tr>
                <th>Litrage minimum</th>
                <td>{data.litrage_mini} L</td>
              </tr>
              <tr>
                <th>Nombre d&apos;individus minimum</th>
                <td>{data.nb_individus}</td>
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
                <th>Température minimum</th>
                <td>{data.temp_mini} °C</td>
              </tr>
              <tr>
                <th>Température maximum</th>
                <td>{data.temp_maxi} °C</td>
              </tr>
              
            



              {/* Autres lignes de la table */}
            </tbody>
          </Table>

          <Link href="/poissons">Retour à la liste</Link>
        </>
      )}

      <style jsx>{`
        .carousel-container {
          width: 50%;
          margin: 0 auto;
        }

        .carousel-image-container {
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      `}</style>
    </main>
  );
}

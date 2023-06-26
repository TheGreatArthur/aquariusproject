'use client';

import Link from 'next/link';
import useSWR from 'swr';
import Carousel from 'react-bootstrap/Carousel';

import styles from '@/app/page.module.css';
import Results from './results';
import './style.css';


export default function Poisson ({ params }) {

  const id = params.id;

  const { data } = useSWR(`/api/poissons/${id}`);

  return <main className={styles.main}>

    {data && <>

      <h1>{data.nom_commun}</h1>

      {/* Carousel des photos du poisson */}
      <Carousel className="carousel-container">
        {data.images.map((img) => (
          <Carousel.Item key={img}>
            <div className="carousel-image-container">
              <img className="carousel-image" src={`/images/${img}`} alt={img}/>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Fiche technique */}
      <Results data={data}/>

      <Link href="/poissons">Retour à la liste</Link>

    </>}

  </main>;
}

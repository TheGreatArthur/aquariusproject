'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Carousel from 'react-bootstrap/Carousel';

import Results from './results';
import styles from '@/app/page.module.scss';
import './style.scss';

export default function Poisson({ params }) {
  const id = params.id;
  const router = useRouter();

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const { data } = useSWR(`/api/poissons/${id}`);

  return (
    <main className={`${styles.main} poisson-background page-container`}>
      {data && (
        <>
          <h1 className={`${styles.pageTitle} page-title`}>{data.nom_commun}</h1>

          {/* Carousel des photos du poisson */}
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12"
            style={{ marginTop: '50px', border: '5px solid black' }}
          >
            {data.images.map((img, i) => (
              <Carousel.Item key={i}>
                <div className="carousel-image-container">
                  <img className="carousel-image" src={`/images/${img}`} alt={`Slide ${i + 1}`} />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          {/* Fiche technique */}
          <Results data={data} />

          <p onClick={() => router.back()}>Retour à la liste</p>
        </>
      )}
    </main>
  );
}

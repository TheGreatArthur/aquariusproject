"use client";
import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';

export function ControlledCarousel(props) {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Obtenir la liste d'images aléatoires
    const randomImages = getRandomImages(31); // Nombre total d'images à afficher
    setImages(randomImages);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const getRandomImages = (numImages) => {
    const images = [];
    const imageIndexes = getRandomIndexes(numImages);

    for (let i = 0; i < numImages; i++) {
      const imageIndex = imageIndexes[i];
      const image = {
        src: `/${imageIndex}.jpg`,
        caption: `Slide ${i + 1} label`,
        description: `Description de la slide ${i + 1}`,
      };
      images.push(image);
    }

    return images;
  };

  const getRandomIndexes = (numIndexes) => {
    const indexes = [];
    while (indexes.length < numIndexes) {
      const randomIndex = Math.floor(Math.random() * numIndexes) + 1;
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  };

  const imageWidth = '600px'; // Largeur de base des images
  const imageHeight = '400px'; // Hauteur de base des images

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} className='col-6 offset-3'>
      {images.map((image, i) => (
        <Carousel.Item key={i}>
          <img
            style={{ width: imageWidth, height: imageHeight, objectFit: 'cover' }}
            src={image.src}
            alt={`Slide ${i + 1}`} />

          <Carousel.Caption>
            <h3>{image.caption}</h3>
            <p>{image.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

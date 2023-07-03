/**
 * Carrousel de la page d'accueil
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';

export function ControlledCarousel(props) {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imageWidth, setImageWidth] = useState('700px');
  const [imageHeight, setImageHeight] = useState('400px');

  useEffect(() => {
    // Obtenir la liste d'images aléatoires
    const randomImages = getRandomImages(14); // Nombre total d'images à afficher
    setImages(randomImages);

    // Mettre à jour la taille des images en fonction de la largeur de l'écran
    const updateImageSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 700) {
        setImageWidth('100%');
        setImageHeight('300px');
      } else {
        setImageWidth('700px');
        setImageHeight('400px');
      }
    };

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', updateImageSize);

    // Désinscrire l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('resize', updateImageSize);
    };
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

  const getSlideName = (src) => {
    const slideNumber = parseInt(src.substring(1, src.indexOf('.jpg')));
    let slideName = '';

    switch (slideNumber) {
      case 1:
        slideName = 'Cyprinidae';
        break;
      case 2:
        slideName = 'Characidae';
        break;
      case 3:
        slideName = 'Siluridae';
        break;
      case 4:
        slideName = 'Callichthyidae';
        break;
      case 5:
        slideName = 'Loricariidae';
        break;
      case 6:
        slideName = 'Poeciliidae';
        break;
      case 7:
        slideName = 'Nothobranchiidae';
        break;
      case 8:
        slideName = 'Cichlidae Américain';
        break;
      case 9:
        slideName = 'Cichlidae Africain';
        break;
      case 10:
        slideName = 'Osphronemidae';
        break;
      case 11:
        slideName = 'Melanotaeniidae';
        break;
      case 12:
        slideName = 'Tetraodontidae';
        break;
      case 13:
        slideName = 'Crustacés';
        break;
      case 14:
        slideName = 'Mollusques';
        break;
      default:
        slideName = 'Unknown';
        break;
    }

    return slideName;
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      style={{ marginTop: '50px', border: '5px solid black' }}
    >
      {images.map((image, i) => (
        <Carousel.Item key={i}>
          <div style={{ width: imageWidth, height: imageHeight }}>
            <img
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              src={image.src}
              alt={`Slide ${i + 1}`}
            />
          </div>

          <Carousel.Caption>
            <h3>
              <Link href={`/poissons?famille=${getSlideName(image.src)}`}>
                {getSlideName(image.src)}
              </Link>
            </h3>
            <p>{image.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
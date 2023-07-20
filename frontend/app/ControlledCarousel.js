import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';

export function ControlledCarousel(props) {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imageWidth, setImageWidth] = useState('790px');
  const [imageHeight, setImageHeight] = useState('500px');

  const carouselRef = useRef(null);

  useEffect(() => {
    const randomImages = getRandomImages(8);
    setImages(randomImages);

    const updateImageSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 800) {
        setImageWidth('100%');
        setImageHeight('300px');
      } else {
        setImageWidth('790px');
        setImageHeight('500px');
      }
    };

    const resizeObserver = new ResizeObserver(updateImageSize);
    if (carouselRef.current) {
      resizeObserver.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        resizeObserver.unobserve(carouselRef.current);
      }
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
        slideName = 'Danionidae';
        break;
      case 2:
        slideName = 'Characidae';
        break;
      case 3:
        slideName = 'Callichthyidae';
        break;
      case 4:
        slideName = 'Loricariidae';
        break;
      case 5:
        slideName = 'Poeciliidae';
        break;
      case 6:
        slideName = 'Cichlidae Américain';
        break;
      case 7:
        slideName = 'Cichlidae Africain';
        break;
      case 8:
        slideName = 'Osphronemidae';
        break;
    }

    return slideName;
  };

  const getSlideDescription = (src) => {
    const slideNumber = parseInt(src.substring(1, src.indexOf('.jpg')));
    let slideDescription = '';

    switch (slideNumber) {
      case 1:
        slideDescription = 'Danionidae';
        break;
      case 2:
        slideDescription = 'Characidae';
        break;
      case 3:
        slideDescription = 'Callichthyidae';
        break;
      case 4:
        slideDescription = 'Loricariidae';
        break;
      case 5:
        slideDescription = 'Poeciliidae';
        break;
      case 6:
        slideDescription = 'Cichlidae Américain';
        break;
      case 7:
        slideDescription = 'Cichlidae Africain';
        break;
      case 8:
        slideDescription = 'Osphronemidae';
        break;
    }

    return `Découvrez les poissons de la famille des ${slideDescription}`;
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      style={{
        marginTop: '50px',
        border: '5px solid black',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '800px',
      }}
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
            <p>{getSlideDescription(image.src)}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

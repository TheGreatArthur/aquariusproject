'use client';

import { useRouter } from 'next/navigation';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';



export default function SimulationHomePage() {
  const router = useRouter();

  const handleAquariumZero = () => {
    router.push('/simulation/starting');
  };

  const handleAquariumFonctionnement = () => {
    router.push('/simulation/aquarium-fonctionnement');
  };

  return (
    <main className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1>Choisissez l'une  des options :</h1>

      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <Card className="bg-dark text-white m-2 card-custom">
            <Card.Img
              variant="top"
              src="https://prodibio.com/wp-content/uploads/2023/01/aquarium-tres-plante-aquascaping-Emilie-Loheac-1.webp"
              className="card-image"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>Aquarium de zéro</Card.Title>
              <Card.Text>
                Créez un nouvel aquarium à partir de zéro.
              </Card.Text>
              <Button variant="primary" onClick={handleAquariumZero}>
                Commencer
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="bg-dark text-white m-2 card-custom">
            <Card.Img
              variant="top"
              src="https://images.ctfassets.net/b85ozb2q358o/49950bPVIufXfuWP1aELg5/48130e07a3c691a3bc7046a90e9be65a/les-poissons-cichlides-d-aquarium-1.jpg"
              className="card-image"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>Aquarium en fonctionnement</Card.Title>
              <Card.Text>Gérez un aquarium existant.</Card.Text>
              <Button variant="primary" onClick={handleAquariumFonctionnement}>
                Continuer
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  );
}

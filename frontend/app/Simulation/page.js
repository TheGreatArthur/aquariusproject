'use client';

import { useRouter } from 'next/navigation';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import styles from './style.css';

export default function SimulationHomePage() {
  const router = useRouter();

  const handleAquariumZero = () => {
    router.push('/simulation/starting'); // Redirection vers la page "Aquarium de zéro"
  };

  const handleAquariumFonctionnement = () => {
    router.push('/simulation/aquarium-fonctionnement'); // Redirection vers la page "Aquarium en fonctionnement"
  };

  return (
    <main className={styles.pageContainer}>
      <h1>Choisissez une option :</h1>

      <div className={styles.cardContainer}>
        <Card className={`${styles.card} darkMode`}>
          <Card.Img variant="top" src="https://www.ammannia.com/uploads/ckeditor/W1siZiIsIjIwMTkvMTEvMjcvNHQ5YmNxeXQ3NV9hcXVhc2NhcGluZ19zZWNyZXRzLmpwZyJdLFsicCIsInRodW1iIiwiODAweDgwMD4iXV0/aquascaping-secrets?sha=6629e15ef2de18b6" />
          <Card.Body>
            <Card.Title>Aquarium de zéro</Card.Title>
            <Card.Text>
              Créez un nouvel aquarium à partir de zéro.
            </Card.Text>
            <Button variant="primary" onClick={handleAquariumZero}>Commencer</Button>
          </Card.Body>
        </Card>

        <Card className={`${styles.card} darkMode`}>
          <Card.Img variant="top" src="https://images.ctfassets.net/b85ozb2q358o/49950bPVIufXfuWP1aELg5/48130e07a3c691a3bc7046a90e9be65a/les-poissons-cichlides-d-aquarium-1.jpg" />
          <Card.Body>
            <Card.Title>Aquarium en fonctionnement</Card.Title>
            <Card.Text>
              Gérez un aquarium existant.
            </Card.Text>
            <Button variant="primary" onClick={handleAquariumFonctionnement}>Continuer</Button>
          </Card.Body>
        </Card>
      </div>
    </main>
  );
}

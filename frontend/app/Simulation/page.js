'use client';

import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';

export default function SimulationHomePage () {

  const router = useRouter();

  const handleAquariumZero = () => {
    router.push('./starting');  // Redirection vers la page "Aquarium de zéro"
  };

  const handleAquariumFonctionnement = () => {
    router.push('/aquarium-fonctionnement');  // Redirection vers la page "Aquarium en fonctionnement"
  };

  return <>

    <h1>Choisissez une option :</h1>

    <Button onClick={handleAquariumZero}>Aquarium de zéro</Button>
    <Button onClick={handleAquariumFonctionnement}>Aquarium en fonctionnement</Button>

  </>;
}

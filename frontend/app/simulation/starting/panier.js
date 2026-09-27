/**
 * Panier
 */

import { CaretDownFill, CaretUpFill, XCircleFill } from 'react-bootstrap-icons';
import { totalPoints } from '@/lib/panier';


export default function Panier ({ listePoissons, setListePoissons }) {

  const handleRemoveFromList = (poissonId) => {
    setListePoissons((prevSelection) =>
      prevSelection.filter((poisson) => poisson.id !== poissonId)
    );
  };

  const handleIncreaseQuantity = (poissonId) => {
    setListePoissons((prevSelection) =>
      prevSelection.map((poisson) => {
        if (poisson.id === poissonId) {
          return {
            ...poisson,
            quantite: poisson.quantite + 1,
          };
        }
        return poisson;
      })
    );
  };

  const handleDecreaseQuantity = (poissonId) => {
    setListePoissons((prevSelection) =>
      prevSelection.map((poisson) => {
        if (poisson.id === poissonId) {
          const newQuantite = poisson.quantite - 1;
          if (newQuantite <= 0) {
            // Supprime le poisson si la quantité atteint zéro
            return null;
          }
          return {
            ...poisson,
            quantite: newQuantite,
          };
        }
        return poisson;
      }).filter((poisson) => poisson !== null)
    );
  };

  return <>

    <h2>Liste des poissons ajoutés :</h2>

    <ul>
      {listePoissons.map(p => (
        <li key={p.id}>
            <span>
              {p.nom_commun} (Quantité: {p.quantite}) - {p.quantite * p.points} points
            </span>
          <XCircleFill
            className="ml-2"
            style={{ cursor: 'pointer' }}
            onClick={() => handleRemoveFromList(p.id)}
          />
          <CaretUpFill
            className="ml-2"
            style={{ cursor: 'pointer' }}
            onClick={() => handleIncreaseQuantity(p.id)}
          />
          <CaretDownFill
            className="ml-2"
            style={{ cursor: 'pointer' }}
            onClick={() => handleDecreaseQuantity(p.id)}
          />
        </li>
      ))}
    </ul>

    <p>Total des points : {totalPoints(listePoissons)}</p>

  </>;
}

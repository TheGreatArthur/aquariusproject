/**
 * Panier
 */

import { CaretDownFill, CaretUpFill, XCircleFill } from 'react-bootstrap-icons';
import { validation } from '@/lib/validation';
import { totalPoints } from '@/lib/panier';


export default function Panier ({ listePoissons, setListePoissons }) {

  const isFishIncompatible = p => validation(p, listePoissons);

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

  const hasIncompatibleSpecies = listePoissons.some((poisson) => isFishIncompatible(poisson));

  return <>

    <h2>Liste des poissons ajoutés :</h2>

    <ul>
      {listePoissons.map(p => (
        <li key={p.id}>
            <span style={{ color: isFishIncompatible(p) ? 'red' : 'inherit' }}>
              {p.nom_commun} (Quantité: {p.quantite}) - {p.quantite * p.points} points
              {isFishIncompatible(p) && ' - Veuillez retirer ce ou ces poissons de la liste'}
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

    {hasIncompatibleSpecies && <p>Il y a des poissons incompatibles dans le panier.</p>}

    <p>Total des points : {totalPoints(listePoissons)}</p>

  </>;
}

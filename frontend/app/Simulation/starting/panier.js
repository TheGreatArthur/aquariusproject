import { XCircleFill, CaretUpFill, CaretDownFill } from 'react-bootstrap-icons';
import React from 'react';

export default function Panier({ listePoissons, setListePoissons, isFishIncompatible }) {
  const countPoints = (id) => {
    const poisson = listePoissons.find((p) => p.id === id);
    if (!poisson) return 0;

    const nombreExemplaires = listePoissons.reduce((total, p) => {
      if (p.id === id) {
        return total + p.quantite;
      }
      return total;
    }, 0);

    return poisson.points * nombreExemplaires;
  };

  const handleRemoveFromList = (poissonId) => {
    setListePoissons((prevListePoissons) =>
      prevListePoissons.filter((poisson) => poisson.id !== poissonId)
    );
  };

  const handleIncreaseQuantity = (poissonId) => {
    setListePoissons((prevListePoissons) =>
      prevListePoissons.map((poisson) => {
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
    setListePoissons((prevListePoissons) =>
      prevListePoissons.map((poisson) => {
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

  const calculateTotalPoints = () => {
    let totalPoints = 0;
    listePoissons.forEach((poisson) => {
      totalPoints += countPoints(poisson.id);
    });
    return totalPoints;
  };

  const hasIncompatibleSpecies = listePoissons.some((poisson) => isFishIncompatible(poisson));

  return (
    <>
      <h2>Liste des poissons ajoutés :</h2>

      <ul>
        {listePoissons.map((poisson) => (
          <li key={poisson.id}>
            <span style={{ color: isFishIncompatible(poisson) ? 'red' : 'inherit' }}>
              {poisson.nom_commun} (Quantité: {poisson.quantite}) - {countPoints(poisson.id)} points
              {isFishIncompatible(poisson) && ' - Veuillez retirer ce ou ces poissons de la liste'}
            </span>
            <XCircleFill
              className="ml-2"
              style={{ cursor: 'pointer' }}
              onClick={() => handleRemoveFromList(poisson.id)}
            />
            <CaretUpFill
              className="ml-2"
              style={{ cursor: 'pointer' }}
              onClick={() => handleIncreaseQuantity(poisson.id)}
            />
            <CaretDownFill
              className="ml-2"
              style={{ cursor: 'pointer' }}
              onClick={() => handleDecreaseQuantity(poisson.id)}
            />
          </li>
        ))}
      </ul>

      {hasIncompatibleSpecies && <p>Il y a des poissons incompatibles dans le panier.</p>}

      <p>Total des points : {calculateTotalPoints()}</p>
    </>
  );
}

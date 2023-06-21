import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

export default function TablePoissons({ poissons }) {
  const [listePoissons, setListePoissons] = useState([]);
  const [quantites, setQuantites] = useState({});
  const [scrollLocked, setScrollLocked] = useState(false);

  const handleAddToCart = (p) => {
    setListePoissons((prevListePoissons) => {
      const index = prevListePoissons.findIndex((poisson) => poisson.id === p.id);
      if (index !== -1) {
        // Le poisson existe déjà dans la liste, on incrémente la quantité
        const updatedListePoissons = [...prevListePoissons];
        const updatedPoisson = {
          ...prevListePoissons[index],
          quantite: prevListePoissons[index].quantite + 1,
        };
        updatedListePoissons[index] = updatedPoisson;
        return updatedListePoissons;
      } else {
        // Le poisson n'existe pas dans la liste, on l'ajoute avec une quantité de 1
        return [...prevListePoissons, { ...p, quantite: 1 }];
      }
    });
  };

  const handleAddMultipleToCart = (p) => {
    setListePoissons((prevListePoissons) => {
      const index = prevListePoissons.findIndex((poisson) => poisson.id === p.id);
      if (index !== -1) {
        // Le poisson existe déjà dans la liste, on incrémente la quantité selon la saisie
        const updatedListePoissons = [...prevListePoissons];
        const updatedPoisson = {
          ...prevListePoissons[index],
          quantite: prevListePoissons[index].quantite + quantites[p.id],
        };
        updatedListePoissons[index] = updatedPoisson;
        return updatedListePoissons;
      } else {
        // Le poisson n'existe pas dans la liste, on l'ajoute avec une quantité selon la saisie
        return [
          ...prevListePoissons,
          { ...p, quantite: quantites[p.id] ? quantites[p.id] : 1 },
        ];
      }
    });
    setQuantites((prevQuantites) => {
      // Réinitialiser les quantités après l'ajout des poissons
      const updatedQuantites = { ...prevQuantites };
      delete updatedQuantites[p.id];
      return updatedQuantites;
    });
  };

  const handleQuantityChange = (e, poissonId) => {
    const value = parseInt(e.target.value, 10);
    setQuantites((prevQuantites) => ({
      ...prevQuantites,
      [poissonId]: value >= 0 ? value : 0,
    }));
  };

  const handleScroll = () => {
    const scrollThreshold = 200; // Modifier cette valeur si nécessaire
    setScrollLocked(window.pageYOffset > scrollThreshold);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClearCache = () => {
    setListePoissons([]);
    setQuantites({});
  };

  return (
    <div>
      <h2>Liste des poissons ajoutés :</h2>
      <ul>
        {listePoissons.map((poisson) => (
          <li key={poisson.id}>
            {poisson.nom_commun} (Quantité: {poisson.quantite})
          </li>
        ))}
      </ul>

      <Table className={scrollLocked ? 'scroll-locked' : ''}>
        <thead>
          <tr>
            <th>Nom commun</th>
            <th>Litrage Minimum</th>
            <th>pH Minimum</th>
            <th>pH Maximum</th>
            <th>gH Minimum</th>
            <th>gH Maximum</th>
            <th>°C minimum</th>
            <th>°C maximum</th>
            <th>Comportement</th>
            <th>Quantité</th>
            <th></th> {/* Colonne vide pour le bouton Ajouter */}
          </tr>
        </thead>
        <tbody>
          {poissons.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={`/images/${p.id}.jpg`}
                  alt={p.nom_commun}
                  width="90"
                  height="70"
                />{' '}
                <Link href={`/poissons/${p.id}`}>{p.nom_commun}</Link>
              </td>
              <td>{p.litrage_mini} L</td>
              <td>{p.ph_mini}</td>
              <td>{p.ph_maxi}</td>
              <td>{p.gh_mini}</td>
              <td>{p.gh_maxi}</td>
              <td>{p.temp_mini} °C</td>
              <td>{p.temp_maxi} °C</td>
              <td>{p.nom_comportement}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={quantites[p.id] ? quantites[p.id] : ''}
                  onChange={(e) => handleQuantityChange(e, p.id)}
                />
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleAddMultipleToCart(p)}
                >
                  Ajouter
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="danger" onClick={handleClearCache}>
        Vider le cache
      </Button>
    </div>
  );
}

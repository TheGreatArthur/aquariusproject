/**
 * Résultats
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { validation } from '@/lib/validation';

export default function TablePoissons ({ poissons, listePoissons, setListePoissons }) {

  const [scrollLocked, setScrollLocked] = useState(false);

  const isFishIncompatible = (poisson) => {

    const familleOsphronemidae = 'Osphronemidae';
    const famillePoeciliidae = 'Poeciliidae';

    const hasOsphronemidae = listePoissons.some((p) => p.nom_famille === familleOsphronemidae);
    const hasPoeciliidae = listePoissons.some((p) => p.nom_famille === famillePoeciliidae);

    if (poisson.nom_famille === familleOsphronemidae && hasPoeciliidae) {
      return true;
    }

    if (poisson.nom_famille === famillePoeciliidae && hasOsphronemidae) {
      return true;
    }

    return false;
  };

  const handleAddToCart = (p) => {

    setListePoissons((prevListePoissons) => {
      const index = prevListePoissons.findIndex((poisson) => poisson.id === p.id);
      if (index !== -1) {
        // Le poisson existe déjà dans la liste, on incrémente la quantité de 1
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
  };

  return <>

    <Table hover className={scrollLocked ? 'scroll-locked table-dark' : 'table-dark'}>
      <thead>
        <tr>
          <th>Nom commun</th>
          <th>Famille</th>
          <th>Litrage Minimum</th>
          <th>pH Minimum</th>
          <th>pH Maximum</th>
          <th>gH Minimum</th>
          <th>gH Maximum</th>
          <th>°C minimum</th>
          <th>°C maximum</th>
          <th>Comportement</th>
          <th></th>
          {/* Colonne vide pour le bouton Ajouter */}
        </tr>
      </thead>
      <tbody>
        {poissons.map((p) => (
          <tr key={p.id} style={{ color: isFishIncompatible(p) ? 'red' : 'inherit' }}>
            <td>
              <img src={`/images/${p.id}.jpg`} alt={p.nom_commun} width="90" height="70"/>{' '}
              <Link href={`/poissons/${p.id}`}>{p.nom_commun}</Link>
            </td>
            <td>{p.nom_famille}</td>
            <td>{p.litrage_mini} L</td>
            <td>{p.ph_mini}</td>
            <td>{p.ph_maxi}</td>
            <td>{p.gh_mini}</td>
            <td>{p.gh_maxi}</td>
            <td>{p.temp_mini} °C</td>
            <td>{p.temp_maxi} °C</td>
            <td>{p.nom_comportement}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="ml-2"
                onClick={() => handleAddToCart(p)}
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

  </>;
}

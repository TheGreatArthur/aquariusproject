'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import TablePoissons from './results';
import Pagination from 'react-bootstrap/Pagination';
import styles from '@/app/page.module.scss';
import './style.scss'

function PagePagination({ totalPages, currentPage, onPageChange }) {
  const pageNumbers = [];

  // Créer la liste des numéros de page
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} />
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} />
      {pageNumbers}
      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} />
      <Pagination.Last onClick={() => onPageChange(totalPages)} />
    </Pagination>
  );
}

export default function Poissons() {
  const params = useSearchParams(); // Paramètres d'URL

  const [terme, setTerme] = useState('');
  const [famille, setFamille] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const url = params.get('famille')
    ? `/api/poissons?famille=${params.get('famille')}`
    : `/api/poissons?q=${terme}`;
  const { data, error } = useSWR(url);

  const {data:data2} = useSWR('/api/poissons/familles');

  useEffect(() => {
    setCurrentPage(1); // Réinitialiser la page à la première page lors d'une recherche
  }, [terme, famille]);

  // Effect pour la recherche instantanée lors du choix d'une famille
  useEffect(() => {
    if (famille) {
      setTerme(famille);
    }
  }, [famille]);

  if (error) {
    return <h1>Error</h1>;
  }

  // Pagination
  const poissonsPerPage = 15;
  const totalPages = Math.ceil(data?.poissons.length / poissonsPerPage);
  const indexOfLastPoisson = currentPage * poissonsPerPage;
  const indexOfFirstPoisson = indexOfLastPoisson - poissonsPerPage;
  const currentPoissons = data?.poissons.slice(indexOfFirstPoisson, indexOfLastPoisson);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFamilleChange = (event) => {
    setFamille(event.target.value);
    setTerme('');
  };

  return (
    <main className={`${styles.main} liste-background`}>
      <h1>Liste des poissons</h1>

      {/* Champ de filtrage rapide */}
      <input type="text" value={terme} onChange={(e) => setTerme(e.target.value)} />

      {/* Choix de la famille */}
      <select value={famille} onChange={handleFamilleChange}>
        <option value="">-------------</option>
        {data2 && data2.familles.map(f => <option key={f.id} value={f.nom}>{f.nom}</option>)}
      </select>

      {/* Table des résultats */}
      {data && <TablePoissons poissons={currentPoissons} />}

      {/* Pagination */}
      <div>
        <PagePagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </main>
  );
}

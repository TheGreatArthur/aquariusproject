'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import TablePoissons from './results';

import Pagination from 'react-bootstrap/Pagination';
import styles from '@/app/page.module.scss';
import './style.scss';

const localStorage = typeof window !== 'undefined' ? window.localStorage : null;

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
  const [currentPage, setCurrentPage] = useState(() => {
    if (localStorage) {
      const storedPage = localStorage.getItem('currentPage');
      return storedPage ? parseInt(storedPage) : 1;
    }
    return 1;
  });
  const [isMobile, setIsMobile] = useState(false); // État pour détecter le mode portable

  const url = params.get('famille')
    ? `/api/poissons?famille=${params.get('famille')}`
    : `/api/poissons?q=${terme}`;
  const { data, error } = useSWR(url);

  const { data: data2 } = useSWR('/api/poissons/familles');

  useEffect(() => {
    setCurrentPage(1); // Réinitialiser la page à la première page lors d'une recherche
  }, [terme, famille]);

  // Effect pour la recherche instantanée lors du choix d'une famille
  useEffect(() => {
    if (famille) {
      setTerme(famille);
    }
  }, [famille]);

  useEffect(() => {
    if (localStorage) {
      localStorage.setItem('currentPage', currentPage.toString());
    }
  }, [currentPage]);

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

  useEffect(() => {
    // Fonction pour détecter si on est en mode portable
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mettre à jour l'état en fonction de la taille de la fenêtre
    };

    window.addEventListener('resize', handleResize); // Écouter l'événement de redimensionnement de la fenêtre

    // Vérifier la taille de la fenêtre au chargement de la page
    setIsMobile(window.innerWidth < 768);

    // Nettoyer l'écouteur d'événement lorsque le composant est démonté
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (localStorage) {
      const storedPage = localStorage.getItem('currentPage');
      setCurrentPage(storedPage ? parseInt(storedPage) : 1);
    }
  }, []);

  useEffect(() => {
    if (localStorage) {
      localStorage.setItem('currentPage', currentPage.toString());
    }
  }, [currentPage]);

  return (
    <main className={`${styles.main} liste-background page-container`}>

      <h1>Liste des poissons</h1>

      {/* Champ de filtrage rapide */}
      <input type="text" value={terme} onChange={(e) => setTerme(e.target.value)} />

      {/* Choix de la famille */}
      <select value={famille} onChange={handleFamilleChange}>
        <option value="">-------------</option>
        {data2 && data2.familles.map((f) => <option key={f.id} value={f.nom}>{f.nom}</option>)}
      </select>

      {/* Table des résultats */}
      {data && (
        <TablePoissons poissons={currentPoissons} hideFamille={isMobile} isMobile={isMobile} />
      )}

      {/* Pagination */}
      <div>
        <PagePagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}

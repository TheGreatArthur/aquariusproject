'use client';



import React from 'react';
import BasicExample from '@/app/nav';




export default function App() {
  const handleAquariumZero = () => {
    // Redirection vers la page "Aquarium de zéro"
    window.location.href = "/Simulation/starting";
   
  };

  const handleAquariumFonctionnement = () => {
    // Redirection vers la page "Aquarium en fonctionnement"
    window.location.href = "/aquarium-fonctionnement";
  };

  return (
    
    <div>
      <BasicExample />
      <h1>Choisissez une option :</h1>
      <button onClick={handleAquariumZero}>Aquarium de zéro</button>
      <button onClick={handleAquariumFonctionnement}>Aquarium en fonctionnement</button>
      
    </div>
  );
}

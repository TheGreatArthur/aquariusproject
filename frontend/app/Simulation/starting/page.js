'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

import TablePoissons from './results';
import Panier from './panier';
import { validation } from './validation';


export default function App() {

    const [poissonsCompatibles, setPoissonsCompatibles] = useState([]);
    const [listePoissons, setListePoissons] = useState(() => {
        const savedListePoissons = localStorage.getItem('listePoissons');
        return savedListePoissons ? JSON.parse(savedListePoissons) : [];
    });

    const { data: poissonsData, error: poissonsError } = useSWR(`/api/poissons`);

    const { register, formState: { errors }, reset, watch } = useForm();

    const litrage = watch('litrage');
    const pH = watch('pH');
    const gH = watch('gH');
    const tempMoyenne = watch('tempMoyenne');

    useEffect(() => {
        localStorage.setItem('listePoissons', JSON.stringify(listePoissons));
    }, [listePoissons]);

    /*
        const handleReset = () => {
        reset();
        setPoissonsCompatibles([]);
    };
    */

    console.log(errors);

    const handleGoBack = () => {
        window.history.back();
    };

    useEffect(() => {
        if (poissonsData && poissonsData.poissons) {
            const poissonsFiltres = poissonsData.poissons.filter(poisson =>
                poisson.litrage_mini <= litrage &&
                (!pH || (pH >= poisson.ph_mini && pH <= poisson.ph_maxi)) &&
                (!gH || (gH >= poisson.gh_mini && gH <= poisson.gh_maxi)) &&
                (!tempMoyenne || (tempMoyenne >= poisson.temp_mini && tempMoyenne <= poisson.temp_maxi))
            );
            setPoissonsCompatibles(poissonsFiltres);
            
            const idsPoissonsFiltres = poissonsFiltres.map(x => x.id);
            const newListePoissons = listePoissons.filter(
                x => idsPoissonsFiltres.indexOf(x.id) >= 0);
            setListePoissons(newListePoissons);

        }
    }, [poissonsData, litrage, pH, gH, tempMoyenne]);

    useEffect(() => {
        // Récupérer les valeurs des champs du formulaire depuis le cache du navigateur
        const cachedFormData = JSON.parse(localStorage.getItem('form_data'));
        if (cachedFormData) {
            reset(cachedFormData);
        }
    }, []);

    useEffect(() => {
        // Sauvegarder les valeurs des champs du formulaire dans le cache du navigateur
        const formData = { litrage, pH, gH, tempMoyenne };
        localStorage.setItem('form_data', JSON.stringify(formData));
    }, [litrage, pH, gH, tempMoyenne]);

    const isFishIncompatible = p => validation(p, listePoissons);        

    return (
        <form>
            <div>
                <label htmlFor="litrage">Litrage de votre aquarium:</label>
                <input type="number" id="litrage" {...register("litrage", {})} />
            </div>
            <div>
                <label htmlFor="pH">pH moyen de votre aquarium:</label>
                <input type="text" id="pH" {...register("pH", { pattern: /^\d*\.?\d*$/, min: 0, max: 14 })} />
            </div>
            <div>
                <label htmlFor="gH">gH moyen de votre aquarium:</label>
                <input type="text" id="gH" {...register("gH", { pattern: /^\d*\.?\d*$/ })} />
            </div>
            <div>
                <label htmlFor="tempMoyenne">Température moyenne de votre aquarium:</label>
                <input type="text" id="tempMoyenne" {...register("tempMoyenne", { pattern: /^-?\d*\.?\d*$/ })} />
            </div>


            {poissonsError ? (
                <h1>Une erreur est survenue lors du chargement des poissons.</h1>
            ) : poissonsCompatibles.length > 0 ? <>

                <Panier listePoissons={listePoissons} 
                        setListePoissons={setListePoissons}
                        isFishIncompatible={isFishIncompatible}/>  
  
                <TablePoissons poissons={poissonsCompatibles}
                               listePoissons={listePoissons}
                               setListePoissons={setListePoissons}
                               isFishIncompatible={isFishIncompatible}/>
            </> : null}

            <button type="button" onClick={handleGoBack}>Retour à la page précédente</button>
        </form>
    );
}


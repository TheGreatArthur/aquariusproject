/**
 * Simulation / starting
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';

import { lsGet, lsSet } from '@/lib/localstorage';
import { validation } from '@/lib/validation';
import Panier from './panier';
import TablePoissons from './results';

LS_SELECTION_KEY = 'selectionPoissons';
LS_FORM_DATA_KEY = 'formData';


export default function SimulationStartingPage () {

  const router = useRouter();

  const [poissonsCompatibles, setPoissonsCompatibles] = useState([]);
  const [selectionPoissons, setSelectionPoissons] = useState(() => lsGet(LS_SELECTION_KEY) || []);

  const { data, error } = useSWR('/api/poissons');  // Tous les poissons

  const { register, reset, watch } = useForm();

  // Chargement des valeurs du formulaire depuis le stockage local
  const cachedFormData = lsGet(LS_FORM_DATA_KEY);
  if (cachedFormData)
    reset(cachedFormData);

  // On suit les changements sur les champs
  const litrage = watch('litrage');
  const pH = watch('pH');
  const gH = watch('gH');
  const tempMoyenne = watch('tempMoyenne');
  lsSet(LS_FORM_DATA_KEY, { litrage, pH, gH, tempMoyenne });

  if (data && data.poissons) {

    // Liste des poissons correspondant aux critères
    const poissonsFiltres = data.poissons.filter(poisson =>
      poisson.litrage_mini <= litrage &&
      (!pH || (pH >= poisson.ph_mini && pH <= poisson.ph_maxi)) &&
      (!gH || (gH >= poisson.gh_mini && gH <= poisson.gh_maxi)) &&
      (!tempMoyenne || (tempMoyenne >= poisson.temp_mini && tempMoyenne <= poisson.temp_maxi))
    );
    setPoissonsCompatibles(poissonsFiltres);

    // Correction de la sélection
    const idsPoissonsFiltres = poissonsFiltres.map(x => x.id);
    const newSelectionPoissons = selectionPoissons.filter(x => idsPoissonsFiltres.indexOf(x.id) >= 0);
    lsSet(LS_SELECTION_KEY, newSelectionPoissons);
    setSelectionPoissons(newSelectionPoissons);

  }

  const isFishIncompatible = p => validation(p, selectionPoissons);

  return <form>

    <div>
      <label htmlFor="litrage">Litrage de votre aquarium:</label>
      <input type="number" id="litrage" {...register('litrage', {})} />
    </div>
    <div>
      <label htmlFor="pH">pH moyen de votre aquarium:</label>
      <input type="text" id="pH" {...register('pH', { pattern: /^\d*\.?\d*$/, min: 0, max: 14 })} />
    </div>
    <div>
      <label htmlFor="gH">gH moyen de votre aquarium:</label>
      <input type="text" id="gH" {...register('gH', { pattern: /^\d*\.?\d*$/ })} />
    </div>
    <div>
      <label htmlFor="tempMoyenne">Température moyenne de votre aquarium:</label>
      <input type="text" id="tempMoyenne" {...register('tempMoyenne', { pattern: /^-?\d*\.?\d*$/ })} />
    </div>

    {error &&
      <h1>Une erreur est survenue lors du chargement de la liste des poissons.</h1>}

    {!error && poissonsCompatibles.length > 0 && <>
      <Panier selectionPoissons={selectionPoissons}
              setSelectionPoissons={setSelectionPoissons}/>
      <TablePoissons poissons={poissonsCompatibles}
                     selectionPoissons={selectionPoissons}
                     setSelectionPoissons={setSelectionPoissons}/>
    </>}

    <Button onClick={() => router.back()}>Retour à la page précédente</Button>

  </form>;
}


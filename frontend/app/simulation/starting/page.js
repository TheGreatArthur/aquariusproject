'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import { lsGet, lsSet } from '@/lib/localstorage';
import { validation } from '@/lib/validation';
import TablePoissons from './results';
import Panier from './panier';

const FIELDS = [
  { name: 'litrage', label: 'Volume', unit: 'L', placeholder: '120', rules: {} },
  { name: 'pH', label: 'pH moyen', unit: '', placeholder: '7', rules: { pattern: /^\d*\.?\d*$/, min: 0, max: 14 } },
  { name: 'gH', label: 'GH moyen', unit: '°', placeholder: '10', rules: { pattern: /^\d*\.?\d*$/ } },
  { name: 'tempMoyenne', label: 'Température', unit: '°C', placeholder: '25', rules: { pattern: /^-?\d*\.?\d*$/ } },
];

export default function SimulationStart () {

  const [poissonsCompatibles, setPoissonsCompatibles] = useState([]);
  const [listePoissons, setListePoissons] = useState(() => lsGet('listePoissons') || []);

  const { data: poissonsData, error: poissonsError } = useSWR('/api/poissons');

  const { register, reset, watch } = useForm();

  const litrage = watch('litrage');
  const pH = watch('pH');
  const gH = watch('gH');
  const tempMoyenne = watch('tempMoyenne');

  const environnement = { litrage, pH, gH, tempMoyenne };

  useEffect(() => {
    lsSet('listePoissons', listePoissons);
  }, [listePoissons]);

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
    const cachedFormData = lsGet('form_data');
    if (cachedFormData) {
      reset(cachedFormData);
    }
  }, []);

  useEffect(() => {
    const formData = { litrage, pH, gH, tempMoyenne };
    lsSet('form_data', formData);
  }, [litrage, pH, gH, tempMoyenne]);

  const { ok, messages, ids } = validation(listePoissons, environnement);

  return <>
    <PageHeader eyebrow="Simulateur" title="Aquarium de zéro">
      Renseignez votre eau : seules les espèces compatibles restent affichées. Ajoutez-les ensuite à votre bac.
    </PageHeader>

    <div className="container grid items-start gap-8 lg:grid-cols-[22rem_1fr]">

      {/* Paramètres, verdict et bac */}
      <aside className="space-y-5 lg:sticky lg:top-24">
        <form className="card p-5" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-lg font-semibold">Votre eau</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {FIELDS.map(({ name, label, unit, placeholder, rules }) => (
              <label key={name} htmlFor={name}>
                <span className="label">{label}</span>
                <span className="relative block">
                  <input id={name} className="input pr-10" inputMode="decimal" placeholder={placeholder}
                         {...register(name, rules)}/>
                  {unit && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{unit}</span>}
                </span>
              </label>
            ))}
          </div>
        </form>

        {listePoissons.length > 0 && (
          <div
            role="status"
            className={clsx('card p-5', ok ? 'border-success/40' : 'border-danger/40')}
          >
            <p className={clsx('flex items-center gap-2 font-display font-semibold', ok ? 'text-success' : 'text-danger')}>
              {ok ? <CheckCircle2 className="h-5 w-5"/> : <AlertTriangle className="h-5 w-5"/>}
              {ok ? 'Population compatible' : 'Attention'}
            </p>
            {messages.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-sm text-foreground/85">
                {messages.map((m, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-danger"/>{m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Panier listePoissons={listePoissons}
                setListePoissons={setListePoissons}
                idsConcernes={ids}
                litrage={litrage}/>
      </aside>

      {/* Espèces compatibles */}
      <section aria-labelledby="compatibles-title">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="compatibles-title" className="text-2xl font-semibold">Espèces compatibles</h2>
          {poissonsCompatibles.length > 0 && (
            <span className="text-sm text-muted">{poissonsCompatibles.length} résultats</span>
          )}
        </div>

        {poissonsError ? (
          <p className="card mt-5 p-8 text-center text-danger">Une erreur est survenue lors du chargement des poissons.</p>
        ) : poissonsCompatibles.length > 0 ? (
          <TablePoissons poissons={poissonsCompatibles}
                         listePoissons={listePoissons}
                         setListePoissons={setListePoissons}/>
        ) : (
          <div className="card mt-5 p-10 text-center">
            <p className="font-display text-lg">
              {litrage ? 'Aucune espèce ne correspond à ces paramètres.' : 'Commencez par indiquer le volume de votre bac.'}
            </p>
            <p className="mt-2 text-sm text-muted">
              {litrage ? 'Élargissez la plage de pH, de GH ou de température.' : 'Les espèces compatibles apparaîtront ici.'}
            </p>
          </div>
        )}
      </section>
    </div>
  </>;
}

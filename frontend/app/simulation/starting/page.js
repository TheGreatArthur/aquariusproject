'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

import PageHeader from '@/components/PageHeader';
import { evaluate } from '@/lib/compat';
import { lsGet, lsSet } from '@/lib/localstorage';
import TablePoissons from './results';
import Panier from './panier';
import Verdict from './verdict';

const FIELDS = [
  { name: 'litrage', label: 'Volume', unit: 'L', placeholder: '120', rules: {} },
  { name: 'pH', label: 'pH moyen', unit: '', placeholder: '7', rules: { pattern: /^\d*\.?\d*$/, min: 0, max: 14 } },
  { name: 'gH', label: 'GH moyen', unit: '°', placeholder: '10', rules: { pattern: /^\d*\.?\d*$/ } },
  { name: 'tempMoyenne', label: 'Température', unit: '°C', placeholder: '25', rules: { pattern: /^-?\d*\.?\d*$/ } },
];

/** Valeur numérique d'un champ du formulaire ; undefined si vide ou invalide */
const nombre = (value) => (value === '' || value == null || Number.isNaN(Number(value)) ? undefined : Number(value));

export default function SimulationStart () {

  const [poissonsCompatibles, setPoissonsCompatibles] = useState([]);
  const [listePoissons, setListePoissons] = useState([]);
  const [restored, setRestored] = useState(false);

  const { data: poissonsData, error: poissonsError } = useSWR('/api/poissons');

  const { register, reset, watch } = useForm();

  const litrage = watch('litrage');
  const pH = watch('pH');
  const gH = watch('gH');
  const tempMoyenne = watch('tempMoyenne');

  const environnement = {
    litrage: nombre(litrage), pH: nombre(pH), gH: nombre(gH), tempMoyenne: nombre(tempMoyenne),
  };
  const { litrage: l, pH: ph, gH: gh, tempMoyenne: temp } = environnement;

  // Le bac et l'eau enregistrés ne sont relus qu'après le premier rendu : le serveur ne connaît pas le
  // stockage local, les lire plus tôt ferait diverger le HTML du serveur et celui du navigateur
  useEffect(() => {
    setListePoissons(lsGet('listePoissons') || []);
    const cachedFormData = lsGet('form_data');
    if (cachedFormData)
      reset(cachedFormData);
    setRestored(true);
  }, [reset]);

  useEffect(() => {
    if (restored)
      lsSet('listePoissons', listePoissons);
  }, [restored, listePoissons]);

  useEffect(() => {
    // Sans volume, on n'affiche aucune espèce mais on garde le bac tel quel
    if (!poissonsData?.poissons || !l) {
      setPoissonsCompatibles([]);
      return;
    }
    const poissonsFiltres = poissonsData.poissons.filter(poisson =>
      poisson.litrage_mini <= l &&
      (ph === undefined || (ph >= poisson.ph_mini && ph <= poisson.ph_maxi)) &&
      (gh === undefined || (gh >= poisson.gh_mini && gh <= poisson.gh_maxi)) &&
      (temp === undefined || (temp >= poisson.temp_mini && temp <= poisson.temp_maxi))
    );
    setPoissonsCompatibles(poissonsFiltres);

    // Retire du bac les espèces devenues incompatibles et rafraîchit les fiches enregistrées (données à jour)
    const parId = new Map(poissonsFiltres.map((p) => [p.id, p]));
    setListePoissons((liste) => liste
      .filter((p) => parId.has(p.id))
      .map((p) => ({ ...parId.get(p.id), quantite: p.quantite })));
  }, [poissonsData, l, ph, gh, temp]);

  useEffect(() => {
    if (restored)
      lsSet('form_data', { litrage, pH, gH, tempMoyenne });
  }, [restored, litrage, pH, gH, tempMoyenne]);

  const { verdict, issues, ranges } = evaluate(listePoissons, environnement);

  // Gravité la plus haute par poisson, pour colorer le bac
  const severites = {};
  for (const i of [...issues].reverse())
    for (const id of i.ids)
      severites[id] = i.severity;

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

        {listePoissons.length > 0 && <Verdict verdict={verdict} issues={issues} ranges={ranges}/>}

        <Panier listePoissons={listePoissons}
                setListePoissons={setListePoissons}
                severites={severites}
                litrage={environnement.litrage}/>
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
                         setListePoissons={setListePoissons}
                         environnement={environnement}/>
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

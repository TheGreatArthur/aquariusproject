'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import useSWR from 'swr';

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

/**
 * Formulaire d'eau, espèces compatibles et bac. Rendu seulement dans le navigateur (voir page.js) : le bac et
 * l'eau enregistrés sont lus dès le premier rendu, sans risque d'écart avec le HTML du serveur.
 */
export default function Simulator () {

  // Bac enregistré, y compris les espèces masquées parce qu'elles ne conviennent plus à l'eau saisie
  const [listePoissons, setListePoissons] = useState(() => lsGet('listePoissons') || []);
  const [savedForm] = useState(() => lsGet('form_data') ?? {});

  const { data: poissonsData, error: poissonsError } = useSWR('/api/poissons');

  const { register, control } = useForm({ defaultValues: savedForm });
  const [litrage, pH, gH, tempMoyenne] = useWatch({ control, name: ['litrage', 'pH', 'gH', 'tempMoyenne'] });

  const environnement = {
    litrage: nombre(litrage), pH: nombre(pH), gH: nombre(gH), tempMoyenne: nombre(tempMoyenne),
  };
  const { litrage: l, pH: ph, gH: gh, tempMoyenne: temp } = environnement;

  useEffect(() => {
    lsSet('listePoissons', listePoissons);
  }, [listePoissons]);

  useEffect(() => {
    lsSet('form_data', { litrage, pH, gH, tempMoyenne });
  }, [litrage, pH, gH, tempMoyenne]);

  // Sans volume, on n'affiche aucune espèce
  const poissonsCompatibles = useMemo(() => (!poissonsData?.poissons || !l ? [] : poissonsData.poissons.filter(poisson =>
    poisson.litrage_mini <= l &&
    (ph === undefined || (ph >= poisson.ph_mini && ph <= poisson.ph_maxi)) &&
    (gh === undefined || (gh >= poisson.gh_mini && gh <= poisson.gh_maxi)) &&
    (temp === undefined || (temp >= poisson.temp_mini && temp <= poisson.temp_maxi))
  )), [poissonsData, l, ph, gh, temp]);

  // Bac affiché : sans volume il reste tel quel ; sinon les espèces incompatibles sont masquées (elles reviennent
  // si l'eau redevient compatible) et les fiches enregistrées sont remplacées par les données à jour
  const bac = useMemo(() => {
    if (!poissonsData?.poissons || !l)
      return listePoissons;
    const parId = new Map(poissonsCompatibles.map((p) => [p.id, p]));
    return listePoissons
      .filter((p) => parId.has(p.id))
      .map((p) => ({ ...parId.get(p.id), quantite: p.quantite }));
  }, [poissonsData, l, listePoissons, poissonsCompatibles]);

  const { verdict, issues, ranges } = evaluate(bac, environnement);

  // Gravité la plus haute par poisson, pour colorer le bac
  const severites = {};
  for (const i of [...issues].reverse())
    for (const id of i.ids)
      severites[id] = i.severity;

  return (
    <div className="container grid items-start gap-8 lg:grid-cols-[22rem_1fr]">

      {/* Paramètres, verdict et bac */}
      <aside className="space-y-5 lg:sticky lg:top-24">
        <form className="card p-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold">Votre eau</h2>
            <Link href="/cours/parametres-eau" className="text-xs text-muted hover:text-accent-glow">Comprendre ces valeurs</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {FIELDS.map(({ name, label, unit, placeholder, rules }) => (
              <label key={name} htmlFor={name}>
                <span className="label">{label}</span>
                <span className="relative block">
                  <input id={name} className="input pr-10 tabular-nums" inputMode="decimal" autoComplete="off"
                         placeholder={placeholder} {...register(name, rules)}/>
                  {unit && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{unit}</span>}
                </span>
              </label>
            ))}
          </div>
        </form>

        {bac.length > 0 && <Verdict verdict={verdict} issues={issues} ranges={ranges}/>}

        <Panier listePoissons={bac}
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
                         listePoissons={bac}
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
  );
}

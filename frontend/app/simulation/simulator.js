'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import clsx from 'clsx';

import { espece, evaluate, TYPES } from '@/lib/compat';
import { lsGet, lsSet } from '@/lib/localstorage';
import Bac from './bac';
import Especes from './especes';

const FIELDS = [
  { name: 'litrage', label: 'Volume', unit: 'L', placeholder: '120' },
  { name: 'pH', label: 'pH', unit: '', placeholder: '7' },
  { name: 'gH', label: 'GH', unit: '°', placeholder: '10' },
  { name: 'tempMoyenne', label: 'Température', unit: '°C', placeholder: '25' },
];

// Eaux types, pour qui ne connaît pas encore la sienne
const PROFILS = [
  { label: 'Douce et acide', eau: { pH: '6.5', gH: '5', tempMoyenne: '26' } },
  { label: 'Neutre', eau: { pH: '7', gH: '10', tempMoyenne: '25' } },
  { label: 'Dure et alcaline', eau: { pH: '8', gH: '18', tempMoyenne: '25' } },
];

/** Valeur numérique d'un champ ; undefined si vide ou invalide */
const nombre = (value) => (value === '' || value == null || Number.isNaN(Number(value)) ? undefined : Number(value));

/** Bac enregistré : [{ kind, ref, quantite }] ; un ancien bac ne contenait que des poissons (`listePoissons`) */
function bacEnregistre () {
  return lsGet('bac') ?? (lsGet('listePoissons') ?? []).map((p) => ({ kind: 'poisson', ref: p.id, quantite: p.quantite }));
}

/**
 * Simulateur : le bac et son eau, le catalogue des trois types d'espèces, puis le bac composé avec son verdict.
 * Rendu seulement dans le navigateur (voir page.js) : le bac enregistré est lu dès le premier rendu.
 */
export default function Simulator () {
  const [contenu, setContenu] = useState(bacEnregistre);
  const [eau, setEau] = useState(() => lsGet('form_data') ?? {});

  const poissons = useSWR(TYPES.poisson.api);
  const plantes = useSWR(TYPES.plante.api);
  const invertebres = useSWR(TYPES.invertebre.api);

  useEffect(() => { lsSet('bac', contenu); }, [contenu]);
  useEffect(() => { lsSet('form_data', eau); }, [eau]);

  const environnement = Object.fromEntries(FIELDS.map(({ name }) => [name, nombre(eau[name])]));

  // Les trois catalogues, au format du moteur (identifiants uniques entre catalogues)
  const catalogue = useMemo(() => Object.fromEntries([
    ['poisson', poissons.data], ['plante', plantes.data], ['invertebre', invertebres.data],
  ].map(([kind, data]) => [kind, data?.[TYPES[kind].liste].map((item) => espece(kind, item))])),
  [poissons.data, plantes.data, invertebres.data]);

  // Bac avec les fiches à jour ; une espèce retirée du catalogue disparaît du bac
  const bac = useMemo(() => contenu.flatMap(({ kind, ref, quantite }) => {
    const item = catalogue[kind]?.find((p) => p.ref === ref);
    return item ? [{ ...item, quantite }] : [];
  }), [contenu, catalogue]);

  const ajouter = (p) => setContenu((prev) => (prev.some((c) => c.kind === p.kind && c.ref === p.ref)
    ? prev.map((c) => (c.kind === p.kind && c.ref === p.ref ? { ...c, quantite: c.quantite + 1 } : c))
    : [...prev, { kind: p.kind, ref: p.ref, quantite: Math.max(1, p.nb_individus ?? 1) }]));

  const changerQuantite = (p, delta) => setContenu((prev) => prev
    .map((c) => (c.kind === p.kind && c.ref === p.ref ? { ...c, quantite: c.quantite + delta } : c))
    .filter((c) => c.quantite > 0));

  const evaluation = evaluate(bac, environnement);
  const erreur = poissons.error || plantes.error || invertebres.error;

  return (
    <div className="container pb-28 lg:pb-0">
      {/* Le bac : volume et eau */}
      <form className="card p-5 sm:p-6" onSubmit={(e) => e.preventDefault()} aria-labelledby="eau-title">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="eau-title" className="text-lg font-semibold">Votre bac</h2>
          <Link href="/cours/parametres-eau" className="text-xs text-muted hover:text-accent-glow">Comprendre ces valeurs</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {FIELDS.map(({ name, label, unit, placeholder }) => (
            <label key={name} htmlFor={name}>
              <span className="label">{label}</span>
              <span className="relative block">
                <input id={name} name={name} className="input pr-10 tabular-nums" inputMode="decimal" autoComplete="off"
                       placeholder={placeholder} value={eau[name] ?? ''}
                       onChange={(e) => setEau({ ...eau, [name]: e.target.value.replace(',', '.') })}/>
                {unit && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{unit}</span>}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="mr-1 text-muted">Eau type :</span>
          {PROFILS.map(({ label, eau: valeurs }) => (
            <button key={label} type="button" onClick={() => setEau({ ...eau, ...valeurs })}
                    className={clsx('chip', Object.entries(valeurs).every(([k, v]) => eau[k] === v) && 'chip-active')}>
              {label}
            </button>
          ))}
          {FIELDS.some(({ name }) => eau[name]) && (
            <button type="button" onClick={() => setEau({})} className="ml-1 text-xs text-muted hover:text-foreground">
              Effacer
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        {erreur ? (
          <p className="card p-8 text-center text-danger">Impossible de charger les espèces. Vérifiez que l&apos;API est démarrée.</p>
        ) : (
          <Especes catalogue={catalogue} bac={bac} environnement={environnement} onAdd={ajouter}/>
        )}
        <Bac bac={bac} evaluation={evaluation} litrage={environnement.litrage}
             onChange={changerQuantite} onClear={() => setContenu([])}/>
      </div>
    </div>
  );
}

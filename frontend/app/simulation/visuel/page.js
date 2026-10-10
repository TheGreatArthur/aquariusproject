'use client';

/**
 * Simulateur visuel (prototype) : un aquarium animé où l'on dépose les poissons compatibles
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import clsx from 'clsx';
import { GripVertical, Plus, RotateCcw } from 'lucide-react';

import Verdict from '@/app/simulation/verdict';
import PageHeader from '@/components/PageHeader';
import Aquarium from '@/components/tank/Aquarium';
import { evaluate } from '@/lib/compat';
import { fishImage } from '@/lib/fish';
import { SPRITES, spriteUrl, TANKS } from '@/lib/tank';

const MAX_FISH = 60;

export default function SimulationVisuelle () {
  const { data } = useSWR('/api/poissons');
  const [tank, setTank] = useState(TANKS[1]);
  const [temp, setTemp] = useState(25);
  const [ph, setPh] = useState(6.5);
  const [allEntries, setEntries] = useState([]);
  const counter = useRef(0);

  // Espèces compatibles avec le bac et l'eau choisis ; celles qui ont un visuel en premier
  const compatibles = useMemo(() => (data?.poissons ?? [])
    .filter((p) => p.litrage_mini <= tank.litrage && ph >= p.ph_mini && ph <= p.ph_maxi
      && temp >= p.temp_mini && temp <= p.temp_maxi)
    .sort((a, b) => Number(Boolean(SPRITES[b.id])) - Number(Boolean(SPRITES[a.id]))
      || a.nom_commun.localeCompare(b.nom_commun)), [data, tank, ph, temp]);

  // Les poissons devenus incompatibles avec le bac ou l'eau choisis ne sont plus affichés
  const entries = useMemo(() => {
    const ok = new Set(compatibles.map((p) => p.id));
    return allEntries.filter((e) => ok.has(e.fish.id));
  }, [allEntries, compatibles]);

  const add = (fish, count = 1, x, y) => setEntries((list) => [
    ...list,
    ...Array.from({ length: Math.min(count, MAX_FISH - list.length) }, (_, i) => ({
      key: `${fish.id}-${counter.current++}`,
      fish,
      // Un groupe déposé se répartit autour du point de dépôt
      x: x === undefined ? undefined : x + (i ? (Math.random() - 0.5) * fish.taille * 4 : 0),
      y: y === undefined ? undefined : y + (i ? (Math.random() - 0.5) * fish.taille * 2 : 0),
    })),
  ]);

  const onDropFish = (id, x, y) => {
    const fish = compatibles.find((p) => p.id === id);
    if (fish)
      add(fish, 1, x, y);
  };

  // Population du bac au format du moteur de compatibilité
  const population = useMemo(() => {
    const byId = new Map();
    for (const { fish } of entries)
      byId.set(fish.id, { ...fish, quantite: (byId.get(fish.id)?.quantite ?? 0) + 1 });
    return [...byId.values()];
  }, [entries]);
  const { verdict, issues, ranges } = evaluate(population, { litrage: tank.litrage });

  return (
    <>
      <PageHeader eyebrow="Simulateur visuel · prototype" title="Composez votre bac en le voyant vivre">
        Choisissez un bac et votre eau, puis glissez les poissons compatibles dans l&apos;aquarium.
      </PageHeader>

      <div className="container grid items-start gap-8 lg:grid-cols-[20rem_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="card p-5">
            <h2 className="text-lg font-semibold">Votre bac</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {TANKS.map((t) => (
                <button
                  key={t.litrage}
                  type="button"
                  onClick={() => setTank(t)}
                  className={clsx('rounded-xl border px-3 py-2 text-left transition',
                    t === tank ? 'border-accent/60 bg-accent/10' : 'border-border hover:border-accent/40')}
                >
                  <span className="block font-display font-semibold">{t.litrage} L</span>
                  <span className="text-xs text-muted">{t.label} · {t.longueur}×{t.hauteur} cm</span>
                </button>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="label flex justify-between"><span>Température</span><span className="text-foreground">{temp} °C</span></span>
              <input type="range" min="18" max="32" step="0.5" value={temp} onChange={(e) => setTemp(Number(e.target.value))}
                     className="w-full accent-[#2DD4BF]"/>
            </label>
            <label className="mt-3 block">
              <span className="label flex justify-between"><span>pH</span><span className="text-foreground">{ph}</span></span>
              <input type="range" min="5" max="8.5" step="0.1" value={ph} onChange={(e) => setPh(Number(e.target.value))}
                     className="w-full accent-[#2DD4BF]"/>
            </label>
          </div>

          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">Espèces compatibles</h2>
              <span className="text-xs text-muted">{compatibles.length}</span>
            </div>
            <p className="mt-1 text-xs text-muted">Glissez un poisson dans le bac, ou ajoutez son groupe.</p>
            <ul className="mt-4 max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {compatibles.map((p) => {
                const sprite = Boolean(SPRITES[p.id]);
                return (
                  <li
                    key={p.id}
                    draggable={sprite}
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', String(p.id))}
                    className={clsx('flex items-center gap-3 rounded-xl border border-border p-2',
                      sprite ? 'cursor-grab bg-surface-elevated/60 hover:border-accent/50' : 'opacity-45')}
                  >
                    {sprite && <GripVertical className="h-4 w-4 shrink-0 text-muted"/>}
                    <div className="relative h-9 w-14 shrink-0">
                      {sprite
                        ? <Image src={spriteUrl(p.id)} alt="" fill sizes="56px" className="object-contain"/>
                        : <Image src={fishImage(p)} alt="" fill sizes="56px" className="rounded-md object-cover grayscale"/>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.nom_commun}</p>
                      <p className="text-xs text-muted">{sprite ? `${p.taille} cm · groupe de ${p.nb_individus}` : 'Visuel bientôt disponible'}</p>
                    </div>
                    {sprite && (
                      <button type="button" onClick={() => add(p, p.nb_individus)} className="btn-ghost !px-2.5 !py-1 text-xs"
                              aria-label={`Ajouter un groupe de ${p.nb_individus} ${p.nom_commun}`}>
                        <Plus className="h-3.5 w-3.5"/> {p.nb_individus}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <section className="space-y-5">
          <Aquarium tank={tank} entries={entries} onDropFish={onDropFish}
                    onRemoveFish={(key) => setEntries((list) => list.filter((e) => e.key !== key))}/>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {entries.length
                ? population.map((p) => `${p.quantite} ${p.nom_commun}`).join(' · ')
                : 'Le bac est vide : glissez un poisson depuis la liste.'}
            </p>
            {entries.length > 0 && (
              <button type="button" onClick={() => setEntries([])} className="btn-ghost !py-1.5 text-sm">
                <RotateCcw className="h-4 w-4"/> Vider le bac
              </button>
            )}
          </div>

          {entries.length > 0 && <Verdict verdict={verdict} issues={issues} ranges={ranges}/>}
        </section>
      </div>
    </>
  );
}

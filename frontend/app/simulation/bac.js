import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { totalPoints, TYPES } from '@/lib/compat';
import Verdict from './verdict';

const iconButton = 'inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition '
  + 'hover:bg-surface-elevated hover:text-foreground';

const VERDICT_COURT = { ok: 'Compatible', warning: 'À surveiller', error: 'Incompatible' };

/**
 * Bac composé : verdict, charge, espèces par type avec leur nombre. Sur téléphone, une barre en bas de l'écran
 * rappelle son état et y mène.
 */
export default function Bac ({ bac, evaluation, litrage, onChange, onClear }) {
  // « Tout vider » demande une confirmation : le bac enregistré serait perdu
  const [confirmVider, setConfirmVider] = useState(false);
  const { verdict, issues, ranges } = evaluation;

  // Gravité la plus haute par espèce, pour colorer le bac
  const severites = {};
  for (const i of [...issues].reverse())
    for (const id of i.ids)
      severites[id] = i.severity;

  const total = totalPoints(bac);
  const capacite = litrage || 0;
  const remplissage = capacite ? Math.min(100, (total / capacite) * 100) : 0;

  return (
    <>
      <aside id="mon-bac" aria-labelledby="bac-title" className="scroll-mt-24 space-y-4 lg:sticky lg:top-24">
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <h2 id="bac-title" className="text-lg font-semibold">Mon bac</h2>
            {bac.length > 0 && (confirmVider ? (
              <span className="flex items-center gap-3 text-xs">
                <button type="button" onClick={() => { onClear(); setConfirmVider(false); }}
                        className="font-medium text-danger hover:underline">
                  Confirmer
                </button>
                <button type="button" onClick={() => setConfirmVider(false)} className="text-muted hover:text-foreground">
                  Annuler
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmVider(true)} className="text-xs text-muted hover:text-danger">
                Tout vider
              </button>
            ))}
          </div>

          {/* Charge du bac : points des animaux / volume */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted">
              <span>Charge</span>
              <span className="tabular-nums">{capacite ? `${total} / ${capacite} points` : 'Indiquez le volume du bac'}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-elevated">
              <div className={clsx('h-full origin-left rounded-full transition-[transform,background-color] duration-500',
                total > capacite ? 'bg-danger' : remplissage > 80 ? 'bg-warning' : 'bg-accent')}
                   style={{ transform: `scaleX(${(total > capacite ? 100 : remplissage) / 100})` }}/>
            </div>
          </div>

          {bac.length === 0 ? (
            <p className="mt-5 text-sm text-muted">
              Votre bac est vide. Ajoutez des poissons, des plantes ou des invertébrés depuis la liste.
            </p>
          ) : Object.entries(TYPES).map(([kind, { label, page }]) => {
            const especes = bac.filter((p) => p.kind === kind);
            return especes.length > 0 && (
              <div key={kind} className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
                <ul className="mt-1 divide-y divide-border/70">
                  {especes.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-2">
                      <div className="min-w-0 flex-1">
                        <Link href={`${page}/${p.ref}`} className={clsx('block truncate text-sm font-medium hover:underline',
                          severites[p.id] === 'error' && 'text-danger', severites[p.id] === 'warning' && 'text-warning')}>
                          {p.nom_commun}
                        </Link>
                        {kind !== 'plante' && (
                          <p className="text-xs text-muted">{p.quantite * p.points} point{p.quantite * p.points > 1 ? 's' : ''}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button type="button" className={iconButton} onClick={() => onChange(p, -1)}
                                aria-label={`Retirer un ${p.nom_commun}`}>
                          <Minus className="h-3.5 w-3.5"/>
                        </button>
                        <span className="w-6 text-center font-display text-sm tabular-nums">{p.quantite}</span>
                        <button type="button" className={iconButton} onClick={() => onChange(p, 1)}
                                aria-label={`Ajouter un ${p.nom_commun}`}>
                          <Plus className="h-3.5 w-3.5"/>
                        </button>
                        <button type="button" className={clsx(iconButton, 'hover:!text-danger')}
                                onClick={() => onChange(p, -p.quantite)} aria-label={`Supprimer ${p.nom_commun}`}>
                          <Trash2 className="h-3.5 w-3.5"/>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {bac.length > 0 && <Verdict verdict={verdict} issues={issues} ranges={ranges}/>}
      </aside>

      {/* Téléphone : état du bac toujours visible, qui mène au bac */}
      {bac.length > 0 && (
        <a href="#mon-bac" className="card fixed inset-x-4 bottom-4 z-30 flex items-center justify-between gap-3
                                      bg-surface/95 px-5 py-3 text-sm backdrop-blur lg:hidden">
          <span>Mon bac : {bac.length} espèce{bac.length > 1 ? 's' : ''}</span>
          <span className={clsx('font-medium', verdict === 'ok' ? 'text-success'
            : verdict === 'warning' ? 'text-warning' : 'text-danger')}>
            {VERDICT_COURT[verdict]}
          </span>
        </a>
      )}
    </>
  );
}

/**
 * Panier
 */

import { useState } from 'react';
import clsx from 'clsx';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { totalPoints } from '@/lib/compat';


export default function Panier ({ listePoissons, setListePoissons, severites = {}, litrage }) {
  // « Tout vider » demande une confirmation : le bac enregistré serait perdu
  const [confirmVider, setConfirmVider] = useState(false);

  const handleRemoveFromList = (poissonId) => {
    setListePoissons((prevSelection) =>
      prevSelection.filter((poisson) => poisson.id !== poissonId)
    );
  };

  const handleIncreaseQuantity = (poissonId) => {
    setListePoissons((prevSelection) =>
      prevSelection.map((poisson) => {
        if (poisson.id === poissonId) {
          return {
            ...poisson,
            quantite: poisson.quantite + 1,
          };
        }
        return poisson;
      })
    );
  };

  const handleDecreaseQuantity = (poissonId) => {
    setListePoissons((prevSelection) =>
      prevSelection.map((poisson) => {
        if (poisson.id === poissonId) {
          const newQuantite = poisson.quantite - 1;
          if (newQuantite <= 0) {
            // Supprime le poisson si la quantité atteint zéro
            return null;
          }
          return {
            ...poisson,
            quantite: newQuantite,
          };
        }
        return poisson;
      }).filter((poisson) => poisson !== null)
    );
  };

  const total = totalPoints(listePoissons);
  const capacite = Number(litrage) || 0;
  const remplissage = capacite ? Math.min(100, (total / capacite) * 100) : 0;

  const iconButton = 'inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-surface-elevated hover:text-foreground';

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Votre bac</h2>
        {listePoissons.length > 0 && (confirmVider ? (
          <span className="flex items-center gap-3 text-xs">
            <button type="button" onClick={() => { setListePoissons([]); setConfirmVider(false); }}
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

      {/* Charge du bac : points utilisés / litrage */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted">
          <span>Charge</span>
          <span className="tabular-nums">{capacite ? `${total} / ${capacite} points` : 'Indiquez le volume du bac'}</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className={clsx('h-full origin-left rounded-full transition-[transform,background-color] duration-500',
              total > capacite ? 'bg-danger' : remplissage > 80 ? 'bg-warning' : 'bg-accent')}
            style={{ transform: `scaleX(${(total > capacite ? 100 : remplissage) / 100})` }}
          />
        </div>
      </div>

      {listePoissons.length === 0 ? (
        <p className="mt-5 text-sm text-muted">Aucun poisson pour l&apos;instant. Ajoutez des espèces depuis la liste.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border/70">
          {listePoissons.map(p => (
            <li key={p.id} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className={clsx('truncate text-sm font-medium', severites[p.id] === 'error' && 'text-danger',
                  severites[p.id] === 'warning' && 'text-warning')}>
                  {p.nom_commun}
                </p>
                <p className="text-xs text-muted">{p.quantite * p.points} points</p>
              </div>
              <div className="flex items-center gap-0.5">
                <button type="button" className={iconButton} onClick={() => handleDecreaseQuantity(p.id)}
                        aria-label={`Retirer un ${p.nom_commun}`}>
                  <Minus className="h-3.5 w-3.5"/>
                </button>
                <span className="w-6 text-center font-display text-sm tabular-nums">{p.quantite}</span>
                <button type="button" className={iconButton} onClick={() => handleIncreaseQuantity(p.id)}
                        aria-label={`Ajouter un ${p.nom_commun}`}>
                  <Plus className="h-3.5 w-3.5"/>
                </button>
                <button type="button" className={clsx(iconButton, 'hover:!text-danger')}
                        onClick={() => handleRemoveFromList(p.id)} aria-label={`Supprimer ${p.nom_commun}`}>
                  <Trash2 className="h-3.5 w-3.5"/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

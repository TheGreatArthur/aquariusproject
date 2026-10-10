import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import { totalPoints, TYPES } from '@/lib/compat';
import Verdict from './verdict';

const iconButton = 'inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition '
  + 'hover:bg-surface-elevated hover:text-foreground';

const VERDICT_COURT = {
  ok: ['Compatible', 'Compatible', '相性良好'],
  warning: ['À surveiller', 'To watch', '要注意'],
  error: ['Incompatible', 'Incompatible', '相性不良'],
};

/**
 * Bac composé : verdict, charge, espèces par type avec leur nombre. Sur téléphone, une barre en bas de l'écran
 * rappelle son état et y mène.
 */
export default function Bac ({ bac, evaluation, litrage, onChange, onClear }) {
  // « Tout vider » demande une confirmation : le bac enregistré serait perdu
  const [confirmVider, setConfirmVider] = useState(false);
  const { t, href } = useI18n();
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
            <h2 id="bac-title" className="text-lg font-semibold">{t('Mon bac', 'My tank', 'マイ水槽')}</h2>
            {bac.length > 0 && (confirmVider ? (
              <span className="flex items-center gap-3 text-xs">
                <button type="button" onClick={() => { onClear(); setConfirmVider(false); }}
                        className="font-medium text-danger hover:underline">
                  {t('Confirmer', 'Confirm', '確定')}
                </button>
                <button type="button" onClick={() => setConfirmVider(false)} className="text-muted hover:text-foreground">
                  {t('Annuler', 'Cancel', 'キャンセル')}
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmVider(true)} className="text-xs text-muted hover:text-danger">
                {t('Tout vider', 'Empty the tank', '水槽を空にする')}
              </button>
            ))}
          </div>

          {/* Charge du bac : points des animaux / volume */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted">
              <span>{t('Charge', 'Stocking', '飼育密度')}</span>
              <span className="tabular-nums">{capacite ? `${total} / ${capacite} points` : t('Indiquez le volume du bac', 'Enter the tank volume', '水槽の容量を入力してください')}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-elevated">
              <div className={clsx('h-full origin-left rounded-full transition-[transform,background-color] duration-500',
                total > capacite ? 'bg-danger' : remplissage > 80 ? 'bg-warning' : 'bg-accent')}
                   style={{ transform: `scaleX(${(total > capacite ? 100 : remplissage) / 100})` }}/>
            </div>
          </div>

          {bac.length === 0 ? (
            <p className="mt-5 text-sm text-muted">
              {t('Votre bac est vide. Ajoutez des poissons, des plantes ou des invertébrés depuis la liste.',
                'Your tank is empty. Add fish, plants or invertebrates from the list.',
                '水槽はまだ空です。リストから魚、水草、無脊椎動物を追加してください。')}
            </p>
          ) : Object.entries(TYPES).map(([kind, { label, en, ja, page }]) => {
            const especes = bac.filter((p) => p.kind === kind);
            return especes.length > 0 && (
              <div key={kind} className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{t(label, en, ja)}</p>
                <ul className="mt-1 divide-y divide-border/70">
                  {especes.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-2">
                      <div className="min-w-0 flex-1">
                        <Link href={href(`${page}/${p.ref}`)} className={clsx('block truncate text-sm font-medium hover:underline',
                          severites[p.id] === 'error' && 'text-danger', severites[p.id] === 'warning' && 'text-warning')}>
                          {p.nom_commun}
                        </Link>
                        {kind !== 'plante' && (
                          <p className="text-xs text-muted">{p.quantite * p.points} point{p.quantite * p.points > 1 ? 's' : ''}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button type="button" className={iconButton} onClick={() => onChange(p, -1)}
                                aria-label={t(`Retirer un ${p.nom_commun}`, `Remove one ${p.nom_commun}`, `${p.nom_commun}を1匹減らす`)}>
                          <Minus className="h-3.5 w-3.5"/>
                        </button>
                        <span className="w-6 text-center font-display text-sm tabular-nums">{p.quantite}</span>
                        <button type="button" className={iconButton} onClick={() => onChange(p, 1)}
                                aria-label={t(`Ajouter un ${p.nom_commun}`, `Add one ${p.nom_commun}`, `${p.nom_commun}を1匹増やす`)}>
                          <Plus className="h-3.5 w-3.5"/>
                        </button>
                        <button type="button" className={clsx(iconButton, 'hover:!text-danger')}
                                onClick={() => onChange(p, -p.quantite)} aria-label={t(`Supprimer ${p.nom_commun}`, `Delete ${p.nom_commun}`, `${p.nom_commun}を削除`)}>
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
          <span>{t('Mon bac :', 'My tank:', 'マイ水槽：')} {bac.length} {t(`espèce${bac.length > 1 ? 's' : ''}`, 'species', '種')}</span>
          <span className={clsx('font-medium', verdict === 'ok' ? 'text-success'
            : verdict === 'warning' ? 'text-warning' : 'text-danger')}>
            {t(...VERDICT_COURT[verdict])}
          </span>
        </a>
      )}
    </>
  );
}

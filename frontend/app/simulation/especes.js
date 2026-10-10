import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { AlertOctagon, AlertTriangle, Plus, Search } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import { useI18n } from '@/components/I18nProvider';
import { issuesIfAdded, TYPES } from '@/lib/compat';
import { formatRange } from '@/lib/compat/utils';
import { votreEau } from '@/lib/compat/rules/eau';
import { fishImage, matchesSearch } from '@/lib/fish';
import { GROUPS, GROUPS_EN, invertebrateImage } from '@/lib/invertebrates';
import { lightLabel, plantImage, TYPES as PORTS } from '@/lib/plants';

const PAR_PAGE = 24;

const PREVIEW = {
  error: { icon: AlertOctagon, label: 'Incompatible avec votre bac', en: 'Incompatible with your tank', text: 'text-danger', border: '!border-danger/50' },
  warning: { icon: AlertTriangle, label: 'À surveiller', en: 'To watch', text: 'text-warning', border: '!border-warning/40' },
};

const IMAGES = {
  poisson: (p) => fishImage({ ...p, id: p.ref }),
  plante: plantImage,
  invertebre: invertebrateImage,
};


/** Catégorie affichée sous le nom, et quatre repères adaptés au type d'espèce */
function reperes (p, { t, term, locale }) {
  const plage = (min, max, unit) => formatRange(min, max, unit, locale);
  if (p.kind === 'plante')
    return [`${t(PORTS[p.type]?.label, PORTS[p.type]?.en)} · ${p.famille}`, [
      [t('Lumière', 'Light'), lightLabel(p.lumiere_mini, p.lumiere_maxi, locale)], ['pH', plage(p.ph_mini, p.ph_maxi)],
      ['Temp.', plage(p.temp_mini, p.temp_maxi, '°')], ['CO₂', term(p.co2) ?? '–'],
    ]];
  return [p.kind === 'invertebre' ? `${t(GROUPS[p.groupe], GROUPS_EN[p.groupe])} · ${p.famille}` : p.nom_famille, [
    ['Volume', `${p.litrage_mini}\u00a0L`], ['pH', plage(p.ph_mini, p.ph_maxi)],
    ['GH', plage(p.gh_mini, p.gh_maxi)], ['Temp.', plage(p.temp_mini, p.temp_maxi, '°')],
  ]];
}

/**
 * Catalogue du simulateur : un onglet par type d'espèce, une recherche, les espèces adaptées au bac d'abord.
 * Chaque carte annonce ce que son ajout déclencherait.
 */
export default function Especes ({ catalogue, bac, environnement, onAdd }) {
  const i18n = useI18n();
  const { t, href, locale } = i18n;
  const [kind, setKind] = useState('poisson');
  const [terme, setTerme] = useState('');
  const [tout, setTout] = useState(false);
  const [limite, setLimite] = useState({ cle: '', n: PAR_PAGE });

  const adaptee = (p) => !votreEau([p], environnement).length;
  const especes = (catalogue[kind] ?? [])
    .filter((p) => matchesSearch(p, terme) && (tout || adaptee(p)))
    .sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, locale, { sensitivity: 'base' }));
  // Une nouvelle recherche repart des premières cartes
  const cle = `${kind}|${terme}|${tout}`;
  const n = limite.cle === cle ? limite.n : PAR_PAGE;
  const quantite = (p) => bac.find((x) => x.id === p.id)?.quantite ?? 0;

  return (
    <section aria-labelledby="catalogue-title">
      <h2 id="catalogue-title" className="sr-only">{t('Espèces à ajouter', 'Species to add')}</h2>
      <div role="tablist" aria-label={t('Type d\'espèce', 'Kind of species')} className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(TYPES).map(([k, { label, en }]) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}
                  className={clsx('chip shrink-0 !px-4 !py-2 !text-sm', kind === k && 'chip-active')}>
            {t(label, en)}
            <span className="ml-2 tabular-nums opacity-70">
              {(catalogue[k] ?? []).filter((p) => tout || adaptee(p)).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">{t('Rechercher une espèce', 'Search for a species')}</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/>
          <input type="search" className="input !rounded-full !pl-11" name="recherche" placeholder={t('Néon, Anubias, Neritidae…', 'Neon, Anubias, Neritidae…')}
                 value={terme} onChange={(e) => setTerme(e.target.value)}/>
        </label>
        <label className="flex shrink-0 items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="h-4 w-4 accent-accent" checked={tout} onChange={(e) => setTout(e.target.checked)}/>
          {t('Afficher aussi les espèces inadaptées', 'Also show unsuitable species')}
        </label>
      </div>

      {!catalogue[kind] ? (
        <ul className="mt-5 space-y-3" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => <li key={i} className="card h-24 animate-pulse bg-surface-elevated/60"/>)}
        </ul>
      ) : especes.length === 0 ? (
        <div className="card mt-5 p-10 text-center">
          <p className="font-display text-lg">{t('Aucune espèce ne correspond', 'No matching species')}</p>
          <p className="mt-2 text-sm text-muted">
            {terme ? t('Essayez un autre nom.', 'Try another name.')
              : t('Élargissez les valeurs de votre bac, ou affichez aussi les espèces inadaptées.',
                'Widen your tank values, or also show unsuitable species.')}
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {especes.slice(0, n).map((p) => {
            const [categorie, faits] = reperes(p, i18n);
            const hors = votreEau([p], environnement)[0];
            const { severity, messages } = issuesIfAdded(bac, p, environnement);
            const preview = PREVIEW[hors ? 'error' : severity];
            const alerte = hors ? [hors.message] : messages;
            return (
              <li key={p.id} className={clsx('card p-3 [contain-intrinsic-size:auto_6rem] [content-visibility:auto]',
                preview?.border)}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                      <Image src={IMAGES[p.kind](p)} alt="" fill sizes="80px" className="object-cover"/>
                    </div>
                    <div className="min-w-0">
                      <Link href={href(`${TYPES[p.kind].page}/${p.ref}`)} className="font-medium hover:text-accent-glow">
                        {p.nom_commun}
                      </Link>
                      <p className="truncate text-xs text-muted">{categorie}</p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-4 gap-3 text-xs sm:w-[21rem]">
                    {faits.map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <dt className="text-muted">{label}</dt>
                        <dd className="truncate font-medium tabular-nums first-letter:uppercase">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <BehaviourBadge comportement={p.nom_comportement} className="hidden xl:inline-block"/>
                    <button type="button" className="btn-ghost !px-3.5 !py-1.5" onClick={() => onAdd(p)}
                            aria-label={t(`Ajouter ${p.nom_commun} au bac`, `Add ${p.nom_commun} to the tank`)}>
                      <Plus className="h-4 w-4"/> {t('Ajouter', 'Add')}
                      {quantite(p) > 0 && (
                        <span className="rounded-full bg-accent px-1.5 text-xs font-semibold text-background">{quantite(p)}</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Risque de l'ajout, sur toute la largeur pour ne pas étirer la carte */}
                {preview && (
                  <p className={clsx('mt-3 flex items-start gap-1.5 border-t border-border/60 pt-2.5 text-xs', preview.text)}>
                    <preview.icon className="mt-px h-3.5 w-3.5 shrink-0"/>
                    <span>
                      <span className="font-medium">{t(`${preview.label}\u00a0:`, `${preview.en}:`)}</span> {alerte[0]}
                      {alerte.length > 1 && <span className="text-muted">
                        {' '}(+{alerte.length - 1} {t(`autre${alerte.length > 2 ? 's' : ''}`, 'more')})
                      </span>}
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {especes.length > n && (
        <button type="button" className="btn-ghost mx-auto mt-6 flex" onClick={() => setLimite({ cle, n: n + PAR_PAGE })}>
          {t(`Afficher ${Math.min(PAR_PAGE, especes.length - n)} espèces de plus`,
            `Show ${Math.min(PAR_PAGE, especes.length - n)} more species`)}
        </button>
      )}
    </section>
  );
}

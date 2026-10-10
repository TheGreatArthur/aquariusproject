'use client';

import { useState } from 'react';
import { BookOpen, ExternalLink, MapPinned, Waves } from 'lucide-react';

import RangeMap, { useWorld } from '@/components/fish/RangeMap';
import { useI18n } from '@/components/I18nProvider';
import Prose, { Italics } from '@/components/Prose';
import Reveal from '@/components/Reveal';

// Catégories de la Liste rouge UICN
const UICN = {
  LC: { label: 'Préoccupation mineure', en: 'Least concern', tone: 'border-success/30 bg-success/10 text-success' },
  NT: { label: 'Quasi menacé', en: 'Near threatened', tone: 'border-warning/30 bg-warning/10 text-warning' },
  VU: { label: 'Vulnérable', en: 'Vulnerable', tone: 'border-warning/30 bg-warning/10 text-warning' },
  EN: { label: 'En danger', en: 'Endangered', tone: 'border-danger/30 bg-danger/10 text-danger' },
  CR: { label: 'En danger critique', en: 'Critically endangered', tone: 'border-danger/30 bg-danger/10 text-danger' },
  EW: { label: 'Éteint à l\'état sauvage', en: 'Extinct in the wild', tone: 'border-danger/30 bg-danger/10 text-danger' },
  EX: { label: 'Éteint', en: 'Extinct', tone: 'border-danger/30 bg-danger/10 text-danger' },
  DD: { label: 'Données insuffisantes', en: 'Data deficient', tone: 'border-border bg-surface text-muted' },
  NE: { label: 'Non évalué', en: 'Not evaluated', tone: 'border-border bg-surface text-muted' },
};

export function Block ({ icon: Icon, title, id, children, className = '' }) {
  return (
    <section aria-labelledby={id} className={`card p-6 sm:p-8 ${className}`}>
      <h3 id={id} className="flex items-center gap-2.5 text-lg font-semibold">
        <Icon className="h-5 w-5 text-accent"/> {title}
      </h3>
      {children}
    </section>
  );
}

export function Fact ({ label, children }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

/**
 * Noms des pays, par ordre alphabétique ; au-delà de `limit` (espèces presque cosmopolites), la liste se déplie
 */
export function Countries ({ codes, label, limit = 24, className = 'mt-4', chipClassName = '' }) {
  const { t, locale } = useI18n();
  const world = useWorld();
  const [open, setOpen] = useState(false);
  if (!world || !codes?.length)
    return null;
  const names = codes
    .map((code) => world.pays.find((f) => f.properties.iso === code)?.properties)
    .map((p, i) => (p ? t(p.nom, p.name) : codes[i]))
    .sort((a, b) => a.localeCompare(b, locale));
  const shown = open ? names : names.slice(0, limit);
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={label ?? t('Pays d\'origine', 'Native countries')}>
      {shown.map((nom) => <li key={nom} className={`chip ${chipClassName}`}>{nom}</li>)}
      {names.length > shown.length && (
        <li>
          <button type="button" className="chip hover:text-foreground" onClick={() => setOpen(true)}>
            + {names.length - shown.length} {t('autres', 'more')}
          </button>
        </li>
      )}
    </ul>
  );
}

/** Légende de la carte de répartition */
function RangeLegend ({ points, introduits = [] }) {
  const { t } = useI18n();
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
      {points.length > 0 && (
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-glow"/> {t('Observations (GBIF) et localités', 'Observations (GBIF) and localities')}
        </span>
      )}
      <span className="inline-flex items-center gap-2">
        <span className="h-2.5 w-3.5 rounded-sm border border-accent-glow/50 bg-accent/15"/> {t('Pays d\'origine', 'Native countries')}
      </span>
      {introduits.length > 0 && (
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-3.5 rounded-sm border border-warning/50 bg-warning/15"/> {t('Pays d\'introduction', 'Introduced in')}
        </span>
      )}
      <span className="inline-flex items-center gap-2">
        <span className="h-0.5 w-4 rounded bg-[#3b8fc2]"/> {t('Fleuves et lacs', 'Rivers and lakes')}
      </span>
    </p>
  );
}

/** Liens vers les sources de la fiche et crédit du fond de carte */
export function ProfileSources ({ sources }) {
  const { t } = useI18n();
  return (
    <Reveal>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        <span>{t('Sources :', 'Sources:')}</span>
        {sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1 underline-offset-4 hover:text-accent-glow hover:underline">
            {s.nom} <ExternalLink className="h-3 w-3"/>
          </a>
        ))}
        <span>· {t('Fond de carte : Natural Earth', 'Base map: Natural Earth')}</span>
      </p>
    </Reveal>
  );
}

/**
 * Fiche descriptive d'un poisson, ou d'un invertébré ou d'une plante qui ont les mêmes champs : présentation
 * scientifique, habitat naturel avec carte, comportement, puis les sources (`withSources={false}` quand la page les
 * place plus bas). `habitatAside` remplace le texte d'habitat et la liste des pays à droite de la carte (plantes) ;
 * sans `comportement`, le bloc n'est pas affiché.
 */
export default function FishProfile ({ profil, nomScientifique, withSources = true, habitatAside = null }) {
  const { t, locale } = useI18n();
  if (!profil)
    return null;

  const uicn = UICN[profil.uicn];

  return (
    <section className="mt-24" aria-labelledby="fiche-title">
      <Reveal>
        <h2 id="fiche-title" className="text-3xl font-semibold sm:text-4xl">
          {t('Dans la nature', 'In the wild')}
        </h2>
        {locale === 'en' && (
          <p className="mt-3 text-sm text-muted">The species descriptions below are written in French.</p>
        )}
      </Reveal>

      <div className="mt-10 grid gap-6">
        <Reveal>
          <Block icon={BookOpen} title={t('Présentation', 'Overview')} id="presentation-title">
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={profil.presentation}/>
              </div>
              <dl className="grid content-start gap-5 rounded-xl border border-border/70 bg-background/40 p-5">
                <Fact label={t('Nom scientifique', 'Scientific name')}>
                  <i>{profil.nom_valide ?? nomScientifique}</i> {profil.auteur}
                  {profil.nom_valide && (
                    <span className="mt-1 block text-xs text-muted">
                      {t('Nom valide actuel ; en aquariophilie :', 'Current valid name; in the hobby:')} <i>{nomScientifique}</i>
                    </span>
                  )}
                </Fact>
                {profil.classification && <Fact label={t('Classification', 'Classification')}>{profil.classification}</Fact>}
                {uicn && (
                  <Fact label={t('Liste rouge UICN', 'IUCN Red List')}>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${uicn.tone}`}>
                      {t(uicn.label, uicn.en)} ({profil.uicn})
                    </span>
                  </Fact>
                )}
              </dl>
            </div>
          </Block>
        </Reveal>

        <Reveal>
          <Block icon={MapPinned} title={t('Habitat naturel', 'Natural habitat')} id="habitat-title">
            <p className="mt-2 text-sm text-accent-glow"><Italics text={profil.repartition}/></p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
              <div>
                {profil.pays.length > 0 ? (
                  <>
                    <RangeMap points={profil.points} pays={profil.pays} introduits={profil.introduits}
                              label={t('Carte de répartition : ', 'Range map: ') + profil.repartition.replaceAll('*', '')}/>
                    <RangeLegend points={profil.points} introduits={profil.introduits}/>
                    {!habitatAside && <Countries codes={profil.pays}/>}
                  </>
                ) : (
                  <div className="grid aspect-[720/440] place-items-center rounded-xl border border-dashed border-border
                                  p-6 text-center text-sm text-muted">
                    {t('Pas d\'aire de répartition naturelle connue.', 'No known natural range.')}
                  </div>
                )}
              </div>
              {habitatAside ?? (
                <div className="space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                  <Prose text={profil.habitat}/>
                </div>
              )}
            </div>
          </Block>
        </Reveal>

        {profil.comportement && (
          <Reveal>
            <Block icon={Waves} title={t('Comportement', 'Behaviour')} id="comportement-title">
              <div className="mt-5 max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={profil.comportement}/>
              </div>
            </Block>
          </Reveal>
        )}

        {withSources && <ProfileSources sources={profil.sources}/>}
      </div>
    </section>
  );
}

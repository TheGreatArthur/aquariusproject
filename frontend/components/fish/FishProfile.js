'use client';

import { BookOpen, ExternalLink, MapPinned, Waves } from 'lucide-react';

import RangeMap, { useWorld } from '@/components/fish/RangeMap';
import Reveal from '@/components/Reveal';

// Catégories de la Liste rouge UICN
const UICN = {
  LC: { label: 'Préoccupation mineure', tone: 'border-success/30 bg-success/10 text-success' },
  NT: { label: 'Quasi menacé', tone: 'border-warning/30 bg-warning/10 text-warning' },
  VU: { label: 'Vulnérable', tone: 'border-warning/30 bg-warning/10 text-warning' },
  EN: { label: 'En danger', tone: 'border-danger/30 bg-danger/10 text-danger' },
  CR: { label: 'En danger critique', tone: 'border-danger/30 bg-danger/10 text-danger' },
  EW: { label: 'Éteint à l\'état sauvage', tone: 'border-danger/30 bg-danger/10 text-danger' },
  EX: { label: 'Éteint', tone: 'border-danger/30 bg-danger/10 text-danger' },
  DD: { label: 'Données insuffisantes', tone: 'border-border bg-surface text-muted' },
  NE: { label: 'Non évalué', tone: 'border-border bg-surface text-muted' },
};

/** Texte en paragraphes (séparés par une ligne vide), noms scientifiques entre *astérisques* en italique */
function Prose ({ text }) {
  return text.split(/\n\s*\n/).map((paragraph, i) => (
    <p key={i}>
      {paragraph.split(/\*([^*]+)\*/g).map((part, j) => (j % 2 ? <i key={j}>{part}</i> : part))}
    </p>
  ));
}

function Block ({ icon: Icon, title, id, children, className = '' }) {
  return (
    <section aria-labelledby={id} className={`card p-6 sm:p-8 ${className}`}>
      <h3 id={id} className="flex items-center gap-2.5 text-lg font-semibold">
        <Icon className="h-5 w-5 text-accent"/> {title}
      </h3>
      {children}
    </section>
  );
}

function Fact ({ label, children }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

function Countries ({ codes }) {
  const world = useWorld();
  if (!world || !codes.length)
    return null;
  const names = codes
    .map((code) => world.pays.find((f) => f.properties.iso === code)?.properties.nom ?? code)
    .sort((a, b) => a.localeCompare(b, 'fr'));
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Pays d'origine">
      {names.map((nom) => <li key={nom} className="chip">{nom}</li>)}
    </ul>
  );
}

/**
 * Fiche descriptive d'un poisson : présentation scientifique, habitat naturel avec carte, comportement, sources
 */
export default function FishProfile ({ profil, nomScientifique }) {
  if (!profil)
    return null;

  const uicn = UICN[profil.uicn];

  return (
    <section className="mt-24" aria-labelledby="fiche-title">
      <Reveal>
        <h2 id="fiche-title" className="text-3xl font-semibold sm:text-4xl">
          Dans la nature
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6">
        <Reveal>
          <Block icon={BookOpen} title="Présentation" id="presentation-title">
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={profil.presentation}/>
              </div>
              <dl className="grid content-start gap-5 rounded-xl border border-border/70 bg-background/40 p-5">
                <Fact label="Nom scientifique">
                  <i>{profil.nom_valide ?? nomScientifique}</i> {profil.auteur}
                  {profil.nom_valide && (
                    <span className="mt-1 block text-xs text-muted">
                      Nom valide actuel ; en aquariophilie : <i>{nomScientifique}</i>
                    </span>
                  )}
                </Fact>
                {profil.classification && <Fact label="Classification">{profil.classification}</Fact>}
                {uicn && (
                  <Fact label="Liste rouge UICN">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${uicn.tone}`}>
                      {uicn.label} ({profil.uicn})
                    </span>
                  </Fact>
                )}
              </dl>
            </div>
          </Block>
        </Reveal>

        <Reveal>
          <Block icon={MapPinned} title="Habitat naturel" id="habitat-title">
            <p className="mt-2 text-sm text-accent-glow">{profil.repartition}</p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
              <div>
                {profil.pays.length > 0 ? (
                  <>
                    <RangeMap points={profil.points} pays={profil.pays}
                              label={`Carte de répartition : ${profil.repartition}`}/>
                    <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
                      {profil.points.length > 0 && (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-accent-glow"/> Observations (GBIF) et localités
                        </span>
                      )}
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-3.5 rounded-sm border border-accent-glow/50 bg-accent/15"/> Pays d&apos;origine
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-4 rounded bg-[#3b8fc2]"/> Fleuves et lacs
                      </span>
                    </p>
                    <Countries codes={profil.pays}/>
                  </>
                ) : (
                  <div className="grid aspect-[720/440] place-items-center rounded-xl border border-dashed border-border
                                  p-6 text-center text-sm text-muted">
                    Pas d&apos;aire de répartition naturelle connue.
                  </div>
                )}
              </div>
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={profil.habitat}/>
              </div>
            </div>
          </Block>
        </Reveal>

        <Reveal>
          <Block icon={Waves} title="Comportement" id="comportement-title">
            <div className="mt-5 max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
              <Prose text={profil.comportement}/>
            </div>
          </Block>
        </Reveal>

        <Reveal>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span>Sources :</span>
            {profil.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 underline-offset-4 hover:text-accent-glow hover:underline">
                {s.nom} <ExternalLink className="h-3 w-3"/>
              </a>
            ))}
            <span>· Fond de carte : Natural Earth</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

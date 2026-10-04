import { BookOpen, ExternalLink, Sprout } from 'lucide-react';

import Prose from '@/components/Prose';
import Reveal from '@/components/Reveal';
import { typo } from '@/lib/cours/texte';

function Block ({ icon: Icon, title, id, children }) {
  return (
    <section aria-labelledby={id} className="card p-6 sm:p-8">
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

const linkClass = 'inline-flex items-center gap-1 underline-offset-4 hover:text-accent-glow hover:underline';

/**
 * Fiche descriptive d'une plante : présentation, culture, sources et crédits des photos
 */
export default function PlantProfile ({ plante: p }) {
  return (
    <section className="mt-24" aria-labelledby="fiche-title">
      <Reveal>
        <h2 id="fiche-title" className="text-3xl font-semibold sm:text-4xl">Connaître et cultiver</h2>
      </Reveal>

      <div className="mt-10 grid gap-6">
        <Reveal>
          <Block icon={BookOpen} title="Présentation" id="presentation-title">
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={typo(p.presentation)}/>
              </div>
              <dl className="grid content-start gap-5 rounded-xl border border-border/70 bg-background/40 p-5">
                <Fact label="Nom scientifique">
                  <i>{p.nom_scientifique}</i> {p.auteur}
                  {p.nom_valide && (
                    <span className="mt-1 block text-xs text-muted">
                      Nom valide actuel selon GBIF : <i>{p.nom_valide}</i>
                    </span>
                  )}
                </Fact>
                <Fact label="Classification">{p.ordre ? `${p.ordre} › ${p.famille}` : p.famille}</Fact>
                <Fact label="Origine">{typo(p.origine).split(/\*([^*]+)\*/g).map((part, i) => (i % 2 ? <i key={i}>{part}</i> : part))}</Fact>
              </dl>
            </div>
          </Block>
        </Reveal>

        <Reveal>
          <Block icon={Sprout} title="Culture en aquarium" id="culture-title">
            <div className="mt-5 max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
              <Prose text={typo(p.culture)}/>
            </div>
          </Block>
        </Reveal>

        <Reveal>
          <div className="space-y-2 text-xs text-muted">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span>Sources&nbsp;:</span>
              {p.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {s.nom} <ExternalLink className="h-3 w-3"/>
                </a>
              ))}
            </p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span>Photos (Wikimedia Commons)&nbsp;:</span>
              {p.images.map((image) => (
                <span key={image.fichier}>
                  <a href={image.source} target="_blank" rel="noopener noreferrer" className={linkClass}>{image.auteur}</a>
                  {' '}({image.licence_url ? (
                    <a href={image.licence_url} target="_blank" rel="noopener noreferrer license" className={linkClass}>
                      {image.licence}
                    </a>
                  ) : image.licence})
                </span>
              ))}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

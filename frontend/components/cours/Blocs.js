import clsx from 'clsx';
import { AlertTriangle, ArrowDown, ArrowRight, Info, Lightbulb, ShieldAlert } from 'lucide-react';

import { SCHEMAS } from '@/components/cours/schemas';
import Texte from '@/components/cours/Texte';

const TONS = {
  info: { icon: Info, classes: 'border-accent/30 bg-accent/5', titre: 'text-accent-glow' },
  astuce: { icon: Lightbulb, classes: 'border-success/30 bg-success/5', titre: 'text-success' },
  attention: { icon: AlertTriangle, classes: 'border-warning/30 bg-warning/5', titre: 'text-warning' },
  danger: { icon: ShieldAlert, classes: 'border-danger/30 bg-danger/5', titre: 'text-danger' },
};

// Couleur d'une étape de flux : toxicité, filtration...
const TONS_ETAPE = {
  danger: 'border-t-danger',
  attention: 'border-t-warning',
  ok: 'border-t-success',
  neutre: 'border-t-accent',
};

function Encadre ({ ton = 'info', titre, texte, items }) {
  const { icon: Icon, classes, titre: couleurTitre } = TONS[ton];
  return (
    <aside className={clsx('rounded-2xl border p-5', classes)}>
      <p className={clsx('flex items-center gap-2 font-display font-semibold', couleurTitre)}>
        <Icon className="h-4 w-4 shrink-0"/> <Texte>{titre}</Texte>
      </p>
      {texte && <p className="mt-2 text-[0.95rem] text-foreground/85"><Texte>{texte}</Texte></p>}
      {items && <Liste items={items} className="mt-2"/>}
    </aside>
  );
}

function Liste ({ items, className }) {
  return (
    <ul className={clsx('space-y-2', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"/>
          <span><Texte>{item}</Texte></span>
        </li>
      ))}
    </ul>
  );
}

function Etapes ({ items }) {
  return (
    <ol className="space-y-4">
      {items.map(({ titre, texte }, i) => (
        <li key={i} className="flex gap-4">
          <span aria-hidden="true"
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/40 font-display text-sm font-semibold tabular-nums text-accent-glow">
            {i + 1}
          </span>
          <div>
            <p className="font-medium text-foreground"><Texte>{titre}</Texte></p>
            {texte && <p className="mt-1 text-[0.95rem] text-foreground/80"><Texte>{texte}</Texte></p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Enchaînement d'étapes reliées par des flèches : horizontal sur grand écran, vertical sur mobile */
function Flux ({ items }) {
  return (
    <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-stretch">
      {items.map(({ titre, sousTitre, texte, ton = 'neutre' }, i) => (
        <li key={i} className="flex flex-col items-center gap-2 md:flex-1 md:flex-row">
          <div className={clsx('card h-full w-full border-t-4 p-4', TONS_ETAPE[ton])}>
            <p className="font-display font-semibold leading-snug"><Texte>{titre}</Texte></p>
            {sousTitre && <p className="mt-0.5 text-xs text-muted"><Texte>{sousTitre}</Texte></p>}
            {texte && <p className="mt-2 text-sm text-foreground/80"><Texte>{texte}</Texte></p>}
          </div>
          {i < items.length - 1 && (
            <>
              <ArrowDown aria-hidden="true" className="h-5 w-5 shrink-0 text-accent md:hidden"/>
              <ArrowRight aria-hidden="true" className="hidden h-5 w-5 shrink-0 text-accent md:block"/>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Colonnes de listes (calendrier d'entretien, comparatifs) */
function Colonnes ({ colonnes }) {
  return (
    <div className={clsx('grid gap-4', colonnes.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2')}>
      {colonnes.map(({ titre, items }) => (
        <div key={titre} className="card p-5">
          <p className="font-display font-semibold text-accent-glow"><Texte>{titre}</Texte></p>
          <Liste items={items} className="mt-3 text-sm"/>
        </div>
      ))}
    </div>
  );
}

function Tableau ({ colonnes, lignes }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead className="bg-surface-elevated/70">
          <tr>
            {colonnes.map((c) => (
              <th key={c} scope="col" className="px-4 py-3 font-display font-semibold text-foreground"><Texte>{c}</Texte></th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {lignes.map((ligne, i) => (
            <tr key={i} className="align-top">
              {ligne.map((cellule, j) => (
                <td key={j} className={clsx('px-4 py-3 tabular-nums', j === 0 ? 'font-medium text-foreground' : 'text-foreground/80')}>
                  <Texte>{cellule}</Texte>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Figure ({ schema, legende, props }) {
  const Schema = SCHEMAS[schema];
  return (
    <figure className="space-y-3">
      <Schema {...props}/>
      {legende && <figcaption className="text-sm text-muted"><Texte>{legende}</Texte></figcaption>}
    </figure>
  );
}

/** Rendu d'un bloc de contenu de cours */
export default function Bloc ({ bloc }) {
  switch (bloc.type) {
    case 'p':
      return <p className="text-foreground/85"><Texte>{bloc.texte}</Texte></p>;
    case 'liste':
      return <Liste items={bloc.items} className="text-foreground/85"/>;
    case 'etapes':
      return <Etapes items={bloc.items}/>;
    case 'flux':
      return <figure className="space-y-3"><Flux items={bloc.items}/>{bloc.legende && <figcaption className="text-sm text-muted"><Texte>{bloc.legende}</Texte></figcaption>}</figure>;
    case 'colonnes':
      return <Colonnes colonnes={bloc.colonnes}/>;
    case 'tableau':
      return <figure className="space-y-3"><Tableau colonnes={bloc.colonnes} lignes={bloc.lignes}/>{bloc.legende && <figcaption className="text-sm text-muted"><Texte>{bloc.legende}</Texte></figcaption>}</figure>;
    case 'encadre':
      return <Encadre {...bloc}/>;
    case 'figure':
      return <Figure {...bloc}/>;
    default:
      throw new Error(`Bloc de cours inconnu : ${bloc.type}`);
  }
}

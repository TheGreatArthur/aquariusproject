import { arrondi, degreFrancaisVersDgh } from '@/lib/cours/chimie';

const MAX_F = 45;
const pos = (f) => `${(Math.min(f, MAX_F) / MAX_F) * 100}%`;
const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

// Classes de dureté en degrés français (TH), d'après Wikipédia « Dureté de l'eau »
const CLASSES = [
  { de: 0, a: 7, nom: 'Très douce', classe: 'bg-accent/80' },
  { de: 7, a: 15, nom: 'Douce', classe: 'bg-accent/50' },
  { de: 15, a: 30, nom: 'Plutôt dure', classe: 'bg-warning/40' },
  { de: 30, a: 40, nom: 'Dure', classe: 'bg-warning/70' },
  { de: 40, a: MAX_F, nom: 'Très dure', classe: 'bg-danger/60' },
];

/** Échelle de dureté : degrés français (analyses d'eau en France) et degrés allemands (aquariophilie) */
export default function EchelleDurete () {
  return (
    <div className="card p-4 sm:p-6">
      <p className="text-xs text-muted">°dGH (tests d&apos;aquariophilie, fiches Aquarius)</p>
      <div className="relative mt-1 h-5 text-[0.72rem] tabular-nums text-foreground/80" aria-hidden="true">
        {[0, 5, 10, 15, 20, 25].map((dgh) => (
          <span key={dgh} className="absolute -translate-x-1/2" style={{ left: pos(dgh * 1.7848) }}>{dgh}</span>
        ))}
      </div>
      <div className="flex h-8 overflow-hidden rounded-lg" role="img"
           aria-label="Échelle de dureté de 0 à 45 degrés français : très douce jusqu'à 7, douce jusqu'à 15, plutôt dure jusqu'à 30, dure jusqu'à 40, très dure au-delà">
        {CLASSES.map((c) => (
          <span key={c.nom} className={c.classe} style={{ width: `${((c.a - c.de) / MAX_F) * 100}%` }}/>
        ))}
      </div>
      <div className="relative mt-1 h-5 text-[0.72rem] tabular-nums text-foreground/80" aria-hidden="true">
        {[0, 10, 20, 30, 40].map((f) => (
          <span key={f} className="absolute -translate-x-1/2" style={{ left: pos(f) }}>{f}</span>
        ))}
      </div>
      <p className="text-xs text-muted">°f (TH de votre facture ou de l&apos;analyse de votre commune)</p>

      <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {CLASSES.map((c) => (
          <li key={c.nom} className="flex items-start gap-2.5">
            <span aria-hidden="true" className={`mt-1 h-3 w-3 shrink-0 rounded-sm ${c.classe}`}/>
            <span className="font-medium">{c.nom}</span>
            <span className="ml-auto whitespace-nowrap tabular-nums text-muted sm:ml-0">
              {c.a === MAX_F
                ? <>plus de {c.de}&nbsp;°f (≈&nbsp;{nombre.format(arrondi(degreFrancaisVersDgh(c.de)))}&nbsp;°dGH)</>
                : <>{c.de}-{c.a}&nbsp;°f (≈&nbsp;{nombre.format(arrondi(degreFrancaisVersDgh(c.de)))}-{nombre.format(arrondi(degreFrancaisVersDgh(c.a)))}&nbsp;°dGH)</>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

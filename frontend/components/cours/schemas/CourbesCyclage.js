/**
 * Allure typique de l'ammoniaque, des nitrites et des nitrates pendant le démarrage d'un bac.
 * Courbes indicatives (pas de mesures) : la durée réelle varie de 2 à 8 semaines.
 */

const L = 640;
const H = 280;
const M = { gauche: 40, droite: 36, haut: 16, bas: 44 };
const JOURS = 42;

const x = (jour) => M.gauche + (jour / JOURS) * (L - M.gauche - M.droite);
const y = (v) => H - M.bas - v * (H - M.haut - M.bas);

const COURBES = [
  {
    nom: 'Ammoniaque',
    couleur: 'stroke-danger',
    pastille: 'bg-danger',
    f: (t) => (t < 9 ? (t / 9) ** 1.4 : Math.exp(-(((t - 9) / 6) ** 2))),
  },
  {
    nom: 'Nitrites',
    couleur: 'stroke-warning',
    pastille: 'bg-warning',
    f: (t) => 0.92 * Math.exp(-(((t - 23) / 7.5) ** 2)) * Math.min(1, t / 8),
  },
  {
    nom: 'Nitrates',
    couleur: 'stroke-accent',
    pastille: 'bg-accent',
    f: (t) => 0.8 / (1 + Math.exp(-(t - 27) / 4.5)) - 0.8 / (1 + Math.exp(27 / 4.5)),
  },
];

const chemin = (f) => Array.from({ length: JOURS * 2 + 1 }, (_, i) => i / 2)
  .map((t, i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(f(t)).toFixed(1)}`).join(' ');

export default function CourbesCyclage () {
  return (
    <div className="card p-4 sm:p-6">
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {COURBES.map(({ nom, pastille }) => (
          <li key={nom} className="flex items-center gap-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${pastille}`}/>{nom}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${L} ${H}`} className="mt-3 w-full" role="img"
           aria-label="L'ammoniaque monte puis disparaît vers la troisième semaine, les nitrites culminent vers la quatrième semaine puis disparaissent, les nitrates s'accumulent.">
        {/* Grille : une ligne par semaine */}
        {Array.from({ length: 7 }, (_, s) => (
          <g key={s}>
            <line x1={x(s * 7)} x2={x(s * 7)} y1={M.haut} y2={H - M.bas} className="stroke-border" strokeDasharray="3 5"/>
            {s > 0 && (
              <text x={x(s * 7)} y={H - M.bas + 22} textAnchor="middle" className="fill-muted text-[15px]">
                sem. {s}
              </text>
            )}
          </g>
        ))}
        <line x1={M.gauche} x2={L - M.droite} y1={H - M.bas} y2={H - M.bas} className="stroke-muted/50"/>
        <line x1={M.gauche} x2={M.gauche} y1={M.haut} y2={H - M.bas} className="stroke-muted/50"/>
        <text x={M.gauche + 8} y={M.haut + 12} className="fill-muted text-[14px]">concentration</text>
        {COURBES.map(({ nom, couleur, f }) => (
          <path key={nom} d={chemin(f)} fill="none" strokeWidth="3.5" strokeLinecap="round" className={couleur}/>
        ))}
      </svg>
    </div>
  );
}

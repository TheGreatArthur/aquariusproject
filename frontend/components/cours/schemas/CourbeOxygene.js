import { oxygeneSaturation } from '@/lib/cours/chimie';

const L = 640;
const H = 280;
const M = { gauche: 48, droite: 20, haut: 18, bas: 44 };
const T_MIN = 15;
const T_MAX = 32;
const O_MIN = 5.5;
const O_MAX = 10.5;
const SEUIL_OATA = 6;

const x = (t) => M.gauche + ((t - T_MIN) / (T_MAX - T_MIN)) * (L - M.gauche - M.droite);
const y = (o) => H - M.bas - ((o - O_MIN) / (O_MAX - O_MIN)) * (H - M.haut - M.bas);
const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

/** Oxygène dissous à saturation selon la température (Benson et Krause, tables USGS) */
export default function CourbeOxygene () {
  const points = Array.from({ length: (T_MAX - T_MIN) * 2 + 1 }, (_, i) => T_MIN + i / 2);
  const d = points.map((t, i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(oxygeneSaturation(t)).toFixed(1)}`).join(' ');
  const reperes = [20, 25, 30];

  return (
    <div className="card p-4 sm:p-6">
      <svg viewBox={`0 0 ${L} ${H}`} className="w-full" role="img"
           aria-label={`L'eau à saturation contient ${reperes.map((t) => `${nombre.format(oxygeneSaturation(t))} mg/L à ${t} °C`).join(', ')}.`}>
        {/* Plage tropicale courante */}
        <rect x={x(24)} y={M.haut} width={x(28) - x(24)} height={H - M.haut - M.bas} className="fill-accent/10"/>
        <text x={(x(24) + x(28)) / 2} y={M.haut + 16} textAnchor="middle" className="fill-accent-glow text-[14px]">bac tropical</text>

        {[6, 7, 8, 9, 10].map((o) => (
          <g key={o}>
            <line x1={M.gauche} x2={L - M.droite} y1={y(o)} y2={y(o)} className="stroke-border" strokeDasharray="3 5"/>
            <text x={M.gauche - 10} y={y(o) + 5} textAnchor="end" className="fill-muted text-[14px]">{o}</text>
          </g>
        ))}
        {[15, 20, 25, 30].map((t) => (
          <text key={t} x={x(t)} y={H - M.bas + 24} textAnchor="middle" className="fill-muted text-[14px]">{t}&nbsp;°C</text>
        ))}
        <text x={M.gauche - 10} y={M.haut - 2} textAnchor="end" className="fill-muted text-[12px]">mg/L</text>

        {/* Minimum recommandé par l'OATA */}
        <line x1={M.gauche} x2={L - M.droite} y1={y(SEUIL_OATA)} y2={y(SEUIL_OATA)} className="stroke-danger" strokeWidth="2" strokeDasharray="8 6"/>
        <text x={L - M.droite} y={y(SEUIL_OATA) - 8} textAnchor="end" className="fill-danger text-[14px]">minimum conseillé : 6&nbsp;mg/L</text>

        <path d={d} fill="none" strokeWidth="3.5" strokeLinecap="round" className="stroke-accent"/>
        {reperes.map((t) => (
          <g key={t}>
            <circle cx={x(t)} cy={y(oxygeneSaturation(t))} r="5" className="fill-background stroke-accent" strokeWidth="2.5"/>
            <text x={x(t) + 8} y={y(oxygeneSaturation(t)) - 10} className="fill-foreground text-[15px] font-semibold">
              {nombre.format(oxygeneSaturation(t))}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

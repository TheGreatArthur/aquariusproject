/**
 * Plan d'aménagement : vue de face (règle des tiers, trois plans de plantes) et vue de côté (pente du sol).
 * Formes volontairement simples : le schéma montre des proportions, pas un bac réel.
 */

import { getI18n } from '@/lib/i18n-server';

// Tige de plante : une courbe et quelques feuilles
function Tige ({ x, base, hauteur, penche = 0, classe }) {
  const haut = base - hauteur;
  const feuilles = Array.from({ length: Math.max(2, Math.round(hauteur / 22)) }, (_, i) => base - (i + 1) * (hauteur / (Math.round(hauteur / 22) + 1)));
  return (
    <g className={classe}>
      <path d={`M${x},${base} Q${x + penche / 2},${(base + haut) / 2} ${x + penche},${haut}`} fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-current"/>
      {feuilles.map((fy, i) => {
        const t = (base - fy) / hauteur;
        const fx = x + penche * t * t;
        const sens = i % 2 ? 1 : -1;
        return <ellipse key={i} cx={fx + sens * 9} cy={fy} rx="10" ry="4" transform={`rotate(${sens * -25} ${fx + sens * 9} ${fy})`} className="fill-current"/>;
      })}
    </g>
  );
}

// Touffe basse de premier plan
function Touffe ({ x, base, largeur = 34 }) {
  return (
    <g className="text-success/70">
      {Array.from({ length: 7 }, (_, i) => {
        const dx = (i - 3) * (largeur / 7);
        return <path key={i} d={`M${x + dx},${base} q${dx / 4},-10 ${dx / 2 + (i - 3)},-${14 + (i % 3) * 3}`} fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-current"/>;
      })}
    </g>
  );
}

function VueDeFace ({ t }) {
  const L = 420;
  const H = 260;
  const sol = 222;
  return (
    <svg viewBox={`0 0 ${L} ${H}`} className="w-full" role="img"
         aria-label={t('Vue de face : le point fort (pierre ou racine) est placé sur une ligne des tiers, les plantes basses devant, les hautes derrière et sur les côtés.',
           'Front view: the focal point (stone or root) sits on a line of thirds, low plants in front, tall ones at the back and sides.',
           '正面図：見せ場（石や流木）を三分割線の上に置き、背の低い水草を手前に、背の高い水草を後ろと両脇に植える。')}>
      <rect x="10" y="10" width={L - 20} height={H - 20} rx="10" className="fill-accent/5 stroke-border" strokeWidth="2"/>
      {/* Lignes des tiers */}
      {[1, 2].map((i) => (
        <g key={i}>
          <line x1={10 + (i * (L - 20)) / 3} x2={10 + (i * (L - 20)) / 3} y1="14" y2={H - 14} className="stroke-accent/40" strokeDasharray="5 6"/>
          <line x1="14" x2={L - 14} y1={10 + (i * (H - 20)) / 3} y2={10 + (i * (H - 20)) / 3} className="stroke-accent/40" strokeDasharray="5 6"/>
        </g>
      ))}
      {/* Sol */}
      <path d={`M12,${sol} L${L - 12},${sol} L${L - 12},${H - 12} L12,${H - 12} Z`} className="fill-warning/25"/>
      {/* Arrière-plan : plantes hautes sur les côtés */}
      {[34, 52, 70, 350, 368, 386].map((x, i) => (
        <Tige key={x} x={x} base={sol} hauteur={150 + (i % 3) * 18} penche={i < 3 ? 8 : -8} classe="text-success/60"/>
      ))}
      {/* Plan moyen */}
      {[112, 300, 318].map((x, i) => <Tige key={x} x={x} base={sol} hauteur={80 + i * 8} penche={6} classe="text-success/80"/>)}
      {/* Point fort sur le tiers gauche : pierre */}
      <path d={`M${(L - 20) / 3 - 30},${sol} L${(L - 20) / 3 - 8},${sol - 78} L${(L - 20) / 3 + 26},${sol - 52} L${(L - 20) / 3 + 44},${sol} Z`} className="fill-muted/60"/>
      {/* Premier plan */}
      {[170, 210, 250].map((x) => <Touffe key={x} x={x} base={sol}/>)}
      <circle cx={10 + (L - 20) / 3} cy={10 + (H - 20) / 3} r="7" className="fill-accent"/>
      <text x={10 + (L - 20) / 3 + 12} y={10 + (H - 20) / 3 - 8} className="fill-accent-glow text-[15px] font-semibold">{t('point fort', 'focal point', '見せ場')}</text>
    </svg>
  );
}

function VueDeCote ({ t }) {
  const L = 420;
  const H = 260;
  const avant = 214; // 3 à 4 cm de sol devant
  const arriere = 178; // 6 à 8 cm derrière
  return (
    <svg viewBox={`0 0 ${L} ${H}`} className="w-full" role="img"
         aria-label={t('Vue de côté : le sol monte de 3 à 4 centimètres à l\'avant jusqu\'à 6 à 8 centimètres à l\'arrière, les plantes sont de plus en plus hautes vers l\'arrière.',
           'Side view: the substrate rises from 3 to 4 centimetres at the front to 6 to 8 centimetres at the back, and the plants get taller towards the back.',
           '側面図：底床は手前の3〜4センチから奥の6〜8センチへと高くなり、水草も奥ほど背が高くなる。')}>
      <rect x="10" y="10" width={L - 20} height={H - 20} rx="10" className="fill-accent/5 stroke-border" strokeWidth="2"/>
      <path d={`M12,${avant} L${L - 12},${arriere} L${L - 12},${H - 12} L12,${H - 12} Z`} className="fill-warning/25"/>
      <Touffe x={105} base={avant - 4}/>
      <Touffe x={145} base={avant - 8}/>
      <Tige x={190} base={avant - 16} hauteur={78} penche={4} classe="text-success/80"/>
      <Tige x={225} base={avant - 20} hauteur={88} penche={-4} classe="text-success/80"/>
      {[300, 324, 348, 372].map((x, i) => (
        <Tige key={x} x={x} base={arriere + 6 - (x - 300) / 10} hauteur={115 + (i % 2) * 15} penche={-6} classe="text-success/60"/>
      ))}
      <text x="22" y="34" className="fill-muted text-[14px]">{t('avant', 'front', '手前')}</text>
      <text x={L - 22} y="34" textAnchor="end" className="fill-muted text-[14px]">{t('arrière', 'back', '奥')}</text>
      <text x="22" y={avant + 24} className="fill-foreground text-[14px] font-semibold">3-4 cm</text>
      <text x={L - 22} y={arriere + 34} textAnchor="end" className="fill-foreground text-[14px] font-semibold">6-8 cm</text>
    </svg>
  );
}

export default async function PlanAquarium () {
  const { t } = await getI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card p-3 sm:p-4">
        <p className="mb-2 text-sm font-medium">{t('Vue de face', 'Front view', '正面図')}</p>
        <VueDeFace t={t}/>
      </div>
      <div className="card p-3 sm:p-4">
        <p className="mb-2 text-sm font-medium">{t('Vue de côté', 'Side view', '側面図')}</p>
        <VueDeCote t={t}/>
      </div>
    </div>
  );
}

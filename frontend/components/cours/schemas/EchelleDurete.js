import { arrondi, degreFrancaisVersDgh } from '@/lib/cours/chimie';
import { getI18n } from '@/lib/i18n-server';

const MAX_F = 45;
const pos = (f) => `${(Math.min(f, MAX_F) / MAX_F) * 100}%`;

// Classes de dureté en degrés français (TH), d'après Wikipédia « Dureté de l'eau »
const CLASSES = [
  { de: 0, a: 7, nom: ['Très douce', 'Very soft', 'とても軟らかい'], classe: 'bg-accent/80' },
  { de: 7, a: 15, nom: ['Douce', 'Soft', '軟らかい'], classe: 'bg-accent/50' },
  { de: 15, a: 30, nom: ['Plutôt dure', 'Moderately hard', 'やや硬い'], classe: 'bg-warning/40' },
  { de: 30, a: 40, nom: ['Dure', 'Hard', '硬い'], classe: 'bg-warning/70' },
  { de: 40, a: MAX_F, nom: ['Très dure', 'Very hard', 'とても硬い'], classe: 'bg-danger/60' },
];

/** Échelle de dureté : degrés français (analyses d'eau en France) et degrés allemands (aquariophilie) */
export default async function EchelleDurete () {
  const { t, intl } = await getI18n();
  const nombre = new Intl.NumberFormat(intl, { maximumFractionDigits: 1 });
  return (
    <div className="card p-4 sm:p-6">
      <p className="text-xs text-muted">{t('°dGH (tests d\'aquariophilie, fiches Aquarius)', '°dGH (aquarium tests, Aquarius profiles)', '°dGH（アクアリウム用試薬、Aquarius の種のページ）')}</p>
      <div className="relative mt-1 h-5 text-[0.72rem] tabular-nums text-foreground/80" aria-hidden="true">
        {[0, 5, 10, 15, 20, 25].map((dgh) => (
          <span key={dgh} className="absolute -translate-x-1/2" style={{ left: pos(dgh * 1.7848) }}>{dgh}</span>
        ))}
      </div>
      <div className="flex h-8 overflow-hidden rounded-lg" role="img"
           aria-label={t('Échelle de dureté de 0 à 45 degrés français : très douce jusqu\'à 7, douce jusqu\'à 15, plutôt dure jusqu\'à 30, dure jusqu\'à 40, très dure au-delà',
             'Hardness scale from 0 to 45 French degrees: very soft up to 7, soft up to 15, moderately hard up to 30, hard up to 40, very hard above',
             '0〜45 フランス硬度の硬度スケール：7まではとても軟らかい、15までは軟らかい、30まではやや硬い、40までは硬い、それ以上はとても硬い')}>
        {CLASSES.map((c) => (
          <span key={c.de} className={c.classe} style={{ width: `${((c.a - c.de) / MAX_F) * 100}%` }}/>
        ))}
      </div>
      <div className="relative mt-1 h-5 text-[0.72rem] tabular-nums text-foreground/80" aria-hidden="true">
        {[0, 10, 20, 30, 40].map((f) => (
          <span key={f} className="absolute -translate-x-1/2" style={{ left: pos(f) }}>{f}</span>
        ))}
      </div>
      <p className="text-xs text-muted">{t('°f (TH de votre facture ou de l\'analyse de votre commune)', '°f (French degrees, used in French water reports)', '°f（フランス硬度。フランスの水質報告で使われる単位）')}</p>

      <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {CLASSES.map((c) => (
          <li key={c.de} className="flex items-start gap-2.5">
            <span aria-hidden="true" className={`mt-1 h-3 w-3 shrink-0 rounded-sm ${c.classe}`}/>
            <span className="font-medium">{t(...c.nom)}</span>
            <span className="ml-auto whitespace-nowrap tabular-nums text-muted sm:ml-0">
              {c.a === MAX_F
                ? <>{t(`plus de ${c.de} °f`, `over ${c.de} °f`, `${c.de} °f 超`)} (≈&nbsp;{nombre.format(arrondi(degreFrancaisVersDgh(c.de)))}&nbsp;°dGH)</>
                : <>{c.de}-{c.a}&nbsp;°f (≈&nbsp;{nombre.format(arrondi(degreFrancaisVersDgh(c.de)))}-{nombre.format(arrondi(degreFrancaisVersDgh(c.a)))}&nbsp;°dGH)</>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

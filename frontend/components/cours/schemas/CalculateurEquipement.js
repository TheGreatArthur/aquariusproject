'use client';

import { useId, useState } from 'react';
import { Clock, Droplets, Lightbulb, RefreshCw, Thermometer, Weight } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import { chauffagePourVolume } from '@/lib/cours/equipement';
import { typo } from '@/lib/cours/texte';

const NBSP = ' ';

function Resultat ({ icon: Icon, titre, valeur, detail }) {
  const { locale } = useI18n();
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4">
      <p className="flex items-center gap-2 text-sm text-muted"><Icon className="h-4 w-4 text-accent"/>{titre}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums">{valeur}</p>
      {detail && <p className="mt-1 text-xs text-muted">{typo(detail, locale)}</p>}
    </div>
  );
}

/** Ordres de grandeur de l'équipement d'un bac d'eau douce selon son volume */
export default function CalculateurEquipement () {
  const id = useId();
  const { t, intl } = useI18n();
  const [litres, setLitres] = useState(120);
  const v = Number.isFinite(litres) && litres > 0 ? litres : 0;
  const chauffage = chauffagePourVolume(v);
  const n = (x) => new Intl.NumberFormat(intl, { maximumFractionDigits: 0 }).format(x);
  // Plage de valeurs : « 360 à 600 », « 360 to 600 », « 360〜600 »
  const plage = (de, a, unite) => t(`${n(de)} à ${n(a)}${NBSP}${unite}`, `${n(de)} to ${n(a)}${NBSP}${unite}`,
    `${n(de)}〜${n(a)}${NBSP}${unite}`);

  return (
    <div className="card p-5 sm:p-6">
      <label htmlFor={id} className="label">{t('Volume du bac', 'Tank volume', '水槽の容量')}</label>
      <div className="flex items-center gap-4">
        <input id={id} type="range" min="20" max="600" step="10" value={v || 20}
               onChange={(e) => setLitres(Number(e.target.value))} className="w-full accent-accent"/>
        <span className="w-24 shrink-0 text-right font-display text-2xl font-semibold tabular-nums">{n(v)}&nbsp;L</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Resultat icon={RefreshCw} titre={t('Débit du filtre', 'Filter flow', 'ろ過流量')} valeur={plage(v * 3, v * 5, 'L/h')}
                  detail={t('3 à 5 fois le volume par heure (Tropica), un peu plus pour les gros mangeurs.',
                    '3 to 5 times the volume per hour (Tropica), a little more for heavy eaters.',
                    '1時間に水量の3〜5倍（Tropica）。よく食べる魚にはもう少し多めに。')}/>
        <Resultat icon={Thermometer} titre={t('Chauffage', 'Heater', 'ヒーター')}
                  valeur={chauffage ? `${chauffage}${NBSP}W` : t('Deux chauffages', 'Two heaters', 'ヒーター2本')}
                  detail={t('Repère du fabricant EHEIM ; prévoyez plus si la pièce est froide.',
                    'Guideline from the manufacturer EHEIM; allow more if the room is cold.',
                    'メーカー EHEIM の目安。部屋が寒い場合は余裕をもたせます。')}/>
        <Resultat icon={Lightbulb} titre={t('Éclairage', 'Lighting', '照明')} valeur={plage(v * 10, v * 20, 'lm')}
                  detail={t(`10 à 20 lumens par litre pour des plantes faciles, ${n(v * 20)} à ${n(v * 40)} lm pour les plantes « Medium » (Tropica).`,
                    `10 to 20 lumens per litre for easy plants, ${n(v * 20)} to ${n(v * 40)} lm for “Medium” plants (Tropica).`,
                    `育てやすい水草には1リットルあたり10〜20ルーメン、「Medium」の水草には ${n(v * 20)}〜${n(v * 40)} lm（Tropica）。`)}/>
        <Resultat icon={Clock} titre={t('Durée d\'éclairage', 'Lighting period', '照明時間')}
                  valeur={t('6 h, puis 8 à 10 h', '6 h, then 8 to 10 h', '6時間、その後8〜10時間')}
                  detail={t('6 heures par jour pendant les deux à trois premières semaines, puis 8 à 10 heures (Tropica).',
                    '6 hours a day for the first two to three weeks, then 8 to 10 hours (Tropica).',
                    '最初の2〜3週間は1日6時間、その後は8〜10時間（Tropica）。')}/>
        <Resultat icon={Droplets} titre={t('Changement d\'eau hebdomadaire', 'Weekly water change', '毎週の換水量')}
                  valeur={plage(v * 0.1, v * 0.25, 'L')}
                  detail={t('10 à 25 % du volume chaque semaine (OATA).', '10 to 25% of the volume every week (OATA).',
                    '毎週、水量の10〜25%（OATA）。')}/>
        <Resultat icon={Weight} titre={t('Poids de l\'eau seule', 'Weight of the water alone', '水だけの重さ')}
                  valeur={`${n(v)}${NBSP}kg`}
                  detail={t('Un litre d\'eau pèse un kilo : ajoutez le verre, le sol et le décor pour choisir le meuble.',
                    'A litre of water weighs a kilo: add the glass, substrate and decor when choosing the stand.',
                    '水1リットルは1キロ。水槽台を選ぶときは、ガラス、底床、レイアウト素材の重さも加えます。')}/>
      </div>
    </div>
  );
}

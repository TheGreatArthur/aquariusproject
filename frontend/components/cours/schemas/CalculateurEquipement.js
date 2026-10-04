'use client';

import { useId, useState } from 'react';
import { Clock, Droplets, Lightbulb, RefreshCw, Thermometer, Weight } from 'lucide-react';

import { chauffagePourVolume } from '@/lib/cours/equipement';
import { typo } from '@/lib/cours/texte';

const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

function Resultat ({ icon: Icon, titre, valeur, detail }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4">
      <p className="flex items-center gap-2 text-sm text-muted"><Icon className="h-4 w-4 text-accent"/>{titre}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums">{valeur}</p>
      {detail && <p className="mt-1 text-xs text-muted">{typo(detail)}</p>}
    </div>
  );
}

/** Ordres de grandeur de l'équipement d'un bac d'eau douce selon son volume */
export default function CalculateurEquipement () {
  const id = useId();
  const [litres, setLitres] = useState(120);
  const v = Number.isFinite(litres) && litres > 0 ? litres : 0;
  const chauffage = chauffagePourVolume(v);
  const n = (x) => nombre.format(x);

  return (
    <div className="card p-5 sm:p-6">
      <label htmlFor={id} className="label">Volume du bac</label>
      <div className="flex items-center gap-4">
        <input id={id} type="range" min="20" max="600" step="10" value={v || 20}
               onChange={(e) => setLitres(Number(e.target.value))} className="w-full accent-accent"/>
        <span className="w-24 shrink-0 text-right font-display text-2xl font-semibold tabular-nums">{n(v)}&nbsp;L</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Resultat icon={RefreshCw} titre="Débit du filtre" valeur={`${n(v * 3)} à ${n(v * 5)} L/h`}
                  detail="3 à 5 fois le volume par heure (Tropica), un peu plus pour les gros mangeurs."/>
        <Resultat icon={Thermometer} titre="Chauffage" valeur={chauffage ? `${chauffage} W` : 'Deux chauffages'}
                  detail="Repère du fabricant EHEIM ; prévoyez plus si la pièce est froide."/>
        <Resultat icon={Lightbulb} titre="Éclairage" valeur={`${n(v * 10)} à ${n(v * 20)} lm`}
                  detail={`10 à 20 lumens par litre pour des plantes faciles, ${n(v * 20)} à ${n(v * 40)} lm pour les plantes « Medium » (Tropica).`}/>
        <Resultat icon={Clock} titre="Durée d'éclairage" valeur={'6\u00a0h, puis 8 à 10\u00a0h'}
                  detail="6 heures par jour pendant les deux à trois premières semaines, puis 8 à 10 heures (Tropica)."/>
        <Resultat icon={Droplets} titre="Changement d'eau hebdomadaire" valeur={`${n(v * 0.1)} à ${n(v * 0.25)} L`}
                  detail="10 à 25 % du volume chaque semaine (OATA)."/>
        <Resultat icon={Weight} titre="Poids de l'eau seule" valeur={`${n(v)} kg`}
                  detail="Un litre d'eau pèse un kilo : ajoutez le verre, le sol et le décor pour choisir le meuble."/>
      </div>
    </div>
  );
}

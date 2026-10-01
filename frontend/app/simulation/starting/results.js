import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { AlertOctagon, AlertTriangle, Plus } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import { issuesIfAdded } from '@/lib/compat';
import { fishImage } from '@/lib/fish';

const PREVIEW = {
  error: { icon: AlertOctagon, label: 'Incompatible avec votre bac', text: 'text-danger', border: '!border-danger/50' },
  warning: { icon: AlertTriangle, label: 'À surveiller', text: 'text-warning', border: '!border-warning/40' },
};

export default function TablePoissons ({ poissons, listePoissons, setListePoissons, environnement }) {

  const handleAddToCart = (p) => {
    setListePoissons((prevListePoissons) => {
      const index = prevListePoissons.findIndex((poisson) => poisson.id === p.id);
      if (index !== -1) {
        // Le poisson existe déjà dans la liste, on incrémente la quantité de 1
        const updatedListePoissons = [...prevListePoissons];
        const updatedPoisson = {
          ...prevListePoissons[index],
          quantite: prevListePoissons[index].quantite + 1,
        };
        updatedListePoissons[index] = updatedPoisson;
        return updatedListePoissons;
      } else {
        // Le poisson n'existe pas dans la liste, on l'ajoute avec une quantité de 1
        return [...prevListePoissons, { ...p, quantite: Math.max(1, p.nb_individus) }];
      }
    });
  };

  const quantite = (p) => listePoissons.find((x) => x.id === p.id)?.quantite ?? 0;

  return (
    <ul className="mt-5 space-y-3">
      {poissons.map((p) => {
        // Ce que l'ajout de cette espèce déclencherait dans le bac actuel
        const { severity, messages } = issuesIfAdded(listePoissons, p, environnement);
        const preview = PREVIEW[severity];
        return (
          <li key={p.id}
              className={clsx('card p-3 [contain-intrinsic-size:auto_6rem] [content-visibility:auto]', preview?.border)}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                  <Image src={fishImage(p)} alt="" fill sizes="80px" className="object-cover"/>
                </div>
                <div className="min-w-0">
                  <Link href={`/poissons/${p.id}`} className="font-medium hover:text-accent-glow">{p.nom_commun}</Link>
                  <p className="text-xs text-muted">{p.nom_famille}</p>
                </div>
              </div>

              <dl className="grid grid-cols-4 gap-3 text-xs sm:w-[22rem]">
                {[
                  ['Volume', `${p.litrage_mini} L`],
                  ['pH', `${p.ph_mini}–${p.ph_maxi}`],
                  ['GH', `${p.gh_mini}–${p.gh_maxi}`],
                  ['Temp.', `${p.temp_mini}–${p.temp_maxi}°`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted">{label}</dt>
                    <dd className="font-medium tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex items-center justify-between gap-3 sm:w-auto sm:justify-end">
                <BehaviourBadge comportement={p.nom_comportement} className="hidden xl:inline-block"/>
                <button type="button" className="btn-ghost !px-3.5 !py-1.5" onClick={() => handleAddToCart(p)}>
                  <Plus className="h-4 w-4"/> Ajouter
                  {quantite(p) > 0 && (
                    <span className="rounded-full bg-accent px-1.5 text-xs font-semibold text-background">{quantite(p)}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Risque de l'ajout, sur toute la largeur pour ne pas étirer la carte */}
            {preview && (
              <p className={clsx('mt-3 flex items-start gap-1.5 border-t border-border/60 pt-2.5 text-xs', preview.text)}
                 title={messages.join('\n')}>
                <preview.icon className="mt-px h-3.5 w-3.5 shrink-0"/>
                <span>
                  <span className="font-medium">{preview.label}&nbsp;:</span> {messages[0]}
                  {messages.length > 1 && <span className="text-muted"> (+{messages.length - 1} autre{messages.length > 2 ? 's' : ''})</span>}
                </span>
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

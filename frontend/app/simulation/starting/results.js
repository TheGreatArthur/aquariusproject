import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { AlertTriangle, Plus } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import { fishImage } from '@/lib/fish';

export default function TablePoissons ({ poissons, listePoissons, setListePoissons }) {

  const isFishIncompatible = (poisson) => {
    const familleOsphronemidae = 'Osphronemidae';
    const famillePoeciliidae = 'Poeciliidae';

    const hasOsphronemidae = listePoissons.some((p) => p.nom_famille === familleOsphronemidae);
    const hasPoeciliidae = listePoissons.some((p) => p.nom_famille === famillePoeciliidae);

    if (poisson.nom_famille === familleOsphronemidae && hasPoeciliidae) {
      return true;
    }

    if (poisson.nom_famille === famillePoeciliidae && hasOsphronemidae) {
      return true;
    }

    return false;
  };

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
        return [...prevListePoissons, { ...p, quantite: 1 }];
      }
    });
  };

  const quantite = (p) => listePoissons.find((x) => x.id === p.id)?.quantite ?? 0;

  return (
    <ul className="mt-5 space-y-3">
      {poissons.map((p) => {
        const incompatible = isFishIncompatible(p);
        return (
          <li key={p.id}
              className={clsx('card flex flex-col gap-4 p-3 sm:flex-row sm:items-center', incompatible && '!border-danger/50')}>
            <div className="flex flex-1 items-center gap-4">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                <Image src={fishImage(p)} alt="" fill sizes="80px" className="object-cover"/>
              </div>
              <div className="min-w-0">
                <Link href={`/poissons/${p.id}`} className="font-medium hover:text-accent-glow">{p.nom_commun}</Link>
                <p className="text-xs text-muted">{p.nom_famille}</p>
                {incompatible && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                    <AlertTriangle className="h-3.5 w-3.5"/> Incompatible avec votre bac
                  </p>
                )}
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
          </li>
        );
      })}
    </ul>
  );
}

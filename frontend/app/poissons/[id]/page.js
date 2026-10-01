'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ArrowLeft, Clock, Droplet, Ruler, Users } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import FishGallery from '@/components/fish/FishGallery';
import FishProfile from '@/components/fish/FishProfile';
import RangeBar from '@/components/fish/RangeBar';
import Reveal from '@/components/Reveal';
import { familyHref } from '@/lib/families';
import { fishImages } from '@/lib/fish';
import { hasPreviousPage } from '@/lib/navigation';

function Stat ({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <Icon className="h-4 w-4 text-accent"/>
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Row ({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium first-letter:uppercase">{children ?? '—'}</dd>
    </div>
  );
}

export default function Poisson ({ params }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`/api/poissons/${params.id}`);

  // Ouverte depuis un lien partagé, la fiche n'a pas de page précédente dans le site : retour au catalogue
  const retour = () => (hasPreviousPage() ? router.back() : router.push('/poissons'));

  if (error)
    return (
      <div className="container pt-40 text-center">
        <h1 className="text-3xl font-semibold">Poisson introuvable</h1>
        <Link href="/poissons" className="btn-ghost mt-6">Retour au catalogue</Link>
      </div>
    );

  if (isLoading || !data)
    return (
      <div className="container grid gap-10 pt-32 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-surface"/>
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded bg-surface"/>
          <div className="h-5 w-1/3 animate-pulse rounded bg-surface"/>
        </div>
      </div>
    );

  return (
    <div className="container pt-28">
      <button type="button" onClick={retour}
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4"/> Retour
      </button>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Reveal>
          <FishGallery images={fishImages(data)} alt={data.nom_commun}/>
        </Reveal>

        <Reveal delay={0.08}>
          <Link href={familyHref(data.nom_famille)} className="eyebrow hover:text-accent-glow">
            {data.nom_famille}
          </Link>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{data.nom_commun}</h1>
          <p className="mt-2 text-lg italic text-muted">{data.nom_scientifique}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <BehaviourBadge comportement={data.nom_comportement}/>
            {data.nom_mode_vie && <span className="chip !inline-block first-letter:uppercase">{data.nom_mode_vie}</span>}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Ruler} label="Taille adulte" value={`${data.taille} cm`}/>
            <Stat icon={Droplet} label="Volume minimum" value={`${data.litrage_mini} L`}/>
            <Stat icon={Users} label="Groupe minimum" value={data.nb_individus}/>
            <Stat icon={Clock} label="Longévité" value={`${data.longevite} ans`}/>
          </div>

          <section className="card mt-8 space-y-6 p-6" aria-labelledby="eau-title">
            <h2 id="eau-title" className="text-lg font-semibold">Paramètres de l&apos;eau</h2>
            <RangeBar label="pH" min={data.ph_mini} max={data.ph_maxi} scaleMin={4} scaleMax={9}/>
            <RangeBar label="Dureté (GH)" min={data.gh_mini} max={data.gh_maxi} scaleMin={0} scaleMax={30} unit="°"/>
            <RangeBar label="Température" min={data.temp_mini} max={data.temp_maxi} scaleMin={18} scaleMax={32} unit="°C"/>
          </section>

          <dl className="mt-8 divide-y divide-border/70 border-y border-border/70">
            <Row label="Genre"><i>{data.nom_genre}</i></Row>
            <Row label="Régime alimentaire">{data.regime}</Row>
            <Row label="Mode de vie">{data.nom_mode_vie}</Row>
            {data.kh != null && <Row label="KH">{data.kh}</Row>}
          </dl>
        </Reveal>
      </div>

      <FishProfile profil={data.profil} nomScientifique={data.nom_scientifique}/>
    </div>
  );
}

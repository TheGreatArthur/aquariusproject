'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ArrowLeft, Gauge, Ruler, Sun, Thermometer, Wind } from 'lucide-react';

import PhotoGallery from '@/components/PhotoGallery';
import DifficultyBadge from '@/components/plants/DifficultyBadge';
import PlantProfile from '@/components/plants/PlantProfile';
import RangeBar from '@/components/RangeBar';
import Reveal from '@/components/Reveal';
import { hasPreviousPage } from '@/lib/navigation';
import { formatRange, lightLabel, plantPhoto, TYPES } from '@/lib/plants';

function Stat ({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <Icon className="h-4 w-4 text-accent"/>
      <p className="mt-3 font-display text-xl font-semibold tabular-nums first-letter:uppercase">{value ?? '—'}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Row ({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium first-letter:uppercase">{children || 'Non renseigné'}</dd>
    </div>
  );
}

const liste = (valeurs) => valeurs?.join(', ');

/** Plage de valeurs de l'eau, ou mention de la valeur absente des sources */
function Water ({ label, min, max, ...scale }) {
  if (min == null)
    return <p className="text-sm text-muted">{label} : non renseigné par les sources</p>;
  return <RangeBar label={label} min={min} max={max} {...scale}/>;
}

export default function Plante ({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`/api/plantes/${id}`);

  // Ouverte depuis un lien partagé, la fiche n'a pas de page précédente dans le site : retour au catalogue
  const retour = () => (hasPreviousPage() ? router.back() : router.push('/plantes'));

  if (error)
    return (
      <div className="container pt-40 text-center">
        <h1 className="text-3xl font-semibold">Plante introuvable</h1>
        <Link href="/plantes" className="btn-ghost mt-6">Retour aux plantes</Link>
      </div>
    );

  if (isLoading || !data)
    return (
      <div className="container grid gap-10 pt-32 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-surface"/>
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded bg-surface"/>
          <div className="h-5 w-1/3 animate-pulse rounded bg-surface"/>
        </div>
      </div>
    );

  // Sans nom français vérifié, la fiche reprend le nom scientifique : on ne l'affiche qu'une fois, en italique
  const sansNomCommun = data.nom_commun.trim().toLowerCase() === data.nom_scientifique.trim().toLowerCase();

  return (
    <div className="container pt-28">
      <button type="button" onClick={retour}
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4"/> Retour
      </button>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* La galerie reste visible pendant la lecture de la colonne de droite, plus haute */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <PhotoGallery images={data.images.map((i) => plantPhoto(i.fichier))} credits={data.images} alt={data.nom_commun}/>
        </Reveal>

        <Reveal delay={0.08}>
          <Link href={`/plantes?type=${encodeURIComponent(data.type)}`} className="eyebrow hover:text-accent-glow">
            {TYPES[data.type]?.label} · {data.famille}
          </Link>
          {sansNomCommun ? (
            <h1 className="mt-3 text-4xl font-semibold italic sm:text-5xl">{data.nom_scientifique}</h1>
          ) : (
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{data.nom_commun}</h1>
          )}
          {(!sansNomCommun || data.auteur) && (
            <p className="mt-2 text-lg text-muted">
              {!sansNomCommun && <><i>{data.nom_scientifique}</i>{' '}</>}
              <span className="text-base">{data.auteur}</span>
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <DifficultyBadge difficulte={data.difficulte}/>
            {data.co2 && <span className="chip !inline-block">Croissance {data.croissance}</span>}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Stat icon={Ruler} label="Hauteur en aquarium" value={formatRange(data.hauteur_mini, data.hauteur_maxi, 'cm')}/>
            <Stat icon={Sun} label="Lumière" value={lightLabel(data.lumiere_mini, data.lumiere_maxi)}/>
            {/* Seul Tropica classe le besoin en CO₂ : sans lui, la vitesse de croissance prend sa place */}
            {data.co2
              ? <Stat icon={Wind} label="Besoin en CO₂" value={data.co2}/>
              : <Stat icon={Gauge} label="Croissance" value={data.croissance}/>}
            {data.temp_opti_mini != null
              ? <Stat icon={Thermometer} label="Température idéale"
                      value={formatRange(data.temp_opti_mini, data.temp_opti_maxi, '°C')}/>
              : <Stat icon={Thermometer} label="Température supportée"
                      value={formatRange(data.temp_mini, data.temp_maxi, '°C')}/>}
          </div>

          <section className="card mt-8 space-y-6 p-6" aria-labelledby="eau-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="eau-title" className="text-lg font-semibold">Paramètres de l&apos;eau</h2>
              <Link href="/cours/parametres-eau" className="text-xs text-muted hover:text-accent-glow">Comprendre ces valeurs</Link>
            </div>
            <RangeBar label="pH" min={data.ph_mini} max={data.ph_maxi} scaleMin={4} scaleMax={9}/>
            <Water label="Dureté carbonatée (KH)" min={data.kh_mini} max={data.kh_maxi} scaleMin={0} scaleMax={25} unit="°"/>
            <RangeBar label="Température" min={data.temp_mini} max={data.temp_maxi} scaleMin={0} scaleMax={35} unit="°C"
                      optiMin={data.temp_opti_mini} optiMax={data.temp_opti_maxi}/>
          </section>

          <dl className="mt-8 divide-y divide-border/70 border-y border-border/70">
            <Row label="Emplacement">{liste(data.positions)}</Row>
            <Row label="Multiplication">{liste(data.multiplication)}</Row>
            {data.usages.length > 0 && <Row label="Atouts">{liste(data.usages)}</Row>}
            <Row label="Culture hors de l'eau">{data.emergee == null ? null : data.emergee ? 'possible' : 'non'}</Row>
          </dl>
        </Reveal>
      </div>

      <PlantProfile plante={data}/>
    </div>
  );
}

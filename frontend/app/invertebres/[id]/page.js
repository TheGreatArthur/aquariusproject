'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ArrowLeft, Clock, Droplet, Ruler, Users } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import FishProfile from '@/components/fish/FishProfile';
import InvertebrateCare from '@/components/invertebrates/InvertebrateCare';
import PhotoGallery from '@/components/PhotoGallery';
import RangeBar from '@/components/RangeBar';
import Reveal from '@/components/Reveal';
import { GROUPS, formatValue, invertebratePhoto, nonLivingViews } from '@/lib/invertebrates';
import { hasPreviousPage } from '@/lib/navigation';

function Stat ({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <Icon className="h-4 w-4 text-accent"/>
      <p className="mt-3 font-display text-2xl font-semibold tabular-nums">{value ?? '—'}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Row ({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium first-letter:uppercase">{children ?? 'Non renseigné'}</dd>
    </div>
  );
}

/** Plage de valeurs de l'eau, ou mention de la valeur absente des sources */
function Water ({ label, min, max, scaleMin, scaleMax, unit }) {
  if (min == null)
    return <p className="text-sm text-muted">{label} : non renseigné par les sources</p>;
  return <RangeBar label={label} min={min} max={max} scaleMin={scaleMin} scaleMax={scaleMax} unit={unit}/>;
}

export default function Invertebre ({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`/api/invertebres/${id}`);

  // Ouverte depuis un lien partagé, la fiche n'a pas de page précédente dans le site : retour au catalogue
  const retour = () => (hasPreviousPage() ? router.back() : router.push('/invertebres'));

  if (error)
    return (
      <div className="container pt-40 text-center">
        <h1 className="text-3xl font-semibold">Invertébré introuvable</h1>
        <Link href="/invertebres" className="btn-ghost mt-6">Retour au catalogue</Link>
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
          <PhotoGallery images={data.images.map(invertebratePhoto)} alt={data.nom_commun} credits={data.credits}/>
          {/* Certaines galeries d'escargots montrent des coquilles vides, une écrevisse des spécimens de musée */}
          {nonLivingViews(data.credits) && (
            <p className="mt-3 text-xs text-muted">
              Vues : {data.credits.map((c, i) => `${i + 1} — ${c.vue}`).join(' ; ')}.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <Link href={`/invertebres?groupe=${encodeURIComponent(data.groupe)}`} className="eyebrow hover:text-accent-glow">
            {GROUPS[data.groupe]} · {data.famille}
          </Link>
          {/* Sans nom commun, le fichier reprend le nom scientifique : on ne l'affiche qu'une fois, en italique */}
          {sansNomCommun ? (
            <h1 className="mt-3 text-4xl font-semibold italic sm:text-5xl">{data.nom_scientifique}</h1>
          ) : (
            <>
              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{data.nom_commun}</h1>
              <p className="mt-2 text-lg italic text-muted">{data.nom_scientifique}</p>
            </>
          )}
          {data.variete && <p className="mt-1 text-sm text-muted">Forme documentée : {data.variete}</p>}

          <div className="mt-5 flex flex-wrap gap-2">
            <BehaviourBadge comportement={data.comportement}/>
            {data.mode_vie && <span className="chip !inline-block first-letter:uppercase">{data.mode_vie}</span>}
            {data.installation === 'aquaterrarium' && <span className="chip !inline-block">Aquaterrarium</span>}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Ruler} label="Taille adulte" value={data.taille != null ? formatValue(data.taille, 'cm') : null}/>
            <Stat icon={Droplet} label="Volume minimum" value={data.litrage_mini != null ? `${data.litrage_mini} L` : null}/>
            <Stat icon={Users} label="Groupe minimum" value={data.nb_individus}/>
            <Stat icon={Clock} label="Longévité" value={data.longevite != null ? `${data.longevite} ans` : null}/>
          </div>
          {data.mesure_taille && <p className="mt-2 text-xs text-muted">Taille : {data.mesure_taille}.</p>}

          <section className="card mt-8 space-y-6 p-6" aria-labelledby="eau-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="eau-title" className="text-lg font-semibold">Paramètres de l&apos;eau</h2>
              <Link href="/cours/parametres-eau" className="text-xs text-muted hover:text-accent-glow">Comprendre ces valeurs</Link>
            </div>
            <Water label="pH" min={data.ph_mini} max={data.ph_maxi} scaleMin={4} scaleMax={9}/>
            <Water label="Dureté (GH)" min={data.gh_mini} max={data.gh_maxi} scaleMin={0} scaleMax={30} unit="°"/>
            <Water label="Dureté carbonatée (KH)" min={data.kh_mini} max={data.kh_maxi} scaleMin={0} scaleMax={20} unit="°"/>
            <Water label="Température" min={data.temp_mini} max={data.temp_maxi} scaleMin={0} scaleMax={32} unit="°C"/>
          </section>

          <dl className="mt-8 divide-y divide-border/70 border-y border-border/70">
            <Row label="Genre"><i>{data.genre}</i></Row>
            <Row label="Régime alimentaire">{data.regime}</Row>
            <Row label="Mode de vie">{data.mode_vie}</Row>
            <Row label="Activité">{data.activite}</Row>
            <Row label="Milieu des adultes">{data.milieu}</Row>
            <Row label="Reproduction">{data.reproduction}</Row>
          </dl>
        </Reveal>
      </div>

      <FishProfile profil={data.profil} nomScientifique={data.nom_scientifique} withSources={false}/>
      <InvertebrateCare profil={data.profil}/>
    </div>
  );
}

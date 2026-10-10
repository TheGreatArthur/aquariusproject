'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ArrowLeft, Clock, Droplet, Ruler, Users } from 'lucide-react';

import BehaviourBadge from '@/components/fish/BehaviourBadge';
import FishProfile from '@/components/fish/FishProfile';
import { useI18n } from '@/components/I18nProvider';
import InvertebrateCare from '@/components/invertebrates/InvertebrateCare';
import PhotoGallery from '@/components/PhotoGallery';
import RangeBar from '@/components/RangeBar';
import Reveal from '@/components/Reveal';
import { formatValue, GROUPS, GROUPS_EN, invertebratePhoto, nonLivingViews } from '@/lib/invertebrates';
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
  const { t } = useI18n();
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium first-letter:uppercase">{children ?? t('Non renseigné', 'Not known')}</dd>
    </div>
  );
}

/** Plage de valeurs de l'eau, ou mention de la valeur absente des sources */
function Water ({ label, min, max, scaleMin, scaleMax, unit }) {
  const { t } = useI18n();
  if (min == null)
    return <p className="text-sm text-muted">{label}{t(' : non renseigné par les sources', ': not given by the sources')}</p>;
  return <RangeBar label={label} min={min} max={max} scaleMin={scaleMin} scaleMax={scaleMax} unit={unit}/>;
}

export default function Invertebre ({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { t, href, term, locale } = useI18n();
  const { data, error, isLoading } = useSWR(`/api/invertebres/${id}`);

  // Ouverte depuis un lien partagé, la fiche n'a pas de page précédente dans le site : retour au catalogue
  const retour = () => (hasPreviousPage() ? router.back() : router.push(href('/invertebres')));

  if (error)
    return (
      <div className="container pt-40 text-center">
        <h1 className="text-3xl font-semibold">{t('Invertébré introuvable', 'Invertebrate not found')}</h1>
        <Link href={href('/invertebres')} className="btn-ghost mt-6">{t('Retour au catalogue', 'Back to the catalogue')}</Link>
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
        <ArrowLeft className="h-4 w-4"/> {t('Retour', 'Back')}
      </button>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* La galerie reste visible pendant la lecture de la colonne de droite, plus haute */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <PhotoGallery images={data.images.map(invertebratePhoto)} alt={data.nom_commun} credits={data.credits}/>
          {/* Certaines galeries d'escargots montrent des coquilles vides, une écrevisse des spécimens de musée */}
          {nonLivingViews(data.credits) && (
            <p className="mt-3 text-xs text-muted">
              {t('Vues :', 'Views:')} {data.credits.map((c, i) => `${i + 1} — ${c.vue}`).join(' ; ')}.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <Link href={href(`/invertebres?groupe=${encodeURIComponent(data.groupe)}`)} className="eyebrow hover:text-accent-glow">
            {t(GROUPS[data.groupe], GROUPS_EN[data.groupe])} · {data.famille}
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
          {data.variete && <p className="mt-1 text-sm text-muted">{t('Forme documentée :', 'Documented form:')} {data.variete}</p>}

          <div className="mt-5 flex flex-wrap gap-2">
            <BehaviourBadge comportement={data.comportement}/>
            {data.mode_vie && <span className="chip !inline-block first-letter:uppercase">{term(data.mode_vie)}</span>}
            {data.installation === 'aquaterrarium' && <span className="chip !inline-block">{t('Aquaterrarium', 'Paludarium')}</span>}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Ruler} label={t('Taille adulte', 'Adult size')} value={data.taille != null ? formatValue(data.taille, 'cm', locale) : null}/>
            <Stat icon={Droplet} label={t('Volume minimum', 'Minimum volume')} value={data.litrage_mini != null ? `${data.litrage_mini} L` : null}/>
            <Stat icon={Users} label={t('Groupe minimum', 'Minimum group')} value={data.nb_individus}/>
            <Stat icon={Clock} label={t('Longévité', 'Lifespan')} value={data.longevite != null ? `${data.longevite}\u00a0${t('ans', 'years')}` : null}/>
          </div>
          {data.mesure_taille && <p className="mt-2 text-xs text-muted">{t('Taille :', 'Size:')} {data.mesure_taille}.</p>}

          <section className="card mt-8 space-y-6 p-6" aria-labelledby="eau-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="eau-title" className="text-lg font-semibold">{t('Paramètres de l\'eau', 'Water parameters')}</h2>
              <Link href={href('/cours/parametres-eau')} className="text-xs text-muted hover:text-accent-glow">
                {t('Comprendre ces valeurs', 'Understand these values')}
              </Link>
            </div>
            <Water label="pH" min={data.ph_mini} max={data.ph_maxi} scaleMin={4} scaleMax={9}/>
            <Water label={t('Dureté (GH)', 'Hardness (GH)')} min={data.gh_mini} max={data.gh_maxi} scaleMin={0} scaleMax={30} unit="°"/>
            <Water label={t('Dureté carbonatée (KH)', 'Carbonate hardness (KH)')} min={data.kh_mini} max={data.kh_maxi} scaleMin={0} scaleMax={20} unit="°"/>
            <Water label={t('Température', 'Temperature')} min={data.temp_mini} max={data.temp_maxi} scaleMin={0} scaleMax={32} unit="°C"/>
          </section>

          <dl className="mt-8 divide-y divide-border/70 border-y border-border/70">
            <Row label={t('Genre', 'Genus')}><i>{data.genre}</i></Row>
            <Row label={t('Régime alimentaire', 'Diet')}>{term(data.regime)}</Row>
            <Row label={t('Mode de vie', 'Social life')}>{term(data.mode_vie)}</Row>
            <Row label={t('Activité', 'Activity')}>{data.activite}</Row>
            <Row label={t('Milieu des adultes', 'Adult habitat')}>{data.milieu}</Row>
            <Row label={t('Reproduction', 'Breeding')}>{term(data.reproduction)}</Row>
          </dl>
        </Reveal>
      </div>

      <FishProfile profil={data.profil} nomScientifique={data.nom_scientifique} withSources={false}/>
      <InvertebrateCare profil={data.profil}/>
    </div>
  );
}

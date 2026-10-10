'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ArrowLeft, Gauge, Ruler, Sun, Thermometer, Wind } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
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
  const { t } = useI18n();
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium first-letter:uppercase">{children || t('Non renseigné', 'Not known', '情報なし')}</dd>
    </div>
  );
}

const liste = (valeurs, term) => valeurs?.map(term).join(', ');

/** Plage de valeurs de l'eau, ou mention de la valeur absente des sources */
function Water ({ label, min, max, ...scale }) {
  const { t } = useI18n();
  if (min == null)
    return <p className="text-sm text-muted">{label}{t(' : non renseigné par les sources', ': not given by the sources', '：資料に記載なし')}</p>;
  return <RangeBar label={label} min={min} max={max} {...scale}/>;
}

export default function Plante ({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { t, href, term, locale, api } = useI18n();
  const { data, error, isLoading } = useSWR(api(`/api/plantes/${id}`));

  // Ouverte depuis un lien partagé, la fiche n'a pas de page précédente dans le site : retour au catalogue
  const retour = () => (hasPreviousPage() ? router.back() : router.push(href('/plantes')));

  if (error)
    return (
      <div className="container pt-40 text-center">
        <h1 className="text-3xl font-semibold">{t('Plante introuvable', 'Plant not found', '水草が見つかりません')}</h1>
        <Link href={href('/plantes')} className="btn-ghost mt-6">{t('Retour aux plantes', 'Back to the plants', '水草一覧に戻る')}</Link>
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
        <ArrowLeft className="h-4 w-4"/> {t('Retour', 'Back', '戻る')}
      </button>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* La galerie reste visible pendant la lecture de la colonne de droite, plus haute */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <PhotoGallery images={data.images.map((i) => plantPhoto(i.fichier))} credits={data.images} alt={data.nom_commun}/>
        </Reveal>

        <Reveal delay={0.08}>
          <Link href={href(`/plantes?type=${encodeURIComponent(data.type)}`)} className="eyebrow hover:text-accent-glow">
            {t(TYPES[data.type]?.label, TYPES[data.type]?.en, TYPES[data.type]?.ja)} · {data.famille}
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
            {data.co2 && <span className="chip !inline-block">{t(`Croissance ${data.croissance}`, `Growth: ${term(data.croissance)}`, `成長：${term(data.croissance)}`)}</span>}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Stat icon={Ruler} label={t('Hauteur en aquarium', 'Height in the aquarium', '水槽での草丈')}
                  value={formatRange(data.hauteur_mini, data.hauteur_maxi, 'cm', locale)}/>
            <Stat icon={Sun} label={t('Lumière', 'Light', '光量')} value={lightLabel(data.lumiere_mini, data.lumiere_maxi, locale)}/>
            {/* Seul Tropica classe le besoin en CO₂ : sans lui, la vitesse de croissance prend sa place */}
            {data.co2
              ? <Stat icon={Wind} label={t('Besoin en CO₂', 'CO₂ needs', 'CO₂ の必要量')} value={term(data.co2)}/>
              : <Stat icon={Gauge} label={t('Croissance', 'Growth', '成長速度')} value={term(data.croissance)}/>}
            {data.temp_opti_mini != null
              ? <Stat icon={Thermometer} label={t('Température idéale', 'Ideal temperature', '最適水温')}
                      value={formatRange(data.temp_opti_mini, data.temp_opti_maxi, '°C', locale)}/>
              : <Stat icon={Thermometer} label={t('Température supportée', 'Tolerated temperature', '許容水温')}
                      value={formatRange(data.temp_mini, data.temp_maxi, '°C', locale)}/>}
          </div>

          <section className="card mt-8 space-y-6 p-6" aria-labelledby="eau-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="eau-title" className="text-lg font-semibold">{t('Paramètres de l\'eau', 'Water parameters', '水質')}</h2>
              <Link href={href('/cours/parametres-eau')} className="text-xs text-muted hover:text-accent-glow">
                {t('Comprendre ces valeurs', 'Understand these values', '数値の見方')}
              </Link>
            </div>
            <RangeBar label="pH" min={data.ph_mini} max={data.ph_maxi} scaleMin={4} scaleMax={9}/>
            <Water label={t('Dureté carbonatée (KH)', 'Carbonate hardness (KH)', '炭酸塩硬度（KH）')} min={data.kh_mini} max={data.kh_maxi} scaleMin={0} scaleMax={25} unit="°"/>
            <RangeBar label={t('Température', 'Temperature', '水温')} min={data.temp_mini} max={data.temp_maxi} scaleMin={0} scaleMax={35} unit="°C"
                      optiMin={data.temp_opti_mini} optiMax={data.temp_opti_maxi}/>
          </section>

          <dl className="mt-8 divide-y divide-border/70 border-y border-border/70">
            <Row label={t('Emplacement', 'Position', '配置')}>{liste(data.positions, term)}</Row>
            <Row label={t('Multiplication', 'Propagation', '増やし方')}>{liste(data.multiplication, term)}</Row>
            {data.usages.length > 0 && <Row label={t('Atouts', 'Uses', '特徴')}>{liste(data.usages, term)}</Row>}
            <Row label={t('Culture hors de l\'eau', 'Grows emersed', '水上栽培')}>
              {data.emergee == null ? null : data.emergee ? t('possible', 'yes', '可') : t('non', 'no', '不可')}
            </Row>
          </dl>
        </Reveal>
      </div>

      <PlantProfile plante={data}/>
    </div>
  );
}

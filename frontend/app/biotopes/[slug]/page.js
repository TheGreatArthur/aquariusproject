import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, MapPin } from 'lucide-react';

import BiotopePhoto from '@/components/biotopes/BiotopePhoto';
import BiotopeVideo from '@/components/biotopes/BiotopeVideo';
import LoadTankButton from '@/components/biotopes/LoadTankButton';
import Texte from '@/components/cours/Texte';
import FishCard from '@/components/fish/FishCard';
import InvertebrateCard from '@/components/invertebrates/InvertebrateCard';
import PlantCard from '@/components/plants/PlantCard';
import Reveal from '@/components/Reveal';
import TankPreview from '@/components/TankPreview';
import { getBiotope, photosDu, textesDu } from '@/content/biotopes';
import { espece } from '@/lib/compat';
import { formatRange } from '@/lib/compat/utils';
import { getI18n } from '@/lib/i18n-server';
import { getCatalogue } from '@/lib/species-server';

const MESURES = {
  ph: { label: ['pH', 'pH', 'pH'], unit: '' },
  conductivite: { label: ['Conductivité', 'Conductivity', '電気伝導度'], unit: ' µS/cm' },
  gh: { label: ['Dureté totale', 'General hardness', '総硬度'], unit: ' °dGH' },
  kh: { label: ['Dureté carbonatée', 'Carbonate hardness', '炭酸塩硬度'], unit: ' °dKH' },
  temperature: { label: ['Température', 'Temperature', '水温'], unit: ' °C' },
};

// Les trois catalogues, dans l'ordre d'affichage
const GROUPES = [
  { kind: 'poisson', liste: 'poissons', titre: ['Poissons', 'Fish', '魚'], carte: (p, priority) => <FishCard poisson={p} priority={priority}/> },
  { kind: 'plante', liste: 'plantes', titre: ['Plantes', 'Plants', '水草'], carte: (p) => <PlantCard plante={p}/> },
  { kind: 'invertebre', liste: 'invertebres', titre: ['Invertébrés', 'Invertebrates', '無脊椎動物'], carte: (p) => <InvertebrateCard invertebre={p}/> },
];

export async function generateMetadata ({ params }) {
  const { slug } = await params;
  const biotope = getBiotope(slug);
  if (!biotope)
    return {};
  const { locale } = await getI18n();
  const textes = textesDu(slug, locale);
  const description = textes.resume.replace(/\*/g, '');
  const image = photosDu(slug).nature[0];
  return {
    title: textes.nom,
    description,
    openGraph: { title: textes.nom, description, images: image ? [`/biotopes/${image.fichier}`] : undefined },
  };
}

function Section ({ id, titre, children }) {
  return (
    <section aria-labelledby={id} className="mt-20 scroll-mt-24">
      <Reveal>
        <h2 id={id} className="text-2xl font-semibold sm:text-3xl">{titre}</h2>
      </Reveal>
      {children}
    </section>
  );
}

const Paragraphes = ({ textes }) => textes.map((texte) => (
  <p key={texte.slice(0, 40)} className="mt-4 max-w-3xl leading-relaxed text-foreground/85"><Texte>{texte}</Texte></p>
));

export default async function BiotopePage ({ params }) {
  const { slug } = await params;
  const biotope = getBiotope(slug);
  if (!biotope)
    notFound();
  const { t, href, locale } = await getI18n();
  const textes = textesDu(slug, locale);
  const photos = photosDu(slug);
  const [principale, ...nature] = photos.nature;

  // Espèces lues dans le catalogue, dans la langue de la page ; une espèce absente de la base est ignorée
  const listes = Object.fromEntries(await Promise.all(GROUPES.map(async ({ kind, liste }) => [kind, await getCatalogue(liste)])));
  const trouver = (kind, nom) => listes[kind].find((p) => p.nom_scientifique === nom);
  const bac = biotope.bac.population.flatMap(([kind, nom, quantite]) => {
    const item = trouver(kind, nom);
    return item ? [{ ...espece(kind, item), quantite }] : [];
  });

  return (
    <div className="container pt-28">
      <Link href={href('/biotopes')} className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4"/> {t('Tous les biotopes', 'All biotopes', 'すべてのビオトープ')}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
        <Reveal>
          {principale && <BiotopePhoto credit={principale} legende={textes.legendes[principale.fichier]} priority
                                       sizes="(min-width: 1024px) 55vw, 100vw"/>}
        </Reveal>
        <Reveal delay={0.08}>
          <p className="eyebrow">{textes.type}</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{textes.nom}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" aria-hidden="true"/> {textes.region}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-foreground/85"><Texte>{textes.resume}</Texte></p>
        </Reveal>
      </div>

      <Section id="milieu" titre={t('Le milieu', 'The habitat', '環境')}>
        <Paragraphes textes={textes.milieu}/>
        {nature.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nature.map((photo) => (
              <BiotopePhoto key={photo.fichier} credit={photo} legende={textes.legendes[photo.fichier]}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"/>
            ))}
          </div>
        )}
      </Section>

      <Section id="eau" titre={t('L\'eau', 'The water', '水質')}>
        {biotope.mesures.length > 0 && (
          <dl className="mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {biotope.mesures.map(({ param, min, max, source }) => (
              <div key={param} className="card p-4">
                <dt className="text-xs text-muted">{t(...MESURES[param].label)}</dt>
                <dd className="mt-2 font-display text-xl font-semibold tabular-nums">
                  {formatRange(min, max, '', locale)}
                  {MESURES[param].unit && <span className="text-sm font-normal text-muted">{MESURES[param].unit}</span>}
                </dd>
                <dd className="mt-1 text-xs">
                  <a href={`#source-${source + 1}`} className="text-muted underline-offset-4 hover:text-accent-glow hover:underline">
                    {t('Source', 'Source', '出典')} {source + 1}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        )}
        <Paragraphes textes={textes.eau}/>
      </Section>

      <Section id="especes" titre={t('Qui vit ici', 'Who lives here', 'ここに暮らす生き物')}>
        <Paragraphes textes={textes.vie}/>
        {GROUPES.map(({ kind, titre, carte }) => {
          const especes = biotope.especes[kind].map((nom) => trouver(kind, nom)).filter(Boolean);
          return especes.length > 0 && (
            <div key={kind} className="mt-10">
              <h3 className="text-lg font-semibold">{t(...titre)} <span className="text-muted">({especes.length})</span></h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {especes.map((p, i) => <div key={p.id}>{carte(p, i < 4)}</div>)}
              </div>
            </div>
          );
        })}
      </Section>

      <Section id="aquarium" titre={t('Le reproduire en aquarium', 'Recreating it in an aquarium', '水槽で再現する')}>
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
          <ul className="max-w-3xl space-y-3">
            {textes.aquarium.map((conseil) => (
              <li key={conseil.slice(0, 40)} className="flex gap-3 leading-relaxed text-foreground/85">
                <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true"/>
                <span><Texte>{conseil}</Texte></span>
              </li>
            ))}
          </ul>
          {bac.length > 0 && (
            <div>
              <TankPreview eau={biotope.bac.eau} bac={bac}>
                <p className="mt-4 text-sm text-muted"><Texte>{textes.bac}</Texte></p>
                <LoadTankButton eau={biotope.bac.eau}
                                contenu={bac.map(({ kind, ref, quantite }) => ({ kind, ref, quantite }))}/>
              </TankPreview>
            </div>
          )}
        </div>
      </Section>

      {(photos.bacs.length > 0 || biotope.videos.length > 0) && (
        <Section id="bacs" titre={t('Des bacs qui le reproduisent', 'Tanks recreating it', 'このビオトープを再現した水槽')}>
          {photos.bacs.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {photos.bacs.map((photo) => (
                <BiotopePhoto key={photo.fichier} credit={photo} legende={textes.legendes[photo.fichier]}
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"/>
              ))}
            </div>
          )}
          {biotope.videos.length > 0 && (
            <>
              <p className="mt-8 max-w-3xl text-sm text-muted">
                {t('Des aquariophiles présentent leur bac en vidéo, souvent sur un site précis du milieu. Les vidéos '
                  + 'sont hébergées par YouTube, et le lecteur ne se charge qu\'au clic.',
                'Aquarists present their tanks on video, often modelled on one precise site. The videos are hosted by '
                  + 'YouTube, and the player only loads when you click.',
                'アクアリストが自分の水槽を動画で紹介している。特定の場所を再現したものが多い。動画は YouTube にあり、'
                  + 'プレーヤーはクリックしたときだけ読み込まれる。')}
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {biotope.videos.map((v) => <BiotopeVideo key={v.id} {...v}/>)}
              </div>
            </>
          )}
        </Section>
      )}

      <Section id="sources" titre={t('Sources', 'Sources', '出典')}>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          {t('Les espèces sont listées d\'après leur fiche (FishBase, Seriously Fish) ou, pour les plantes, d\'après les '
            + 'observations GBIF de la région ; le bac d\'exemple est évalué par les règles du simulateur.',
          'Species are listed from their profiles (FishBase, Seriously Fish) or, for plants, from GBIF records in the '
            + 'region; the example tank is checked by the simulator\'s rules.',
          '種は各ページ（FishBase、Seriously Fish）、水草はその地域の GBIF の記録にもとづいて掲載し、水槽の例は'
            + 'シミュレーターのルールで評価している。')}
        </p>
        <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-sm text-foreground/85">
          {biotope.sources.map(({ titre, url }, i) => (
            <li key={url} id={`source-${i + 1}`} className="scroll-mt-24">
              <a href={url} target="_blank" rel="noopener noreferrer"
                 className="underline-offset-4 hover:text-accent-glow hover:underline">{titre}</a>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

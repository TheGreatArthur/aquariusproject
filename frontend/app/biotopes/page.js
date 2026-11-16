import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { BIOTOPES, photosDu, textesDu } from '@/content/biotopes';
import { getI18n } from '@/lib/i18n-server';

// Nombre de biotopes écrit en chiffres dans les trois langues, pour rester juste quand on en ajoute
const n = BIOTOPES.length;

export async function generateMetadata () {
  const { t } = await getI18n();
  return {
    title: t('Biotopes', 'Biotopes', 'ビオトープ'),
    description: t(`${n} milieux d'eau douce décrits à partir de mesures publiées, avec les espèces qui y vivent `
      + 'ensemble et un bac d\'exemple pour les reproduire.',
    `${n} freshwater habitats described from published measurements, with the species that live there together `
      + 'and an example tank to recreate them.',
    `公表された測定値から描いた${n}の淡水の環境。そこで一緒に暮らす種と、再現するための水槽の例を紹介します。`),
  };
}

export default async function BiotopesPage () {
  const { t, href, locale } = await getI18n();
  return (
    <>
      <PageHeader eyebrow={t('Biotopes', 'Biotopes', 'ビオトープ')}
                  title={t('Des milieux naturels aux bacs', 'From the wild to the tank', '自然から水槽へ')}>
        {t(`${n} milieux d'eau douce décrits à partir de mesures publiées, avec les espèces qui y vivent ensemble et `
          + 'un bac d\'exemple pour les reproduire.',
        `${n} freshwater habitats described from published measurements, with the species that live there `
          + 'together and an example tank to recreate them.',
        `公表された測定値から描いた${n}の淡水の環境。そこで一緒に暮らす種と、再現するための水槽の例を紹介します。`)}
      </PageHeader>

      <section className="container" aria-label={t('Biotopes', 'Biotopes', 'ビオトープ')}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BIOTOPES.map((b, i) => {
            const textes = textesDu(b.slug, locale);
            const photo = photosDu(b.slug).nature[0];
            const compte = [
              [b.especes.poisson.length, t('poissons', 'fish', '魚'), t('poisson', 'fish', '魚')],
              [b.especes.plante.length, t('plantes', 'plants', '水草'), t('plante', 'plant', '水草')],
              [b.especes.invertebre.length, t('invertébrés', 'invertebrates', '無脊椎動物'), t('invertébré', 'invertebrate', '無脊椎動物')],
            ].filter(([n]) => n > 0).map(([n, plusieurs, un]) => `${n} ${n > 1 ? plusieurs : un}`).join(' · ');
            return (
              <Reveal as="li" key={b.slug} delay={(i % 3) * 0.06}>
                <Link href={href(`/biotopes/${b.slug}`)} className="card card-hover group flex h-full flex-col overflow-hidden">
                  {photo && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={`/biotopes/${photo.fichier}`} alt="" fill priority={i < 3}
                             sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                             className="object-cover transition duration-700 group-hover:scale-105"/>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="eyebrow">{textes.type}</p>
                    <h2 className="mt-2 text-xl font-semibold">{textes.nom}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true"/> {textes.region}
                    </p>
                    <p className="mt-3 text-sm text-foreground/80">{textes.resume.replace(/\*/g, '')}</p>
                    <p className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs font-medium text-accent-glow">
                      {compte} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true"/>
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>
    </>
  );
}

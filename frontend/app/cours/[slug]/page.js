import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

import Bloc from '@/components/cours/Blocs';
import Texte from '@/components/cours/Texte';
import PageHeader from '@/components/PageHeader';
import { COURS, getCours } from '@/content/cours';
import { getI18n } from '@/lib/i18n-server';
import { tempsDeLecture, texteBrut } from '@/lib/cours/texte';

export const dynamicParams = false;

export function generateStaticParams () {
  return COURS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata ({ params }) {
  const { slug } = await params;
  const cours = getCours(slug);
  return cours ? { title: cours.titre, description: texteBrut(cours.resume) } : {};
}

function Sommaire ({ sections }) {
  return (
    <ol className="space-y-1 border-l border-border text-sm">
      {sections.map(({ id, titre }) => (
        <li key={id}>
          <a href={`#${id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-muted transition hover:border-accent hover:text-foreground">
            <Texte>{titre}</Texte>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default async function CoursPage ({ params }) {
  const { slug } = await params;
  const cours = getCours(slug);
  if (!cours)
    notFound();

  const { t, href, locale } = await getI18n();
  const index = COURS.indexOf(cours);
  const precedent = COURS[index - 1];
  const suivant = COURS[index + 1];

  return (
    <>
      <PageHeader
        eyebrow={t('Guide pratique', 'Practical guide')}
        title={cours.titre}
        aside={(
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="h-4 w-4 text-accent"/> {tempsDeLecture(cours)}&nbsp;{t('min de lecture', 'min read')}
          </p>
        )}
      >
        <Texte>{cours.resume}</Texte>
        {locale === 'en' && <span className="mt-2 block text-sm">This lesson is written in French.</span>}
      </PageHeader>

      <div className="container grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        {/* Sommaire : replié sur mobile, fixe sur grand écran */}
        <details className="card p-4 lg:hidden">
          <summary className="cursor-pointer font-medium">{t('Sommaire', 'Contents')}</summary>
          <div className="mt-3"><Sommaire sections={cours.sections}/></div>
        </details>
        <nav aria-label={t('Sommaire', 'Contents')} className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <p className="mb-3 text-sm font-medium">{t('Sommaire', 'Contents')}</p>
          <Sommaire sections={cours.sections}/>
          <Link href={href('/cours')} className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4"/> {t('Tous les cours', 'All lessons')}
          </Link>
        </nav>

        <article className="min-w-0 max-w-3xl space-y-14 leading-relaxed">
          {cours.sections.map(({ id, titre, blocs }) => (
            <section key={id} id={id} aria-labelledby={`${id}-titre`} className="scroll-mt-24 space-y-5">
              <h2 id={`${id}-titre`} className="text-2xl font-semibold sm:text-3xl"><Texte>{titre}</Texte></h2>
              {blocs.map((bloc, i) => <Bloc key={i} bloc={bloc}/>)}
            </section>
          ))}

          <section aria-labelledby="retenir-titre" className="card border-accent/30 p-6">
            <h2 id="retenir-titre" className="text-xl font-semibold">{t('À retenir', 'Key points')}</h2>
            <ul className="mt-4 space-y-3">
              {cours.aRetenir.map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent"/>
                  <span><Texte>{point}</Texte></span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sources-titre">
            <h2 id="sources-titre" className="text-sm font-medium text-muted">Sources</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {cours.sources.map(({ nom, url }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-start gap-1.5 text-foreground/80 hover:text-accent-glow">
                    <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0"/> <Texte>{nom}</Texte>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              {t('Textes rédigés par Aquarius à partir de ces sources. Ils ne remplacent pas l\'avis d\'un vétérinaire.',
                'Written by Aquarius from these sources. They do not replace a vet\'s advice.')}
            </p>
          </section>

          <nav aria-label={t('Cours suivant et précédent', 'Next and previous lessons')} className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {precedent ? (
              <Link href={href(`/cours/${precedent.slug}`)} className="card card-hover p-5">
                <span className="flex items-center gap-2 text-sm text-muted"><ArrowLeft className="h-4 w-4"/> {t('Cours précédent', 'Previous lesson')}</span>
                <span className="mt-1 block font-display font-semibold">{precedent.titre}</span>
              </Link>
            ) : <span/>}
            {suivant && (
              <Link href={href(`/cours/${suivant.slug}`)} className="card card-hover p-5 text-right">
                <span className="flex items-center justify-end gap-2 text-sm text-muted">{t('Cours suivant', 'Next lesson')} <ArrowRight className="h-4 w-4"/></span>
                <span className="mt-1 block font-display font-semibold">{suivant.titre}</span>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </>
  );
}

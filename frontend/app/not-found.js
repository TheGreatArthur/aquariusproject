import Link from 'next/link';

export default function NotFound () {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-4 text-5xl font-semibold sm:text-6xl">Ce poisson s&apos;est échappé.</h1>
      <p className="mt-4 max-w-md text-muted">La page demandée n&apos;existe pas ou a été déplacée.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
        <Link href="/poissons" className="btn-ghost">Voir les poissons</Link>
      </div>
    </div>
  );
}

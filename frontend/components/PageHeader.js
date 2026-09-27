import Reveal from '@/components/Reveal';

/**
 * En-tête commun des pages intérieures
 */
export default function PageHeader ({ eyebrow, title, children, aside }) {
  return (
    <section className="relative overflow-hidden pb-10 pt-32 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-2xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          {children && <div className="mt-4 text-base text-muted sm:text-lg">{children}</div>}
        </Reveal>
        {aside && <Reveal delay={0.1}>{aside}</Reveal>}
      </div>
    </section>
  );
}

'use client';

import { Sprout } from 'lucide-react';

import FishProfile, { Block, Countries, Fact, ProfileSources } from '@/components/fish/FishProfile';
import Prose from '@/components/Prose';
import Reveal from '@/components/Reveal';
import { typo } from '@/lib/cours/texte';
import { plantProfil, rangeFromKew } from '@/lib/plants';

/** À droite de la carte : pays d'origine, pays où l'homme l'a introduite, et la source de ces listes */
function RangeFacts ({ plante: p }) {
  const kew = rangeFromKew(p);
  const introduits = p.introduits ?? [];
  return (
    <dl className="grid content-start gap-6">
      <Fact label={kew ? 'Pays d\'origine' : 'Pays où elle est observée'}>
        {/* Une variété ou un cultivar n'a pas d'aire propre dans la liste de Kew : c'est celle de son espèce */}
        {p.taxon_aire && <p className="text-xs text-muted">Aire de l&apos;espèce <i>{p.taxon_aire}</i> selon Kew :</p>}
        <Countries codes={p.pays} className="mt-2" limit={18}/>
      </Fact>
      {kew && (
        <Fact label="Introduite par l'homme">
          {introduits.length > 0 ? (
            <>
              <p className="text-foreground/85">Hors de son aire d&apos;origine, dans {introduits.length} pays :</p>
              <Countries codes={introduits} label="Pays d'introduction" className="mt-2" limit={18}
                         chipClassName="!border-warning/30 !text-warning"/>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Une plante d&apos;aquarium ne doit jamais rejoindre la nature : jeter des boutures ou vider un bac dans
                un cours d&apos;eau peut suffire à l&apos;installer.
              </p>
            </>
          ) : (
            <p className="text-foreground/85">Aucune introduction signalée hors de son aire d&apos;origine.</p>
          )}
        </Fact>
      )}
      <p className="text-xs leading-relaxed text-muted">
        {kew
          ? 'Pays : liste mondiale des plantes vasculaires de Kew (WCVP). Points : observations GBIF dans les pays d\'origine.'
          : 'Les mousses ne figurent pas dans la liste mondiale des plantes vasculaires de Kew : pays où GBIF compte '
            + 'au moins deux observations sur les continents d\'origine indiqués par Flowgrow, sauf source citée.'}
      </p>
    </dl>
  );
}

/**
 * Fiche descriptive d'une plante, construite comme celle d'un poisson : « Dans la nature » (présentation,
 * classification, statut UICN, carte de répartition), puis « En aquarium » (culture) et les sources
 */
export default function PlantProfile ({ plante }) {
  return (
    <>
      <FishProfile profil={plantProfil(plante)} nomScientifique={plante.nom_scientifique} withSources={false}
                   habitatAside={<RangeFacts plante={plante}/>}/>

      <section className="mt-24" aria-labelledby="aquarium-title">
        <Reveal>
          <h2 id="aquarium-title" className="text-3xl font-semibold sm:text-4xl">En aquarium</h2>
        </Reveal>

        <div className="mt-10 grid gap-6">
          <Reveal>
            <Block icon={Sprout} title="Culture en aquarium" id="culture-title">
              <div className="mt-5 max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={typo(plante.culture)}/>
              </div>
            </Block>
          </Reveal>

          <ProfileSources sources={plante.sources}/>
        </div>
      </section>
    </>
  );
}

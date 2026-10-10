'use client';

import { Droplets, Egg, Utensils } from 'lucide-react';

import { Block, ProfileSources } from '@/components/fish/FishProfile';
import { useI18n } from '@/components/I18nProvider';
import Prose from '@/components/Prose';
import Reveal from '@/components/Reveal';

const BLOCKS = [
  ['maintenance', 'Entretien et installation', 'Care and setup', '飼育と設備', Droplets],
  ['alimentation', 'Alimentation', 'Feeding', '餌', Utensils],
  ['reproduction', 'Reproduction', 'Breeding', '繁殖', Egg],
];

/** Conseils de maintenance d'un invertébré, présentés comme la fiche « Dans la nature », puis les sources */
export default function InvertebrateCare ({ profil }) {
  const { t } = useI18n();
  return (
    <section className="mt-24" aria-labelledby="aquarium-title">
      <Reveal>
        <h2 id="aquarium-title" className="text-3xl font-semibold sm:text-4xl">{t('En aquarium', 'In the aquarium', '水槽での飼育')}</h2>
      </Reveal>

      <div className="mt-10 grid gap-6">
        {BLOCKS.map(([field, title, titleEn, titleJa, Icon]) => (
          <Reveal key={field}>
            <Block icon={Icon} title={t(title, titleEn, titleJa)} id={`${field}-title`}>
              <div className="mt-5 max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-foreground/85">
                <Prose text={profil[field]}/>
              </div>
            </Block>
          </Reveal>
        ))}

        <ProfileSources sources={profil.sources}/>
      </div>
    </section>
  );
}

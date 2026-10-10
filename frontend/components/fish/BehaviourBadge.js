import clsx from 'clsx';

import { useI18n } from '@/components/I18nProvider';
import { behaviourTone, TONE_CLASSES } from '@/lib/fish';

export default function BehaviourBadge ({ comportement, className }) {
  const { term } = useI18n();
  if (!comportement)
    return null;
  return (
    <span className={clsx(
      'inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium first-letter:uppercase',
      TONE_CLASSES[behaviourTone(comportement)],
      className,
    )}>
      {term(comportement)}
    </span>
  );
}

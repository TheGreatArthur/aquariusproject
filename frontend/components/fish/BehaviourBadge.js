import clsx from 'clsx';

import { behaviourTone, TONE_CLASSES } from '@/lib/fish';

export default function BehaviourBadge ({ comportement, className }) {
  if (!comportement)
    return null;
  return (
    <span className={clsx(
      'inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium first-letter:uppercase',
      TONE_CLASSES[behaviourTone(comportement)],
      className,
    )}>
      {comportement}
    </span>
  );
}

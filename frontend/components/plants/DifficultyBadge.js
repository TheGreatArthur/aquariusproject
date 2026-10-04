import clsx from 'clsx';

import { TONE_CLASSES } from '@/lib/fish';
import { difficultyTone } from '@/lib/plants';

export default function DifficultyBadge ({ difficulte, className }) {
  if (!difficulte)
    return null;
  return (
    <span className={clsx(
      'inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium first-letter:uppercase',
      TONE_CLASSES[difficultyTone(difficulte)],
      className,
    )}>
      {difficulte}
    </span>
  );
}

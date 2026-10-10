import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';

/**
 * Numéros de page à afficher, avec des ellipses : 1 … 4 5 6 … 12
 */
function pageItems (current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1)
      items.push(`gap-${p}`);
    items.push(p);
  });
  return items;
}

export default function Pagination ({ currentPage, totalPages, onPageChange }) {
  const { t } = useI18n();
  if (totalPages <= 1)
    return null;

  const arrow = 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-accent/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button type="button" className={arrow} onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1} aria-label={t('Page précédente', 'Previous page', '前のページ')}>
        <ChevronLeft className="h-4 w-4"/>
      </button>

      {pageItems(currentPage, totalPages).map((item) => typeof item === 'string'
        ? <span key={item} className="px-1 text-muted">…</span>
        : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? 'page' : undefined}
            className={clsx(
              'h-10 min-w-[2.5rem] rounded-full px-3 text-sm transition',
              item === currentPage
                ? 'bg-accent font-semibold text-background'
                : 'text-muted hover:bg-surface hover:text-foreground',
            )}
          >
            {item}
          </button>
        ))}

      <button type="button" className={arrow} onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages} aria-label={t('Page suivante', 'Next page', '次のページ')}>
        <ChevronRight className="h-4 w-4"/>
      </button>
    </nav>
  );
}

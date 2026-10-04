const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

/**
 * Plage de tolérance (min–max) positionnée sur une échelle de référence ; la plage optimale facultative
 * (`optiMin`–`optiMax`) est tracée plus franchement à l'intérieur
 */
export default function RangeBar ({ label, min, max, scaleMin, scaleMax, unit = '', optiMin, optiMax }) {
  if (min == null || max == null)
    return null;

  const clamp = (v) => Math.min(100, Math.max(0, ((v - scaleMin) / (scaleMax - scaleMin)) * 100));
  const left = clamp(min);
  const width = Math.max(clamp(max) - left, 2);
  const optimum = optiMin != null && optiMax != null;
  const fmt = (v) => nombre.format(v);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-display font-medium tabular-nums text-foreground">
          {fmt(min)} – {fmt(max)}{unit}
          {optimum && <span className="ml-2 font-sans text-xs font-normal text-muted">idéal {fmt(optiMin)}–{fmt(optiMax)}{unit}</span>}
        </span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-surface-elevated" role="img"
           aria-label={`${label} : de ${fmt(min)} à ${fmt(max)}${unit}`
             + (optimum ? `, idéal de ${fmt(optiMin)} à ${fmt(optiMax)}${unit}` : '')}>
        <div
          className={optimum ? 'absolute inset-y-0 rounded-full bg-accent/30' : 'absolute inset-y-0 rounded-full bg-accent'}
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        {optimum && (
          <div
            className="absolute inset-y-0 rounded-full bg-accent"
            style={{ left: `${clamp(optiMin)}%`, width: `${Math.max(clamp(optiMax) - clamp(optiMin), 2)}%` }}
          />
        )}
      </div>
      <div className="mt-1 flex justify-between text-[0.7rem] text-muted/70">
        <span>{scaleMin}{unit}</span>
        <span>{scaleMax}{unit}</span>
      </div>
    </div>
  );
}

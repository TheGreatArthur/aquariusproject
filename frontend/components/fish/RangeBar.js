/**
 * Plage de tolérance (min–max) positionnée sur une échelle de référence
 */
export default function RangeBar ({ label, min, max, scaleMin, scaleMax, unit = '' }) {
  if (min == null || max == null)
    return null;

  const clamp = (v) => Math.min(100, Math.max(0, ((v - scaleMin) / (scaleMax - scaleMin)) * 100));
  const left = clamp(min);
  const width = Math.max(clamp(max) - left, 2);

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-display font-medium tabular-nums text-foreground">
          {min} – {max}{unit}
        </span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-surface-elevated" role="img"
           aria-label={`${label} : de ${min} à ${max}${unit}`}>
        <div
          className="absolute inset-y-0 rounded-full bg-accent"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[0.7rem] text-muted/70">
        <span>{scaleMin}{unit}</span>
        <span>{scaleMax}{unit}</span>
      </div>
    </div>
  );
}

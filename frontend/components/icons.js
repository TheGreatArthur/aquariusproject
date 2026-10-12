/**
 * Logo du site (absent de lucide-react)
 */

export function Logo (props) {
  return (
    // Deux vagues, comme le signe du Verseau (Aquarius) : la tuile prend la couleur d'accent, les vagues celle du fond
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="9" fill="currentColor"/>
      <path d="M7 13c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0M7 19.5c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"
            fill="none" className="stroke-background" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

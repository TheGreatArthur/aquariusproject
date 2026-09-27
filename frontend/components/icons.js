/**
 * Icônes absentes de lucide-react (marques, logo)
 */

export function InstagramIcon (props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>
    </svg>
  );
}

export function Logo (props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity="0.35"/>
      <path d="M6 18c3-5 7-7.5 11-7.5 3 0 5.5 1.3 7.5 3.5L28 11v10l-3.5-3c-2 2.2-4.5 3.5-7.5 3.5-4 0-8-2.5-11-3.5Z"
            fill="currentColor"/>
      <circle cx="20.5" cy="15" r="1.2" fill="#050B12"/>
    </svg>
  );
}

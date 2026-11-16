import { track } from '@vercel/analytics';

/**
 * Événement personnalisé de Vercel Web Analytics. Les propriétés ne portent jamais de donnée personnelle ni de texte
 * saisi par le visiteur : seulement des identifiants du site (biotope, espèce, catalogue, langue…).
 */
export function evenement (nom, proprietes) {
  try {
    track(nom, proprietes);
  } catch {
    // Mesure facultative : une erreur ne doit jamais gêner la page
  }
}

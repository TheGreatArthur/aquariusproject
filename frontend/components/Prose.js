/** Texte d'une ligne, noms scientifiques entre *astérisques* en italique */
export function Italics ({ text }) {
  return text.split(/\*([^*]+)\*/g).map((part, j) => (j % 2 ? <i key={j}>{part}</i> : part));
}

/** Texte en paragraphes (séparés par une ligne vide), noms scientifiques entre *astérisques* en italique */
export default function Prose ({ text }) {
  return text.split(/\n\s*\n/).map((paragraph, i) => <p key={i}><Italics text={paragraph}/></p>);
}

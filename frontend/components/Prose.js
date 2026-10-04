/** Texte en paragraphes (séparés par une ligne vide), noms scientifiques entre *astérisques* en italique */
export default function Prose ({ text }) {
  return text.split(/\n\s*\n/).map((paragraph, i) => (
    <p key={i}>
      {paragraph.split(/\*([^*]+)\*/g).map((part, j) => (j % 2 ? <i key={j}>{part}</i> : part))}
    </p>
  ));
}

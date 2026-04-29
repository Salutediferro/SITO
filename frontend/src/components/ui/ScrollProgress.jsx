/**
 * Scroll progress bar — barra blood-red sottile fixed right edge.
 * Si riempie scroll-driven mentre l'utente scende. Pure CSS native, zero JS.
 * Decorativa (`aria-hidden`), disattivata automaticamente in prefers-reduced-motion.
 */
export default function ScrollProgress() {
  return <div className="scroll-progress" role="presentation" aria-hidden="true" />;
}

/**
 * SkipLink · WCAG 2.4.1 (Bypass Blocks)
 * Primo elemento focusable della pagina. Visibile solo su :focus-visible.
 * Punta a #main-content (deve esistere come landmark <main> nelle pagine).
 */
export default function SkipLink() {
  return (
    <a href="#main-content" className="sdf-skip-link">
      Salta al contenuto principale
    </a>
  );
}

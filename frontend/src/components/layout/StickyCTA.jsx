import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * StickyCTA · CTA fissa mobile (visible ≤768px via .sticky-cta CSS in globals.css).
 *
 * Comportamento:
 * - Mostrata dopo scroll > 600px (hero out of view) sulle route public pages.
 * - Nascosta su /test (quiz ha la sua CTA), /payment-success, /privacy, /consenso-informato.
 * - Padding-bottom su <main> via classe `.has-sticky-cta` per evitare che la CTA copra contenuti finali (WCAG 2.4.11).
 * - aria-label coerente con testo visibile (WCAG 2.5.3 Label in Name).
 * - Rispetta prefers-reduced-motion (transform disabilitata dalla regola CSS globale già esistente).
 */

const HIDE_ROUTES = ['/test', '/payment-success', '/privacy', '/consenso-informato', '/coming-soon'];
const SCROLL_THRESHOLD = 600;

export default function StickyCTA() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (HIDE_ROUTES.includes(pathname)) {
      setVisible(false);
      return undefined;
    }

    const onScroll = () => {
      const shouldShow = window.scrollY > SCROLL_THRESHOLD;
      setVisible(shouldShow);
      // Toggle padding-bottom on main per evitare copertura ultimo contenuto
      const main = document.getElementById('main-content');
      if (main) {
        if (shouldShow) main.classList.add('has-sticky-cta');
        else main.classList.remove('has-sticky-cta');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      const main = document.getElementById('main-content');
      if (main) main.classList.remove('has-sticky-cta');
    };
  }, [pathname]);

  if (HIDE_ROUTES.includes(pathname)) return null;

  return (
    <div className={`sticky-cta${visible ? ' visible' : ''}`} aria-hidden={!visible}>
      <Link
        to="/test"
        className="sticky-cta-btn"
        tabIndex={visible ? 0 : -1}
      >
        FAI IL TEST DI FERRO
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

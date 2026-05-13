import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteHelmet · gestione title + announcement cambio route per screen reader.
 *
 * - WCAG 2.4.2 (Page Titled): ogni pagina ha un title univoco e descrittivo.
 * - WCAG 4.1.3 (Status Messages): cambio route annunciato in live region polite.
 *
 * Map title per route. Aggiungere nuove route qui.
 */
const TITLES = {
  '/': 'Salute di Ferro',
  '/pannelli': 'Pannelli ematici — Salute di Ferro',
  '/chi-siamo': 'Chi siamo — Salute di Ferro',
  '/membership': 'Founder Pass · Membership — Salute di Ferro',
  '/test': 'Test di Ferro — Salute di Ferro',
  '/privacy': 'Privacy Policy — Salute di Ferro',
  '/consenso-informato': 'Consenso Informato — Salute di Ferro',
  '/payment-success': 'Pagamento confermato — Salute di Ferro',
  '/coming-soon': 'Coming Soon — Salute di Ferro',
};

const FALLBACK_TITLE = 'Salute di Ferro';

export default function RouteHelmet() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || FALLBACK_TITLE;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {title} caricata
    </div>
  );
}

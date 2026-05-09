import { useEffect, useRef, useState } from 'react';

/**
 * CookieBanner · GDPR-compliant consent UI.
 *
 * Funzionamento:
 * - Al mount, legge localStorage `sdf_cookie_consent`.
 * - Se valore = 'accepted' o 'rejected', NON mostra il banner.
 * - Se assente, mostra banner: "Accetta tutti" / "Rifiuta tutti" / Privacy.
 * - Su accept → gtag('consent','update', tutti granted) + localStorage save.
 * - Su reject → mantiene tutto denied (default da index.html) + localStorage save.
 *
 * Accessibility (WCAG 2.1 AA):
 * - role="region" + aria-labelledby (banner non-modale, sito navigabile)
 * - Focus iniziale sul titolo (tabindex=-1) per screen reader announce
 * - Bottoni ≥44x44 tap target
 * - Contrasto verificato palette SDF
 * - ESC chiude banner come "Rifiuta tutti" (default conservativo)
 */
const CONSENT_KEY = 'sdf_cookie_consent';
const ACCEPT = 'accepted';
const REJECT = 'rejected';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved !== ACCEPT && saved !== REJECT) {
        setVisible(true);
      }
    } catch {
      // Se localStorage bloccato (es. browser privato), mostra comunque
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible && titleRef.current) {
      // Focus al titolo per screen reader announce (WCAG 4.1.3 + 2.4.3)
      titleRef.current.focus();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleReject();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, ACCEPT);
    } catch {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
      });
    }
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, REJECT);
    } catch {}
    // gtag default è già denied, no update necessario
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-labelledby="cookie-banner-title"
      className="sdf-cookie-banner"
    >
      <div className="sdf-cookie-banner__inner">
        <h2
          id="cookie-banner-title"
          ref={titleRef}
          tabIndex={-1}
          className="sdf-cookie-banner__title"
        >
          Cookie e privacy
        </h2>
        <p className="sdf-cookie-banner__text">
          Usiamo cookie tecnici (sempre attivi) e cookie di analisi/marketing
          per capire come migliorare il sito. Senza il tuo consenso non
          attiviamo nulla oltre l'essenziale. Puoi cambiare idea in qualsiasi
          momento dal{' '}
          <a href="/privacy" className="sdf-cookie-banner__link">
            link Privacy nel footer
          </a>
          .
        </p>
        <div className="sdf-cookie-banner__actions">
          <button
            type="button"
            className="sdf-cookie-banner__btn sdf-cookie-banner__btn--reject"
            onClick={handleReject}
          >
            Rifiuta tutti
          </button>
          <button
            type="button"
            className="sdf-cookie-banner__btn sdf-cookie-banner__btn--accept"
            onClick={handleAccept}
          >
            Accetta tutti
          </button>
        </div>
      </div>
    </aside>
  );
}

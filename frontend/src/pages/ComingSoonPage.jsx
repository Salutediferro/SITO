import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Pagina /coming-soon — placeholder per feature non ancora attive
 * (es. Membership annuale in attesa di setup Stripe lato cliente).
 */
export default function ComingSoonPage() {
  useEffect(() => {
    document.title = 'Coming Soon - Salute di Ferro';
  }, []);

  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
          fontSize: 14,
          letterSpacing: 4,
          color: 'var(--accent)',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        Coming Soon
      </div>

      <h1
        style={{
          fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
          fontSize: 'clamp(40px, 7vw, 72px)',
          letterSpacing: 2,
          color: 'var(--text)',
          marginBottom: 20,
        }}
      >
        STIAMO ARRIVANDO
      </h1>

      <p
        style={{
          fontSize: 17,
          color: 'var(--text-sec)',
          maxWidth: 540,
          lineHeight: 1.6,
          marginBottom: 32,
          fontWeight: 300,
        }}
      >
        La Membership annuale è in fase di rifinitura.
        Per restare aggiornato sul lancio, scrivici a{' '}
        <a
          href="mailto:info@salutediferro.com"
          style={{ color: 'var(--accent)', textDecoration: 'underline' }}
        >
          info@salutediferro.com
        </a>{' '}
        o segui i nostri canali social.
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 28px',
          border: '1.5px solid var(--border)',
          borderRadius: 8,
          color: 'var(--text)',
          fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
          fontSize: 14,
          letterSpacing: 3,
          textDecoration: 'none',
        }}
      >
        ← Torna alla home
      </Link>
    </main>
  );
}

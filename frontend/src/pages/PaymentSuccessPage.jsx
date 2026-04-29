import { useEffect } from 'react';

/**
 * Bridge page: dopo pagamento Stripe, l'utente atterra qui (success_url).
 * Reindirizziamo immediatamente al Cloudflare Worker che gestisce:
 * - sync Sheet (action=paid)
 * - email Resend di conferma
 * - pagina HTML finale con bottone Calendly + countdown auto-redirect
 *
 * Fix definitivo (TODO Antonio): cambiare success_url Stripe Payment Link
 * direttamente a https://form.salutediferro.com/payment-success per bypass.
 */
const WORKER_URL = 'https://form.salutediferro.com/payment-success';

export default function PaymentSuccessPage() {
  useEffect(() => {
    document.title = 'Pagamento ricevuto - Salute di Ferro';
    const target = WORKER_URL + window.location.search;
    window.location.replace(target);
  }, []);

  const fallbackUrl =
    WORKER_URL + (typeof window !== 'undefined' ? window.location.search : '');

  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        color: 'var(--text)',
      }}
    >
      <h1
        style={{
          fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
          fontSize: 'clamp(24px, 3.5vw, 36px)',
          letterSpacing: 1.5,
          marginBottom: 16,
        }}
      >
        PAGAMENTO RICEVUTO
      </h1>
      <p
        role="status"
        aria-live="polite"
        style={{
          fontSize: 16,
          color: 'var(--text-sec)',
          maxWidth: 480,
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        Stiamo aprendo la pagina per prenotare la consulenza...
      </p>
      <noscript>
        <a
          href={fallbackUrl}
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: 'var(--accent)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          Continua a prenotare la consulenza
        </a>
      </noscript>
    </main>
  );
}

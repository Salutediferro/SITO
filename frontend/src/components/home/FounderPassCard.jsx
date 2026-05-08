import { useRef, useState } from 'react';
import useFounderSlots from '../../hooks/useFounderSlots';
import { PAYMENT_LINKS } from '../../constants/payments';

/**
 * FounderPassCard — Hero offer "Founder Pass" sopra il grid PricePromo standard.
 *
 * Specifiche aggiornate 6 mag 2026 (sera):
 * - Display front: **€9,99/mese a vita** (pattern marketing Spotify/Netflix · equivalente mensile)
 * - Stripe checkout reale: €119/anno upfront in unica soluzione (utente vede solo allo Stripe)
 * - Comparison barrato: €16,42/mese (= €197/anno standard mensilizzato)
 * - 200 posti totali, prezzo bloccato anche ai rinnovi annuali successivi
 * - Counter live decrementale 200 → 0 con 8 soglie di urgency progressiva
 * - Dopo i 200 posti la card scompare (restano €27 consulenza + €197/anno standard)
 *
 * NB discrepanza matematica: 12 × €9,99 = €119,88 ma Stripe price = €119 (gap €0,88 accettato).
 * Decisione business: i €119 si vedono SOLO al checkout, no disclaimer in UI.
 *
 * Accessibilità (review accessibility-lead, 1 mag 2026, riconfermata 6 mag):
 * - <section aria-labelledby> + <h2> (la home ha già H1 in Hero)
 * - <progress> nativo con label collegato via aria-labelledby
 * - aria-live="polite" + aria-atomic="true" su frase urgency, throttled a soglia (no spam SR)
 * - Urgency multi-channel: testo + peso + size + icona + colore (NON solo colore, WCAG 1.4.1)
 * - prefers-reduced-motion guard su badge pulse
 * - CTA <a> redirect Stripe Payment Link (same-tab, design Stripe)
 * - Re-fetch sincrono pre-redirect Stripe (race condition mitigation, sopravvendita resta business decision)
 * - aria-live="assertive" SOLO sul messaggio "posti esauriti" (vero alert, WCAG 4.1.3)
 *
 * Race condition residua (utente N°201): se due utenti completano checkout sul 200° posto
 * contemporaneamente, oversell è possibile. Mitigato lato server via:
 *  - Stripe Price ID separato che Giuseppe archivia quando vendite raggiungono 200
 *  - Counter atomico server-side decrementato al webhook checkout.session.completed
 * Decisione business: onorare entrambi o refundare il 201° via Stripe Dashboard.
 */

const SOLD_OUT_REDIRECT_MS = 3000;

const s = {
  // ───── Card wrapper ─────
  section: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: 'clamp(32px, 4vw, 48px) clamp(24px, 4vw, 40px)',
    paddingTop: 'clamp(44px, 5vw, 56px)', // più spazio per badge fluttuante
    background: 'linear-gradient(135deg, rgba(236,71,87,0.10) 0%, rgba(122,8,21,0.06) 100%)',
    border: '2px solid var(--accent)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 0 0 6px rgba(236,71,87,0.10), 0 24px 60px rgba(236,71,87,0.25)',
    textAlign: 'center',
    maxWidth: 720,
    margin: '0 auto var(--space-6)',
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: -16,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 22px',
    background: 'var(--accent-fill)',
    color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 14,
    letterSpacing: 3,
    borderRadius: 'var(--radius-pill)',
    textTransform: 'uppercase',
    fontWeight: 900,
    boxShadow: '0 4px 14px rgba(236,71,87,0.45)',
    whiteSpace: 'nowrap',
  },
  title: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(28px, 4vw, 40px)',
    color: 'var(--text)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    margin: 0,
    marginBottom: 12,
  },
  // ───── Claim "SOLO 200 POSTI" — blocco scarcity tipografico ─────
  scarcityBlock: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '12px 24px',
    margin: '0 auto var(--space-5)',
    border: '2px solid var(--accent)',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(236,71,87,0.08)',
    boxShadow: 'inset 0 0 24px rgba(236,71,87,0.10)',
  },
  scarcityNumber: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(36px, 5vw, 52px)',
    color: 'var(--accent)',
    fontWeight: 900,
    letterSpacing: 2,
    lineHeight: 0.95,
    textTransform: 'uppercase',
  },
  scarcitySub: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(13px, 1.4vw, 16px)',
    color: 'var(--text)',
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  // ───── Sezione prezzo ─────
  priceWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginBottom: 'var(--space-5)',
  },
  comparison: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(20px, 2.6vw, 28px)',
    color: 'var(--text-sec)',
    textDecoration: 'line-through',
    textDecorationThickness: '2px',
    textDecorationColor: 'var(--accent)',
    fontWeight: 700,
    opacity: 0.7,
    lineHeight: 1,
  },
  price: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(72px, 11vw, 112px)',
    color: 'var(--text)',
    lineHeight: 0.9,
    fontWeight: 900,
    letterSpacing: -1,
  },
  period: {
    fontSize: 'clamp(18px, 2.2vw, 24px)',
    color: 'var(--text-sec)',
    fontWeight: 500,
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    marginLeft: 6,
  },
  lifetimeNote: {
    fontSize: 'var(--text-xs)',
    color: 'var(--gold)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  // Footnote disclaimer pricing · spiega che il pagamento è annuale (compliance Codice Consumo).
  priceFootnote: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    fontWeight: 400,
    marginTop: 8,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  // Asterisco inline accanto al periodo /mese · piccolo, decorativo (collegamento via srOnly esteso).
  priceAsterisk: {
    fontSize: 'clamp(14px, 1.6vw, 18px)',
    color: 'var(--text-sec)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    fontWeight: 500,
    marginLeft: 2,
    verticalAlign: 'super',
    lineHeight: 1,
  },
  // Equivalente mensile + nota rate disponibili: contestualizza il €119/anno (UX trust)
  monthlyEquiv: {
    fontSize: 'clamp(15px, 1.6vw, 17px)',
    color: 'var(--gold)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    letterSpacing: 0.5,
    marginTop: 6,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  installmentsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    fontSize: 'clamp(12px, 1.3vw, 13px)',
    fontWeight: 700,
    color: 'var(--text)',
    background: 'rgba(155,184,155,0.14)', // verde sobrio per "trust" (var --green con alpha)
    border: '1px solid rgba(155,184,155,0.45)',
    borderRadius: 'var(--radius-pill)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
  },
  // ───── Counter posti ─────
  counterWrap: {
    marginBottom: 'var(--space-5)',
    padding: 'var(--space-4)',
    background: 'rgba(10,10,12,0.45)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1), border-color 280ms, box-shadow 280ms',
  },
  counterLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    display: 'block',
  },
  counterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    color: 'var(--text)',
    marginBottom: 10,
  },
  counterRemaining: {
    fontSize: 'clamp(32px, 4.5vw, 44px)',
    fontWeight: 900,
    color: 'var(--accent)',
    transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1), text-shadow 240ms',
    display: 'inline-block',
  },
  counterTotal: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    fontWeight: 500,
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
  },
  // ───── Progress bar wrapper: contenitore relativo per shimmer + tick markers ─────
  progressShell: {
    position: 'relative',
    width: '100%',
    height: 14,
  },
  progressBar: {
    width: '100%',
    height: '100%',
    appearance: 'none',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    overflow: 'hidden',
    background: 'rgba(242,242,244,0.08)',
    display: 'block',
  },
  // ───── Tick markers a 25/50/75/100% (decorativi, aria-hidden) ─────
  tickContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px',
  },
  tick: {
    width: 2,
    height: 8,
    background: 'rgba(242,242,244,0.35)',
    borderRadius: 1,
  },
  // ───── Urgency text (live region) ─────
  urgencyBase: {
    marginTop: 12,
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    lineHeight: 1.4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  urgencyInfo:     { fontSize: 16, fontWeight: 400, color: 'var(--text-sec)' },
  urgencyWarn:     { fontSize: 17, fontWeight: 600, color: 'var(--text)' },
  urgencyUrgent:   { fontSize: 19, fontWeight: 700, color: 'var(--accent)', textTransform: 'none' },
  urgencyCritical: { fontSize: 22, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 },
  // ───── CTA ─────
  ctaWrap: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '18px 36px',
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 17,
    letterSpacing: 3,
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 4px 18px var(--accent-glow)',
    transition: 'transform var(--motion-base, 240ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1)), box-shadow var(--motion-base, 240ms)',
    minHeight: 44, // WCAG 2.5.5 target size
    minWidth: 44,
    width: '100%',
    maxWidth: 360,
  },
  ctaDisclaimer: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
  },
  // ───── Sold-out alert ─────
  soldOutAlert: {
    padding: 'var(--space-4)',
    background: 'rgba(236,71,87,0.10)',
    border: '1.5px solid var(--accent)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text)',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    lineHeight: 1.5,
    outline: 'none',
  },
  // shared
  srOnly: {
    position: 'absolute', width: 1, height: 1,
    padding: 0, margin: -1, overflow: 'hidden',
    clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
  },
};

const KEYFRAMES = `
  @keyframes founderBadgePulse {
    0%, 100% { transform: translateX(-50%) scale(1); box-shadow: 0 4px 14px rgba(236,71,87,0.45); }
    50%      { transform: translateX(-50%) scale(1.05); box-shadow: 0 6px 22px rgba(236,71,87,0.65); }
  }
  /* Shimmer "sweep" continuo sulla barra: gradient che scorre da sinistra a destra,
     comunica progresso vivo senza rumore eccessivo. Sotto reduced-motion lo disabilitiamo. */
  @keyframes founderShimmerSweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  /* Glow pulse sul numero rimasti: sottile, intensificato sotto stati urgent/critical via classe */
  @keyframes founderNumberGlow {
    0%, 100% { text-shadow: 0 0 0 rgba(236,71,87,0); }
    50%      { text-shadow: 0 0 16px rgba(236,71,87,0.55); }
  }

  @media (prefers-reduced-motion: no-preference) {
    .founder-badge-pulse { animation: founderBadgePulse 2.4s ease-in-out infinite; }
    .founder-cta { transition: transform 240ms cubic-bezier(0.4,0,0.2,1), box-shadow 240ms; }
    .founder-shimmer { animation: founderShimmerSweep 2.6s cubic-bezier(0.4,0,0.2,1) infinite; }
    .founder-counter-remaining-urgent { animation: founderNumberGlow 1.8s ease-in-out infinite; }
  }
  @media (prefers-reduced-motion: reduce) {
    .founder-badge-pulse { animation: none !important; }
    .founder-cta { transition: none !important; }
    .founder-cta:hover { transform: none !important; }
    .founder-shimmer { animation: none !important; opacity: 0 !important; }
    .founder-counter-remaining-urgent { animation: none !important; }
    .founder-counter-wrap { transition: none !important; }
    .founder-counter-wrap:hover .founder-counter-remaining { transform: none !important; }
  }
  @media (hover: hover) and (pointer: fine) {
    .founder-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(236,71,87,0.45); }

    /* Counter wrap interactive: hover/focus-within sollevano leggermente + intensificano border accent + glow */
    .founder-counter-wrap:hover,
    .founder-counter-wrap:focus-within {
      transform: translateY(-2px);
      border-color: var(--accent) !important;
      box-shadow: 0 0 0 3px rgba(236,71,87,0.14), 0 14px 36px rgba(236,71,87,0.22);
    }
    .founder-counter-wrap:hover .founder-counter-remaining,
    .founder-counter-wrap:focus-within .founder-counter-remaining {
      transform: scale(1.08);
      text-shadow: 0 0 24px rgba(236,71,87,0.65);
    }
  }
  .founder-cta:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
  }
  /* Progress bar styling cross-browser (Webkit + Firefox) — gradient cremisi + transizione fluida */
  .founder-progress::-webkit-progress-bar {
    background: rgba(242,242,244,0.08);
    border-radius: 9999px;
  }
  .founder-progress::-webkit-progress-value {
    background: linear-gradient(90deg, var(--accent-dark) 0%, var(--accent) 50%, var(--accent) 100%);
    border-radius: 9999px;
    transition: width 600ms cubic-bezier(0.4,0,0.2,1);
    box-shadow: inset 0 0 8px rgba(255,255,255,0.18);
  }
  .founder-progress::-moz-progress-bar {
    background: linear-gradient(90deg, var(--accent-dark) 0%, var(--accent) 50%, var(--accent) 100%);
    border-radius: 9999px;
    box-shadow: inset 0 0 8px rgba(255,255,255,0.18);
  }
  @media (prefers-reduced-motion: reduce) {
    .founder-progress::-webkit-progress-value { transition: none !important; }
  }
  /* Shimmer overlay sopra la barra: pseudo-element con gradient lucido che scorre */
  .founder-shimmer-overlay {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    overflow: hidden;
    pointer-events: none;
    mix-blend-mode: screen;
  }
  .founder-shimmer {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 40%;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.0) 20%,
      rgba(255,255,255,0.30) 50%,
      rgba(255,255,255,0.0) 80%,
      transparent 100%);
  }
`;

// SVG icons inline, decorative (aria-hidden)
function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconFlame() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  );
}
function IconWarning() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function urgencyStyleFor(level) {
  if (level === 'critical') return s.urgencyCritical;
  if (level === 'urgent')   return s.urgencyUrgent;
  if (level === 'warn')     return s.urgencyWarn;
  return s.urgencyInfo;
}

function urgencyIconFor(level) {
  if (level === 'critical') return <IconWarning />;
  if (level === 'urgent')   return <IconFlame />;
  if (level === 'warn')     return <IconClock />;
  return null;
}

/**
 * Override sizing per variante "compact" (es. MembershipPage):
 * stessa struttura/markup, scala visivamente del 20-25% per non dominare.
 * Tutte le regole accessibility restano invariate.
 */
const COMPACT_OVERRIDES = {
  section: {
    maxWidth: 540,
    padding: 'clamp(24px, 3vw, 36px) clamp(20px, 3vw, 32px)',
    paddingTop: 'clamp(36px, 4vw, 44px)',
  },
  badge: { padding: '8px 18px', fontSize: 13, letterSpacing: 2.5 },
  title: { fontSize: 'clamp(24px, 3.2vw, 32px)', marginBottom: 8 },
  scarcityBlock: { padding: '10px 20px' },
  scarcityNumber: { fontSize: 'clamp(28px, 3.8vw, 38px)' },
  scarcitySub: { fontSize: 'clamp(12px, 1.2vw, 14px)' },
  comparison: { fontSize: 'clamp(18px, 2.2vw, 22px)' },
  price: { fontSize: 'clamp(56px, 8vw, 80px)' },
  period: { fontSize: 'clamp(16px, 1.8vw, 20px)' },
  counterRemaining: { fontSize: 'clamp(26px, 3.6vw, 34px)' },
  cta: { padding: '14px 28px', fontSize: 15, letterSpacing: 2.5 },
};

export default function FounderPassCard({ compact = false } = {}) {
  const { slotsRemaining, slotsTotal, urgency, loading, error, checkSlotsBeforeRedirect } = useFounderSlots();
  const [soldOut, setSoldOut] = useState(false);
  const soldOutRef = useRef(null);

  /** Merge style helper: applica override compact se attivo. */
  const sx = (key) => (compact && COMPACT_OVERRIDES[key]) ? { ...s[key], ...COMPACT_OVERRIDES[key] } : s[key];

  // Mentre carica o errore senza dato precedente: non mostriamo nulla per evitare flash UI
  if (loading && slotsRemaining === null) return null;
  if (error && slotsRemaining === null) return null;
  // Card scompare quando posti esauriti (utenti vedranno solo €27 e €197 sotto)
  if (slotsRemaining === 0 && !soldOut) return null;

  const founderHref = PAYMENT_LINKS.founderPass;
  const isFounderHrefReady = founderHref && !founderHref.includes('TODO_REPLACE');

  const handleCtaClick = async (e) => {
    // Re-fetch sincrono prima di redirigere su Stripe
    e.preventDefault();
    const fresh = await checkSlotsBeforeRedirect();
    if (fresh > 0 && isFounderHrefReady) {
      window.location.href = founderHref;
      return;
    }
    // Posti esauriti: mostra alert, sposta focus, redirect a fallback dopo 3s
    setSoldOut(true);
    requestAnimationFrame(() => {
      if (soldOutRef.current) soldOutRef.current.focus();
    });
    window.setTimeout(() => {
      window.location.href = PAYMENT_LINKS.membershipAnnuale;
    }, SOLD_OUT_REDIRECT_MS);
  };

  // ── Stato sold-out: mostra alert assertivo, no più CTA, no progress ──
  if (soldOut) {
    return (
      <section aria-labelledby="founder-sold-out-title" style={sx('section')}>
        <span style={sx('badge')} className="founder-badge-pulse">Founder Pass</span>
        <h2 id="founder-sold-out-title" style={sx('title')}>Posti esauriti</h2>
        <div
          ref={soldOutRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          style={s.soldOutAlert}
        >
          I posti Founder sono appena terminati. Tra pochi secondi sarai reindirizzato all'offerta Membership annuale standard a €197/anno.
        </div>
        <style>{KEYFRAMES}</style>
      </section>
    );
  }

  const urgencyStyle = urgency ? { ...s.urgencyBase, ...urgencyStyleFor(urgency.level) } : s.urgencyBase;
  const urgencyIcon = urgency ? urgencyIconFor(urgency.level) : null;

  return (
    <section aria-labelledby="founder-pass-title" style={sx('section')}>
      <style>{KEYFRAMES}</style>
      <span style={sx('badge')} className="founder-badge-pulse">Prezzo bloccato a vita</span>

      <h2 id="founder-pass-title" style={sx('title')}>Founder Pass</h2>

      {/* Scarcity claim: blocco tipografico forte "SOLO 200 POSTI · Mai più a questo prezzo".
          Decorativo per video, ma il numero "200" e la frase sono parte del nome accessibile della section. */}
      <div style={sx('scarcityBlock')} aria-hidden="true">
        <span style={sx('scarcityNumber')}>Solo 200 posti</span>
        <span style={sx('scarcitySub')}>Mai più a questo prezzo</span>
      </div>
      <span style={s.srOnly}>
        Solo 200 posti disponibili. Mai più a questo prezzo.
      </span>

      {/* Sezione prezzo: display mensile equivalente €9,99/mese + asterisco linkato a footnote
          "*Fatturato annualmente in unica soluzione". Compliance Codice Consumo art. 21-23
          (transparency pubblicità). Il prezzo annuale reale (€119) si vede solo al checkout Stripe. */}
      <div style={s.priceWrap}>
        <span aria-hidden="true" style={sx('comparison')}>€16,42/mese</span>
        <span aria-hidden="true">
          <span style={sx('price')}>€9,99</span>
          <span style={sx('period')}>/mese</span>
          <span style={s.priceAsterisk}>*</span>
        </span>
        <span style={s.srOnly}>
          Founder Pass: da 16 euro e 42 centesimi al mese (piano standard mensilizzato) scontato a 9 euro e 99 centesimi al mese a vita, fatturato annualmente in unica soluzione. Prezzo bloccato anche ai rinnovi successivi. Consulenza inclusa.
        </span>
        <span aria-hidden="true" style={s.lifetimeNote}>Prezzo bloccato a vita</span>
        <span aria-hidden="true" style={s.lifetimeNote}>Consulenza inclusa</span>
        <span aria-hidden="true" style={s.priceFootnote}>* Fatturato annualmente in unica soluzione</span>
      </div>

      {/* Counter posti: <progress> nativo + label collegato + frase urgency in aria-live.
          Shell interattiva: hover/focus-within solleva il blocco e intensifica accent (motion-safe). */}
      <div
        className="founder-counter-wrap"
        style={s.counterWrap}
        tabIndex={0}
        aria-label={`Posti Founder rimasti: ${slotsRemaining ?? slotsTotal} su ${slotsTotal}`}
      >
        <span id="founder-slots-label" style={s.counterLabel}>Posti Founder rimasti</span>

        <div style={s.counterRow}>
          <span
            className={
              urgency && (urgency.level === 'critical' || urgency.level === 'urgent')
                ? 'founder-counter-remaining founder-counter-remaining-urgent'
                : 'founder-counter-remaining'
            }
            style={sx('counterRemaining')}
            aria-hidden="true"
          >
            {slotsRemaining}
          </span>
          <span style={s.counterTotal} aria-hidden="true">su {slotsTotal}</span>
        </div>

        <div style={s.progressShell}>
          <progress
            className="founder-progress"
            style={s.progressBar}
            max={slotsTotal}
            value={slotsRemaining ?? slotsTotal}
            aria-labelledby="founder-slots-label"
          >
            {slotsRemaining} su {slotsTotal}
          </progress>

          {/* Tick markers ai 25/50/75% — decorativi, comunicano segmenti di completamento */}
          <div style={s.tickContainer} aria-hidden="true">
            <span />
            <span style={s.tick} />
            <span style={s.tick} />
            <span style={s.tick} />
            <span />
          </div>

          {/* Shimmer "sweep" continuo sopra la progress: animato sotto no-preference, opacity 0 sotto reduce. */}
          <div className="founder-shimmer-overlay" aria-hidden="true">
            <div className="founder-shimmer" />
          </div>
        </div>

        {/* Live region SEMPRE presente nel DOM per garantire annuncio SR anche al primo trigger
            (VoiceOver iOS/macOS perde il primo annuncio se la region è aggiunta dinamicamente).
            Stile aria-live polite + atomic + throttle a soglia gestito dall'hook (max 8 annunci totali). */}
        <p
          id="founder-urgency"
          aria-live="polite"
          aria-atomic="true"
          style={urgency ? urgencyStyle : { ...s.urgencyBase, minHeight: 24 }}
        >
          {urgency && (
            <>
              {urgencyIcon}
              <span>{urgency.text}</span>
            </>
          )}
        </p>
      </div>

      {/* CTA: redirect Stripe con check anti-race (fetch sincrono pre-redirect) */}
      <div style={s.ctaWrap}>
        {isFounderHrefReady ? (
          <a
            href={founderHref}
            onClick={handleCtaClick}
            className="founder-cta"
            style={sx('cta')}
            aria-label="Diventa Founder a 9 euro e 99 centesimi al mese, consulenza inclusa"
          >
            Diventa Founder · €9,99/mese + CONSULENZA
          </a>
        ) : (
          // Stripe Payment Link non ancora configurato (Giuseppe pendente):
          // mostriamo bottone disabilitato semantico per non bloccare design preview locale.
          <button
            type="button"
            disabled
            className="founder-cta"
            style={{ ...sx('cta'), opacity: 0.5, cursor: 'not-allowed' }}
            aria-label="Founder Pass: link di pagamento in preparazione"
          >
            In preparazione
          </button>
        )}
        <span style={s.ctaDisclaimer}>Prezzo bloccato anche al rinnovo · disdici quando vuoi</span>
      </div>
    </section>
  );
}

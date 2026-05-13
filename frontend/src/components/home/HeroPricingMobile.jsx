import { useState, useEffect } from 'react';
import { PAYMENT_LINKS } from '../../constants/payments';
import useFounderSlots from '../../hooks/useFounderSlots';

/**
 * HeroPricingMobile — Layout pricing compatto 2-colonne SOLO mobile (≤600px).
 *
 * Rimpiazza FounderPassCard + PricePromo €24,99 su mobile per ricoverare spazio verticale.
 * Mostra side-by-side: Founder Pass (o Annual €197 se sold-out) + Mensile €24,99.
 *
 * Rendering condizionale via useMediaQuery (NO display:none) per:
 * - Zero DOM bloat
 * - Zero ID collision con FounderPassCard desktop
 * - Performance migliore
 *
 * Pattern a11y (validate accessibility-lead):
 * - Card complete cliccabili <a> (no nested links)
 * - aria-label completo con numeri parlati IT naturale
 * - role="group" + aria-label su container
 * - Focus visible: outline accent 2px + offset 3px per separazione bordo card
 * - Tap target ≥150×200px (super-soglia WCAG 2.5.8 AA)
 * - Counter NO aria-live (non urgent)
 */

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

const SLOTS_TOTAL = 200;

const s = {
  section: {
    width: '100%',
    maxWidth: 540,
    margin: '0 auto',
    padding: '0 4px',
  },
  group: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    alignItems: 'stretch',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '16px 14px 14px',
    borderRadius: 12,
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
    minHeight: 195,
    position: 'relative',
  },
  cardFounder: {
    borderColor: 'var(--accent)',
    background: 'linear-gradient(160deg, rgba(236,71,87,0.08) 0%, var(--bg-card) 60%)',
    boxShadow: '0 0 0 1px rgba(236,71,87,0.2), 0 8px 22px rgba(236,71,87,0.08)',
  },
  badge: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: 4,
  },
  badgeFounder: {
    color: 'var(--accent)',
    fontWeight: 700,
  },
  priceWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 2,
    marginTop: 2,
  },
  price: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(28px, 8vw, 36px)',
    color: 'var(--text)',
    lineHeight: 1,
    fontWeight: 900,
  },
  period: {
    fontSize: 12,
    color: 'var(--text-sec)',
    marginLeft: 2,
  },
  subline: {
    fontSize: 11,
    color: 'var(--text-sec)',
    lineHeight: 1.4,
  },
  counter: {
    fontSize: 11,
    color: 'var(--accent)',
    fontWeight: 700,
    marginTop: 'auto',
    paddingTop: 8,
  },
  cta: {
    marginTop: 'auto',
    paddingTop: 10,
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 12,
    letterSpacing: 1.5,
    color: 'var(--text)',
    textTransform: 'uppercase',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    borderTop: '1px solid rgba(242,242,244,0.06)',
    marginTop: 10,
  },
  ctaFounder: {
    color: 'var(--accent)',
  },
};

export default function HeroPricingMobile() {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const { slotsRemaining, loading } = useFounderSlots();

  if (!isMobile) return null;

  // Stato pre-fetch o errore: nascondi finché non si stabilizza per evitare flash
  if (loading && slotsRemaining === null) return null;

  const founderAvailable = slotsRemaining !== null && slotsRemaining > 0;
  const founderHref = PAYMENT_LINKS.founderPass;
  const mensileHref = PAYMENT_LINKS.consulenza;
  const annualHref = PAYMENT_LINKS.membershipAnnuale;
  const founderHrefReady = founderHref && !founderHref.includes('TODO_REPLACE');

  return (
    <section
      style={s.section}
      aria-labelledby="hero-pricing-mobile-title"
      className="hero-pricing-mobile"
    >
      <h2
        id="hero-pricing-mobile-title"
        style={{
          position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
          overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
        }}
      >
        Scegli il tuo piano Salute di Ferro
      </h2>

      <div style={s.group} role="group" aria-label="Confronto piani SDF">
        {founderAvailable && founderHrefReady ? (
          <a
            href={founderHref}
            style={{ ...s.card, ...s.cardFounder }}
            className="hero-mobile-card hero-mobile-card-founder"
            aria-label={`Founder Pass annuale, 9 euro e 99 centesimi al mese, ${slotsRemaining} posti rimasti su 200`}
          >
            <span style={{ ...s.badge, ...s.badgeFounder }}>FOUNDER ANNUALE</span>
            <div style={s.priceWrap}>
              <span aria-hidden="true" style={s.price}>&euro;9,99</span>
              <span aria-hidden="true" style={s.period}>/mese</span>
            </div>
            <span aria-hidden="true" style={s.subline}>&euro;119,88/anno &middot; bloccato a vita</span>
            <span aria-hidden="true" style={s.counter}>{slotsRemaining}/{SLOTS_TOTAL} posti</span>
            <span aria-hidden="true" style={{ ...s.cta, ...s.ctaFounder }}>
              DIVENTA FOUNDER <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>
        ) : (
          // Sold-out: Founder card swap a Annual €197
          <a
            href={annualHref}
            style={s.card}
            className="hero-mobile-card hero-mobile-card-annual"
            aria-label="Membership annuale, 197 euro all'anno, circa 16 euro e 42 centesimi al mese"
          >
            <span style={s.badge}>ANNUALE</span>
            <div style={s.priceWrap}>
              <span aria-hidden="true" style={s.price}>&euro;197</span>
              <span aria-hidden="true" style={s.period}>/anno</span>
            </div>
            <span aria-hidden="true" style={s.subline}>&asymp; &euro;16,42/mese</span>
            <span aria-hidden="true" style={s.cta}>
              SOTTOSCRIVI <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </a>
        )}

        <a
          href={mensileHref}
          style={s.card}
          className="hero-mobile-card hero-mobile-card-mensile"
          aria-label="Membership mensile più consulenza, 24 euro e 99 centesimi al mese, cancellabile in qualsiasi momento"
        >
          <span style={s.badge}>MENSILE</span>
          <div style={s.priceWrap}>
            <span aria-hidden="true" style={s.price}>&euro;24,99</span>
            <span aria-hidden="true" style={s.period}>/mese</span>
          </div>
          <span aria-hidden="true" style={s.subline}>Membership + consulenza<br/>Cancelli quando vuoi</span>
          <span aria-hidden="true" style={s.cta}>
            INIZIA SUBITO <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </a>
      </div>

      <style>{`
        .hero-mobile-card:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }
        @media (hover: hover) and (pointer: fine) {
          .hero-mobile-card:hover {
            transform: translateY(-2px);
            border-color: var(--border-hover);
          }
          .hero-mobile-card-founder:hover {
            border-color: var(--accent);
            box-shadow: 0 0 0 1px rgba(236,71,87,0.4), 0 12px 28px rgba(236,71,87,0.12);
          }
        }
        .hero-mobile-card:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
    </section>
  );
}

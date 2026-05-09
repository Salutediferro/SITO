import { Link } from 'react-router-dom';

/**
 * PricePromo — visualizzazione prezzo "OFFERTA LANCIO" drammatica (Iron Forge poster style).
 *
 * Variante:
 * - prominent (default): card grande con layout strutturato header/body/footer per
 *   garantire simmetria visiva quando 2+ card sono affiancate (es. Hero homepage).
 *   Tutte le card hanno la stessa altezza grazie a min-height fissi e flex column.
 * - compact: solo prezzi inline, no card — per quiz step.
 *
 * Esempio:
 *   <PricePromo fullPrice={47} promoPrice={27} label="Consulenza 30 minuti" />
 *   <PricePromo fullPrice={47} promoPrice={27} variant="compact" />
 *
 * Accessibilità (validata accessibility-lead):
 * - <s> + sr-only su prezzi (Contrast Master AAA validated)
 * - Wrapper amounts con aria-label unitario "Da X scontato a Y" per contesto SR
 * - Badge fluttuante top: parent NON deve avere overflow:hidden (verificato)
 * - Footer/header min-height per simmetria visiva quando elementi opzionali mancano
 */
const s = {
  // ───── Variante PROMINENT (Hero, Membership) ─────
  // Layout flex column con sezioni a min-height fissa per garantire simmetria card-affiancate.
  wrapProminent: {
    display: 'flex',
    flexDirection: 'column',
    padding: 'clamp(28px, 3vw, 36px) clamp(24px, 4vw, 40px)',
    paddingTop: 'clamp(36px, 4vw, 48px)', // più padding top per badge fluttuante
    background: 'linear-gradient(135deg, rgba(236,71,87,0.06) 0%, rgba(122,8,21,0.03) 100%)',
    border: '2px solid var(--accent)',
    borderRadius: 'var(--radius-md, 12px)',
    boxShadow: '0 0 0 4px rgba(236,71,87,0.08), 0 12px 40px rgba(236,71,87,0.18)',
    textAlign: 'center',
    position: 'relative',
    height: '100%', // riempie altezza grid cell
    minHeight: 280,
    // overflow visible IMPLICITO (default) — necessario per badge top: -16
  },
  badgeProminent: {
    position: 'absolute',
    top: -16,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 18px',
    background: 'var(--accent-fill)',
    color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 14,
    letterSpacing: 3,
    borderRadius: 'var(--radius-pill, 9999px)',
    textTransform: 'uppercase',
    fontWeight: 900,
    boxShadow: '0 4px 12px rgba(236,71,87,0.4)',
    whiteSpace: 'nowrap',
    animation: 'pricePromoBadgePulse 2.4s ease-in-out infinite',
  },
  // ───── BODY centrale: prezzi (sezione fissa per allineamento baseline tra card) ─────
  bodyProminent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    minHeight: 100, // garantisce allineamento prezzi tra card
  },
  amountsProminent: {
    // Layout verticale FISSO: prezzo barrato sopra (piccolo), prezzo grosso sotto.
    // Garantisce simmetria card a qualsiasi cifra, no flex-wrap imprevedibile.
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  originalProminent: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(22px, 3vw, 32px)',
    color: 'var(--text-sec)',
    textDecoration: 'line-through',
    textDecorationThickness: '2px',
    textDecorationColor: 'var(--accent)',
    fontWeight: 700,
    opacity: 0.65,
    lineHeight: 1,
    letterSpacing: 0.5,
  },
  currentProminent: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(64px, 9vw, 96px)',
    color: 'var(--text)',
    lineHeight: 0.9,
    fontWeight: 900,
    letterSpacing: -1,
  },
  periodProminent: {
    fontSize: 'clamp(16px, 2vw, 22px)',
    color: 'var(--text-sec)',
    fontWeight: 500,
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    marginLeft: 4,
  },
  monthlyEquivProminent: {
    fontSize: 14,
    color: 'var(--text-muted)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    fontWeight: 400,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  // ───── FOOTER: savings + label (min-height fissa per simmetria) ─────
  footerProminent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    minHeight: 60, // garantisce simmetria anche se savings o label mancano
  },
  // Badge savings: feel "bottone" allineato a CTA Founder (radius-sm 8px, padding generoso, gradient).
  // Hover-lift propagato dal .price-promo-link:hover parent (vedi ANIMATION_KEYFRAMES).
  // Pulse glow attivato solo sotto prefers-reduced-motion: no-preference.
  savingsProminent: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '14px 28px',
    fontSize: 16,
    color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: 'uppercase',
    // Gradient accent: stesso CTA Founder per coerenza visiva.
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark, #7A0815) 100%)',
    borderRadius: 'var(--radius-sm, 8px)',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 18px var(--accent-glow, rgba(236,71,87,0.40)), inset 0 1px 0 rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.10)',
    minHeight: 44, // WCAG 2.5.5 target size (anche se decorativo, mantiene proporzione bottone)
    transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1), box-shadow 240ms',
  },
  labelProminent: {
    display: 'block',
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ───── Variante COMPACT (quiz PaymentStep) ─────
  wrapCompact: {
    display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
    gap: 'var(--space-2, 8px)',
  },
  badgeCompact: {
    display: 'inline-block',
    padding: '6px 14px',
    background: 'var(--accent-fill)',
    color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 12,
    letterSpacing: 2,
    borderRadius: 'var(--radius-pill, 9999px)',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  amountsCompact: {
    display: 'inline-flex', alignItems: 'baseline',
    gap: 'var(--space-3, 12px)',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  originalCompact: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 28,
    color: 'var(--text-sec)',
    textDecoration: 'line-through',
    textDecorationThickness: '2px',
    textDecorationColor: 'var(--text-muted)',
    fontWeight: 700,
  },
  currentCompact: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(48px, 8vw, 72px)',
    color: 'var(--text)',
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: 1,
  },

  // shared
  srOnly: {
    position: 'absolute', width: 1, height: 1,
    padding: 0, margin: -1, overflow: 'hidden',
    clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
  },
};

const ANIMATION_KEYFRAMES = `
  @keyframes pricePromoBadgePulse {
    0%, 100% { transform: translateX(-50%) scale(1); box-shadow: 0 4px 12px rgba(236,71,87,0.4); }
    50%      { transform: translateX(-50%) scale(1.05); box-shadow: 0 6px 20px rgba(236,71,87,0.6); }
  }
  /* Savings glow pulse · NO transform scale (causava sub-pixel blur sul testo).
     Solo box-shadow respira morbida. Ciclo rallentato 2.4s → 3.6s per ridurre fatica visiva.
     Testo statico = leggibile in ogni frame. */
  @keyframes pricePromoSavingsGlow {
    0%, 100% {
      box-shadow: 0 4px 14px rgba(236,71,87,0.35), inset 0 1px 0 rgba(255,255,255,0.18);
    }
    50% {
      box-shadow: 0 5px 18px rgba(236,71,87,0.50), 0 0 0 2px rgba(236,71,87,0.08), inset 0 1px 0 rgba(255,255,255,0.20);
    }
  }
  @media (prefers-reduced-motion: no-preference) {
    .price-promo-savings-anim { animation: pricePromoSavingsGlow 3.6s ease-in-out infinite; }
  }
  @media (prefers-reduced-motion: reduce) {
    .price-promo-badge-anim { animation: none !important; }
    .price-promo-savings-anim { animation: none !important; }
    .price-promo-link { transition: none !important; }
    .price-promo-link:hover { transform: none !important; }
    .price-promo-link:hover .price-promo-savings-anim { transform: none !important; }
  }
  .price-promo-link {
    text-decoration: none;
    color: inherit;
    transition: transform 240ms var(--ease-standard, cubic-bezier(0.4,0,0.2,1)),
                box-shadow 240ms,
                border-color 240ms;
  }
  @media (hover: hover) and (pointer: fine) {
    /* Card resta statica · hover lift SOLO sul tasto savings (precision hover) */
    .price-promo-savings-anim:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(236,71,87,0.55), 0 0 0 4px rgba(236,71,87,0.18), inset 0 1px 0 rgba(255,255,255,0.25);
    }
  }
  /* Reduced motion: rimuove hover lift sul badge */
  @media (prefers-reduced-motion: reduce) {
    .price-promo-savings-anim { transition: none !important; }
    .price-promo-savings-anim:hover { transform: none !important; }
  }
  .price-promo-link:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
  }
`;

export default function PricePromo({
  fullPrice,
  promoPrice,
  currency = '€',
  period,
  monthlyEquivalent, // opzionale: stringa "16,42" — mostrata come sub-line "≈ €16,42/mese"
  label,
  badge = 'OFFERTA LANCIO',
  savings,
  variant = 'prominent', // 'prominent' | 'compact'
  href,                  // opzionale: rende la card un link cliccabile
  ariaLabel,             // opzionale: accessible name per il link (override priceAriaLabel)
}) {
  // Calcolo savings auto se non fornito (per consulenza: 47-27=20, scondo % 43%)
  const autoSavings = (fullPrice && promoPrice && !period && !savings)
    ? `Risparmi ${currency}${fullPrice - promoPrice} (-${Math.round((1 - promoPrice / fullPrice) * 100)}%)`
    : savings;

  if (variant === 'compact') {
    return (
      <div style={s.wrapCompact}>
        {badge && <span style={s.badgeCompact}>{badge}</span>}
        <div style={s.amountsCompact}>
          {fullPrice != null && (
            <s style={s.originalCompact}>
              <span style={s.srOnly}>Prezzo originale: </span>
              {currency}{fullPrice}
            </s>
          )}
          <span style={s.currentCompact}>
            {fullPrice != null && <span style={s.srOnly}>Prezzo scontato: </span>}
            {currency}{promoPrice}
            {period && <span style={{ ...s.periodProminent, fontSize: 18 }}>{period}</span>}
          </span>
        </div>
        {label && <span style={{ ...s.labelProminent, marginTop: 4 }}>{label}</span>}
      </div>
    );
  }

  // aria-label unitario per dare contesto SR (validazione accessibility-lead)
  const priceAriaLabel = fullPrice != null
    ? `Da ${currency}${fullPrice} scontato a ${currency}${promoPrice}${period || ''}`
    : `${currency}${promoPrice}${period || ''}`;

  const cardContent = (
    <>
      <style>{ANIMATION_KEYFRAMES}</style>
      {badge && <span style={s.badgeProminent} className="price-promo-badge-anim">{badge}</span>}

      <div style={s.bodyProminent}>
        {/* Quando href presente, l'aria-label è sul link wrapper esterno: il div interno non deve duplicarlo */}
        <div style={s.amountsProminent} aria-label={href ? undefined : priceAriaLabel}>
          {fullPrice != null && (
            <s style={s.originalProminent} aria-hidden="true">
              {currency}{fullPrice}
            </s>
          )}
          <span style={s.currentProminent} aria-hidden="true">
            {currency}{promoPrice}
            {period && <span style={s.periodProminent}>{period}</span>}
          </span>
          {monthlyEquivalent && (
            <span style={s.monthlyEquivProminent} aria-hidden="true">
              ≈ {currency}{monthlyEquivalent}/mese
            </span>
          )}
        </div>
      </div>

      {/* Footer min-height fisso = simmetria visiva anche se savings o label mancano */}
      <div style={s.footerProminent}>
        {autoSavings && <span style={s.savingsProminent} className="price-promo-savings-anim">{autoSavings}</span>}
        {label && <span style={s.labelProminent}>{label}</span>}
      </div>
    </>
  );

  // ── Card cliccabile (wrapper <a> esterno o <Link> interno) ──
  if (href) {
    const computedAriaLabel = ariaLabel || `${badge || 'Offerta'}: ${priceAriaLabel}${label ? '. ' + label : ''}`;
    const linkStyle = { ...s.wrapProminent, cursor: 'pointer' };
    const isInternal = href.startsWith('/');

    if (isInternal) {
      return (
        <Link to={href} style={linkStyle} className="price-promo-link" aria-label={computedAriaLabel}>
          {cardContent}
        </Link>
      );
    }
    return (
      <a href={href} style={linkStyle} className="price-promo-link" aria-label={computedAriaLabel}>
        {cardContent}
      </a>
    );
  }

  // ── Card decorativa (no link) ──
  return <div style={s.wrapProminent}>{cardContent}</div>;
}

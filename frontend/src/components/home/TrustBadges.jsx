import FadeUp from '../ui/FadeUp';

const badges = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'Laboratori Certificati',
    desc: 'Partner accreditati su tutto il territorio',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    label: 'GDPR Compliant',
    desc: 'I tuoi dati sono al sicuro',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    label: 'Linee Guida',
    desc: 'Pannelli basati su evidenze 2025-2026 aggiornate',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    label: 'Dati Criptati',
    desc: 'Crittografia end-to-end',
  },
];

const s = {
  section: {
    padding: 'clamp(48px, 7vw, 96px) 40px',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  label: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 32,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20, maxWidth: 1000, margin: '0 auto 24px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border)',
    borderRadius: 12, padding: '28px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center',
  },
  icon: { marginBottom: 14 },
  badgeLabel: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 6,
  },
  badgeDesc: {
    fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5,
  },
  refs: {
    fontSize: 12, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 300,
  },
};

export default function TrustBadges() {
  return (
    <section style={s.section} className="trust-section">
      <FadeUp>
        <div style={s.label}>BASATO SU EVIDENZE SCIENTIFICHE</div>
        <div style={s.grid} className="trust-grid">
          {badges.map((b, i) => (
            <div key={i} style={s.card} className="card-hover">
              <div style={s.icon}>{b.icon}</div>
              <div style={s.badgeLabel} className="badge-label">{b.label}</div>
              <div style={s.badgeDesc} className="badge-desc">{b.desc}</div>
            </div>
          ))}
        </div>
        <div style={s.refs}>
          EAU 2024 · ESC/EAS 2025 · KDIGO 2024 · AASLD 2024 · ATA/AACE
        </div>
      </FadeUp>
      <style>{`
        @media (max-width: 900px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          /* 4 cards in 1 row mobile · simmetria garantita (validate accessibility-lead):
             - section padding ridotto a 16px laterale per max larghezza grid
             - grid 100% width + margin auto · padding 0 (no asymmetria interna)
             - card stretch + min-height + justify-center per vertical center
             - desc SR-accessible via clip-rect · label senza anno */
          .trust-section { padding: 48px 16px !important; }
          .trust-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
            padding: 0 !important;
            margin: 0 auto !important;
            max-width: 100% !important;
            width: 100% !important;
            align-items: stretch !important;
          }
          .trust-grid > .card-hover {
            padding: 14px 6px !important;
            min-height: 110px !important;
            justify-content: center !important;
            gap: 6px;
          }
          .trust-grid > .card-hover svg {
            width: 24px !important;
            height: 24px !important;
          }
          .trust-grid .badge-label {
            font-size: 10px !important;
            letter-spacing: 0.8px !important;
            line-height: 1.2 !important;
            margin-bottom: 0 !important;
          }
          .trust-grid .badge-desc {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0,0,0,0) !important;
            white-space: nowrap !important;
            border: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

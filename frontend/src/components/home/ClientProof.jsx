import FadeUp from '../ui/FadeUp';

const s = {
  section: {
    padding: '48px 40px',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    background: 'linear-gradient(180deg, rgba(236,71,87,0.03) 0%, transparent 100%)',
  },
  inner: {
    maxWidth: 1000, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 48, flexWrap: 'wrap',
  },
  stat: {
    textAlign: 'center', minWidth: 140,
  },
  number: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 52px)',
    color: 'var(--accent)', letterSpacing: 2, lineHeight: 1,
  },
  label: {
    fontSize: 13, color: 'var(--text-sec)', fontWeight: 300,
    marginTop: 4, letterSpacing: 0.5,
  },
  divider: {
    width: 1, height: 48,
    background: 'var(--border)',
  },
  trustRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    justifyContent: 'center', marginTop: 24,
  },
  trustBadge: {
    fontSize: 11, color: 'var(--text-muted)',
    padding: '6px 14px', borderRadius: 20,
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.02)',
  },
};

export default function ClientProof() {
  return (
    <section style={s.section}>
      <FadeUp>
        <div style={s.inner}>
          <div style={s.stat}>
            <div style={s.number}>100%</div>
            <div style={s.label}>Medici ENORMI</div>
          </div>
          <div style={s.divider} className="proof-divider" />
          <div style={s.stat}>
            <div style={s.number}>72H</div>
            <div style={s.label}>i tuoi esami in</div>
          </div>
          <div style={s.divider} className="proof-divider" />
          <div style={s.stat}>
            <div style={s.number}>0</div>
            <div style={s.label}>Pregiudizi</div>
          </div>
          <div style={s.divider} className="proof-divider" />
          <div style={s.stat}>
            <div style={s.number}>0</div>
            <div style={s.label}>Sbatti</div>
          </div>
        </div>
      </FadeUp>
      <style>{`
        @media (max-width: 600px) {
          .proof-divider { display: none !important; }
        }
      `}</style>
    </section>
  );
}

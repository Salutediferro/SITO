import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';
import { FERRO_CORE } from '../../constants/panels';

const s = {
  section: {
    padding: '80px 40px', maxWidth: 1200, margin: '0 auto',
  },
  tag: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12,
  },
  h2: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2, color: 'var(--text)', marginBottom: 16,
  },
  desc: {
    fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    marginBottom: 8,
  },
  highlights: {
    display: 'flex', gap: 12, marginBottom: 32,
  },
  hl: {
    display: 'inline-flex', padding: '6px 16px',
    background: 'rgba(248,113,113,0.08)', border: '1px solid var(--accent)',
    borderRadius: 20, fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 13, letterSpacing: 2, color: 'var(--accent)',
  },
  layout: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40,
    alignItems: 'start',
  },
  card: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 32,
  },
  cardTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 4,
  },
  cardSub: {
    fontSize: 13, color: 'var(--text-sec)', marginBottom: 20, fontWeight: 300,
  },
  list: {
    listStyle: 'none', padding: 0,
  },
  item: {
    padding: '10px 0', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', gap: 12,
    fontSize: 14, color: 'var(--text-sec)',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
    flexShrink: 0,
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 28px', marginTop: 24,
    background: 'linear-gradient(135deg, var(--accent) 0%, #EF4444 100%)',
    border: 'none', borderRadius: 6, color: 'white',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
  },
};

export default function FerroCore() {
  return (
    <section style={s.section}>
      <div style={s.layout} className="ferro-core-grid">
        <FadeUp>
          <div style={s.tag}>Il tuo punto di partenza</div>
          <h2 style={s.h2}>FERRO CORE</h2>
          <p style={s.desc}>{FERRO_CORE.description}</p>
          <div style={s.highlights}>
            {FERRO_CORE.highlights.map(h => (
              <span key={h} style={s.hl}>{h}</span>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>{FERRO_CORE.name}</h3>
            <p style={s.cardSub}>{FERRO_CORE.subtitle}</p>
            <ul style={s.list}>
              {FERRO_CORE.biomarkers.map(b => (
                <li key={b} style={s.item}>
                  <span style={s.dot} />
                  {b}
                </li>
              ))}
            </ul>
            <Link to="/test" style={s.btn}>SCOPRI SE FA PER TE</Link>
          </div>
        </FadeUp>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ferro-core-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

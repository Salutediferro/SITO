import FadeUp from '../ui/FadeUp';
import { MODULES } from '../../constants/panels';

function getIcon(iconId) {
  const size = 28;
  const color = '#EC4757';
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (iconId) {
    case 'heart':
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'dna':
      return (
        <svg {...props}>
          <path d="M7 4v2c0 3.3 2.7 6 6 6h0c3.3 0 6 2.7 6 6v2" />
          <path d="M17 4v2c0 3.3-2.7 6-6 6h0c-3.3 0-6 2.7-6 6v2" />
          <line x1="7" y1="7" x2="17" y2="7" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <line x1="7" y1="17" x2="17" y2="17" />
        </svg>
      );
    case 'kidney':
      return (
        <svg {...props}>
          <path d="M8 3C5.2 3 3 5.7 3 9c0 2.5 1 4.5 2.5 5.8C7 16 8 18 8 21h2c0-3.5-1.2-5.8-3-7.5C5.8 12.3 5 10.8 5 9c0-2.5 1.5-4 3-4s3 1.5 3 4c0 2-.5 3-1 4h2.5c.3-1 .5-2.3.5-4 0-3.3-2.2-6-5-6z" />
          <path d="M16 3c2.8 0 5 2.7 5 6 0 2.5-1 4.5-2.5 5.8C17 16 16 18 16 21h-2c0-3.5 1.2-5.8 3-7.5C18.2 12.3 19 10.8 19 9c0-2.5-1.5-4-3-4s-3 1.5-3 4c0 2 .5 3 1 4h-2.5c-.3-1-.5-2.3-.5-4 0-3.3 2.2-6 5-6z" />
        </svg>
      );
    case 'liver':
      return (
        <svg {...props}>
          <path d="M4 12c0-4 2-7 5-8 2-.7 4 0 5.5 1C16 6 18 7 20 8c1.5 1 2 3 1 5s-3 4-6 5c-2.5.8-5 .5-7-1C5.5 15.5 4 14 4 12z" />
          <path d="M12 5c0 3-1 5.5-3 7" />
        </svg>
      );
    case 'metabolism':
      return (
        <svg {...props}>
          <path d="M17 2l3 3-3 3" />
          <path d="M20 5H10c-3.3 0-6 2.7-6 6" />
          <path d="M7 22l-3-3 3-3" />
          <path d="M4 19h10c3.3 0 6-2.7 6-6" />
        </svg>
      );
    case 'thyroid':
      return (
        <svg {...props}>
          <path d="M12 4v4" />
          <path d="M8 8c-2 0-4 2-4 5s2 5 4 5c1.5 0 3-1 4-3 1 2 2.5 3 4 3 2 0 4-2 4-5s-2-5-4-5c-1.5 0-3 1-4 3-1-2-2.5-3-4-3z" />
        </svg>
      );
    case 'recovery':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke={color} />
        </svg>
      );
    case 'woman':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="5" />
          <line x1="12" y1="13" x2="12" y2="21" />
          <line x1="9" y1="18" x2="15" y2="18" />
        </svg>
      );
    default:
      return null;
  }
}

const s = {
  section: {
    padding: 'clamp(64px, 9vw, 120px) 40px', maxWidth: 1200, margin: '0 auto',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12, textAlign: 'center',
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2, color: 'var(--text)', textAlign: 'center', marginBottom: 12,
  },
  sub: {
    fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    textAlign: 'center', maxWidth: 640, margin: '0 auto 48px',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  card: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 24, position: 'relative',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    display: 'flex', flexDirection: 'column', height: '100%',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
  },
  name: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2,
    color: 'var(--text)',
  },
  tags: {
    display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12,
    minHeight: 32,
  },
  tagBadge: {
    fontSize: 11, padding: '4px 10px', borderRadius: 12,
    background: 'rgba(236,71,87,0.08)', border: '1px solid rgba(236,71,87,0.2)',
    color: 'var(--accent)',
  },
  desc: {
    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12,
    flex: 1,
  },
  meta: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 'auto',
  },
  tests: {
    fontSize: 12, color: 'var(--text-sec)', fontWeight: 500,
  },
  gender: {
    fontSize: 10, letterSpacing: 2, fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    padding: '3px 10px', borderRadius: 4,
    background: 'rgba(236,71,87,0.1)', color: 'var(--accent)',
  },
  price: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1,
    color: 'var(--text)', fontWeight: 700,
  },
};

export default function ModulesGrid() {
  return (
    <section style={s.section}>
      <FadeUp>
        <div style={s.tag}>Vai in profondità dove serve</div>
        <h2 style={s.h2}>I MODULI FERRO</h2>
        <p style={s.sub}>
          Ogni modulo risponde a un problema specifico. Il Test di Ferro ti dice quali ti servono davvero. Niente esami inutili, niente soldi buttati.
        </p>
      </FadeUp>

      <div style={s.grid}>
        {MODULES.map((mod, i) => (
          <FadeUp key={mod.id} delay={i * 0.08} style={{ height: '100%' }}>
            <div className="card-hover" style={s.card}>
              <div style={s.cardHeader}>
                {mod.icon && getIcon(mod.icon)}
                <h3 style={s.name}>{mod.name}</h3>
              </div>
              <div style={s.tags}>
                {mod.tags.map(t => <span key={t} style={s.tagBadge}>{t}</span>)}
              </div>
              <p style={s.desc}>{mod.desc}</p>
              <div style={s.meta}>
                <span style={s.tests}>{mod.tests} esami</span>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  {mod.gender && <span style={s.gender}>{mod.gender}</span>}
                  {mod.price && <span style={s.price}>{mod.price}\u20ac</span>}
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

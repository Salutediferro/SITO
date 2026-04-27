import FadeUp from '../ui/FadeUp';
import { FEATURES } from '../../constants/panels';

const s = {
  section: {
    padding: '80px 40px', maxWidth: 1200, margin: '0 auto',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
  },
  card: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 32, borderLeft: '4px solid var(--accent)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    height: '100%', display: 'flex', flexDirection: 'column',
  },
  title: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 28,
    letterSpacing: 2, color: 'var(--text)', marginBottom: 12,
  },
  desc: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
  },
};

export default function Features() {
  return (
    <section style={s.section}>
      <div style={s.grid}>
        {FEATURES.map((f, i) => (
          <FadeUp key={i} delay={i * 0.15} style={{ height: '100%' }}>
            <div style={s.card} className="card-hover">
              <h3 style={s.title}>{f.title}</h3>
              <p style={s.desc}>{f.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

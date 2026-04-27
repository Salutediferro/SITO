import { useEffect, useRef, useState } from 'react';
import FadeUp from '../ui/FadeUp';

const stats = [
  { target: 328, suffix: '+', label: 'Atleti testati' },
  { target: 2400, suffix: '+', label: 'Esami processati' },
  { target: 72, suffix: 'H', label: 'Tempo massimo' },
  { target: 4.9, suffix: '\u2605', label: 'Soddisfazione', decimals: 1 },
];

function useCountUp(target, decimals = 0, trigger) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [trigger, target, decimals]);

  return value;
}

function StatItem({ target, suffix, label, decimals = 0, trigger }) {
  const count = useCountUp(target, decimals, trigger);
  return (
    <div style={s.stat}>
      <div style={s.number}>
        {decimals ? count.toFixed(decimals) : Math.round(count)}
        <span style={s.suffix}>{suffix}</span>
      </div>
      <div style={s.label}>{label}</div>
    </div>
  );
}

const s = {
  section: {
    position: 'relative',
    padding: 'clamp(48px, 7vw, 96px) 40px',
    background: 'var(--bg-card)',
    borderTop: '2px solid transparent',
    borderImage: 'linear-gradient(90deg, var(--accent), var(--gold)) 1',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 32,
  },
  stat: {
    textAlign: 'center',
    padding: '20px 0',
  },
  number: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(36px, 5vw, 56px)',
    color: 'var(--text)',
    lineHeight: 1,
    marginBottom: 8,
  },
  suffix: {
    fontSize: '0.6em',
    color: 'var(--accent)',
  },
  label: {
    fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    fontSize: 13,
    color: 'var(--text-sec)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: 400,
  },
};

export default function Stats() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={s.section}>
      <FadeUp>
        <div style={s.inner}>
          {stats.map((item, i) => (
            <StatItem key={i} {...item} trigger={visible} />
          ))}
        </div>
      </FadeUp>

      <style>{`
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

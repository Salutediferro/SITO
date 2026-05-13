import { useEffect, useRef, useState } from 'react';
import FadeUp from '../ui/FadeUp';

/* ──────────────────────────────────────────────────────────────────────
   Counter animato con requestAnimationFrame.
   - easing easeOutQuart: parte rapidamente, decelera negli ultimi decimi
   - hard clamp a target value (anti-oscillazione)
   - rispetta prefers-reduced-motion (snap a target)
   - cleanup safe via flag `done` su unmount/re-trigger
   ────────────────────────────────────────────────────────────────────── */
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

function Counter({ from, to, suffix = '', duration = 3500, trigger, onComplete }) {
  const [value, setValue] = useState(from);
  const onCompleteRef = useRef(onComplete);
  const startedRef = useRef(false);

  /* Mantengo onComplete fresca senza ri-triggerare l'animazione. */
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!trigger) return;
    /* Guard one-shot: anche se React StrictMode in dev rimonta, parto una volta sola. */
    if (startedRef.current) return;
    startedRef.current = true;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(to);
      onCompleteRef.current?.();
      return;
    }

    let raf;
    let done = false;
    const start = performance.now();

    const tick = (now) => {
      if (done) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutQuart(t);
      const current = from + (to - from) * eased;

      if (t >= 1) {
        done = true;
        setValue(to);
        onCompleteRef.current?.();
        return;
      }
      setValue(Math.floor(current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
    };
  }, [trigger, from, to, duration]);

  return (
    <>
      {value}
      {suffix}
    </>
  );
}

const s = {
  section: {
    padding: '48px 40px',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    background: 'linear-gradient(180deg, rgba(236,71,87,0.03) 0%, transparent 100%)',
  },
  inner: {
    maxWidth: 1000,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 0,
  },
  stat: {
    textAlign: 'center',
    minWidth: 140,
    margin: 0,
  },
  number: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(36px, 5vw, 52px)',
    color: 'var(--accent)',
    letterSpacing: 2,
    lineHeight: 1,
    margin: 0,
    display: 'inline-block',
    willChange: 'transform',
  },
  label: {
    fontSize: 13,
    color: 'var(--text-sec)',
    fontWeight: 300,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 48,
    background: 'var(--border)',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};

export default function ClientProof() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [impactPregiudizi, setImpactPregiudizi] = useState(false);
  const [impactSbatti, setImpactSbatti] = useState(false);

  /* IntersectionObserver: trigger ONE-SHOT a 50% visibility, poi unobserve. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={s.section} className="stats-container" aria-label="Numeri chiave Salute di Ferro">
      <FadeUp>
        <dl style={s.inner}>
          {/* MEDICI · 0 → 100% */}
          <div style={s.stat}>
            <dd style={s.number} aria-hidden="true">
              <Counter from={0} to={100} suffix="%" duration={3500} trigger={inView} />
            </dd>
            <span style={s.srOnly}>100 percento Medici ENORMI</span>
            <dt style={s.label}>Medici ENORMI</dt>
          </div>

          <div style={s.divider} className="proof-divider" aria-hidden="true" />

          {/* ESAMI · 800 → 72H */}
          <div style={s.stat}>
            <dd style={s.number} aria-hidden="true">
              <Counter from={800} to={72} suffix="H" duration={3500} trigger={inView} />
            </dd>
            <span style={s.srOnly}>72 ore i tuoi esami in</span>
            <dt style={s.label}>i tuoi esami in</dt>
          </div>

          <div style={s.divider} className="proof-divider" aria-hidden="true" />

          {/* PREGIUDIZI · 100 → 0 + impact pop */}
          <div style={s.stat}>
            <dd
              style={s.number}
              className={impactPregiudizi ? 'stat-impact' : ''}
              aria-hidden="true"
            >
              <Counter
                from={100}
                to={0}
                duration={3500}
                trigger={inView}
                onComplete={() => setImpactPregiudizi(true)}
              />
            </dd>
            <span style={s.srOnly}>0 Pregiudizi</span>
            <dt style={s.label}>Pregiudizi</dt>
          </div>

          <div style={s.divider} className="proof-divider" aria-hidden="true" />

          {/* SBATTI · 100 → 0 + impact pop */}
          <div style={s.stat}>
            <dd
              style={s.number}
              className={impactSbatti ? 'stat-impact' : ''}
              aria-hidden="true"
            >
              <Counter
                from={100}
                to={0}
                duration={3500}
                trigger={inView}
                onComplete={() => setImpactSbatti(true)}
              />
            </dd>
            <span style={s.srOnly}>0 Sbatti</span>
            <dt style={s.label}>Sbatti</dt>
          </div>
        </dl>
      </FadeUp>

      <style>{`
        @keyframes stat-impact {
          0%   { transform: scale(1);   color: var(--accent); text-shadow: none; }
          50%  { transform: scale(1.1); color: #FF6B7C; text-shadow: 0 0 18px rgba(236,71,87,0.6); }
          100% { transform: scale(1);   color: var(--accent); text-shadow: none; }
        }
        .stat-impact {
          animation: stat-impact 300ms ease-out both;
        }
        @media (max-width: 600px) {
          .proof-divider { display: none !important; }
          /* 4 stats su 1 riga mobile (era flex-wrap a 1 col). Compact: nowrap + flex 1 + min-width 0
             + font number ridotto + font label 10px. Validate accessibility-lead (sr-only resta intatto). */
          .stats-container { padding: 32px 12px !important; }
          .stats-container dl {
            flex-wrap: nowrap !important;
            gap: 8px !important;
            justify-content: space-between !important;
          }
          .stats-container dl > div {
            min-width: 0 !important;
            flex: 1 1 0 !important;
          }
          .stats-container dl > div dd {
            font-size: clamp(20px, 7vw, 28px) !important;
          }
          .stats-container dl > div dt {
            font-size: 10px !important;
            letter-spacing: 0.3px !important;
            line-height: 1.3 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .stat-impact { animation: none; }
        }
      `}</style>
    </section>
  );
}

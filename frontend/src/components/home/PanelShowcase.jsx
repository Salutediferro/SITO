import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';
import { FERRO_CORE, MODULES } from '../../constants/panels';

// Quiz interno SPA · /test (era https://form.salutediferro.com — Pages legacy non aggiornato).
const TEST_PATH = '/test';

/* Slide data: tutto letto dinamicamente da constants/panels.js (single source of
 * truth). Per modificare un copy descrittivo dello slider, cercare la chiave
 * `showcase` del relativo pannello in constants/panels.js. */
const SLIDES = [FERRO_CORE, ...MODULES].map((panel) => ({
  name: panel.name,
  price: panel.price,
  ...panel.showcase,
}));

const INTERVAL = 10000;

const s = {
  section: {
    padding: 'clamp(64px, 9vw, 120px) 40px', maxWidth: 1200, margin: '0 auto',
  },
  layout: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12,
    transition: 'opacity 0.4s ease',
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)',
    letterSpacing: 2, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20,
  },
  accent: { color: 'var(--accent)' },
  desc: {
    fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    marginBottom: 24,
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 28px',
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
    border: 'none', borderRadius: 6, color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
  },
  imgWrap: {
    position: 'relative', borderRadius: 12, overflow: 'hidden',
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  img: {
    width: '100%', height: '100%', objectFit: 'cover',
    opacity: 0.85,
    transition: 'opacity 0.6s ease',
  },
  badge: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    background: 'rgba(10,10,12,0.82)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '12px 16px',
    transition: 'opacity 0.4s ease',
  },
  badgeTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2,
    color: 'var(--accent)', marginBottom: 4,
  },
  badgeText: {
    fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5,
  },
  /* ── dots navigation ── */
  dots: {
    display: 'flex', gap: 0, marginTop: 24, alignItems: 'center',
    flexWrap: 'wrap',
  },
  /* Touch target ≥44px (WCAG 2.5.5 AAA): button 44x44, dot visivo 10px via background. */
  dot: {
    width: 44, height: 44, borderRadius: '50%',
    background: 'transparent',
    border: 'none', cursor: 'pointer',
    padding: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s ease',
  },
  dotActive: {
    width: 44, height: 44, borderRadius: '50%',
    background: 'transparent',
    border: 'none', cursor: 'pointer',
    padding: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  },
  dotInner: {
    display: 'block',
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--border)',
    transition: 'background 0.3s, transform 0.3s',
  },
  dotInnerActive: {
    display: 'block',
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--accent)',
    transform: 'scale(1.3)',
    boxShadow: '0 0 8px var(--accent-glow)',
  },
  /* ── text fade transition ── */
  textWrap: {
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  },
};

export default function PanelShowcase() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((idx) => {
    setFade(false);
    setTimeout(() => {
      setActive(idx);
      setFade(true);
    }, 350);
  }, []);

  // auto-advance — pausa SOLO se utente preferisce reduced-motion (WCAG 2.2.2 minimo) o tab nascosta (perf)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    let timer = null;
    const start = () => {
      if (!timer) timer = setInterval(() => {
        goTo((active + 1) % SLIDES.length);
      }, INTERVAL);
    };
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };
    const onVisChange = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisChange);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, [active, goTo]);

  const slide = SLIDES[active];

  return (
    <section style={s.section}>
      <div style={s.layout} className="panel-showcase-grid">
        <FadeUp>
          <div style={{
            ...s.textWrap,
            opacity: fade ? 1 : 0,
            transform: fade ? 'translateY(0)' : 'translateY(8px)',
          }}>
            <div style={s.tag}>{slide.tag}</div>
            <h2 style={s.h2}>
              {slide.headline.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
              <span style={s.accent}>{slide.headlineAccent}</span>
            </h2>
            <p style={s.desc}>{slide.desc}</p>
            <div style={{display:'flex', gap: 12, flexWrap:'wrap'}}>
              <Link to={TEST_PATH} style={s.btn}>
                FAI IL TEST DI FERRO
              </Link>
              <Link to="/pannelli" style={{...s.btn, background:'transparent', border:'1.5px solid var(--border-hover)', boxShadow:'none', color:'var(--text)'}}>
                SCOPRI TUTTI I PANNELLI
              </Link>
            </div>
          </div>

          {/* Dots · hit area 44x44 WCAG 2.5.5 AAA · dot visivo 8px centrato */}
          <div style={s.dots} role="tablist" aria-label="Naviga tra i pannelli">
            {SLIDES.map((slideData, i) => (
              <button
                key={i}
                style={i === active ? s.dotActive : s.dot}
                onClick={() => goTo(i)}
                aria-label={`Vai al pannello ${slideData.name}`}
                aria-current={i === active ? 'true' : undefined}
                role="tab"
                aria-selected={i === active}
              >
                <span style={i === active ? s.dotInnerActive : s.dotInner} aria-hidden="true" />
              </button>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div style={s.imgWrap}>
            <img
              src={slide.img}
              alt={slide.imgAlt}
              style={{
                ...s.img,
                opacity: fade ? 0.85 : 0,
              }}
              loading="lazy"
            />
            <div style={{
              ...s.badge,
              opacity: fade ? 1 : 0,
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={s.badgeTitle}>{slide.name}</div>
                {slide.price && <div style={{fontFamily:"'Antonio', 'Bebas Neue', sans-serif", fontSize:20, color:'var(--text)', letterSpacing:1}}>{slide.price}&euro;</div>}
              </div>
              <div style={s.badgeText}>{slide.badge}</div>
            </div>
          </div>
        </FadeUp>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .panel-showcase-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

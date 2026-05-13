import FadeUp from '../ui/FadeUp';

/* ──────────────────────────────────────────────────────────────────────
   Pattern "high-tech medical": onde sinuose orizzontali tipo ECG/topo,
   stroke 0.5px @ 5% opacity, mask radial pulisce il centro card.
   3 varianti distinte per variety visiva tra le 3 card.
   ────────────────────────────────────────────────────────────────────── */
function generateWaves(variant) {
  const waves = [];
  for (let i = 0; i < 10; i++) {
    const y = 30 + i * 40;
    let d;
    if (variant === 0) {
      // Onde dolci uniformi (ECG calmo)
      d = `M -20 ${y} C 80 ${y - 15}, 160 ${y + 15}, 240 ${y - 10} S 380 ${y + 8}, 440 ${y}`;
    } else if (variant === 1) {
      // Onde frequenza alta (tech bioelettrico)
      d = `M -20 ${y} Q 50 ${y - 20}, 100 ${y} T 200 ${y} T 300 ${y} T 400 ${y} T 500 ${y}`;
    } else {
      // Onde irregolari (topografia organica)
      d = `M -20 ${y} C 60 ${y + 12}, 130 ${y - 18}, 220 ${y + 8} C 290 ${y + 22}, 360 ${y - 14}, 440 ${y}`;
    }
    waves.push(d);
  }
  return waves;
}

function TopoPattern({ variant }) {
  const waves = generateWaves(variant % 3);
  return (
    <div className="hiw-pattern" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <g
          stroke="var(--accent)"
          strokeWidth="0.5"
          strokeOpacity="0.14"
          fill="none"
          vectorEffect="non-scaling-stroke"
        >
          {waves.map((d, idx) => (
            <path key={idx} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}

const steps = [
  {
    num: '01',
    title: 'FAI IL TEST',
    desc: 'Domande dirette su allenamento, sintomi e storia. In 2 minuti capiamo come aiutarti.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'RICEVI IL TUO PROTOCOLLO',
    desc: 'Pannello FERRO CORE + 8 moduli specifici per i tuoi sintomi. Zero esami a caso: ogni marker ha una ragione.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'FAI IL PRELIEVO E AGISCI',
    desc: 'Prelievo nel laboratorio convenzionato. Risultati subito, percorso condiviso con il tuo Coach di Ferro. Zero Sbatti.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2v7.31" />
        <path d="M14 9.3V1.99" />
        <path d="M8.5 2h7" />
        <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
        <path d="M5.52 16h12.96" />
      </svg>
    ),
  },
];

const s = {
  section: {
    padding: 'clamp(48px, 7vw, 96px) 40px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 14,
    letterSpacing: 4,
    color: 'var(--accent)',
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2,
    color: 'var(--text)',
    textAlign: 'center',
    marginBottom: 56,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
    gap: 24,
    justifyContent: 'center',
    maxWidth: 1100,
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, var(--bg-card) 0%, #0F0F12 100%)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '56px 32px 32px',
    minHeight: 360,
    flex: 1,
    transition: 'transform 240ms var(--ease-standard), border-color 240ms, box-shadow 240ms',
    display: 'flex',
    flexDirection: 'column',
  },
  watermark: {
    position: 'absolute',
    top: -16,
    right: 8,
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(120px, 14vw, 180px)',
    fontWeight: 900,
    lineHeight: 0.85,
    letterSpacing: -2,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(236,71,87,0.10)',
    color: 'var(--accent)',
    border: '1px solid rgba(236,71,87,0.25)',
  },
  title: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'var(--text-h3)',
    letterSpacing: 1.5,
    color: 'var(--text)',
    margin: 0,
  },
  desc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-sec)',
    lineHeight: 1.65,
    margin: 0,
  },
};

export default function HowItWorks() {
  return (
    <section style={s.section} aria-labelledby="hiw-heading">
      <FadeUp>
        <div style={s.tag}>Tre passi, zero complicazioni</div>
        <h2 id="hiw-heading" style={s.h2}>COME FUNZIONA</h2>
      </FadeUp>
      <ol
        style={s.list}
        className="hiw-list"
        tabIndex={0}
        role="region"
        aria-label="Come funziona, 3 passi. Scorri orizzontalmente per esplorare."
      >
        {steps.map((step, i) => (
          <FadeUp key={i} delay={i * 0.15} style={{ height: '100%' }}>
            <li style={{ listStyle: 'none', height: '100%', display: 'flex' }}>
              <article style={s.card} className="hiw-card">
                <TopoPattern variant={i} />
                <span style={s.watermark} className="hiw-watermark" aria-hidden="true">{step.num}</span>
                <div style={s.content}>
                  <div style={s.iconWrap}>{step.icon}</div>
                  <h3 style={s.title}>
                    <span className="sr-only">Passo {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p style={s.desc}>{step.desc}</p>
                </div>
              </article>
            </li>
          </FadeUp>
        ))}
      </ol>

      <style>{`
        .hiw-pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          -webkit-mask-image: radial-gradient(ellipse 65% 55% at center, transparent 10%, black 100%);
          mask-image: radial-gradient(ellipse 65% 55% at center, transparent 10%, black 100%);
        }

        .hiw-watermark {
          color: var(--accent-fill);
          opacity: 0.22;
          z-index: 1;
          transition: opacity 320ms var(--ease-standard), color 320ms, text-shadow 320ms;
        }

        @media (hover: hover) and (pointer: fine) {
          .hiw-card:hover {
            transform: translateY(-4px);
            border-color: var(--accent);
            box-shadow: var(--shadow-lift);
          }
          .hiw-card:hover .hiw-watermark {
            color: var(--accent);
            opacity: 0.55;
            text-shadow: 0 0 60px rgba(236,71,87,0.45);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hiw-card { transition: none; }
          .hiw-watermark { transition: none; }
        }

        @media (forced-colors: active) {
          .hiw-pattern { display: none; }
        }

        /* Mobile fix: watermark numero centrato + dimensioni ridotte.
           Layout horizontal scroll-snap per affiancare 3 step (era stack vertical = 1100px+).
           Container <ol> keyboard-operable via tabIndex+role+aria-label (validate accessibility-lead). */
        @media (max-width: 600px) {
          .hiw-watermark {
            font-size: clamp(80px, 22vw, 110px) !important;
            top: 8px !important;
            right: auto !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            opacity: 0.18 !important;
          }
          .hiw-list {
            display: flex !important;
            grid-template-columns: none !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 16px !important;
            padding: 4px 20px 20px;
            margin: 0 -20px !important;
            scrollbar-width: thin;
            -webkit-overflow-scrolling: touch;
            max-width: none !important;
          }
          .hiw-list > * {
            flex: 0 0 78%;
            scroll-snap-align: center;
            min-width: 0;
          }
          .hiw-card {
            max-width: 100% !important;
            margin: 0 !important;
            min-height: 320px !important;
            padding: 44px 20px 24px !important;
          }
        }
        .hiw-list:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
          border-radius: 8px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </section>
  );
}

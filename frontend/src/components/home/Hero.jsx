import { useState } from 'react';
import { Link } from 'react-router-dom';

const ROTATING_PHRASES = [
  'Sempre stanco ma non sai perch\u00e9?',
  'Da quando hai 40 anni ti senti sempre pi\u00f9 stanco?',
  'Libido in calo, e non solo quella?',
  'Hai mai controllato il testosterone?',
  'Dopo i 40 il testosterone cala. E il tuo?',
  'Spingi tutti i giorni ma senza risultati?',
  '100% allenamento + 0% testosterone = no risultati',
  'La potenza \u00e8 nulla senza controllo\u2026Di Ferro',
  'Valori strani? Rendili di Ferro',
  'Non sai che esami fare? Noi s\u00ec',
  'I nostri medici spingono il Ferro. Il tuo no',
  'Hai preso sostanze? Benvenuto',
  'Enorme e in salute fino a 100 anni? Si pu\u00f2',
  '\u2013 Pausa + Donna',
  'La menopausa ti uccide? Resuscita con Noi',
];

const s = {
  section: {
    position: 'relative', minHeight: 'calc(100vh - 72px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '80px 40px', overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, rgba(8,14,28,0.95) 0%, rgba(8,14,28,0.7) 50%, rgba(8,14,28,0.85) 100%)',
    zIndex: 1,
  },
  meshBg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(-45deg, rgba(248,113,113,0.06), rgba(239,68,68,0.04), rgba(8,14,28,0.9), rgba(248,113,113,0.05))',
    backgroundSize: '400% 400%',
    animation: 'gradientMesh 15s ease infinite',
    zIndex: 1,
  },
  bgImage: {
    position: 'absolute', inset: 0,
    backgroundImage: 'url("/hero-bg.jpg")',
    backgroundSize: 'cover', backgroundPosition: 'center top',
    opacity: 0.35,
    filter: 'brightness(1.2) contrast(1.1)',
  },
  content: {
    position: 'relative', zIndex: 2,
    maxWidth: 900, textAlign: 'center',
  },
  tag: {
    display: 'inline-block', padding: '8px 20px',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 4,
    color: 'var(--gold)', background: 'rgba(251,191,36,0.1)',
    border: '1px solid rgba(251,191,36,0.25)', borderRadius: 4,
    marginBottom: 24,
  },
  h1: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(32px, 6vw, 64px)', lineHeight: 1.08,
    letterSpacing: 2, color: 'var(--text)', marginBottom: 24,
    minHeight: 'clamp(80px, 14vw, 150px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  phrase: {
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  sub: {
    fontSize: 17, color: 'var(--text-sec)', lineHeight: 1.7,
    maxWidth: 640, marginBottom: 40, fontWeight: 300,
    margin: '0 auto 40px',
  },
  buttons: {
    display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '16px 32px',
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
    border: 'none', borderRadius: 6, color: 'white',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    animation: 'glowPulse 2s ease-in-out infinite',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '16px 32px',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 6,
    color: 'var(--text)',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    backdropFilter: 'blur(4px)',
  },
};

export default function Hero() {
  const [phraseIdx] = useState(() => Math.floor(Math.random() * ROTATING_PHRASES.length));

  return (
    <section style={s.section}>
      <div style={s.bgImage} />
      <div style={s.bg} />
      <div style={s.meshBg} />
      <div style={s.content}>
        <div style={s.tag}>LA PALESTRA DELLA SALUTE</div>
        <h1 style={s.h1}>
          <span className="gradient-text">
            {ROTATING_PHRASES[phraseIdx]}
          </span>
        </h1>
        <p style={s.sub}>
          Esami del sangue costruiti su linee guida internazionali, pensati per chi si allena davvero. Testosterone, fegato, reni, tiroide: tutto in un unico percorso. Zero pregiudizi, zero sbatti.
        </p>
        <div style={s.buttons}>
          <Link to="/test" style={s.btnPrimary}>
            FAI IL TEST DI FERRO
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link to="/pannelli" style={s.btnSecondary}>
            SCOPRI I PANNELLI
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes gradientMesh {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 3px 14px rgba(248,113,113,0.15); }
          50% { box-shadow: 0 3px 28px rgba(248,113,113,0.35), 0 0 60px rgba(248,113,113,0.1); }
        }
        @media (max-width: 768px) {
          section > div:last-of-type { padding: 60px 20px !important; }
        }
      `}</style>
    </section>
  );
}

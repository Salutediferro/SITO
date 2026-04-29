import { useState } from 'react';
import { Link } from 'react-router-dom';
import PricePromo from '../ui/PricePromo';
import { PAYMENT_LINKS } from '../../constants/payments';

const FORM_URL = 'https://form.salutediferro.com';

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
    padding: 'clamp(64px, 9vw, 120px) 40px', overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.7) 50%, rgba(10,10,12,0.85) 100%)',
    zIndex: 1,
  },
  meshBg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(-45deg, rgba(236,71,87,0.06), rgba(122,8,21,0.04), rgba(10,10,12,0.9), rgba(236,71,87,0.05))',
    backgroundSize: '400% 400%',
    backgroundPosition: '0% 50%',
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
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 4,
    color: 'var(--gold)', background: 'rgba(200,200,204,0.1)',
    border: '1px solid rgba(200,200,204,0.25)', borderRadius: 4,
    marginBottom: 24,
  },
  h1: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
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
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
    transition: 'transform var(--motion-base) var(--ease-standard), box-shadow var(--motion-base) var(--ease-standard)',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '16px 32px',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 8,
    color: 'var(--text)',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    transition: 'transform var(--motion-base) var(--ease-standard), border-color var(--motion-base) var(--ease-standard), background var(--motion-base) var(--ease-standard), box-shadow var(--motion-base) var(--ease-standard)',
    backdropFilter: 'blur(4px)',
  },
};

export default function Hero() {
  const [phraseIdx] = useState(() => Math.floor(Math.random() * ROTATING_PHRASES.length));

  return (
    <section style={s.section}>
      <div style={s.bgImage} />
      <div style={s.bg} />
      <div style={s.meshBg} className="hero-mesh" />
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

        {/* Promo lancio: 2 prodotti distinti, layout simmetrico (stesso pattern card). */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginTop: 24,
          marginBottom: 40,
          maxWidth: 820,
          marginLeft: 'auto',
          marginRight: 'auto',
          alignItems: 'stretch',
          padding: '0 8px', // spazio per badge fluttuante non clippato
        }}>
          <PricePromo
            fullPrice={47}
            promoPrice={27}
            currency="€"
            label="Consulenza 30 minuti"
            badge="CONSULENZA"
            savings="Risparmi €20 (-43%)"
            href={PAYMENT_LINKS.consulenza}
            ariaLabel="Acquista la consulenza Salute di Ferro: da 47 euro scontata a 27 euro"
          />
          <PricePromo
            fullPrice={297}
            promoPrice={197}
            period="/anno"
            currency="€"
            label="Annulla quando vuoi"
            badge="MEMBERSHIP"
            savings="Risparmi €100 (-34%)"
            href="/coming-soon"
            ariaLabel="Membership annuale a 197 euro: disponibile a breve, vai alla pagina informativa"
          />
        </div>

        <div style={s.buttons}>
          <a href={FORM_URL} style={s.btnPrimary} className="hero-cta">
            FAI IL TEST DI FERRO
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <Link to="/pannelli" style={s.btnSecondary} className="btn-lift">
            SCOPRI I PANNELLI
          </Link>
        </div>
      </div>

      <style>{`
        /* Hero ambient animations: ON solo per utenti che NON preferiscono ridurre il movimento */
        @media (prefers-reduced-motion: no-preference) {
          .hero-mesh { animation: gradientMesh 18s ease-in-out infinite; }
          .hero-cta { animation: glowPulse 2.4s ease-in-out infinite; }
        }
        @media (max-width: 768px) {
          section > div:last-of-type { padding: 60px 20px !important; }
        }
      `}</style>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import PricePromo from '../ui/PricePromo';
import FounderPassCard from './FounderPassCard';
import useFounderSlots from '../../hooks/useFounderSlots';
import { PAYMENT_LINKS } from '../../constants/payments';

// Quiz interno SPA · route /test → <TestPage> → <QuizContainer>.
// (in passato puntava a https://form.salutediferro.com che però servito dal Pages legacy
// `type-form` non aggiornato — issue P2.2 roadmap, fix 6 mag 2026.)
const TEST_PATH = '/test';

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
  'Solo. Medici. Grossi.',
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
    padding: 'clamp(48px, 9vw, 120px) clamp(20px, 5vw, 40px)', overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    // Overlay più trasparente al centro (era 0.55 → 0.42) per far vedere meglio maglietta SDF.
    // Top + bottom restano densi per garantire contrasto leggibilità heading + sub text.
    // Overlay più scuro al centro (0.42 → 0.60) per garantire contrast WCAG AA 4.5:1
    // sul heading rotante su nuovo bg FIBO caotico (statua bronzo + folla + tappeto rosso).
    background: 'linear-gradient(180deg, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.60) 45%, rgba(10,10,12,0.68) 70%, rgba(10,10,12,0.92) 100%)',
    zIndex: 1,
  },
  meshBg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(-45deg, rgba(236,71,87,0.06), rgba(122,8,21,0.04), rgba(10,10,12,0.85), rgba(236,71,87,0.05))',
    backgroundSize: '400% 400%',
    backgroundPosition: '0% 50%',
    zIndex: 1,
  },
  bgImage: {
    position: 'absolute', inset: 0,
    // Foto FIBO "matteo_arnold" (clean version): top 516px tagliato → 1920×1397 cinematic 1.375:1.
    // Soggetto SDF da dietro (centro-sinistra) + statua bronzo Arnold-style (destra) + tappeto rosso.
    // Cache-bust via query param per forzare reload utenti con vecchia versione cachata.
    backgroundImage: 'url("/matteo_arnold.jpg?v=1")',
    // backgroundPosition: 30% center → soggetto SDF a sinistra del heading centrato,
    // statua bronzo verso destra ma non sotto la CTA. Crop top già fatto in src.
    backgroundSize: 'cover', backgroundPosition: '30% center',
    opacity: 0.85,
    // Iron Blood color grading: brightness 0.85 (scurisce hotspot luci padiglione),
    // contrast 1.3 (definizione muscoli/statua), saturate 1.25 (intensifica rosso tappeto + maglietta),
    // hue-rotate -3deg (push reds verso crimson coerente palette).
    filter: 'brightness(0.85) contrast(1.3) saturate(1.25) hue-rotate(-3deg)',
  },
  // Overlay scuro: alleggerito al centro per far emergere maglietta + logo.
  // Lasciate top/bottom scure per leggibilità heading + sub text.
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
    /* fontSize gestito da .hero-h1-len-{s|m|l|xl} per auto-shrink in base a length frase */
    lineHeight: 1.08,
    letterSpacing: 2, color: 'var(--text)', marginBottom: 24,
    minHeight: 'clamp(80px, 14vw, 150px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    // Text-shadow di sicurezza per hotspot luminosi locali sul nuovo bg FIBO (luci padiglione,
    // tappeto rosso saturo). Garantisce leggibilità anche se overlay locale è insufficiente.
    textShadow: '0 2px 12px rgba(0,0,0,0.7)',
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
  // Card €197 visibile SOLO quando posti Founder esauriti (ritorna come fallback post-200).
  // Mentre i Founder sono in vendita la card è nascosta (Hero mostra solo Founder Pass + €24,99/mese).
  const { slotsRemaining } = useFounderSlots();
  const founderSoldOut = slotsRemaining === 0;

  return (
    <section style={s.section}>
      <div style={s.bgImage} className="hero-bg-image" />
      <div style={s.bg} />
      <div style={s.meshBg} className="hero-mesh" />
      <div style={s.content}>
        <div style={s.tag} className="hero-tag">LA PALESTRA DELLA SALUTE</div>
        {/* Auto-shrink dinamico: classe in base a length della frase corrente per CSS adattivo. */}
        <h1
          style={s.h1}
          className={`hero-h1 hero-h1-len-${
            ROTATING_PHRASES[phraseIdx].length > 45 ? 'xl' :
            ROTATING_PHRASES[phraseIdx].length > 32 ? 'l' :
            ROTATING_PHRASES[phraseIdx].length > 22 ? 'm' : 's'
          }`}
        >
          <span className="gradient-text">
            {ROTATING_PHRASES[phraseIdx]}
          </span>
        </h1>
        <p style={s.sub} className="hero-sub">
          Esami del sangue costruiti su linee guida internazionali, pensati per chi si allena davvero. Testosterone, fegato, reni, tiroide: tutto in un unico percorso. Zero pregiudizi, zero problemi.
        </p>

        {/* Hero offer: Founder Pass €119/anno upfront (pagabile a rate), 200 posti, prezzo bloccato anche al rinnovo.
            Card scompare automaticamente quando i posti sono esauriti (utenti vedono solo il grid sotto). */}
        <FounderPassCard />

        {/* Promo lancio: 2 prodotti distinti, layout simmetrico (stesso pattern card). */}
        {/* Mobile-safe: minmax con min(280px, 100%) evita overflow su viewport stretti */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 'clamp(16px, 3vw, 24px)',
          marginTop: 24,
          marginBottom: 40,
          maxWidth: 820,
          marginLeft: 'auto',
          marginRight: 'auto',
          alignItems: 'stretch',
          padding: '0 8px', // spazio per badge fluttuante non clippato
          width: '100%',
        }}>
          <PricePromo
            fullPrice={47}
            promoPrice="24,99"
            period="/mese"
            currency="€"
            label="1 mese di membership + consulenza"
            badge="MEMBERSHIP + CONSULENZA"
            savings="Risparmi €22"
            href={PAYMENT_LINKS.consulenza}
            ariaLabel="Acquista 1 mese di membership più consulenza Salute di Ferro: prezzo originale 47 euro, scontato a 24 euro e 99 centesimi al mese. Risparmi 22 euro."
          />
          {/* Card Membership annuale €297→€197: visibile SOLO post-Founder (slotsRemaining===0).
              Decisione user 8 mag 2026: durante la vendita Founder la card è nascosta. */}
          {founderSoldOut && (
            <PricePromo
              fullPrice={297}
              promoPrice={197}
              period="/anno"
              monthlyEquivalent="16,42"
              currency="€"
              badge="MEMBERSHIP"
              savings="Risparmi €100 (-34%)"
              href={PAYMENT_LINKS.membershipAnnuale}
              ariaLabel="Sottoscrivi la Membership annuale Salute di Ferro: da 297 euro scontata a 197 euro all'anno, equivalenti a circa 16 euro e 42 centesimi al mese"
            />
          )}
        </div>

        <div style={s.buttons}>
          <Link to={TEST_PATH} style={s.btnPrimary} className="hero-cta hero-btn-primary">
            FAI IL TEST DI FERRO
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link to="/pannelli" style={s.btnSecondary} className="btn-lift hero-btn-secondary">
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

        /* Default font-size H1 hero (desktop): differenziato per length frase */
        .hero-h1-len-s  { font-size: clamp(36px, 6vw, 64px); }
        .hero-h1-len-m  { font-size: clamp(32px, 5.5vw, 60px); }
        .hero-h1-len-l  { font-size: clamp(28px, 5vw, 56px); }
        .hero-h1-len-xl { font-size: clamp(24px, 4.5vw, 48px); }
        @media (max-width: 768px) {
          section > div:last-of-type { padding: 60px 20px !important; }
          /* Mobile: crop ampio 1.1:1 quasi-quadrato (1200x1091) + cover.
             Mostra soggetto SDF + statua + tappeto rosso completi senza letterbox.
             Position 'center 35%' ancora un po' più in alto per evidenziare statua. */
          .hero-bg-image {
            background-image: url("/matteo_arnold-mobile.jpg?v=2") !important;
            background-size: cover !important;
            background-position: center 35% !important;
            opacity: 0.95 !important;
          }
        }

        /* Mobile fix Hero: tag letterSpacing ridotto + h1 più compatto + buttons full-width */
        @media (max-width: 600px) {
          .hero-tag {
            letter-spacing: 2px !important;
            font-size: 12px !important;
            padding: 6px 14px !important;
          }
          .hero-h1 {
            min-height: auto !important;
            margin-bottom: 16px !important;
            letter-spacing: 0.5px !important;
            line-height: 1.18 !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            hyphens: auto !important;
            padding: 0 12px !important;
            display: block !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .hero-h1 .gradient-text {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            text-wrap: balance !important;
          }
          /* Auto-shrink aggressivo in base a lunghezza frase (mobile ≤600px) */
          .hero-h1-len-s  { font-size: clamp(22px, 6.4vw, 30px) !important; }
          .hero-h1-len-m  { font-size: clamp(18px, 5.4vw, 26px) !important; letter-spacing: 0.4px !important; }
          .hero-h1-len-l  { font-size: clamp(15px, 4.4vw, 22px) !important; letter-spacing: 0.2px !important; line-height: 1.2 !important; }
          .hero-h1-len-xl { font-size: clamp(13px, 3.6vw, 18px) !important; letter-spacing: 0px !important; line-height: 1.25 !important; }
          .hero-sub {
            font-size: 14px !important;
            line-height: 1.55 !important;
            margin-bottom: 24px !important;
            padding: 0 12px !important;
            max-width: calc(100vw - 48px) !important;
            box-sizing: border-box !important;
          }
          .hero-btn-primary,
          .hero-btn-secondary {
            width: 100% !important;
            max-width: 320px !important;
            justify-content: center !important;
            padding: 14px 24px !important;
            font-size: 14px !important;
            letter-spacing: 2px !important;
          }
        }
      `}</style>
    </section>
  );
}

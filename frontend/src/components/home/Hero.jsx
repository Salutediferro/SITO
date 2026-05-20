import { useState } from 'react';
import { Link } from 'react-router-dom';
import PricePromo from '../ui/PricePromo';
import FounderPassCard from './FounderPassCard';
import HeroPricingMobile from './HeroPricingMobile';
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
  'I tuoi valori non sono normali? Per fortuna.',
  'Il tuo allenamento non \u00e8 per tutti. La tua Salute nemmeno.',
  'Enorme e in salute fino a 100 anni? Si pu\u00f2',
  '\u2013 Pausa + Donna',
  'La menopausa ti uccide? Resuscita con Noi',
];

const s = {
  section: {
    position: 'relative', minHeight: 'calc(100vh - 72px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    // Ridotto padding top/bottom (era 48-120) per portare FounderPassCard nel
    // viewport above-the-fold dopo refactor sub in bullet list (feedback 2026-05-18).
    padding: 'clamp(28px, 6vw, 80px) clamp(20px, 5vw, 40px)', overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    // Feedback cliente 2026-05-18 "Mammoli in home non si vede, tutto nero":
    // alleggerisco overlay al centro (era 0.60→0.30 a 40-55%) per far emergere
    // soggetto SDF al centro. Top + bottom restano densi (0.92) per leggibilità
    // tag/heading sopra e CTA sotto. Spostato il "buco chiaro" leggermente
    // più in basso (40-55%) dove sta il soggetto, non dove sta l'heading.
    background: 'linear-gradient(180deg, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.55) 40%, rgba(10,10,12,0.30) 55%, rgba(10,10,12,0.55) 75%, rgba(10,10,12,0.92) 100%)',
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
    // Hero "hero-trilli": compositing dark mood con soggetto SDF (logo maglietta)
    // centrato + 4 silhouette bodybuilder ai 4 angoli. 1402×1122, già desaturato B&W.
    // Cache-bust via query param per forzare reload utenti con vecchia versione cachata.
    backgroundImage: 'url("/hero-trilli.jpg?v=4")',
    // Feedback cliente 2026-05-20: "sposta tutta l'immagine verso destra,
    // almeno il ragazzo di fronte si vede e non viene coperto dalle scritte".
    // Source v=4 (1402×1122) ha soggetto centrale → con 'cover' + position center
    // finisce sotto H1+sub copy (anch'essi centrati). Zoom 130% + position left
    // espone il lato sinistro dell'immagine al container, spostando il soggetto
    // centrale verso la metà destra del viewport (fuori dall'area testo centrale).
    backgroundSize: '130% auto', backgroundPosition: 'left center',
    // Feedback cliente 2026-05-18: opacity 0.85→1.0 per non sbiadire ulteriormente
    // il soggetto centrale ("Mammoli") oltre l'overlay sopra.
    opacity: 1,
    // Color grading: brightness 0.9→1.05 per recuperare lume sul soggetto centrale
    // (era affogato dal mood dark). Contrast 1.15 mantenuto per definire le 4
    // silhouette ai lati.
    filter: 'brightness(1.05) contrast(1.15)',
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
    marginBottom: 14,
  },
  h1: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    /* fontSize gestito da .hero-h1-len-{s|m|l|xl} per auto-shrink in base a length frase */
    lineHeight: 1.08,
    letterSpacing: 2, color: 'var(--text)', marginBottom: 14,
    minHeight: 'clamp(60px, 10vw, 110px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    // Text-shadow di sicurezza per hotspot luminosi locali sul nuovo bg FIBO (luci padiglione,
    // tappeto rosso saturo). Garantisce leggibilità anche se overlay locale è insufficiente.
    textShadow: '0 2px 12px rgba(0,0,0,0.7)',
  },
  phrase: {
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  sub: {
    fontSize: 17, color: 'var(--text-sec)', lineHeight: 1.55,
    maxWidth: 640, fontWeight: 300,
    margin: '0 auto 10px',
  },
  subList: {
    // Lista features (4 bullet) · stessa font/colour del sub, ma compatta.
    // listStyle: 'none' + custom marker SVG per allineamento perfetto +
    // brand-coerenza (rosso accent).
    listStyle: 'none', padding: 0,
    maxWidth: 580, margin: '0 auto 12px',
    display: 'flex', flexDirection: 'column', gap: 6,
    textAlign: 'left',
  },
  subListItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    fontSize: 16, color: 'var(--text-sec)', lineHeight: 1.5,
    fontWeight: 300,
  },
  subListIcon: {
    flexShrink: 0, marginTop: 4, color: 'var(--accent)',
  },
  subClose: {
    fontSize: 16, color: 'var(--text)', lineHeight: 1.5,
    maxWidth: 640, marginBottom: 24, fontWeight: 500,
    margin: '0 auto 24px',
    letterSpacing: 0.3,
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
        <div style={s.tag} className="hero-tag">SPINGI. ALLA SALUTE PENSIAMO NOI</div>
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
          La prima piattaforma italiana per chi spinge il Ferro sul serio.
        </p>
        <ul style={s.subList} className="hero-sub-list" aria-label="Cosa offriamo">
          {[
            'Medici che capiscono il Ferro',
            'Esami del sangue su linee guida internazionali, pensati per chi si allena pesante',
            'Coach di Ferro dedicato che ti guida passo-passo nel percorso',
            'Dashboard sanitaria con tutte le tue analisi',
          ].map((item, i) => (
            <li key={i} style={s.subListItem}>
              <svg
                style={s.subListIcon}
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p style={s.subClose} className="hero-sub-close">
          Zero pregiudizi, zero problemi.
        </p>

        {/* Mobile (≤600px): rimpiazza FounderPassCard + grid sotto con layout compatto 2-col. */}
        <HeroPricingMobile />

        {/* Hero offer: Founder Pass €119/anno upfront (pagabile a rate), 200 posti, prezzo bloccato anche al rinnovo.
            Card scompare automaticamente quando i posti sono esauriti (utenti vedono solo il grid sotto).
            Desktop-only: classe hero-pricing-desktop hidden ≤600px (HeroPricingMobile prende il posto). */}
        <div className="hero-pricing-desktop">
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
        @media (max-width: 600px) {
          /* Mobile pricing: hide desktop cards (FounderPassCard + PricePromo grid).
             HeroPricingMobile prende il posto con layout 2-col compatto. */
          .hero-pricing-desktop { display: none !important; }
        }
        @media (max-width: 768px) {
          section > div:last-of-type { padding: 60px 20px !important; }
          /* Mobile: crop 9:16 portrait centrato (631×1122) del compositing hero-trilli.
             Feedback 2026-05-20: zoom 120% + position left per spostare soggetto
             centrale verso la metà destra del viewport (fuori area testo centrale).
             Stesso pattern del desktop. */
          .hero-bg-image {
            background-image: url("/hero-trilli-mobile.jpg?v=2") !important;
            background-size: 120% auto !important;
            background-position: left center !important;
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

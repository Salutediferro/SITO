import { useState, useEffect, useCallback } from 'react';
import FadeUp from '../ui/FadeUp';
import { FERRO_CORE, MODULES } from '../../constants/panels';

import { Link } from 'react-router-dom';

/* ── slide data: core + all modules ── */
const SLIDES = [
  {
    name: FERRO_CORE.name,
    price: FERRO_CORE.price,
    tag: 'Core Foundation',
    headline: 'IL TUO PUNTO\nDI PARTENZA',
    headlineAccent: 'OBBLIGATORIO',
    desc: 'Screening metabolico, epatico, renale, tiroideo e marziale. Include Testosterone e Vitamina D. Il pannello base che ogni atleta dovrebbe fare.',
    badge: `${FERRO_CORE.biomarkers.length} biomarcatori. Basato su EAU, ESC/EAS, KDIGO`,
    img: '/panels/panel-core.jpg',
    imgAlt: 'Bodybuilder in palestra',
  },
  {
    name: 'FERRO ANDROGENO',
    price: 125,
    tag: 'Modulo Add-on',
    headline: 'IL TUO ASSE\nORMONALE',
    headlineAccent: 'SOTTO CONTROLLO',
    desc: 'Asse androgenico completo + coagulazione + omocisteina. Per uomini sintomatici, in TRT o con storia di AAS.',
    badge: '12 biomarcatori. SHBG, Testosterone libero, LH, FSH, Estradiolo, PSA',
    img: '/panels/panel-androgeno-v2.jpg',
    imgAlt: 'Bodybuilder muscolare in allenamento',
  },
  {
    name: 'FERRO CUORE',
    price: 23,
    tag: 'Modulo Add-on',
    headline: 'IL TUO CUORE\nMERITA',
    headlineAccent: 'ATTENZIONE',
    desc: 'Rischio cardiovascolare avanzato. ApoB, Lp(a), VES, Acido urico. Per chi ha familiarità CVD, usa AAS o ha ipertensione.',
    badge: '4 biomarcatori. Basato su ESC/EAS 2025',
    img: '/panels/panel-cuore.jpg',
    imgAlt: 'Bodybuilder petto massiccio',
  },
  {
    name: 'FERRO RENI',
    price: 28,
    tag: 'Modulo Add-on',
    headline: 'PROTEINE ALTE\nRENI',
    headlineAccent: 'SOTTO PRESSIONE',
    desc: 'Funzione renale avanzata + elettroliti. Per bodybuilder, dieta iperproteica o uso di diuretici.',
    badge: '8 biomarcatori. Cistatina C, elettroliti completi',
    img: '/panels/panel-reni.jpg',
    imgAlt: 'Bodybuilder enorme allenamento',
  },
  {
    name: 'FERRO FEGATO',
    price: 12,
    tag: 'Modulo Add-on',
    headline: 'IL TUO FEGATO\nTI STA',
    headlineAccent: 'PARLANDO',
    desc: 'Profilo epatico completo. Per chi usa AAS orali, alcol frequente o farmaci epatotossici.',
    badge: '5 biomarcatori. AST, Bilirubina, ALP, Albumina',
    img: '/panels/panel-fegato.jpg',
    imgAlt: 'Bodybuilder muscoli definiti',
  },
  {
    name: 'FERRO METABOLICO',
    price: 33,
    tag: 'Modulo Add-on',
    headline: 'IL CUT\nNON FUNZIONA?',
    headlineAccent: 'SCOPRI PERCHÉ',
    desc: 'Insulino-resistenza + cortisolo. Per overfat, cut difficile, uso di GH o stress cronico.',
    badge: '4 biomarcatori. HbA1c, Insulina, HOMA-IR, Cortisolo',
    img: '/panels/panel-metabolico.jpg',
    imgAlt: 'Bodybuilder fisico massiccio',
  },
  {
    name: 'FERRO TIROIDE',
    price: 40,
    tag: 'Modulo Add-on',
    headline: 'METABOLISMO\nIN',
    headlineAccent: 'STALLO?',
    desc: 'Profilo tiroideo completo + autoimmunità. Per TSH alterato o sospetto autoimmune.',
    badge: '4 biomarcatori. fT4, fT3, Anti-TPO, Anti-Tg',
    img: '/panels/panel-tiroide.jpg',
    imgAlt: 'Bodybuilder allenamento pesante',
  },
  {
    name: 'FERRO RECOVERY',
    price: 43,
    tag: 'Modulo Add-on',
    headline: 'SEMPRE\nSTANCO?',
    headlineAccent: 'NON È NORMALE',
    desc: 'Assetto marziale completo + B12/Folati. Per fatigue cronica, diete restrittive, endurance.',
    badge: '7 biomarcatori. Sideremia, Transferrina, B12, Folati',
    img: '/panels/panel-recovery.jpg',
    imgAlt: 'Bodybuilder muscolare recupero',
  },
  {
    name: 'FERRO DONNA',
    price: 65,
    tag: 'Modulo Add-on',
    headline: 'NON È "L\'ETÀ"',
    headlineAccent: 'SONO I TUOI ORMONI',
    desc: 'Asse ormonale femminile completo. Per peri-menopausa, amenorrea, PCOS, RED-S.',
    badge: '6 biomarcatori. FSH, Estradiolo, Progesterone, Prolattina, DHEA-S',
    img: '/panels/panel-donna.jpg',
    imgAlt: 'Atleta donna forte',
  },
];

const INTERVAL = 10000;

const s = {
  section: {
    padding: '80px 40px', maxWidth: 1200, margin: '0 auto',
  },
  layout: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
  },
  tag: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12,
    transition: 'opacity 0.4s ease',
  },
  h2: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)',
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
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3,
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
    opacity: 0.6,
    transition: 'opacity 0.6s ease',
  },
  badge: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    background: 'rgba(8,14,28,0.9)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '12px 16px',
    transition: 'opacity 0.4s ease',
  },
  badgeTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2,
    color: 'var(--accent)', marginBottom: 4,
  },
  badgeText: {
    fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5,
  },
  /* ── dots navigation ── */
  dots: {
    display: 'flex', gap: 8, marginTop: 24, alignItems: 'center',
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--border)', border: 'none', cursor: 'pointer',
    transition: 'background 0.3s, transform 0.3s',
    padding: 0,
  },
  dotActive: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--accent)', border: 'none', cursor: 'pointer',
    transform: 'scale(1.3)',
    boxShadow: '0 0 8px var(--accent-glow)',
    padding: 0,
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

  // auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((active + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
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
              <Link to="/test" style={s.btn}>
                FAI IL TEST DI FERRO
              </Link>
              <a href="/pannelli" style={{...s.btn, background:'transparent', border:'1.5px solid var(--border-hover)', boxShadow:'none', color:'var(--text)'}}>
                SCOPRI TUTTI I PANNELLI
              </a>
            </div>
          </div>

          {/* Dots */}
          <div style={s.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                style={i === active ? s.dotActive : s.dot}
                onClick={() => goTo(i)}
                aria-label={`Pannello ${i + 1}`}
              />
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
                opacity: fade ? 0.6 : 0,
              }}
              loading="lazy"
            />
            <div style={{
              ...s.badge,
              opacity: fade ? 1 : 0,
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={s.badgeTitle}>{slide.name}</div>
                {slide.price && <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:20, color:'var(--text)', letterSpacing:1}}>{slide.price}&euro;</div>}
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

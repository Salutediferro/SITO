import FadeUp from '../components/ui/FadeUp';
import { FERRO_CORE, MODULES } from '../constants/panels';

const FORM_URL = 'https://form.salutediferro.com';

function getIcon(iconId) {
  const size = 28;
  const color = '#EC4757';
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (iconId) {
    case 'heart':
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'dna':
      return (
        <svg {...props}>
          <path d="M7 4v2c0 3.3 2.7 6 6 6h0c3.3 0 6 2.7 6 6v2" />
          <path d="M17 4v2c0 3.3-2.7 6-6 6h0c-3.3 0-6 2.7-6 6v2" />
          <line x1="7" y1="7" x2="17" y2="7" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <line x1="7" y1="17" x2="17" y2="17" />
        </svg>
      );
    case 'kidney':
      return (
        <svg {...props}>
          <path d="M8 3C5.2 3 3 5.7 3 9c0 2.5 1 4.5 2.5 5.8C7 16 8 18 8 21h2c0-3.5-1.2-5.8-3-7.5C5.8 12.3 5 10.8 5 9c0-2.5 1.5-4 3-4s3 1.5 3 4c0 2-.5 3-1 4h2.5c.3-1 .5-2.3.5-4 0-3.3-2.2-6-5-6z" />
          <path d="M16 3c2.8 0 5 2.7 5 6 0 2.5-1 4.5-2.5 5.8C17 16 16 18 16 21h-2c0-3.5 1.2-5.8 3-7.5C18.2 12.3 19 10.8 19 9c0-2.5-1.5-4-3-4s-3 1.5-3 4c0 2 .5 3 1 4h-2.5c-.3-1-.5-2.3-.5-4 0-3.3 2.2-6 5-6z" />
        </svg>
      );
    case 'liver':
      return (
        <svg {...props}>
          <path d="M4 12c0-4 2-7 5-8 2-.7 4 0 5.5 1C16 6 18 7 20 8c1.5 1 2 3 1 5s-3 4-6 5c-2.5.8-5 .5-7-1C5.5 15.5 4 14 4 12z" />
          <path d="M12 5c0 3-1 5.5-3 7" />
        </svg>
      );
    case 'metabolism':
      return (
        <svg {...props}>
          <path d="M17 2l3 3-3 3" />
          <path d="M20 5H10c-3.3 0-6 2.7-6 6" />
          <path d="M7 22l-3-3 3-3" />
          <path d="M4 19h10c3.3 0 6-2.7 6-6" />
        </svg>
      );
    case 'thyroid':
      return (
        <svg {...props}>
          <path d="M12 4v4" />
          <path d="M8 8c-2 0-4 2-4 5s2 5 4 5c1.5 0 3-1 4-3 1 2 2.5 3 4 3 2 0 4-2 4-5s-2-5-4-5c-1.5 0-3 1-4 3-1-2-2.5-3-4-3z" />
        </svg>
      );
    case 'recovery':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke={color} />
        </svg>
      );
    case 'woman':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="5" />
          <line x1="12" y1="13" x2="12" y2="21" />
          <line x1="9" y1="18" x2="15" y2="18" />
        </svg>
      );
    default:
      return null;
  }
}

const s = {
  hero: {
    padding: '100px 40px 60px', textAlign: 'center',
    background: 'linear-gradient(180deg, rgba(236,71,87,0.04) 0%, transparent 60%)',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12,
  },
  h1: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 72px)',
    letterSpacing: 2, color: 'var(--text)', opacity: 0.9, marginBottom: 20,
  },
  sub: {
    fontSize: 16, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    maxWidth: 640, margin: '0 auto 32px',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 28px',
    background: 'transparent', border: '1.5px solid var(--border)',
    borderRadius: 6, color: 'var(--text)',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
  },
  content: {
    padding: '0 40px 80px', maxWidth: 1000, margin: '0 auto',
  },
  sectionTag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)',
    letterSpacing: 2, color: 'var(--text)', marginBottom: 12,
  },
  sectionDesc: {
    fontSize: 16, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    marginBottom: 24,
  },
  card: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, marginBottom: 20,
  },
  coreCard: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, marginBottom: 20,
    borderLeft: '4px solid var(--gold, #D4A843)',
  },
  list: { listStyle: 'none', padding: 0 },
  item: {
    padding: '8px 0', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 15, color: 'var(--text-sec)',
  },
  dot: { width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 },
  moduleHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  moduleHeaderLeft: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  moduleName: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2,
    color: 'var(--text)',
  },
  moduleMeta: {
    fontSize: 14, color: 'var(--text-sec)',
  },
  moduleTags: {
    display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12,
  },
  moduleTag: {
    fontSize: 13, padding: '4px 12px', borderRadius: 12,
    background: 'rgba(236,71,87,0.08)', border: '1px solid rgba(236,71,87,0.2)',
    color: 'var(--accent)',
  },
  moduleDesc: {
    fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16,
  },
  divider: {
    height: 1, background: 'var(--border)', margin: '60px 0',
  },
  scienceSection: {
    textAlign: 'center', padding: '60px 0',
  },
  scienceText: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7, maxWidth: 600,
    margin: '0 auto',
  },
  pill: {
    display: 'inline-block', fontSize: 13, padding: '4px 12px', borderRadius: 12,
    background: 'rgba(236,71,87,0.08)', border: '1px solid rgba(236,71,87,0.2)',
    color: 'var(--accent)', marginRight: 6,
  },
  inclusoBadge: {
    display: 'inline-block', fontSize: 10, fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    letterSpacing: 2, padding: '3px 10px', borderRadius: 4,
    background: 'rgba(40,167,69,0.12)', border: '1px solid rgba(40,167,69,0.3)',
    color: '#28a745',
  },
  priceTag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1,
    color: 'var(--accent)',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', marginTop: 16,
    background: 'transparent', border: '1px solid var(--accent)',
    borderRadius: 4, color: 'var(--accent)',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2,
    textDecoration: 'none', cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
};

export default function PannelliPage() {
  return (
    <main>
      <section style={s.hero}>
        <FadeUp>
          <div style={s.tag}>CATALOGO COMPLETO</div>
          <h1 style={s.h1}>PANNELLI EMATICI</h1>
          <p style={s.sub}>
            Ogni pannello è costruito su linee guida internazionali e pensato per chi si allena sul serio. Nessun check-up generico da medico di base. Ogni esame ha un motivo preciso e una fonte verificabile.
          </p>
          <a href={FORM_URL} style={s.btn}>
            FAI IL TEST PER SCOPRIRE I TUOI
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </FadeUp>
      </section>

      <div style={s.content}>
        {/* FERRO CORE */}
        <FadeUp>
          <div style={s.sectionTag}>CORE FOUNDATION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <h2 style={{ ...s.sectionTitle, marginBottom: 0 }}>FERRO CORE</h2>
            <span style={s.inclusoBadge}>INCLUSO</span>
            <span style={s.priceTag}>{FERRO_CORE.price}&euro;</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={s.pill}>Testosterone</span>
            <span style={s.pill}>Vitamina D</span>
          </div>
          <p style={s.sectionDesc}>
            Il tuo punto di partenza. 16 biomarcatori per coprire metabolismo, fegato, reni, tiroide e ferro. Include <strong style={{color:'var(--text)'}}>Testosterone</strong> e <strong style={{color:'var(--text)'}}>Vitamina D</strong>, perché se ti alleni seriamente, questi numeri li devi conoscere.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="card-hover" style={s.coreCard}>
            <ul style={s.list}>
              {FERRO_CORE.biomarkers.map(b => (
                <li key={b} style={s.item}><span style={s.dot} />{b}</li>
              ))}
            </ul>
            <a href={FORM_URL} style={s.ctaBtn}>
              SCOPRI SE FA PER TE &rarr;
            </a>
          </div>
        </FadeUp>

        <div style={s.divider} />

        {/* MODULES */}
        <FadeUp>
          <div style={s.sectionTag}>MODULI SPECIALISTICI</div>
          <h2 style={s.sectionTitle}>I MODULI FERRO</h2>
          <p style={s.sectionDesc}>
            Ogni modulo risponde a un problema specifico. Il Test di Ferro ti dice quali ti servono davvero.
          </p>
        </FadeUp>

        {MODULES.map((mod, i) => (
          <FadeUp key={mod.id} delay={i * 0.05}>
            <div className="card-hover" style={s.card}>
              <div style={s.moduleHeader}>
                <div style={s.moduleHeaderLeft}>
                  {mod.icon && getIcon(mod.icon)}
                  <h3 style={s.moduleName}>{mod.name}</h3>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <span style={s.moduleMeta}>{mod.tests} esami{mod.gender ? ` \u00b7 ${mod.gender}` : ''}</span>
                  {mod.price && <span style={s.priceTag}>{mod.price}&euro;</span>}
                </div>
              </div>
              <div style={s.moduleTags}>
                {mod.tags.map(t => <span key={t} style={s.moduleTag}>{t}</span>)}
              </div>
              <p style={s.moduleDesc}>{mod.desc}</p>
              <ul style={s.list}>
                {mod.biomarkers.map(b => (
                  <li key={b} style={s.item}><span style={s.dot} />{b}</li>
                ))}
              </ul>
              <a href={FORM_URL} style={s.ctaBtn}>
                SCOPRI SE FA PER TE &rarr;
              </a>
            </div>
          </FadeUp>
        ))}

        <div style={s.divider} />

        {/* SCIENCE */}
        <FadeUp>
          <div style={s.scienceSection}>
            <div style={s.sectionTag}>EVIDENCE-BASED</div>
            <h2 style={{...s.sectionTitle, textAlign: 'center'}}>OGNI MARKER HA<br />UNA FONTE VERIFICABILE</h2>
            <p style={s.scienceText}>
              Non costruiamo pannelli per vendere il massimo numero di esami. Ogni marker è selezionato per rispondere a una domanda clinica reale, basata su linee guida internazionali: EAU 2024, ESC/EAS 2025, KDIGO 2024, AASLD 2024, ATA/AACE, ESHRE, ACOG, ASRM.
            </p>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}

import FadeUp from '../components/ui/FadeUp';
import PricePromo from '../components/ui/PricePromo';
import { Link } from 'react-router-dom';
import { PAYMENT_LINKS } from '../constants/payments';

const VANTAGGI = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    title: 'PANNELLI DIAGNOSTICI MIRATI',
    desc: 'Accesso a pannelli di analisi costruiti su linee guida internazionali, pensati per chi si allena. Nessun check-up generico.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'SPECIALISTI CHE TI CAPISCONO',
    desc: 'Rete di endocrinologi, cardiologi, urologi, ginecologi e altri specialisti che conoscono il mondo performance e palestra.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'COACH DI FERRO DEDICATO',
    desc: 'Un coordinatore personale che tiene insieme tutto il tuo percorso: analisi, specialisti, follow-up. Zero sbatti.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'REMINDER ESAMI PERIODICI',
    desc: 'Non dimenticare mai un controllo. Ti ricordiamo noi quando e\u0300 ora di rifare le analisi in base al tuo profilo.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    ),
    title: 'COORDINAMENTO TRA PROFESSIONISTI',
    desc: 'I tuoi specialisti comunicano tra loro. Niente referti persi o doppioni: il Coach di Ferro coordina tutto.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 17 18 12 13 7" />
        <polyline points="6 17 11 12 6 7" />
      </svg>
    ),
    title: 'CORSIA PREFERENZIALE',
    desc: 'Accesso prioritario su esami, visite specialistiche e trattamenti. Meno attesa, piu\u0300 risultati.',
  },
];

const PERCORSO = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Funnel Diagnostico',
    desc: 'Accesso rapido a pannelli di analisi specifici e interpretazione da specialisti.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Percorsi di Ottimizzazione',
    desc: 'Percorsi strutturati con coordinamento Coach di Ferro, supporto medico, nutrizione, allenamento e monitoraggio continuo.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Dashboard Sanitaria',
    desc: 'Carica e consulta i tuoi documenti sanitari, referti e storico analisi in un unico posto.',
  },
];

const FORM_URL = 'https://form.salutediferro.com';

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
    maxWidth: 700, margin: '0 auto 32px',
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
    marginBottom: 32,
  },
  divider: {
    height: 1, background: 'var(--border)', margin: '60px 0',
  },

  /* vantaggi grid — 3 colonne come Chi Siamo pillars */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24, marginBottom: 20,
  },
  card: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    height: '100%',
  },
  cardIcon: { marginBottom: 16 },
  cardTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 10,
  },
  cardDesc: {
    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
  },

  /* servizi — stesse card centrate */
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24, marginBottom: 20,
  },
  serviceCard: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    height: '100%',
  },
  serviceIcon: { marginBottom: 16 },
  serviceTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 10,
  },
  serviceDesc: {
    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
  },

  /* CTA */
  ctaSection: {
    textAlign: 'center', padding: '60px 0',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '16px 36px',
    background: 'linear-gradient(135deg, var(--accent) 0%, #7A0815 100%)',
    border: 'none', borderRadius: 6, color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
  },
};

export default function MembershipPage() {
  return (
    <main>
      <style>{`
        @media (max-width: 900px) {
          .membership-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .membership-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* HERO */}
      <section style={s.hero}>
        <FadeUp>
          <div style={s.tag}>MEMBERSHIP</div>
          <h1 style={s.h1}>MEMBERSHIP DI FERRO</h1>
          <p style={s.sub}>
            Un percorso completo per prendere il controllo della tua salute e performance. Diagnostica mirata, specialisti che parlano la tua lingua e un coordinamento che toglie ogni complessit&agrave;.
          </p>
        </FadeUp>
      </section>

      {/* OFFERTA LANCIO MEMBERSHIP — €297 → €197/anno */}
      <section style={{ padding: 'clamp(48px, 7vw, 96px) 24px', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <PricePromo
              fullPrice={297}
              promoPrice={197}
              period="/anno"
              currency="€"
              label="Annulla quando vuoi"
              badge="OFFERTA LANCIO MEMBERSHIP"
              savings="Risparmi €100"
              href={PAYMENT_LINKS.membershipAnnuale}
              ariaLabel="Sottoscrivi la Membership annuale Salute di Ferro: da 297 euro scontata a 197 euro all'anno"
            />
            <a
              href={PAYMENT_LINKS.membershipAnnuale}
              className="q-btn-primary"
              style={{ textDecoration: 'none', maxWidth: 380, width: '100%' }}
              aria-label="Inizia ora la Membership annuale a 197 euro all'anno"
            >
              INIZIA ORA &middot; 197&euro;/ANNO
            </a>
          </div>
        </FadeUp>
      </section>

      <div style={s.content}>
        {/* VANTAGGI */}
        <FadeUp>
          <div style={s.sectionTag}>PERCH&Eacute; LA MEMBERSHIP</div>
          <div style={s.sectionTitle}>COSA OTTIENI</div>
          <p style={s.sectionDesc}>
            Tutto quello che serve per gestire la tua salute da atleta, senza sbatti e senza giudizi.
          </p>
        </FadeUp>
        <div style={s.grid} className="membership-grid">
          {VANTAGGI.map((v, i) => (
            <FadeUp key={i} delay={i * 0.08} style={{ height: '100%' }}>
              <div style={s.card} className="card-hover">
                <div style={s.cardIcon}>{v.icon}</div>
                <div style={s.cardTitle}>{v.title}</div>
                <p style={s.cardDesc}>{v.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <div style={s.divider} />

        {/* SERVIZI INCLUSI */}
        <FadeUp>
          <div style={s.sectionTag}>COSA OFFRIAMO</div>
          <div style={s.sectionTitle}>I SERVIZI INCLUSI</div>
          <p style={s.sectionDesc}>
            Ogni membro ha accesso a strumenti concreti per monitorare e ottimizzare la propria salute nel tempo.
          </p>
        </FadeUp>
        <div style={s.servicesGrid} className="membership-grid">
          {PERCORSO.map((svc, i) => (
            <FadeUp key={i} delay={i * 0.1} style={{ height: '100%' }}>
              <div style={s.serviceCard} className="card-hover">
                <div style={s.serviceIcon}>{svc.icon}</div>
                <div style={s.serviceTitle}>{svc.title}</div>
                <p style={s.serviceDesc}>{svc.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <div style={s.divider} />

        {/* CTA */}
        <FadeUp>
          <div style={s.ctaSection}>
            <div style={s.sectionTag}>INIZIA ORA</div>
            <div style={{ ...s.sectionTitle, textAlign: 'center', marginBottom: 12 }}>
              SCOPRI IL TUO PROFILO
            </div>
            <p style={{ ...s.sectionDesc, textAlign: 'center', maxWidth: 500, margin: '0 auto 32px' }}>
              Il primo passo &egrave; il Test di Ferro. In 2 minuti scopri il tuo profilo metabolico e le analisi consigliate per te.
            </p>
            <Link to="/test" style={s.ctaBtn}>
              FAI IL TEST DI FERRO
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </FadeUp>

        {/* DOWNSELL — consulenza singola per chi non si committa annuale */}
        <FadeUp>
          <section
            aria-labelledby="downsell-heading"
            style={{
              padding: '32px 24px',
              borderTop: '1px solid #2A2A2E',
              textAlign: 'center',
              maxWidth: 560,
              margin: '64px auto 0',
            }}
          >
            <h2
              id="downsell-heading"
              style={{ fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9AA0', margin: '0 0 12px', fontWeight: 600 }}
            >
              Non sei ancora pronto?
            </h2>
            <p style={{ fontSize: 16, color: '#B8B8BC', lineHeight: 1.5, margin: '0 0 20px' }}>
              Inizia da una <strong style={{ color: '#F2F2F4' }}>consulenza singola da 30 minuti</strong>. €27 una tantum, nessun impegno.
            </p>
            <a
              href={PAYMENT_LINKS.consulenza}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 24px',
                border: '1px solid #2A2A2E',
                borderRadius: 8,
                color: '#F2F2F4',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              PRENOTA CONSULENZA · €27
            </a>
          </section>
        </FadeUp>
      </div>
    </main>
  );
}

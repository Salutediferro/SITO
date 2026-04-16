import { Link } from 'react-router-dom';
import FadeUp from '../ui/FadeUp';

const PILLARS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    title: 'DIAGNOSTICA MIRATA',
    desc: 'Pannelli costruiti su linee guida internazionali, pensati per chi si allena. Nessun check-up generico.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'SPECIALISTI CHE TI CAPISCONO',
    desc: 'Endocrinologi, cardiologi, urologi e altri specialisti che conoscono il mondo performance e palestra.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'COORDINAMENTO COMPLETO',
    desc: 'Il Coach di Ferro coordina il tuo percorso: analisi, specialisti e follow-up. Zero sbatti, tutto organizzato.',
  },
];

const PROBLEMS = [
  'Non sai quali esami fare',
  'Non trovi un medico che capisca il bodybuilding',
  'Nessuno coordina il tuo percorso',
  'Vuoi controllare i marker senza giudizi',
];

const testimonials = [
  {
    name: 'Marco R.',
    profile: 'Bodybuilder Natural, 34 anni',
    stars: 5,
    quote: 'Finalmente qualcuno che parla la mia lingua. Il Coach di Ferro ha letto i miei esami e ha capito subito cosa non andava. Mai avuto un medico cosi.',
  },
  {
    name: 'Alessia T.',
    profile: 'CrossFit Athlete, 29 anni',
    stars: 5,
    quote: 'Con FERRO DONNA ho scoperto che il mio ciclo irregolare era collegato allo stress da allenamento. Nessun ginecologo me l\'aveva mai detto.',
  },
  {
    name: 'Luca M.',
    profile: 'Powerlifter, 42 anni',
    stars: 5,
    quote: 'Uso supporti farmacologici da anni e nessun medico voleva seguirmi. Qui zero giudizi e i miei marker epatici e renali sono finalmente sotto controllo.',
  },
];

const s = {
  section: {
    padding: '80px 40px', maxWidth: 1200, margin: '0 auto',
  },
  tag: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12, textAlign: 'center',
  },
  h2: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2, color: 'var(--text)', textAlign: 'center', marginBottom: 16,
  },
  sub: {
    fontSize: 16, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    textAlign: 'center', maxWidth: 700, margin: '0 auto 48px',
  },
  pillarsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24, marginBottom: 48,
  },
  pillarCard: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, textAlign: 'center',
  },
  pillarIcon: {
    marginBottom: 16,
  },
  pillarTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 10,
  },
  pillarDesc: {
    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
  },
  problemsWrap: {
    display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
    marginBottom: 56,
  },
  problemBadge: {
    fontSize: 13, padding: '8px 16px', borderRadius: 20,
    background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)',
    color: 'var(--text-sec)',
  },
  divider: {
    height: 1, background: 'var(--border)', margin: '0 0 56px',
  },
  testimonialsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24, marginBottom: 40,
  },
  tCard: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column',
  },
  stars: {
    fontSize: 16, color: '#F5A623', marginBottom: 16, letterSpacing: 2,
  },
  quote: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    fontStyle: 'italic', marginBottom: 20, flex: 1,
  },
  nameRow: {
    display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto',
  },
  name: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 16,
    color: 'var(--text)', letterSpacing: 1,
  },
  badge: {
    fontSize: 10, color: '#27AE60', background: 'rgba(39,174,96,0.1)',
    padding: '2px 8px', borderRadius: 4, fontWeight: 600,
  },
  profile: {
    fontSize: 12, color: 'var(--text-muted)', marginTop: 4,
  },
  ctaWrap: {
    textAlign: 'center',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '16px 36px',
    background: 'linear-gradient(135deg, var(--accent) 0%, #EF4444 100%)',
    border: 'none', borderRadius: 6, color: 'white',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
  },
};

export default function ChiSiamo() {
  return (
    <section style={s.section}>
      {/* CHI SIAMO */}
      <FadeUp>
        <div style={s.tag}>Chi Siamo</div>
        <h2 style={s.h2}>LA PALESTRA DELLA SALUTE</h2>
        <p style={s.sub}>
          Salute di Ferro coordina il tuo percorso diagnostico: dai pannelli di analisi mirati agli specialisti che capiscono il mondo palestra e performance. Zero pregiudizi, zero complessit\u00e0.
        </p>
      </FadeUp>

      <div style={s.problemsWrap}>
        {PROBLEMS.map((p, i) => (
          <FadeUp key={i} delay={i * 0.08}>
            <span style={s.problemBadge}>{p}</span>
          </FadeUp>
        ))}
      </div>

      <div style={s.pillarsGrid}>
        {PILLARS.map((p, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div style={s.pillarCard} className="card-hover">
              <div style={s.pillarIcon}>{p.icon}</div>
              <div style={s.pillarTitle}>{p.title}</div>
              <p style={s.pillarDesc}>{p.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>

      <div style={s.divider} />

      {/* TESTIMONIANZE */}
      <FadeUp>
        <div style={s.tag}>Testimonianze di Ferro</div>
        <h2 style={s.h2}>CHI L'HA PROVATO PARLA</h2>
      </FadeUp>

      <div style={s.testimonialsGrid}>
        {testimonials.map((t, i) => (
          <FadeUp key={i} delay={i * 0.12}>
            <div style={s.tCard} className="card-hover">
              <div style={s.stars}>{'★'.repeat(t.stars)}</div>
              <p style={s.quote}>"{t.quote}"</p>
              <div>
                <div style={s.nameRow}>
                  <span style={s.name}>{t.name}</span>
                  <span style={s.badge}>Verificato ✓</span>
                </div>
                <div style={s.profile}>{t.profile}</div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp>
        <div style={s.ctaWrap}>
          <Link to="/test" style={s.btn}>
            SCOPRI IL TUO PROFILO DI FERRO
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}

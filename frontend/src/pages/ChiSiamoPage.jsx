import FadeUp from '../components/ui/FadeUp';

const FORM_URL = 'https://form.salutediferro.com';

const PILLARS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

const SPECIALISTS = [
  'Endocrinologi', 'Urologi', 'Andrologi', 'Cardiologi',
  'Ginecologi', 'Nefrologi', 'Epatologi', 'Gastroenterologi',
];

const SERVICES = [
  { title: 'Funnel Diagnostico', desc: 'Accesso rapido a pannelli di analisi specifici e interpretazione da specialisti.' },
  { title: 'Percorsi di Ottimizzazione', desc: 'Percorsi strutturati di 6-12 mesi con coordinamento Coach di Ferro, supporto medico, nutrizione, allenamento e monitoraggio continuo.' },
  { title: 'Dashboard Sanitaria', desc: 'Carica e consulta i tuoi documenti sanitari in un unico posto.' },
];

const s = {
  hero: {
    padding: '100px 40px 60px', textAlign: 'center',
    background: 'linear-gradient(180deg, rgba(236,71,87,0.04) 0%, transparent 60%)',
  },
  tag: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12,
  },
  h1: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 72px)',
    letterSpacing: 2, color: 'var(--text)', opacity: 0.9, marginBottom: 20,
  },
  heroSub: {
    fontSize: 16, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    maxWidth: 700, margin: '0 auto 32px',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 28px',
    background: 'transparent', border: '1.5px solid var(--border)',
    borderRadius: 6, color: 'var(--text)',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
  },
  content: {
    padding: '0 40px 80px', maxWidth: 1000, margin: '0 auto',
  },
  sectionTag: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)',
    letterSpacing: 2, color: 'var(--text)', marginBottom: 12,
  },
  sectionDesc: {
    fontSize: 16, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    marginBottom: 32,
  },
  divider: {
    height: 1, background: 'var(--border)', margin: '60px 0',
  },
  problemsWrap: {
    display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40,
  },
  problemBadge: {
    fontSize: 13, padding: '8px 16px', borderRadius: 20,
    background: 'rgba(236,71,87,0.06)', border: '1px solid rgba(236,71,87,0.2)',
    color: 'var(--text-sec)',
  },
  pillarsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24, marginBottom: 20,
  },
  pillarCard: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, textAlign: 'center',
  },
  pillarIcon: { marginBottom: 16 },
  pillarTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 10,
  },
  pillarDesc: {
    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
  },
  specialistsWrap: {
    display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20,
  },
  specBadge: {
    fontSize: 13, padding: '6px 14px', borderRadius: 20,
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    color: 'var(--text-sec)',
  },
  servicesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20, marginBottom: 20,
  },
  serviceCard: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 24,
  },
  serviceTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 8,
  },
  serviceDesc: {
    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
  },
  coachCard: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 28, borderLeft: '4px solid var(--accent)',
    marginBottom: 20,
  },
  coachTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 10,
  },
  coachDesc: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7,
  },
  coachList: {
    listStyle: 'none', padding: 0, marginTop: 12,
  },
  coachItem: {
    padding: '6px 0', fontSize: 14, color: 'var(--text-sec)',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  dot: {
    width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0,
  },
  ctaSection: {
    textAlign: 'center', padding: '60px 0',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '16px 36px',
    background: 'linear-gradient(135deg, var(--accent) 0%, #7A0815 100%)',
    border: 'none', borderRadius: 6, color: 'white',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
  },
};

export default function ChiSiamoPage() {
  return (
    <main>
      {/* HERO */}
      <section style={s.hero}>
        <FadeUp>
          <div style={s.tag}>CHI SIAMO</div>
          <h1 style={s.h1}>LA PALESTRA DELLA SALUTE</h1>
          <p style={s.heroSub}>
            Salute di Ferro coordina il tuo percorso diagnostico: dai pannelli di analisi mirati agli specialisti che capiscono il mondo palestra e performance. Zero pregiudizi, zero complessità.
          </p>
          <a href={FORM_URL} style={s.btn}>
            FAI IL TEST DI FERRO
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </FadeUp>
      </section>

      <div style={s.content}>
        {/* PROBLEMI CHE RISOLVIAMO */}
        <FadeUp>
          <div style={s.sectionTag}>I PROBLEMI CHE RISOLVIAMO</div>
          <div style={s.sectionTitle}>SE TI RICONOSCI, SEI NEL POSTO GIUSTO</div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={s.problemsWrap}>
            {PROBLEMS.map((p, i) => (
              <span key={i} style={s.problemBadge}>{p}</span>
            ))}
          </div>
        </FadeUp>

        {/* 3 PILASTRI */}
        <FadeUp>
          <div style={s.sectionTag}>IL NOSTRO MODELLO</div>
          <div style={s.sectionTitle}>TRE PILASTRI</div>
          <p style={s.sectionDesc}>
            Salute di Ferro si basa su diagnostica corretta, specialisti che comprendono il mondo performance e coordinamento completo del percorso sanitario.
          </p>
        </FadeUp>
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

        {/* COACH DI FERRO */}
        <FadeUp>
          <div style={s.sectionTag}>LA FIGURA CHIAVE</div>
          <div style={s.sectionTitle}>IL COACH DI FERRO</div>
          <p style={s.sectionDesc}>
            Il Coach di Ferro è il coordinatore del tuo percorso. Non è un medico, non è un trainer: è chi tiene insieme tutto.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={s.coachCard}>
            <div style={s.coachTitle}>COSA FA IL COACH DI FERRO</div>
            <ul style={s.coachList}>
              {['Contatto diretto con te', 'Coordinamento dei professionisti', 'Monitoraggio del percorso', 'Supporto decisionale'].map(item => (
                <li key={item} style={s.coachItem}><span style={s.dot} />{item}</li>
              ))}
            </ul>
          </div>
        </FadeUp>

        <div style={s.divider} />

        {/* SPECIALISTI */}
        <FadeUp>
          <div style={s.sectionTag}>LA RETE</div>
          <div style={s.sectionTitle}>SPECIALISTI DELLA RETE</div>
          <p style={s.sectionDesc}>
            Professionisti selezionati che capiscono le esigenze di chi si allena e vive il mondo performance.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={s.specialistsWrap}>
            {SPECIALISTS.map(sp => (
              <span key={sp} style={s.specBadge}>{sp}</span>
            ))}
          </div>
        </FadeUp>

        <div style={s.divider} />

        {/* SERVIZI */}
        <FadeUp>
          <div style={s.sectionTag}>COSA OFFRIAMO</div>
          <div style={s.sectionTitle}>I NOSTRI SERVIZI</div>
        </FadeUp>
        <div style={s.servicesGrid}>
          {SERVICES.map((svc, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div style={s.serviceCard} className="card-hover">
                <div style={s.serviceTitle}>{svc.title}</div>
                <p style={s.serviceDesc}>{svc.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* CTA FINALE */}
        <FadeUp>
          <div style={s.ctaSection}>
            <div style={s.sectionTag}>INIZIA ORA</div>
            <div style={{...s.sectionTitle, textAlign: 'center', marginBottom: 24}}>IL TUO PERCORSO DI FERRO</div>
            <a href={FORM_URL} style={s.ctaBtn}>
              SCOPRI IL TUO PROFILO DI FERRO
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}

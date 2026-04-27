import FadeUp from '../ui/FadeUp';

const testimonials = [
  {
    name: 'Marco R.',
    profile: 'Bodybuilder Natural',
    stars: 5,
    quote: 'Finalmente qualcuno che parla la mia lingua. Il Coach di Ferro ha letto i miei esami e ha capito subito cosa non andava. Mai avuto un medico cosi.',
  },
  {
    name: 'Alessia T.',
    profile: 'CrossFit Athlete',
    stars: 5,
    quote: 'Con FERRO DONNA ho scoperto che il mio ciclo irregolare era collegato allo stress da allenamento. Nessun ginecologo me l\'aveva mai detto.',
  },
  {
    name: 'Luca M.',
    profile: 'Powerlifter',
    stars: 5,
    quote: 'Uso supporti farmacologici da anni e nessun medico voleva seguirmi. Qui zero giudizi e i miei marker epatici e renali sono finalmente sotto controllo.',
  },
];

const s = {
  section: {
    padding: 'clamp(64px, 9vw, 120px) 40px', maxWidth: 1200, margin: '0 auto',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12, textAlign: 'center',
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2, color: 'var(--text)', marginBottom: 48, textAlign: 'center',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
  },
  card: {
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
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 16,
    color: 'var(--text)', letterSpacing: 1,
  },
  badge: {
    fontSize: 10, color: '#27AE60', background: 'rgba(39,174,96,0.1)',
    padding: '2px 8px', borderRadius: 4, fontWeight: 600,
  },
  profile: {
    fontSize: 12, color: 'var(--text-muted)', marginTop: 4,
  },
};

export default function Testimonials() {
  return (
    <section style={s.section}>
      <FadeUp>
        <div style={s.tag}>Cosa dicono di noi</div>
        <h2 style={s.h2}>CHI L'HA PROVATO PARLA</h2>
      </FadeUp>

      <div style={s.grid}>
        {testimonials.map((t, i) => (
          <FadeUp key={i} delay={i * 0.15}>
            <div style={s.card} className="card-hover">
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
    </section>
  );
}

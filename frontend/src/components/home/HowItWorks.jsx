import FadeUp from '../ui/FadeUp';

const steps = [
  { num: '01', title: 'FAI IL TEST', desc: '15 domande secche su come ti alleni, cosa senti e cosa hai fatto. Niente giri di parole, ci serve per capire il tuo quadro.' },
  { num: '02', title: 'RICEVI IL TUO PROTOCOLLO', desc: 'Il FERRO CORE più i moduli specifici per i tuoi problemi reali. Non un pannello generico da medico di base.' },
  { num: '03', title: 'FAI IL PRELIEVO E AGISCI', desc: 'Vai in laboratorio, fai il prelievo e ricevi i risultati. Zero Sbatti.' },
];

const s = {
  section: {
    padding: '60px 40px', maxWidth: 1200, margin: '0 auto',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12, textAlign: 'center',
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2, color: 'var(--text)', textAlign: 'center', marginBottom: 48,
  },
  gridWrapper: {
    position: 'relative',
  },
  connectingLine: {
    position: 'absolute',
    top: 56,
    left: '16.66%',
    right: '16.66%',
    height: 2,
    background: 'linear-gradient(90deg, var(--accent), var(--gold))',
    zIndex: 0,
    borderRadius: 1,
    opacity: 0.4,
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 32,
    position: 'relative',
    zIndex: 1,
  },
  card: {
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: 12, padding: 32, position: 'relative',
    height: '100%', display: 'flex', flexDirection: 'column',
  },
  numCircle: {
    width: 64, height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '50%',
    border: '2px solid var(--accent)',
    background: 'rgba(236,71,87,0.06)',
    boxShadow: '0 0 20px rgba(236,71,87,0.12), 0 0 40px rgba(236,71,87,0.04)',
    marginBottom: 16,
  },
  numText: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 28,
    color: 'var(--accent)', lineHeight: 1,
  },
  title: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2,
    color: 'var(--text)', marginBottom: 12,
  },
  desc: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
  },
};

export default function HowItWorks() {
  return (
    <section style={s.section}>
      <FadeUp>
        <div style={s.tag}>Tre passi, zero complicazioni</div>
        <h2 style={s.h2}>COME FUNZIONA</h2>
      </FadeUp>
      <div style={s.gridWrapper}>
        <div style={s.connectingLine} className="hiw-line" />
        <div style={s.grid}>
          {steps.map((step, i) => (
            <FadeUp key={i} delay={i * 0.15} style={{ height: '100%' }}>
              <div style={s.card} className="card-hover">
                <div style={s.numCircle}>
                  <span style={s.numText}>{step.num}</span>
                </div>
                <h3 style={s.title}>{step.title}</h3>
                <p style={s.desc}>{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hiw-line { display: none !important; }
        }
      `}</style>
    </section>
  );
}

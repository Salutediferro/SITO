import FadeUp from '../ui/FadeUp';

const FORM_URL = 'https://form.salutediferro.com';

const s = {
  section: {
    padding: '80px 40px',
    background: 'linear-gradient(180deg, rgba(248,113,113,0.04) 0%, transparent 100%)',
  },
  inner: {
    maxWidth: 800, margin: '0 auto', textAlign: 'center',
  },
  tag: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12,
  },
  h2: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2, color: 'var(--text)', marginBottom: 20,
  },
  desc: {
    fontSize: 16, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    marginBottom: 32, maxWidth: 600, margin: '0 auto 32px',
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

export default function SocialProof() {
  return (
    <section style={s.section}>
      <div style={s.inner}>
        <FadeUp>
          <div style={s.tag}>Non aspettare il prossimo sintomo</div>
          <h2 style={s.h2}>IL TUO CORPO TI STA PARLANDO</h2>
          <p style={s.desc}>
            328+ atleti hanno già scelto di sapere. Ogni giorno rimandato è un giorno senza risposte. Il Test di Ferro richiede 2 minuti.
          </p>
          <a href={FORM_URL} style={s.btn}>
            INIZIA IL TEST DI FERRO
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

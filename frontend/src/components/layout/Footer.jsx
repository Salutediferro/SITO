import { Link } from 'react-router-dom';

const s = {
  footer: {
    borderTop: '1px solid var(--border)',
    background: 'var(--bg)',
    padding: '60px 40px 32px',
    position: 'relative', zIndex: 1,
  },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40,
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  logoImg: { height: 36 },
  logoText: { fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2, color: 'var(--text)' },
  desc: { fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.6, maxWidth: 320 },
  heading: { fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3, color: 'var(--text-muted)', marginBottom: 16 },
  link: { display: 'block', fontSize: 14, color: 'var(--text-sec)', marginBottom: 10, textDecoration: 'none' },
  info: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 },
  bottom: { maxWidth: 1200, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  copy: { fontSize: 12, color: 'var(--text-muted)' },
  igWrap: { display: 'inline-flex', alignItems: 'center', gap: 6 },
};

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner} className="footer-grid">
        <div>
          <div style={s.logoWrap}>
            <img src="/LOGO.png" alt="SDF" style={s.logoImg} />
            <span style={s.logoText}>SALUTE DI FERRO</span>
          </div>
          <p style={s.desc}>
            Performance Health System. Coordinamento diagnostico per atleti e appassionati di fitness in Italia.
          </p>
        </div>

        <div>
          <div style={s.heading}>NAVIGAZIONE</div>
          <Link to="/" style={s.link}>Home</Link>
          <Link to="/pannelli" style={s.link}>Pannelli Ematici</Link>
          <Link to="/chi-siamo" style={s.link}>Chi Siamo</Link>
          <Link to="/membership" style={s.link}>Membership</Link>
          <a href="https://wa.me/393759899724" target="_blank" rel="noopener noreferrer" style={s.link}>WhatsApp</a>
          <Link to="/privacy" style={s.link}>Privacy Policy</Link>
          <a href="https://form.salutediferro.com" style={s.link}>Test di Ferro</a>
        </div>

        <div>
          <div style={s.heading}>INFORMAZIONI</div>
          <p style={s.info}>
            Salute di Ferro non eroga direttamente prestazioni sanitarie. Coordina l'accesso a esami e professionisti sanitari qualificati, nel rispetto della normativa vigente.
          </p>
          <a href="mailto:info@salutediferro.com" style={{...s.link, marginTop: 12, fontSize: 12}}>info@salutediferro.com</a>
        </div>
      </div>

      <div style={s.bottom}>
        <span style={s.copy}>&copy; 2026 Salute di Ferro. Tutti i diritti riservati.</span>
        <span style={s.copy}>Performance Health System &middot; Italia</span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          footer { padding: 40px 20px 24px !important; }
        }
      `}</style>
    </footer>
  );
}

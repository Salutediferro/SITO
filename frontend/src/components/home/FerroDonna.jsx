import FadeUp from '../ui/FadeUp';

const FORM_URL = 'https://form.salutediferro.com';

const s = {
  section: {
    padding: 'clamp(64px, 9vw, 120px) 40px', maxWidth: 1200, margin: '0 auto',
  },
  layout: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12,
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)',
    letterSpacing: 2, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20,
  },
  accent: { color: 'var(--accent)' },
  desc: {
    fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, fontWeight: 300,
    marginBottom: 16,
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 28px', marginTop: 8,
    background: 'linear-gradient(135deg, var(--accent) 0%, #7A0815 100%)',
    border: 'none', borderRadius: 6, color: 'white',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 3px 14px var(--accent-glow)',
  },
  imgWrap: {
    position: 'relative', borderRadius: 12, overflow: 'hidden',
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  imgPlaceholder: {
    width: '100%', height: '100%', objectFit: 'cover',
    opacity: 0.6,
  },
  badge: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    background: 'rgba(10,10,12,0.9)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '12px 16px',
  },
  badgeTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2,
    color: 'var(--accent)', marginBottom: 4,
  },
  badgeText: {
    fontSize: 11, color: 'var(--text-sec)', lineHeight: 1.5,
  },
};

export default function FerroDonna() {
  return (
    <section style={s.section}>
      <div style={s.layout} className="donna-grid">
        <FadeUp>
          <div style={s.tag}>Ferro Donna</div>
          <h2 style={s.h2}>
            NON È "L'ETÀ"<br />
            <span style={s.accent}>SONO I TUOI ORMONI</span>
          </h2>
          <p style={s.desc}>
            Ti alleni, mangi bene, ma il corpo non risponde più come prima. Ti hanno detto che "è normale alla tua età", ma non è vero.
          </p>
          <p style={s.desc}>
            Il pannello Ferro Donna va a leggere FSH, Estradiolo, Prolattina e tutto quello che serve per capire cosa sta succedendo davvero.
          </p>
          <a href={FORM_URL} style={s.btn}>FAI IL TEST DI FERRO</a>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div style={s.imgWrap}>
            <img
              src="https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80"
              alt="Atleta donna forte"
              style={s.imgPlaceholder}
            />
            <div style={s.badge}>
              <div style={s.badgeTitle}>FERRO DONNA</div>
              <div style={s.badgeText}>FSH, Estradiolo, Progesterone, Prolattina, DHEA-S. Basato su ESHRE, ACOG, ASRM</div>
            </div>
          </div>
        </FadeUp>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .donna-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

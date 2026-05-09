import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: 72,
    background: 'rgba(10,10,12,0.92)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    transition: 'transform 0.3s ease',
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
  },
  logoImg: { height: 40, width: 'auto' },
  logoText: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2,
    color: 'var(--text)',
  },
  links: {
    display: 'flex', alignItems: 'center', gap: 32,
  },
  link: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2,
    color: 'var(--text-sec)', textDecoration: 'none',
    transition: 'color var(--motion-fast) var(--ease-standard)',
  },
  linkActive: { color: 'var(--accent)' },
  cta: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '10px 24px',
    background: 'var(--accent-fill)', border: 'none', borderRadius: 6,
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 2,
    color: 'white', cursor: 'pointer', textDecoration: 'none',
    transition: 'background var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard)',
    boxShadow: '0 2px 10px var(--accent-glow2)',
  },
  burger: {
    display: 'none', background: 'none', border: 'none',
    cursor: 'pointer', padding: 4,
  },
  mobileMenu: {
    position: 'fixed', top: 72, left: 0, right: 0, bottom: 0,
    background: 'rgba(10,10,12,0.98)', backdropFilter: 'blur(12px)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 32, zIndex: 49,
  },
  mobileLink: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3,
    color: 'var(--text)', textDecoration: 'none',
  },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Quiz interno SPA · /test (era https://form.salutediferro.com che servito da Pages
  // legacy `type-form` non aggiornato — issue P2.2 roadmap, fix 6 mag 2026.)
  const TEST_PATH = '/test';
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/pannelli', label: 'Pannelli' },
    { to: '/chi-siamo', label: 'Chi Siamo' },
    { to: 'https://wa.me/393759899724', label: 'WhatsApp', external: true },
    { to: '/membership', label: 'Membership' },
  ];

  return (
    <>
      <nav style={{
        ...styles.nav,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}>
        <Link to="/" style={styles.logoWrap}>
          <img src="/LOGO.png" alt="Salute di Ferro" style={styles.logoImg} />
          <span style={styles.logoText}>SALUTE DI FERRO</span>
        </Link>

        <div style={styles.links} className="nav-links">
          {navLinks.map(l => l.external ? (
            <a
              key={l.to}
              href={l.to}
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label.toUpperCase()}
            </a>
          ) : (
            <Link
              key={l.to}
              to={l.to}
              aria-current={pathname === l.to ? 'page' : undefined}
              style={{
                ...styles.link,
                ...(pathname === l.to ? styles.linkActive : {}),
              }}
            >
              {l.label.toUpperCase()}
            </Link>
          ))}
          <Link to={TEST_PATH} style={styles.cta} className="btn-lift">
            TEST DI FERRO
          </Link>
        </div>

        <button
          style={styles.burger}
          className="nav-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map(l => l.external ? (
            <a key={l.to} href={l.to} style={styles.mobileLink}>
              {l.label.toUpperCase()}
            </a>
          ) : (
            <Link key={l.to} to={l.to} style={{
              ...styles.mobileLink,
              color: pathname === l.to ? 'var(--accent)' : 'var(--text)',
            }}>
              {l.label.toUpperCase()}
            </Link>
          ))}
          <Link to={TEST_PATH} style={{ ...styles.cta, padding: '14px 40px', fontSize: 18 }}>
            INIZIA IL TEST
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-burger { display: block !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>

      {/* Spacer */}
      <div style={{ height: 72 }} />
    </>
  );
}

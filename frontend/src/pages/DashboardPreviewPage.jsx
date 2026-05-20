import { Link } from 'react-router-dom';
import { PAYMENT_LINKS } from '../constants/payments';

/**
 * DashboardPreviewPage · /dashboard-preview
 *
 * Anteprima Dashboard riservata per utenti senza membership attiva.
 * Strategia (Sepp 18 mag 2026):
 *  - Step 1: cliccano "DASHBOARD" in navbar → atterrano qui → vedono "cos'è" + figate dentro
 *  - Step 2: CTA "Entra nel Team di Ferro" → checkout Founder Pass
 *
 * TODO (post-auth, decisione user): quando login Dashboard pronto,
 * Navbar gating: se membership attiva → redirect dashboard reale, altrimenti → /dashboard-preview.
 *
 * A11y (review accessibility-lead, 20 mag 2026):
 *  - main focus on route mount (SPA pattern)
 *  - H1 unico, H2 sezioni, H3 card
 *  - alt descrittivo screenshot (no "preview")
 *  - external CTA Stripe: target="_blank" + rel + label esplicito "(si apre in nuova scheda)"
 *  - icone SVG aria-hidden + focusable=false
 *  - middle dot · sostituito da separatori semantici
 *  - prefers-reduced-motion guard sui hover lift
 *  - touch target >=44px (WCAG 2.5.8)
 *  - contrasto CTA: bianco su #7A0815 accent-fill = AAA
 */

const FEATURES = [
  {
    id: 'agente-ferro',
    title: 'Agente di Ferro',
    desc: 'Un coach AI proattivo che ogni giorno ti suggerisce cosa fare e ti ricorda i tuoi obiettivi di Ferro.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2L2 9.4h7.6z" />
      </svg>
    ),
  },
  {
    id: 'esami',
    title: 'I miei Esami',
    desc: 'Storico completo degli esami del sangue con grafici dei trend nel tempo e alert sui valori fuori range.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'coach',
    title: 'Coach dedicato',
    desc: 'Chat diretta con il tuo Coach di Ferro umano che ti accompagna passo-passo nel percorso.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'documenti',
    title: 'Documenti sanitari',
    desc: 'Carica e consulta referti, esami e prescrizioni in un solo posto sicuro, sempre a portata di mano.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="15" x2="15" y2="15" />
        <line x1="9" y1="11" x2="13" y2="11" />
      </svg>
    ),
  },
];

const styles = {
  main: {
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    paddingTop: 'clamp(40px, 8vw, 96px)',
    paddingBottom: 'var(--space-9)',
  },
  container: {
    maxWidth: 1140,
    margin: '0 auto',
    padding: '0 clamp(20px, 5vw, 40px)',
  },
  hero: {
    textAlign: 'center',
    marginBottom: 'var(--space-8)',
  },
  tag: {
    display: 'inline-block',
    padding: '6px 14px',
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-active)',
    borderRadius: 'var(--radius-pill)',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 12,
    letterSpacing: 2,
    color: 'var(--accent)',
    marginBottom: 'var(--space-4)',
  },
  h1: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'var(--text-h1)',
    lineHeight: 1.05,
    letterSpacing: -0.5,
    margin: '0 0 var(--space-4) 0',
  },
  h1Accent: { color: 'var(--accent)' },
  sub: {
    fontSize: 'var(--text-lg)',
    color: 'var(--text-sec)',
    lineHeight: 1.5,
    maxWidth: 680,
    margin: '0 auto',
  },
  screenshotWrap: {
    margin: 'var(--space-7) auto var(--space-9)',
    maxWidth: 960,
    position: 'relative',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
    background: 'var(--bg-card)',
  },
  screenshot: {
    display: 'block',
    width: '100%',
    height: 'auto',
  },
  // Fallback placeholder finché Sepp non passa screenshot reale
  placeholder: {
    aspectRatio: '16 / 9',
    width: '100%',
    background: 'linear-gradient(135deg, #131316 0%, #1F1F23 60%, #2A1418 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-6)',
  },
  placeholderTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'var(--text-h3)',
    letterSpacing: 3,
    color: 'var(--text-sec)',
    margin: 0,
  },
  placeholderSub: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-sec)',
    opacity: 0.6,
    margin: 0,
    textAlign: 'center',
    maxWidth: 380,
  },
  section: { marginBottom: 'var(--space-9)' },
  sectionTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'var(--text-h2)',
    textAlign: 'center',
    margin: '0 0 var(--space-7) 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'var(--space-5)',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    transition: 'transform var(--motion-base) var(--ease-standard), border-color var(--motion-base) var(--ease-standard)',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'var(--text-h3)',
    letterSpacing: 0.5,
    margin: 0,
  },
  cardDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-sec)',
    lineHeight: 1.55,
    margin: 0,
  },
  ctaSection: {
    textAlign: 'center',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'clamp(32px, 6vw, 64px) clamp(20px, 5vw, 48px)',
  },
  ctaTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'var(--text-h2)',
    margin: '0 0 var(--space-3) 0',
  },
  ctaSub: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-sec)',
    margin: '0 0 var(--space-6) 0',
    lineHeight: 1.55,
  },
  ctaButtons: {
    display: 'flex',
    gap: 'var(--space-4)',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    padding: '14px 28px',
    background: 'var(--accent-fill)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 16,
    letterSpacing: 2,
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 20px var(--accent-glow)',
    transition: 'transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard)',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    padding: '14px 24px',
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--border-hover)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 16,
    letterSpacing: 2,
    textDecoration: 'none',
    transition: 'border-color var(--motion-fast) var(--ease-standard), background var(--motion-fast) var(--ease-standard)',
  },
  ctaMeta: {
    marginTop: 'var(--space-5)',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-sec)',
    opacity: 0.8,
  },
};

export default function DashboardPreviewPage() {
  // Note: App.jsx already wraps Routes in <main id="main-content" tabIndex={-1}>.
  // Questa page e' una <section> per evitare landmark duplicato.
  return (
    <section
      style={styles.main}
      aria-labelledby="dashboard-preview-h1"
    >
      <div style={styles.container}>
        {/* Hero */}
        <header style={styles.hero}>
          <span style={styles.tag}>LA TUA DASHBOARD</span>
          <h1 id="dashboard-preview-h1" style={styles.h1}>
            Ecco cosa ti aspetta <span style={styles.h1Accent}>dentro</span>
          </h1>
          <p style={styles.sub}>
            Una piattaforma fatta per chi spinge il Ferro: i tuoi esami, il tuo Coach, i tuoi documenti.
            Tutto in un solo posto, sempre con te.
          </p>
        </header>

        {/* Screenshot/mockup zone — Sepp passera asset finale */}
        <div style={styles.screenshotWrap}>
          <div
            role="img"
            aria-label="Schermata Dashboard membri: pannello Agente di Ferro con suggerimenti del giorno, grafico esami del sangue degli ultimi sei mesi e lista documenti sanitari caricati"
            style={styles.placeholder}
          >
            <p style={styles.placeholderTitle}>ANTEPRIMA DASHBOARD</p>
            <p style={styles.placeholderSub}>
              Screenshot in arrivo · Agente di Ferro, esami, coach, documenti
            </p>
          </div>
        </div>

        {/* Features grid */}
        <section style={styles.section} aria-labelledby="features-heading">
          <h2 id="features-heading" style={styles.sectionTitle}>
            Tutto quello che entra nel tuo percorso
          </h2>
          <div style={styles.grid}>
            {FEATURES.map((f) => (
              <div
                key={f.id}
                style={styles.card}
                className="dashboard-preview-card"
                aria-labelledby={`card-${f.id}-title`}
              >
                <div style={styles.cardIcon}>{f.icon}</div>
                <h3 id={`card-${f.id}-title`} style={styles.cardTitle}>
                  {f.title}
                </h3>
                <p style={styles.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection} aria-labelledby="cta-heading">
          <h2 id="cta-heading" style={styles.ctaTitle}>
            Entra nel Team di Ferro
          </h2>
          <p style={styles.ctaSub}>
            Coach dedicato, medici che capiscono il Ferro, dashboard con tutto il tuo percorso.
            Da 9,99&nbsp;€ al mese, prezzo bloccato a vita per i primi 200.
          </p>
          <div style={styles.ctaButtons}>
            <a
              href={PAYMENT_LINKS.founderPass}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.btnPrimary}
              className="btn-lift"
              aria-label="Entra nel Team di Ferro, Founder Pass da 9 euro e 99 al mese, si apre in Stripe in una nuova scheda"
            >
              ENTRA NEL TEAM DI FERRO
              <span aria-hidden="true" style={{ margin: '0 8px', opacity: 0.6 }}>—</span>
              <span aria-hidden="true">da 9,99 €/mese</span>
            </a>
            <Link
              to="/membership"
              style={styles.btnSecondary}
              className="btn-secondary-hover"
            >
              SCOPRI LA MEMBERSHIP
            </Link>
          </div>
          <p style={styles.ctaMeta}>
            200 posti totali · prezzo bloccato a vita anche al rinnovo
          </p>
        </section>
      </div>

      <style>{`
        .dashboard-preview-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
        }
        .btn-secondary-hover:hover {
          border-color: var(--accent);
          background: var(--accent-glow);
        }
        @media (prefers-reduced-motion: reduce) {
          .dashboard-preview-card,
          .btn-secondary-hover,
          .btn-lift {
            transition: none !important;
          }
          .dashboard-preview-card:hover {
            transform: none !important;
          }
        }
        /* Focus visible coerente coi pattern esistenti */
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}

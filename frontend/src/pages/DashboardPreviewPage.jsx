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
  // Mockup illustrato che riproduce UI Agente Ferro (basato sui componenti veri
  // della DASHBOARD: MissionHero, ActionPlanList, BodySystemGrid, AmbientStatsStrip)
  mockup: {
    width: '100%',
    background: 'linear-gradient(135deg, #0F0F11 0%, #131316 100%)',
    padding: 'clamp(16px, 2.5vw, 28px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  },
  mockHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 'var(--space-3)',
    borderBottom: '1px solid var(--border)',
  },
  mockHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
  },
  mockAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #EC4757 0%, #7A0815 70%)',
    boxShadow: '0 0 12px var(--accent-glow)',
  },
  mockHeaderTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 13,
    letterSpacing: 3,
    color: 'var(--text)',
    margin: 0,
  },
  mockHeaderSub: {
    fontSize: 11,
    color: 'var(--text-sec)',
    margin: 0,
  },
  mockStatusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    color: '#10B981',
    fontWeight: 500,
  },
  mockStatusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#10B981',
    boxShadow: '0 0 6px #10B981',
  },
  // MissionHero replica
  mockMission: {
    background: 'linear-gradient(135deg, rgba(236,71,87,0.08) 0%, var(--bg-card) 100%)',
    border: '1px solid rgba(236,71,87,0.30)',
    boxShadow: '0 0 0 1px rgba(236,71,87,0.20) inset',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-5)',
  },
  mockMissionTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(236,71,87,0.12)',
    color: 'var(--accent)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 600,
    marginBottom: 'var(--space-3)',
  },
  mockMissionText: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(18px, 2.4vw, 24px)',
    lineHeight: 1.2,
    color: 'var(--text)',
    margin: '0 0 var(--space-4) 0',
  },
  mockMissionCTA: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--accent-fill)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: 600,
  },
  // ActionPlan replica
  mockSectionTitle: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 12,
    letterSpacing: 2,
    color: 'var(--text-sec)',
    margin: '0 0 var(--space-2) 0',
  },
  mockActionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  mockAction: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: '10px 14px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
  },
  mockActionAttention: {
    borderColor: 'rgba(245,158,11,0.40)',
    background: 'rgba(245,158,11,0.08)',
  },
  mockActionCritical: {
    borderColor: 'rgba(236,71,87,0.50)',
    background: 'rgba(236,71,87,0.08)',
  },
  mockCheck: {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: '1.5px solid var(--border-hover)',
    flexShrink: 0,
  },
  mockCheckDone: {
    background: '#10B981',
    borderColor: '#10B981',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
  },
  mockActionText: {
    flex: 1,
    fontSize: 13,
    color: 'var(--text)',
    margin: 0,
  },
  mockActionTextDone: {
    color: 'var(--text-sec)',
    textDecoration: 'line-through',
  },
  mockBadge: {
    fontSize: 9,
    padding: '2px 6px',
    borderRadius: 4,
    fontWeight: 600,
    letterSpacing: 1,
  },
  mockBadgeAttention: { background: 'rgba(245,158,11,0.20)', color: '#F59E0B' },
  mockBadgeCritical: { background: 'rgba(236,71,87,0.20)', color: '#EC4757' },
  // BodySystemGrid replica
  mockGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 8,
  },
  mockSystem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '12px 8px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
  },
  mockSystemIcon: {
    width: 28,
    height: 28,
    color: 'var(--text-sec)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockSystemLabel: {
    fontSize: 10,
    color: 'var(--text-sec)',
    margin: 0,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  mockSystemDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#10B981',
  },
  mockSystemDotAttention: { background: '#F59E0B' },
  // Stats strip
  mockStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--space-3)',
    paddingTop: 'var(--space-3)',
    borderTop: '1px solid var(--border)',
  },
  mockStat: {
    textAlign: 'center',
  },
  mockStatValue: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif",
    fontSize: 'clamp(18px, 2.5vw, 22px)',
    color: 'var(--text)',
    margin: 0,
    letterSpacing: 1,
  },
  mockStatLabel: {
    fontSize: 9,
    color: 'var(--text-sec)',
    margin: 0,
    letterSpacing: 1,
    textTransform: 'uppercase',
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

        {/* Mockup illustrato Dashboard — riproduce 1:1 i componenti veri Agente Ferro.
            Marketing teaser: tutto il contenuto interno e' aria-hidden, solo il
            wrapper esterno ha role="img" + aria-label sintetico per AT. */}
        <div style={styles.screenshotWrap}>
          <div
            role="img"
            aria-label="Anteprima della Dashboard membri Salute di Ferro: Agente di Ferro, mission del giorno, piano d'azione, sistemi del corpo e Coach dedicato"
            style={styles.mockup}
          >
            <div aria-hidden="true">
              {/* Header */}
              <div style={styles.mockHeader}>
                <div style={styles.mockHeaderLeft}>
                  <div style={styles.mockAvatar} />
                  <div>
                    <p style={styles.mockHeaderTitle}>AGENTE DI FERRO</p>
                    <p style={styles.mockHeaderSub}>Briefing di oggi · Coach AI proattivo</p>
                  </div>
                </div>
                <span style={styles.mockStatusPill}>
                  <span style={styles.mockStatusDot} />
                  attivo
                </span>
              </div>

              {/* MissionHero */}
              <div style={{ ...styles.mockMission, marginTop: 16 }}>
                <span style={styles.mockMissionTag}>
                  <span>🎯</span>
                  MISSION OGGI
                </span>
                <p style={styles.mockMissionText}>
                  Allenamento di forza · sblocca lo squat con 5×5 a 100kg
                </p>
                <span style={styles.mockMissionCTA}>
                  APRI IL PIANO
                  <span style={{ fontSize: 14 }}>→</span>
                </span>
              </div>

              {/* Action Plan */}
              <div style={{ marginTop: 18 }}>
                <p style={styles.mockSectionTitle}>PIANO D'AZIONE · TOP 3</p>
                <div style={styles.mockActionList}>
                  <div style={{ ...styles.mockAction, ...styles.mockActionCritical }}>
                    <div style={styles.mockCheck} />
                    <p style={styles.mockActionText}>Prenota controllo testosterone — scadenza 3gg</p>
                    <span style={{ ...styles.mockBadge, ...styles.mockBadgeCritical }}>URGENTE</span>
                  </div>
                  <div style={{ ...styles.mockAction, ...styles.mockActionAttention }}>
                    <div style={styles.mockCheck} />
                    <p style={styles.mockActionText}>Carica referto esami del sangue del 12 maggio</p>
                    <span style={{ ...styles.mockBadge, ...styles.mockBadgeAttention }}>OGGI</span>
                  </div>
                  <div style={styles.mockAction}>
                    <div style={{ ...styles.mockCheck, ...styles.mockCheckDone }}>✓</div>
                    <p style={{ ...styles.mockActionText, ...styles.mockActionTextDone }}>
                      Idratazione 2,5L — fatto
                    </p>
                  </div>
                </div>
              </div>

              {/* Body Systems */}
              <div style={{ marginTop: 18 }}>
                <p style={styles.mockSectionTitle}>SISTEMI DEL CORPO</p>
                <div style={styles.mockGrid}>
                  <div style={styles.mockSystem}>
                    <svg style={styles.mockSystemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    <p style={styles.mockSystemLabel}>Recovery</p>
                    <span style={styles.mockSystemDot} />
                  </div>
                  <div style={styles.mockSystem}>
                    <svg style={styles.mockSystemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <p style={styles.mockSystemLabel}>Ormoni</p>
                    <span style={{ ...styles.mockSystemDot, ...styles.mockSystemDotAttention }} />
                  </div>
                  <div style={styles.mockSystem}>
                    <svg style={styles.mockSystemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <p style={styles.mockSystemLabel}>Cardio</p>
                    <span style={styles.mockSystemDot} />
                  </div>
                  <div style={styles.mockSystem}>
                    <svg style={styles.mockSystemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                    <p style={styles.mockSystemLabel}>Metabolico</p>
                    <span style={styles.mockSystemDot} />
                  </div>
                  <div style={styles.mockSystem}>
                    <svg style={styles.mockSystemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="16" height="10" rx="2" />
                      <line x1="22" y1="11" x2="22" y2="13" />
                      <line x1="6" y1="11" x2="14" y2="11" />
                    </svg>
                    <p style={styles.mockSystemLabel}>Energia & Ferro</p>
                    <span style={styles.mockSystemDot} />
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div style={{ ...styles.mockStats, marginTop: 16 }}>
                <div style={styles.mockStat}>
                  <p style={styles.mockStatValue}>7,4h</p>
                  <p style={styles.mockStatLabel}>Sonno</p>
                </div>
                <div style={styles.mockStat}>
                  <p style={styles.mockStatValue}>62</p>
                  <p style={styles.mockStatLabel}>HRV</p>
                </div>
                <div style={styles.mockStat}>
                  <p style={styles.mockStatValue}>6.480</p>
                  <p style={styles.mockStatLabel}>Passi</p>
                </div>
                <div style={styles.mockStat}>
                  <p style={styles.mockStatValue}>+12%</p>
                  <p style={styles.mockStatLabel}>Trend mese</p>
                </div>
              </div>
            </div>
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

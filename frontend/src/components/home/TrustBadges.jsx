import FadeUp from '../ui/FadeUp';

const badges = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'Laboratori Certificati',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    label: 'GDPR Compliant',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    label: 'Linee Guida 2024-2025',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    label: 'Dati Criptati',
  },
];

const s = {
  section: {
    padding: '48px 40px',
    background: 'linear-gradient(180deg, rgba(248,113,113,0.03) 0%, transparent 100%)',
    textAlign: 'center',
  },
  label: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 24,
  },
  row: {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16,
    marginBottom: 24,
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '10px 18px', fontSize: 13,
    color: 'var(--text-sec)', fontWeight: 400,
  },
  refs: {
    fontSize: 12, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 300,
  },
};

export default function TrustBadges() {
  return (
    <section style={s.section}>
      <FadeUp>
        <div style={s.label}>BASATO SU EVIDENZE SCIENTIFICHE</div>
        <div style={s.row}>
          {badges.map((b, i) => (
            <div key={i} style={s.badge}>
              {b.icon}
              {b.label}
            </div>
          ))}
        </div>
        <div style={s.refs}>
          EAU 2024 · ESC/EAS 2025 · KDIGO 2024 · AASLD 2024 · ATA/AACE
        </div>
      </FadeUp>
    </section>
  );
}

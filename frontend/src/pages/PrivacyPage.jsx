const s = {
  wrap: {
    maxWidth: 800, margin: '0 auto', padding: '60px 40px 80px',
    position: 'relative', zIndex: 1,
  },
  h1: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)',
    letterSpacing: 2, color: 'var(--text)', marginBottom: 8,
  },
  sub: {
    fontSize: 13, color: 'var(--text-sec)', marginBottom: 40,
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1,
    color: 'var(--text)', marginTop: 32, marginBottom: 12,
  },
  p: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.8, marginBottom: 16,
  },
  ul: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.8, marginBottom: 16,
    paddingLeft: 20,
  },
  a: { color: 'var(--accent)' },
};

export default function PrivacyPage() {
  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>PRIVACY POLICY</h1>
      <p style={s.sub}>Informativa ai sensi dell'art. 13 Regolamento UE 2016/679 (GDPR)</p>

      <h2 style={s.h2}>1. Titolare del trattamento</h2>
      <p style={s.p}>Salute di Ferro · <a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a></p>

      <h2 style={s.h2}>2. Dati raccolti</h2>
      <p style={s.p}>Raccogliamo le seguenti categorie di dati:</p>
      <ul style={s.ul}>
        <li>Dati identificativi (nome, cognome, email, telefono)</li>
        <li>Dati relativi alla salute e parametri biologici (risposte al questionario)</li>
        <li>Dati di navigazione e analitici (cookie, UTM, interazioni con il quiz)</li>
      </ul>

      <h2 style={s.h2}>3. Finalità e base giuridica</h2>
      <p style={s.p}>I tuoi dati vengono trattati per:</p>
      <ul style={s.ul}>
        <li>Fornitura del servizio di coordinamento accesso a esami del sangue. Base giuridica: Art. 6(1)(b) GDPR (esecuzione di misure precontrattuali)</li>
        <li>Trattamento di dati sulla salute. Base giuridica: Art. 9(2)(a) GDPR (consenso esplicito)</li>
        <li>Analisi e miglioramento del servizio. Base giuridica: Art. 6(1)(f) GDPR (legittimo interesse)</li>
      </ul>

      <h2 style={s.h2}>4. Conservazione dei dati</h2>
      <p style={s.p}>I dati personali saranno conservati per un periodo massimo di 90 giorni dalla raccolta, salvo instaurazione di un rapporto di servizio continuativo.</p>

      <h2 style={s.h2}>5. I tuoi diritti</h2>
      <p style={s.p}>Hai il diritto di:</p>
      <ul style={s.ul}>
        <li>Accedere ai tuoi dati personali</li>
        <li>Rettificare dati inesatti</li>
        <li>Cancellare i tuoi dati</li>
        <li>Portabilità dei dati</li>
        <li>Revocare il consenso in qualsiasi momento</li>
      </ul>
      <p style={s.p}>Per esercitare i tuoi diritti, scrivi a <a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a></p>

      <h2 style={s.h2}>6. Sicurezza</h2>
      <p style={s.p}>Adottiamo misure tecniche e organizzative adeguate a garantire la riservatezza, l'integrità e la disponibilità dei tuoi dati.</p>

      <h2 style={s.h2}>7. Trasferimento a terzi</h2>
      <p style={s.p}>I dati potranno essere trasferiti a specialisti o terapisti esclusivamente con il tuo consenso e per le finalità del servizio.</p>
    </div>
  );
}

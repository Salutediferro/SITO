import { Link } from 'react-router-dom';

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
  noteBox: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '16px 20px',
    margin: '24px 0',
    fontSize: 13,
    color: 'var(--text-sec)',
    lineHeight: 1.6,
  },
};

export default function ConsensoInformatoPage() {
  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>CONSENSO INFORMATO</h1>
      <p style={s.sub}>
        Trattamento dei dati personali e dei dati relativi alla salute &mdash; ai sensi degli
        artt. 6, 7, 9, 13 e 32 del Regolamento UE 2016/679 (GDPR)
      </p>

      <div style={s.noteBox}>
        Questa pagina riproduce, ai fini di consultazione, il modulo di Consenso Informato
        che l&apos;Interessato presta o nega in modo esplicito al momento della registrazione
        e dell&apos;utilizzo dei servizi della Piattaforma. I consensi effettivi vengono
        raccolti digitalmente all&apos;interno del flusso di compilazione del Test di Ferro
        e/o nell&apos;area utente, in conformit&agrave; al principio di consenso libero,
        specifico, informato e inequivocabile (art. 4, par. 11, GDPR).
      </div>

      <h2 style={s.h2}>Dichiarazioni preliminari</h2>
      <p style={s.p}>
        L&apos;Interessato dichiara di aver ricevuto, letto e compreso l&apos;
        <Link to="/privacy" style={s.a}>Informativa Privacy</Link> resa da Salute di Ferro,
        nella persona dei co-fondatori Simone Pagnottoni e Antonio Titaro, con recapito
        {' '}<a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a>,
        in qualit&agrave; di Titolare del trattamento.
      </p>
      <p style={s.p}>L&apos;Interessato dichiara inoltre:</p>
      <ul style={s.ul}>
        <li>di essere consapevole che i servizi Salute di Ferro hanno natura non sanitaria;</li>
        <li>che tali servizi non prevedono diagnosi, pareri medici, prescrizioni o terapie e
          non sostituiscono il medico, il laboratorio o altre figure sanitarie;</li>
        <li>che le prestazioni di laboratorio sono erogate in via esclusiva dai laboratori
          convenzionati, che operano quali autonomi erogatori sanitari e autonomi titolari
          del trattamento per le finalit&agrave; sanitarie;</li>
        <li>che il servizio pu&ograve; includere, su scelta dell&apos;Interessato, la ricezione,
          gestione e archiviazione temporanea di documentazione contenente dati relativi alla
          salute trasmessa volontariamente dallo stesso.</li>
      </ul>

      <h2 style={s.h2}>Sezione A &mdash; Consenso al trattamento dei dati relativi alla salute</h2>
      <p style={s.p}>
        Ai sensi dell&apos;art. 9, par. 2, lett. a) del GDPR, l&apos;Interessato presta o nega il
        proprio consenso esplicito al trattamento dei dati relativi alla salute (referti, analisi
        cliniche, esami ematici) per le seguenti finalit&agrave;:
      </p>
      <ul style={s.ul}>
        <li>erogazione dei servizi di coordinamento, orientamento e supporto decisionale non clinico;</li>
        <li>ricezione, archiviazione temporanea e gestione della documentazione sanitaria trasmessa
          volontariamente dall&apos;Interessato;</li>
        <li>eventuale trasmissione della documentazione a professionisti esterni esclusivamente su
          richiesta dell&apos;Interessato o con suo consenso esplicito;</li>
        <li>gestione organizzativa, operativa e di sicurezza del servizio.</li>
      </ul>
      <p style={s.p}>
        Il conferimento dei dati relativi alla salute &egrave; facoltativo ma necessario per
        l&apos;erogazione dei servizi che richiedono tale trattamento. Il mancato consenso non
        impedisce l&apos;accesso ai servizi SDF che non richiedono il trattamento di dati sanitari.
      </p>

      <h2 style={s.h2}>Sezione B &mdash; Consenso alle comunicazioni commerciali</h2>
      <p style={s.p}>
        Ai sensi dell&apos;art. 6, par. 1, lett. a) del GDPR, l&apos;Interessato presta o nega il
        proprio consenso all&apos;invio di comunicazioni commerciali, newsletter e informazioni
        promozionali sui servizi Salute di Ferro. Il consenso &egrave; facoltativo e pu&ograve;
        essere revocato in qualsiasi momento scrivendo a
        {' '}<a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a> o tramite
        il link di disiscrizione presente nelle comunicazioni stesse.
      </p>

      <h2 style={s.h2}>Conservazione dei dati</h2>
      <p style={s.p}>
        I dati relativi alla salute saranno conservati per un periodo massimo di 24 mesi dalla
        cessazione del rapporto contrattuale, salvo obblighi di legge o necessit&agrave; di
        tutela dei diritti del Titolare. Decorso tale termine, i dati saranno cancellati o resi
        anonimi in modo irreversibile.
      </p>

      <h2 style={s.h2}>Misure di sicurezza</h2>
      <p style={s.p}>
        Il trattamento &egrave; effettuato mediante strumenti informatici e telematici nel
        rispetto dell&apos;art. 32 del GDPR, adottando misure tecniche e organizzative adeguate
        a garantire riservatezza, integrit&agrave;, disponibilit&agrave; e protezione dei dati
        personali.
      </p>

      <h2 style={s.h2}>Trasferimento dei dati extra UE</h2>
      <p style={s.p}>
        Qualora i dati fossero trattati tramite fornitori o piattaforme con server situati al di
        fuori dell&apos;Unione Europea, il trasferimento avverr&agrave; nel rispetto degli artt.
        44 e ss. del GDPR, sulla base di decisioni di adeguatezza della Commissione Europea o di
        Clausole Contrattuali Standard.
      </p>

      <h2 style={s.h2}>Diritti dell&apos;Interessato</h2>
      <p style={s.p}>
        L&apos;Interessato pu&ograve; esercitare i diritti previsti dagli artt. 15&ndash;22 del
        GDPR (accesso, rettifica, cancellazione, limitazione, portabilit&agrave;, opposizione e
        revoca del consenso) scrivendo in qualsiasi momento a
        {' '}<a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a>, senza
        pregiudizio per la liceit&agrave; del trattamento precedente alla revoca.
      </p>

      <h2 style={s.h2}>Dichiarazioni finali</h2>
      <ul style={s.ul}>
        <li>L&apos;Interessato dichiara che i dati trasmessi si riferiscono a s&eacute; stesso
          oppure che &egrave; legittimamente autorizzato alla loro comunicazione.</li>
        <li>Il conferimento dei dati relativi alla salute &egrave; facoltativo ma necessario per
          l&apos;erogazione dei servizi che richiedono tale trattamento.</li>
        <li>Il mancato consenso alla Sezione A non impedisce l&apos;accesso ai servizi SDF che
          non richiedono il trattamento di dati sanitari.</li>
      </ul>

      <p style={{ ...s.p, marginTop: 32, fontSize: 12, color: 'var(--text-muted)' }}>
        Ultima revisione: 12 maggio 2026. Per visualizzare l&apos;informativa completa consulta la
        {' '}<Link to="/privacy" style={s.a}>Privacy Policy</Link>.
      </p>
    </div>
  );
}

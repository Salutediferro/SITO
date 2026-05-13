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
    fontSize: 13, color: 'var(--text-sec)', marginBottom: 16,
  },
  preamble: {
    fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.8, marginBottom: 40,
    fontStyle: 'italic',
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
  // Sezione minori — discreta per richiesta esplicita user: stesso font-size 14 (WCAG 1.4.4)
  // ma colore text-muted + margin ridotto per discrezione visiva.
  pDiscreto: {
    fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 12,
    marginTop: 8,
  },
  h2Discreto: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1,
    color: 'var(--text-muted)', marginTop: 24, marginBottom: 6,
  },
};

export default function PrivacyPage() {
  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>PRIVACY POLICY</h1>
      <p style={s.sub}>
        Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (&ldquo;GDPR&rdquo;)
      </p>

      <p style={s.preamble}>
        Gentile Utente, Salute di Ferro (di seguito anche &ldquo;SDF&rdquo;), nella persona dei
        co-fondatori Simone Pagnottoni e Antonio Titaro, in qualit&agrave; di titolari del
        trattamento dei dati personali (il &ldquo;Titolare&rdquo;), intende fornirLe le
        informazioni sul trattamento dei Suoi dati personali effettuato nell&apos;ambito dei
        servizi di coordinamento, prenotazione e supporto non clinico per l&apos;accesso a
        pannelli ematici e prestazioni di laboratorio offerti tramite la piattaforma
        disponibile sul sito web &mdash; di seguito la &ldquo;Piattaforma&rdquo; &mdash;
        ai sensi dell&apos;art. 13 del Regolamento (UE) 2016/679 del Parlamento europeo e
        del Consiglio del 27 aprile 2016 (&ldquo;GDPR&rdquo;) e della normativa europea e
        nazionale che lo integra e/o modifica, ivi compreso il D.Lgs. n. 196/2003, come
        modificato dal D.Lgs. n. 101/2018 (di seguito, &ldquo;Codice Privacy&rdquo;).
      </p>

      <p style={s.p}>
        <strong>Nota preliminare sulla natura del servizio.</strong> SDF non eroga
        prestazioni sanitarie, non effettua diagnosi, non interpreta referti e non si
        sostituisce al medico o al laboratorio. Le prestazioni di laboratorio sono
        erogate in via esclusiva dai laboratori convenzionati, che operano quali
        autonomi titolari del trattamento per le finalit&agrave; sanitarie.
      </p>

      <h2 style={s.h2}>1. Titolare del trattamento</h2>
      <p style={s.p}>
        Il Titolare del trattamento &egrave; Salute di Ferro, nella persona dei co-fondatori
        Simone Pagnottoni e Antonio Titaro. Nella fase antecedente alla formale costituzione
        societaria, i co-fondatori agiscono in nome proprio e/o per conto della societ&agrave;
        costituenda.
      </p>
      <p style={s.p}>
        Recapiti del Titolare: <a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a>
      </p>

      <h2 style={s.h2}>2. Dati personali oggetto del trattamento</h2>
      <p style={s.p}>Il Titolare tratter&agrave; le seguenti categorie di dati personali:</p>
      <ul style={s.ul}>
        <li><strong>Dati comuni</strong>: nome, cognome, data di nascita, indirizzo email,
          numero di telefono, dati di account, preferenze commerciali e ogni altro dato di
          contatto fornito dall&apos;Interessato in fase di registrazione o prenotazione.</li>
        <li><strong>Dati di prenotazione e transazione</strong>: pannello selezionato, sede e
          orario del prelievo, dati di pagamento gestiti tramite provider terzo, codice
          prenotazione SDF, storico dei servizi acquistati.</li>
        <li><strong>Dati relativi alla salute (categorie particolari ai sensi dell&apos;art. 9 GDPR)</strong>:
          referti, analisi cliniche ed esami ematici eventualmente trasmessi volontariamente
          dall&apos;Interessato, esclusivamente nei limiti e per le finalit&agrave; indicate al
          paragrafo 3 e con il consenso esplicito di cui al modulo allegato. SDF non riceve
          referti n&eacute; esiti direttamente dal laboratorio, salvo separato consenso esplicito
          e apposito accordo.</li>
      </ul>

      <h2 style={s.h2}>3. Finalit&agrave; e basi giuridiche del trattamento</h2>
      <p style={s.p}><strong>3.1 Finalit&agrave; per le quali il consenso non &egrave; richiesto</strong></p>
      <p style={s.p}>Le seguenti finalit&agrave; sono fondate su basi giuridiche diverse dal consenso:</p>
      <ul style={s.ul}>
        <li>erogazione dei servizi di prenotazione, coordinamento e supporto non clinico
          richiesti dall&apos;Interessato (esecuzione del contratto &mdash; art. 6, par. 1,
          lett. b) GDPR);</li>
        <li>adempimento di obblighi di legge, fiscali e amministrativi (art. 6, par. 1, lett. c) GDPR);</li>
        <li>gestione dei pagamenti e della relativa documentazione fiscale, inclusa la
          tracciabilit&agrave; delle transazioni (art. 6, par. 1, lett. b) e c) GDPR);</li>
        <li>customer care commerciale e organizzativo, gestione reclami non sanitari, risposta
          alle richieste degli Interessati (legittimo interesse del Titolare &mdash; art. 6,
          par. 1, lett. f) GDPR);</li>
        <li>gestione di eventuali controversie e tutela dei diritti del Titolare in sede
          giudiziale o stragiudiziale (art. 6, par. 1, lett. f) e art. 9, par. 2, lett. f) GDPR);</li>
        <li>invio di comunicazioni di servizio relative alle prenotazioni e ai pagamenti
          (esecuzione del contratto &mdash; art. 6, par. 1, lett. b) GDPR).</li>
      </ul>

      <p style={s.p}><strong>3.2 Finalit&agrave; per le quali &egrave; richiesto il consenso</strong></p>
      <p style={s.p}>
        Le seguenti finalit&agrave; richiedono il consenso esplicito dell&apos;Interessato, che
        pu&ograve; essere revocato in qualsiasi momento senza pregiudizio per la liceit&agrave;
        del trattamento precedente alla revoca:
      </p>
      <ul style={s.ul}>
        <li>trattamento dei dati relativi alla salute (referti, analisi, esami ematici)
          trasmessi volontariamente dall&apos;Interessato per le finalit&agrave; di coordinamento,
          supporto non clinico e gestione organizzativa del servizio (art. 9, par. 2, lett. a) GDPR);</li>
        <li>invio di comunicazioni commerciali, newsletter e informazioni promozionali sui
          servizi SDF (art. 6, par. 1, lett. a) GDPR). L&apos;Interessato pu&ograve; opporsi in
          qualsiasi momento scrivendo a <a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a> o
          utilizzando il link di disiscrizione presente nelle comunicazioni.</li>
      </ul>

      <h2 style={s.h2}>4. Modalit&agrave; del trattamento</h2>
      <p style={s.p}>
        Il trattamento avviene nel rispetto dei principi di correttezza, liceit&agrave; e
        trasparenza, tramite strumenti informatici e telematici, con logiche strettamente
        correlate alle finalit&agrave; indicate. SDF adotta misure tecniche e organizzative
        adeguate ai sensi degli artt. 25 e 32 del GDPR per garantire riservatezza,
        integrit&agrave;, disponibilit&agrave; e protezione dei dati. Il trattamento &egrave;
        svolto esclusivamente da soggetti debitamente autorizzati e istruiti dal Titolare.
      </p>

      <h2 style={s.h2}>5. Conservazione dei dati personali</h2>
      <p style={s.p}>
        I dati personali sono conservati per il tempo strettamente necessario alle finalit&agrave;
        per cui sono raccolti, nel rispetto del principio di minimizzazione (art. 5, par. 1, lett. e)
        GDPR) e degli obblighi di legge. In particolare:
      </p>
      <ul style={s.ul}>
        <li><strong>Dati di account e prenotazione</strong>: per la durata del rapporto contrattuale
          e, successivamente, per il periodo di prescrizione degli eventuali diritti connessi
          (ordinariamente 10 anni ai sensi del codice civile), salvo obblighi di conservazione
          pi&ugrave; lunghi previsti dalla legge.</li>
        <li><strong>Dati di pagamento e documentazione fiscale</strong>: secondo i termini previsti
          dalla normativa fiscale e contabile applicabile.</li>
        <li><strong>Dati relativi alla salute trasmessi volontariamente</strong>: per un massimo di
          24 mesi dalla cessazione del rapporto contrattuale, salvo diverso accordo scritto o
          obblighi di legge. Decorso tale termine, i dati saranno cancellati o resi anonimi in
          modo irreversibile.</li>
        <li><strong>Dati trattati per finalit&agrave; di marketing</strong>: fino alla revoca del
          consenso o all&apos;opposizione dell&apos;Interessato.</li>
      </ul>

      <h2 style={s.h2}>6. Comunicazione e destinatari dei dati</h2>
      <p style={s.p}>
        I dati personali non sono oggetto di diffusione. SDF potr&agrave; comunicare i dati ai
        seguenti soggetti, nei limiti strettamente necessari alle finalit&agrave; indicate:
      </p>
      <ul style={s.ul}>
        <li><strong>Laboratori convenzionati</strong> (Bianalisi e altri partner): ai soli fini
          della prenotazione e della corretta accettazione del cliente. I laboratori operano
          quali autonomi titolari del trattamento per le finalit&agrave; sanitarie (prelievo,
          analisi, refertazione).</li>
        <li><strong>Fornitori di servizi tecnologici e infrastrutturali</strong> (payment provider,
          piattaforma di prenotazione, email provider, CRM): in qualit&agrave; di responsabili del
          trattamento ai sensi dell&apos;art. 28 GDPR, previa stipula di apposito accordo.</li>
        <li><strong>Professionisti sanitari collaboratori di SDF</strong> (medici, specialisti):
          limitatamente ai dati necessari per l&apos;erogazione del servizio di supporto non
          clinico e solo con il consenso dell&apos;Interessato.</li>
        <li><strong>Autorit&agrave; pubbliche, giudiziarie o di controllo</strong>: nei casi previsti
          dalla legge o su ordine delle autorit&agrave; competenti.</li>
      </ul>
      <p style={s.p}>
        Qualora emerga una contitolarit&agrave; del trattamento con uno o pi&ugrave; partner,
        sar&agrave; sottoscritto apposito accordo ai sensi dell&apos;art. 26 GDPR. L&apos;elenco
        aggiornato dei responsabili del trattamento nominati da SDF &egrave; disponibile su
        richiesta scrivendo a <a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a>.
      </p>

      <h2 style={s.h2}>7. Trasferimento dei dati extra UE</h2>
      <p style={s.p}>
        Qualora i dati siano trattati tramite fornitori o piattaforme con server situati al di
        fuori dell&apos;Unione Europea, il trasferimento avverr&agrave; nel rispetto degli artt. 44
        e ss. del GDPR, sulla base di decisioni di adeguatezza della Commissione Europea, di
        Clausole Contrattuali Standard o di altre garanzie appropriate previste dal GDPR.
      </p>

      <h2 style={s.h2}>8. Diritti dell&apos;Interessato</h2>
      <p style={s.p}>Ai sensi degli artt. 15&ndash;22 del GDPR, l&apos;Interessato ha il diritto di:</p>
      <ul style={s.ul}>
        <li>accedere ai propri dati personali e ottenerne copia;</li>
        <li>chiedere la rettifica di dati inesatti o incompleti;</li>
        <li>chiedere la cancellazione dei dati (&ldquo;diritto all&apos;oblio&rdquo;), nei casi previsti dalla legge;</li>
        <li>chiedere la limitazione del trattamento;</li>
        <li>opporsi al trattamento per motivi legittimi o per finalit&agrave; di marketing diretto;</li>
        <li>ottenere la portabilit&agrave; dei dati, nei casi previsti;</li>
        <li>revocare il consenso in qualsiasi momento, senza pregiudizio per la liceit&agrave; del trattamento precedente;</li>
        <li>non essere sottoposto a decisioni basate esclusivamente su trattamenti automatizzati, inclusa la profilazione, con effetti giuridici significativi;</li>
        <li>proporre reclamo al <a style={s.a} href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">Garante per la Protezione dei Dati Personali <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>(apre in nuova scheda)</span></a>.</li>
      </ul>
      <p style={s.p}>
        Le richieste vanno indirizzate per iscritto al Titolare all&apos;indirizzo:
        {' '}<a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a>. SDF
        risponder&agrave; entro 30 giorni dalla ricezione, salvo proroga nei casi previsti dall&apos;art. 12 GDPR.
      </p>

      <h2 style={s.h2}>9. Aggiornamenti dell&apos;informativa</h2>
      <p style={s.p}>
        La presente informativa potr&agrave; essere aggiornata in seguito a modifiche normative,
        operative o tecnologiche. Ogni aggiornamento sostanziale sar&agrave; comunicato all&apos;Interessato
        tramite email o mediante avviso sulla Piattaforma. La versione vigente &egrave; sempre
        disponibile sul sito di SDF.
      </p>

      {/* Sezione discreta — minori e DPO. Stesso font-size del resto (WCAG 1.4.4),
          ma colore muted + margin ridotto per minor invasivit&agrave; visiva. */}
      <h2 style={s.h2Discreto}>10. Minori di 16 anni</h2>
      <p style={s.pDiscreto}>
        I servizi SDF sono rivolti a un pubblico adulto. Non &egrave; previsto l&apos;utilizzo
        consapevole da parte di minori di 16 anni; eventuali genitori o tutori che desiderino
        richiedere la cancellazione di dati possono contattare il Titolare all&apos;indirizzo
        {' '}<a style={s.a} href="mailto:info@salutediferro.com">info@salutediferro.com</a>.
      </p>

      <h2 style={s.h2Discreto}>11. Responsabile della Protezione dei Dati (DPO)</h2>
      <p style={s.pDiscreto}>
        Il Titolare ha valutato che, allo stato attuale, non sussistono i presupposti di
        obbligatoriet&agrave; della nomina del DPO ai sensi dell&apos;art. 37 GDPR, non operando
        un trattamento sistematico su larga scala di categorie particolari di dati. Tale
        valutazione &egrave; soggetta a riesame in caso di evoluzione dei servizi.
      </p>

      <p style={{ ...s.p, marginTop: 32, fontSize: 12, color: 'var(--text-muted)' }}>
        Ultima revisione: 12 maggio 2026.
      </p>
    </div>
  );
}

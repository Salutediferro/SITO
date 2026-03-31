export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const RESEND_API_KEY = env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Common label mappings
  const SEX = { A: 'Maschio', B: 'Femmina' };
  const AGE = { A: 'Under 30', B: '30-40', C: '40-50', D: 'Over 50' };
  const TRAINING = { A: 'Meno di 1 anno', B: '1-3 anni', C: '3-5 anni', D: '5-10 anni', E: 'Più di 10 anni' };
  const SEGMENT_LABEL = { M_U40: 'Maschio Under 40', M_O40: 'Maschio Over 40', F_U40: 'Femmina Under 40', F_O40: 'Femmina Over 40' };

  // Segment-based label mappings
  const PHARMA = {
    M_U40: { A: 'Mai', B: 'In passato', C: 'Attualmente', D: 'Preferisco non rispondere' },
    M_O40: { A: 'Mai', B: 'In passato', C: 'Attualmente in TRT', D: 'Preferisco non rispondere' },
    F_U40: { A: 'No', B: 'Contraccettivi ormonali', C: 'Altri farmaci ormonali', D: 'Preferisco non rispondere' },
    F_O40: { A: 'No', B: 'Sì, TOS/HRT', C: 'Integratori per menopausa', D: 'Preferisco non rispondere' },
  };

  const ALIMENTAZIONE = {
    M_U40: { A: 'Piano alimentare strutturato', B: 'Bene ma senza piano', C: 'Fatica a mangiare regolare', D: 'Spesso fuori o cibi pronti' },
    M_O40: { A: 'Equilibrata e controllata', B: 'Regolare senza piano', C: 'Spesso fuori o disordinato', D: 'Ingrasso nonostante mangi come prima' },
    F_U40: { A: 'Equilibrata e varia', B: 'Salta pasti o mangia poco', C: 'Voglie o fame nervosa', D: 'Spesso fuori o cibi pronti' },
    F_O40: { A: 'Equilibrata e attenta', B: 'Ingrasso più facilmente', C: 'Mangio poco per paura', D: 'Non seguo un regime' },
  };

  const SONNO = {
    M_U40: { A: '7-9 ore, riposato', B: 'Abbastanza ma stanco', C: 'Meno di 6 ore', D: 'Difficoltà ad addormentarmi' },
    M_O40: { A: '7-8 ore senza problemi', B: 'Risvegli notturni', C: 'Difficoltà ad addormentarmi', D: 'Poco sonno, stanco al mattino' },
    F_U40: { A: '7-9 ore senza problemi', B: 'Non mi sento riposata', C: 'Difficoltà per ansia', D: 'Peggiora con il ciclo' },
    F_O40: { A: 'Bene, senza risvegli', B: 'Risvegli (vampate/sudorazione)', C: 'Difficoltà per ansia', D: 'Poco sonno, esausta' },
  };

  const STRESS = {
    M_U40: { A: 'Basso', B: 'Moderato', C: 'Alto', D: 'Molto alto, impatta umore' },
    M_O40: { A: 'Basso', B: 'Moderato', C: 'Alto, pesa nel quotidiano', D: 'Molto alto, impatta salute' },
    F_U40: { A: 'Basso, in equilibrio', B: 'Moderato', C: 'Alto, impatta umore/energia', D: 'Molto alto, effetti su ciclo/pelle' },
    F_O40: { A: 'Basso, serena', B: 'Moderato', C: 'Alto, pesa di più', D: 'Molto alto, impatta qualità vita' },
  };

  const DIGESTIONE = {
    M_U40: { A: 'Digerisco bene', B: 'Gonfiore frequente', C: 'Reflusso o acidità', D: 'Intestino irregolare' },
    M_O40: { A: 'Tutto regolare', B: 'Digestione lenta', C: 'Reflusso frequente', D: 'Irregolare o gonfiore' },
    F_U40: { A: 'Tutto regolare', B: 'Gonfiore pre-ciclo', C: 'Crampi o irregolarità', D: 'Reflusso o nausea' },
    F_O40: { A: 'Tutto regolare', B: 'Gonfiore e stitichezza', C: 'Reflusso o acidità', D: 'Pesantezza e digestione lenta' },
  };

  const INTEGRATORI = {
    M_U40: { A: 'Proteine/creatina', B: 'Vitamine e minerali', C: 'Vari tipi', D: 'Nessuno' },
    M_O40: { A: 'Vitamine e minerali', B: 'Prostata/cardiovascolare', C: 'Vari (anche performance)', D: 'Nessuno' },
    F_U40: { A: 'Ferro/acido folico', B: 'Vitamine e minerali', C: 'Vari tipi', D: 'Nessuno' },
    F_O40: { A: 'Calcio e vitamina D', B: 'Integratori menopausa', C: 'Vari tipi', D: 'Nessuno' },
  };

  const SYMPTOMS = {
    M_U40: { A: 'Stanchezza cronica', B: 'Calo della libido', C: 'Difficoltà nel recupero post-allenamento', D: 'Acne o pelle grassa', E: 'Ginecomastia', F: 'Sbalzi d\'umore o irritabilità', G: 'Perdita di massa muscolare', H: 'Nessuno di questi' },
    M_O40: { A: 'Calo di energia e vitalità', B: 'Calo della libido', C: 'Aumento del grasso addominale', D: 'Perdita di forza e massa muscolare', E: 'Problemi di sonno', F: 'Difficoltà di concentrazione e memoria', G: 'Umore instabile o irritabilità', H: 'Nessuno di questi' },
    F_U40: { A: 'Ciclo irregolare o doloroso', B: 'Stanchezza cronica', C: 'Sbalzi d\'umore legati al ciclo', D: 'Acne o perdita di capelli', E: 'Difficoltà a perdere peso', F: 'Gonfiore o ritenzione idrica', G: 'Ansia o irritabilità', H: 'Nessuno di questi' },
    F_O40: { A: 'Vampate di calore', B: 'Insonnia o sonno disturbato', C: 'Secchezza e disagio intimo', D: 'Sbalzi d\'umore o ansia', E: 'Aumento di peso inspiegabile', F: 'Dolori articolari o rigidità', G: 'Calo della libido', H: 'Nessuno di questi' },
  };

  const FAMILIARITA = {
    M_U40: { A: 'Malattie cardiovascolari', B: 'Diabete tipo 2', C: 'Problemi di tiroide', D: 'Colesterolo/trigliceridi alti', E: 'Problemi renali', F: 'Nessuna' },
    M_O40: { A: 'Malattie cardiovascolari', B: 'Diabete tipo 2', C: 'Tumore alla prostata', D: 'Problemi di tiroide', E: 'Colesterolo/dislipidemie', F: 'Nessuna' },
    F_U40: { A: 'Problemi di tiroide', B: 'Diabete tipo 2', C: 'Endometriosi/PCOS', D: 'Malattie cardiovascolari', E: 'Problemi di fertilità', F: 'Nessuna' },
    F_O40: { A: 'Osteoporosi', B: 'Malattie cardiovascolari', C: 'Diabete tipo 2', D: 'Problemi di tiroide', E: 'Tumore al seno/utero', F: 'Nessuna' },
  };

  const CARDIO = {
    M_U40: { A: 'Tutto nella norma', B: 'Pressione alta', C: 'Colesterolo/trigliceridi alti', D: 'Mai controllato' },
    M_O40: { A: 'Tutto nella norma', B: 'Pressione alta', C: 'Colesterolo/trigliceridi alti', D: 'Entrambi fuori norma' },
    F_U40: { A: 'Tutto nella norma', B: 'Ferro basso/anemia', C: 'Valori tiroidei alterati', D: 'Mai controllato' },
    F_O40: { A: 'Tutto nella norma', B: 'Pressione alta', C: 'Colesterolo/glicemia elevati', D: 'Non so, non controllo' },
  };

  const GOAL = {
    M_U40: { A: 'Ottimizzare il mio testosterone naturalmente', B: 'Monitorare la mia salute durante un protocollo', C: 'Massimizzare performance e recupero', D: 'Prevenzione a lungo termine' },
    M_O40: { A: 'Verificare il calo ormonale legato all\'età', B: 'Valutare se ho bisogno di TRT', C: 'Check-up completo (cuore, metabolismo, prostata)', D: 'Monitorare una terapia già in corso' },
    F_U40: { A: 'Equilibrio ormonale (tiroide, cortisolo, estrogeni)', B: 'Capire i problemi legati al ciclo', C: 'Check-up completo della salute', D: 'Supporto per fertilità o gravidanza' },
    F_O40: { A: 'Gestire i sintomi della menopausa', B: 'Valutare terapia ormonale sostitutiva', C: 'Check-up completo (ossa, cuore, metabolismo)', D: 'Prevenzione osteoporosi e salute cardiovascolare' },
  };

  const BLOOD = {
    M_U40: { A: 'Sì, pannello completo', B: 'Sì, ma solo quelli base', C: 'No, mai fatto' },
    M_O40: { A: 'Sì, nell\'ultimo anno', B: 'Sì, ma più di un anno fa', C: 'No' },
    F_U40: { A: 'Sì, completi', B: 'Sì, ma solo quelli base', C: 'No' },
    F_O40: { A: 'Sì, recentemente', B: 'Sì, ma più di un anno fa', C: 'No, mai' },
  };

  const URGENCY = {
    M_U40: { A: 'Voglio agire subito', B: 'Entro il mese', C: 'Sto valutando' },
    M_O40: { A: 'Ho sintomi evidenti, voglio agire subito', B: 'Entro il mese', C: 'Sto valutando per il futuro' },
    F_U40: { A: 'Voglio agire subito', B: 'Entro il mese', C: 'Sto valutando' },
    F_O40: { A: 'Ho sintomi che impattano la mia vita, voglio agire subito', B: 'Entro il mese', C: 'Sto raccogliendo informazioni' },
  };

  const TAG_DISPLAY = {
    CUORE: '#CUORE', FEGATO: '#FEGATO', TIROIDE: '#TIROIDE', ORMONI: '#PROFILO ORMONALE',
    METABOLISMO: '#METABOLISMO', RENI: '#RENI', CORTISOLO: '#CORTISOLO', SANGUE: '#EMOCROMO',
    PROSTATA: '#PROSTATA', TESTOSTERONE: '#TESTOSTERONE', OSSA: '#OSSA',
    FERTILITA: '#FERTILITÀ', CICLO: '#CICLO', MENOPAUSA: '#MENOPAUSA'
  };

  const seg = data.segment && PHARMA[data.segment] ? data.segment : 'M_U40';
  const pharmaMap = PHARMA[seg];
  const symptomsMap = SYMPTOMS[seg];
  const goalMap = GOAL[seg];
  const bloodMap = BLOOD[seg];
  const urgencyMap = URGENCY[seg];
  const alimentazioneMap = ALIMENTAZIONE[seg];
  const sonnoMap = SONNO[seg];
  const stressMap = STRESS[seg];
  const digestMap = DIGESTIONE[seg];
  const integMap = INTEGRATORI[seg];
  const famMap = FAMILIARITA[seg];
  const cardioMap = CARDIO[seg];

  const symptomsList = (data.symptoms || []).map((k) => `<li>${symptomsMap[k] || k}</li>`).join('');
  const familiaritaList = (data.familiarita || []).map((k) => `<li>${famMap[k] || k}</li>`).join('');
  const tags = data.tags || [];
  const tagsHtml = tags.map((t) => `<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;color:#C82020;background:rgba(200,32,32,0.1);margin:2px 4px;">${TAG_DISPLAY[t] || t}</span>`).join(' ');

  const date = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
  const urgencyLabel = urgencyMap[data.urgency] || '—';
  const urgencyColor = data.urgency === 'A' ? '#D42B2B' : data.urgency === 'B' ? '#1B4FBF' : '#7A8BAD';

  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background:#0D0D0D; margin:0; padding:0; color:#F5F5F5; }
  .wrap { max-width:560px; margin:32px auto; background:#1A1A1A; border-radius:8px; overflow:hidden; border:1px solid #2A2A2A; }
  .header { background:#C82020; padding:24px 28px; }
  .header-title { color:white; font-size:18px; letter-spacing:3px; font-weight:bold; }
  .header-sub { color:rgba(255,255,255,0.7); font-size:12px; margin-top:2px; }
  .body { padding:28px; }
  .alert { background:#242424; border-left:4px solid #C82020; border-radius:4px; padding:14px 16px; margin-bottom:24px; }
  .alert-label { font-size:10px; letter-spacing:2px; color:#C82020; font-weight:bold; margin-bottom:4px; }
  .alert-name { font-size:22px; font-weight:bold; color:#F5F5F5; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
  .field { background:#242424; border-radius:6px; padding:12px 14px; }
  .field-label { font-size:10px; letter-spacing:2px; color:#8A8A8A; margin-bottom:4px; }
  .field-value { font-size:14px; color:#F5F5F5; font-weight:500; }
  .field-value a { color:#C82020; text-decoration:none; }
  .full { grid-column:1/-1; }
  .segment-badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; color:#C82020; background:rgba(200,32,32,0.1); }
  .urgency-badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; color:${urgencyColor}; background:${urgencyColor}18; }
  .symptom-list { margin:0; padding-left:18px; }
  .symptom-list li { font-size:13px; color:#F5F5F5; margin-bottom:4px; }
  .section-title { font-size:10px; letter-spacing:3px; color:#C82020; font-weight:bold; margin:20px 0 12px; padding-top:16px; border-top:1px solid #2A2A2A; }
  .actions { display:flex; gap:10px; margin-top:24px; }
  .btn { flex:1; text-align:center; padding:12px; border-radius:6px; font-weight:600; font-size:13px; text-decoration:none; }
  .btn-call { background:#C82020; color:white; }
  .btn-wa { background:#25D366; color:white; }
  .footer { background:#141414; padding:14px 28px; font-size:11px; color:#555555; border-top:1px solid #2A2A2A; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="header-title">NUOVO LEAD — SALUTE DI FERRO</div>
    <div class="header-sub">${date}</div>
  </div>
  <div class="body">
    <div class="alert">
      <div class="alert-label">NUOVO LEAD</div>
      <div class="alert-name">${data.name || '—'}</div>
    </div>

    ${tags.length ? `<div class="field full" style="margin-bottom:20px"><div class="field-label">AREE DI ATTENZIONE</div><div class="field-value">${tagsHtml}</div></div>` : ''}

    <div class="grid">
      <div class="field">
        <div class="field-label">TELEFONO / WHATSAPP</div>
        <div class="field-value"><a href="tel:${data.phone}">${data.phone || '—'}</a></div>
      </div>
      <div class="field">
        <div class="field-label">EMAIL</div>
        <div class="field-value"><a href="mailto:${data.email}">${data.email || '—'}</a></div>
      </div>
      <div class="field">
        <div class="field-label">SEGMENTO</div>
        <div class="field-value"><span class="segment-badge">${SEGMENT_LABEL[seg] || seg}</span></div>
      </div>
      <div class="field">
        <div class="field-label">SESSO</div>
        <div class="field-value">${SEX[data.sex] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">ETÀ</div>
        <div class="field-value">${AGE[data.age] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">ESPERIENZA ALLENAMENTO</div>
        <div class="field-value">${TRAINING[data.training] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">SUPPORTO FARMACOLOGICO</div>
        <div class="field-value">${pharmaMap[data.pharma] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">ALIMENTAZIONE</div>
        <div class="field-value">${alimentazioneMap[data.alimentazione] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">SONNO</div>
        <div class="field-value">${sonnoMap[data.sonno] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">STRESS</div>
        <div class="field-value">${stressMap[data.stress] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">DIGESTIONE</div>
        <div class="field-value">${digestMap[data.digestione] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">INTEGRATORI</div>
        <div class="field-value">${integMap[data.integratori] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">OBIETTIVO</div>
        <div class="field-value">${goalMap[data.goal] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">ESAMI DEL SANGUE</div>
        <div class="field-value">${bloodMap[data.blood_tests] || '—'}</div>
      </div>
      <div class="field">
        <div class="field-label">URGENZA</div>
        <div class="field-value"><span class="urgency-badge">${urgencyLabel}</span></div>
      </div>
      <div class="field">
        <div class="field-label">INDICATORI CARDIOVASCOLARI</div>
        <div class="field-value">${cardioMap[data.cardio] || '—'}</div>
      </div>
      <div class="field full">
        <div class="field-label">SINTOMI DICHIARATI</div>
        <ul class="symptom-list">${symptomsList || '<li>—</li>'}</ul>
      </div>
      <div class="field full">
        <div class="field-label">FAMILIARITÀ PATOLOGIE</div>
        <ul class="symptom-list">${familiaritaList || '<li>—</li>'}</ul>
      </div>
      ${data.referral ? `<div class="field full"><div class="field-label">CODICE REFERRAL</div><div class="field-value">${data.referral}</div></div>` : ''}
    </div>
    <div class="actions">
      <a class="btn btn-call" href="tel:${data.phone}">Chiama ora</a>
      <a class="btn btn-wa" href="https://wa.me/${(data.phone || '').replace(/\D/g, '')}">WhatsApp</a>
    </div>
  </div>
  <div class="footer">Salute di Ferro — Lead ricevuto il ${date}</div>
</div>
</body>
</html>`;

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Salute di Ferro <noreply@salutediferro.com>',
        to: ['info@salutediferro.com'],
        subject: `Nuovo lead: ${data.name || 'Anonimo'} — ${SEGMENT_LABEL[seg] || seg} — ${urgencyLabel}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Resend error:', emailRes.status, err);
      return new Response(JSON.stringify({ error: 'Email send failed', details: err }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Email di follow-up al lead ──────────────────────────
    if (data.email) {
      const firstName = (data.name || '').split(' ')[0] || 'Ciao';
      const tagsBadges = tags.map((t) => `<span style="display:inline-block;padding:4px 10px;border-radius:16px;font-size:12px;font-weight:600;color:#C82020;background:rgba(200,32,32,0.1);margin:2px;">${TAG_DISPLAY[t] || t}</span>`).join(' ');

      const followUpHtml = `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0D0D0D;margin:0;padding:0;color:#F5F5F5;">
<div style="max-width:520px;margin:32px auto;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
  <div style="background:#C82020;padding:24px 28px;">
    <div style="color:white;font-size:18px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>
    <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">Il tuo profilo è pronto</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:18px;font-weight:bold;margin:0 0 16px;">${firstName}, il tuo profilo salute è pronto.</p>
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Abbiamo analizzato le tue 18 risposte e identificato le aree su cui concentrarti:</p>
    ${tags.length ? `<div style="margin:16px 0;">${tagsBadges}</div>` : ''}
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Il prossimo passo è una <strong style="color:#F5F5F5;">consulenza di 30 minuti</strong> con un Coach di Ferro, dove analizzeremo insieme il tuo profilo e ti daremo un piano personalizzato di analisi da fare.</p>
    <div style="background:#242424;border-radius:6px;padding:16px;margin:20px 0;">
      <div style="font-size:11px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:8px;">COSA INCLUDE</div>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">✓ Analisi completa del tuo profilo</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">✓ Piano personalizzato di analisi</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">✓ Guida passo-passo su come procedere</p>
      <p style="font-size:13px;color:#888;margin:8px 0 0;">Garanzia soddisfatti o rimborsati.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://form.salutediferro.com" style="display:inline-block;padding:14px 32px;background:#C82020;color:white;font-weight:bold;font-size:15px;border-radius:6px;text-decoration:none;letter-spacing:1px;">PRENOTA LA TUA CALL — 27€</a>
    </div>
    <p style="font-size:12px;color:#888;text-align:center;">Clicca il bottone, completa il pagamento sicuro con Stripe e prenota il tuo slot su Calendly.</p>
  </div>
  <div style="background:#141414;padding:14px 28px;font-size:11px;color:#555;border-top:1px solid #2A2A2A;">
    Salute di Ferro — <a href="https://salutediferro.com" style="color:#C82020;text-decoration:none;">salutediferro.com</a>
  </div>
</div>
</body>
</html>`;

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Salute di Ferro <noreply@salutediferro.com>',
            to: [data.email],
            subject: `${firstName}, il tuo profilo salute è pronto — prenota la tua call`,
            html: followUpHtml,
          }),
        });
      } catch (e) {
        console.error('Follow-up email error:', e.message);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Fetch error:', err.message);
    return new Response(JSON.stringify({ error: 'Internal error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

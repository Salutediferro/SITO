/**
 * Google Apps Script per Salute di Ferro
 * Gestisce sia l'aggiunta di nuovi lead che il marking dei pagamenti.
 *
 * ISTRUZIONI:
 * 1. Vai su https://script.google.com
 * 2. Apri il progetto collegato al tuo Google Sheet LEADS
 * 3. Sostituisci TUTTO il contenuto di Code.gs con questo file
 * 4. Clicca "Deploy" > "New deployment" (o aggiorna il deployment esistente)
 * 5. Tipo: Web app, Execute as: Me, Who has access: Anyone
 * 6. Copia il nuovo URL e aggiornalo nel wrangler.toml se è diverso
 */

// ── Costanti formattazione brand SDF ──
var SDF_HEADERS = [
  'Timestamp','Nome','Telefono','Email',
  'stato','pagato_il','calendly_booked',
  'mail_1_sent','mail_2_sent',
  'Segmento',
  'Sesso','Età','Allenamento','Farmacologico','Energia','Sonno',
  'Libido','Ciclo',
  'Grasso','Pressione','Assunzione','Analisi sangue',
  'Pannelli consigliati','Tag','Score','Score Level','Score Name',
  'Referral'
];

var SDF_COL_WIDTHS = {
  'Timestamp': 150,
  'Nome': 140,
  'Telefono': 130,
  'Email': 220,
  'stato': 110,
  'pagato_il': 150,
  'calendly_booked': 150,
  'mail_1_sent': 150,
  'mail_2_sent': 150,
  'Segmento': 130,
  'Sesso': 70,
  'Età': 60,
  'Allenamento': 120,
  'Farmacologico': 120,
  'Energia': 80,
  'Sonno': 80,
  'Libido': 80,
  'Ciclo': 80,
  'Grasso': 80,
  'Pressione': 100,
  'Assunzione': 110,
  'Analisi sangue': 130,
  'Pannelli consigliati': 200,
  'Tag': 120,
  'Score': 70,
  'Score Level': 110,
  'Score Name': 140,
  'Referral': 120
};

function applySdfFormatting_(sheet) {
  var lastCol = sheet.getLastColumn();
  var maxRows = sheet.getMaxRows();
  if (lastCol < 1) return;

  // Header bar — rosso brand SDF, testo bianco bold, altezza maggiorata
  var headerRange = sheet.getRange(1, 1, 1, lastCol);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#C82020');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  // Freeze header + prime 4 colonne (Timestamp..Email)
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(Math.min(4, lastCol));

  // Larghezze colonne dalla mappa
  var headerVals = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var c = 0; c < headerVals.length; c++) {
    var name = String(headerVals[c]).trim();
    var w = SDF_COL_WIDTHS[name] || 130;
    sheet.setColumnWidth(c + 1, w);
  }

  // Banded rows (zebra) sull'intera tabella
  var bandings = sheet.getBandings();
  for (var b = 0; b < bandings.length; b++) bandings[b].remove();
  var lastRow = Math.max(2, sheet.getLastRow());
  var bandingRange = sheet.getRange(1, 1, lastRow, lastCol);
  var banding = bandingRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  banding.setHeaderRowColor('#C82020').setFirstRowColor('#FFFFFF').setSecondRowColor('#FAFAFA');

  // Filter view
  var existingFilter = sheet.getFilter();
  if (existingFilter) existingFilter.remove();
  if (lastRow >= 2) {
    sheet.getRange(1, 1, lastRow, lastCol).createFilter();
  }

  // Conditional formatting
  var rules = [];

  // stato column
  var statoCol = headerVals.indexOf('stato');
  if (statoCol >= 0 && maxRows > 1) {
    var statoRange = sheet.getRange(2, statoCol + 1, maxRows - 1, 1);
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('PAGATO').setBackground('#D4EDDA').setFontColor('#155724').setBold(true)
      .setRanges([statoRange]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('REMINDER_SENT').setBackground('#FFF3CD').setFontColor('#856404')
      .setRanges([statoRange]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('NON PAGATO').setBackground('#F8D7DA').setFontColor('#721C24').setBold(true)
      .setRanges([statoRange]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenCellEmpty().setBackground('#F8F9FA').setFontColor('#6C757D')
      .setRanges([statoRange]).build());
  }

  // Score Level column
  var levelCol = headerVals.indexOf('Score Level');
  if (levelCol >= 0 && maxRows > 1) {
    var levelRange = sheet.getRange(2, levelCol + 1, maxRows - 1, 1);
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('CRITICO').setBackground('#F8D7DA').setFontColor('#721C24').setBold(true)
      .setRanges([levelRange]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('ALTO').setBackground('#FFE5D0').setFontColor('#8A4A1F').setBold(true)
      .setRanges([levelRange]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('MEDIO').setBackground('#FFF3CD').setFontColor('#856404')
      .setRanges([levelRange]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('BASSO').setBackground('#D1ECF1').setFontColor('#0C5460')
      .setRanges([levelRange]).build());
  }

  // calendly_booked column → azzurro se valorizzato
  var bookedCol = headerVals.indexOf('calendly_booked');
  if (bookedCol >= 0 && maxRows > 1) {
    var bookedRange = sheet.getRange(2, bookedCol + 1, maxRows - 1, 1);
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenCellNotEmpty().setBackground('#CCE5FF').setFontColor('#004085')
      .setRanges([bookedRange]).build());
  }

  // pagato_il column → verde se valorizzato
  var pagatoCol = headerVals.indexOf('pagato_il');
  if (pagatoCol >= 0 && maxRows > 1) {
    var pagatoRange = sheet.getRange(2, pagatoCol + 1, maxRows - 1, 1);
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenCellNotEmpty().setBackground('#D4EDDA').setFontColor('#155724')
      .setRanges([pagatoRange]).build());
  }

  sheet.setConditionalFormatRules(rules);

  // Allineamenti dati
  if (maxRows > 1) {
    var dataRange = sheet.getRange(2, 1, maxRows - 1, lastCol);
    dataRange.setVerticalAlignment('middle');
    dataRange.setFontFamily('Arial');
    dataRange.setFontSize(10);
  }
}

function ensureSdfColumns_(sheet) {
  var lastCol = sheet.getLastColumn();
  var existing = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h){ return String(h).trim(); }) : [];
  var existingLower = existing.map(function(h){ return h.toLowerCase(); });
  var needed = ['stato', 'pagato_il', 'calendly_booked', 'mail_1_sent', 'mail_2_sent'];
  for (var i = 0; i < needed.length; i++) {
    if (existingLower.indexOf(needed[i].toLowerCase()) === -1) {
      var newCol = sheet.getLastColumn() + 1;
      sheet.getRange(1, newCol).setValue(needed[i]);
    }
  }
}

/**
 * Backfill: scrive "NON PAGATO" su tutte le celle vuote della colonna stato
 * per righe esistenti. Non sovrascrive PAGATO / REMINDER_SENT.
 */
function backfillStato_(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return 0;
  var headerVals = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var statoCol = -1;
  for (var c = 0; c < headerVals.length; c++) {
    if (String(headerVals[c]).toLowerCase().trim() === 'stato') { statoCol = c; break; }
  }
  if (statoCol < 0) return 0;
  var range = sheet.getRange(2, statoCol + 1, lastRow - 1, 1);
  var values = range.getValues();
  var changed = 0;
  for (var r = 0; r < values.length; r++) {
    var v = String(values[r][0] || '').trim();
    if (v === '') {
      values[r][0] = 'NON PAGATO';
      changed++;
    }
  }
  if (changed > 0) range.setValues(values);
  return changed;
}

/** Converte indice colonna 0-based in lettera A1 notation (0→A, 25→Z, 26→AA) */
function colLetter_(n) {
  var s = '';
  n = n + 1;
  while (n > 0) {
    var rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function buildDashboard_(ss) {
  var leadsSheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
  var lastCol = leadsSheet.getLastColumn();
  var headerVals = lastCol > 0 ? leadsSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  // Detecta separator argomenti formule basato su locale del foglio
  // Locale italiano usa ";" come separator (causa "#ERROR!" se uso ",")
  var sep = ',';
  try {
    var locale = ss.getSpreadsheetLocale() || '';
    if (locale.toLowerCase().indexOf('it') === 0) sep = ';';
  } catch (e) { /* fallback to comma */ }

  // Trova posizioni reali colonne (case-insensitive)
  function findCol(name) {
    var target = String(name).toLowerCase().trim();
    for (var i = 0; i < headerVals.length; i++) {
      if (String(headerVals[i]).toLowerCase().trim() === target) return i;
    }
    return -1;
  }
  var emailIdx = findCol('email');
  var statoIdx = findCol('stato');
  var bookedIdx = findCol('calendly_booked');
  var levelIdx = findCol('Score Level');

  var emailCol = emailIdx >= 0 ? colLetter_(emailIdx) : 'D';
  var statoCol = statoIdx >= 0 ? colLetter_(statoIdx) : null;
  var bookedCol = bookedIdx >= 0 ? colLetter_(bookedIdx) : null;
  var levelCol = levelIdx >= 0 ? colLetter_(levelIdx) : null;

  var dash = ss.getSheetByName('DASHBOARD');
  if (!dash) dash = ss.insertSheet('DASHBOARD', 0);
  dash.clear();
  dash.getRange('A1').setValue('SALUTE DI FERRO — CRM Dashboard')
    .setFontSize(18).setFontWeight('bold').setFontColor('#C82020');
  dash.getRange('A2').setValue('Aggiornato: ' + new Date().toLocaleString('it-IT'))
    .setFontColor('#6C757D').setFontSize(10);

  // Header tabella metriche
  dash.getRange(4, 1, 1, 2).setValues([['Metrica', 'Valore']])
    .setBackground('#C82020').setFontColor('#FFFFFF').setFontWeight('bold');

  // Riga 5: Lead totali (sempre disponibile via colonna email)
  dash.getRange(5, 1).setValue('Lead totali');
  dash.getRange(5, 2).setFormula('=COUNTA(LEADS!' + emailCol + '2:' + emailCol + ')');

  var row = 6;
  if (statoCol) {
    dash.getRange(row, 1).setValue('NON PAGATO');
    dash.getRange(row, 2).setFormula('=COUNTIF(LEADS!' + statoCol + '2:' + statoCol + sep + '"NON PAGATO")');
    row++;
    dash.getRange(row, 1).setValue('PAGATO');
    dash.getRange(row, 2).setFormula('=COUNTIF(LEADS!' + statoCol + '2:' + statoCol + sep + '"PAGATO")');
    row++;
    dash.getRange(row, 1).setValue('Reminder inviati');
    dash.getRange(row, 2).setFormula('=COUNTIF(LEADS!' + statoCol + '2:' + statoCol + sep + '"REMINDER_SENT")');
    row++;
    dash.getRange(row, 1).setValue('Conversion rate');
    dash.getRange(row, 2).setFormula(
      '=IFERROR(COUNTIF(LEADS!' + statoCol + '2:' + statoCol + sep + '"PAGATO")/COUNTA(LEADS!' + emailCol + '2:' + emailCol + ')' + sep + '0)'
    );
    dash.getRange(row, 2).setNumberFormat('0.00%');
    row++;
  }

  if (bookedCol) {
    dash.getRange(row, 1).setValue('Call prenotate');
    dash.getRange(row, 2).setFormula('=COUNTA(LEADS!' + bookedCol + '2:' + bookedCol + ')');
    row++;
  }

  if (levelCol) {
    var levels = ['CRITICO', 'ALTO', 'MEDIO', 'BASSO'];
    for (var l = 0; l < levels.length; l++) {
      dash.getRange(row, 1).setValue('Score ' + levels[l]);
      dash.getRange(row, 2).setFormula('=COUNTIF(LEADS!' + levelCol + '2:' + levelCol + sep + '"' + levels[l] + '")');
      row++;
    }
  }

  // Diagnostica colonne mancanti
  var missing = [];
  if (statoIdx < 0) missing.push('stato');
  if (bookedIdx < 0) missing.push('calendly_booked');
  if (levelIdx < 0) missing.push('Score Level');
  if (missing.length) {
    dash.getRange(row + 1, 1).setValue('⚠ Colonne non trovate in LEADS:')
      .setFontColor('#856404').setFontWeight('bold');
    dash.getRange(row + 1, 2).setValue(missing.join(', ')).setFontColor('#856404');
  }

  // Footer diagnostico (utile per debug)
  var footerRow = Math.max(row + 3, 18);
  dash.getRange(footerRow, 1).setValue('Locale foglio')
    .setFontColor('#6C757D').setFontSize(9);
  dash.getRange(footerRow, 2).setValue(ss.getSpreadsheetLocale() + ' (sep: ' + sep + ')')
    .setFontColor('#6C757D').setFontSize(9);

  dash.setColumnWidth(1, 220);
  dash.setColumnWidth(2, 140);
  dash.setFrozenRows(4);
}

/**
 * Helper one-shot da eseguire UNA VOLTA dall'editor Apps Script
 * dopo aver incollato questo file. Applica formattazione al sheet
 * esistente senza toccare i dati. Crea anche tab DASHBOARD.
 *
 * COME ESEGUIRE:
 * 1. Salva (Cmd+S)
 * 2. Dropdown funzioni in alto → seleziona "applyFormattingNow"
 * 3. Click "Esegui"
 * 4. Autorizza al primo run (richiede permesso al tuo account Google)
 */
function applyFormattingNow() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
  ensureSdfColumns_(sheet);
  var filled = backfillStato_(sheet);
  applySdfFormatting_(sheet);
  buildDashboard_(ss);
  Logger.log('Formattazione applicata. Colonne: ' + sheet.getLastColumn() + ' Righe: ' + sheet.getLastRow() + ' Stato backfilled: ' + filled);
}


// ════════════════════════════════════════════════════════════════════
// ── MAIL AUTOMATION RESEND · Mail #1 post-test ──────────────────────
// ════════════════════════════════════════════════════════════════════
//
// FLUSSO (architettura corretta vs piano originale):
//   1. Quiz submit -> Worker /send-lead -> appendRow Sheet (stato=NON PAGATO, mail_1_sent='')
//   2. Trigger time-driven OGNI 1 MINUTO (installato via setupMail1Trigger() una sola volta)
//   3. processQueueMail1_ scansiona righe con:
//        - stato == 'NON PAGATO'
//        - mail_1_sent vuoto
//        - Timestamp tra 4 e 30 min fa
//      Per ognuna manda Mail #1 via Resend e scrive timestamp ISO in mail_1_sent.
//
// CONFIG OBBLIGATORIA prima del primo run:
//   File > Project Settings > Script Properties:
//     RESEND_API_KEY = re_...
//     EMAIL_FROM     = Salute di Ferro <noreply@salutediferro.com>
//     STRIPE_LINK    = https://buy.stripe.com/3cIbJ12GU3oIgy18aw14401
//
// SETUP TRIGGER (UNA TANTUM):
//   Esegui setupMail1Trigger() dall'editor. Crea il trigger ogni 1 min.

var MAIL1_WINDOW_MIN_MINUTES = 4;
var MAIL1_WINDOW_MAX_MINUTES = 30;

/**
 * Calcolo score percent (formula del piano sezione 03).
 * Range bloccato 20-85% per evitare di demoralizzare o regalare "sono già a posto".
 * @param {number} score numero 0-13 dalla colonna Score
 * @return {number} percentuale 20-85
 */
function calculateScorePercent_(score) {
  var s = Number(score);
  if (isNaN(s)) s = 0;
  var raw = 100 - (s / 13) * 80;
  return Math.round(Math.max(20, Math.min(85, raw)));
}

function getScriptProperty_(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || '';
}

/**
 * Setup trigger time-driven OGNI 1 MINUTO. Eseguire UNA VOLTA dall'editor.
 * Rimuove eventuali trigger duplicati di processQueueMail1.
 */
function setupMail1Trigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'processQueueMail1') {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  ScriptApp.newTrigger('processQueueMail1')
    .timeBased()
    .everyMinutes(1)
    .create();
  Logger.log('Trigger processQueueMail1 installato (ogni 1 min). Rimossi vecchi: ' + removed);
}

/**
 * Esegue la coda Mail #1: scansiona LEADS, manda email per ogni riga eligibile.
 * Idempotente: scrittura mail_1_sent impedisce doppio invio.
 */
function processQueueMail1() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('LEADS');
  if (!sheet) { Logger.log('LEADS sheet non trovato'); return; }
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2) return;

  var headerVals = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var idx = {};
  for (var c = 0; c < headerVals.length; c++) {
    var h = String(headerVals[c]).trim().toLowerCase();
    idx[h] = c;
  }

  var requiredCols = ['email', 'stato', 'mail_1_sent', 'timestamp', 'nome'];
  for (var i = 0; i < requiredCols.length; i++) {
    if (idx[requiredCols[i]] === undefined) {
      Logger.log('processQueueMail1: colonna mancante "' + requiredCols[i] + '". Esegui applyFormattingNow.');
      return;
    }
  }

  var apiKey = getScriptProperty_('RESEND_API_KEY');
  if (!apiKey) {
    Logger.log('processQueueMail1: RESEND_API_KEY non configurato in Script Properties');
    return;
  }
  var emailFrom = getScriptProperty_('EMAIL_FROM') || 'Salute di Ferro <noreply@salutediferro.com>';
  var stripeLink = getScriptProperty_('STRIPE_LINK') || 'https://buy.stripe.com/3cIbJ12GU3oIgy18aw14401';

  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var now = Date.now();
  var minWindow = MAIL1_WINDOW_MIN_MINUTES * 60 * 1000;
  var maxWindow = MAIL1_WINDOW_MAX_MINUTES * 60 * 1000;
  var sent = 0, skipped = 0, errors = 0;

  for (var r = 0; r < data.length; r++) {
    var row = data[r];
    var stato = String(row[idx['stato']] || '').trim().toUpperCase();
    if (stato !== 'NON PAGATO') { skipped++; continue; }

    var mail1Sent = String(row[idx['mail_1_sent']] || '').trim();
    if (mail1Sent !== '') { skipped++; continue; }

    var email = String(row[idx['email']] || '').trim();
    if (!email || email.indexOf('@') < 0) { skipped++; continue; }

    var ts = row[idx['timestamp']];
    var tsDate = ts instanceof Date ? ts : new Date(ts);
    if (isNaN(tsDate.getTime())) { skipped++; continue; }
    var age = now - tsDate.getTime();
    if (age < minWindow) { skipped++; continue; } // troppo presto
    if (age > maxWindow) { skipped++; continue; } // finestra chiusa, lascia al cron reminder

    var context = buildMail1Context_(row, idx, stripeLink);
    var subject = renderTemplate_('{{nome}}, il test parla chiaro. (E ti sta nascondendo qualcosa)', context);
    var html = buildMail1Html_(context);

    var ok = sendViaResend_(apiKey, emailFrom, email, subject, html, context.preheader);
    var nowIso = new Date().toISOString();
    if (ok) {
      sheet.getRange(r + 2, idx['mail_1_sent'] + 1).setValue(nowIso);
      sent++;
    } else {
      sheet.getRange(r + 2, idx['mail_1_sent'] + 1).setValue('ERROR:' + nowIso);
      errors++;
    }
  }

  Logger.log('processQueueMail1: sent=' + sent + ' skipped=' + skipped + ' errors=' + errors);
}

/**
 * Costruisce il context con tutte le variabili dinamiche per la mail.
 */
function buildMail1Context_(row, idx, stripeLink) {
  function get(key) { return idx[key] !== undefined ? row[idx[key]] : ''; }

  var fullName = String(get('nome') || '').trim();
  var firstName = (fullName.split(' ')[0] || 'Ciao');

  var score = Number(get('score')) || 0;
  var scorePercent = calculateScorePercent_(score);

  var tagsRaw = String(get('tag') || '').trim();
  var tagsList = tagsRaw ? tagsRaw.split(/[,;]/).map(function(t){ return t.trim(); }).filter(Boolean) : [];
  var topTags = tagsList.slice(0, 2).join(' · ') || '—';

  var ts = get('timestamp');
  var tsDate = ts instanceof Date ? ts : new Date(ts);
  var dataTest = isNaN(tsDate.getTime()) ? '—' :
    Utilities.formatDate(tsDate, 'Europe/Rome', 'dd/MM/yyyy');

  return {
    nome: firstName,
    nome_full: fullName || firstName,
    email: String(get('email') || ''),
    eta: String(get('età') || get('eta') || '—'),
    sesso: String(get('sesso') || '—'),
    allenamento: String(get('allenamento') || '—'),
    score_name: String(get('score name') || get('score_name') || '—'),
    score_level: String(get('score level') || get('score_level') || '—'),
    score_percent: scorePercent,
    pannelli_consigliati: String(get('pannelli consigliati') || get('pannelli_consigliati') || '—'),
    segnali_top: topTags,
    data_test: dataTest,
    cta_url: stripeLink,
    preheader: firstName + ', ho letto il tuo test. Il risultato non è quello che ti aspetti.',
  };
}

function renderTemplate_(template, ctx) {
  return String(template).replace(/\{\{(\w+)\}\}/g, function(_, key) {
    return ctx[key] !== undefined && ctx[key] !== null ? String(ctx[key]) : '';
  });
}

function escapeHtmlGs_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Template HTML Mail #1 — post-test, no acquisto.
 * Vincoli: max 600px, CSS inline, font system, body >=14px, headings >=20px.
 * Curiosity gap: prima parte nitida, resto sfocato.
 */
function buildMail1Html_(c) {
  var nome = escapeHtmlGs_(c.nome);
  var scoreName = escapeHtmlGs_(c.score_name);
  var scorePercent = c.score_percent;
  var pannelli = escapeHtmlGs_(c.pannelli_consigliati);
  var segnaliTop = escapeHtmlGs_(c.segnali_top);
  var dataTest = escapeHtmlGs_(c.data_test);
  var ctaUrl = escapeHtmlGs_(c.cta_url);
  var preheader = escapeHtmlGs_(c.preheader);

  return '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1.0">' +
'<title>Il tuo profilo Salute di Ferro</title></head>' +
'<body style="margin:0;padding:0;background:#0D0D0D;font-family:Helvetica,Arial,sans-serif;color:#F5F5F5;">' +
'<div style="display:none;max-height:0;overflow:hidden;">' + preheader + '</div>' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0D0D0D;">' +
'<tr><td align="center" style="padding:32px 16px;">' +
'<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">' +
// Header
'<tr><td style="background:#C82020;padding:24px 28px;">' +
'<div style="color:#FFFFFF;font-size:20px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>' +
'<div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px;">Il tuo profilo · ' + dataTest + '</div>' +
'</td></tr>' +
// Hero
'<tr><td style="padding:32px 28px 20px 28px;">' +
'<h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.3;color:#F5F5F5;font-weight:bold;">' + nome + ', il tuo test parla chiaro.</h1>' +
'<p style="margin:0 0 24px 0;font-size:16px;line-height:1.5;color:#CCCCCC;">Ed è solo un assaggio.</p>' +
// Score box
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#242424;border-radius:8px;margin-bottom:24px;">' +
'<tr><td style="padding:20px;">' +
'<div style="font-size:12px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:8px;">IL TUO PROFILO</div>' +
'<div style="font-size:22px;font-weight:bold;color:#F5F5F5;margin-bottom:16px;">' + scoreName + '</div>' +
'<div style="font-size:14px;color:#999;margin-bottom:6px;">Sei al ' + scorePercent + '% del tuo potenziale</div>' +
// Progress bar
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
'<td style="background:#3A3A3A;height:8px;border-radius:4px;">' +
'<table role="presentation" width="' + scorePercent + '%" cellpadding="0" cellspacing="0" border="0"><tr>' +
'<td style="background:#C82020;height:8px;border-radius:4px;font-size:1px;">&nbsp;</td>' +
'</tr></table></td></tr></table>' +
'<div style="font-size:11px;color:#666;margin-top:8px;letter-spacing:1px;">FERMO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DI FERRO</div>' +
'</td></tr></table>' +
// Cosa abbiamo letto
'<h2 style="margin:0 0 12px 0;font-size:18px;color:#F5F5F5;">Cosa abbiamo letto del tuo profilo</h2>' +
'<p style="margin:0 0 8px 0;font-size:15px;line-height:1.5;color:#CCCCCC;">Età: <strong style="color:#F5F5F5;">' + escapeHtmlGs_(c.eta) + '</strong> · Sesso: <strong style="color:#F5F5F5;">' + escapeHtmlGs_(c.sesso) + '</strong></p>' +
'<p style="margin:0 0 8px 0;font-size:15px;line-height:1.5;color:#CCCCCC;">Allenamento: <strong style="color:#F5F5F5;">' + escapeHtmlGs_(c.allenamento) + '</strong></p>' +
'<p style="margin:0 0 24px 0;font-size:15px;line-height:1.5;color:#CCCCCC;">Segnali principali: <strong style="color:#F5F5F5;">' + segnaliTop + '</strong></p>' +
// Cosa NON vedi (curiosity gap)
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1F1614;border-left:3px solid #C82020;border-radius:4px;margin-bottom:24px;">' +
'<tr><td style="padding:18px 20px;">' +
'<div style="font-size:12px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:10px;">COSA NON VEDI ANCORA</div>' +
'<p style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:#CCCCCC;">— Il pannello completo che il tuo profilo richiede</p>' +
'<p style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:#CCCCCC;">— I marker specifici che spiegano i tuoi segnali</p>' +
'<p style="margin:0 0 0 0;font-size:14px;line-height:1.5;color:#CCCCCC;">— Il piano operativo personalizzato per i prossimi 6 mesi</p>' +
'</td></tr></table>' +
// CTA Membership box
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#242424;border-radius:8px;margin-bottom:24px;">' +
'<tr><td style="padding:24px 20px;">' +
'<div style="font-size:12px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:10px;">ATTIVA LA MEMBERSHIP</div>' +
'<div style="font-size:28px;font-weight:bold;color:#F5F5F5;margin-bottom:6px;">€197<span style="font-size:16px;color:#999;font-weight:normal;"> / anno</span></div>' +
'<p style="margin:0 0 16px 0;font-size:14px;line-height:1.5;color:#CCCCCC;">— Consulenza personalizzata di 30 minuti<br>' +
'— Pannello analisi consigliato (' + pannelli + ')<br>' +
'— Tariffe convenzionate sui laboratori partner</p>' +
'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
'<td style="background:#C82020;border-radius:6px;">' +
'<a href="' + ctaUrl + '" style="display:inline-block;padding:16px 32px;color:#FFFFFF;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;">ATTIVA LA MEMBERSHIP →</a>' +
'</td></tr></table>' +
'</td></tr></table>' +
// Urgency
'<p style="margin:0 0 24px 0;font-size:13px;line-height:1.5;color:#999;text-align:center;font-style:italic;">Un risultato letto entro 7 giorni vale 5 volte uno letto dopo un mese.</p>' +
// Disclaimer legale
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#141414;border-radius:4px;margin-bottom:16px;">' +
'<tr><td style="padding:14px 16px;">' +
'<p style="margin:0;font-size:12px;line-height:1.5;color:#888;">' +
'<strong style="color:#AAA;">Importante:</strong> i valori indicati nel tuo profilo non rientrano nel range oggettivo dei riferimenti scientifici per atleti e amatori. Questo non significa che ci sia una patologia. Salute di Ferro è una piattaforma di intermediazione: non eroga diagnosi né prescrizioni mediche.' +
'</p>' +
'</td></tr></table>' +
'</td></tr>' +
// Footer
'<tr><td style="background:#0D0D0D;padding:16px 28px;font-size:11px;color:#666;border-top:1px solid #2A2A2A;">' +
'Salute di Ferro — <a href="https://salutediferro.com" style="color:#C82020;text-decoration:none;">salutediferro.com</a><br>' +
'<a href="mailto:info@salutediferro.com?subject=Unsubscribe%20' + encodeURIComponent(c.email) + '" style="color:#666;text-decoration:underline;">Annulla iscrizione</a>' +
'</td></tr>' +
'</table>' +
'</td></tr></table>' +
'</body></html>';
}

/**
 * Chiama Resend API per mandare email. Ritorna true se 200/202.
 */
function sendViaResend_(apiKey, from, to, subject, html, preheader) {
  var payload = {
    from: from,
    to: [to],
    subject: subject,
    html: html,
  };
  if (preheader) payload.headers = { 'X-Entity-Ref-ID': 'sdf-mail1-' + Date.now() };

  try {
    var response = UrlFetchApp.fetch('https://api.resend.com/emails', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + apiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });
    var code = response.getResponseCode();
    if (code >= 200 && code < 300) return true;
    Logger.log('Resend ' + code + ': ' + response.getContentText().substring(0, 200));
    return false;
  } catch (e) {
    Logger.log('Resend exception: ' + (e.message || e));
    return false;
  }
}

/**
 * Funzione one-shot di test: manda Mail #1 con dati fittizi a un'email di test.
 * USO: imposta TEST_EMAIL nelle Script Properties prima di eseguire.
 */
function testMail1ToMyself() {
  var apiKey = getScriptProperty_('RESEND_API_KEY');
  var emailFrom = getScriptProperty_('EMAIL_FROM') || 'Salute di Ferro <noreply@salutediferro.com>';
  var testTo = getScriptProperty_('TEST_EMAIL');
  var stripeLink = getScriptProperty_('STRIPE_LINK') || 'https://buy.stripe.com/3cIbJ12GU3oIgy18aw14401';

  if (!apiKey) { Logger.log('Manca RESEND_API_KEY in Script Properties'); return; }
  if (!testTo) { Logger.log('Manca TEST_EMAIL in Script Properties'); return; }

  var ctx = {
    nome: 'Trilli',
    nome_full: 'Trilli Gianni',
    email: testTo,
    eta: '20-29 anni',
    sesso: 'Uomo',
    allenamento: '>4 a settimana',
    score_name: 'IL KAMIKAZE DELLA PALESTRA',
    score_level: 'ALTO',
    score_percent: 60,
    pannelli_consigliati: 'FERRO CORE, FERRO RENI',
    segnali_top: 'checkup · prevenzione',
    data_test: Utilities.formatDate(new Date(), 'Europe/Rome', 'dd/MM/yyyy'),
    cta_url: stripeLink,
    preheader: 'Trilli, ho letto il tuo test. Il risultato non è quello che ti aspetti.',
  };
  var subject = renderTemplate_('{{nome}}, il test parla chiaro. (E ti sta nascondendo qualcosa)', ctx);
  var html = buildMail1Html_(ctx);

  var ok = sendViaResend_(apiKey, emailFrom, testTo, subject, html, ctx.preheader);
  Logger.log('Test invio Mail #1 a ' + testTo + ': ' + (ok ? 'OK' : 'FAIL'));
}

function doGet(e) {
  try {
    var raw = e.parameter.data;
    if (!raw) return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'No data' })).setMimeType(ContentService.MimeType.JSON);

    var json = JSON.parse(Utilities.newBlob(Utilities.base64Decode(raw)).getDataAsString('UTF-8'));
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── FORMAT_SHEET: applica formattazione SENZA cancellare dati ──
    if (json.action === 'format_sheet') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      ensureSdfColumns_(sheet);
      var filled = backfillStato_(sheet);
      applySdfFormatting_(sheet);
      buildDashboard_(ss);
      return ContentService.createTextOutput(JSON.stringify({ ok: true, action: 'format_sheet', backfilled: filled })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── CASO RESET: Pulisci foglio e riscrivi header ──
    if (json.action === 'reset_sheet') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      sheet.clear();
      sheet.getRange(1, 1, 1, SDF_HEADERS.length).setValues([SDF_HEADERS]);
      applySdfFormatting_(sheet);
      buildDashboard_(ss);
      return ContentService.createTextOutput(JSON.stringify({ ok: true, action: 'reset_sheet', columns: SDF_HEADERS.length })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── CASO 0: Aggiorna referral ──
    if (json.action === 'update_referral') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var emailCol = -1, referralCol = -1;
      for (var c = 0; c < headers.length; c++) {
        var h = String(headers[c]).toLowerCase().trim();
        if (h === 'email') emailCol = c;
        if (h === 'referral') referralCol = c;
      }
      if (referralCol === -1) {
        referralCol = sheet.getLastColumn();
        sheet.getRange(1, referralCol + 1).setValue('Referral');
      }
      var targetEmail = String(json.email || '').toLowerCase().trim();
      var found = false;
      if (emailCol >= 0 && targetEmail) {
        for (var r = data.length - 1; r >= 1; r--) {
          if (String(data[r][emailCol]).toLowerCase().trim() === targetEmail) {
            sheet.getRange(r + 1, referralCol + 1).setValue(json.referral || '');
            found = true;
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, found: found })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── CASO 1: Pagamento completato ──
    if (json.action === 'mark_paid') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var headers = data[0];

      // Trova colonna email (cerca "email" nell'header)
      var emailCol = -1;
      for (var c = 0; c < headers.length; c++) {
        if (String(headers[c]).toLowerCase().trim() === 'email') { emailCol = c; break; }
      }

      // Trova o crea colonna STATO
      var statoCol = -1;
      for (var c = 0; c < headers.length; c++) {
        if (String(headers[c]).toLowerCase().trim() === 'stato') { statoCol = c; break; }
      }
      if (statoCol === -1) {
        statoCol = headers.length;
        sheet.getRange(1, statoCol + 1).setValue('stato');
      }

      // Trova o crea colonna PAGATO_IL
      var pagatoCol = -1;
      for (var c = 0; c < headers.length + 1; c++) {
        var h = sheet.getRange(1, c + 1).getValue();
        if (String(h).toLowerCase().trim() === 'pagato_il') { pagatoCol = c; break; }
      }
      if (pagatoCol === -1) {
        pagatoCol = statoCol + 1;
        sheet.getRange(1, pagatoCol + 1).setValue('pagato_il');
      }

      // Cerca la riga con questa email (dall'ultima alla prima per prendere il lead più recente)
      var targetEmail = String(json.email || '').toLowerCase().trim();
      var found = false;
      if (emailCol >= 0 && targetEmail) {
        for (var r = data.length - 1; r >= 1; r--) {
          if (String(data[r][emailCol]).toLowerCase().trim() === targetEmail) {
            sheet.getRange(r + 1, statoCol + 1).setValue('PAGATO');
            sheet.getRange(r + 1, pagatoCol + 1).setValue(json.paid_at || new Date().toLocaleString('it-IT'));

            // Evidenzia riga in verde chiaro
            sheet.getRange(r + 1, 1, 1, sheet.getLastColumn()).setBackground('#d4edda');

            found = true;
            break;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ ok: true, found: found })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── CASO 1b: Segna REMINDER_SENT ──
    if (json.action === 'mark_reminder_sent') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var emailCol = -1;
      for (var c = 0; c < headers.length; c++) {
        if (String(headers[c]).toLowerCase().trim() === 'email') { emailCol = c; break; }
      }
      var statoCol = -1;
      for (var c = 0; c < headers.length; c++) {
        if (String(headers[c]).toLowerCase().trim() === 'stato') { statoCol = c; break; }
      }
      if (statoCol === -1) {
        statoCol = headers.length;
        sheet.getRange(1, statoCol + 1).setValue('stato');
      }
      var targetEmail = String(json.email || '').toLowerCase().trim();
      var found = false;
      if (emailCol >= 0 && targetEmail) {
        for (var r = data.length - 1; r >= 1; r--) {
          if (String(data[r][emailCol]).toLowerCase().trim() === targetEmail) {
            sheet.getRange(r + 1, statoCol + 1).setValue('REMINDER_SENT');
            sheet.getRange(r + 1, 1, 1, sheet.getLastColumn()).setBackground('#fff3cd');
            found = true;
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, found: found })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── CASO 1c: Recupera lead non pagati (per cron) ──
    if (json.action === 'get_unpaid_leads') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var emailCol = -1, nameCol = -1, tsCol = -1, statoCol = -1;
      for (var c = 0; c < headers.length; c++) {
        var h = String(headers[c]).toLowerCase().trim();
        if (h === 'email') emailCol = c;
        if (h === 'name' || h === 'nome') nameCol = c;
        if (h === 'timestamp') tsCol = c;
        if (h === 'stato') statoCol = c;
      }
      var rows = [];
      var now = new Date().getTime();
      var thirtyMin = 30 * 60 * 1000;
      for (var r = 1; r < data.length; r++) {
        var stato = statoCol >= 0 ? String(data[r][statoCol]).trim() : '';
        if (stato === 'PAGATO' || stato === 'REMINDER_SENT') continue;
        var email = emailCol >= 0 ? String(data[r][emailCol]).trim() : '';
        if (!email) continue;
        // Controlla timestamp > 30 min fa
        if (tsCol >= 0) {
          var ts = data[r][tsCol];
          var tsDate = ts instanceof Date ? ts : new Date(ts);
          if (isNaN(tsDate.getTime()) || (now - tsDate.getTime()) < thirtyMin) continue;
        }
        var name = nameCol >= 0 ? String(data[r][nameCol]).trim() : '';
        rows.push({ email: email, name: name });
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, rows: rows })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── CASO 1d: Calendly booked ──
    if (json.action === 'calendly_booked') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var emailCol = -1;
      for (var c = 0; c < headers.length; c++) {
        if (String(headers[c]).toLowerCase().trim() === 'email') { emailCol = c; break; }
      }
      // Trova o crea colonna calendly_booked
      var bookedCol = -1;
      for (var c = 0; c < headers.length; c++) {
        if (String(headers[c]).toLowerCase().trim() === 'calendly_booked') { bookedCol = c; break; }
      }
      if (bookedCol === -1) {
        bookedCol = sheet.getLastColumn();
        sheet.getRange(1, bookedCol + 1).setValue('calendly_booked');
      }
      var targetEmail = String(json.email || '').toLowerCase().trim();
      var found = false;
      if (emailCol >= 0 && targetEmail) {
        for (var r = data.length - 1; r >= 1; r--) {
          if (String(data[r][emailCol]).toLowerCase().trim() === targetEmail) {
            sheet.getRange(r + 1, bookedCol + 1).setValue(json.booked_at || new Date().toLocaleString('it-IT'));
            sheet.getRange(r + 1, 1, 1, sheet.getLastColumn()).setBackground('#cce5ff');
            found = true;
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, found: found })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── CASO 2: Nuovo lead (comportamento originale) ──
    var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Se il foglio è vuoto, crea gli header dalle chiavi del JSON
    if (headers.length === 0 || (headers.length === 1 && headers[0] === '')) {
      var keys = Object.keys(json);
      sheet.getRange(1, 1, 1, keys.length).setValues([keys]);
      headers = keys;
    }

    // Mappa i valori alle colonne esistenti
    // Default: stato = "NON PAGATO" se non già fornito dal payload
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var key = String(headers[i]).trim();
      var keyLower = key.toLowerCase();
      var val = json[key] !== undefined ? json[key] : '';
      if (keyLower === 'stato' && (val === '' || val === undefined || val === null)) {
        val = 'NON PAGATO';
      }
      row.push(val);
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

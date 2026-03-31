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

function doGet(e) {
  try {
    var raw = e.parameter.data;
    if (!raw) return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'No data' })).setMimeType(ContentService.MimeType.JSON);

    var json = JSON.parse(Utilities.newBlob(Utilities.base64Decode(raw)).getDataAsString('UTF-8'));
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── CASO RESET: Pulisci foglio e riscrivi header ──
    if (json.action === 'reset_sheet') {
      var sheet = ss.getSheetByName('LEADS') || ss.getSheets()[0];
      sheet.clear();
      var headers = [
        'Timestamp','Nome','Telefono','Email','Segmento',
        'Sesso','Età','Allenamento','Farmacologico','Energia','Sonno','Recupero',
        'Libido','Performance sessuale','Ciclo','Energia ciclo',
        'Grasso','Fame','Pressione','Colesterolo','Assunzione','Analisi sangue',
        'Pannelli consigliati','Tag','Score','Score Level','Score Name',
        'Referral',
        'stato','pagato_il','calendly_booked'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      // Formattazione header
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1A1A1A');
      headerRange.setFontColor('#F5F5F5');
      sheet.setFrozenRows(1);
      // Larghezza colonne
      sheet.setColumnWidth(1, 160); // Timestamp
      sheet.setColumnWidth(2, 150); // Nome
      sheet.setColumnWidth(3, 140); // Telefono
      sheet.setColumnWidth(4, 200); // Email
      sheet.setColumnWidth(5, 140); // Segmento
      return ContentService.createTextOutput(JSON.stringify({ ok: true, action: 'reset_sheet', columns: headers.length })).setMimeType(ContentService.MimeType.JSON);
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
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var key = String(headers[i]).trim();
      row.push(json[key] !== undefined ? json[key] : '');
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

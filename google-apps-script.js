/**
 * Google Apps Script — Incolla questo codice in Apps Script
 *
 * INTESTAZIONI RIGA 1 (da A a AE):
 * Timestamp | Nome | Telefono | Email | Segmento | Sesso | Età | Livello |
 * Obiettivo | Farmacologico | Energia | Sonno | Recupero | Libido |
 * Performance sessuale | Forza | Ciclo | Energia ciclo | Ritenzione |
 * Grasso | Fame | Pressione | Colesterolo | Assunzione | Valori controllati |
 * Analisi sangue | Tag | Score | Score Level | Score Name | Referral
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || '',
    data.name || '',
    data.phone || '',
    data.email || '',
    data.segment || '',
    data.sex || '',
    data.age || '',
    data.livello || '',
    data.obiettivo || '',
    data.pharma || '',
    data.energia || '',
    data.sonno || '',
    data.recupero || '',
    data.libido || '',
    data.performance_sex || '',
    data.forza || '',
    data.ciclo || '',
    data.energia_ciclo || '',
    data.ritenzione || '',
    data.grasso || '',
    data.fame || '',
    data.pressione || '',
    data.colesterolo || '',
    data.assunzione || '',
    data.valori || '',
    data.analisi || '',
    data.tags || '',
    data.score || '',
    data.score_level || '',
    data.score_name || '',
    data.referral || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

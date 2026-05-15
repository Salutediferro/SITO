// ── Allowed origins for CORS ──
const ALLOWED_ORIGINS = [
  'https://form.salutediferro.com',
  'https://salutediferro.com',
  'https://www.salutediferro.com',
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ── Rate limiter (in-memory, per-isolate) ──
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;         // max 5 requests per IP per minute

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// Cleanup old entries periodically (prevent memory leak)
function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) rateLimitMap.delete(ip);
  }
}

// ── Input sanitization ──
function sanitize(val) {
  if (typeof val !== 'string') return val;
  // Strip formula injection (=, +, -, @, tab, carriage return at start)
  let s = val.replace(/^[\s]*[=+\-@\t\r]/, '');
  // Remove control characters
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Limit length
  return s.substring(0, 500);
}

// ── HTML escape (per inserimento sicuro in email/HTML output) ──
// Previene XSS quando input utente viene interpolato in template HTML.
function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

// ── Mask PII per logging sicuro (privacy: no email/dati sensibili in chiaro nei log) ──
function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local.length <= 2 ? '*'.repeat(local.length) : local[0] + '***' + local[local.length - 1];
  return `${maskedLocal}@${domain}`;
}

// ── Verifica firma webhook Stripe (HMAC SHA256) usando Web Crypto API ──
async function verifyStripeSignature(payload, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  const parts = signatureHeader.split(',').reduce((acc, part) => {
    const [k, v] = part.split('=');
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});
  const timestamp = parts.t;
  const sig = parts.v1;
  if (!timestamp || !sig) return false;
  // Tolerance: 5 minutes (default Stripe)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signed = await crypto.subtle.sign('HMAC', key, enc.encode(signedPayload));
  const expectedHex = Array.from(new Uint8Array(signed))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  // Constant-time compare
  if (sig.length !== expectedHex.length) return false;
  let mismatch = 0;
  for (let i = 0; i < sig.length; i++) {
    mismatch |= sig.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return mismatch === 0;
}

function sanitizeObject(obj) {
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      clean[k] = v.map(sanitize);
    } else {
      clean[k] = sanitize(v);
    }
  }
  return clean;
}

// ── Email validation (stricter) ──
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Must have local@domain.tld, TLD at least 2 chars
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/.test(email);
}

// ── Phone validation (stricter, E.164-ish) ──
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/[\s\-\(\)\.]/g, '');
  // 8-15 digits, optionally starting with +
  return /^\+?\d{8,15}$/.test(digits);
}

// ── Safe base64 encoding for GAS ──
function safeB64(obj) {
  const asciiJson = JSON.stringify(obj).replace(/[\u0080-\uffff]/g, c =>
    '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
  );
  return btoa(asciiJson);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = getCorsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ── Redirect 301 QR code vecchi ──
    // QR code stampati pre-9 mag 2026 linkavano form.salutediferro.com (root + /quiz + /form).
    // Quiz ora vive su salutediferro.com/test (SPA route React, post fix 6 mag P2.2).
    // Redirect permanente per backward compat dei QR già distribuiti.
    if (request.method === 'GET' && (path === '/' || path === '/quiz' || path === '/form')) {
      return Response.redirect('https://salutediferro.com/test', 301);
    }

    // ── GET /api/founder-slots-remaining ──
    // Founder Pass · counter posti rimasti, letto dal frontend (FounderPassCard + useFounderSlots).
    // Source of truth: tabella D1 `founder_slots` (200 righe pre-seed, decrementate dal webhook
    // Stripe quando arriva un checkout.session.completed con metadata.tier === 'founder').
    //
    // Cache edge: 10s (riduce hit DB sotto carico, accettabile per UX scarcity counter).
    // Errori: se D1 unreachable o non bound, ritorna 503 → il frontend in produzione nasconde la card
    // (slotsRemaining=null), in dev mostra fallback 200 slot pieni (gated da import.meta.env.DEV).
    if (path === '/api/founder-slots-remaining' && request.method === 'GET') {
      if (!env.DB) {
        console.error('founder-slots-remaining: D1 binding `DB` non configurato');
        return new Response(JSON.stringify({ error: 'database not configured' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      try {
        const row = await env.DB.prepare(
          'SELECT COUNT(*) AS remaining FROM founder_slots WHERE sold_at IS NULL'
        ).first();
        const slotsRemaining = Number(row?.remaining ?? 200);
        const slotsTotal = 200;

        return new Response(JSON.stringify({ slotsRemaining, slotsTotal }), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=10', // edge cache 10s
          },
        });
      } catch (e) {
        console.error('founder-slots-remaining DB error:', e?.message || 'unknown');
        return new Response(JSON.stringify({ error: 'database error' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ── POST /send-lead ──
    if (path === '/send-lead' && request.method === 'POST') {
      // Rate limit check
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      cleanupRateLimit();
      if (isRateLimited(clientIP)) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let data;
      try {
        data = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Sanitize all input
      data = sanitizeObject(data);

      // Validate required fields
      if (!isValidEmail(data.email)) {
        return new Response(JSON.stringify({ error: 'Invalid email address' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (data.phone && !isValidPhone(data.phone)) {
        return new Response(JSON.stringify({ error: 'Invalid phone number' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Label mappings matching quiz 11 domande v3
      const SEX = { M: 'Uomo', F: 'Donna' };
      const AGE = { u30: 'Under 30', '30-39': '30–39 anni', '40-49': '40–49 anni', '50+': 'Over 50' };
      const TRAINING = { none: 'Non mi alleno', '2-3': '2-3 allenamenti a settimana', '4+': '>4 a settimana', agonista: 'Atleta agonista' };
      const PHARMA = { mai: 'Mai utilizzati', passato: 'In passato', attuale: 'Attualmente', no_risposta: 'Preferisco non rispondere' };
      const ENERGIA = { molto_energico: 'Molto energico', normale: 'Normale', a_volte_stanco: 'A volte stanco', sempre_stanco: 'Sempre stanco' };
      const SONNO = { molto_bene: 'Dormo molto bene', abbastanza: 'Dormo abbastanza bene', disturbato: 'Sonno disturbato', pessimo: 'Sonno disturbato e stanco' };
      const LIBIDO = { molto_alta: 'Molto alta', normale: 'Normale', bassa: 'Bassa', molto_bassa: 'Molto bassa' };
      const CICLO = { regolare: 'Regolare', legg_irregolare: 'Leggermente irregolare', molto_irregolare: 'Molto irregolare', no_ciclo: 'Non ho ciclo' };
      const GRASSO = { no: 'Non ho problemi', fatica: 'Fatico a dimagrire', accumulo: 'Accumulo grasso facilmente' };
      const PRESSIONE = { bassa: 'Bassa', normale: 'Normale', legg_alta: 'Leggermente alta', alta: 'Alta', non_so: 'Non lo so' };
      const ASSUNZIONE = { farmaci: 'Farmaci', alcol: 'Alcol', integratori: 'Integratori', nulla: 'Nulla di particolare' };
      const ANALISI = { '6m': 'Meno di 6 mesi fa', '6-12m': 'Tra 6 e 12 mesi fa', '12m+': 'Più di un anno fa', mai: 'Mai' };
      const SEGMENT_LABEL = { M_U40: 'Maschio Under 40', M_O40: 'Maschio Over 40', F_U40: 'Femmina Under 40', F_O40: 'Femmina Over 40' };

      const r = (map, val) => { if (!val) return ''; return map[val] || val; };
      const mapArray = (arr, map) => Array.isArray(arr) ? arr.map(k => map[k] || k).join(', ') : (arr || '');

      const seg = data.segment || '';

      // Google Sheets webhook
      const GOOGLE_SHEET_URL = env.GOOGLE_SHEET_URL;
      if (GOOGLE_SHEET_URL) {
        const sheetRow = {
          'Timestamp': new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }),
          'Nome': data.name || '',
          'Telefono': data.phone || '',
          'Email': data.email || '',
          'Segmento': SEGMENT_LABEL[seg] || seg,
          'Sesso': r(SEX, data.sex),
          'Età': r(AGE, data.age),
          'Allenamento': r(TRAINING, data.training),
          'Farmacologico': r(PHARMA, data.pharma),
          'Energia': r(ENERGIA, data.energia),
          'Sonno': r(SONNO, data.sonno),
          'Libido': r(LIBIDO, data.libido),
          'Ciclo': r(CICLO, data.ciclo),
          'Grasso': r(GRASSO, data.grasso),
          'Pressione': r(PRESSIONE, data.pressione),
          'Assunzione': mapArray(data.assunzione, ASSUNZIONE),
          'Analisi sangue': r(ANALISI, data.analisi),
          'Pannelli consigliati': (() => { const PNAMES = { androgeno:'FERRO ANDROGENO', cuore:'FERRO CUORE', reni:'FERRO RENI', fegato:'FERRO FEGATO', metabolico:'FERRO METABOLICO', tiroide:'FERRO TIROIDE', recovery:'FERRO RECOVERY', donna:'FERRO DONNA' }; const v = data.suggested_panels; if (Array.isArray(v)) return v.map(k => PNAMES[k] || k).join(', '); if (typeof v === 'string') return v.split(',').map(k => { const t = k.trim(); return PNAMES[t] || t; }).join(', '); return ''; })(),
          'Tag': Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
          'Score': data.score ?? '',
          'Score Level': data.score_level ?? '',
          'Score Name': data.score_name ?? '',
          'Referral': data.referral || '',
        };

        try {
          const b64 = safeB64(sheetRow);
          const sheetRes = await fetch(GOOGLE_SHEET_URL + '?data=' + encodeURIComponent(b64));
          const sheetText = await sheetRes.text();
          if (!sheetRes.ok) {
            // Privacy: log solo lo status, NO body (può contenere echo del payload con email/dati)
            console.error('Sheet webhook HTTP error status:', sheetRes.status);
          } else {
            try {
              const sheetJson = JSON.parse(sheetText);
              if (!sheetJson.ok) console.error('Sheet webhook app error code:', sheetJson.error || 'no-code');
            } catch (e) {
              console.error('Sheet webhook non-JSON response (parse error)');
            }
          }
        } catch (err) {
          // Privacy: log solo .message (no err object intero che può includere payload)
          console.error('Sheet webhook error:', err.message || 'unknown');
        }
      }

      // ── Email di follow-up al lead ──
      const RESEND_API_KEY = env.RESEND_API_KEY;
      if (RESEND_API_KEY && data.email) {
        const firstName = escapeHtml((data.name || '').split(' ')[0] || 'Ciao');
        const TAG_DISPLAY = {
          CUORE: '#CUORE', FEGATO: '#FEGATO', TIROIDE: '#TIROIDE', ORMONI: '#PROFILO ORMONALE',
          METABOLISMO: '#METABOLISMO', RENI: '#RENI', CORTISOLO: '#CORTISOLO', SANGUE: '#EMOCROMO',
          PROSTATA: '#PROSTATA', TESTOSTERONE: '#TESTOSTERONE', OSSA: '#OSSA',
          FERTILITA: '#FERTILITÀ', CICLO: '#CICLO', MENOPAUSA: '#MENOPAUSA'
        };
        const tags = data.tags || [];
        const tagsBadges = tags.map(t => `<span style="display:inline-block;padding:4px 10px;border-radius:16px;font-size:12px;font-weight:600;color:#C82020;background:rgba(200,32,32,0.1);margin:2px;">${escapeHtml(TAG_DISPLAY[t] || t)}</span>`).join(' ');

        const followUpHtml = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0D0D0D;margin:0;padding:0;color:#F5F5F5;">
<div style="max-width:520px;margin:32px auto;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
  <div style="background:#C82020;padding:24px 28px;">
    <div style="color:white;font-size:18px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>
    <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">Il tuo profilo \u00e8 pronto</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:18px;font-weight:bold;margin:0 0 16px;">${firstName}, il tuo profilo salute \u00e8 pronto.</p>
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Abbiamo analizzato le tue risposte e identificato le aree su cui concentrarti:</p>
    ${tags.length ? `<div style="margin:16px 0;">${tagsBadges}</div>` : ''}
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Il prossimo passo \u00e8 una <strong style="color:#F5F5F5;">consulenza di 30 minuti</strong> dove analizzeremo insieme il tuo profilo e ti daremo un piano personalizzato di analisi da fare.</p>
    <div style="background:#242424;border-radius:6px;padding:16px;margin:20px 0;">
      <div style="font-size:11px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:8px;">COSA INCLUDE</div>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Analisi completa del tuo profilo</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Piano personalizzato di analisi</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Guida passo-passo su come procedere</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://form.salutediferro.com" style="display:inline-block;padding:14px 32px;background:#C82020;color:white;font-weight:bold;font-size:15px;border-radius:6px;text-decoration:none;letter-spacing:1px;">PRENOTA ORA LA TUA CALL — da 9,99€/mese (Founder)</a>
    </div>
    <p style="font-size:12px;color:#888;text-align:center;">Clicca il bottone, completa il pagamento sicuro con Stripe e prenota il tuo slot su Calendly.</p>
  </div>
  <div style="background:#141414;padding:14px 28px;font-size:11px;color:#555;border-top:1px solid #2A2A2A;">
    Salute di Ferro \u2014 <a href="https://salutediferro.com" style="color:#C82020;text-decoration:none;">salutediferro.com</a>
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
              subject: `${firstName}, il tuo profilo salute \u00e8 pronto \u2014 prenota la tua call`,
              html: followUpHtml,
            }),
          });
        } catch (e) {
          console.error('Follow-up email error:', e.message);
        }

        // ── Notifica al team: nuovo lead ──
        try {
          const teamNotifyHtml = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0D0D0D;margin:0;padding:0;color:#F5F5F5;">
<div style="max-width:520px;margin:32px auto;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
  <div style="background:#1B4FBF;padding:24px 28px;">
    <div style="color:white;font-size:18px;letter-spacing:3px;font-weight:bold;">NUOVO LEAD</div>
    <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">Salute di Ferro \u2014 Test completato</div>
  </div>
  <div style="padding:28px;">
    <div style="background:#242424;border-radius:6px;padding:16px;margin-bottom:16px;">
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Nome:</strong> <span style="color:#CCC;">${escapeHtml(data.name) || '-'}</span></p>
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Email:</strong> <span style="color:#CCC;">${escapeHtml(data.email) || '-'}</span></p>
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Telefono:</strong> <span style="color:#CCC;">${escapeHtml(data.phone) || '-'}</span></p>
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Segmento:</strong> <span style="color:#CCC;">${escapeHtml(SEGMENT_LABEL[seg] || seg)}</span></p>
    </div>
    <div style="background:#242424;border-radius:6px;padding:16px;margin-bottom:16px;">
      <div style="font-size:11px;letter-spacing:2px;color:#1B4FBF;font-weight:bold;margin-bottom:10px;">RISPOSTE</div>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Sesso: ${escapeHtml(r(SEX, data.sex))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Et\u00e0: ${escapeHtml(r(AGE, data.age))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Allenamento: ${escapeHtml(r(TRAINING, data.training))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Farmaci: ${escapeHtml(r(PHARMA, data.pharma))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Energia: ${escapeHtml(r(ENERGIA, data.energia))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Sonno: ${escapeHtml(r(SONNO, data.sonno))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Libido: ${escapeHtml(r(LIBIDO, data.libido))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Ciclo: ${escapeHtml(r(CICLO, data.ciclo))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Grasso: ${escapeHtml(r(GRASSO, data.grasso))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Pressione: ${escapeHtml(r(PRESSIONE, data.pressione))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Assunzione: ${escapeHtml(mapArray(data.assunzione, ASSUNZIONE))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Analisi: ${escapeHtml(r(ANALISI, data.analisi))}</p>
    </div>
    <div style="background:#242424;border-radius:6px;padding:16px;">
      <div style="font-size:11px;letter-spacing:2px;color:#1B4FBF;font-weight:bold;margin-bottom:10px;">RISULTATO</div>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Score: ${escapeHtml(String(data.score ?? ''))}/5 \u2014 ${escapeHtml(data.score_name || '')}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Tag: ${escapeHtml(Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''))}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Referral: ${escapeHtml(data.referral || 'nessuno')}</p>
    </div>
  </div>
</div>
</body>
</html>`;
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Salute di Ferro <noreply@salutediferro.com>',
              to: ['info@salutediferro.com'],
              subject: `Nuovo lead: ${(data.name || 'Anonimo').substring(0, 60).replace(/[\r\n]/g, ' ')} \u2014 ${SEGMENT_LABEL[seg] || seg}`,
              html: teamNotifyHtml,
            }),
          });
        } catch (e) {
          console.error('Team notification email error:', e.message);
        }
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── POST /create-checkout-session ──
    if (path === '/create-checkout-session' && request.method === 'POST') {
      const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
      if (!STRIPE_SECRET_KEY) {
        return new Response(JSON.stringify({ error: 'Missing Stripe key' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Rate limit checkout too
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      cleanupRateLimit();
      if (isRateLimited(clientIP)) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const origin = url.origin;

      // Referral codes validated SERVER-SIDE only — code → discount %
      const REFERRAL_DISCOUNTS = { BARBARA: 10, ANGELO: 10, MARCO: 10, SPCREW: 20, SPCREWTOP: 25 };
      let customerEmail = '';
      let referral = '';
      let discountPct = 0;
      try {
        const body = await request.json();
        customerEmail = sanitize(body.email || '');
        const code = sanitize((body.referral || '').trim().toUpperCase());
        if (REFERRAL_DISCOUNTS[code] !== undefined) {
          referral = code;
          discountPct = REFERRAL_DISCOUNTS[code];
        }
      } catch (e) {}

      if (customerEmail && !isValidEmail(customerEmail)) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update referral in Google Sheet if present
      const GOOGLE_SHEET_URL = env.GOOGLE_SHEET_URL;
      if (referral && customerEmail && GOOGLE_SHEET_URL) {
        try {
          const updateData = { action: 'update_referral', email: customerEmail, referral: referral };
          const b64 = safeB64(updateData);
          await fetch(GOOGLE_SHEET_URL + '?data=' + encodeURIComponent(b64));
        } catch (e) {
          console.error('Referral update error:', e.message || 'unknown');
        }
      }

      const baseAmount = 2700; // 27€ in cents — Promo Lancio
      const referralAmount = 2200; // 22€ in cents — prezzo referral fisso promo lancio
      const unitAmount = String(referral ? referralAmount : baseAmount);

      const params = {
        'mode': 'payment',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': 'Promo Lancio \u2014 Membership 1 mese + Consulenza',
        'line_items[0][price_data][unit_amount]': unitAmount,
        'line_items[0][quantity]': '1',
        'success_url': origin + '/payment-success?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url': origin,
      };
      if (customerEmail) {
        params['customer_email'] = customerEmail;
      }
      if (referral) {
        params['metadata[referral]'] = referral;
      }

      try {
        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(STRIPE_SECRET_KEY + ':')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(params).toString(),
        });

        const session = await stripeRes.json();

        if (!stripeRes.ok) {
          // Privacy: NO log dell'intero session object (contiene customer_details, payment info).
          // Logghiamo solo il messaggio + tipo dell'errore Stripe.
          console.error('Stripe checkout error:', session?.error?.type || 'unknown', session?.error?.message || 'no message');
          return new Response(JSON.stringify({ error: 'Stripe session failed' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ url: session.url }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Stripe fetch error:', err.message || 'unknown');
        return new Response(JSON.stringify({ error: 'Internal error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ── Payment success: marca PAGATO, email conferma, pagina successo ──
    if (path === '/payment-success' && request.method === 'GET') {
      const sessionId = url.searchParams.get('session_id');
      const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
      const GOOGLE_SHEET_URL = env.GOOGLE_SHEET_URL;
      const RESEND_API_KEY = env.RESEND_API_KEY;
      const calendlyUrl = 'https://calendly.com/salutediferro-info/30min';

      let customerEmail = '';
      let customerName = '';
      let amountPaid = '0.00';
      let productName = 'Acquisto Salute di Ferro';
      let referralUsed = '';

      if (sessionId && STRIPE_SECRET_KEY) {
        try {
          // expand=line_items per ottenere nome prodotto reale (Founder Pass / Membership / Consulenza)
          const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=line_items&expand[]=line_items.data.price.product`, {
            headers: { Authorization: `Basic ${btoa(STRIPE_SECRET_KEY + ':')}` },
          });
          const session = await stripeRes.json();
          customerEmail = session.customer_details?.email || session.customer_email || '';
          customerName = session.customer_details?.name || '';
          if (session.amount_total) amountPaid = (session.amount_total / 100).toFixed(2);
          referralUsed = session.metadata?.referral || '';
          // Estrai nome prodotto reale dal primo line_item · fallback graceful
          const li = session.line_items?.data?.[0];
          if (li) {
            productName =
              li.price?.product?.name ||
              li.description ||
              productName;
          }
        } catch (e) {
          console.error('Stripe session retrieve error:', e.message);
        }
      }

      const paidAt = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
      const firstName = customerName ? customerName.split(' ')[0] : '';

      // Aggiorna Google Sheets con stato PAGATO
      if (GOOGLE_SHEET_URL && customerEmail) {
        try {
          const paymentData = {
            action: 'mark_paid', email: customerEmail, name: customerName,
            paid_at: paidAt, amount: amountPaid, currency: 'EUR', stripe_session: sessionId || '',
          };
          const b64 = safeB64(paymentData);
          await fetch(GOOGLE_SHEET_URL + '?data=' + encodeURIComponent(b64));
        } catch (e) {
          console.error('Sheet payment update error:', e.message);
        }
      }

      // Invia email di conferma pagamento
      if (RESEND_API_KEY && customerEmail) {
        const safeFirstName = escapeHtml(firstName);
        const safeAmountPaid = escapeHtml(String(amountPaid));
        const safePaidAt = escapeHtml(String(paidAt));
        const safeCalendlyUrl = escapeHtml(String(calendlyUrl));
        const safeProductName = escapeHtml(String(productName));
        const payEmailHtml = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0D0D0D;margin:0;padding:0;color:#F5F5F5;">
<div style="max-width:520px;margin:32px auto;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
  <div style="background:#28a745;padding:24px 28px;">
    <div style="color:white;font-size:18px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>
    <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:2px;">Conferma pagamento</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:18px;font-weight:bold;margin:0 0 16px 0;">${safeFirstName ? safeFirstName + ', il' : 'Il'} tuo pagamento \u00e8 confermato!</p>
    <div style="background:#242424;border-radius:6px;padding:16px;margin:16px 0;">
      <div style="font-size:11px;letter-spacing:2px;color:#28a745;font-weight:bold;margin-bottom:12px;">RIEPILOGO</div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#CCCCCC;">${safeProductName}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#888;">Importo pagato</span>
        <span style="font-size:15px;font-weight:bold;color:#F5F5F5;">\u20ac${safeAmountPaid}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-size:13px;color:#888;">Data</span>
        <span style="font-size:13px;color:#CCCCCC;">${safePaidAt}</span>
      </div>
    </div>
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Ora non ti resta che prenotare la tua call con il team di Salute di Ferro. Scegli il giorno e l'orario che preferisci:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${safeCalendlyUrl}" style="display:inline-block;padding:14px 32px;background:#C82020;color:white;font-weight:bold;font-size:15px;border-radius:6px;text-decoration:none;letter-spacing:1px;">PRENOTA LA TUA CALL SU CALENDLY</a>
    </div>
    <p style="font-size:12px;color:#888;text-align:center;">Se hai bisogno di assistenza, rispondi a questa email.</p>
  </div>
  <div style="background:#141414;padding:14px 28px;font-size:11px;color:#555;border-top:1px solid #2A2A2A;">
    Salute di Ferro \u2014 <a href="https://salutediferro.com" style="color:#C82020;text-decoration:none;">salutediferro.com</a>
  </div>
</div></body></html>`;
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Salute di Ferro <noreply@salutediferro.com>',
              to: [customerEmail],
              subject: 'Conferma pagamento \u2014 Salute di Ferro',
              html: payEmailHtml,
            }),
          });
        } catch (e) {
          console.error('Payment confirmation email error:', e.message);
        }
      }

      // Pagina di conferma \u00b7 accessibile (h1, main landmark, focus management)
      // Countdown auto-redirect rimosso (WCAG 2.2.1) \u00b7 cliente sceglie quando andare avanti.
      // Riepilogo dinamico da Stripe (productName + amountPaid reali).
      const safeSessionId = (sessionId || '').replace(/[^a-zA-Z0-9_-]/g, '');
      const safeReferral = referralUsed.replace(/[^a-zA-Z0-9_-]/g, '');
      const escFirstName = escapeHtml(firstName);
      const escProductName = escapeHtml(productName);
      const escAmount = escapeHtml(amountPaid);
      const escPaidAt = escapeHtml(paidAt);
      const escCalendlyUrl = escapeHtml(calendlyUrl);

      const successHtml = `<!DOCTYPE html><html lang="it">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Pagamento confermato \u2014 Salute di Ferro</title>
  <meta name="robots" content="noindex,nofollow">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NDGGVVFF');</script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#0D0D0D;color:#F5F5F5;font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;}
    main{max-width:480px;width:100%;padding:32px 20px;text-align:center;}
    .logo-img{height:80px;margin-bottom:24px;}
    .icon{width:64px;height:64px;background:#28a745;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
    .icon svg{width:32px;height:32px;}
    h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,6vw,40px);line-height:1.1;margin-bottom:8px;font-weight:normal;}
    h1 em{color:#28a745;font-style:normal;}
    h1:focus{outline:2px solid #FFB000;outline-offset:4px;}
    .sub{color:#cfcfcf;font-size:14px;line-height:1.5;margin-bottom:24px;}
    .box{background:#1A1A1A;border:1px solid #2A2A2A;border-radius:8px;padding:20px;margin-bottom:24px;text-align:left;}
    .box-label{font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:4px;color:#28a745;margin-bottom:12px;}
    .box-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px;gap:12px;flex-wrap:wrap;}
    .box-row .k{color:#a0a0a0;}
    .box-row .v{color:#F5F5F5;font-weight:500;}
    .btn{display:inline-block;padding:16px 32px;background:#C82020;color:white;font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;border-radius:6px;text-decoration:none;transition:background .2s;min-height:44px;}
    .btn:hover{background:#a01818;}
    .btn:focus-visible{outline:3px solid #FFB000;outline-offset:3px;}
    .help{color:#a0a0a0;font-size:13px;margin-top:20px;line-height:1.5;}
    .email-note{color:#cfcfcf;font-size:12px;margin-top:20px;padding:12px 16px;background:rgba(40,167,69,0.08);border:1px solid rgba(40,167,69,0.20);border-radius:6px;}
  </style>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NDGGVVFF" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
  <main id="main-content">
    <img src="https://form.salutediferro.com/LOGO.png" alt="Salute di Ferro" class="logo-img" width="80" height="80">
    <div class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
    <h1 tabindex="-1">Pagamento<br><em>confermato</em></h1>
    <p class="sub">${escFirstName ? escFirstName + ', il' : 'Il'} tuo pagamento \u00e8 andato a buon fine.<br>Ora prenota la tua call con il team Salute di Ferro.</p>
    <section class="box" aria-labelledby="riepilogo-label">
      <h2 class="box-label" id="riepilogo-label">Riepilogo ordine</h2>
      <div class="box-row"><span class="k">Servizio</span><span class="v">${escProductName}</span></div>
      <div class="box-row"><span class="k">Importo pagato</span><span class="v">\u20ac${escAmount}</span></div>
      <div class="box-row"><span class="k">Data</span><span class="v">${escPaidAt}</span></div>
    </section>
    <a href="${escCalendlyUrl}" class="btn" target="_blank" rel="noopener noreferrer">Prenota la tua call su Calendly</a>
    <p class="help">Si apre in una nuova scheda. Se preferisci, puoi prenotare anche pi\u00f9 tardi: la tua iscrizione \u00e8 gi\u00e0 attiva.</p>
    <p class="email-note">Ti abbiamo inviato anche un'email di conferma con tutti i dettagli del tuo acquisto.</p>
  </main>
  <script>
    // Focus su h1 al load per screen reader (WCAG 2.4.3)
    window.addEventListener('DOMContentLoaded',function(){var h=document.querySelector('h1');if(h)h.focus();});
    // GTM event tracking conversione (NO redirect automatico, cliente sceglie quando)
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'payment_success',payment_amount:${amountPaid},payment_currency:'EUR',referral:'${safeReferral}',stripe_session_id:'${safeSessionId}'});
  </script>
</body></html>`;

      return new Response(successHtml, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    // ── Stripe webhook (checkout.session.completed) ──
    // Garantisce registrazione pagamento server-side anche se utente chiude browser
    // prima del redirect a /payment-success. Idempotente: Apps Script mark_paid
    // ignora chiamate duplicate sullo stesso session_id.
    if (path === '/stripe-webhook' && request.method === 'POST') {
      const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
      const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
      const GOOGLE_SHEET_URL = env.GOOGLE_SHEET_URL;
      const RESEND_API_KEY = env.RESEND_API_KEY;

      if (!STRIPE_WEBHOOK_SECRET) {
        console.error('Stripe webhook: missing STRIPE_WEBHOOK_SECRET');
        return new Response('Webhook not configured', { status: 500 });
      }

      const signature = request.headers.get('Stripe-Signature') || '';
      const rawBody = await request.text();

      const valid = await verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET);
      if (!valid) {
        console.error('Stripe webhook: invalid signature');
        return new Response('Invalid signature', { status: 400 });
      }

      let event;
      try {
        event = JSON.parse(rawBody);
      } catch (e) {
        return new Response('Invalid JSON', { status: 400 });
      }

      // Solo eventi pagamento completato
      if (event.type !== 'checkout.session.completed') {
        // Acknowledge ma ignora altri eventi
        return new Response(JSON.stringify({ received: true }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }

      const session = event.data?.object;
      if (!session) {
        return new Response('Missing session', { status: 400 });
      }

      const customerEmail = session.customer_details?.email || session.customer_email || '';
      const customerName = session.customer_details?.name || '';
      const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : '27.00';
      const referralUsed = session.metadata?.referral || '';
      const sessionId = session.id || '';
      const paidAt = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });

      // ── Founder Pass discriminator + decremento atomico D1 ──
      // Se metadata.tier === 'founder' (Payment Link Founder Pass €119/anno), assegniamo uno slot
      // dei 200 disponibili. UPDATE atomico in singolo statement: D1 garantisce esecuzione
      // sequenziale all'interno di un Worker isolate, evitando race fra invocazioni concorrenti.
      // Race condition residua (utente N°201): pagamento già passato, slot esauriti → loggiamo
      // per refund manuale via Stripe Dashboard (decisione business, vedi ADR-005 in handover).
      const tier = session.metadata?.tier || '';
      const isFounder = tier === 'founder';
      let founderSlotAssigned = null;

      if (isFounder) {
        if (!env.DB) {
          console.error('Founder webhook: D1 binding `DB` non configurato, slot NON decrementato per session', sessionId);
          // Acknowledge comunque a Stripe (200) per evitare retry. Rimedio manuale necessario.
        } else {
          try {
            const row = await env.DB.prepare(`
              UPDATE founder_slots
              SET sold_at = datetime('now'),
                  stripe_customer_id = ?,
                  stripe_subscription_id = ?,
                  stripe_session_id = ?,
                  email = ?
              WHERE slot_number = (
                SELECT slot_number FROM founder_slots
                WHERE sold_at IS NULL
                ORDER BY slot_number ASC
                LIMIT 1
              )
              RETURNING slot_number
            `).bind(
              session.customer || '',
              session.subscription || '',
              sessionId,
              customerEmail
            ).first();

            if (row?.slot_number) {
              founderSlotAssigned = row.slot_number;
              console.log(`Founder Pass: slot #${founderSlotAssigned} assegnato a ${maskEmail(customerEmail)} (session ${sessionId})`);
            } else {
              // Tutti i 200 slot già venduti: oversell. Pagamento già processato da Stripe.
              console.warn(`Founder Pass OVERSELL: session ${sessionId} ${maskEmail(customerEmail)} pagato ma 200 posti esauriti. Refund manuale richiesto.`);
            }
          } catch (e) {
            console.error('Founder slot decrement error:', e?.message || 'unknown', 'session:', sessionId);
            // NON propaghiamo: webhook deve sempre rispondere 200 a Stripe per evitare retry storm.
          }
        }
      }

      // 1. Mark paid in Sheet (idempotente lato Apps Script via session_id)
      if (GOOGLE_SHEET_URL && customerEmail) {
        try {
          const paidData = {
            action: 'mark_paid',
            email: customerEmail,
            session_id: sessionId,
            amount_paid: amountPaid,
            paid_at: paidAt,
            referral_used: referralUsed,
            source: 'stripe_webhook',
          };
          const b64 = safeB64(paidData);
          await fetch(GOOGLE_SHEET_URL + '?data=' + encodeURIComponent(b64));
        } catch (e) {
          console.error('Stripe webhook Sheet update error:', e.message || 'unknown');
        }
      }

      // 2. Email confirm — distinta per mode (payment=consulenza, subscription=membership)
      if (RESEND_API_KEY && customerEmail) {
        const safeFirstName = escapeHtml((customerName || '').split(' ')[0] || 'Ciao');
        const safeAmountPaid = escapeHtml(String(amountPaid));
        const safePaidAt = escapeHtml(String(paidAt));
        const isSubscription = session.mode === 'subscription';
        const calendlyUrl = 'https://calendly.com/salutediferro-info/30min';

        const subject = isSubscription
          ? (isFounder
              ? 'Founder Pass attivo — Salute di Ferro'
              : 'Membership attiva — Salute di Ferro')
          : 'Pagamento confermato — Salute di Ferro';

        const payEmailHtml = buildMail2Html(isSubscription, {
          firstName: safeFirstName,
          amountPaid: safeAmountPaid,
          paidAt: safePaidAt,
          calendlyUrl,
          customerEmail,
        });

        const idempPrefix = isSubscription ? 'stripe-sub-' : 'stripe-pay-';
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
              'Idempotency-Key': `${idempPrefix}${sessionId}`,
            },
            body: JSON.stringify({
              from: 'Salute di Ferro <noreply@salutediferro.com>',
              to: [customerEmail],
              subject,
              html: payEmailHtml,
            }),
          });
        } catch (e) {
          console.error('Stripe webhook email error:', e.message || 'unknown');
        }
      }

      // 3. Bridge a n8n · fire-and-forget per follow-up sequence (NON blocca risposta a Stripe)
      // n8n riceve dati pagamento e schedula sequenza email follow-up indipendente dalla mail immediata sopra.
      // Workflow n8n: https://n8n.salutediferro.com/webhook/stripe-paid (workflow ID e1bU7w1I0BvIzEm0)
      // Branch interno workflow su `mode`:
      //   - mode=subscription (€197 membership) → email T+1g, T+3g, T+7g
      //   - mode=payment (€27 consulenza) → email T+2g, T+5g
      // Errori vengono loggati ma NON propagati (idempotency + best-effort).
      const N8N_STRIPE_WEBHOOK_URL = env.N8N_STRIPE_WEBHOOK_URL;
      if (N8N_STRIPE_WEBHOOK_URL && customerEmail) {
        try {
          const n8nPayload = {
            customerEmail,
            customerName,
            amountPaid,
            sessionId,
            mode: session.mode || (session.subscription ? 'subscription' : 'payment'),
            paidAt,
            referralUsed,
            tier: tier || null,                          // 'founder' se Founder Pass, null altrimenti
            founderSlotAssigned: founderSlotAssigned,    // 1..200 se Founder, null altrimenti
          };
          // ctx.waitUntil per fire-and-forget: non blocca risposta 200 a Stripe se n8n è lento o down
          const n8nReq = fetch(N8N_STRIPE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Idempotency-Key': `stripe-paid-${sessionId}`,
            },
            body: JSON.stringify(n8nPayload),
          }).catch(e => console.error('n8n bridge error:', e.message || 'unknown'));
          if (typeof ctx?.waitUntil === 'function') {
            ctx.waitUntil(n8nReq);
          } else {
            await n8nReq;
          }
        } catch (e) {
          console.error('n8n bridge setup error:', e.message || 'unknown');
        }
      }

      // Privacy: log solo session_id e email mascherata (no dati pagamento)
      console.log('Stripe webhook processed:', sessionId, maskEmail(customerEmail));

      return new Response(JSON.stringify({ received: true }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── POST /ask · Agente di Ferro · Claude API ──
    if (path === '/ask' && request.method === 'POST') {
      const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
      if (!ANTHROPIC_API_KEY) {
        return new Response(JSON.stringify({ error: 'Agente non configurato' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      cleanupRateLimit();
      if (isRateLimited(clientIP)) {
        return new Response(JSON.stringify({ error: 'Troppe richieste. Aspetta un minuto.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Payload non valido' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const messages = Array.isArray(body.messages) ? body.messages : [];
      if (messages.length === 0) {
        return new Response(JSON.stringify({ error: 'Nessun messaggio' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Anti-abuso: max 20 turni di conversazione, max 2000 char per messaggio
      const safeMessages = messages.slice(-20).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || '').substring(0, 2000),
      })).filter(m => m.content.length > 0);

      // Detector parole vietate (request clinico-diagnostiche → safe fallback)
      const lastUserMsg = safeMessages.filter(m => m.role === 'user').slice(-1)[0]?.content?.toLowerCase() || '';
      const FORBIDDEN_PATTERNS = [
        /\bho\s+(il|la|un|una)\s+(testosterone|cortisolo|estrogen|tiroide|cuore|fegato|reni)/,
        /\b(diagnos[ai]|patologia|cura|terapia|prescriv|farmac)/,
        /\bcosa\s+(ho|significa|vuol\s+dire)\b/,
        /\bdevo\s+(prendere|assumere)/,
      ];
      const forbidden = FORBIDDEN_PATTERNS.some(re => re.test(lastUserMsg));

      if (forbidden) {
        const safeFallback = "Capisco la tua domanda, guerriero. Ma io sono l'Agente di Ferro: non sono un medico e non posso interpretare valori, dare diagnosi o prescrivere niente. Per quello c'è il Coach di Ferro e i medici della rete SDF.\n\nIl mio campo è spiegarti il servizio: come funziona il percorso, cosa include la membership, come prenotare la tua consulenza. Vuoi che ti racconti come iniziare?";
        return new Response(JSON.stringify({ content: safeFallback, blocked: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const systemPrompt = buildAgenteFerroSystemPrompt();

      try {
        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5',
            max_tokens: 800,
            system: [
              { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
            ],
            messages: safeMessages,
          }),
        });

        if (!claudeRes.ok) {
          const errText = await claudeRes.text();
          console.error('Claude API error', claudeRes.status, errText.substring(0, 200));
          return new Response(JSON.stringify({ error: 'Agente temporaneamente non disponibile' }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const claudeData = await claudeRes.json();
        const reply = claudeData.content?.[0]?.text || '';

        return new Response(JSON.stringify({
          content: reply,
          usage: claudeData.usage,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error('Ask endpoint error:', e.message || 'unknown');
        return new Response(JSON.stringify({ error: 'Errore interno' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ── Calendly webhook ──
    if (path === '/calendly-webhook' && request.method === 'POST') {
      const GOOGLE_SHEET_URL = env.GOOGLE_SHEET_URL;
      try {
        const body = await request.json();
        if (body.event === 'invitee.created' && GOOGLE_SHEET_URL) {
          const inviteeEmail = body.payload?.invitee?.email || '';
          const inviteeName = body.payload?.invitee?.name || '';
          const eventStart = body.payload?.event?.start_time || '';
          if (inviteeEmail) {
            const bookingData = {
              action: 'calendly_booked', email: inviteeEmail, name: inviteeName,
              booked_at: new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }),
              event_start: eventStart,
            };
            const b64 = safeB64(bookingData);
            await fetch(GOOGLE_SHEET_URL + '?data=' + encodeURIComponent(b64));
          }
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error('Calendly webhook error:', e.message || 'unknown');
        return new Response(JSON.stringify({ error: 'Webhook failed' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ── POST /validate-referral (server-side only) ──
    if (path === '/validate-referral' && request.method === 'POST') {
      const REFERRAL_DISCOUNTS = { BARBARA: 10, ANGELO: 10, MARCO: 10, SPCREW: 20, SPCREWTOP: 25 };
      try {
        const body = await request.json();
        const code = sanitize((body.code || '').trim().toUpperCase());
        const discount = REFERRAL_DISCOUNTS[code];
        const valid = discount !== undefined;
        return new Response(JSON.stringify({ valid, code: valid ? code : '', discount: valid ? discount : 0 }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ valid: false, discount: 0 }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },

  // ── Cron: recupero carrello abbandonato ──
  async scheduled(event, env, ctx) {
    const GOOGLE_SHEET_URL = env.GOOGLE_SHEET_URL;
    const RESEND_API_KEY = env.RESEND_API_KEY;
    if (!GOOGLE_SHEET_URL || !RESEND_API_KEY) return;

    try {
      const checkData = { action: 'get_unpaid_leads' };
      const b64 = safeB64(checkData);
      const res = await fetch(GOOGLE_SHEET_URL + '?data=' + encodeURIComponent(b64));
      const result = await res.json();

      if (!result.rows || result.rows.length === 0) return;

      for (const lead of result.rows) {
        const firstName = escapeHtml((lead.name || '').split(' ')[0] || 'Ciao');
        const reminderHtml = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0D0D0D;margin:0;padding:0;color:#F5F5F5;">
<div style="max-width:520px;margin:32px auto;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
  <div style="background:#C82020;padding:24px 28px;">
    <div style="color:white;font-size:18px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>
    <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">Non dimenticarti della tua salute</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:18px;font-weight:bold;margin:0 0 16px 0;">${firstName}, hai dimenticato qualcosa?</p>
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Il tuo profilo di Ferro \u00e8 pronto, ma non hai ancora prenotato la tua consulenza con il team di Salute di Ferro.</p>
    <div style="background:#242424;border-radius:6px;padding:16px;margin:20px 0;">
      <div style="font-size:11px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:8px;">COSA TI ASPETTA</div>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Analisi completa del tuo profilo</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Piano personalizzato di analisi mirate</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Corsia preferenziale su esami, visite, trattamenti</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Coach di Ferro al tuo servizio</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Prezzo bloccato A VITA al rinnovo</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://form.salutediferro.com" style="display:inline-block;padding:14px 32px;background:#C82020;color:white;font-weight:bold;font-size:15px;border-radius:6px;text-decoration:none;letter-spacing:1px;">PRENOTA ORA LA TUA CALL — da 9,99€/mese (Founder)</a>
    </div>
    <p style="font-size:12px;color:#888;text-align:center;">Founder Pass in esaurimento — €9,99/mese A VITA</p>
  </div>
  <div style="background:#141414;padding:14px 28px;font-size:11px;color:#555;border-top:1px solid #2A2A2A;">
    Salute di Ferro \u2014 <a href="https://salutediferro.com" style="color:#C82020;text-decoration:none;">salutediferro.com</a>
  </div>
</div></body></html>`;

        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Salute di Ferro <noreply@salutediferro.com>',
              to: [lead.email],
              subject: `${firstName}, hai dimenticato qualcosa?`,
              html: reminderHtml,
            }),
          });
        } catch (e) {
          console.error('Reminder email error:', e.message);
        }

        // Segna come REMINDER_SENT
        try {
          const markData = { action: 'mark_reminder_sent', email: lead.email };
          const markB64 = safeB64(markData);
          await fetch(GOOGLE_SHEET_URL + '?data=' + encodeURIComponent(markB64));
        } catch (e) {
          console.error('Mark reminder error:', e.message);
        }
      }
    } catch (e) {
      console.error('Scheduled task error:', e.message || 'unknown');
    }
  },
};


// ════════════════════════════════════════════════════════════════════
// ── Agente di Ferro · System prompt + knowledge base statico ───────
// ════════════════════════════════════════════════════════════════════
//
// Knowledge base inserito nel system prompt (Strategia A — vedi vault
// Obsidian SaluteDiFerro/Agente-di-Ferro.md). Cache prompt attivata
// (cache_control: ephemeral) per ridurre input cost del 60-80%.
function buildAgenteFerroSystemPrompt() {
  return `Sei l'Agente di Ferro, l'assistente virtuale di Salute di Ferro (SDF).

# CHI SEI
Tu rappresenti SDF online. Parli con chi è arrivato sul sito e ha domande sul servizio. Il tuo lavoro è informare, motivare, far capire il valore e portare l'utente verso il prossimo passo: la consulenza con il Coach di Ferro.

# IDENTITÀ DI MARCA · IL TONO
Parli da guerriero, non da call center. Diretto, motivazionale, sicuro. Niente paroloni medici, niente burocrazia, niente "le saluto cordialmente". Dai del tu sempre.

Vocabolario permesso e incoraggiato:
- "DI FERRO", "guerriero", "atleta", "performance"
- "prendere il controllo", "alzare l'asticella", "smetterla di indovinare"
- "il tuo profilo parla chiaro", "non sei più solo"
- Energia, ferocia controllata, lealtà

Vocabolario VIETATO:
- "Salve", "gentile cliente", "le confermo che", "in merito a"
- Tutto ciò che suona burocratico o telefonata di un call center

# COSA È SDF
SDF è una piattaforma di intermediazione sanitaria verticale sul mondo performance (bodybuilding, powerlifting, fitness, sport di forza). Modello tipo Doctolib o MioDottore, ma fatto da chi capisce gli atleti.

SDF NON è:
- Una struttura sanitaria
- Un ambulatorio o una clinica
- Un servizio di consulenza medica
- Una farmacia online

SDF È:
- Una piattaforma che mette in contatto utenti con medici e laboratori specializzati
- Un funnel: dal questionario online → pannello analisi → consulenza → analisi → medico se serve
- Coordinamento, percorso guidato, dashboard

# I PRODOTTI E I PREZZI

## 1. Founder Pass annuale · 119,88€/anno (≈ 9,99€/mese) · LIMITATO 200 POSTI
- Accesso completo alla piattaforma per 12 mesi
- Consulenza con il tuo Coach di Ferro inclusa
- Tariffe convenzionate nei laboratori partner per tutto l'anno
- Coordinamento continuo con il team SDF
- Prezzo BLOCCATO A VITA al rinnovo (€9,99/mese per sempre)
- Pagamento dilazionato 3 rate con Klarna
- Solo 200 posti disponibili. Una volta esauriti, il prezzo tornerà a €197/anno

## 2. Membership + Consulenza · 24,99€/mese (mensile)
- 1 mese di accesso completo alla piattaforma
- 1 consulenza di 30 minuti con il tuo Coach di Ferro
- Pannello analisi personalizzato consigliato
- Tariffe convenzionate nei laboratori partner per un mese
- Rinnovo mensile automatico via Stripe (cancelli quando vuoi)

## 3. Membership annuale regolare · 197€/anno (≈ 16,42€/mese)
- Servizio analogo al Founder Pass
- Prezzo applicato quando i 200 posti Founder verranno esauriti
- Rinnovo annuale automatico via Stripe
- Risparmio del 35% rispetto alla Membership mensile (16,42€ vs 24,99€)

# IL PROCESSO DELL'UTENTE
1. Compila il questionario online (10 domande, 2 minuti) → "Test di Ferro" o "Profilo Metabolico"
2. Riceve immediatamente: profilo (KAMIKAZE/PIONIERE/STRATEGA/MAESTRO ecc.), score, segnali principali, pannello analisi consigliato
3. Sceglie consulenza una tantum o membership annuale
4. Paga con carta tramite Stripe (sicuro)
5. Riceve email automatica con link per prenotare la chiamata su Calendly
6. Prenota lo slot della call con il Coach
7. Coach analizza profilo + risposte + valori → propone pannello specifico al laboratorio convenzionato
8. Utente fa le analisi al laboratorio (fattura separata, tariffa convenzionata)
9. Se servono visite mediche specialistiche, il Coach indirizza ai medici della rete

# I PANNELLI DI ANALISI DISPONIBILI
- FERRO CORE — pannello base obbligatorio (testosterone sempre incluso)
- ANDROGENO — focus profilo ormonale maschile
- CUORE — cardiovascolare, lipidi
- RENI — funzionalità renale
- FEGATO — enzimi epatici, funzionalità
- METABOLICO — glicemia, insulina, profilo metabolico
- TIROIDE — funzione tiroidea completa
- RECOVERY — markers recupero, infiammazione
- DONNA — pannello dedicato profilo femminile

# IL COACH DI FERRO · COSA PUÒ E NON PUÒ FARE
PUÒ:
- Coordinare il percorso utente
- Spiegare il significato pratico del test guidato
- Raccomandare il pannello analisi più adatto
- Indirizzare al medico/laboratorio della rete
- Accompagnare nell'organizzazione operativa
- Rispondere a domande pratiche su come procedere

NON PUÒ:
- Fare diagnosi
- Prescrivere farmaci
- Interpretare clinicamente esami specifici
- Erogare consulenza medica diretta

# LE TUE REGOLE NON NEGOZIABILI

## REGOLA 1 · MAI LINGUAGGIO DIAGNOSTICO
PERMESSO:
- "I tuoi valori non rientrano nel range oggettivo dei riferimenti scientifici per atleti e amatori"
- "Il pannello suggerito per te è X"
- "Approfondisci con il Coach di Ferro"

VIETATO ASSOLUTAMENTE:
- "Hai il testosterone basso", "hai un problema", "hai una patologia", "diagnosi", "rischio cardiaco"
- Qualsiasi frase che suggerisca una diagnosi medica
- Interpretazione clinica di valori specifici

## REGOLA 2 · SCONTO REFERRAL SOLO SU FEE PIATTAFORMA
Se chiedono di referral: "Lo sconto del 10% si applica solo sulla quota di Salute di Ferro. Mai sulle analisi del laboratorio o sulla visita medica — quelle sono fatturate da soggetti diversi e non possiamo applicarci sconti."

## REGOLA 3 · ESCALATION AL COACH PER DOMANDE CLINICHE
Se l'utente fa una domanda clinica diretta ("ho il colesterolo alto, cosa devo fare?"), DEVI rifiutare e rimandare al Coach. Non azzardarti mai a interpretare valori o suggerire trattamenti.

## REGOLA 4 · SEI UN'AI, DICHIARALO
Se ti chiedono "sei un umano?", rispondi onestamente: "Sono l'Agente di Ferro, un assistente AI di Salute di Ferro. Per parlare con un umano c'è il Coach di Ferro: prenoti la consulenza dopo il test." Compliance UE AI Act.

# COSA RISPONDERE AGLI INDECISI
"Mi serve davvero?" → "Se hai compilato il test e sei qui, qualcosa ti ha portato. La domanda vera è: vuoi continuare a indovinare o vuoi un piano basato su dati oggettivi?"

"Costa troppo" → "Costa troppo? 9,99€/mese con Founder Pass è quello che spendi in 2 caffè a settimana. Qui ti danno un Coach, pannelli mirati, tariffe scontate nei laboratori convenzionati per 12 mesi e prezzo bloccato A VITA. In più, accesso a una rete di Medici di Ferro che capiscono chi si allena. Ora chiediti: è ancora troppo? I posti sono 200, finiscono presto."

"Posso fare le analisi da solo?" → "Certo. Ma allora paghi prezzo pieno, scegli a caso quali marker prendere e nessuno ti aiuta a leggerli. Noi ti diamo: pannello mirato + tariffa convenzionata + un medico che parla la tua lingua. Decidi tu cosa vale di più."

# COSA CHIUDE BENE UNA CONVERSAZIONE
Se hai risposto a una FAQ pratica, finisci con un mini-CTA:
- "Vuoi iniziare? → Compila il Test di Ferro: 2 minuti, ti dico subito da dove partire."
- "Pronto? → Prenota la consulenza dalla home: scegli il prodotto e via."

Non essere venditore aggressivo. Sii diretto.

# LIMITAZIONI E DISCLAIMER
- Le risposte sono indicative, basate su info di SDF, possono non riflettere aggiornamenti recenti
- Per consulenza personalizzata serve la chiamata con il Coach
- Per dubbi medici servono i professionisti della rete SDF
- Salute di Ferro è una piattaforma di intermediazione, non una struttura sanitaria

Ora rispondi all'utente che ti scrive. Sii utile. Sii motivante. Sii DI FERRO.`;
}


// ════════════════════════════════════════════════════════════════════
// ── Mail #2 template builder · post-pagamento ──────────────────────
// ════════════════════════════════════════════════════════════════════
//
// Genera HTML diverso per:
//   - mode=payment      → consulenza one-shot, focus prenotazione Calendly
//   - mode=subscription → membership annuale, focus benvenuto + bonus + accesso
function buildMail2Html(isSubscription, data) {
  const { firstName, amountPaid, paidAt, calendlyUrl, customerEmail } = data;
  const productLabel = isSubscription ? 'MEMBERSHIP ATTIVA' : 'PAGAMENTO CONFERMATO';
  const heroTitle = isSubscription
    ? `${firstName}, sei di Ferro.`
    : `${firstName}, il tuo pagamento è confermato.`;
  const heroSub = isSubscription
    ? 'Da qui in poi non sei più solo.'
    : 'Manca solo un passo: prenota la tua consulenza.';

  const recapBlock = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#242424;border-radius:8px;margin-bottom:24px;">
      <tr><td style="padding:18px 20px;">
        <div style="font-size:12px;letter-spacing:2px;color:#28A745;font-weight:bold;margin-bottom:10px;">RIEPILOGO ORDINE</div>
        <p style="margin:0 0 6px 0;font-size:14px;color:#CCCCCC;"><span style="color:#888;">Importo:</span> <strong style="color:#F5F5F5;">€${amountPaid}${isSubscription ? ' / anno' : ''}</strong></p>
        <p style="margin:0;font-size:14px;color:#CCCCCC;"><span style="color:#888;">Data:</span> <strong style="color:#F5F5F5;">${paidAt}</strong></p>
      </td></tr>
    </table>`;

  const bookingBlock = `
    <h2 style="margin:24px 0 12px 0;font-size:18px;color:#F5F5F5;">Prenota la tua consulenza</h2>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5;color:#CCCCCC;">Una call di 30 minuti con il Coach assegnato. Scegli lo slot che preferisci.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;"><tr>
      <td style="background:#C82020;border-radius:6px;">
        <a href="${calendlyUrl}" style="display:inline-block;padding:16px 32px;color:#FFFFFF;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;">PRENOTA SU CALENDLY →</a>
      </td>
    </tr></table>`;

  const stepsBlock = isSubscription ? `
    <h2 style="margin:24px 0 12px 0;font-size:18px;color:#F5F5F5;">Cosa aspettarti dalla consulenza</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding:8px 0;font-size:14px;color:#CCCCCC;line-height:1.5;"><strong style="color:#C82020;">1. Storia.</strong> Il Coach ascolta il tuo percorso, allenamento, obiettivi.</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#CCCCCC;line-height:1.5;"><strong style="color:#C82020;">2. Lettura.</strong> Analizza eventuali esami precedenti, farmaci, integratori.</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#CCCCCC;line-height:1.5;"><strong style="color:#C82020;">3. Piano.</strong> Definisce il pannello analisi più adatto al tuo profilo.</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#CCCCCC;line-height:1.5;"><strong style="color:#C82020;">4. Connessione.</strong> Ti collega al laboratorio convenzionato e, se serve, al medico di rete.</td></tr>
    </table>` : '';

  const checklistBlock = isSubscription ? `
    <h2 style="margin:24px 0 12px 0;font-size:18px;color:#F5F5F5;">Come prepararti in 5 minuti</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1F1614;border-left:3px solid #C82020;border-radius:4px;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 8px 0;font-size:14px;color:#CCCCCC;line-height:1.5;">— Recupera analisi del sangue degli ultimi 12-24 mesi (se disponibili)</p>
        <p style="margin:0 0 8px 0;font-size:14px;color:#CCCCCC;line-height:1.5;">— Lista farmaci, integratori e sostanze attualmente in uso</p>
        <p style="margin:0 0 8px 0;font-size:14px;color:#CCCCCC;line-height:1.5;">— Obiettivi concreti che vorresti raggiungere nei prossimi 6 mesi</p>
        <p style="margin:0;font-size:14px;color:#CCCCCC;line-height:1.5;">— Eventuali sintomi o segnali che ti hanno spinto a contattarci</p>
      </td></tr>
    </table>` : '';

  const bonusBlock = isSubscription ? `
    <h2 style="margin:24px 0 12px 0;font-size:18px;color:#F5F5F5;">Tre cose sbloccate oggi</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding:12px 0;border-bottom:1px solid #2A2A2A;">
        <div style="font-size:12px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:4px;">BONUS 01</div>
        <div style="font-size:15px;color:#F5F5F5;font-weight:bold;margin-bottom:4px;">Guida pre-prelievo</div>
        <div style="font-size:13px;color:#999;line-height:1.5;">Le 48 ore prima del prelievo: cosa mangiare, cosa evitare, cosa fa saltare i risultati.</div>
      </td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #2A2A2A;">
        <div style="font-size:12px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:4px;">BONUS 02</div>
        <div style="font-size:15px;color:#F5F5F5;font-weight:bold;margin-bottom:4px;">Tariffe convenzionate laboratori</div>
        <div style="font-size:13px;color:#999;line-height:1.5;">Sconto fino al 30% sui pannelli, attivato automaticamente con la membership.</div>
      </td></tr>
      <tr><td style="padding:12px 0;">
        <div style="font-size:12px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:4px;">BONUS 03</div>
        <div style="font-size:15px;color:#F5F5F5;font-weight:bold;margin-bottom:4px;">Contatto diretto del Coach</div>
        <div style="font-size:13px;color:#999;line-height:1.5;">Il tuo Coach ti contatterà telefonicamente al numero indicato entro 24h dal pagamento per coordinare la consulenza.</div>
      </td></tr>
    </table>` : '';

  const disclaimerBlock = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#141414;border-radius:4px;margin-bottom:16px;">
      <tr><td style="padding:14px 16px;">
        <p style="margin:0;font-size:12px;line-height:1.5;color:#888;">
          <strong style="color:#AAA;">Importante:</strong> Salute di Ferro è una piattaforma di intermediazione tra utenti e professionisti sanitari. Il Coach coordina il percorso e legge il test guidato, ma non eroga diagnosi né prescrizioni mediche. Le visite mediche e le analisi di laboratorio sono erogate da soggetti terzi convenzionati con fattura separata.
        </p>
      </td></tr>
    </table>`;

  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${productLabel} — Salute di Ferro</title></head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:Helvetica,Arial,sans-serif;color:#F5F5F5;">
<div style="display:none;max-height:0;overflow:hidden;">${heroSub}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0D0D0D;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
<tr><td style="background:#28A745;padding:24px 28px;">
<div style="color:#FFFFFF;font-size:20px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>
<div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px;">${productLabel}</div>
</td></tr>
<tr><td style="padding:32px 28px 20px 28px;">
<h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.3;color:#F5F5F5;font-weight:bold;">${heroTitle}</h1>
<p style="margin:0 0 24px 0;font-size:16px;line-height:1.5;color:#CCCCCC;">${heroSub}</p>
${recapBlock}
${bookingBlock}
${stepsBlock}
${checklistBlock}
${bonusBlock}
${disclaimerBlock}
</td></tr>
<tr><td style="background:#0D0D0D;padding:16px 28px;font-size:11px;color:#666;border-top:1px solid #2A2A2A;">
Salute di Ferro — <a href="https://salutediferro.com" style="color:#C82020;text-decoration:none;">salutediferro.com</a><br>
${customerEmail ? `Hai ricevuto questa email perché hai effettuato un acquisto su salutediferro.com (${escapeHtml(customerEmail)}).` : ''}
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

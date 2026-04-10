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
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = getCorsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
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
            console.error('Sheet webhook HTTP error:', sheetRes.status, sheetText);
          } else {
            try {
              const sheetJson = JSON.parse(sheetText);
              if (!sheetJson.ok) console.error('Sheet webhook app error:', sheetText);
            } catch (e) {
              console.error('Sheet webhook non-JSON response:', sheetText.substring(0, 200));
            }
          }
        } catch (err) {
          console.error('Sheet webhook error:', err);
        }
      }

      // ── Email di follow-up al lead ──
      const RESEND_API_KEY = env.RESEND_API_KEY;
      if (RESEND_API_KEY && data.email) {
        const firstName = (data.name || '').split(' ')[0] || 'Ciao';
        const TAG_DISPLAY = {
          CUORE: '#CUORE', FEGATO: '#FEGATO', TIROIDE: '#TIROIDE', ORMONI: '#PROFILO ORMONALE',
          METABOLISMO: '#METABOLISMO', RENI: '#RENI', CORTISOLO: '#CORTISOLO', SANGUE: '#EMOCROMO',
          PROSTATA: '#PROSTATA', TESTOSTERONE: '#TESTOSTERONE', OSSA: '#OSSA',
          FERTILITA: '#FERTILITÀ', CICLO: '#CICLO', MENOPAUSA: '#MENOPAUSA'
        };
        const tags = data.tags || [];
        const tagsBadges = tags.map(t => `<span style="display:inline-block;padding:4px 10px;border-radius:16px;font-size:12px;font-weight:600;color:#C82020;background:rgba(200,32,32,0.1);margin:2px;">${TAG_DISPLAY[t] || t}</span>`).join(' ');

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
      <p style="font-size:13px;color:#888;margin:8px 0 0;">Garanzia soddisfatti o rimborsati.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://form.salutediferro.com" style="display:inline-block;padding:14px 32px;background:#C82020;color:white;font-weight:bold;font-size:15px;border-radius:6px;text-decoration:none;letter-spacing:1px;">PRENOTA LA TUA CALL \u2014 47\u20ac</a>
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
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Nome:</strong> <span style="color:#CCC;">${data.name || '-'}</span></p>
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Email:</strong> <span style="color:#CCC;">${data.email || '-'}</span></p>
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Telefono:</strong> <span style="color:#CCC;">${data.phone || '-'}</span></p>
      <p style="font-size:14px;margin:6px 0;"><strong style="color:#F5F5F5;">Segmento:</strong> <span style="color:#CCC;">${SEGMENT_LABEL[seg] || seg}</span></p>
    </div>
    <div style="background:#242424;border-radius:6px;padding:16px;margin-bottom:16px;">
      <div style="font-size:11px;letter-spacing:2px;color:#1B4FBF;font-weight:bold;margin-bottom:10px;">RISPOSTE</div>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Sesso: ${r(SEX, data.sex)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Et\u00e0: ${r(AGE, data.age)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Allenamento: ${r(TRAINING, data.training)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Farmaci: ${r(PHARMA, data.pharma)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Energia: ${r(ENERGIA, data.energia)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Sonno: ${r(SONNO, data.sonno)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Libido: ${r(LIBIDO, data.libido)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Ciclo: ${r(CICLO, data.ciclo)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Grasso: ${r(GRASSO, data.grasso)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Pressione: ${r(PRESSIONE, data.pressione)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Assunzione: ${mapArray(data.assunzione, ASSUNZIONE)}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Analisi: ${r(ANALISI, data.analisi)}</p>
    </div>
    <div style="background:#242424;border-radius:6px;padding:16px;">
      <div style="font-size:11px;letter-spacing:2px;color:#1B4FBF;font-weight:bold;margin-bottom:10px;">RISULTATO</div>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Score: ${data.score ?? ''}/5 \u2014 ${data.score_name || ''}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Tag: ${Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '')}</p>
      <p style="font-size:13px;color:#CCC;margin:4px 0;">Referral: ${data.referral || 'nessuno'}</p>
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
              subject: `Nuovo lead: ${data.name || 'Anonimo'} \u2014 ${SEGMENT_LABEL[seg] || seg}`,
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
          console.error('Referral update error:', e);
        }
      }

      const baseAmount = 4700; // 47€ in cents
      const unitAmount = String(discountPct ? Math.round(baseAmount * (1 - discountPct / 100)) : baseAmount);

      const params = {
        'mode': 'payment',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': 'Consulenza Salute di Ferro \u2014 30 min',
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
          console.error('Stripe error:', JSON.stringify(session));
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
        console.error('Stripe fetch error:', err);
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
      let amountPaid = '47.00';
      let referralUsed = '';

      if (sessionId && STRIPE_SECRET_KEY) {
        try {
          const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
            headers: { Authorization: `Basic ${btoa(STRIPE_SECRET_KEY + ':')}` },
          });
          const session = await stripeRes.json();
          customerEmail = session.customer_details?.email || session.customer_email || '';
          customerName = session.customer_details?.name || '';
          if (session.amount_total) amountPaid = (session.amount_total / 100).toFixed(2);
          referralUsed = session.metadata?.referral || '';
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
        const payEmailHtml = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0D0D0D;margin:0;padding:0;color:#F5F5F5;">
<div style="max-width:520px;margin:32px auto;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
  <div style="background:#28a745;padding:24px 28px;">
    <div style="color:white;font-size:18px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>
    <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:2px;">Conferma pagamento</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:18px;font-weight:bold;margin:0 0 16px 0;">${firstName ? firstName + ', il' : 'Il'} tuo pagamento \u00e8 confermato!</p>
    <div style="background:#242424;border-radius:6px;padding:16px;margin:16px 0;">
      <div style="font-size:11px;letter-spacing:2px;color:#28a745;font-weight:bold;margin-bottom:12px;">RIEPILOGO</div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#CCCCCC;">Consulenza Salute di Ferro \u2014 30 min</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#888;">Importo pagato</span>
        <span style="font-size:15px;font-weight:bold;color:#F5F5F5;">\u20ac${amountPaid}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-size:13px;color:#888;">Data</span>
        <span style="font-size:13px;color:#CCCCCC;">${paidAt}</span>
      </div>
    </div>
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Ora non ti resta che prenotare la tua call con il team di Salute di Ferro. Scegli il giorno e l'orario che preferisci:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${calendlyUrl}" style="display:inline-block;padding:14px 32px;background:#C82020;color:white;font-weight:bold;font-size:15px;border-radius:6px;text-decoration:none;letter-spacing:1px;">PRENOTA LA TUA CALL SU CALENDLY</a>
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

      // Pagina di conferma con GTM tracking e countdown a Calendly
      const safeSessionId = (sessionId || '').replace(/[^a-zA-Z0-9_-]/g, '');
      const safeReferral = referralUsed.replace(/[^a-zA-Z0-9_-]/g, '');
      const successHtml = `<!DOCTYPE html><html lang="it">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Pagamento Confermato - Salute di Ferro</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NDGGVVFF');</script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#0D0D0D;color:#F5F5F5;font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;}
    .wrap{max-width:480px;width:100%;padding:32px 20px;text-align:center;}
    .logo-img{height:80px;margin-bottom:24px;}
    .icon{width:64px;height:64px;background:#28a745;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
    .icon svg{width:32px;height:32px;}
    .h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,6vw,40px);line-height:1.1;margin-bottom:8px;}
    .h1 em{color:#28a745;font-style:normal;}
    .sub{color:#999;font-size:14px;line-height:1.5;margin-bottom:24px;}
    .box{background:#1A1A1A;border:1px solid #2A2A2A;border-radius:8px;padding:20px;margin-bottom:24px;text-align:left;}
    .box-label{font-family:'Bebas Neue',sans-serif;font-size:10px;letter-spacing:4px;color:#28a745;margin-bottom:12px;}
    .box-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;}
    .box-row .k{color:#888;} .box-row .v{color:#F5F5F5;font-weight:500;}
    .btn{display:inline-block;padding:16px 32px;background:#C82020;color:white;font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;border-radius:6px;text-decoration:none;transition:background .2s;}
    .btn:hover{background:#a01818;}
    .countdown{color:#666;font-size:13px;margin-top:16px;}
    .email-note{color:#888;font-size:12px;margin-top:20px;padding:12px 16px;background:rgba(40,167,69,0.06);border:1px solid rgba(40,167,69,0.15);border-radius:6px;}
  </style>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NDGGVVFF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <div class="wrap">
    <img src="https://form.salutediferro.com/LOGO.png" alt="Salute di Ferro" class="logo-img">
    <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
    <div class="h1">PAGAMENTO<br><em>CONFERMATO!</em></div>
    <p class="sub">${firstName ? firstName + ', il' : 'Il'} tuo pagamento \u00e8 andato a buon fine.<br>Ora prenota la tua consulenza.</p>
    <div class="box">
      <div class="box-label">RIEPILOGO ORDINE</div>
      <div class="box-row"><span class="k">Servizio</span><span class="v">Consulenza 30 min</span></div>
      <div class="box-row"><span class="k">Importo</span><span class="v">\u20ac${amountPaid}</span></div>
      <div class="box-row"><span class="k">Data</span><span class="v">${paidAt}</span></div>
    </div>
    <a href="${calendlyUrl}" class="btn" id="cta">PRENOTA LA TUA CALL SU CALENDLY</a>
    <p class="countdown">Verrai reindirizzato automaticamente tra <strong id="cd">10</strong> secondi...</p>
    <p class="email-note">\u2709 Ti abbiamo inviato un'email di conferma con tutti i dettagli.</p>
  </div>
  <script>
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'payment_success',payment_amount:${amountPaid},payment_currency:'EUR',referral:'${safeReferral}',stripe_session_id:'${safeSessionId}'});
    var sec=10,el=document.getElementById('cd');
    var t=setInterval(function(){sec--;if(el)el.textContent=sec;if(sec<=0){clearInterval(t);window.location.href='${calendlyUrl}';}},1000);
  </script>
</body></html>`;

      return new Response(successHtml, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
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
        console.error('Calendly webhook error:', e);
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
        const firstName = (lead.name || '').split(' ')[0] || 'Ciao';
        const reminderHtml = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#0D0D0D;margin:0;padding:0;color:#F5F5F5;">
<div style="max-width:520px;margin:32px auto;background:#1A1A1A;border-radius:8px;overflow:hidden;border:1px solid #2A2A2A;">
  <div style="background:#C82020;padding:24px 28px;">
    <div style="color:white;font-size:18px;letter-spacing:3px;font-weight:bold;">SALUTE DI FERRO</div>
    <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">Non dimenticarti della tua salute</div>
  </div>
  <div style="padding:28px;">
    <p style="font-size:18px;font-weight:bold;margin:0 0 16px 0;">${firstName}, hai dimenticato qualcosa?</p>
    <p style="font-size:14px;color:#CCCCCC;line-height:1.6;">Il tuo profilo salute \u00e8 pronto, ma non hai ancora prenotato la tua consulenza con il team di Salute di Ferro.</p>
    <div style="background:#242424;border-radius:6px;padding:16px;margin:20px 0;">
      <div style="font-size:11px;letter-spacing:2px;color:#C82020;font-weight:bold;margin-bottom:8px;">COSA TI ASPETTA</div>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Analisi completa del tuo profilo</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Piano personalizzato di analisi</p>
      <p style="font-size:13px;color:#CCCCCC;margin:4px 0;">\u2713 Guida passo-passo su come procedere</p>
      <p style="font-size:13px;color:#888;margin:8px 0 0;">Garanzia soddisfatti o rimborsati.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://form.salutediferro.com" style="display:inline-block;padding:14px 32px;background:#C82020;color:white;font-weight:bold;font-size:15px;border-radius:6px;text-decoration:none;letter-spacing:1px;">PRENOTA ORA LA TUA CALL \u2014 47\u20ac</a>
    </div>
    <p style="font-size:12px;color:#888;text-align:center;">I posti disponibili si esauriscono velocemente.</p>
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
      console.error('Scheduled task error:', e);
    }
  },
};

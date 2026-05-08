/**
 * Stripe Payment Links centralizzati.
 *
 * Quando Antonio crea i prodotti su Stripe Dashboard, sostituire i 3 URL.
 * Ogni Payment Link deve avere:
 * - Success URL: https://salutediferro.com/payment-success
 * - Customer email: collected (Stripe lo richiede automaticamente)
 * - (consigliato) Promotion codes attivati per applicare sconti referral
 */

export const PAYMENT_LINKS = {
  /**
   * Membership + Consulenza · €24,99/mese (aggiornato 8 mag 2026 sera).
   * Sostituisce vecchio link €27/mese (5kQfZh3KY5wQ4Pj62o14400) ora archiviato.
   * Prezzo full €47 → promo lancio €24,99 (mockup V4 cliente).
   * Già creato da Antonio · link nuovo configurato 8 mag.
   */
  consulenza: 'https://buy.stripe.com/5kQ14ndlygbugy13Ug14403',

  /**
   * Membership mensile.
   * Prezzo full €(?) → promo lancio €27/mese.
   * TODO: sostituire URL quando Antonio ha creato il prodotto.
   */
  membershipMensile: 'https://buy.stripe.com/TODO_REPLACE_WITH_MONTHLY_LINK',

  /**
   * Membership annuale.
   * Prezzo full €297 → promo lancio €197/anno.
   * Subscription recurring yearly. Success URL: form.salutediferro.com/payment-success
   */
  membershipAnnuale: 'https://buy.stripe.com/3cIbJ12GU3oIgy18aw14401',

  /**
   * Founder Pass — €119/anno upfront (decisione 6 mag 2026, Giuseppe ha creato Payment Link).
   * Pagamento in unica soluzione o a rate (Stripe Klarna/Affirm/etc.).
   * Lifetime price-lock al rinnovo annuale (anche tra anni paghi €119).
   * Limite: primi 200 acquirenti. Post-200: link archiviato lato Stripe.
   *
   * Setup confermato (Giuseppe, 6 mag 2026):
   *  - Stripe Product "Founder Pass · Salute di Ferro"
   *  - Stripe Price recurring yearly €119 EUR (Price ID separato da membership €197)
   *  - Payment Link con metadata { tier: "founder", slot_target: "200" }
   *  - Pagamento a rate abilitato (Klarna o equivalente)
   *  - Success URL: form.salutediferro.com/payment-success?session_id={CHECKOUT_SESSION_ID}
   *  - Webhook decremento atomico al checkout.session.completed (Worker, in sviluppo)
   */
  founderPass: 'https://buy.stripe.com/5kQ6oHgxKe3mftXbmI14402',
};

/**
 * Dati visualizzazione prezzo "OFFERTA LANCIO" (prezzo barrato + sconto).
 * Usati dal componente <PricePromo>.
 */
export const PRICING = {
  consulenza: {
    fullPrice: 47,
    promoPrice: 24.99, // aggiornato 8 mag · era 27, allineato a mockup V4 + Stripe link nuovo
    referralPrice: 22, // se referral valido (sconto fisso, non 10% — vedi audit P2.2)
    currency: '€',
    period: '/mese',
    label: '1 mese di membership + consulenza',
    badge: 'MEMBERSHIP + CONSULENZA',
  },
  membershipMensile: {
    fullPrice: null, // da definire con cliente
    promoPrice: 27,
    currency: '€',
    period: '/mese',
    label: 'Membership mensile',
    badge: 'OFFERTA LANCIO',
  },
  membershipAnnuale: {
    fullPrice: 297,
    promoPrice: 197,
    currency: '€',
    period: '/anno',
    label: 'Membership annuale',
    badge: 'OFFERTA LANCIO',
    savings: 'Risparmi €127/anno', // 12*27 - 197 = 127
  },
  founderPass: {
    // ─── PREZZO MARKETING DISPLAY (front-end) ───
    // Mostriamo €9,99/mese in tutta la UI per impatto psicologico (pattern Spotify/Netflix).
    // L'utente vede il prezzo annuale reale (€119) SOLO al checkout Stripe.
    // Decisione user 6 mag 2026 · "i 119 li vedono solo su stripe".
    promoPrice: 9.99,            // display front
    comparisonPrice: 16.42,      // membership annuale standard mensilizzata (€197/12) per comparison barrato
    currency: '€',
    period: '/mese',             // display front
    label: 'Riservato ai primi 200 acquirenti',
    badge: 'PREZZO BLOCCATO A VITA',
    slotsTotal: 200,
    savings: 'Risparmi €6,43/mese (-39%)',

    // ─── PREZZO REALE STRIPE (backend, per documentazione) ───
    // Stripe Payment Link: €119,88/anno = 12 × €9,99 esatto · coerenza matematica con display.
    // (Configurazione Giuseppe, verificata 7 mag 2026.)
    realChargeEur: 119.88,
    realChargeNote: 'fatturato in unica soluzione una volta all\'anno (€119,88 = 12 × €9,99), prezzo bloccato anche al rinnovo',
  },
};

/**
 * Costruisce URL Payment Link aggiungendo prefilled email + client_reference_id
 * per tracciamento lead → pagamento (utile quando Antonio configura webhook
 * Stripe verso Supabase / Worker per registrazione membership).
 *
 * @param {string} baseUrl - URL Payment Link base
 * @param {object} opts - { email, referenceId }
 * @returns {string} URL completo con query params
 */
export function buildPaymentUrl(baseUrl, { email, referenceId } = {}) {
  if (!baseUrl || baseUrl.includes('TODO_REPLACE')) {
    console.warn('[payments] Payment Link URL non configurato:', baseUrl);
  }
  const url = new URL(baseUrl);
  if (email) url.searchParams.set('prefilled_email', email);
  if (referenceId) url.searchParams.set('client_reference_id', referenceId);
  return url.toString();
}

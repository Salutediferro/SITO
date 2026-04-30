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
   * Consulenza one-shot.
   * Prezzo full €47 → promo lancio €27.
   * Già creato da Antonio (link comunicato in Slack 25 apr 2026).
   * Da confermare se ancora attivo.
   */
  consulenza: 'https://buy.stripe.com/5kQfZh3KY5wQ4Pj62o14400',

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
};

/**
 * Dati visualizzazione prezzo "OFFERTA LANCIO" (prezzo barrato + sconto).
 * Usati dal componente <PricePromo>.
 */
export const PRICING = {
  consulenza: {
    fullPrice: 47,
    promoPrice: 27,
    referralPrice: 22, // se referral valido (sconto fisso, non 10% — vedi audit P2.2)
    currency: '€',
    label: 'Consulenza 30 minuti',
    badge: 'OFFERTA LANCIO',
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

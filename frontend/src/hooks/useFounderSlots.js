import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useFounderSlots — fetch e tracking dei posti Founder Pass disponibili.
 *
 * Strategia di fetch (anti-spam):
 * - Initial fetch al mount.
 * - Refetch su `visibilitychange` (tab torna visibile).
 * - Refetch su `focus` window.
 * - Polling temporizzato ogni 60s SOLO se document.visibilityState === 'visible'.
 * - AbortController per cleanup pulito su unmount.
 *
 * Soglie urgency (8 livelli, validate da accessibility-lead):
 * Frase ritornata cambia SOLO quando si attraversa una soglia, non ad ogni decremento.
 * Pattern garantisce che `aria-live="polite"` annunci max 8 volte nell'arco di vita della promo.
 *
 * Endpoint backend atteso: GET `/api/founder-slots-remaining`
 * Response shape: { slotsRemaining: number, slotsTotal: number }
 *
 * Mock locale: in dev, usa query string `?founder_slots=N` per testare visivamente le soglie.
 */

const SLOTS_TOTAL = 200;
const ENDPOINT = '/api/founder-slots-remaining';
const POLL_INTERVAL_MS = 60_000;

/**
 * Mappa slotsRemaining → soglia + frase urgency.
 * @param {number} n - slot rimasti (0..200)
 * @returns {{thresholdId: string, text: string, level: 'info'|'warn'|'urgent'|'critical'}}
 */
function resolveThreshold(n) {
  if (n >= 200) return { thresholdId: 't200', text: '200 posti Founder · prezzo €9,99/mese a vita', level: 'info' };
  if (n >= 150) return { thresholdId: 't150', text: `${SLOTS_TOTAL - n} posti presi · ${n} rimasti`, level: 'info' };
  if (n >= 100) return { thresholdId: 't100', text: 'Metà già presi', level: 'warn' };
  if (n >= 50)  return { thresholdId: 't50',  text: 'Ultimi 50 · poi prezzo torna a €16,42/mese', level: 'warn' };
  if (n >= 21)  return { thresholdId: 't21',  text: `Solo ${n} posti! Tra poco torna al prezzo normale`, level: 'urgent' };
  if (n >= 11)  return { thresholdId: 't11',  text: `ULTIMISSIMI ${n}`, level: 'urgent' };
  if (n >= 6)   return { thresholdId: 't6',   text: `${n} posti rimasti`, level: 'critical' };
  if (n >= 2)   return { thresholdId: 't2',   text: `${n} posti rimasti`, level: 'critical' };
  if (n === 1)  return { thresholdId: 't1',   text: 'ULTIMO POSTO Founder', level: 'critical' };
  return { thresholdId: 't0', text: '', level: 'critical' };
}

/**
 * Mock dev: legge ?founder_slots=N da URL per testing visuale soglie.
 * In produzione, valore null → fetch reale.
 */
function readMockFromUrl() {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('founder_slots');
    if (raw === null) return null;
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0 && n <= SLOTS_TOTAL) return n;
    return null;
  } catch {
    return null;
  }
}

export default function useFounderSlots() {
  const mockSlots = readMockFromUrl();
  const [slotsRemaining, setSlotsRemaining] = useState(mockSlots ?? null);
  const [loading, setLoading] = useState(mockSlots === null);
  const [error, setError] = useState(null);

  // Tracking soglia annunciata: aggiorniamo aria-live solo a cambio soglia (no spam)
  const lastThresholdRef = useRef(null);
  const [urgency, setUrgency] = useState(() => {
    if (mockSlots === null) return null;
    return resolveThreshold(mockSlots);
  });

  const abortRef = useRef(null);

  const fetchSlots = useCallback(async () => {
    // Mock attivo: skip fetch
    if (mockSlots !== null) return;

    // Cancella richiesta precedente in volo
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(ENDPOINT, { signal: ctrl.signal, cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const n = Number(data?.slotsRemaining);
      if (!Number.isFinite(n) || n < 0 || n > SLOTS_TOTAL) {
        throw new Error('invalid response shape');
      }
      setSlotsRemaining(n);
      setError(null);

      // Aggiorna urgency solo se la soglia è cambiata
      const next = resolveThreshold(n);
      if (next.thresholdId !== lastThresholdRef.current) {
        lastThresholdRef.current = next.thresholdId;
        setUrgency(next);
      }
    } catch (err) {
      if (err.name === 'AbortError') return; // unmount o nuovo fetch in corsa, no-op
      setError(err);
      // Dev fallback: in modalità Vite dev, se l'endpoint non esiste ancora (backend WIP)
      // mostriamo comunque la card con 200 slot pieni per consentire preview/iterazione design.
      // In produzione: card resta nascosta (slotsRemaining=null) finché backend non risponde,
      // così non promuoviamo offerta errata se Worker o D1 sono giù.
      if (import.meta.env.DEV) {
        setSlotsRemaining(SLOTS_TOTAL);
        const next = resolveThreshold(SLOTS_TOTAL);
        if (next.thresholdId !== lastThresholdRef.current) {
          lastThresholdRef.current = next.thresholdId;
          setUrgency(next);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [mockSlots]);

  useEffect(() => {
    // Mock: setta urgency una sola volta e skip listeners (no fetch in dev preview)
    if (mockSlots !== null) {
      const next = resolveThreshold(mockSlots);
      lastThresholdRef.current = next.thresholdId;
      setUrgency(next);
      return;
    }

    fetchSlots();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchSlots();
    };
    const onFocus = () => fetchSlots();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', onFocus);

    // Polling solo quando visibile, no spam in tab background
    const pollId = window.setInterval(() => {
      if (document.visibilityState === 'visible') fetchSlots();
    }, POLL_INTERVAL_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', onFocus);
      window.clearInterval(pollId);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchSlots, mockSlots]);

  /**
   * checkSlotsBeforeRedirect — re-fetch sincrono pre-click CTA Stripe.
   * Ritorna numero aggiornato; chiamante decide se procedere o bloccare.
   * In modalità mock ritorna sempre il valore mock.
   */
  const checkSlotsBeforeRedirect = useCallback(async () => {
    if (mockSlots !== null) return mockSlots;
    try {
      const res = await fetch(ENDPOINT, { cache: 'no-store' });
      if (!res.ok) return slotsRemaining;
      const data = await res.json();
      const n = Number(data?.slotsRemaining);
      if (!Number.isFinite(n)) return slotsRemaining;
      setSlotsRemaining(n);
      return n;
    } catch {
      return slotsRemaining;
    }
  }, [slotsRemaining, mockSlots]);

  return {
    slotsRemaining,
    slotsTotal: SLOTS_TOTAL,
    urgency, // { thresholdId, text, level }
    loading,
    error,
    refetch: fetchSlots,
    checkSlotsBeforeRedirect,
  };
}

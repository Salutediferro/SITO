import { useRef, useState } from 'react';
import { track } from '../../hooks/useGTM';
import { sendLead } from '../../services/api';
import { getSegment } from '../../constants/quiz';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-().]{7,}$/;

export default function ContactsStep({ quiz }) {
  const { state, setContact, togglePrivacy, toggleMarketing, goNext, goBack, setSent, score, scoreLevel, tags, suggestedPanels } = quiz;
  const [loading, setLoading] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const consentHealthRef = useRef(null);
  const c = state.a.contacts || {};
  const emailValid = !c.email || EMAIL_RE.test(c.email);
  const phoneValid = !c.phone || PHONE_RE.test(c.phone);
  const allOk = c.name && c.phone && c.email && state.privacy && EMAIL_RE.test(c.email) && PHONE_RE.test(c.phone);

  const handleNext = async () => {
    // Guida WCAG: se manca solo il consenso obbligatorio, focus + errore sr-friendly invece di no-op silenzioso
    if (c.name && c.phone && c.email && EMAIL_RE.test(c.email) && PHONE_RE.test(c.phone) && !state.privacy) {
      setConsentError(true);
      requestAnimationFrame(() => {
        if (consentHealthRef.current) consentHealthRef.current.focus();
      });
      return;
    }
    if (!allOk) return;
    setConsentError(false);

    if (!state.sent) {
      setLoading(true);
      setSent();

      const payload = {
        name: c.name || '', phone: c.phone || '', email: c.email || '', referral: state.a.referral || '',
        segment: getSegment(state.a) || '',
        sex: state.a.sex || '', age: state.a.age || '', training: state.a.training || '',
        pharma: state.a.pharma || '', energia: state.a.energia || '', sonno: state.a.sonno || '',
        libido: state.a.libido || '',
        ciclo: state.a.ciclo || '',
        grasso: state.a.grasso || '', pressione: state.a.pressione || '',
        assunzione: state.a.assunzione || [], analisi: state.a.analisi || '',
        tags, score, score_level: scoreLevel.level, score_name: scoreLevel.name,
        suggested_panels: suggestedPanels,
        // GDPR consensi (art. 9 obbligatorio per dati salute, art. 6.1.a marketing opzionale)
        consent_health: true, // sempre true qui (bloccante per submit)
        consent_marketing: !!state.marketingConsent,
        consent_timestamp: new Date().toISOString(),
      };

      track('quiz_submit', { has_referral: !!state.a.referral, referral: state.a.referral || '' });

      try {
        await sendLead(payload);
        track('quiz_submit_success', {});
      } catch (e) {
        track('quiz_submit_error', { error_type: e.message || 'network' });
      }

      try {
        const prev = JSON.parse(localStorage.getItem('sdf_leads') || '[]');
        prev.push({ ...payload, id: Date.now(), ts: new Date().toISOString() });
        localStorage.setItem('sdf_leads', JSON.stringify(prev));
      } catch (e) {}

      setLoading(false);
    }

    goNext();
  };

  return (
    <>
      <div className="q-label">I TUOI DATI</div>
      <div className="q-question">MOSTRAMI IL MIO<br />PROFILO DI FERRO</div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>
        Ti contatteremo per guidarti nel tuo percorso di analisi.
      </p>

      <div className="q-field">
        <label className="q-field-label">NOME E COGNOME</label>
        <input
          className="q-field-input"
          type="text"
          placeholder="Mario Rossi"
          value={c.name || ''}
          onChange={e => setContact('name', e.target.value)}
          onFocus={() => track('quiz_field_focus', { field_name: 'name' })}
          autoComplete="name"
        />
      </div>

      <div className="q-field">
        <label className="q-field-label">NUMERO DI TELEFONO</label>
        <input
          className={`q-field-input${c.phone && !phoneValid ? ' invalid' : ''}`}
          type="tel"
          placeholder="+39 333 123 4567"
          value={c.phone || ''}
          onChange={e => setContact('phone', e.target.value)}
          onFocus={() => track('quiz_field_focus', { field_name: 'phone' })}
          autoComplete="tel"
        />
        {c.phone && !phoneValid && <div className="q-field-error">Inserisci un numero di telefono valido</div>}
      </div>

      <div className="q-field">
        <label className="q-field-label">EMAIL</label>
        <input
          className={`q-field-input${c.email && !emailValid ? ' invalid' : ''}`}
          type="email"
          placeholder="nome@email.com"
          value={c.email || ''}
          onChange={e => setContact('email', e.target.value)}
          onFocus={() => track('quiz_field_focus', { field_name: 'email' })}
          autoComplete="email"
        />
        {c.email && !emailValid && <div className="q-field-error">Inserisci un'email valida</div>}
      </div>

      <div className="q-sep" />

      {/* Consensi GDPR · pattern native checkbox (WCAG 4.1.2 Name/Role/Value + 2.1.1 keyboard)
          - #1 obbligatorio: consenso esplicito art. 9 GDPR (dati salute)
          - #2 facoltativo: consenso art. 6.1.a (comunicazioni commerciali) */}
      <div className="q-consent-group">
        <div className={`q-consent-row${state.privacy ? ' on' : ''}${consentError ? ' error' : ''}`}>
          <input
            ref={consentHealthRef}
            id="consent-health"
            type="checkbox"
            className="q-consent-input"
            checked={state.privacy}
            onChange={() => { togglePrivacy(); if (consentError) setConsentError(false); }}
            aria-required="true"
            aria-invalid={consentError ? 'true' : 'false'}
            aria-describedby={consentError ? 'consent-health-error' : undefined}
          />
          <label htmlFor="consent-health" className="q-consent-label">
            <span className="q-consent-box" aria-hidden="true" />
            <span>
              Ho letto l&apos;
              <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                Informativa Privacy
              </a>
              {' '}e il{' '}
              <a href="/consenso-informato" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                Consenso Informato
              </a>
              {' '}e presto il mio consenso esplicito (art. 9 GDPR) al trattamento dei dati relativi alla salute per le finalit&agrave; di coordinamento e supporto non clinico.
            </span>
          </label>
        </div>
        {consentError && (
          <p id="consent-health-error" className="q-consent-error" role="alert">
            Per procedere &egrave; necessario prestare il consenso al trattamento dei dati relativi alla salute.
          </p>
        )}

        <div className={`q-consent-row${state.marketingConsent ? ' on' : ''}`}>
          <input
            id="consent-marketing"
            type="checkbox"
            className="q-consent-input"
            checked={!!state.marketingConsent}
            onChange={() => toggleMarketing()}
          />
          <label htmlFor="consent-marketing" className="q-consent-label">
            <span className="q-consent-box" aria-hidden="true" />
            <span>
              Acconsento all&apos;invio di comunicazioni commerciali, newsletter e informazioni
              promozionali sui servizi SDF (art. 6.1.a GDPR).
              <span className="q-consent-optional">facoltativo</span>
            </span>
          </label>
        </div>
      </div>

      <button
        className={`q-btn-primary${loading ? ' loading' : ''}`}
        id="quiz-cta"
        type="button"
        onClick={handleNext}
        disabled={!allOk || loading}
      >
        {loading ? <><span className="q-spinner" />INVIO IN CORSO...</> : 'AVANTI'}
      </button>
      <button className="q-btn-back" type="button" onClick={goBack}>
        \u2190 Torna indietro
      </button>
    </>
  );
}

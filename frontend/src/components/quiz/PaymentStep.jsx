import { useState, useEffect } from 'react';
import { isValidReferral } from '../../constants/quiz';
import { track } from '../../hooks/useGTM';
import { createCheckoutSession } from '../../services/api';

export default function PaymentStep({ quiz }) {
  const { state, setReferral, goBack } = quiz;
  const [loading, setLoading] = useState(false);

  const name = ((state.a.contacts || {}).name || '').split(' ')[0].toUpperCase();
  const referral = state.a.referral || '';
  const valid = referral && isValidReferral(referral);

  useEffect(() => {
    const elapsed = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
    track('quiz_complete', { total_time_seconds: elapsed });
  }, []);

  const handleCheckout = async (e) => {
    track('payment_click', {});
    setLoading(true);
    try {
      const email = (state.a.contacts || {}).email || '';
      const ref = valid ? referral : '';
      const data = await createCheckoutSession({ email, referral: ref });
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        alert('Errore durante il pagamento. Riprova.');
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert('Errore di connessione. Riprova.');
    }
  };

  const price = valid ? '42,30' : '47';

  return (
    <div>
      <div className="q-logo-wrap">
        <img src="/LOGO.png" alt="Salute di Ferro" className="q-logo-img" />
      </div>

      <div className="q-ty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="q-ty-h">
        {name ? <>{name},<br /></> : null}
        IL TUO PROFILO<br /><em>È PRONTO.</em>
      </div>

      <p className="q-ty-p">
        Abbiamo analizzato le tue risposte e identificato le aree da controllare. Ora il passo più importante: ricevere il tuo piano di analisi personalizzato.
      </p>

      <div style={{ margin: '28px 0', padding: 24, background: 'var(--bg-card)', borderRadius: 8, border: '1.5px solid var(--border)', textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4, color: 'var(--accent)', marginBottom: 12 }}>COSA INCLUDE LA CALL</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(22px, 4vw, 32px)', color: 'var(--text)', lineHeight: 1.2 }}>
            IL TUO PIANO DI ANALISI<br />PERSONALIZZATO
          </div>
        </div>

        <div style={{ marginBottom: 20, padding: '0 8px' }}>
          {[
            'Analisi completa del tuo profilo e delle tue risposte',
            'Piano personalizzato di analisi da fare',
            'Guida passo-passo su come procedere, senza sbatti',
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', marginBottom: 11 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: 'var(--accent)', minWidth: 22, lineHeight: 1.4 }}>
                0{i + 1}
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Referral */}
        <div style={{ margin: '16px 0 0', padding: '12px 16px', background: 'rgba(248,113,113,0.04)', border: '1px solid var(--border)', borderRadius: 8 }}>
          <label style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-sec)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            CODICE REFERRAL (opzionale)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Inserisci il codice"
              value={referral}
              onChange={e => setReferral(e.target.value)}
              style={{
                width: '100%', padding: '10px 36px 10px 12px',
                background: 'var(--bg-card)', border: `1px solid ${valid ? '#28a745' : referral ? '#F87171' : 'var(--border)'}`,
                borderRadius: 6, color: 'var(--text)', fontSize: 14,
                boxSizing: 'border-box', outline: 'none',
                boxShadow: valid ? '0 0 0 3px rgba(40,167,69,0.15)' : referral ? '0 0 0 3px rgba(248,113,113,0.1)' : 'none',
                transition: 'border-color .3s ease, box-shadow .3s ease',
              }}
              autoComplete="off"
            />
            {(valid || referral) && (
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                {valid ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                )}
              </span>
            )}
          </div>
          {valid && <div style={{ fontSize: 12, color: '#28a745', marginTop: 6 }}>&#10003; Sconto 10% applicato!</div>}
          {referral && !valid && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Codice non valido</div>}
        </div>

        {/* Price */}
        <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: 'var(--text)', lineHeight: 1 }}>
            {valid && <span style={{ textDecoration: 'line-through', color: 'var(--text-sec)', fontSize: 28 }}>47€</span>}
            {' '}{price}<span style={{ fontSize: 22, color: 'var(--text-sec)' }}> €</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 4 }}>Consulenza di 30 minuti</div>
        </div>

        <button
          className={`q-btn-primary${loading ? ' loading' : ''}`}
          style={{ marginTop: 16 }}
          onClick={handleCheckout}
        >
          {loading ? <><span className="q-spinner" />REINDIRIZZAMENTO...</> : `PRENOTA LA TUA CALL · ${price}€`}
        </button>

        {/* Garanzia */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, padding: '10px 16px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
          </svg>
          <span style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.3 }}>
            Garanzia soddisfatti o rimborsati. Se la call non ti è utile, ti rimborsiamo.
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, margin: '20px 0', flexWrap: 'wrap' }}>
        {[
          { n: '500+', l: 'Atleti seguiti' },
          { n: '30 min', l: 'Call dedicata' },
          { n: '100%', l: 'Personalizzato' },
        ].map(s => (
          <div key={s.n} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: 'var(--accent)' }}>{s.n}</div>
            <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>{s.l}</div>
          </div>
        ))}
      </div>

      <button className="q-btn-back" type="button" onClick={() => { track('payment_back_to_results', {}); goBack(); }}>
        ← Torna ai risultati
      </button>
    </div>
  );
}

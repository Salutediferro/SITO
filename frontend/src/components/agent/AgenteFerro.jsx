import { useState, useRef, useEffect } from 'react';
import AgenteAvatar from './AgenteAvatar';
import './agente.css';

/**
 * AgenteFerro — chat UI bozza MVP
 *
 * Funzioni:
 *  - Conversazione con Worker /ask (Claude API)
 *  - Stati avatar: idle → listening → thinking → speaking → idle
 *  - Disclaimer fisso UE AI Act
 *  - Suggested questions iniziali
 *  - Conversazione in-memory (no persistence per privacy MVP)
 *  - aria-live per screen reader
 *  - Rate limit handling lato UI
 *
 * Endpoint: https://form.salutediferro.com/ask  (POST { messages: [{role, content}] })
 */

const API_URL = 'https://form.salutediferro.com/ask';

const SUGGESTED_QUESTIONS = [
  'Cosa è Salute di Ferro?',
  'Quanto costa la membership?',
  'Come funziona la consulenza?',
  'Che pannello di analisi mi serve?',
  'Posso fidarmi del Coach?',
];

const INITIAL_GREETING = "Sono l'Agente di Ferro. Non sono un medico, sono un assistente AI di Salute di Ferro. Posso spiegarti il servizio, i prezzi, come funziona il percorso. Cosa vuoi sapere?";

export default function AgenteFerro() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: INITIAL_GREETING },
  ]);
  const [input, setInput] = useState('');
  const [avatarState, setAvatarState] = useState('idle');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const listEndRef = useRef(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isBusy = avatarState === 'thinking' || avatarState === 'speaking';

  async function send(textOverride) {
    const text = (textOverride ?? input).trim();
    if (!text || isBusy) return;

    setError('');
    const userMsg = { role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setAvatarState('thinking');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (res.status === 429) {
        setError('Troppe domande in poco tempo. Aspetta un minuto e riprova.');
        setAvatarState('idle');
        return;
      }
      if (res.status === 503) {
        setError("L'agente non è ancora attivo lato server. Riprova più tardi.");
        setAvatarState('idle');
        return;
      }
      if (!res.ok) {
        setError('Errore di comunicazione. Riprova fra poco.');
        setAvatarState('idle');
        return;
      }

      const data = await res.json();
      const reply = (data?.content || '').trim() || 'Mi dispiace, non sono riuscito a rispondere. Riprova.';

      setAvatarState('speaking');
      setMessages([...newHistory, { role: 'assistant', content: reply }]);

      // simulazione "speaking" per la durata stimata della lettura
      const speakingMs = Math.min(3500, Math.max(1500, reply.length * 35));
      setTimeout(() => setAvatarState('idle'), speakingMs);
    } catch (e) {
      setError('Connessione fallita. Controlla la rete e riprova.');
      setAvatarState('idle');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function handleInputFocus() {
    if (avatarState === 'idle') setAvatarState('listening');
  }
  function handleInputBlur() {
    if (avatarState === 'listening') setAvatarState('idle');
  }

  return (
    <div className="agente-page">
      <div className="agente-test-banner" role="status">
        <strong>MODALITÀ TEST</strong> · L'Agente di Ferro è in fase di prova interna · Questa pagina non è linkata pubblicamente.
      </div>

      <header className="agente-header">
        <AgenteAvatar state={avatarState} size={140} />
        <span className="agente-ai-badge" aria-label="Indicatore intelligenza artificiale">AI</span>
        <h1 className="agente-name">L'AGENTE <em>DI FERRO</em></h1>
        <p className="agente-tagline">Assistente virtuale di Salute di Ferro</p>
      </header>

      <main className="agente-chat-wrap">
        <div className="agente-disclaimer">
          <strong>Importante.</strong> Sono un'intelligenza artificiale, non un medico. Le mie risposte sono indicative e non sostituiscono la consulenza con un professionista. Per un piano personalizzato sui tuoi valori serve la chiamata con il Coach di Ferro dopo il test guidato.
        </div>

        <ol
          className="agente-messages"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((m, i) => (
            <li
              key={i}
              className={`agente-msg agente-msg-${m.role}`}
              aria-label={m.role === 'user' ? 'Tuo messaggio' : 'Risposta Agente di Ferro'}
            >
              {m.content}
            </li>
          ))}
          {avatarState === 'thinking' && (
            <li className="agente-msg agente-msg-assistant" aria-label="Sto pensando">
              <span className="agente-thinking-dots" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
            </li>
          )}
          {error && (
            <li className="agente-msg agente-msg-error" role="alert">
              {error}
            </li>
          )}
          <li ref={listEndRef} aria-hidden="true" />
        </ol>

        {messages.length <= 1 && (
          <div className="agente-suggestions" role="list" aria-label="Domande suggerite">
            {SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q}
                type="button"
                className="agente-suggestion-chip"
                onClick={() => send(q)}
                role="listitem"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form
          className="agente-input-area"
          onSubmit={(e) => { e.preventDefault(); send(); }}
          aria-label="Scrivi una domanda all'Agente di Ferro"
        >
          <label htmlFor="agente-input-textarea" className="sr-only" style={{
            position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
            overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
          }}>
            Scrivi qui la tua domanda
          </label>
          <textarea
            id="agente-input-textarea"
            ref={inputRef}
            className="agente-input"
            placeholder="Chiedi qualcosa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={isBusy}
            rows={1}
            maxLength={2000}
            autoComplete="off"
          />
          <button
            type="submit"
            className="agente-send"
            disabled={!input.trim() || isBusy}
            aria-label="Invia messaggio"
          >
            INVIA
          </button>
        </form>
      </main>
    </div>
  );
}

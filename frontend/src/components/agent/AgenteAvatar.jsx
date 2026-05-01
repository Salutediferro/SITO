/**
 * AgenteAvatar — bozza SVG/CSS DIY · 4 stati animati
 *
 * Stati:
 *  - idle      → respira lentamente (pulsazione opacità + scale leggera)
 *  - listening → leggera inclinazione + occhi che brillano (utente sta digitando)
 *  - thinking  → glow rosso pulsante intenso (Claude API processa)
 *  - speaking  → mascella/bocca anima in sync col testo che appare
 *
 * Design: silhouette stilizzata "guerriero/atleta" con elmo astratto,
 * petto ampio, accent rossi sul logo SDF al centro del petto.
 *
 * Accessibilità:
 *  - role="img" + aria-label dinamico per stato
 *  - prefers-reduced-motion: stop animazioni, mantiene presenza visiva
 *  - text alternatives via aria-live nel parent (AgenteFerro)
 */
export default function AgenteAvatar({ state = 'idle', size = 120 }) {
  const labelByState = {
    idle: 'Agente di Ferro in attesa',
    listening: 'Agente di Ferro in ascolto',
    thinking: 'Agente di Ferro sta elaborando la risposta',
    speaking: 'Agente di Ferro sta rispondendo',
  };

  return (
    <div
      className={`agente-avatar agente-avatar-${state}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={labelByState[state]}
      aria-live="polite"
    >
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        aria-hidden="true"
      >
        {/* glow esterno — più intenso quando thinking */}
        <defs>
          <radialGradient id="agente-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EC4757" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#EC4757" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#EC4757" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="agente-armor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2C2C30" />
            <stop offset="100%" stopColor="#0A0A0C" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="58" fill="url(#agente-glow)" className="agente-halo" />

        {/* corpo / armatura */}
        <path
          d="M30 100 Q30 70 45 60 Q50 56 60 56 Q70 56 75 60 Q90 70 90 100 Z"
          fill="url(#agente-armor)"
          stroke="#1F1F23"
          strokeWidth="1.5"
        />

        {/* logo SDF centrale (semplificato — caduceo stilizzato) */}
        <g className="agente-chest" transform="translate(60 78)">
          <circle r="9" fill="#1A1A1A" stroke="#EC4757" strokeWidth="1.2" />
          <path
            d="M -3 -5 Q 0 0 -3 5 M 3 -5 Q 0 0 3 5 M 0 -7 L 0 7"
            stroke="#EC4757"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* testa / elmo */}
        <ellipse
          cx="60"
          cy="38"
          rx="18"
          ry="20"
          fill="url(#agente-armor)"
          stroke="#1F1F23"
          strokeWidth="1.5"
          className="agente-head"
        />

        {/* visiera */}
        <rect x="44" y="34" width="32" height="3" fill="#0A0A0C" rx="1" />

        {/* occhi (rosso quando active) */}
        <circle cx="53" cy="40" r="2" fill="#EC4757" className="agente-eye" />
        <circle cx="67" cy="40" r="2" fill="#EC4757" className="agente-eye" />

        {/* "bocca" — linea che si anima quando speaking */}
        <line
          x1="55"
          y1="48"
          x2="65"
          y2="48"
          stroke="#EC4757"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
          className="agente-mouth"
        />

        {/* spalle / pauldron destro */}
        <path
          d="M 78 64 Q 95 65 95 76 L 90 78 Q 88 68 78 68 Z"
          fill="#1F1F23"
          stroke="#0A0A0C"
          strokeWidth="1"
        />
        {/* spalle / pauldron sinistro */}
        <path
          d="M 42 64 Q 25 65 25 76 L 30 78 Q 32 68 42 68 Z"
          fill="#1F1F23"
          stroke="#0A0A0C"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

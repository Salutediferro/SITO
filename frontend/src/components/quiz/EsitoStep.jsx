import { TAG_INFO } from '../../constants/hashtags';
import { track } from '../../hooks/useGTM';

export default function EsitoStep({ quiz }) {
  const { scoreLevel, tags, goNext } = quiz;

  const handleCta = () => {
    track('quiz_esito_cta_click', {});
    goNext();
  };

  const displayTags = tags.length > 0 ? tags : ['checkup'];

  return (
    <div>
      <div className="q-logo-wrap">
        <img src="/LOGO.png" alt="Salute di Ferro" className="q-logo-img" />
      </div>

      <div className="q-esito-label">IL TUO PROFILO METABOLICO</div>
      <div className="q-esito-heading">{scoreLevel.name}</div>

      <div className="q-score-gauge">
        <div className="q-score-number">
          {scoreLevel.level}<span className="q-score-max">/5</span>
        </div>
        <div className="q-score-dots">
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className={`q-score-dot${i <= scoreLevel.level ? ' active' : ''}`}
              style={{ animationDelay: `${i * 0.1 + 0.8}s` }}
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      <p style={{
        fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7,
        textAlign: 'center', margin: '0 auto 20px', maxWidth: 480, fontWeight: 300,
      }}>
        {scoreLevel.desc}
      </p>

      <p style={{
        fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
        textAlign: 'center', margin: '0 auto 28px', maxWidth: 460,
        fontStyle: 'italic',
      }}>
        {scoreLevel.msg}
      </p>

      <div className="q-esito-label" style={{ marginTop: 28, animationDelay: '1.2s' }}>
        MARKER DA CONTROLLARE
      </div>

      <div className="q-tags-grid" style={{ marginTop: 12 }}>
        {displayTags.map((t, i) => {
          const info = TAG_INFO[t];
          const name = info ? info.name : '#CHECK\u2011UP COMPLETO';
          return (
            <span key={t} className="q-tag-badge" style={{ animationDelay: `${i * 0.12 + 1.4}s` }}>
              <span className="q-tag-dot" style={{ animationDelay: `${i * 0.12 + 1.8}s` }} />
              <span className="q-tag-name">{name}</span>
            </span>
          );
        })}
      </div>

      <button
        className="q-btn-primary"
        type="button"
        onClick={handleCta}
      >
        SCOPRI LE ANALISI CONSIGLIATE
      </button>
    </div>
  );
}

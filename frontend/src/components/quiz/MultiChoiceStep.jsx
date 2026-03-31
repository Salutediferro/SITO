export default function MultiChoiceStep({ quiz }) {
  const { state, currentStep, pick, goNext, goBack, getShuffledOpts } = quiz;
  const sel = Array.isArray(state.a[currentStep.k]) ? state.a[currentStep.k] : [];
  const opts = getShuffledOpts(currentStep);

  return (
    <>
      <div className="q-label">{currentStep.label}</div>
      <div className="q-question" dangerouslySetInnerHTML={{ __html: currentStep.q.replace('\n', '<br />') }} />
      {currentStep.hint && <div className="q-hint">{currentStep.hint}</div>}

      <div className="q-options">
        {opts.map(o => (
          <button
            key={o.k}
            type="button"
            className={`q-opt multi${sel.includes(o.k) ? ' sel' : ''}`}
            onClick={() => pick(currentStep.k, o.k, true)}
          >
            <span className="txt">{o.v}</span>
            <span className="q-indicator" />
          </button>
        ))}
      </div>

      <button
        className="q-btn-primary"
        id="quiz-cta"
        type="button"
        onClick={goNext}
        disabled={sel.length === 0}
      >
        AVANTI
      </button>
      <button className="q-btn-back" type="button" onClick={goBack}>
        ← Torna indietro
      </button>
    </>
  );
}

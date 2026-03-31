export default function IntroStep({ quiz }) {
  return (
    <>
      <div className="q-logo-wrap">
        <img src="/LOGO.png" alt="Salute di Ferro" className="q-logo-img" />
      </div>
      <h1 className="q-h1">SCOPRI IL TUO<br /><em>PROFILO METABOLICO</em></h1>
      <p className="q-intro-p">
        15 domande per capire il tuo stato di salute. Ci vogliono solo 2 minuti.
      </p>
      <button className="q-btn-primary" type="button" onClick={quiz.startQuiz}>
        INIZIA IL TEST
      </button>
      <div className="q-stats">
        <div className="q-stat"><div className="q-stat-n">72H</div><div className="q-stat-l">Max per i tuoi esami</div></div>
        <div className="q-stat"><div className="q-stat-n">100%</div><div className="q-stat-l">Medici ENORMI</div></div>
        <div className="q-stat"><div className="q-stat-n">ZERO</div><div className="q-stat-l">Sbatti per te</div></div>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
        Pochi dettagli e partiamo
      </p>
    </>
  );
}

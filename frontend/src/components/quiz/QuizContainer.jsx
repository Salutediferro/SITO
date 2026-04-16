import { useEffect } from 'react';
import useQuiz from '../../hooks/useQuiz';
import IntroStep from './IntroStep';
import ContactsStep from './ContactsStep';
import SingleChoiceStep from './SingleChoiceStep';
import MultiChoiceStep from './MultiChoiceStep';
import EsitoStep from './EsitoStep';
import PaymentStep from './PaymentStep';
import './quiz.css';

export default function QuizContainer() {
  const quiz = useQuiz();
  const { state, currentStep, progressPct, stepNum } = quiz;

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Enter') return;
      const step = currentStep;
      if (step.t === 'single' || step.t === 'multi' || step.t === 'contacts') {
        const btn = document.getElementById('quiz-cta');
        if (btn && !btn.disabled) btn.click();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [currentStep]);

  const showCounter = state.step > 0 && currentStep.t !== 'contacts' && currentStep.t !== 'esito' && currentStep.t !== 'payment' && currentStep.t !== 'intro';

  let content;
  switch (currentStep.t) {
    case 'intro': content = <IntroStep quiz={quiz} />; break;
    case 'single': content = <SingleChoiceStep quiz={quiz} />; break;
    case 'multi': content = <MultiChoiceStep quiz={quiz} />; break;
    case 'esito': content = <EsitoStep quiz={quiz} />; break;
    case 'contacts': content = <ContactsStep quiz={quiz} />; break;
    case 'payment': content = <PaymentStep quiz={quiz} />; break;
    default: content = null;
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-bar-track">
        <div className="quiz-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>
      {showCounter && (
        <div className="quiz-counter">
          STEP <b>{stepNum}</b> / <b>11</b>
        </div>
      )}
      <div className="quiz-center">
        <div className="quiz-card" key={state.step}>
          {content}
        </div>
      </div>
    </div>
  );
}

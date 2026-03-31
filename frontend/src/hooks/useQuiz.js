import { useReducer, useCallback, useRef, useEffect } from 'react';
import { getSteps, getSegment, TOTAL_QUESTIONS } from '../constants/quiz';
import { computeScore, getScoreLevel, computePanelScores, getSuggestedPanels } from '../constants/scoring';
import { computeTags } from '../constants/hashtags';
import { track, getUTM } from './useGTM';

const STORAGE_KEY = 'sdf_state';

function loadState() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const p = JSON.parse(saved);
      if (p && typeof p.step === 'number') return p;
    }
  } catch (e) {}
  return { step: 0, a: {}, privacy: false, sent: false, startTime: null, stepStartTime: null };
}

function saveState(state) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function reducer(state, action) {
  let next;
  switch (action.type) {
    case 'GO_TO':
      next = { ...state, step: action.step, stepStartTime: Date.now() };
      break;
    case 'SET_ANSWER':
      next = { ...state, a: { ...state.a, [action.key]: action.value } };
      break;
    case 'SET_CONTACT':
      next = { ...state, a: { ...state.a, contacts: { ...(state.a.contacts || {}), [action.field]: action.value } } };
      break;
    case 'SET_REFERRAL':
      next = { ...state, a: { ...state.a, referral: action.value } };
      break;
    case 'TOGGLE_PRIVACY':
      next = { ...state, privacy: !state.privacy };
      break;
    case 'SET_SENT':
      next = { ...state, sent: true };
      break;
    case 'SET_START_TIME':
      next = { ...state, startTime: Date.now() };
      break;
    default:
      return state;
  }
  saveState(next);
  return next;
}

export default function useQuiz() {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  const shuffledRef = useRef({});

  const steps = getSteps(state.a);
  const currentStep = steps[state.step] || steps[0];
  const segment = getSegment(state.a);
  const score = computeScore(state.a);
  const scoreLevel = getScoreLevel(score);
  const tags = computeTags(state.a, scoreLevel);
  const panelScores = computePanelScores(state.a);
  const suggestedPanels = getSuggestedPanels(panelScores);

  // Progress: intro=0, questions 1-15 = 2%-90%, esito=92%, contacts=96%, payment=100%
  let progressPct = 0;
  let stepNum = null;
  if (state.step === 0) {
    progressPct = 0;
  } else if (currentStep.t === 'esito') {
    progressPct = 92;
  } else if (currentStep.t === 'contacts') {
    progressPct = 96;
  } else if (currentStep.t === 'payment') {
    progressPct = 100;
  } else if (currentStep.label) {
    const num = parseInt(currentStep.label.replace('STEP ', ''));
    stepNum = num;
    progressPct = Math.round((num / TOTAL_QUESTIONS) * 90);
  }

  // Shuffle options (cached per step key)
  const getShuffledOpts = useCallback((step) => {
    if (!shuffledRef.current[step.k]) {
      const arr = step.opts.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      shuffledRef.current[step.k] = arr;
    }
    return shuffledRef.current[step.k];
  }, []);

  const go = useCallback((n, fromPop = false) => {
    if (n < 0 || n >= steps.length) return;
    dispatch({ type: 'GO_TO', step: n });
    if (!fromPop) {
      window.history.pushState({ step: n }, '', '');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [steps.length]);

  const goNext = useCallback(() => {
    const step = steps[state.step];
    if (state.stepStartTime) {
      track('quiz_step_time', { step_name: step.k || step.t, step_number: state.step, time_seconds: Math.round((Date.now() - state.stepStartTime) / 1000) });
    }
    track('quiz_step_complete', { step_number: state.step, step_name: step.k || step.t, answer: state.a[step.k] || '' });
    if (step.k === 'sex') track('quiz_segment_assigned', { segment: getSegment(state.a) });
    go(state.step + 1);
  }, [state.step, state.stepStartTime, state.a, steps, go]);

  const goBack = useCallback(() => {
    track('quiz_step_back', { from_step: state.step, to_step: state.step - 1 });
    go(state.step - 1);
  }, [state.step, go]);

  const startQuiz = useCallback(() => {
    dispatch({ type: 'SET_START_TIME' });
    track('quiz_start', {});
    go(1);
  }, [go]);

  const pick = useCallback((key, val, isMulti) => {
    if (isMulti) {
      const step = steps[state.step];
      const exclusiveKeys = (step.opts || []).filter(o => o.exclusive).map(o => o.k);
      const isExclusive = exclusiveKeys.includes(val);
      let cur = Array.isArray(state.a[key]) ? state.a[key] : [];
      let newVal;
      if (isExclusive) {
        newVal = cur.includes(val) ? [] : [val];
      } else {
        cur = cur.filter(v => !exclusiveKeys.includes(v));
        newVal = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      }
      dispatch({ type: 'SET_ANSWER', key, value: newVal });
    } else {
      dispatch({ type: 'SET_ANSWER', key, value: val });
    }
    const step = steps[state.step];
    const optObj = step.opts?.find(o => o.k === val);
    track('quiz_option_select', { step_number: state.step, step_name: key, option_key: val, option_value: optObj ? optObj.v : val });
  }, [state.a, state.step, steps]);

  const setContact = useCallback((field, value) => {
    dispatch({ type: 'SET_CONTACT', field, value: value.trim() });
  }, []);

  const togglePrivacy = useCallback(() => {
    dispatch({ type: 'TOGGLE_PRIVACY' });
  }, []);

  const setReferral = useCallback((value) => {
    dispatch({ type: 'SET_REFERRAL', value: value.trim() });
  }, []);

  const setSent = useCallback(() => {
    dispatch({ type: 'SET_SENT' });
  }, []);

  // Track step view
  useEffect(() => {
    const step = currentStep;
    if (step.t === 'intro') {
      track('quiz_intro_view', getUTM());
    } else if (step.t === 'payment') {
      track('payment_view', {});
    } else {
      track('quiz_step_view', { step_number: state.step, step_name: step.k || step.t });
    }
  }, [state.step]);

  // Browser history
  useEffect(() => {
    const onPopState = (e) => {
      if (e.state && typeof e.state.step === 'number') {
        go(e.state.step, true);
      } else {
        go(0, true);
      }
    };
    window.addEventListener('popstate', onPopState);

    if (state.step > 0) {
      window.history.replaceState({ step: 0 }, '', '');
      for (let i = 1; i <= state.step; i++) {
        window.history.pushState({ step: i }, '', '');
      }
    } else {
      window.history.replaceState({ step: 0 }, '', '');
    }

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Abandon tracking
  useEffect(() => {
    const onBeforeUnload = () => {
      if (state.step > 0 && state.step < steps.length - 1) {
        const elapsed = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
        track('quiz_abandon', { last_step: state.step, time_on_page: elapsed });
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [state.step, state.startTime, steps.length]);

  return {
    state, steps, currentStep, segment, score, scoreLevel, tags,
    panelScores, suggestedPanels,
    progressPct, stepNum,
    go, goNext, goBack, startQuiz, pick,
    setContact, togglePrivacy, setReferral, setSent,
    getShuffledOpts, dispatch,
  };
}

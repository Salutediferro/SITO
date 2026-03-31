/* ──────────────────────────────────────────
   Scoring v2 — Profilo salute + Pannelli add-on
   ────────────────────────────────────────── */

/* ── 1. PROFILO SALUTE (punteggio 1-5) ── */
export const PROFILE_SCORE_RULES = {
  analisi:   { '6m': 3, '6-12m': 2, '12m+': 1, mai: 0 },
  sonno:     { molto_bene: 2, abbastanza: 1, disturbato: 0, pessimo: -1 },
  pressione: { bassa: 1, normale: 2, legg_alta: -1, alta: -1, non_so: 0 },
  energia:   { molto_energico: 2, normale: 1, a_volte_stanco: 0, sempre_stanco: -1 },
  pharma:    { mai: 1, passato: 0, attuale: -1, no_risposta: 0 },
};

export const SCORE_LEVELS = [
  { min: -99, max: 2, level: 1, name: 'IL KAMIKAZE DELLA PALESTRA',
    desc: 'Ti alleni duro ma la tua salute la controlli pi\u00f9 o meno come controlli le calorie a Natale.',
    msg: 'Prima di pensare al prossimo PR in palestra, forse \u00e8 il caso di dare un\u2019occhiata a cosa succede dentro il tuo corpo.',
    tags: ['checkup', 'prevenzione', 'cuore', 'metabolismo'] },
  { min: 3, max: 5, level: 2, name: 'IL BODYBUILDER SPERICOLATO',
    desc: 'Ti alleni seriamente, ma la salute la controlli solo quando qualcosa non va.',
    msg: 'Il motore gira, ma non lo stai controllando abbastanza spesso.',
    tags: ['ormoni', 'recupero', 'fegato', 'stress'] },
  { min: 6, max: 8, level: 3, name: 'IL BODYBUILDER SEMI-PROFESSIONISTA',
    desc: 'Hai capito che monitorare la salute \u00e8 importante, ma non sei ancora completamente sistematico.',
    msg: 'Sei sulla strada giusta. Con qualche controllo in pi\u00f9 puoi ottimizzare davvero le performance.',
    tags: ['testosterone', 'cuore', 'performance'] },
  { min: 9, max: 11, level: 4, name: 'ATLETA CONSAPEVOLE',
    desc: 'Sai che la salute \u00e8 parte della performance e monitori il tuo corpo con una certa regolarit\u00e0.',
    msg: 'Sei tra quelli che capiscono che la vera forza \u00e8 anche sapere cosa succede dentro il proprio corpo.',
    tags: ['performance', 'prevenzione', 'monitoraggio'] },
  { min: 12, max: 99, level: 5, name: 'SALUTE DI FERRO',
    desc: 'Monitori regolarmente i tuoi parametri e tratti il tuo corpo come una macchina da gara.',
    msg: 'Non lasci nulla al caso. Questo \u00e8 il livello a cui ogni atleta dovrebbe arrivare.',
    tags: ['salutediferro', 'monitoraggio', 'performance'] },
];

export function computeScore(answers) {
  let total = 0;
  for (const [key, rules] of Object.entries(PROFILE_SCORE_RULES)) {
    const val = answers[key];
    if (val && rules[val] !== undefined) total += rules[val];
  }
  return Math.max(0, total);
}

export function getScoreLevel(score) {
  for (const lvl of SCORE_LEVELS) {
    if (score >= lvl.min && score <= lvl.max) return lvl;
  }
  return SCORE_LEVELS[0];
}

/* ── 2. PANNELLI ADD-ON SCORING (da XLSX FORM SCORING - 15) ── */
const PANEL_IDS = ['androgeno', 'cuore', 'reni', 'fegato', 'metabolico', 'tiroide', 'recovery', 'donna'];

// [ANDROGENO, CUORE, RENI, FEGATO, METABOLICO, TIROIDE, RECOVERY, DONNA]
const PANEL_RULES = {
  age: {
    'u30':   [0, 0, 0, 0, 0, 0, 0, 0],
    '30-39': [0, 1, 0, 0, 0, 0, 0, 0],
    '40-49': [1, 2, 0, 0, 1, 0, 0, 0], // +3 donna if sex=F (handled in compute)
    '50+':   [1, 2, 0, 0, 2, 1, 0, 0], // +3 donna if sex=F
  },
  training: {
    none:      [0, 0, 0, 0, 0, 0, 0, 0],
    '2-3':     [0, 0, 0, 0, 0, 0, 0, 0],
    '4+':      [0, 0, 0, 0, 0, 0, 1, 0],
    agonista:  [0, 0, 1, 0, 0, 0, 2, 0],
  },
  pharma: {
    mai:        [0, 0, 0, 0, 0, 0, 0, 0],
    passato:    [3, 2, 0, 2, 0, 0, 0, 0],
    attuale:    [3, 2, 3, 3, 0, 0, 0, 0],
    no_risposta:[0, 0, 0, 0, 0, 0, 0, 0],
  },
  energia: {
    molto_energico: [0, 0, 0, 0, 0, 0, 0, 0],
    normale:        [0, 0, 0, 0, 0, 0, 0, 0],
    a_volte_stanco: [0, 0, 0, 0, 0, 2, 2, 0],
    sempre_stanco:  [0, 0, 0, 0, 0, 3, 3, 0],
  },
  sonno: {
    molto_bene: [0, 0, 0, 0, 0, 0, 0, 0],
    abbastanza: [0, 0, 0, 0, 0, 0, 0, 0],
    disturbato: [0, 0, 0, 0, 0, 0, 2, 0],
    pessimo:    [0, 0, 0, 0, 0, 0, 3, 0],
  },
  recupero: {
    veloce:        [0, 0, 0, 0, 0, 0, 0, 0],
    normale:       [0, 0, 0, 0, 0, 0, 0, 0],
    lento:         [0, 0, 0, 0, 0, 0, 2, 0],
    non_recupero:  [0, 0, 1, 0, 0, 0, 3, 0],
  },
  // Male-only
  libido: {
    molto_alta:  [0, 0, 0, 0, 0, 0, 0, 0],
    normale:     [0, 0, 0, 0, 0, 0, 0, 0],
    bassa:       [2, 0, 0, 0, 0, 0, 0, 0],
    molto_bassa: [3, 0, 0, 0, 0, 0, 0, 0],
  },
  performance_sex: {
    ottima:  [0, 0, 0, 0, 0, 0, 0, 0],
    normale: [0, 0, 0, 0, 0, 0, 0, 0],
    in_calo: [2, 0, 0, 0, 0, 0, 0, 0],
    pessima: [3, 0, 0, 0, 0, 0, 0, 0],
  },
  // Female-only
  ciclo: {
    regolare:         [0, 0, 0, 0, 0, 0, 0, 0],
    legg_irregolare:  [0, 0, 0, 0, 0, 0, 0, 0],
    molto_irregolare: [0, 0, 0, 0, 0, 0, 0, 3],
    no_ciclo:         [0, 0, 0, 0, 0, 0, 3, 3],
  },
  energia_ciclo: {
    elevata:    [0, 0, 0, 0, 0, 0, 0, 0],
    accettabile:[0, 0, 0, 0, 0, 0, 0, 0],
    bassa:      [0, 0, 0, 0, 0, 2, 2, 0],
    molto_bassa:[0, 0, 0, 0, 0, 3, 3, 0],
  },
  grasso: {
    no:       [0, 0, 0, 0, 0, 0, 0, 0],
    fatica:   [0, 0, 0, 0, 2, 1, 0, 0],
    accumulo: [0, 0, 0, 0, 3, 2, 0, 0],
  },
  fame: {
    normale:       [0, 0, 0, 0, 0, 0, 0, 0],
    bassa:         [0, 0, 0, 0, 2, 0, 0, 0],
    zuccheri:      [0, 0, 0, 0, 2, 0, 0, 0],
    incontrollata: [0, 0, 0, 0, 3, 0, 0, 0],
  },
  pressione: {
    non_so:    [0, 0, 0, 0, 0, 0, 0, 0],
    bassa:     [0, 0, 0, 0, 0, 0, 0, 0],
    normale:   [0, 0, 0, 0, 0, 0, 0, 0],
    legg_alta: [0, 2, 1, 0, 0, 0, 0, 0],
    alta:      [0, 3, 3, 0, 0, 0, 0, 0],
  },
  colesterolo: {
    non_so:  [0, 0, 0, 0, 0, 0, 0, 0],
    normale: [0, 0, 0, 0, 0, 0, 0, 0],
    alto:    [0, 3, 0, 3, 0, 0, 0, 0],
  },
  analisi: {
    '6m':   [0, 0, 0, 0, 0, 0, 0, 0],
    '6-12m':[0, 0, 0, 0, 0, 0, 0, 0],
    '12m+': [0, 0, 0, 0, 0, 0, 0, 0],
    mai:    [0, 0, 0, 0, 0, 0, 0, 0], // +2 conditional (handled below)
  },
};

// Multi-choice: assunzione
const ASSUNZIONE_SCORES = {
  nulla:       [0, 0, 0, 0, 0, 0, 0, 0],
  integratori: [0, 0, 1, 0, 0, 0, 0, 0],
  farmaci:     [0, 3, 3, 3, 0, 0, 0, 0],
  alcol:       [0, 0, 0, 3, 0, 0, 0, 0],
};

export function computePanelScores(answers) {
  const scores = {};
  PANEL_IDS.forEach(id => { scores[id] = 0; });

  // Single-choice questions
  for (const [key, rules] of Object.entries(PANEL_RULES)) {
    const val = answers[key];
    if (!val || !rules[val]) continue;
    const pts = rules[val];
    PANEL_IDS.forEach((id, i) => { scores[id] += pts[i]; });
  }

  // Multi-choice: assunzione
  const assunzione = answers.assunzione;
  if (Array.isArray(assunzione)) {
    assunzione.forEach(val => {
      const pts = ASSUNZIONE_SCORES[val];
      if (pts) PANEL_IDS.forEach((id, i) => { scores[id] += pts[i]; });
    });
  }

  // Special cases
  const sex = answers.sex;
  const age = answers.age;
  if (sex === 'F' && (age === '40-49' || age === '50+')) {
    scores.donna += 3;
  }
  if (answers.analisi === 'mai') {
    if (sex === 'M') scores.androgeno += 2;
    if (sex === 'F') scores.donna += 2;
  }

  return scores;
}

export function getSuggestedPanels(panelScores) {
  const threshold = 3;
  const suggested = PANEL_IDS
    .filter(id => panelScores[id] >= threshold)
    .sort((a, b) => panelScores[b] - panelScores[a]);
  return suggested.slice(0, 3);
}

export function shouldTriggerCoach(panelScores) {
  const highScorePanels = PANEL_IDS.filter(id => panelScores[id] >= 3);
  return highScorePanels.length >= 3;
}

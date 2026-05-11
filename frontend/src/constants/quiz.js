/* ──────────────────────────────────────────
   Salute di Ferro — Quiz 11 domande v3
   ────────────────────────────────────────── */

export const VALID_REFERRALS = ['BARBARA', 'ANGELO', 'MARCO', 'SPCREW', 'SPCREWTOP'];

export function isValidReferral(code) {
  return VALID_REFERRALS.includes((code || '').toUpperCase().trim());
}

export const TOTAL_QUESTIONS = 11;

/* ── 1. Profilazione iniziale (Q1-Q3) ── */
const COMMON_START = [
  { t: 'single', k: 'sex', label: 'STEP 1',
    q: 'QUAL \u00c8 IL TUO SESSO?',
    hint: 'Se alzi meno della tua anima gemella abbiamo un problema. Oppure \u00e8 il nostro prossimo cliente.',
    opts: [{ k:'M', v:'Uomo' }, { k:'F', v:'Donna' }] },
  { t: 'single', k: 'age', label: 'STEP 2',
    q: 'QUAL \u00c8 LA TUA FASCIA D\u2019ET\u00c0?',
    hint: 'Non \u00e8 mai troppo tardi per spostare il FERRO.',
    opts: [{ k:'u30', v:'under 30' }, { k:'30-39', v:'30 - 39' }, { k:'40-49', v:'40 - 49' }, { k:'50+', v:'over 50' }] },
  { t: 'single', k: 'training', label: 'STEP 3',
    q: 'QUANTO TI ALLENI ATTUALMENTE?',
    hint: 'Se fai gambe sulla spin bike chiudi subito.',
    opts: [{ k:'none', v:'Non mi alleno' }, { k:'2-3', v:'2-3 allenamenti a settimana' }, { k:'4+', v:'4 o più a settimana' }, { k:'agonista', v:'Sono un atleta agonista' }] },
];

/* ── 2. Classificazione utilizzo sostanze (Q4) ── */
const SOSTANZE = [
  { t: 'single', k: 'pharma', label: 'STEP 4',
    q: 'UTILIZZI O HAI UTILIZZATO FARMACI/DOPING/ANABOLIZZANTI?',
    hint: 'Qui non si giudica, ma si aiuta',
    opts: [{ k:'mai', v:'Mai utilizzati' }, { k:'passato', v:'Li ho utilizzati in passato' }, { k:'attuale', v:'Li utilizzo attualmente' }, { k:'no_risposta', v:'Preferisco non rispondere' }] },
];

/* ── 3. Stato generale (Q5-Q6) ── */
const STATO_GENERALE = [
  { t: 'single', k: 'energia', label: 'STEP 5',
    q: 'COME TI SENTI IN QUESTO PERIODO?',
    hint: 'Sempre in pre-gara? Qualcosa non quadra.',
    opts: [{ k:'molto_energico', v:'Molto energico' }, { k:'normale', v:'Normale' }, { k:'a_volte_stanco', v:'A volte stanco' }, { k:'sempre_stanco', v:'Sempre stanco' }] },
  { t: 'single', k: 'sonno', label: 'STEP 6',
    q: 'COME DORMI DI SOLITO?',
    hint: 'Se per dormire prendi pi\u00f9 roba che al Tomorrowland, forse non siamo al top.',
    opts: [{ k:'molto_bene', v:'Dormo molto bene' }, { k:'abbastanza', v:'Dormo abbastanza bene' }, { k:'disturbato', v:'Ho un sonno disturbato' }, { k:'pessimo', v:'Ho un sonno disturbato e mi sveglio stanco' }] },
];

/* ── 4. Branch: UOMO (Q7) ── */
const BRANCH_M = [
  { t: 'single', k: 'libido', label: 'STEP 7',
    q: 'COME VALUTERESTI LA TUA LIBIDO?',
    hint: '80 voglia Disco Party.',
    opts: [{ k:'molto_alta', v:'Molto alta' }, { k:'normale', v:'Normale' }, { k:'bassa', v:'Bassa' }, { k:'molto_bassa', v:'Molto bassa' }] },
];

/* ── 5. Branch: DONNA (Q7) ── */
const BRANCH_F = [
  { t: 'single', k: 'ciclo', label: 'STEP 7',
    q: 'COME DESCRIVERESTI IL TUO CICLO MESTRUALE?',
    hint: 'Se hai la gara tra una settimana fai rispondere al tuo alter-ego.',
    opts: [{ k:'regolare', v:'Regolare' }, { k:'legg_irregolare', v:'Leggermente irregolare' }, { k:'molto_irregolare', v:'Molto irregolare' }, { k:'no_ciclo', v:'Non ho ciclo' }] },
];

/* ── 6. Salute metabolica (Q8) ── */
/* ── 7. Cuore e salute generale (Q9) ── */
/* ── 8. Fegato e organi (Q10) ── */
/* ── 9. Ultima domanda (Q11) ── */
const COMMON_AFTER = [
  { t: 'single', k: 'grasso', label: 'STEP 8',
    q: 'HAI PROBLEMI CON L\u2019ACCUMULO DI GRASSO?',
    hint: 'Il FERRO non conosce il grasso.',
    opts: [{ k:'no', v:'Non ho problemi' }, { k:'fatica', v:'Fatico/non riesco a dimagrire' }, { k:'accumulo', v:'Accumulo grasso facilmente' }] },
  { t: 'single', k: 'pressione', label: 'STEP 9',
    q: 'LA TUA PRESSIONE SANGUIGNA?',
    hint: 'La marmellata va bene solo sulle gallette di riso',
    opts: [{ k:'bassa', v:'Bassa' }, { k:'normale', v:'Normale' }, { k:'legg_alta', v:'Leggermente alta' }, { k:'alta', v:'Alta' }, { k:'non_so', v:'Non lo so' }] },
  { t: 'multi', k: 'assunzione', label: 'STEP 10',
    q: 'ASSUMI REGOLARMENTE QUALCUNO DI QUESTI?',
    hint: 'Seleziona tutte le opzioni pertinenti, poi clicca Avanti.',
    opts: [{ k:'farmaci', v:'Farmaci' }, { k:'alcol', v:'Alcol' }, { k:'integratori', v:'Integratori' }, { k:'nulla', v:'Nulla di particolare', exclusive: true }] },
  { t: 'single', k: 'analisi', label: 'STEP 11',
    q: 'QUANDO HAI FATTO LE ULTIME ANALISI DEL SANGUE?',
    hint: 'Quelle di Ferro arriveranno.',
    opts: [{ k:'6m', v:'Meno di 6 mesi fa' }, { k:'6-12m', v:'Tra 6 e 12 mesi fa' }, { k:'12m+', v:'Pi\u00f9 di un anno fa' }, { k:'mai', v:'Mai' }] },
];

/* ── Build flow based on sex ── */
export function getSteps(answers) {
  const sex = answers.sex;
  const branch = sex === 'F' ? BRANCH_F : BRANCH_M;
  return [
    { t: 'intro' },
    ...COMMON_START,
    ...SOSTANZE,
    ...STATO_GENERALE,
    ...branch,
    ...COMMON_AFTER,
    { t: 'contacts' },
    { t: 'esito' },
    { t: 'payment' },
  ];
}

export function getSegment(answers) {
  const sex = answers.sex === 'F' ? 'F' : 'M';
  const age = answers.age;
  const isOver40 = age === '40-49' || age === '50+';
  return `${sex}_${isOver40 ? 'O40' : 'U40'}`;
}

export const LAST_CONTENT = TOTAL_QUESTIONS;

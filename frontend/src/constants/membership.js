/* ── Membership di Ferro ── dati dei 4 livelli ── */

export const MEMBERSHIP_TIERS = [
  {
    id: 'minerale',
    name: 'MINERALE',
    tagline: 'La materia grezza',
    description: 'Accesso alla piattaforma e alla rete Salute di Ferro. Il primo passo per prendere il controllo della tua salute.',
    price6m: 99,
    price12m: 149,
    includes: [
      'Accesso dashboard sanitaria',
      'Archiviazione referti',
      'Accesso rete laboratori convenzionati',
      'Accesso rete specialisti selezionati',
      'Accesso pannelli diagnostici Salute di Ferro',
      'Prenotazione facilitata esami',
    ],
    notIncludes: [
      'Coordinamento umano',
      'Supporto medico',
      'Coaching',
      'Interpretazione clinica',
    ],
    highlighted: false,
  },
  {
    id: 'ferro',
    name: 'FERRO',
    tagline: 'Il metallo che regge tutto',
    description: 'Un Coach di Ferro dedicato che coordina la tua salute: esami, visite, specialisti. Zero sbatti, massimo risultato.',
    price6m: 449,
    price12m: 749,
    includesFrom: 'MINERALE',
    includes: [
      'Coach di Ferro dedicato',
      'Supporto prenotazioni esami',
      'Supporto organizzazione visite',
      'Raccolta e archiviazione referti',
      'Coordinamento specialisti',
      'Reminder follow-up',
      'Supporto via chat / email',
    ],
    notIncludes: [
      'Allenamento',
      'Nutrizione',
      'Consulti medici',
    ],
    highlighted: true,
  },
  {
    id: 'fabbro',
    name: 'FABBRO',
    tagline: 'Chi forgia il ferro',
    description: 'Coaching allenamento integrato con i tuoi esami. Il tuo training si adatta alla tua biochimica.',
    price6m: 1500,
    price12m: 2700,
    includesFrom: 'FERRO',
    includes: [
      'Programmazione allenamento personalizzata',
      'Revisione tecnica mensile',
      'Adattamento training in base agli esami',
      'Supporto performance',
      '1 check allenamento / mese',
    ],
    notIncludes: [
      'Nutrizione',
    ],
    highlighted: false,
  },
  {
    id: 'acciaio',
    name: 'ACCIAIO',
    tagline: 'Indistruttibile',
    description: 'Il programma completo di ottimizzazione salute e performance. Diagnostica, coaching, nutrizione: tutto in un sistema.',
    price6m: 2900,
    price12m: 5400,
    includesFrom: 'FABBRO',
    includes: [
      'Nutrizionista di Ferro dedicato',
      'Piano nutrizionale personalizzato',
      'Revisione nutrizione ogni 4-6 settimane',
      'Integrazione personalizzata',
    ],
    notIncludes: [],
    highlighted: false,
  },
];

export const MEMBERSHIP_BONUSES = [
  { title: 'Guida interpretazione esami bodybuilding', value: 97 },
  { title: 'Protocollo esami base PED users', value: 127 },
  { title: 'Guida markers epatici / renali / ormonali', value: 97 },
  { title: 'Protocollo pre-cycle / post-cycle', value: 147 },
];

export const MEMBERSHIP_STEPS = [
  {
    num: '01',
    title: 'TEST DI FERRO',
    description: 'Completa il test e scopri il tuo profilo metabolico. Ricevi il pannello analisi e il report semplificato.',
  },
  {
    num: '02',
    title: 'CALL DI FERRO',
    description: 'Un esperto ti spiega i risultati, identifica i rischi e ti propone il percorso migliore per te.',
  },
  {
    num: '03',
    title: 'MEMBERSHIP ATTIVA',
    description: 'Entra nella membership e inizia il tuo percorso di ottimizzazione con il supporto del team Salute di Ferro.',
  },
];

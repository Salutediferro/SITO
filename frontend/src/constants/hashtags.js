/* ──────────────────────────────────────────
   Tags are now derived from scoring levels.
   This file provides display info for tags.
   ────────────────────────────────────────── */

export const TAG_INFO = {
  testosterone:  { name: '#TESTOSTERONE',  desc: 'Il testosterone va misurato e monitorato' },
  cuore:         { name: '#CUORE',         desc: 'Il cuore merita un controllo approfondito' },
  fegato:        { name: '#FEGATO',        desc: 'La funzionalit\u00e0 epatica va monitorata' },
  ormoni:        { name: '#ORMONI',        desc: 'Il profilo ormonale richiede attenzione' },
  metabolismo:   { name: '#METABOLISMO',   desc: 'Metabolismo e insulina da controllare' },
  recupero:      { name: '#RECUPERO',      desc: 'Il recupero indica lo stato infiammatorio' },
  prevenzione:   { name: '#PREVENZIONE',   desc: 'La prevenzione \u00e8 il primo passo' },
  checkup:       { name: '#CHECK\u2011UP', desc: 'Serve un check-up completo' },
  performance:   { name: '#PERFORMANCE',   desc: 'Performance da ottimizzare' },
  monitoraggio:  { name: '#MONITORAGGIO',  desc: 'I parametri vanno monitorati regolarmente' },
  salutediferro: { name: '#SALUTEDIFERRO', desc: 'Sei gi\u00e0 al livello top' },
  stress:        { name: '#STRESS',        desc: 'Lo stress impatta su tutto' },
};

export function computeTags(answers, scoreLevel) {
  if (scoreLevel && scoreLevel.tags) {
    return scoreLevel.tags;
  }
  return ['checkup'];
}

# Salute di Ferro — Quiz Analytics & KPI

## Eventi Tracciati (dataLayer → GTM → GA4)

Tutti gli eventi includono automaticamente il parametro `segment` (M_U40, M_O40, F_U40, F_O40).

### Funnel Events

| Evento | Trigger | Parametri |
|---|---|---|
| `quiz_intro_view` | Pageview iniziale | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` |
| `quiz_start` | Click "Inizia il questionario" | — |
| `quiz_step_view` | Visualizza uno step (escluso intro/thanks) | `step_number`, `step_name` |
| `quiz_step_complete` | Completa uno step | `step_number`, `step_name`, `answer` |
| `quiz_step_time` | Completa uno step (timing) | `step_name`, `step_number`, `time_seconds` |
| `quiz_option_select` | Seleziona un'opzione | `step_number`, `step_name`, `option_key`, `option_value` |
| `quiz_step_back` | Torna indietro | `from_step`, `to_step` |
| `quiz_segment_assigned` | Segmento definito (dopo step age) | `segment` |
| `quiz_esito_view` | Vede la pagina esito | `tags`, `tag_count`, `top_tag` |
| `quiz_scroll_esito` | CTA esito diventa visibile (scroll) | `cta_visible: true` |
| `quiz_esito_cta_click` | Click CTA "Scopri il tuo check-up" | — |
| `quiz_complete` | Arriva al form contatti | `total_time_seconds` |
| `quiz_field_focus` | Focus su un campo del form | `field_name` (name/phone/email) |
| `quiz_validation_error` | Submit con campi mancanti | `missing_fields` |
| `quiz_submit` | Invia il form contatti | `has_referral` |
| `quiz_submit_success` | Server risponde OK | — |
| `quiz_submit_error` | Server errore o network fail | `error_type` |
| `quiz_abandon` | Esce dalla pagina durante il quiz | `last_step`, `time_on_page` |
| `calendly_click` | Click link Calendly nella thank you page | — |

---

## KPI Principali — Funnel

| # | KPI | Formula | Target | Note |
|---|---|---|---|---|
| 1 | **Start Rate** | `quiz_start / quiz_intro_view` | > 60% | Se basso: migliorare copy intro o CTA |
| 2 | **Completion Rate** | `quiz_submit / quiz_start` | > 25% | KPI principale. Se basso: troppi step o domande confuse |
| 3 | **Drop-off per step** | `1 - (step_N+1_view / step_N_view)` | < 15% per step | Identifica lo step killer |
| 4 | **Tempo medio completamento** | `avg(total_time_seconds)` su `quiz_complete` | 2-4 min | Troppo lungo = friction; troppo corto = risposte a caso |
| 5 | **Esito → Contatti** | `quiz_esito_cta_click / quiz_esito_view` | > 80% | Se basso: esito non convincente |
| 6 | **Form → Submit** | `quiz_submit / quiz_complete` | > 60% | Se basso: friction nel form (campi, privacy) |
| 7 | **Submit Success Rate** | `quiz_submit_success / quiz_submit` | > 95% | Se basso: problemi server/API |
| 8 | **Calendly CTR** | `calendly_click / quiz_submit` | > 10% | Upsell post-quiz |

---

## KPI Secondari — Analisi Dettaglio

| KPI | Formula | Uso |
|---|---|---|
| **Tempo medio per step** | `avg(time_seconds)` da `quiz_step_time` per step_name | Step dove gli utenti esitano = confusione o troppo testo |
| **Back rate per step** | `quiz_step_back(from_step=N) / quiz_step_view(step=N)` | Step dove tornano indietro = risposte non chiare |
| **Distribuzione segmenti** | `% quiz_segment_assigned` per segment | Capire il pubblico: M_U40 vs F_O40 ecc. |
| **Tag più frequenti** | Count `top_tag` da `quiz_esito_view` | Aree salute più rilevanti → offerta commerciale |
| **Form error rate** | `quiz_validation_error / quiz_complete` | Campi problematici (spesso privacy non spuntata) |
| **Form field drop-off** | `quiz_field_focus(name) - quiz_field_focus(email)` | Quanti iniziano ma non finiscono il form |
| **Abbandono per step** | `quiz_abandon` raggruppato per `last_step` | Step dove si perde più traffico |
| **Referral usage** | `quiz_submit(has_referral=true) / quiz_submit` | Efficacia canale referral |
| **Esito scroll rate** | `quiz_scroll_esito / quiz_esito_view` | Quanti leggono tutto l'esito prima del CTA |

---

## Configurazione GA4 (via GTM)

### 1. Creare i Custom Events in GTM

Per ogni evento nella tabella sopra:
1. **Trigger** → Custom Event → nome evento (es. `quiz_start`)
2. **Tag** → GA4 Event → nome evento + parametri come Event Parameters
3. Pubblicare il container

### 2. Custom Definitions in GA4

In GA4 → Admin → Custom Definitions → Create:

| Parametro | Scope | Tipo |
|---|---|---|
| `segment` | Event | Text |
| `step_number` | Event | Number |
| `step_name` | Event | Text |
| `time_seconds` | Event | Number |
| `total_time_seconds` | Event | Number |
| `tags` | Event | Text |
| `tag_count` | Event | Number |
| `top_tag` | Event | Text |
| `field_name` | Event | Text |
| `missing_fields` | Event | Text |
| `error_type` | Event | Text |
| `last_step` | Event | Number |
| `has_referral` | Event | Text |
| `utm_source` | Event | Text |
| `utm_medium` | Event | Text |
| `utm_campaign` | Event | Text |

### 3. Conversioni

Marcare come conversione in GA4:
- `quiz_submit` — Lead principale
- `calendly_click` — Lead qualificato (discovery call)

### 4. Funnel Exploration

In GA4 → Explore → Funnel Exploration:

**Funnel principale:**
1. `quiz_intro_view`
2. `quiz_start`
3. `quiz_segment_assigned`
4. `quiz_esito_view`
5. `quiz_esito_cta_click`
6. `quiz_complete`
7. `quiz_submit`

Segmentare per `segment` per vedere differenze tra M_U40, M_O40, F_U40, F_O40.

---

## Dashboard Consigliata

### Vista 1 — Overview (giornaliera)
- Intro views vs Start vs Submit (trend line)
- Completion rate % (scorecard)
- Tempo medio completamento (scorecard)
- Leads per segmento (pie chart)

### Vista 2 — Funnel Detail
- Drop-off per step (bar chart)
- Back rate per step (bar chart)
- Tempo medio per step (bar chart)

### Vista 3 — Esito & Tags
- Tag distribution (bar chart top 10)
- Tag per segmento (stacked bar)
- Esito → CTA rate per segmento

### Vista 4 — Form & Conversion
- Field focus funnel (name → phone → email → submit)
- Validation error rate
- Submit success vs error rate
- Calendly CTR

---

## Note Operative

- **GTM Container ID**: Sostituire `GTM-XXXXXXX` in index.html con il container reale
- **Tutti gli eventi** passano già via `dataLayer.push()` — basta configurare GTM
- **UTM params**: Funzionano automaticamente con URL tipo `?utm_source=instagram&utm_medium=ads&utm_campaign=lancio`
- **Debug**: In console browser, `window.dataLayer` mostra tutti gli eventi pushati
- **Segment** è incluso in ogni evento per segmentazione cross-analisi

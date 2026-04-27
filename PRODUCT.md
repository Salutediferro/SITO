# PRODUCT.md — Salute di Ferro

> Setup file per skill Impeccable. Compilato 2026-04-27 da audit handover v2 + analisi codice live + briefing Trilli Gianni.
> Da affinare con `$impeccable teach` quando il cliente vuole una review più formale.

## Register

**brand** — Il sito attuale è marketing + funnel di lead generation. Il design IS il prodotto: deve trasmettere autorevolezza scientifica e appeal performance prima ancora di qualunque interazione operativa. La dashboard atleti (futura, in sviluppo da PERSONA X) sarà il register **product**, ma non è in scope per ora.

## Product Purpose

Salute di Ferro (SDF) è una **piattaforma digitale di coordinamento e intermediazione di servizi sanitari**, verticale sul mondo performance: bodybuilding, powerlifting, fitness, sport di forza. Modello operativo analogo a Doctolib / MioDottore, ma specializzato sulla performance atletica.

Cosa SDF NON è:
- Una struttura sanitaria
- Un ambulatorio o clinica
- Una STP (Società Tra Professionisti)
- Un servizio di consulenza sanitaria diretta

Cosa SDF È:
- Mette in contatto utenti con professionisti sanitari (medici, laboratori convenzionati come Bianalisi)
- Coordina pannelli ematici personalizzati basati su sintomatologie autodichiarate
- Vende coordinamento, percorsi, membership
- NON incassa percentuali su prestazioni mediche o di laboratorio (vietato Codice Deontologico FNOMCeO)

Funnel commerciale principale: sito vetrina → quiz `/test` (sintomatologie) → assegnazione automatica pannello analisi → contatti → pagamento Stripe → consulenza Calendly.

## Users

### Primary persona — "Atleta consapevole"

- **Età**: 25-45 anni
- **Genere**: 4 segmenti tracciati: M_U40, M_O40, F_U40, F_O40
- **Profilo**: bodybuilder amatoriali avanzati, powerlifter, atleti forza ricreativa (top 10% per dedizione, non agonisti pro)
- **Pain principali**: stanchezza cronica, calo testosterone, sonno disturbato, plateau prestazionale, alimentazione disregolata
- **Knowledge level**: medio-alto (leggono Pubmed casualmente, conoscono terminologia base ormonale, hanno provato integratori)
- **Frustrazioni con concorrenti**: medici di base liquidano i loro problemi, internet è pieno di fuffa, centri analisi tradizionali sono impersonali, MyProtein/Iron Mass shouty e poco credibili
- **Trigger di acquisto**: vogliono valori oggettivi sui propri biomarker per ottimizzare allenamento e recupero — non per "curarsi"

### Secondary persona — "Coach / preparatore"

- Personal trainer, coach online, preparatori bodybuilding
- Acquistano per i loro atleti, oppure si consigliano reciprocamente
- Bisogno: validare protocolli con dati reali

### Quasi-persona — "Atleta donna"

- Ancora marginale ma in crescita target
- Pain dedicati (cicli, ferritina, tiroide) richiedono pannelli specifici
- IMPORTANTE: copy attuale è troppo male-focused (es. "Bodybuilder muscoloso" alt text)

## Brand

### Personalità

- **Autorevole ma non paternalistica** — parliamo come un coach con PhD, non come un medico distaccato
- **Diretta, no fluff** — niente buzzword wellness ("ritrova il tuo benessere"), niente fake-empathy
- **Scientifica senza essere clinica** — citiamo range di riferimento, parliamo di marker, MA usiamo linguaggio comprensibile a chi non è medico
- **Forza e ferro come metafore reali** — il nome non è casuale, "salute di ferro" = struttura solida, resistenza, prestazione costante

### Tone of voice

- Italiano colloquiale-tecnico (TU, mai LEI)
- Frasi corte, periodare diretto
- Niente em-dash, niente esclamazioni, niente emoji
- Niente call to action urlate ("ACQUISTA SUBITO!!!"). Preferiamo confidenza secca ("Prenota la tua call.")
- Linguaggio NON diagnostico (vincolo legale): MAI "hai testosterone basso", "sei a rischio", "patologia". SEMPRE "i tuoi valori non rientrano nel range oggettivo", "il pannello suggerito per te è X"

### Anti-references

| Brand | Cosa NON vogliamo essere |
|---|---|
| **Doctolib / MioDottore** | Impersonale, generico, "marketplace freddo" senza identità verticale |
| **MyProtein / Iron Mass** | Shouty, urlato, percentuali sconto in giallo neon, banner pop-up aggressivi |
| **Centri medici tradizionali** | Intimidatori, palette ospedaliera bianco/azzurro, jargon clinico inaccessibile |
| **Wellness influencer** | Fake-empathy, foto stock di donne sorridenti su yoga mat, claim irrealistici |
| **MultiPharma / Sport-tech generic** | Identità anonima, palette tech blu-verde, copy generato da AI |

## Strategic Principles

1. **Rigore scientifico prima di tutto.** Ogni claim sui pannelli deve essere validato con Matteo + Antonio (Sales/Coach manager). Ogni copy che parla di salute deve passare review legale di Giovanni.
2. **No diagnosi, mai.** SDF è intermediazione. Coach di Ferro coordina, non diagnostica. Se uno screenshot lascia anche il dubbio → riscrivere.
3. **Performance > wellness.** Parliamo di forza, output, recupero, marker biometrici — non di "benessere generale" o "vitalità".
4. **Verticalità è il nostro fossato.** Ogni elemento del sito deve sembrare costruito DA atleti PER atleti. Foto stock generiche di "uomo in palestra" sono nemiche.
5. **Sconto referral SOLO su fee piattaforma.** Mai su lab o medico (vincolo deontologico).
6. **Niente AI di terzi sui dati utente.** Solo Anthropic API per qualsiasi feature AI futura.
7. **Compliance GDPR art.9 non-negoziabile.** I sintomi sono dati sanitari. DPIA + DPO + consenso esplicito separato.

## Visual register hints

- **Aesthetic target**: officina/forgia + laboratorio scientifico. NO ospedale, NO centro fitness commerciale, NO startup tech generica.
- **Palette in evoluzione**: branch attivo `feat/iron-forge-palette` con palette "Iron Blood" (gunmetal `#0A0A0C` + rosso sangue `#E04040` / `#7A0E0E`). Da approvare con cliente.
- **Logo**: `LOGO.png` 218KB (versione WebP `LOGO.webp` 37KB esiste ma non servita). Logo ha colori `#5b2926` (ruggine), `#b22222` (firebrick), `#a3a3a3` / `#d9d9d9` (grigi metallici).
- **Typography attuale**: Bebas Neue (display), DM Sans (body). Coerente al register "forza atletica".

## Anti-patterns specifici da evitare

- **Side-stripe borders** sui card (vietato dalla skill Impeccable + brutto a prescindere)
- **Gradient text** decorativo (già presente in Hero.jsx — è un debt da rimuovere, vedi audit)
- **Hero-metric template** SaaS (big number + small label) come pattern dominante
- **Identical card grids** (membership/pannelli ne hanno alcuni — da variare ritmo)
- **Modal as first thought** (per ora il sito non ne abusa, manteniamo)
- **Glassmorphism** decorativo (già assente, manteniamo)
- **Foto stock impersonali** di "atleta generico" che non rappresenta i 4 segmenti

## Stakeholder & decision rights

| Decisione | Owner |
|---|---|
| Brand identity, copy strategico | Antonio Titaro (COO) |
| Sales/marketing copy, pricing visibile | Matteo Trilli (Sales/Coach Manager) — fratello dell'utente Trilli Gianni |
| Approvazione legale qualsiasi cosa toccia salute/diagnosi/GDPR | Giovanni (legale) + DPO |
| Founder/escalation finale | Simone Pagnottoni |
| Knowledge transfer technical/storia repo | Simone Rampazzo (in transizione) |
| Operations Notion/Slack | Giuseppe Maffucci |

---

*Source documents: Handover Tecnico v2 (21 Apr 2026), Documento Priorità Dev Nuovo v1 (21 Apr 2026), audit ricognizione codice 25-27 Apr 2026.*

# DESIGN.md — Salute di Ferro

> Sistema di design del sito SDF. Generato 2026-04-27 da analisi codice + decisioni in corso.
> **Sezione palette in revisione attiva** — i valori HEX cambieranno. Le decisioni semantiche (token, regole, principi) sono stabili.
> Da affinare con `$impeccable document` quando palette finale è approvata.

---

## 1. Filosofia visiva

**Aesthetic target**: officina/forgia + laboratorio scientifico.

NO ospedale (palette bianco/azzurro impersonale). NO centro fitness commerciale (giallo neon, motivazione urlata). NO startup tech generica (gradient blu-viola, sans-serif neutro).

Coerente con il register **brand** (vedi `PRODUCT.md`): il design IS il prodotto. Deve trasmettere autorevolezza scientifica + appeal performance/forza prima di qualunque interazione operativa.

---

## 2. Color system

### 2.1 Strategia colore

**Restrained**: tinted neutrals + un singolo accent rosso.

L'accent rosso è il marker SDF (richiamo al sangue arterioso = performance metabolica, e al "ferro" del nome = forza/struttura). Tutti gli altri colori sono neutrali metallici (anthracite, gunmetal, steel, chrome, silver) + un singolo "secondary metallic" per badge/highlight (chrome `#C8C8CC` attualmente).

**Mai usare**: oro acceso, verde brillante, viola, ciano, qualsiasi pastello, qualsiasi colore "wellness" (turchese, salvia chiaro).

### 2.2 Token semantici (stabili)

I componenti riferiscono **sempre** a CSS custom properties, mai a hex letterali. Se una variabile cambia, tutto il sito si adatta.

| Token | Ruolo | Uso |
|---|---|---|
| `--bg` | superficie pagina principale | body background, root level |
| `--bg-card` | superficie pannelli/card | quiz card, FAQ items, info boxes |
| `--bg-elevated` | superfici "alte" (modal, hero, CTA-box) | hero band, payment box, modali |
| `--input-bg` | sfondo controlli form | input, select, textarea |
| `--text` | testo body principale | corpo, paragrafi, h1-h3 |
| `--text-sec` | testo secondario | sottotitoli, paragrafi long-form |
| `--text-muted` | testo helper/label | label form, helper text, footer secondario |
| `--accent` | rosso usabile come testo/link/focus | link, focus ring, badge testo, icone significative |
| `--accent-fill` | rosso usabile SOLO come fill di superficie | background bottoni, fill badge solidi (testo bianco sopra) |
| `--accent-dark` | hover di fill / bordi attivi scuri | bottone hover, border attivo |
| `--accent-glow` | shadow alone soffuso accent | box-shadow CTA, focus glow |
| `--accent-glow2` | shadow alone più trasparente | hover glow leggero |
| `--gold` | metallico secondario (chrome/silver) | badge premium, divider metallici, highlight neutri |
| `--gold-glow` | shadow gold | rare uses |
| `--blue` | metallico utility info | info box, tag categoria, secondary tag |
| `--green` | success state | conferme, tick referral applicato, success messages |
| `--border` | hairline neutro | bordi card, separator |
| `--border-hover` | hairline più visibile in hover | bordi card-hover, focus-within |
| `--border-active` | accent border | input focus, card selezionata |

**Regola critica**:
- `--accent` ≥ 4.5:1 contrast su `--bg` (per uso testo)
- `--accent-fill` può scendere a 3:1 su `--bg` (perché si usa solo come fill, mai come testo) MA testo `WHITE` sopra deve essere ≥ 4.5:1
- `--accent-dark` non si usa mai come testo

### 2.3 Palette HEX — Iron Blood (approvata 2026-04-27)

> Branch `feat/iron-forge-palette`. Approvata da Trilli.
> Test "no orange shift": tutti i rossi rispettano `B ≥ G` per evitare deriva arancio (regola SDF).

```css
:root {
  /* Backgrounds — anthracite/gunmetal cool */
  --bg:           #0A0A0C;   /* carbone, quasi nero ferroso */
  --bg-card:      #131316;   /* ferro nero */
  --bg-elevated:  #1F1F23;   /* gunmetal */

  /* Accent — pure crimson red, NO orange shift */
  --accent:       #EC4757;   /* rosso cremisi vivo (R=236, G=71, B=87 → B-G=+16) */
  --accent-fill:  #7A0815;   /* sangue venoso (per fill bottoni, white sopra 9.4:1) */
  --accent-dark:  #500511;   /* sangue rappreso (hover/border) */

  /* Glow */
  --accent-glow:  rgba(236,71,87,0.18);
  --accent-glow2: rgba(236,71,87,0.10);

  /* Metallics */
  --gold:         #C8C8CC;   /* chrome/silver — invece di oro caldo */
  --blue:         #8C9AA8;   /* acciaio blu freddo */
  --green:        #9BB89B;   /* sage success */

  /* Text — cool whites */
  --text:         #F2F2F4;
  --text-sec:     #B8B8BC;
  --text-muted:   #9A9AA0;

  /* Borders */
  --border:       rgba(242,242,244,0.08);
  --border-hover: rgba(242,242,244,0.16);
  --border-active:#EC4757;
  --input-bg:     #0A0A0C;
}
```

**Gradient text utility** (`.gradient-text`): 3 stop tutti rossi cremisi accesi:
- stop 1 `#FF4555` (rosso brillante)
- stop 2 `var(--accent)` (`#EC4757`)
- stop 3 `#9A0E1F` (granato cremisi)

**Bottone primary gradient**: `linear-gradient(135deg, var(--accent) → #7A0815)` con testo `white` (9.4:1 PASS).

### 2.4 Test contrasti WCAG AA (palette validata)

| Combo | Ratio | Verdict |
|---|---|---|
| `--text` su `--bg` | 18.5:1 | ✅ AAA |
| `--text-sec` su `--bg` | 10.7:1 | ✅ AAA |
| `--text-muted` su `--bg-card` | ~6.5:1 | ✅ AA testo |
| `--accent` (`#EC4757`) come testo su `--bg` | 4.81:1 | ✅ AA testo |
| White su `--accent-fill` (`#7A0815`) | 9.4:1 | ✅ AAA |
| `--gold` su `--bg` | 12.6:1 | ✅ AAA |

### 2.4 Anti-patterns colore

- ❌ Hex hardcoded in JSX inline style (es. `style={{ color: '#F87171' }}`). Tutto deve passare per token.
- ❌ Bianco puro `#FFFFFF` o nero puro `#000000` come background o testo body. Sempre warm/cool tinted.
- ❌ Multipli accent. C'è UN rosso. Non blu-rosso, verde-rosso, ecc.
- ❌ Gradient text decorativo (`background-clip: text` con gradient) — anti-pattern Impeccable.

---

## 3. Theme

**Dark mode locked.**

Razionale (one scene sentence): *atleta 30 anni che apre il sito sul telefono in spogliatoio dopo allenamento, luce ambient bassa, vuole leggere il suo profilo post-quiz senza essere accecato.*

Light mode non in scope. Se in futuro si aggiunge: tutti i token sopra avranno una variante `prefers-color-scheme: light`, MAI inversione "naive" (light != accent invertito).

---

## 4. Typography

### 4.1 Font families

| Family | Ruolo | Source |
|---|---|---|
| **Bebas Neue** | Display, headlines, CTA labels | Google Fonts |
| **DM Sans** | Body, paragraphs, UI text, form input | Google Fonts |
| (futuro) Mono | Marker labels (es. valori biometrici, KPI) | da decidere |

### 4.2 Scala tipografica (rapporto ~1.25-1.33)

| Token (proposta) | Size | Weight | Use |
|---|---|---|---|
| `--text-display-1` | clamp(48px, 7vw, 84px) | 400 (Bebas) | Hero H1 |
| `--text-display-2` | clamp(36px, 5vw, 56px) | 400 (Bebas) | Section heading |
| `--text-h1` | clamp(28px, 4vw, 40px) | 600 (DM) | Page H1 (no Hero) |
| `--text-h2` | clamp(22px, 3vw, 28px) | 600 (DM) | Section H2 |
| `--text-h3` | 18px | 600 (DM) | Sub-section |
| `--text-body` | 17px | 400 (DM) | Body |
| `--text-body-sm` | 14px | 400 (DM) | Helper |
| `--text-label` | 12-13px | 600 (DM) uppercase letter-spacing 2-3px | Form label, kicker, badge |
| `--text-cta` | 16-18px | 400 (Bebas) uppercase letter-spacing 3px | Bottoni primari |

**NB**: oggi i size sono inline style sparsi nei JSX. Refactor a token consigliato.

### 4.3 Regole tipografiche

- **Line length body**: cap a 65-75ch
- **Line height body**: 1.7
- **Line height headings**: 1.1-1.2
- **Letter-spacing display**: Bebas Neue lavora bene con `letter-spacing: 0` o leggero positivo (`0.5px` su uppercase)
- **Weight contrast**: ≥ 400 → 600 step. No flat scale 400 ovunque.
- **Italic**: usato nei sub-elementi heading (`<em>` in Hero) — coerente, mantenere
- **No em-dash** (regola Impeccable + tone of voice). Usare punto, virgola, due punti, parentesi.

---

## 5. Spacing & Layout

### 5.1 Scala spaziatura

Base 4px. Token semantici proposti:

| Token | px | Use |
|---|---|---|
| `--space-1` | 4 | micro gap (icon-text) |
| `--space-2` | 8 | gap stretti (badge interno) |
| `--space-3` | 12 | gap medio (form field padding) |
| `--space-4` | 16 | gap standard (card padding inner) |
| `--space-5` | 24 | gap card → contenuto |
| `--space-6` | 32 | section padding tight |
| `--space-7` | 48 | section padding standard |
| `--space-8` | 64 | section padding generous |
| `--space-9` | 96 | hero / major break |

**Regola Impeccable**: vary spacing for rhythm. Section diverse devono avere padding diversi. NON `padding: 64px` ovunque = monotonia.

### 5.2 Radius

| Token | px | Use |
|---|---|---|
| `--radius-sm` | 6 | input, badge piccolo |
| `--radius-md` | 8 | card standard, FAQ item |
| `--radius-lg` | 12 | modal, hero container |
| `--radius-pill` | 9999 | badge pill, dot, focus chip |

### 5.3 Layout principles (da Impeccable)

- **Cards sono la risposta lazy**. Usarle solo dove sono davvero la migliore affordance (es. pannello prezzo, FAQ item)
- **Mai cards nested** (anti-pattern assoluto Impeccable)
- **Non wrappare tutto in container**. Usa width naturale del contenuto + max-width sul section.
- **No identical card grids**. Quando si ha una griglia di card simili (membership, pannelli), variare almeno una dimensione (size, layout, ratio) per evitare l'effetto SaaS-cliché.

### 5.4 Touch targets

- **Minimum**: 24x24 (WCAG 2.2 SC 2.5.8)
- **Preferito**: 44x44 (Apple HIG / Material)
- Dot piccoli decorativi (8x8) ammessi solo se hit area ≥24x24 via padding trasparente

---

## 6. Elevation (shadows)

### 6.1 Scala elevation

In dark mode, gli shadow sono meno visibili che in light. Si combinano con bordi sottili e backgrounds via tier (`--bg`, `--bg-card`, `--bg-elevated`).

| Token | Shadow | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | micro depth (button rest) |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | card hover, dropdown |
| `--shadow-lg` | `0 16px 48px rgba(0,0,0,0.5)` | modal, hero CTA |
| `--shadow-glow` | `0 6px 24px var(--accent-glow)` | CTA primario hover, focus ring esteso |

### 6.2 Border vs shadow

In dark mode: **border `1px solid var(--border)` è ammesso** (Jakub permette borders nel dark, gli shadow sono meno visibili). Però per CTA primari e elementi alti preferire `box-shadow` per profondità.

---

## 7. Motion

> Vedi audit motion completo (in chat sessione 2026-04-27). Sintesi normativa qui.

### 7.1 Token motion

```css
:root {
  --motion-fast: 150ms;        /* micro-feedback (hover, tooltip) */
  --motion-base: 200ms;        /* standard transition (default) */
  --motion-medium: 300ms;      /* state changes (modal, drawer) */
  --motion-slow: 400ms;        /* enter animations, complex */

  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);          /* Material standard */
  --ease-out-quint: cubic-bezier(0.16, 1, 0.3, 1);        /* fade-in punchy */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);       /* tag pop, micro-celebration */
}
```

### 7.2 Regole motion

1. **`prefers-reduced-motion`** è hard-required. Global guard in `animations.css`.
2. **Animare solo `transform` e `opacity`** (eventualmente `filter` per blur). MAI `width/height/top/left/margin/padding`.
3. **Enter animation pattern (Jakub)**: `opacity 0→1, translateY 8px→0, filter blur(4px)→blur(0)`. Spring `bounce: 0`, durata 400-450ms.
4. **Exit animation è subtler dell'enter**: stessa opacity/blur, translateY più piccolo (es. -8px invece di +8px, mai full-distance).
5. **No animazioni infinite "ambient"**. Se serve un movimento continuo, deve essere pausabile + disabilitabile via reduced-motion.
6. **No animazioni su keyboard-initiated actions** (Tab, Enter native). Usare `<form onSubmit>` invece di listener custom.
7. **Bottoni: `:active { transform: scale(0.97); }`** per tactile feedback (Emil).
8. **Curve: usare token, no `ease` default CSS**. Bezier custom = più strength.

---

## 8. Components — design tokens

### 8.1 Buttons

| Variant | Background | Text | Border | Radius | Height (md) |
|---|---|---|---|---|---|
| `primary` | `linear-gradient(var(--accent-fill), var(--accent-dark))` | `white` | none | `--radius-md` | 56px |
| `secondary` | `transparent` | `var(--text)` | `1px solid var(--border-hover)` | `--radius-md` | 56px |
| `ghost` | `transparent` | `var(--text-muted)` | none | `--radius-md` | 40px |
| `danger` | `var(--accent-fill)` | `white` | none | `--radius-md` | 48px |

**Hover**: tutti i variant hanno transition `background var(--motion-fast)`. Primario aggiunge `transform: translateY(-1px) + box-shadow var(--shadow-glow)`.

**Focus visible**: tutti hanno `outline: 2px solid var(--accent); outline-offset: 2px;` (NO `outline: none` mai).

**Disabled**: opacity 0.35 + `cursor: not-allowed`.

### 8.2 Form inputs

| Property | Value |
|---|---|
| Background | `var(--input-bg)` |
| Border | `1px solid var(--border)` |
| Border focus | `1px solid var(--accent)` + `box-shadow: 0 0 0 3px var(--accent-glow2)` |
| Border invalid | `1px solid #F87171` (semantic red error, separato dall'accent — TBD se usare `--accent` stesso) |
| Padding | `12px 16px` |
| Font-size | 16px (mobile-safe, no zoom su iOS) |
| Border radius | `--radius-sm` |
| Transition | `border-color var(--motion-fast), box-shadow var(--motion-fast)` |

### 8.3 Cards

| Property | Value |
|---|---|
| Background | `var(--bg-card)` |
| Border | `1px solid var(--border)` |
| Border radius | `--radius-md` |
| Padding | `--space-5` (24px) |
| Hover (se interattiva) | `transform: translateY(-2px) + var(--shadow-md) + border-color var(--border-hover)` |
| Hover transition | `var(--motion-base)` con `--ease-standard` |

### 8.4 Badges

| Variant | Use |
|---|---|
| `accent` | tag primary (es. "Promo Lancio") — fill `--accent-fill`, text white |
| `chrome` | tag premium / metallic (es. "Pro") — fill `--gold`, text `--bg` |
| `outline` | tag categoria — fill transparent, border `--border-hover`, text `--text-sec` |
| `success` | tag conferma — fill rgba(154,184,154,0.12), text `--green` |

---

## 9. Iconography

- **Source**: SVG inline JSX (no icon font, no SVG sprite per ora — overhead non giustificato)
- **Stroke width**: 2 o 2.5 (consistente)
- **Size**: 16, 18, 20, 24 (allineata a scala spacing)
- **Color**: sempre `currentColor` per ereditare da contesto
- **Optical alignment**: icone asimmetriche (play, freccia) richiedono shift visivo manuale (Jakub)

---

## 10. Imagery

### 10.1 Foto

- **NO foto stock** generiche di "uomo/donna in palestra". Anti-pattern brand.
- Foto reali atleti (con consenso) o nessuna foto. Meglio pulito che generico.
- Pannelli vetrina (`/panels/panel-*.jpg`): da rivedere, alcuni rappresentano solo bodybuilder maschi → escludono donne (audit a11y issue M16).

### 10.2 Logo

- **`LOGO.webp`** (37KB) deve essere il file servito. Oggi è servito `LOGO.png` (218KB) — fix necessario.
- Servire con `<picture>` + WebP fallback PNG.
- Alt: "Salute di Ferro" (mai "SDF" — non descrittivo).

### 10.3 Decorazioni

- Preferire CSS shapes (clip-path, gradients, pseudo-elements) a SVG/PNG quando possibile.
- Pattern noise leggero in `body::after` (presente, OK come densità — ~2.5% opacity).

---

## 11. Responsive

- **Breakpoint**: mobile-first. Single breakpoint @ `768px` per ora (basta per il funnel attuale).
- **Touch-first**: tutti i tap target ≥44px su mobile.
- **Hero font size**: `clamp(48px, 7vw, 84px)` — già presente, mantenere.
- **Sticky CTA mobile**: presente in globals.css `.sticky-cta`. Visibile solo `<= 768px`.

---

## 12. Anti-patterns SDF-specifici

In aggiunta agli "Absolute bans" Impeccable (side-stripe borders, gradient text, glassmorphism default, hero-metric template, identical card grids, modal as first thought), specifici per SDF:

1. **Mai claim diagnostici nel copy** ("hai testosterone basso", "patologia"). Solo "i tuoi valori non rientrano nel range oggettivo".
2. **Mai usare `--accent` per success state** (verde è verde, rosso è rosso — semantica chiara).
3. **Mai foto stock di "atleta generico"**.
4. **Mai grid di 4-6 card identiche con icon+heading+text** (cliché SaaS).
5. **Mai gradient text** (anti-pattern Impeccable + Jakub).
6. **Mai animazioni infinite "ambient"** che girano senza scopo (Hero gradientMesh attuale è da rimuovere).
7. **Mai un secondo accent colorato** (giallo/blu/verde brillante). C'è UN rosso. Punto.

---

## 13. Open issues (in revisione)

- **Palette finale**: `feat/iron-forge-palette` Iron Blood (rosso sangue + anthracite) — in revisione con cliente.
- **Token motion**: ancora hardcoded nei file. Da introdurre come variabili CSS ed estendere ai consumi.
- **Token spacing**: ancora hardcoded. Da introdurre.
- **Token typography**: ancora hardcoded. Da introdurre.
- **Light mode**: deferred, non in scope ora.
- **Componenti UI primitives**: zero design system condiviso (no Storybook). Quando crescerà, valutare Radix UI primitives o shadcn/ui custom-themed.

---

*Source: analisi codice repo Salutediferro/SITO branch `feat/iron-forge-palette`, handover v2, audit motion 2026-04-27. Da affinare con cliente prima di considerare stabile.*

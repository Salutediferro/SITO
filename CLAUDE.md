# SDF · Salute di Ferro · project context

> File auto-letto da Claude Code ad ogni sessione su questo repo.
> Definisce stack, convenzioni, skill preferenziali e agenti interni.

## Stack

- **Frontend**: React 19 + Vite 8 + React Router 7 (SPA)
- **Hosting**: Cloudflare Pages (project `salutediferro`) · domini `salutediferro.com` + `www`
- **API/Worker**: Cloudflare Workers JS (`sdf-lead-collector`) · `form.salutediferro.com`
- **Database**: Cloudflare D1 (`sdf-db` · counter Founder slots)
- **Pagamenti**: Stripe Checkout LIVE (Founder Pass €119,88/anno + Membership + Consulenza €24,99/mese)
- **Calendario**: Calendly Pro (webhooks v2)
- **Email**: Resend (free tier 100/giorno · upgrade €20/mese quando supera)
- **Automation**: n8n VPS Hetzner (4 workflow LIVE: Calendly · Stripe · Welcome · No-Show)
- **Analytics**: GTM/GA4 con Consent Mode v2
- **Repo GitHub**: https://github.com/Salutediferro/SITO

## Deploy

```bash
# Frontend production (Cloudflare Pages):
cd /Users/trilligianni/Desktop/claude/SDF/SITO/frontend
npm run build
npx wrangler pages deploy dist/ --project-name salutediferro --branch main --commit-dirty=true --commit-message="<msg>"

# Worker (Cloudflare Workers):
cd /Users/trilligianni/Desktop/claude/SDF/SITO
npx wrangler deploy

# GitHub push:
git push origin feat/founder-pass-launch
# Squash merge su main quando consolidi:
git checkout main && git merge --squash feat/founder-pass-launch && git commit -m "..." && git push origin main && git checkout feat/founder-pass-launch
```

## Convenzioni codice

- **Lingua**: IT conversazione + UI utente finale, EN codice + commit message + identificatori
- **Commit**: Conventional Commits (`feat:`, `fix:`, `style:`, `chore:`, `refactor:`, `docs:`, `revert:`)
- **Branch**: mai push diretto su `main`. Sempre `feat/...`, `fix/...`, `chore/...`
- **A11y**: WCAG 2.1 AA NON negoziabile (HTML semantico prima ARIA, contrast 4.5:1, focus management, prefers-reduced-motion)
- **Componenti**: `frontend/src/components/<dominio>/<NomeComponente>.jsx`
- **Pagine**: `frontend/src/pages/<NomePage>.jsx` (NB: NON Next.js · è Vite SPA con React Router)
- **Hook**: `frontend/src/hooks/use<Nome>.js`
- **Costanti**: `frontend/src/constants/<dominio>.js` (es. `payments.js`, `panels.js`, `faq.js`)
- **Pattern stili**: inline styles + CSS variables (`var(--accent)`, `var(--text)`, `var(--space-X)`)
- **No Tailwind** (codebase storico inline · no migrazione)

## Skill preferenziali per SDF

Claude usa proattivamente queste skill globali quando il contesto matcha:

| Trigger | Skill |
|---|---|
| Modifica UI / componente / pagina | `accessibility-agents:accessibility-lead` (mandatory pre-edit) |
| Restyle visivo / sezione nuova | `ui-ux-pro-max` |
| Audit frontend complete (hierarchy, perf, polish) | `impeccable` |
| Animations / transitions / motion | `design-motion-principles` |
| Brainstorming feature | `superpowers:brainstorming` |
| Bug fix sistematico | `superpowers:systematic-debugging` |
| Task multi-step >3 | `superpowers:writing-plans` |
| Pre-completion claim "fatto" | `superpowers:verification-before-completion` |
| Commit message | `caveman-commit` |
| PR review | `caveman-review` |
| Decisione strategica con tradeoff | `anthropic-skills:llm-council` |
| Generate PDF team report | `anthropic-skills:pdf` |
| Foto bulk editing pannelli | `adobe-for-creativity:adobe-batch-edit-photos` |
| Social variations (lancio Founder) | `adobe-for-creativity:adobe-create-social-variations` |
| Quick cut sizzle reel video | `adobe-for-creativity:adobe-edit-quick-cut` |
| Fine sessione | `session-close` |

## Agenti interni progetto

`.claude/agents/` contiene subagent SDF-specifici. Delegate via Task tool con `subagent_type: "<name>"`:

- `sdf-design-curator` · audit/redesign visivo (ui-ux-pro-max + impeccable + motion)
- `sdf-deploy-engineer` · build + deploy + verify live (frontend + worker)
- `sdf-stripe-validator` · verifica coerenza link Stripe ↔ pricing display
- `sdf-content-writer` · modifica copy IT preservando aria-label/sr-only
- `sdf-image-handler` · sostituzione foto + case-check + cache bust + alt WCAG

## File critici da preservare (non rompere mai)

- `frontend/src/components/home/FounderPassCard.jsx` · mockup V4 cliente · 6 features + Klarna note + counter
- `frontend/src/constants/payments.js` · Stripe links + PRICING display
- `frontend/src/hooks/useFounderSlots.js` · polling D1 atomic counter Founder
- `frontend/src/components/home/PanelShowcase.jsx` · carosello 9 pannelli home
- `frontend/src/components/cookie/CookieBanner.jsx` · GDPR Consent Mode v2
- `frontend/src/components/layout/SkipLink.jsx` · WCAG 2.4.1 Bypass Blocks
- `frontend/src/components/layout/RouteHelmet.jsx` · title dinamico + live region announcer
- `src/index.js` · Worker /payment-success Stripe expand line_items + 8 endpoints

## Vault esterno (memoria)

- `~/Obsidian/SecondoCervello/10-Projects/SaluteDiFerro/` (briefing + session log + ADR + roadmap)
- `~/Obsidian/SecondoCervello/_MOC/_NextSession.md` (briefing volatile prossima sessione)
- `~/.claude/projects/-Users-trilligianni-Desktop-claude-SDF/memory/project_salute_di_ferro.md`

## Output mode default

Caveman full attivo per concisione. User dice "normal" o "stop caveman" per disattivare.

## Bloccanti esterni in attesa (Maggio 2026)

| Owner | Cosa | Stato |
|---|---|---|
| Antonio | Stripe Price su link `5kQ14ndlygbugy13Ug14403` = €24,99 | da verificare |
| Matteo | Copy 5 email + 9 immagini panel + chat WhatsApp Coach | atteso |
| Giuseppe | P.IVA + ragione sociale + indirizzo + lista Coach | atteso |
| Andrea+Simo | Timing PR Agente di Ferro | post beta workout fine maggio |

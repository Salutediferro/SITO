# Guida rapida — Modificare il sito TestSalute

## Setup iniziale (una volta sola)

1. Apri il Terminale
2. Installa GitHub CLI: `brew install gh`
3. Autenticati su GitHub: `gh auth login` (scegli GitHub.com → HTTPS → Login with browser)
4. Clona il repo: `git clone https://github.com/Salutediferro/SITO.git`
5. Entra nella cartella frontend: `cd SITO/frontend`
6. Installa le dipendenze: `npm install`
7. Avvia il sito in locale: `npm run dev`
8. Apri il browser su http://localhost:5173 per vedere il sito

## Ogni volta che lavori

1. Apri il Terminale e vai nella cartella: `cd SITO`
2. Scarica le ultime modifiche: `git pull`
3. Avvia il sito in locale: `cd frontend && npm run dev`
4. Apri un secondo Terminale nella cartella SITO e lancia Claude Code: `claude`
5. Chiedi a Claude le modifiche che vuoi fare
6. Quando hai finito, salva le modifiche su GitHub:
   - `git add -A`
   - `git commit -m "Descrizione della modifica"`
   - `git push`

## Struttura del progetto

- frontend/src/pages/ — le pagine del sito
- frontend/src/components/ — i componenti riutilizzabili (hero, navbar, quiz, ecc.)
- frontend/src/constants/ — testi, dati quiz, FAQ, pannelli
- frontend/src/styles/ — CSS globali

## Regola d'oro

Prima di iniziare a lavorare: `git pull`
Appena finito: `git push`

Questo evita conflitti quando si lavora dallo stesso account.

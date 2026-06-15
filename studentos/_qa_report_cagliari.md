# QA — Università di Cagliari (test.cagliari@studenti.unica.it)

Onboarding: dev-login → /onboarding. Ateneo "Università di Cagliari" (rilevato da email, ✓); corso "Informatica (triennale)" (sync live); 2° anno; Triennale 180. Conferma → sync.

## Dati sincronizzati (IndexedDB)
- classEvents: **323**, anni **1/2/3** — es. "MATEMATICA DISCRETA"
- examCalls: **33**, anni **1/2/3** — es. "ARCHITETTURA DEGLI ELABORATORI"
→ orario + appelli per tutti gli anni. OK. (Meno appelli di Firenze ma presenti su ogni anno — dato reale, non un bug.)

## Bug / anomalie
- Stessi item globali di Firenze: "Apri Delphi" presente (non pertinente a Cagliari); Link utili = fallback MIUR (preset Cagliari senza `links`).
- Nessun bug ateneo-specifico. Onboarding + sync OK.

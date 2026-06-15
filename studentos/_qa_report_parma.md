# QA — Università di Parma (test.parma@unipr.it)

Onboarding: dev-login → /onboarding. Ateneo "Università di Parma" (rilevato da email, ✓); corso "Informatica" (sync live); 2° anno; 180. Conferma → sync.

## Dati sincronizzati (IndexedDB)
- classEvents: **342**, anni **1/2/3** — es. "FONDAMENTI DI PROGRAMMAZIONE B"
- examCalls: **168**, anni **1/2/3** — es. "ARCHITETTURA DEGLI ELABORATORI"
- syncMeta: tutte e 6 le sorgenti (informatica-orario/esami-anno-1/2/3) `ok:true`.
→ orario + appelli per tutti gli anni. OK.

## Bug / anomalie
- **Sync più lenta**: a +9s i dati erano ancora 0; completi a ~+20s. Il base host-only `agendastudenti.unipr.it` risponde più lentamente. Non è un bug — la UI mostra "Sincronizzazione…" durante l'attesa — ma conferma che l'indicatore di sync è utile (non rimuoverlo del tutto in Fase 2).
- Stessi item globali: "Apri Delphi" presente; Link utili = fallback MIUR.

# QA — Tor Vergata (controllo) (test.tv@studenti.uniroma2.it)

Onboarding: dev-login → /onboarding. Ateneo "Tor Vergata" (rilevato da email, ✓); corso "Informatica (triennale)" (già selezionato di default, sync live); 2° anno; 180. Conferma → sync.

## Dati sincronizzati (IndexedDB)
- classEvents: **317**, anni **1/2/3** — es. "INFORMATION RETRIEVAL"
- examCalls: **56**, anni **1/2/3** — es. "FISICA"
- syncMeta: `orario-anno-1/2/3`, `esami-anno-1/2/3`, **`avvisi-dipartimento`** — tutte `ok`. (TV è l'unico con sorgente news; usa id "bare" — preset Informatica legacy.)
→ orario + appelli (+ avvisi) per tutti gli anni. OK.

## Bug / anomalie
- "Apri Delphi" qui è pertinente (TV usa Delphi) ma sarà comunque sostituito da "Vai al portale" in Fase 2 (uniforme per tutti gli atenei, TV portalUrl = delphi/web.uniroma2.it).
- TV ha `links` reali (Delphi + portale) → Link utili contestuali (ok, a differenza degli altri che usano il fallback MIUR).
- Nessun bug ateneo-specifico.

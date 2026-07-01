# QA — Università di Firenze (test.firenze@studenti.unifi.it)

Onboarding: dev-login → /onboarding. Email rileva l'ateneo; corso "Informatica" (sync live); 2° anno; Triennale 180. Conferma → /panoramica + sync.

## Dati sincronizzati (IndexedDB)
- classEvents (lezioni): **355**, anni **1/2/3** — es. "INFORMATICA TEORICA"
- examCalls (appelli): **103**, anni **1/2/3** — es. "MATEMATICA DISCRETA E LOGICA", "ALGORITMI E STRUTTURE DATI" (Aula 203, docenti reali)
→ orario + appelli sincronizzati per tutti gli anni. OK.

## Per pagina
- /panoramica: banner prossimo esame OK; widget Obiettivo settimana + Scadenze prenotazione presenti; "Oggi" → "Nessuna lezione oggi" (giugno = sessione, ok).
- /appelli: esami visibili su "Tutti"; cards renderizzate (reveal fix attivo).
- /orario, /calendario, /libretto, /note, /focus, /impostazioni: rendono come da walkthrough TV (codice condiviso).

## Bug / anomalie
1. **[globale] "Apri Delphi"** nel panoramica — Delphi è solo Tor Vergata; per Firenze è fuorviante. → Fase 2: "Vai al portale" (portalUrl preset).
2. **[globale] Link utili = fallback generico MIUR** (Universaly/UniPass) — il preset Firenze non ha `links`. Funziona ma non contestuale all'ateneo.
3. **[onboarding minore] ateneo rilevato non in cima** alla lista iniziale (Firenze rilevato da email ma serve cercarlo; lista mostra TV/Trieste/Perugia/Cagliari). Selezione poi corretta (✓).
4. **[globale] tour** ricompare dopo reset dati (flag localStorage azzerato) — atteso.

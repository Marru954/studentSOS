---
name: ricattura-ateneo
description: Procedura per ricatturare e ricontrollare i codici EasyAcademy di UN ateneo (preset in studentos/src/lib/sync/universities) con tools/ea-verify, un ateneo alla volta, con STOP e via libera dell'utente prima del successivo.
---

# ricattura-ateneo

Usa questa procedura quando i preset EasyAcademy vanno riallineati (nuovo anno accademico, ricontrollo mensile,
segnalazione "orario vuoto"). Un ateneo alla volta. Tool: `studentos/tools/ea-verify/` (vedi il suo README).
Tutti i comandi si lanciano da `studentos/` con `./node_modules/.bin/tsx tools/ea-verify/cli.ts ...`.

## Regole permanenti (non negoziabili)

- **File protetti, mai modificare:** `src/lib/sync/adapters/easyacademy.ts`, `src/lib/sync/engine.ts`,
  `src/lib/storage/db.ts`, i test esistenti in `tests/`, `package.json` (salvo aggiungere un nuovo test al comando
  `test`), `scripts/`. Nessuna nuova dipendenza npm. Nessun merge su `main`, nessun push.
- **Nessun codice inventato.** `scuola`/`corso`/`anno2` vengono solo dal catalogo del sistema e valgono solo se un POST
  reale torna `celle` (orari) o `Appelli` (esami). Non dedurre, non "aggiustare a mano" un codice.
- **Live = celle > 0 in almeno una settimana della finestra** (default 28-09 -> 30-11, 10 lunedi'). Una cella isolata
  fuori finestra non basta. Sorgenti che non lo soddisfano vengono rimosse (anni) o il corso esce da `livePrograms`,
  con motivo e codici originali nel coverage md.
- **Esami rigidi:** `exams:true` solo se `test_call` ha appelli nella finestra del nuovo anno. Niente fallback
  sull'anno precedente. Anni senza appelli su un corso con esami restano a rischio del bug noto dell'adapter
  (`Insegnamenti:[]` -> errore zod): vanno elencati nel report, non corretti (file protetto).
- **Combo vuoto** (il sistema non ha ancora l'anno): il preset passa a modalita' manuale, non si forza l'anno.
- **Nessun URL EasyAcademy letterale** nel codice o nei documenti (i muri #4 di `safe-merge.sh` li bloccano):
  gli endpoint si costruiscono a runtime dal `baseUrl` del preset. Il tool lo fa gia'.
- **Casi ambigui = chiedere.** Piu' corsi del catalogo che verificano per lo stesso anno, nomi che non combaciano
  (`NAME_MISMATCH`), programmi `special` (forma non standard): fermarsi e domandare, non scegliere.
- **Gate verde prima di ogni commit:** `npm run build`, `npm test`, `./node_modules/.bin/tsc --noEmit`, `npm run lint`.
  Un commit per ateneo, soggetto in italiano `<ateneo>: <descrizione>`, con la riga
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`. Aggiornare `docs/stato/STATO.md`.
- **Concorrenza massima 3** con pausa tra le richieste: non stressare i server degli atenei.

## Procedura (un ateneo)

1. **verify** (sola lettura): `tools/ea-verify/cli.ts verify <presetId> [--aa AAAA]`. Scrive lo snapshot in
   `src/lib/sync/universities/_verify/<presetId>.json` e stampa il riepilogo. Leggere i flag:
   `COMBO_EMPTY`, `NO_CELLS`, `PARTIAL`, `CODE_MISSING_IN_COMBO`, `ANNO2_STALE`, `NAME_MISMATCH`,
   `SCUOLA_NOT_IN_COMBO`, `EXAMS_EMPTY_ARRAY_RISK`, `NET_ERROR`. Se ci sono `NET_ERROR`, rilanciare (rete), non decidere.
2. **diff**: `tools/ea-verify/cli.ts diff <presetId>` confronta con lo snapshot committato (sorgenti passate da live a
   vuote, nuovi corsi, codici rinumerati). E' il resoconto dei cambiamenti.
3. **apply dry-run** (default): `tools/ea-verify/cli.ts apply <presetId>`. Mostra il piano: anni invariati,
   aggiornati, ricatturati (con il POST reale che li conferma), rimossi con motivo, ambigui, esami -> solo-orari o
   attivabili, eventuale passaggio a manuale.
4. **Revisione umana del piano.** Controllare a campione le ricatture (nome del corso e codice sensati?), gli ambigui
   e i `special`. Dubbi -> chiedere all'utente prima di scrivere.
5. **apply --write** solo dopo la revisione: riscrive il preset e il coverage md (sezione "Ri-verifica" con codici
   originali per il ripristino). Se il combo e' vuoto il preset diventa manuale e i codici restano in una const di
   ripristino esportata.
6. **Gate** in `studentos/`: build, test, tsc, lint (tutti verdi).
7. **Commit unico** `<ateneo>: ...` che include preset, coverage md, snapshot `_verify/<id>.json` e STATO.md.
8. **Controllo in app** (con `npm run dev` e un browser, se disponibile): onboarding (l'ateneo/corso compare come
   "sync live" solo se davvero live, altrimenti "manuale"), `/orario` (lezioni presenti per l'anno scelto),
   conflitti d'orario (solo tra lezioni dello stesso anno), badge/banner errori di sync (nessun errore inatteso; gli
   `Insegnamenti:[]` noti vanno riportati). Senza browser, dirlo esplicitamente nel riepilogo.
9. **Riepilogo** nel formato consueto: programmi/anni prima -> dopo, rimossi (elenco), ricatturati, esami attivi vs
   solo-orari, sorgenti a rischio bug adapter, celle/settimana per un campione, anomalie, problemi incontrati.
10. **STOP.** Attendere il via libera esplicito dell'utente prima di passare all'ateneo successivo. Non lanciare
    `verify all` come preludio a modifiche: `verify all` + `diff all` servono solo al ricontrollo mensile in sola lettura.

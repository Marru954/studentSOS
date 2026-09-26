# ea-verify

Strumento per verificare, confrontare e (opzionalmente) riallineare i preset EasyAcademy di
`src/lib/sync/universities/`. Nessuna dipendenza npm nuova; si esegue con `tsx` dalla cartella `studentos/`.

```
./node_modules/.bin/tsx tools/ea-verify/cli.ts <comando> <presetId|nome-file|all> [opzioni]
```

Il preset si indica con l'id (`unisa-informatica`) o col nome del file (`unisa`). Gli URL non sono mai scritti nel
codice: si costruiscono a runtime dal `baseUrl` presente nelle sorgenti del preset (anche per i preset gia' passati a
manuale, dalla const di ripristino).

## Comandi

### `verify <presetId|all>` (sola lettura)
Scarica il catalogo dell'anno (`--aa`, default = anno accademico corrente) e, per OGNI sorgente orario dei
`livePrograms`, fa un POST all'endpoint di griglia per ciascun lunedi' della finestra (`--from`/`--to`, default
28-09 -> 30-11), poi un POST esami per ogni sorgente esami (finestra 01-10 -> 30-09 dell'anno dopo, niente fallback
sull'anno precedente). Concorrenza massima 3 (`--concurrency`), pausa tra richieste (`--pause`, default 150 ms),
timeout 45 s, 2 retry, User-Agent onesto. `--fast` ferma ogni sorgente alla prima settimana con celle (meno richieste,
snapshot senza profilo settimanale completo: non usarlo per gli snapshot da committare).

Scrive lo snapshot in `src/lib/sync/universities/_verify/<presetId>.json` (dati versionati con data e parametri) e
stampa un riepilogo. Flag:

| Flag | Significato |
|---|---|
| `COMBO_EMPTY` | il catalogo dell'anno e' vuoto: il sistema non ha ancora l'anno |
| `NO_CELLS` | 0 celle in tutte le settimane della finestra |
| `PARTIAL` | celle in meno del 50% delle settimane dopo la prima con celle, o crollo finale |
| `CODE_MISSING_IN_COMBO` | il codice `corso` non e' piu' nel catalogo |
| `ANNO2_STALE` | gli `anno2` del preset non sono quelli attuali del catalogo |
| `NAME_MISMATCH` | il nome del programma non somiglia al nome del corso col stesso codice |
| `SCUOLA_NOT_IN_COMBO` | la `scuola` del preset non compare nel catalogo (solo se il catalogo espone le scuole) |
| `SEPT_ONLY_EXAMS` | informativo: appelli solo dal 1 al 30 settembre (coda dell'anno precedente), nessuno da ottobre. Non e' mai usato da `apply` per cambiare `exams` |
| `NET_ERROR` | richiesta fallita: rilanciare, non decidere |

### `diff <presetId|all>` (sola lettura)
Confronta lo snapshot locale (appena generato) con quello dell'ultimo commit (`--against file.json` per un altro
riferimento): sorgenti passate da live a vuote (e viceversa), nuove/sparite, celle dimezzate/raddoppiate, flag
cambiati, nuovi corsi nel catalogo, corsi spariti, codici rinumerati (stesso nome, codice diverso), nomi cambiati.

### `apply <presetId> [--write]`
Di default **dry-run**: costruisce il piano dallo snapshot, con POST reali solo sui candidati di ricattura
(stesso codice con `anno2` aggiornato; poi corsi con nome normalizzato uguale e tipo compatibile, stessa scuola
prima). Una ricattura vale solo se il POST torna celle; se piu' candidati verificano e non si distinguono e' un caso
**ambiguo**: non viene applicato e va deciso a mano. Regole: anni senza celle rimossi; `exams:false` dove non ci sono
appelli; preset -> manuale se il catalogo e' vuoto o non resta nessun anno live. Con `--write` modifica il file preset
e il coverage md (sezione "Ri-verifica" con i codici originali per il ripristino). I programmi in forma non standard
(`special`: ID senza slug, sorgenti news, ecc.) non vengono mai riscritti, solo segnalati.

Dopo `--write`: gate (build, test, tsc, lint), commit, controllo in app. Vedi la skill `ricattura-ateneo`.

## Ricontrollo mensile (sola lettura, nessuna modifica ai preset)

1. `./node_modules/.bin/tsx tools/ea-verify/cli.ts verify all` (una volta al mese e a inizio semestre; richiede
   alcune decine di minuti perche' le richieste sono diradate; per un solo ateneo indicare il preset).
2. `./node_modules/.bin/tsx tools/ea-verify/cli.ts diff all` e leggere il resoconto: sorgenti passate da live a vuote,
   nuovi corsi, codici rinumerati, atenei con `COMBO_EMPTY`.
3. Riportare i cambiamenti (chi ha cosa) a chi decide; committare gli snapshot aggiornati solo se serve tenere
   la storia. **Non applicare nulla in automatico**: eventuali correzioni si fanno un ateneo alla volta con
   `apply` e la procedura della skill.

## Struttura

- `cli.ts` - comandi; `verify.ts` - scansione di rete e snapshot; `apply.ts` - piano e scrittura.
- `lib/` - parti pure e testate senza rete (`tests/eaVerify.test.ts`): parsing del catalogo, finestre di settimane,
  matching dei nomi, flag, diff degli snapshot, candidati, patch del preset, conversione a manuale, coverage md.
  Rete e costruzione degli endpoint in `lib/net.ts` e `lib/endpoints.ts`.

## Limiti noti

- Una sorgente ha una sola griglia per (scuola, corso, anno2): il tool non distingue lezioni di curricula diversi.
- La rilevazione dei nomi e' euristica (token normalizzati): `NAME_MISMATCH` e' un segnale, non una prova.
- La rete e' l'unica fonte di verita': un errore transitorio compare come `NET_ERROR` e va rilanciato.
- Le lezioni pubblicate solo piu' avanti (es. dicembre) non contano per la finestra di default: allargare
  `--to` se serve.

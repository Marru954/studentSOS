# Stato attuale StudentOS

Aggiornato: 2026-09-26 (sezione "Stile di comunicazione" in CLAUDE.md)

## Completati
### Sessione 2026-09-26 — stile di comunicazione (branch claude/stile-comunicazione-sessioni-dbbed3)
✅ Aggiunta a CLAUDE.md la sezione "Stile di comunicazione durante la sessione" (spiegazioni semplici dopo ogni gruppo di comandi). Solo docs, gate verde.

### Sessione 2026-09-26 (bis) — privacy: informativa `/privacy` + avvisi sui dati che escono (branch claude/gifted-carson-nkr5yq)
🐞 Causa radice: nessuna pagina privacy, e due funzioni che inviano dati fuori dal dispositivo senza dirlo, mentre footer e Impostazioni promettono "i tuoi dati restano su questo dispositivo". (1) L'Assistente manda a Groq (USA) messaggi + contesto (ateneo, corso, anno, prossimi esami, lezioni di oggi, media, CFU, minuti di Focus) senza alcun avviso. (2) "Importa PDF" di Orario/Appelli diceva "Niente viene caricato online", ma il testo estratto (≤16.000 caratteri) va a `/api/import-pdf` → Groq.
✅ `src/app/privacy/page.tsx` (server component, `Panel` del design system, h1 → 9 h2, tabella fornitori con caption e scope, link esterni con avviso sr-only): in breve, dati sul dispositivo, sync (solo codici ateneo/corso/anno), account facoltativo (Supabase `eu-central-1` Francoforte, verificato via MCP; RLS), Assistente e import AI (campi esatti dal codice), cookie tecnici (`srl_*` ~1 min, sessione Supabase), IP solo in memoria per il rate limit, log Vercel, font self-hosted, fornitori (Vercel/Supabase/Groq, URL delle informative verificati), basi giuridiche, conservazione, diritti + Garante, contatto `support@studentos.app`. Ogni affermazione ricostruita dal codice: client che chiama solo `/api/sync`, `/api/insegnamenti/sync`, `/api/assistente`, `/api/import-pdf` (`/api/alerts` non è usato dalla UI); nessun analytics.
✅ Avvisi al punto d'uso: nota sotto il compositore dell'Assistente (pagina e bubble), testo corretto nel dialog Importa PDF; link "Privacy" nel footer globale, nel login (con "profilo e dati di studio salvati in cloud, Supabase UE"), in Impostazioni → Privacy e dati (frase resa esatta: "Senza account…") e nella FAQ della landing; `/privacy` in sitemap (robots già la consente). CLAUDE.md: `/privacy` tra le route con la regola di tenerla allineata.
✅ Verifica nel browser (Chromium di `/opt/pw-browsers`): `/privacy` in tema scuro, chiaro e mobile 375px (niente scroll orizzontale), struttura dei titoli, tutti i testi nuovi letti dal DOM su landing FAQ, login, Assistente (pagina + bubble), dialog Importa PDF, Impostazioni; 0 errori console/pagina.

### Sessione 2026-09-26 — aggiornamento dipendenze vulnerabili (branch claude/gifted-carson-nkr5yq)
✅ `npm audit` da 1 critica + 8 alte + 1 moderata → **0 vulnerabilità**. `package.json` (autorizzato dall'utente): `next` e `eslint-config-next` 16.2.9 → **16.3.6** (versioni esatte come prima; chiude gli avvisi alti su bypass di proxy/middleware con Turbopack e sulle Server Actions, e porta `postcss` 8.5.23 e `sharp` 0.35.4), `pdfjs-dist` ^6.0.227 → **^6.3.289** (avviso alto: esecuzione di JS aprendo un PDF malevolo, <6.2.108), `allowScripts` allineato a `sharp@0.35.4`. Il resto (`undici` via cheerio, `brace-expansion`, `browserslist`, `js-yaml`, `baseline-browser-mapping`) con `npm audit fix` non-breaking, solo lockfile.
✅ Letto `node_modules/next/dist/docs` prima di fidarsi: la 16.3 aggiunge funzioni (`io`, `catchError` stabile, `next/root-params`, cache su filesystem di default nelle build Turbopack), nessun cambio su `proxy`. Effetto collaterale: `next dev` riscrive il blocco gestito di `studentos/AGENTS.md` (committato, come chiede il blocco stesso; nota in CLAUDE.md).
✅ Verifiche: gate verde (build Next 16.3.6, 587 test, tsc, lint). pdfjs A/B: stesso PDF (generato dalla fixture Delphi) estratto con 6.0.227 e 6.3.289 → 285 elementi identici per testo, posizione e larghezza. Smoke test nel browser (Chromium headless di `/opt/pw-browsers` + playwright globale: il Playwright MCP cerca Chrome, assente qui): onboarding Tor Vergata → Informatica → 2° anno, 10 pagine, import PDF nel libretto ("4 esami superati trovati", come in Node: il worker pdfjs si carica con Turbopack), 0 errori di console/pagina/HTTP, log del server pulito. Screenshot controllati: landing, /orario (banner di sync parziale atteso: rete verso gli atenei bloccata), /panoramica (tour con blur del vetro), /insegnamenti.
⚠️ Branch remoto `auto/hook-muri-4-5`: l'utente ne ha autorizzato la cancellazione (tutto il suo contenuto è su main, verificato con `git cherry` e confronto file), ma il proxy dell'ambiente chiude il push di cancellazione e il connettore GitHub non ha uno strumento per cancellare branch → da cancellare a mano (GitHub → Branches, o `git push origin --delete auto/hook-muri-4-5` in locale).

### Sessione 2026-09-25 (octies) — fix esami `Insegnamenti: []` + adapter Cineca UP dormiente (branch claude/gifted-carson-nkr5yq)
✅ Fix sync core (autorizzato dall'utente: "tutti i permessi"): `test_call.php` con `Insegnamenti: []` (PHP json_encode di un array associativo vuoto) faceva fallire l'intera sorgente esami ("expected record, received array") invece di dare 0 appelli. Ora `z.preprocess` legge qualsiasi array come il record equivalente; `null` e le altre forme restano un fallimento (una sorgente fallita conserva la cache, un successo vuoto la rimpiazzerebbe). Test `easyacademyExams` (5, riproduce il bug prima del fix). Registrato nel runner anche `examStatus.test.ts` (9 test verdi, mai eseguiti: mancava dallo script `test`).
✅ Adapter `cineca-up` (Cineca University Planner) DORMIENTE: registrato ma nessun preset → allowlist SSRF vuota per il provider, `/api/sync` rifiuta ogni sorgente UP (testato). Spec `docs/superpowers/specs/2026-09-25-adapter-cineca-up-design.md` con 7 punti da confermare su fixture reale. Scelte: finestre di 28 giorni (max 5 = 140 gg, come le 20 settimane EA) per restare nel budget di 25 s per sorgente; memo di processo 60 s condivisa tra sorgenti per-anno dello stesso calendario, solo forma ridotta degli impegni; orari senza fuso = ora di Roma (DST inclusa, indipendente dal TZ del server); lezioni annullate escluse lato server finché il campo non è confermato; `kind: "other"` finché il campo tipo non è confermato; id seedati con calendario + filtro anno (IndexedDB indicizza per solo `id` su tutte le sorgenti). Helper `upProgramSources` (gemello di `degreeSources`). Test `cinecaUp` (19, payload sintetici dichiarati come tali). Solo lato server: 0 chunk client con codice UP.
✅ `scripts/probe-cineca-up.ts` (sola lettura, autorizzato): robots, `clienteId`, la POST IDENTICA all'adapter (`impegniRequest`), rilievo dei campi reali (chiavi, docenti/aule, fuso, anni di corso, campi tipo/stato/annullato), esito di `readImpegno`; `--save` fixture grezza + `.sample.json`; `--harvest <pagine orari>` = censimento dei `linkCalendarioId` con data di creazione dall'ObjectId (i calendari ruotano ogni anno: quello "Informatica Triennale" di Pisa trovato online è del 2022). Provato end-to-end contro un server UP finto in locale.
⚠️ Rete: questo ambiente cloud nega gli host universitari (403 alla CONNECT, anche `easyutv.uniroma2.it` in produzione; WebFetch idem). Nessuna verifica live fatta oggi: né UP né il fix esami sui dati reali.
📊 Conteggi reali (`LIVE_COUNT`/`LIVE_PROGRAMME_COUNT`): 18 atenei live, 1484 corsi. CLAUDE.md corretto (diceva 19 / "oltre 1600": uniba è tornata manuale).
Gate verde a ogni commit (587 test, 48 file).
✅ **Mergiato su main il 2026-09-26 via PR #31** (merge commit `83485c8`), su richiesta esplicita dell'utente: `safe-merge.sh` aveva passato gate e muri #4/#5, ma il proxy git dell'ambiente cloud accetta push solo sul branch di lavoro (push di `main`: 403; push del tag `rollback/…`: connessione chiusa). **Nessun tag di rollback su origin**: lo stato di main prima del merge è `c6ac2cc` (rollback = `git revert -m 1 83485c8`, oppure reset a `c6ac2cc`). CI della PR verde (tsc, lint, test, build; E2E vuoto, v. In sospeso).
🔎 Controllo conflitti post-merge (sola lettura, `git merge-tree` contro il nuovo main), 2 branch remoti non mergiati, nessuno toccato:
   - `auto/hook-muri-4-5` (27-06): conflitti su `.claude/settings.json` e `studentos/package.json`, ma è la copia pre-rebase di lavoro già su main dal 2026-07-04 (v. sessione di quel giorno): residuo da cancellare (serve l'ok dell'utente, branch non mio).
   - `claude/ricattura-codici-2026-uyvllt` (25-09, altra sessione): 1 commit solo su STATO.md (tentativo di ri-cattura TV/Firenze/Federico II bloccato dallo stesso 403 di rete). Conflitto su STATO.md con questo merge: entrambe le sessioni si chiamano "octies" e riscrivono la riga "Aggiornato". Al suo merge: tenere entrambe le voci, rinominare la sua "nonies".

### Sessione 2026-09-25 (septies) — portato su main il branch easyacademy-preset-codes-2026 (branch sync/porta-branch-unifi)
✅ Portato dal branch (cherry-pick, 3 commit): `detectAlerts` non segnala più falsi conflitti d'orario tra anni diversi o canali paralleli ("(SG1:A-I)" vs "(SG2:J-Z)"); `state/synced.ts` + `storage/syncClient.ts` + `supabase/sync.ts`: una sync in volo non riscrive più i dati del vecchio ateneo dopo il cambio ateneo (contatore di generazione, `invalidate()`); test nuovi `alertsConflictYear`, `syncedInvalidate` registrati in package.json.
✅ Portati i file: `uniba.ts` in MODALITÀ MANUALE (combo 2026 vuoto e 0 celle in 10 settimane: wiring 2025/26 conservato in `UNIBA_LIVE_PROGRAMS_2025_26` per il ripristino), `ateneo-courses.ts`, i `_*_coverage.md` (unifi, unina, uniroma2, unisa, uniba: sezione "Ri-verifica 2026/27" con codici originali per il ripristino; nota in cima: i conteggi descrivono la ri-cattura manuale del branch).
✅ Preset unifi/unina/uniroma2: NON presi dal branch (conflitti su 4 file) ma quelli già rigenerati su main con `recapture-codes.ts --exams-rule`. Unisa: rigenerata ora con lo stesso tool (76 programmi, esami spenti su 124 anni).
   Differenza di criterio: il branch toglieva gli anni senza celle nelle 10 settimane 28-09..30-11 (più severo); main tiene un anno se ha celle in almeno una di 6 settimane campione (12-10, 09-11, 07-12, 02-11, 14-12, 08-03-2027). Anni in più su main = verificati vivi con POST reali, ma con orario potenzialmente pubblicato solo oltre ottobre.
⏳ In sospeso (dal branch): ~~BUG adapter `test_call.php` con `Insegnamenti: []`~~ **FATTO 2026-09-25 (octies)**; certificato di `easyacademy.unina.it` (curl CRYPT_E_REVOKED, Node ok); riattivare esami/Lettere Tor Vergata quando pubblicano.

### Sessione 2026-09-25 (quinquies) — contesto tecnico per pianificazione
✅ `docs/stato/CONTESTO_TECNICO.md` (solo lettura, nessun file applicativo toccato): albero `src/`, schema IndexedDB v3, preset Tor Vergata integrale, gate, rate limit (runtime: nessun delay, `Promise.all`; script: backoff 500ms×n, 4/host), 0 TODO, stack `idb` + Zustand senza `persist`. Mergiato su main (eb5f3eb, safe-merge, tag rollback/2026-09-25-192524). Nessun nuovo conflitto con altri branch (i conflitti di `easyacademy-preset-codes-2026-b21e85` sono quelli già noti).


### Sessione 2026-09-25 (sexies) — preset unifi/unina/uniroma2 con regola esami rigida (branch sync/regola-esami-3-atenei)
✅ Rigenerati con la stessa pipeline di `recapture-codes.ts` (orari rivalidati con POST reali, 6 settimane campione) + **regola esami rigida**: un anno tiene la sorgente esami solo se `test_call.php` ha appelli nel 2026/27 (finestra 01-09-2026..31-08-2027), nessun fallback sul 2025/26; un errore di rete non spegne. Granularità per ANNO (non per programma).
   - `uniroma2.ts`: l'helper locale `degreeSources` accetta ora `exams = true` (come nel branch unifi).
   - unifi: 173 programmi, esami spenti su 71 anni; unina: 101 programmi, 0 esami spenti (già tutto solo-orari dove serve); uniroma2: 47 programmi, esami spenti su 9 anni. Informatica (triennale) di Tor Vergata (hand-wired) non toccata.
✅ Il flag `--exams-rule` è ora permanente in `scripts/recapture-codes.ts` (autorizzato esplicitamente dall'utente il 2026-09-25: copia via Bash, il hook Muro #1 blocca Write/Edit in `scripts/`). Uso: `tsx scripts/recapture-codes.ts <report.json> --write --exams-rule <presetId>`; da rilanciare a sessione esami aperta per riattivare gli anni oggi spenti.
⚠️ Il branch `claude/easyacademy-preset-codes-2026-b21e85` fa lavoro equivalente su questi 3 preset: conflitti a mano da evitare, rigenerare da main.

### Sessione 2026-09-25 (quater) — merge su main + controllo conflitti con altri branch
✅ `claude/recattura-codici-2026` mergiato su main (508651d, safe-merge da worktree, tag rollback/2026-09-25-191250).
⚠️ Conflitti CON `claude/easyacademy-preset-codes-2026-b21e85` (altra sessione, non mergiato; controllo read-only `merge-tree`): `package.json`, `unifi.ts`, `unina.ts`, `uniroma2.ts`. Sovrapposizione semantica: quel branch ri-cattura a mano unifi/unina/uniroma2 (5-10 POST/settimana, toglie anni senza celle) e applica una "regola esami rigida" (esami solo-orari dove non ci sono appelli 2026/27) — mentre `recapture-codes.ts` su main tiene i flag esami. Ha anche fix non-preset (falsi conflitti d'orario in `detectAlerts`, sync in volo in `state/synced.ts`, test nuovi) che NON confliggono. Da fare al suo merge: rigenerare i 3 preset con `recapture-codes.ts` su main e riapplicare la regola esami, invece di risolvere a mano i conflitti dei file preset.
✅ Regola di autonomia post-merge scritta in CLAUDE.md e in memoria.

### Sessione 2026-09-25 (ter) — ri-cattura codici 2026 (branch claude/recattura-codici-2026)
🐞 Causa radice del /orario vuoto: i file preset contenevano il catalogo 2025 (codici `corso`/`anno2` rinumerati o corsi chiusi nel combo 2026), con solo `ANNO` bumpato.
✅ Nuovi tool (sola lettura di rete, nessuna dipendenza): `scripts/audit-codes.ts` (verifica ogni sorgente: check strutturale sul combo + POST grid_call su settimane campione) e `scripts/recapture-codes.ts` (rigenera i file preset dal combo 2026; continuità per CODICE+etichetta, nomi vecchi mantenuti; tiene solo anni con `celle>0`; aggiunge corsi nuovi verificati, esami spenti).
✅ 12 atenei riscritti (unica, unife, unifi, unige, unina, unipg, unipr, uniss, unistrasi, unitn, units, uniupo): audit indipendente dopo la riscrittura = 100% delle sorgenti di orario vive (prima ~55%). Nessun nome/id duplicato. Gate verde.
✅ Poi ri-catturati anche unive, unisa, uniroma2 (audit dopo: 100% vive; Tor Vergata: 26 corsi su 70 usciti, quasi tutti Lettere/Psicologia → probabile orario 2026/27 non ancora pubblicato: rilanciare `recapture-codes.ts` più avanti). 
✅ Fatti anche unicampania, unisalento, univpm (tool esteso: esami per anno, commenti ignorati nel confronto; audit dopo: 100% vive). Solo uniba resta sul 2025 (combo 2026 vuoto).
📊 Nuovo `scripts/audit-exams.ts` (sola lettura): su tutti gli atenei molte sorgenti esami danno 0 appelli sull'anno accademico 2026/27 (es. unisalento 31/78 con appelli, unicampania 12/25): a settembre le sessioni non sono ancora pubblicate → NON spente, da rilanciare a sessione aperta.
⚠️ Esami (`test_call`) non ri-verificati sui corsi nuovi (flag esami mantenuto o false).

### Sessione 2026-09-25 (bis) — pulizia autorizzata (6 commit, branch NON mergiato)
Autorizzazioni esplicite dell'utente su package.json / tests/esse3.test.ts (solo quelle).
✅ Fase 0: gate baseline verde (build, test, tsc, lint).
✅ Fase 1: script `gate` in package.json (`build && test && tsc --noEmit && lint`), stesso esito dei 4 comandi.
✅ Fase 2: rimosso `src/lib/esse3/parse.ts` + `tests/esse3.test.ts` + riga nello script test (grep: unico importatore = il suo test). CLAUDE.md aggiornato.
✅ Fase 3: rimossa `easyAcademyPreset()` da easystaff.ts (0 chiamanti di codice; tolto anche l'import `UniversityPreset` ormai inutilizzato). Interfaccia `EasyAcademyPresetConfig` lasciata (ora senza uso: candidata a rimozione). Corretti 2 riferimenti in commento/_coverage.md → `degreeSources`.
✅ Fase 4: `DelphiConnect` non più reso in LibrettoView (file su disco intatto). Verificato in browser (dev server, onboarding locale Tor Vergata): nessun buco nel layout. NB: build senza env Supabase → verifica da utente locale, non signed-in.
✅ Fase 5: hook con `${CLAUDE_PROJECT_DIR}` (nel merge con main è prevalsa la versione di main, PR #27, forma shell `"$CLAUDE_PROJECT_DIR/..."`, equivalente). Verificato lanciando lo script col payload → WARN Muro #4 (branch supervisionato). Le impostazioni hook si ricaricano a nuova sessione.
✅ Fase 6: `.gitignore` e CLAUDE.md allineati (uniportal, *.html e design-reference/ già cancellati: commit c09a303 / a96cbcf).
Gate verde prima di ogni commit. Nessun push, nessun safe-merge.


### Sessione 2026-09-25 (notte) — hook muro #1 + sync rispettoso (2 commit, branch chore/hook-muro1-sync-etico, NON mergiato)
✅ Muro #1 esisteva già (PR #26): aggiunta solo la copertura di NotebookEdit
   (`notebook_path`) in hook + matcher `.claude/settings.json` + 7 test
   (`hooks-muri-1-2`: 59). Autorizzato dall'utente in chat (scripts/, test esistente).
✅ Nuovo `src/lib/sync/http.ts` (`politeFetch`): User-Agent descrittivo, GET
   condizionali (ETag/Last-Modified salvati in cache di processo; 304 → corpo
   in cache servito come 200, mai un errore), 429/503 con Retry-After o backoff
   esponenziale (1s/2s/4s, max 3 retry, attesa > 10s = rinuncia), timeout/rete
   caduta: max 2 retry semplici. `redirect:"manual"` resta il default (SSRF).
   Cablato in `ical`, `wordpress-news` e `insegnamenti/discovery`. Test:
   `tests/http.test.ts` (11, nel runner).
✅ Cablato anche `easyacademy.ts` (`postForm` → `politeFetch`, unica riga di sync core,
   autorizzata dall'utente) + pausa per host (250ms tra richieste allo stesso
   ateneo, retry inclusi; verificato live su Tor Vergata: 3 POST a +199/+462/+659ms,
   UA inviato). I POST EasyAcademy e il WordPress di Tor Vergata non rispondono con
   ETag/Last-Modified/Cache-Control: un 304 live oggi non esiste (provato solo su
   server locale).
✅ Contatto nello User-Agent: email del maintainer (andre.namir.claude@gmail.com), su indicazione dell'utente.

### Sessione 2026-09-25 (sera) — hook muri #1 e #2 (2 commit, branch claude/hooks-muri-1-2-57b54d)
✅ Muro #1 (file intoccabili) → `scripts/hooks/check-protected-files.mjs`,
   PreToolUse Write|Edit, STRICT su qualsiasi branch. Protegge `db.ts`,
   `engine.ts`, `easyacademy.ts` (path verificati, univoci), `package.json`,
   tutto `scripts/` (tranne l'hook stesso) e i file di `tests/` GIÀ esistenti
   (i test nuovi passano). Sblocco caso-per-caso: `ALLOW_PROTECTED_EDIT=1`.
✅ Muro #2 (no merge/push diretto su main) → `check-main-protection.mjs`,
   PreToolUse Bash, STRICT, nessun override. Blocca `git merge` e `git push`
   verso main (`origin main`, `HEAD:main`, `+main`, `refs/heads/main`, push
   senza refspec da main); tokenizza il comando quote-aware, ricorre in
   `bash -c`, ignora heredoc → `safe-merge.sh` e messaggi di commit che
   citano "git merge" non danno falsi positivi.
✅ Wiring in `.claude/settings.json` con `$CLAUDE_PROJECT_DIR` (i due hook
   vecchi hanno ancora path assoluti Linux `/home/marru954/...`: non
   scattano su questa macchina — da allineare).
✅ Test: `tests/hooks-muri-1-2.test.ts` (52 test), aggiunto allo script `test`.
⚠️ Limiti noti: il muro #1 copre solo i tool Edit/Write, non scritture via
   Bash (`sed -i`, `>`); il muro #2 non copre `git pull` (fa merge) né
   `git update-ref`/`gh pr merge`.

### Sessione 2026-09-25 — bump anno accademico 2026/27 (1 commit)
🐞 Bug reale trovato: con `ANNO="2025"` ogni preset restituiva 0 celle per le
   settimane di settembre-dicembre 2026 (es. Tor Vergata Informatica H02: 0 con
   anno=2025, 12/6/7 lezioni con anno=2026) → /orario vuoto a semestre iniziato.
✅ Verifica live read-only di tutte le 3664 sorgenti di orario (anno=2026,
   settimane 12/10, 9/11, 7/12): **14 funzionanti prima → 1970 dopo**, 0 errori
   di rete. Nessun codice inventato: cambia solo il valore `anno`.
✅ `ANNO` → "2026" in 18 atenei. Unife: 14 percorsi abilitanti (a0xx/ab22/ac22)
   restano su `ANNO_2025` (con 2026 darebbero 0 celle: sarebbe una regressione).
⚠️ Uniba resta 2025: il combo 2026 di Bari risponde 0 corsi (rivalidare).
⚠️ ~1700 sorgenti danno ancora 0 con 2026: corsi chiusi o codici rinumerati nel
   catalogo 2026 (match `corso` col combo 2026: es. unistrasi 8/18, uniupo 55/104,
   unipg 70/98). Serve una ri-cattura dei codici dal combo 2026 (non c'è un
   generatore nel repo). Gli esami (test_call) non dipendono da `anno`: non toccati.
Gate: tsc/lint/477 test/build verdi.

### Sessione 2026-07-04 — backport migration drift 0004/0005 (1 commit)
✅ Le 2 modifiche di sicurezza applicate live il 2026-06-15 ma senza file nel
   repo ora esistono come migration, nella convenzione sequenziale del repo:
   - `0004_revoke_execute_handle_new_user.sql` — revoca EXECUTE su
     handle_new_user() da anon/authenticated/public (verbatim dallo statement
     registrato in tracking history 20260615214056).
   - `0005_rls_initplan_wrap_auth_uid.sql` — riscrive le 5 policy owner nel
     pattern initplan-safe `(select auth.uid())`; DROP POLICY IF EXISTS +
     CREATE POLICY con le definizioni ESATTE osservate in pg_policies (for all,
     ruolo public, using=with_check), sintassi identica a 0001_init.
   Nomi 000N (non timestamp): il repo NON usa timestamp, usa la sequenza
   0001/0002/0003 — i backport sono la loro naturale prosecuzione.
✅ Fase 3 (registrare le migration nella tracking history di produzione) è
   risultata MOOT: la produzione le traccia GIÀ (list_migrations mostra
   20260615214056 + 20260615214229 da giugno). Nessuna scrittura su produzione.
   Il drift era di sola DOCUMENTAZIONE (file mancanti nel repo), non di tracking.
⚠️ Verifica su branch dev IMPOSSIBILE: il branching Supabase richiede piano Pro
   (create_branch → PaymentRequiredException); nessun Postgres/Docker locale.
   Fedeltà stabilita per equivalenza statica contro 3 fonti concordi: statement
   registrati in tracking + pg_policies live + sintassi provata di 0001_init.
   Zero DDL eseguito su produzione (i file sono documentazione inerte: nessun
   processo li applica in automatico, la produzione ha già tutto).
⚠️ get_advisors (letto, NON toccato — fuori scope): rate_limits RLS senza
   policy (INFO, deny-by-default voluto); rate_limit_hit eseguibile da
   anon/authenticated (WARN, RPC del rate-limit AI intenzionale); Leaked
   Password Protection off (WARN, azione dashboard utente già nota).

### Sessione 2026-07-04 — consolidamento safe-merge.sh in wrapper (1 commit)
✅ `studentos/scripts/safe-merge.sh` non è più una copia divergente: sostituito
   il contenuto (64 righe, solo gate, SENZA muri) con un wrapper minimo che
   risolve la root (`git rev-parse --show-toplevel`) e fa `exec` sullo script
   canonico `scripts/safe-merge.sh` (176 righe, con muri #4/#5). Bit eseguibile
   preservato (100755). Ora non esiste più un percorso che mergia su main
   bypassando i muri. Divergenze prima presenti (tutte a favore del canonico,
   che il wrapper eredita): muri #4/#5, args via env DRY_RUN/SKIP_GATE/ALLOW_*,
   fetch --tags, tag annotato, push atomico main+tag, cleanup_tag su fallimento.
✅ Verifica comportamentale: su branch di prova con un URL non verificato
   aggiunto in src/, il wrapper lanciato da `studentos/` con DRY_RUN=1
   SKIP_GATE=1 riporta `muro #4: FAIL` ed esce 1 — identico allo script root.
   Caso pulito (nessuna violazione): muri #4/#5 PASS. Branch di prova scartato.
✅ CLAUDE.md aggiornato: la nota "copia più vecchia SENZA muri, non usarla" →
   "wrapper che fa exec sul canonico, lanciarlo da studentos/ o root è
   equivalente".

### Sessione 2026-07-04 — chiusura branch pendenti + allineamento docs (1 commit)
✅ auto/hook-muri-4-5 mergiato su main (fast-forward dc33d26..9640ec3, tag
   rollback/20260704-112314): hook PreToolUse per i muri #4 (dati EA inventati)
   e #5 (nuove dep npm) — .claude/settings.json + 2 script deterministici in
   scripts/hooks/ + 19 test (runner ora a 42 file). STRICT su branch auto/*,
   WARN su branch supervisionati. Rebase su main con conflitto package.json
   risolto (riga test di main + append hooks-muri.test.ts). Gate verde via
   safe-merge, branch locale eliminato (remoto lasciato: delete negato in
   auto-mode).
✅ Constatati GIÀ mergiati su GitHub prima della sessione (PR #22/#23/#24):
   muri #4/#5 dentro scripts/safe-merge.sh alla root repo + allowlist
   scripts/verified-endpoints.txt; copia semplice studentos/scripts/
   safe-merge.sh (solo gate, senza muri); recon Cineca-UP/GOMP.
✅ fix/groq-ratelimit: nei "Prossimi obiettivi" risultava da mergiare → in
   realtà GIÀ su main (4b61b54 + 8ba369f via merge 7643d78) e branch sparito
   da origin.
✅ Verificato live su Supabase (SQL read-only, 2026-07-04): migration
   rate_limits (20260701224925) e restrict_signup_domains (20260701225001)
   APPLICATE; tabella rate_limits + funzioni rate_limit_hit e
   hook_restrict_signup_to_university_domains presenti; RLS attiva su 6/6
   tabelle public (rate_limits 0 policy = deny-by-default via API). Chiuso
   anche il check grant #8: anon/authenticated hanno i grant DEFAULT di
   Supabase (tutti i privilegi) su ogni tabella — il muro effettivo è la RLS,
   com'è da progetto; revoke di hardening opzionale, non un bug.
⚠️ Scoperto (muro scripts/): doppio safe-merge.sh divergente — root repo
   (176 righe, CON muri #4/#5, repo-aware) vs studentos/scripts (64 righe,
   solo gate). → CONSOLIDATO il 2026-07-04 (v. sessione in cima: ora wrapper).
⚠️ Drift migrations: 2 migration applicate live il 2026-06-15
   (revoke_execute_handle_new_user, rls_initplan_wrap_auth_uid) non hanno
   file corrispondente in supabase/migrations/. → BACKPORTATO il 2026-07-04
   come 0004/0005 (v. sessione in cima).

### Sessione 2026-07-02 (pomeriggio) — fix review Panoramica, 12/12 (9 commit + 1 docs, branch fix/panoramica-review-fixes)
Implementati TUTTI i finding del report `_review_panoramica_2026-07-02.md`,
un commit per obiettivo, gate verde e verifica visiva Playwright su ognuno:
✅ #1 Overlay in portal su document.body (containing block da .anim-page →
   dialog sotto il fold), max-w sul dialog, scroll-lock; scoperto e chiuso
   anche un bug di build: il -webkit-backdrop-filter scritto a mano faceva
   scartare a lightningcss la proprietà standard → GLASS SENZA BLUR in
   tutta l'app (dev) / solo -webkit- (prod). Ora blur verificato nel bundle.
✅ #2 Panoramica scoped sull'anno del profilo (matchesYear) con toggle
   "mostra tutto il corso": badge 39→14, conflitti cross-anno non più
   segnalati come personali. #3 diffExamCalls scarta appelli passati
   (+4 test, package.json solo entry test). #4 hero "Iniziato alle HH:MM"
   senza CTA studia + badge sync relativo ("agg. 5 min fa") accessibile.
✅ #5 empty estivi: "Oggi" con prossima lezione/appello + self-start;
   "Scadenze prenotazione" montata solo se la fonte espone booking.
   #6 contrasti AA su glass (--ink-faint dark, --warn light, chip-warn
   light, nuovo token --signal-text per micro-link). #7 skeleton speculare
   alla griglia reale. #8 footer "N appelli in M corsi" sotto la lista.
   #9 tab mobile stesso vocabolario del desktop (Home/Materie/Appelli/
   Libretto) + pallino avvisi mobile ora rispetta hasOwnData + CLAUDE.md
   a 7 voci. #10 /design riscritta sui token immersive. #12 stagger solo
   alla prima visita per sessione.
Nota di metodo: mai lanciare `next build` con `next dev` attivo sullo
stesso .next — chunk serviti stantii (perso tempo su un falso negativo).

### Sessione 2026-07-02 — ricognizione Cineca-UP/GOMP sui 6 atenei target (solo docs, 1 commit)
Recon read-only (curl, robots-first, zero codice) su Sapienza/Bologna/PoliMi/PoliTo/
Padova/Pisa → report `_recon_cineca-gomp_2026-07-02.md` in root. Verificati live:
**Padova appelli funziona GIÀ con l'adapter EasyAcademy esistente** (test_call 200,
18 appelli reali — serve solo variante exams-only di degreeSources + decisione robots
`Disallow:/`); **Pisa Cineca UP contratto pubblico completo** (cercaPerDominio →
clienteId, POST getImpegniCalendarioPubblico → 760KB; parità confermata su unito,
enumerazione calendari 401 → GUID da censire a mano); **Sapienza pubblica** orario
JSON (`services/gomp/timetable-data/<id>`) + appelli HTML; Bologna endpoint JSON vivo
ma vuoto off-season (rivalidare a settembre), appelli HTML pubblici; PoliTo pubblico
ma WebForms/VIEWSTATE; PoliMi gated. Ordine di attacco consigliato: Padova → adapter
UP (Pisa) → Sapienza → Bologna (sett.) → PoliTo → PoliMi.

### Sessione 2026-07-02 — review Panoramica, voce studente + voce esperta (solo report, 1 commit)
Review indipendente di /panoramica dal vivo (Playwright: onboarding TV/Informatica
2° anno, sync reale 39 appelli, firstRun estivo, dark/light, desktop/mobile, confronto
HeroPreview) → report `_review_panoramica_2026-07-02.md` in root. Voti: studente 7/10,
esperto 6,5/10. Top finding: 🐞 tour/Overlay mis-ancorato (containing block da
.anim-page → dialog full-width sotto il fold), anno del profilo ignorato da hero/
timeline/conflitti, notice "nuovo appello" su date passate al re-sync, empty state
estivi che sfondano il bento (Oggi vuoto 534px), micro-contrasti AA su glass, /design
stantia. Lista prioritizzata 12 voci con fix concreti nel report. Nessun fix applicato
(scope: sola analisi).

### Sessione 2026-07-02 — audit sicurezza + remediation (5 commit, branch security/audit-remediation-2026-07-01, mergiato su main il 2026-07-02)
Audit difensivo Fase 0-1 (sola lettura, 4 agenti in parallelo: SSRF, XSS,
Supabase RLS, tracker) → report → Fase 2 fix solo sui finding approvati
dall'utente. Ogni commit build+test+tsc+lint verde. safe-merge NON lanciato
(diff revisionato dall'utente prima del merge).
✅ #1 SSRF redirect (commit 2479e70, **muro `easyacademy.ts` toccato su
   autorizzazione esplicita**): aggiunto `redirect:"manual"` all'unico fetch
   server-side che lo ometteva. Un 3xx da host allowlisted non può più
   rimbalzare su IP interno (169.254.169.254 ecc.); ora tratta il 3xx come
   fallimento sorgente, stesso pattern di ical/wordpress-news.
✅ #3 Auth Hook email istituzionale (commit 39d272a; migration poi applicata
   live e hook attivato il 2026-07-02): `supabase/migrations/0003_restrict_signup_domains.sql` —
   funzione Before User Created Hook che rifiuta il signup se il dominio non è
   nell'allowlist accademica (112 domini ESTRATTI da emailToAteneo.ts, suffix
   matching fedele a isUniversityEmail). Contratto verificato dai docs Supabase.
   Chiude il bypass del gate email lato client (anon key pubblica → signup
   diretto con @gmail.com). Attivazione manuale ESEGUITA il 2026-07-02
   (Dashboard → Authentication → Hooks → Before User Created, verificato
   end-to-end in produzione). ⚠️ DRIFT residuo: liste JS/SQL da tenere
   allineate a mano — istruzioni in testa al file.
✅ #2 Allowlist SSRF su host[:port] (commit 9b6befc): la membership confrontava
   solo `url.hostname`, ignorando la porta → `preset-host:9999` passava (host/IP
   identici), usabile come oracolo di port-scan. Ora usa `url.host`; il check
   DNS/IP resta sul bare hostname. In validateUrl.ts + insegnamenti/discovery.ts.
   +3 test tests/validateUrlPort.test.ts.
✅ #5 Allowlist SSRF scoped per providerId (commit ae34fff): tutti gli host di
   ogni provider erano in un unico Set → si poteva guidare un host allowlisted
   di un provider come sorgente di un altro (relay via adapter sbagliato). Ora
   `Map<providerId, Set<host>>`; validateSources valida ogni URL contro il set
   del providerId della sua stessa sorgente. allowedHosts() resta union per la
   discovery insegnamenti. +6 test tests/validateUrlProvider.test.ts (reiezione
   cross-provider deterministica).
✅ #4 undici CVE HIGH (commit 83df048): npm audit fix → undici 7.27.2 → 7.28.0
   (TLS bypass SOCKS5, header injection, cache poisoning). Solo package-lock.json,
   package.json intatto. 2 moderate postcss (via next) escluse: downgrade Next
   rompente.
Suite 448 → 454 test (+9 su 2 file nuovi). Verificati PULITI/GIÀ RISOLTI in
audit: rate-limit Groq (cookie HMAC + contatore Supabase 0002), .mcp.json (no
segreti), NEXT_PUBLIC_* (solo pubbliche), XSS (no rehype-raw, KaTeX trust:false,
sempre text-node), RLS Supabase (USING+WITH CHECK su ogni tabella), i 2 item del
tracker (selettori field + isOnboarded coerente).

### Sessione 2026-06-22 — batch-4 atenei + manifesto discovery (2 commit, branch feature/atenei-e-insegnamenti-batch-4)
✅ PARTE A — preset EasyAcademy (commit b5c9ec5): **Politecnica Marche LIVE**
   (`univpm-economia`, aule.univpm.it/agendastudenti). Combo 119 corsi sondati
   end-to-end con l'adapter reale → **55 programmi live, 35 con esami**
   (Economia/Scienze/Medicina/Agraria). Riforma 2025/26 "- primo anno" + corso
   base unite per-anno; esami PER-ANNO (blocco exams:true + blocco solo-orario).
   Ingegneria (41 corsi): 0 celle su ogni corso → manual. Atenei live: 18 → **19**.
   - Roma Tre: combo 33 corsi pieni ma 0/33 celle (`contains_data:0`) → manual
   - Tuscia: 0/51 celle → manual
   - unicampania: 12 corsi scoperti sondati, nessuna espansione pulita (8 celle=0,
     3 varianti riforma/coorte duplicate) → 17 invariati
✅ PARTE B — manifesto discovery (commit 3313426): fan-out 20 atenei (web+curl),
   5 con manifesto HTML server-rendered (isManifestoHtml, ri-verificato col
   contratto reale redirect:manual). Tutti id-corso OPACHI → corsoUrls mappa
   nome→URL CORSO-GATED (mai pagina di altro corso; niente `urls` ateneo-wide).
   - live+funzionanti: **unipg** (5 corsi), **uniupo** (2), **unistrasi** (2)
   - dormienti (no preset): unitus (GOMP, 5), uniroma3 (Fisica/Matematica)
   - 15/20 manual: SPA/Plone/Liferay/Joomla/Drupal-opachi, manutenzione (unitn),
     Radware bot-manager (uniba), Cineca-SPA (uniss) — dettagli in _coverage.md
   Confermato end-to-end: Informatica≠Chimica risolvono pagine diverse, corso
   ignoto → null (fallback manuale sicuro).
   → entrambi i commit build+test+tsc+lint verdi


### Sessione 2026-06-22 — hardening 4 blocchi (3 commit su main + 1 su branch)
✅ Blocco 1 (perf, commit efc84cf) — audit: il predicato "onboarded" era GIÀ
   consolidato nell'helper unico isOnboarded.ts (usato dai 3 gate FirstRunGate/
   PanoramicaTour/AuthCallback) e Dashboard/Libretto GIÀ su field selector. Gli
   unici consumatori whole-store rimasti erano FocusView e NotesView: convertiti
   a selettori per-campo (meno re-render, comportamento identico)
✅ Blocco 2 (test, commit b5271eb) — +11 file, +202 casi. Priorità protezione
   manuale sync insegnamenti: insegnamentiSync testa l'invariante (righe
   inserito/modificato_manualmente mai sovrascritte né rimosse; collisione
   logicalKey → riga in arrivo scartata; created_at preservato sui re-sync).
   + parser (helper puri; parseManifestoHTML resta non testabile headless = no
   DOMParser), discovery (slugify/isManifestoHtml/guardia SSRF), libretto,
   sources, academicYear, emailToAteneo, booking, storage/diff, sync/util,
   state/manual. Aggiunti solo `export` per testabilità (runtime invariato)
✅ Blocco 3 (jsdoc, commit 8fcdcf0) — JSDoc a ~85 export prima non documentati
   in 29 file di src/lib (solo commenti, zero modifiche al codice). Regola di
   protezione manuale documentata esplicitamente. Cleanup = no-op verificato:
   1 solo console.log (intenzionale, logger.ts), 0 import inutilizzati, 0 TODO
✅ Blocco 4 (rate-limit, branch fix/groq-ratelimit, commit 4b61b54, mergiato
   su main via 7643d78) — contatori globali del proxy AI (cb/minuto +
   cap/giorno) spostati da in-memory per-istanza a contatore DISTRIBUITO su
   Supabase: migration 0002 (tabella rate_limits + funzione SECURITY DEFINER
   rate_limit_hit, UPSERT atomico, RLS deny-by-default) + distributedRateLimit.ts
   wired in aiGuard. Chiavi server-side non spoofabili; fixed-window;
   fail-open-verso-backstop in-memory. Migration 0002 applicata live il
   2026-07-01 (verificata via SQL il 2026-07-04)
   → ogni blocco build+test+tsc+lint verde prima del commit



### Sessione 2026-06-18 — audit performance landing (1 commit)
✅ Finding A: la landing spediva l'intero catalogo atenei come JS client
   (Landing "use client" → UNIVERSITY_PRESETS via AteneoSearch/AteneoStrip).
   Fix: page.tsx (server) deriva ATENEI_LIST {name,live} e lo passa come prop;
   AteneoSearch/AteneoStrip/Landing ora ricevono props, nessun import del grafo
   preset nel client. Provato: marker grid_call/test_call/combo.php = 0 chunk
   client (prima in un chunk da 379KB)
✅ Finding B: AssistantBubble (globale, nascosto su /) importava staticamente
   AssistantChat (react-markdown+remark-gfm) → nel bundle iniziale di ogni
   pagina. Fix: next/dynamic ssr:false, chat caricata solo all'apertura.
   Verificato: bubble apre e chat si carica on-demand su /design
✅ Dimensioni SEO/a11y/best-practices già a posto (non toccate): lang=it,
   meta/OG, sitemap/robots, label/aria, route / statica, 0 errori console
   → build/test(197)/tsc/lint verdi, comportamento invariato

### Sessione 2026-06-18 — share card + social proof + SEO (1 commit)
✅ Share card Open Graph: src/app/opengraph-image.tsx (ImageResponse 1200x630,
   brand StudentOS, generata in casa, zero font/immagini esterni) + twitter-image
   (re-export) + metadata openGraph/twitter/metadataBase in layout.tsx. Ora il
   link condiviso mostra anteprima ricca (verificato: og:* e twitter:* nei meta,
   PNG 86KB)
✅ src/lib/site.ts: SITE_URL da env NEXT_PUBLIC_SITE_URL (fallback studentos.app)
✅ src/lib/liveAtenei.ts: LIVE_ATENEI + LIVE_COUNT da UNIVERSITY_PRESETS (fonte
   unica del numero reale = 18). AteneoStrip.tsx: striscia nomi atenei live
   ("Orari ed esami ufficiali di: Tor Vergata · Federico II · ...") sotto l'hero,
   social proof onesta (niente loghi/utenti inventati). Stat band ora usa
   LIVE_COUNT (niente più 18 hardcoded → niente drift)
✅ SEO: sitemap.ts (/, /login) + robots.ts (route app/private disallow) +
   meta description riscritta (atenei live + auto-sync + local-first)
   → build/test(197)/tsc/lint verdi, endpoint /opengraph-image /sitemap.xml
   /robots.txt verificati

### Sessione 2026-06-18 — micro-tagline hero (1 commit)
✅ Tagline "Il salvagente per la tua carriera universitaria." sotto il wordmark
   (accento --signal-2, fadeIn 120ms = prima riga leggibile): la metafora del
   salvagente si auto-spiega per chi arriva freddo. Copy-only, salvagente nel
   wordmark invariato

### Sessione 2026-06-18 — conversione + fiducia landing (1 commit)
✅ CTA di chiusura: banda finale "Pronto a partire? → Inizia ora" con riga di
   trust badge ONESTI (no account, offline, no tracking, dati sul dispositivo).
   La pagina non muore più sui trofei
✅ LandingFaq.tsx: 5 obiezioni (gratis? dati? offline? ateneo non c'è?
   registrazione?) con <details> native (zero JS, a11y da tastiera). La #4
   colma il dead-end "ateneo non trovato". Risposte local-first, niente promesse
   cloud
✅ Fix timing hero: fadeIn da 1500/1800/2000 → 250/350/450ms — value prop
   leggibile subito, il wordmark non resta da solo ~2s
✅ Footer: aggiunti "Domande frequenti" (/#faq) + "Contatto" (mailto), resta
   leggero (globale anche nelle pagine app)
   → build/test(197)/tsc/lint verdi, verificato in browser

### Sessione 2026-06-18 — hero product shot (1 commit)
✅ HeroPreview.tsx: mockup STATICO del panoramica in una finta finestra browser
   (pallini semaforo + URL studentos.app/panoramica), sotto il CTA dell'hero.
   Server component decorativo (aria-hidden), zero dati reali, zero immagini
   esterne, solo classi/token del design system (glass, gradient-ring,
   accent-top, grad-fill, chip, --signal-2). Replica NextExamHero (numerone "3
   giorni") + Carriera/CFU + Oggi + Appelli in arrivo. Verificato dark+light+
   mobile (impila), build/test(197)/tsc/lint verdi

### Sessione 2026-06-18 — landing UX (blind-test studente, 1 commit)
✅ CTA unificati: navbar "Inizia ora" → /onboarding (era /panoramica); i due
   bottoni gemelli non divergono più. Card Panoramica rietichettata "Anteprima"
   / "Guarda un esempio" (preview del panoramica, non ingresso primario)
✅ Riordino sezioni: Atenei + "Come funziona" salgono subito sotto l'hero (il
   gancio); Tutto-in-un-posto e Stats scendono; Traguardi resta ultimo
✅ Copy: sub-headline senza "sync forzato" ("già pronti per il tuo corso, senza
   account"); link secondario hero → ancora #atenei ("controlla se c'è il tuo
   ateneo") invece di Focus; banda stats riscritta (18 atenei sync live / 100%
   in locale / 1 file libretto), via "5 min setup"
✅ Trofei demoti: tile più piccoli (size-11, p-4), heading ridotto + eyebrow
   "Un piccolo extra" → sezione di chiusura, non headline feature

### Sessione 2026-06-17 — nav, assistente, polish UX (4 commit)
✅ Nav a 6 voci: Impostazioni → icona ingranaggio nel cluster destro,
   Assistente → bubble flottante (AssistantBubble, riusa AssistantChat compact),
   Calendario tolto dalla barra; cap segmentati "salvagente" alle estremità
✅ Fix race celebration: shift(key) key-guarded — l'auto-dismiss tardivo di uno
   scenic non ingoia più il toast accodato dietro
✅ Libretto: CareerStrip in due link fratelli (media → /libretto, trofeo →
   /libretto#trofei, niente <a> annidato); TrophyGrid delete a due step (arma 4s,
   Esc disarma); TrophyShowcase contatore "N/total"; EntryForm scroll-mt-24
✅ Docs: regole CLAUDE.md (local-first, validazione inline, aggiorna STATO.md)

### Audit precedente
✅ Fix SSRF su /api/sync
✅ 5 test fantasma aggiunti (suite: 35 file)
✅ SyncFailureBanner in /orario e /appelli
✅ isOnboarded(profile) unificato nei 3 punti
✅ Field selectors in Dashboard e LibrettoView
✅ Rate-limit fail-closed su XFF spoof

### Audit frontend completo (HIGH/MED/LOW, 3 commit)
✅ HIGH — azioni centrali non falliscono più in silenzio: try/catch + feedback
   su ManualLessonForm (scrive prima di cancellare → niente perdita dati),
   ManualExamForm, OnboardingFlow.finish (niente spinner bloccato), ImportExams,
   ImportDelphiPdf; Toast con live region sempre montata + danger=assertive
✅ MED — ImpostazioniView field selectors + rimosso doppione targetAverage;
   deep-link /note e /focus reattivi via key sul parametro; QuickAddFab match
   con confine + toast; BookingReminders niente permesso notifiche automatico
   (pulsante esplicito); Landing CTA mai invisibile; AssistantChat log
   aria-live=off + annuncio risposta completa a fine streaming
✅ LOW — Term sr-only gloss; NoteEditor annuncio "salvata"; OfflineBanner
   aria-live; token (AppFooter border-line, OfflineBanner text-warn,
   EmptyState bg-signal-dim); emoji rimossa da CalendarView; useScrolled guard;
   manual.upsert preserva ordine; memo FocusView + ExamTimeline

## In sospeso
- **Privacy — da completare dal titolare**: l'informativa dice "progetto indipendente" + `support@studentos.app`; il GDPR (art. 13.1.a) chiede anche l'identità del titolare (nome/ragione sociale e recapito). Decisione del proprietario, non inventata. Manca anche l'eliminazione dell'account dall'app (oggi su richiesta via email, dichiarato nella pagina).
- **Adapter Cineca UP — verifica live** (richiede rete verso `*.up.cineca.it` + siti
  unipi): `probe-cineca-up.ts --harvest` sulle pagine orari di Pisa → calendari 2026/27
  → probe `--save` → fixture reale committata + test che la parsa → correggere i 7 punti
  della spec → primo preset `unipi` con poche lauree verificate.
- Fix `Insegnamenti: []`: coperto da test, non ancora osservato live dopo il fix.
- Igiene: `src/lib/sync/util.ts` contiene un NUL letterale (separatore di `stableId`),
  per cui grep lo tratta come binario. L'escape `"\0"` darebbe la stessa stringa (id
  invariati). Non urgente.
- ~~Doppio safe-merge.sh da consolidare~~ **FATTO il 2026-07-04**:
  `studentos/scripts/safe-merge.sh` è ora un wrapper che fa `exec` sul canonico
  `scripts/safe-merge.sh` (root, con muri #4/#5). Nessun percorso bypassa più
  i muri.
- ~~Backport migration live nel repo~~ **FATTO il 2026-07-04**:
  `revoke_execute_handle_new_user` e `rls_initplan_wrap_auth_uid` ora esistono
  come `0004`/`0005` in `supabase/migrations/`. NB residuo minore: il repo usa
  la sequenza `000N` mentre la tracking history di produzione usa timestamp
  (20260615…/20260701…), e non c'è entry di tracking per `0001_init` — i due
  schemi di naming restano su binari diversi (il repo è documentazione di
  schema, non una sorgente `db push` sincronizzata 1:1 con il tracking).
- **Finding audit non ancora fixati** (decisione utente): ~~#7 postcss moderate~~
  (**RISOLTO il 2026-09-26**: Next 16.3.6 porta postcss 8.5.23); XSS hardening LOW (img
  component esplicito in NotePreview/AssistantChat, ordine strip/decode in
  htmlToText — difesa in profondità, non bug). Il check grant #8 è stato
  chiuso il 2026-07-04 (v. sessione in cima).
- **DNS-rebinding TOCTOU (#6, skip esplicito)**: lookup di validazione ≠ lookup
  di fetch; fix pieno = IP pinning + dispatcher custom = dipendenza nuova
  (vietata). Rischio residuo accettato.
- ProgressRing: id gradiente duplicato per ring stesso size+stroke (HTML non
  valido ma innocuo — gradienti identici). Fix corretto = useId, ma rompe i
  server component che lo usano (CareerSummary/CareerPanels). Lasciato così.
- Manual form (ManualExamForm/ManualLessonForm): validazione = submit disabilitato
  + return silenzioso. Accettabile (no fallimento silenzioso), ma non allineata
  al pattern inline-error di EntryForm. Valutare se uniformare.
- Deferred dall'audit (cambi architetturali, fuori scope su richiesta utente):
  filtri/stato in URL su tutte le pagine; deep-link a livello voce in
  SearchPalette; lazy-load AssistantChat; inert/scroll-lock sfondo Overlay.

## Prossimi obiettivi
- **Adapter Cineca UP live su Pisa** (poi Torino e gli altri 11 atenei UP): tutto il
  codice è pronto e dormiente, manca solo la verifica con rete (v. In sospeso).
- Estensione opzionale rate-limit: portare anche il bucket per-IP sullo store
  distribuito (oggi resta cookie-HMAC + in-memory). Il grosso è FATTO:
  branch mergiato e migration 0002 applicata live.
- Dopo UP, dal recon 2026-07-02: Sapienza (GOMP, adapter dedicato) → Bologna
  (rivalidare `@@orario_reale_json` ora che le lezioni sono partite) → PoliTo →
  PoliMi. Padova exams-only non richiede un adapter nuovo, ma prima serve una
  decisione esplicita sul suo `robots.txt` (`Disallow: /`).

## Registro decisioni

- **26/09/2026 — installato anthropics/claude-code-action in modalità full-write (contents+PR write) nonostante la regola 'nessuna sessione autonoma' — deroga esplicita del proprietario, trigger limitato a menzione @claude nei commenti, muri via hook .claude/settings.json restano attivi, branch protection su main raccomandata come backstop.**
- **2026-09-25 — adapter Cineca UP scritto prima della fixture, ma dormiente.** Senza rete verso gli atenei il contratto non si può verificare: il codice è pronto e testato su payload sintetici dichiarati, ma nessun preset può usarlo finché una risposta reale (probe `--save`) non è committata e parsata da un test. L'inerzia è garantita dall'allowlist SSRF (derivata dai preset) ed è coperta da un test.
- **2026-09-25 — muro #1 e #2: STRICT sempre** (non STRICT-solo-auto/WARN come #4/#5). Override esplicito solo per #1 via `ALLOW_PROTECTED_EDIT=1` (caso per caso, es. migration di db.ts autorizzata); nessun override per #2 (unica via: `scripts/safe-merge.sh` o PR).
- **2026-09-25 — sync rispettoso: client condiviso senza toccare il sync core.** `http.ts` cablato solo dove non serve editare muro #1; la cache dei validatori è in memoria di processo (il server è stateless, IndexedDB/db.ts intoccabili). Aperto: contatto reale nello UA; wiring in easyacademy.ts (+ pausa per-ateneo) da autorizzare. Semantica di `tests/` invariata (file esistenti bloccati, nuovi liberi; `package.json` resta bloccato: aggiunte al runner via patch fuori-tool).

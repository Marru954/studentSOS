# Stato attuale StudentOS

Aggiornato: 2026-09-25 (tooling ea-verify + ricattura 2026/27: uniroma2, unifi, unina, unisa; uniba manuale)

## Stato di fine sessione 2026-09-25 (ter) — leggere prima

Branch `claude/easyacademy-preset-codes-2026-b21e85`, NON mergiato su main, nessun push. Gate verde (build, tsc, lint, npm test) sull'ultimo commit di codice.

**Fatto in questa fase** (dopo la ri-cattura dei 3 atenei, descritta sotto):
- `87d6ce1` + `b105de6` — falsi conflitti d'orario. Causa: `scheduleConflictAlerts` (`domain/detectAlerts.ts`) confrontava tutte le lezioni dello
  stesso giorno. Ora salta le coppie di anni diversi (`yearOfSource`) e quelle con tag di canale diverso nel nome
  ("... (SG1:A-I)" vs "... (SG2:J-Z)"): sono alternative, lo studente ne segue una. Verificato in app: Tor Vergata (36 avvisi -> 0)
  e Federico II Ing. Informatica (169+ -> 0). Test: `tests/alertsConflictYear.test.ts` (nuovo, registrato in package.json).
  Restano possibili falsi conflitti tra curriculum diversi dello stesso anno senza tag (es. "Algoritmi per i Big Data" vs corso generico).
- `26b92ec` — sync in volo che riscriveva i dati del vecchio ateneo dopo il cambio. Causa: la sync partita al mount col vecchio preset finiva
  DOPO `clearSyncedCaches()` e riscriveva le sue righe; il guard `if (syncing) return` scartava la sync del nuovo preset.
  Fix: `useSynced.invalidate()` (contatore di generazione) chiamato da `clearSyncedCaches()`; `runSync(sources, range, shouldApply)`
  scarta i risultati obsoleti. Test: `tests/syncedInvalidate.test.ts` (nuovo, registrato). Non riprodotta dal vivo con un caso
  pulito: causa dedotta da log + timeline, fix coperto da test che falliscono senza la guardia.
- Verificati in app (browser, dati reali): Tor Vergata Informatica, Firenze Informatica, Federico II Ing. Informatica triennale.
  Federico II Ing. Informatica: solo orari (esami su Esse3), 192 lezioni, 14-set..23-ott.

**In sospeso**
- BUG adapter `test_call.php` con `Insegnamenti: []` -> "expected record, received array" -> sorgente in errore / badge "1 fonte in errore"
  (visto dal vivo su Firenze `informatica-esami-anno-2`). Fix pronto ma NON applicato: modificare `adapters/easyacademy.ts` e' stato
  bloccato dal classificatore dei permessi della sessione. Fix: in `examsResponse` avvolgere `Insegnamenti` con
  `z.preprocess((v) => (Array.isArray(v) && v.length === 0 ? {} : v), <schema attuale>)` + test dedicato per il caso `[]`.
  Serve una regola di permesso esplicita su quel file nelle impostazioni Claude Code.
- Replica della ri-cattura sugli altri 15 atenei EasyAcademy (stesso criterio: 10 POST settimanali per sorgente, un commit per ateneo);
  dipende dal fix dell'adapter. Uniba resta a 2025.
- Merge su main: `scripts/verified-endpoints.txt` non contiene gli host dei 3 atenei ricatturati (muro #4 di `safe-merge.sh`);
  servira' `ALLOW_UNVERIFIED_URLS=1` oppure aggiornare l'elenco a mano (scripts/ e' in area protetta: decisione dell'utente).
- Certificato di `easyacademy.unina.it`: `curl` fallisce con CRYPT_E_REVOKED (Node fetch funziona); da controllare.
- Riattivare esami/Lettere Tor Vergata/Informatica Federico II anni 1-2 quando pubblicano calendari e orari.

## Completati

### Sessione 2026-09-25 (bis) — ri-cattura codici 2026/27, 3 atenei (3 commit + questo docs)
Ripartenza dal punto aperto del bump anno: combo.php aa=2026 (GET reale) confrontato con i preset di
uniroma2 / unifi / unina, ogni anno-sorgente ri-verificato con POST reali grid_call.php (5 settimane
campione, basta una con celle) e test_call.php (finestra 2026/27, poi 2025/26 per distinguere
"calendario non ancora pubblicato" da "codice inesistente"). Verifica finale sui preset committati:
tutte le sorgenti orario rimaste tornano celle (uniroma2 111/111, unifi 397/397, unina 198/198).
- uniroma2: programmi 70 -> 44, anni-orario 168 -> 111 (9 ricatturati, 57 rimossi). Rimossa tutta
  FacoltadiLettereeFilosofia (codici invariati nel combo ma orari 2026/27 non ancora pubblicati) + Y44/AB2
  (Medicina, idem) + Q67/H53/L87 (assenti dal combo).
- unifi: programmi 189 -> 183, anni-orario 422 -> 397 (132 ricatturati: riforma, anno 2 ora sotto lo stesso
  corso dell anno 1; 25 rimossi). 5 programmi passano a solo-orari (nessun appello in nessuna finestra).
- unina: programmi 114 -> 106, anni-orario 225 -> 198 (84 ricatturati, 27 rimossi). Informatica triennale
  anno 3 (N86) vive sotto scuola Ingegneria-Fuorigrotta: due degreeSources nello stesso programma.
- Esami: un corso resta con esami se test_call ha appelli nel 2026/27 OPPURE (calendario nuovo non ancora
  pubblicato) nel 2025/26 con lo stesso codice: uniroma2 13 programmi e unifi 29 sono in questo stato
  ("🕓" nei coverage) -> ri-verificare a fine ottobre. uniroma2.ts: degreeSources locale ora accetta
  `exams=false` (non usato al momento).
- I file _<id>_coverage.md hanno in cima la sezione "Ri-verifica 2026/27" con tabelle live / ricatturati /
  rimossi (codici originali inclusi per il ripristino); le tabelle per scuola sotto sono lo storico 2025/26.
- Follow-up (stessa data): regola esami RIGIDA applicata, niente fallback 2025/26: exams:false per 13 programmi
  uniroma2 e 29 unifi (unifi 34 solo-orari in tutto; unina gia' tutto solo-orari). Elenchi nei coverage md
  (sezione "Corsi passati a solo-orari") per riattivarli quando pubblicano i calendari. Gate 480 test verdi.
- ID sorgente: tutti i degree dei 3 preset sono namespaced <slug>-orario/esami-anno-N (0 ID duplicati) tranne
  uniroma2 "Informatica (triennale)": NON e' easyAcademyPreset legacy ma la const hand-wired `informatica`
  con ID bare voluti (cache stabile, commento nel file); ha orario-anno-1..3 + esami-anno-1..3 + news.
  Nessun rename (orfanerebbe le cache esistenti).
- Pipeline reale (adapter con range di defaultSyncRange 2026-06-08..2027-01-23): orari pubblicati solo fino a
  ~23 ott 2026 (lezioni ottobre: Firenze Informatica 30/34/23, Ing. Informatica 205/43/55; Federico II Ing.
  Informatica 53/23/32, Informatica triennale anni 1-2: 0 lezioni in ottobre pur con celle a inizio periodo;
  Tor Vergata Informatica 36/18/21). Appelli in ottobre: 0 ovunque (sessioni a gennaio).
- BUG adapter (fix pronto nel working tree, in attesa di commit; poi non piu' un rischio): test_call risponde Insegnamenti:[] (array PHP) quando non ci sono
  appelli -> zod "expected record, received array" -> sorgente in errore/banner. Colpisce gli anni senza appelli
  nella finestra anche con exams:true (es. Firenze Informatica anno 2). Proposta: z.preprocess che mappa []->{}.
- unina Informatica (triennale) anni 1-2 (DE1): rimossi dai live. Ricontrollo 10 POST settimanali 28-09..30-11-2026: 0 celle
  ogni settimana (solo 1 cella il 07-12-2026); anno 3 (N86) resta con 9 celle/settimana. Attenzione: la verifica
  automatica usava anche le settimane 07-12 e 01-03: altri corsi unina/unifi/uniroma2 potrebbero essere verificati
  da una sola cella lontana (ri-controllo consigliato sulle celle/settimana).
- Ri-controllo settimanale su TUTTE le sorgenti orario (10 POST/settimana dal 28-09 al 30-11-2026, concorrenza 3;
  live = celle>0 in almeno una settimana, una cella isolata a dicembre/marzo non basta). Controllate/rimosse/restano:
  uniroma2 111/2/109 (Biotecnologie Agrarie AB3 intero, Chemical Nano-Engineering y1); unina 196/35/161 (18 corsi
  interi, quasi tutto CollegiodiScienze: Biologia, Chimica, Fisica, Matematica, Scienze Naturali...);
  unifi 397/11/386 (Sanita' Empoli/Pistoia, Medicina y1, Farmacia y5, Arch. magistrale y2...). Motivo + codici
  originali nella sezione "Ri-controllo settimanale" di ogni _<id>_coverage.md. 0 errori di rete. Le tabelle
  "live verificati" dei coverage md sono precedenti al ri-controllo (fa fede la nuova sezione).
- Uniba (Bari): combo aa=2026 risponde 200 ma con 0 corsi; 35 sorgenti orario x 10 settimane (28-09..30-11-2026), con anno 2025 e con
  2026: 0 celle ovunque; esami 0 appelli (giurisprudenza-esami-anno-1 andrebbe in errore per il bug adapter Insegnamenti:[]).
  Preset passato a MODALITA' MANUALE (liveSources:false, senza livePrograms; codici 2025 in UNIBA_LIVE_PROGRAMS_2025_26 per
  il ripristino): atenei live 19 -> 18, LIVE_PROGRAMME_COUNT -12 (derivati). Ri-verificare quando compare aa=2026.
- Uniba (Bari) -> modalita' manuale (commit dedicato). Unisa (Salerno, ANNO gia' 2026, combo 2026 con 146 corsi): programmi 111 -> 77,
  anni-orario 303 -> 184 (127 ricatturati: codici unificati anno1/2 e anno2 PDS0-2026, 119 rimossi: 34 programmi interi;
  verifica 10 settimane 28-09..30-11: 184/184 con celle). Esami: 27 programmi con appelli 2026/27, 50 passati a solo-orari;
  23 programmi con anni a rischio bug adapter (Insegnamenti:[]) elencati nel coverage md.
- ea-verify: EXAMS_EMPTY_ARRAY_RISK rimosso (bug adapter con fix in attesa di commit); aggiunto SEPT_ONLY_EXAMS informativo (appelli solo 1-30 settembre), mai usato da apply. Gli snapshot committati contengono ancora il vecchio flag fino al prossimo verify.
- TOOLING ea-verify (studentos/tools/ea-verify, test tests/eaVerify.test.ts, skill .claude/skills/ricattura-ateneo): verify (catalogo + 10 POST
  settimanali/sorgente + esami, snapshot in universities/_verify/<id>.json), diff (snapshot vs HEAD), apply (dry-run; --write riscrive preset +
  coverage; preset -> manuale se catalogo vuoto). Collaudo: unisa ricalcolato = 184/184 anni live, 27 programmi con esami, 0 blocchi da riscrivere
  (coincide col commit d818584); Bari (uniba-giurisprudenza) = COMBO_EMPTY, 35 sorgenti NO_CELLS. Finestra esami di default 01-10 -> 30-09.
  Ricontrollo mensile: verify all + diff all in sola lettura (README del tool). Limite: 1 ateneo alla volta per apply, i programmi special non si riscrivono.
- Esami riattivati (2026-09-26, solo attivazioni, nessuno spento; le 15 proposte solo-orari restano in sospeso): unifi 6 programmi (Biologia dell'ambiente e del comportamento magistrale + B232, Politica Istituzioni e Mercato, Statistica, Statistica e Data Science, Strategie di Comunicazione) e unina Scienze Dell'architettura.
- Da fare: stesse ri-catture per gli altri 15 atenei EasyAcademy (Uniba resta a 2025); ripristinare Lettere
  di Tor Vergata quando pubblicano gli orari; scripts/verified-endpoints.txt non contiene gli host di questi
  atenei (i muri #4 di safe-merge.sh potrebbero bloccare i diff con URL combo.php nei coverage md).
Gate: tsc/lint/477 test/build verdi. Nessun merge, nessun push.

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
- **Finding audit non ancora fixati** (decisione utente): #7 postcss moderate
  (richiede downgrade Next rompente → sconsigliato); XSS hardening LOW (img
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
- Estensione opzionale rate-limit: portare anche il bucket per-IP sullo store
  distribuito (oggi resta cookie-HMAC + in-memory). Il grosso è FATTO:
  branch mergiato e migration 0002 applicata live.
- Adapter Cineca-UP o GOMP, sessione supervisionata dedicata — ordine
  consigliato dal recon 2026-07-02: Padova (exams-only via adapter EA
  esistente) → Pisa/UP → Sapienza → Bologna (rivalidare a settembre) →
  PoliTo → PoliMi

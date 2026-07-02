# Stato attuale StudentOS

Aggiornato: 2026-07-02 (review Panoramica doppia voce + audit sicurezza)

## Completati

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

### Sessione 2026-07-02 — audit sicurezza + remediation (5 commit, branch security/audit-remediation-2026-07-01, NON merged)
Audit difensivo Fase 0-1 (sola lettura, 4 agenti in parallelo: SSRF, XSS,
Supabase RLS, tracker) → report → Fase 2 fix solo sui finding approvati
dall'utente. Ogni commit build+test+tsc+lint verde. safe-merge NON lanciato
(diff revisionato dall'utente prima del merge).
✅ #1 SSRF redirect (commit 2479e70, **muro `easyacademy.ts` toccato su
   autorizzazione esplicita**): aggiunto `redirect:"manual"` all'unico fetch
   server-side che lo ometteva. Un 3xx da host allowlisted non può più
   rimbalzare su IP interno (169.254.169.254 ecc.); ora tratta il 3xx come
   fallimento sorgente, stesso pattern di ical/wordpress-news.
✅ #3 Auth Hook email istituzionale (commit 39d272a, **migration NON applicata
   live**): nuova `supabase/migrations/0003_restrict_signup_domains.sql` —
   funzione Before User Created Hook che rifiuta il signup se il dominio non è
   nell'allowlist accademica (112 domini ESTRATTI da emailToAteneo.ts, suffix
   matching fedele a isUniversityEmail). Contratto verificato dai docs Supabase.
   Chiude il bypass del gate email lato client (anon key pubblica → signup
   diretto con @gmail.com). ⚠️ Attivazione MANUALE (Dashboard → Authentication
   → Hooks → Before User Created) + ⚠️ DRIFT: liste JS/SQL da tenere allineate
   a mano — istruzioni in testa al file.
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
✅ Blocco 4 (rate-limit, branch fix/groq-ratelimit, commit 4b61b54, NON merged)
   — contatori globali del proxy AI (cb/minuto + cap/giorno) spostati da
   in-memory per-istanza a contatore DISTRIBUITO su Supabase: migration 0002
   (tabella rate_limits + funzione SECURITY DEFINER rate_limit_hit, UPSERT
   atomico, RLS deny-by-default) + distributedRateLimit.ts wired in aiGuard.
   Chiavi server-side non spoofabili; fixed-window; fail-open-verso-backstop
   in-memory. Migration da applicare a deploy
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
- **Auth Hook #3 da attivare a mano** (post-merge): applicare
  0003_restrict_signup_domains.sql al progetto Supabase, poi collegarlo in
  Dashboard → Authentication → Hooks → Before User Created → Postgres →
  `public.hook_restrict_signup_to_university_domains`. La sola migration non
  cambia il comportamento auth finché l'hook non è collegato.
- **Finding audit non ancora fixati** (decisione utente): #7 postcss moderate
  (richiede downgrade Next rompente → sconsigliato); #8 verifica grant Supabase
  live (`information_schema.role_table_grants` sulle 5 tabelle, read-only, fuori
  codice); XSS hardening LOW (img component esplicito in NotePreview/AssistantChat,
  ordine strip/decode in htmlToText — difesa in profondità, non bug).
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
- Rate-limit distribuito: rivedere e mergiare il branch fix/groq-ratelimit, poi
  applicare la migration 0002_rate_limits.sql su Supabase (SQL editor / db push)
  PRIMA del deploy. Possibile estensione: portare anche il bucket per-IP sullo
  store distribuito (oggi resta cookie-HMAC + in-memory).
- Adapter Cineca-UP o GOMP (Sapienza, Bologna, PoliTo...)

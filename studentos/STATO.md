# Stato attuale StudentOS

Aggiornato: 2026-06-18 (landing 10/10: OG, atenei, SEO)

## Completati

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
✅ HeroPreview.tsx: mockup STATICO del cruscotto in una finta finestra browser
   (pallini semaforo + URL studentos.app/cruscotto), sotto il CTA dell'hero.
   Server component decorativo (aria-hidden), zero dati reali, zero immagini
   esterne, solo classi/token del design system (glass, gradient-ring,
   accent-top, grad-fill, chip, --signal-2). Replica NextExamHero (numerone "3
   giorni") + Carriera/CFU + Oggi + Appelli in arrivo. Verificato dark+light+
   mobile (impila), build/test(197)/tsc/lint verdi

### Sessione 2026-06-18 — landing UX (blind-test studente, 1 commit)
✅ CTA unificati: navbar "Inizia ora" → /onboarding (era /cruscotto); i due
   bottoni gemelli non divergono più. Card Panoramica rietichettata "Anteprima"
   / "Guarda un esempio" (preview del cruscotto, non ingresso primario)
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
- Adapter Cineca-UP o GOMP (Sapienza, Bologna, PoliTo...)

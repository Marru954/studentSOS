# Stato attuale StudentOS

Aggiornato: 2026-06-18 (landing UX blind-test fix)

## Completati

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

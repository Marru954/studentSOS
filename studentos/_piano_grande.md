# Piano grande — run autonomo notturno (2026-06-16)

Mentalità: "un nuovo utente con zero dati direbbe wow?" + "questa pagina è collegata o è un'isola?".

## Stato priorità
| # | Priorità | Stato | Commit |
|---|---|---|---|
| 1 | Filtro esami personale ("I miei esami") salvato + filtra ovunque | ✅ fatto | (P1) |
| 2 | Empty state che vendono (cruscotto/libretto/focus/note/orario/appelli) | ✅ fatto | (P2) |
| 3 | Collegare le pagine (note↔esame, focus↔esame, cruscotto→studia, appelli azioni) | ✅ fatto | (P3) |
| 4 | Fastidi utente (login persist, cache-first, freschezza, conferma del, manuale/sync, date IT, offline, override locale) | ✅ fatto* | (P4) |
| 5 | Gerarchia visiva cruscotto (hero asimmetrico, CFU 0% motivante) | ✅ fatto | (P5) |
| 6 | Consolida ridondanze (libretto obiettivo/proiezioni, ruolo calendario, orario vista lista) | ✅ fatto | (P6) |
| 7 | Focus verifica suoni/modalità/zen/combinabili | ✅ fatto | (P7) |
| 8 | Impostazioni complete (notifiche, obiettivi, formato, inizio settimana, export/import, info) | ✅ fatto | (P8) |
| T | Test multi-ateneo via script (Firenze sync; Bologna manuale; cambio ateneo reset) | ✅ fatto | (test) |

## Vincoli (CLAUDE.md)
- MAI editare: db.ts, tests/, package.json, scripts/, easyacademy.ts, engine.ts.
- Campi opzionali su oggetti già storati = schema-safe (no DB_VERSION bump). Niente migrazioni Supabase prod (store selezione in settings IndexedDB + degree_plan jsonb se serve mirror).
- Verde prima del commit: build, test, tsc, lint. Un commit per priorità. Auto-push.
- Design fisso (glass/aurora/Bricolage/token). A11y ovunque. Copy italiano. "use client" solo se serve.

## Note decisioni
- **P1**: `pinnedCourses` (già in AppSettings, IndexedDB) è la selezione "I miei esami". Wired in cruscotto (hero+ExamTimeline via `myExamCalls`), calendario (filtro + CoursePicker header), impostazioni (nuovo pannello "I miei esami"). Appelli/orario già usavano CoursePicker. Default [] = tutti (mai nascondere dati a sorpresa).
- **P1 cloud mirror RIMANDATO**: IndexedDB è source-of-truth offline-first e già ricorda tra sessioni. Il path Supabase è env-gated/dormiente (no env in dev) e infilare pinnedCourses nel jsonb `degree_plan` rischia gli invarianti di account-switch/reconcile. Basso valore, alto rischio → rimandato, non bloccante.
- **Fix pre-esistente**: `scripts/audit-render.ts` (non editabile) importava ancora `ProjectionPanel` (cancellato sessione scorsa) → tsc rotto a HEAD. Ricreato `ProjectionPanel.tsx` come shim re-export di `GoalPanel` (zero logica duplicata). Sblocca tutti i commit.

- **TEST multi-ateneo** (via script IndexedDB, non onboarding manuale): **Firenze** (`unifi-informatica`) sync live = 355 lezioni + 103 esami, sourceId namespaced `informatica-orario-anno-{1,2,3}`, le nuove feature reggono (9 deep-link "Studia per questo esame" con corsi Firenze, 0 badge "manuale" sui sync, 19 corsi nel picker "I miei esami"). **Bologna** (`unibo`) manuale = "Nessuna fonte attiva" + form manuale + toggle Griglia/Lista presenti. **Cambio ateneo** TV→Firenze→Bologna→TV: pulendo le cache sync nessun leak cross-ateneo (Firenze 355/103 senza dati TV residui, Bologna vuoto). Il reset reale dell'app (OnboardingFlow.finish→clearSyncedCaches) non è stato toccato. Cagliari non riprovato (engine identico; basta un ateneo sync per validare il path UI). Profilo TV ripristinato a fine test.
- **P8**: nuovi campi opzionali AppSettings (schema-safe, no DB bump): density, weekStartsOn, examReminders, reminderDaysBefore + aggiunti a settings.update(). Pannelli: Studio e obiettivi (ore settimanali → riusa lo store localStorage di WeeklyGoalCard, niente più orfano; + media obiettivo), Notifiche (promemoria appelli on/off → gate reale su BookingReminders nel cruscotto, + giorni prima), Aspetto esteso (densità comoda/compatta via `html[data-density]` + root font-size che scala tutto il rem; inizio settimana lun/dom → buildMonthGrid param opzionale + header calendario riordinato), Import backup (importBackup già esisteva → UI con ConfirmButton). Density verificata live (16px→15px). *reminderDaysBefore persistito ma non ancora consumato da un motore di reminder (in-app), documentato.
- **P7**: suoni ambient = Web Audio sintetizzato (reali, no file/network), verificati a video. Resi **combinabili** (più suoni insieme, mixati sul master con attenuazione MIX=0.5 anti-clipping; label "N attivi"). Modalità (Pomodoro/Deep Work/Flow/Sprint) e sessione immersiva (la pagina collassa sul timer, heatmap/suoni/selettore nascosti) verificate funzionanti.
- **P4**: freschezza SyncStatus ora "agg. gg/mm · HH:MM" (era solo ora). Badge "manuale" sulle card appello (sync vs inserito a mano). Banner offline gentile (useSyncExternalStore). Verificati GIÀ corretti (no codice): login-persist (`persistSession:true` in supabase/client.ts → la sessione sopravvive a chiusura browser), cache-first (StoreProvider idrata da IndexedDB e renderizza subito, poi sync in background), date sempre gg/mm/aaaa (format.ts tutto it-IT). Conferma eliminazione manual exam GIÀ wired (ExamList→onDelete→ConfirmButton). *override locale dato sync = rimandato.

## Saltato / impossibile
- P1 cloud mirror Supabase (vedi nota sopra) — IndexedDB copre il requisito funzionale.
- P4 "override locale di un dato sincronizzato sbagliato": rimandato. Richiede un livello di override persistente sopra le cache sync (che vengono rimpiazzate in blocco a ogni sync) + UI di edit su entità SYNCED. Rischio alto su engine.ts/diff/repo (zona da non toccare) per valore di nicchia. Documentato per follow-up.

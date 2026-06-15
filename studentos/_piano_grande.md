# Piano grande — run autonomo notturno (2026-06-16)

Mentalità: "un nuovo utente con zero dati direbbe wow?" + "questa pagina è collegata o è un'isola?".

## Stato priorità
| # | Priorità | Stato | Commit |
|---|---|---|---|
| 1 | Filtro esami personale ("I miei esami") salvato + filtra ovunque | ✅ fatto | (P1) |
| 2 | Empty state che vendono (cruscotto/libretto/focus/note/orario/appelli) | ✅ fatto | (P2) |
| 3 | Collegare le pagine (note↔esame, focus↔esame, cruscotto→studia, appelli azioni) | ✅ fatto | (P3) |
| 4 | Fastidi utente (login persist, cache-first, freschezza, conferma del, manuale/sync, date IT, offline, override locale) | ⏳ todo | — |
| 5 | Gerarchia visiva cruscotto (hero asimmetrico, CFU 0% motivante) | ⏳ todo | — |
| 6 | Consolida ridondanze (libretto obiettivo/proiezioni, ruolo calendario, orario vista lista) | ⏳ todo | — |
| 7 | Focus verifica suoni/modalità/zen/combinabili | ⏳ todo | — |
| 8 | Impostazioni complete (notifiche, obiettivi, formato, inizio settimana, export/import, info) | ⏳ todo | — |
| T | Test multi-ateneo via script (Firenze, Cagliari sync; Bologna manuale; cambio ateneo reset) | ⏳ todo | — |

## Vincoli (CLAUDE.md)
- MAI editare: db.ts, tests/, package.json, scripts/, easyacademy.ts, engine.ts.
- Campi opzionali su oggetti già storati = schema-safe (no DB_VERSION bump). Niente migrazioni Supabase prod (store selezione in settings IndexedDB + degree_plan jsonb se serve mirror).
- Verde prima del commit: build, test, tsc, lint. Un commit per priorità. Auto-push.
- Design fisso (glass/aurora/Bricolage/token). A11y ovunque. Copy italiano. "use client" solo se serve.

## Note decisioni
- **P1**: `pinnedCourses` (già in AppSettings, IndexedDB) è la selezione "I miei esami". Wired in cruscotto (hero+ExamTimeline via `myExamCalls`), calendario (filtro + CoursePicker header), impostazioni (nuovo pannello "I miei esami"). Appelli/orario già usavano CoursePicker. Default [] = tutti (mai nascondere dati a sorpresa).
- **P1 cloud mirror RIMANDATO**: IndexedDB è source-of-truth offline-first e già ricorda tra sessioni. Il path Supabase è env-gated/dormiente (no env in dev) e infilare pinnedCourses nel jsonb `degree_plan` rischia gli invarianti di account-switch/reconcile. Basso valore, alto rischio → rimandato, non bloccante.
- **Fix pre-esistente**: `scripts/audit-render.ts` (non editabile) importava ancora `ProjectionPanel` (cancellato sessione scorsa) → tsc rotto a HEAD. Ricreato `ProjectionPanel.tsx` come shim re-export di `GoalPanel` (zero logica duplicata). Sblocca tutti i commit.

## Saltato / impossibile
- P1 cloud mirror Supabase (vedi nota sopra) — IndexedDB copre il requisito funzionale.

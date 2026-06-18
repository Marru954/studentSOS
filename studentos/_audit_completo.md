# StudentOS — Audit completo (2026-06-15)

Mentalità: studente 20 anni, prima volta su StudentOS. Per ogni pagina: "Direi WOW e mi iscriverei subito?".

Legenda: ✅ ok · ⚠️ migliorabile · 🐞 bug · 💡 idea aggiunta

---

## FASE 1 — Audit pagina per pagina

### Landing (`/`, non loggato)
- ✅ **Hero forte**: wordmark animato (O = salvagente che ruota), tagline chiara, 2 CTA, demo interattiva "PROVALO ADESSO" (trascini i voti → media/base/CFU live). Ottimo hook.
- ✅ Feature card, "Come funziona" (3 step), stats band, tabella comparativa, teaser trofei, "tutto in un posto", CTA finale. Struttura completa e convincente.
- ⚠️ **Sezione "Atenei supportati" hardcoded** (`Landing.tsx` `UNIVERSITY_NAMES`, 12 nomi statici) mentre la hero-demo usa i preset reali (`UNIVERSITY_PRESETS`). Rischio drift + alcuni nomi (Bocconi, Statale MI) non sono preset live → promette atenei non supportati.
- ⚠️ **Testimonial inventati** (Giulia M./Bologna, Lorenzo B./Poli MI, Sara P./Sapienza). Per un prodotto reale è fuorviante. Da rimuovere o marcare come esempio.
- ⚠️ **Footer minimale**: solo wordmark + "Dati sincronizzati…" + `v0.1.0`. Nessun link privacy/termini/contatti/feedback. Unico contatto: `mailto:support@studentos.app` nella sezione atenei.

### Login / Onboarding
- SSO Delphi **disabilitato di proposito** ("prossimamente" in `DelphiConnect`). In offline-mode (no Supabase env) non c'è login email: l'onboarding scrive `presetId/programme/yearOfStudy` in IndexedDB. `FirstRunGate` manda gli unconfigured a `/onboarding`. Flusso ateneo→corso→anno (`OnboardingFlow`), corsi live taggati "sync live" vs "manuale".
- ⚠️ Da rivedere live in una sessione dedicata (questa sessione gira già su un profilo onboardato Tor Vergata).

### Panoramica (`/panoramica`)
- ✅ Saluto orario corretto, banner prossimo esame (ora aggiunto l'orario), QuickActions ateneo-aware, "Oggi", Carriera/CFU, ExamTimeline, Link utili, Obiettivo settimana, Scadenze prenotazione.
- ⚠️ **Layout piatto**: pannelli glass affiancati, poca gerarchia. → FASE 3 bento asimmetrico.
- ⚠️ "Appelli in arrivo" badge mostra l'intero calendario del corso (es. 53) — non gli esami dello studente (limite: nessuna iscrizione per-studente).

### Orario (`/orario`)
- ✅ Griglia settimana, filtro anno (default = anno studente via "auto"), CoursePicker, lezione manuale, import iCal. Empty-week ora suggerisce la prossima lezione (fix sessione precedente).
- 💡 FASE 3: barra "Oggi" in cima (pill lezioni di oggi).

### Appelli (`/appelli`)
- ✅ Calendario mese + liste Urgenti/Futuri, filtro anno, form manuale (bottone "+ Aggiungi" ora funzionante), export iCal.
- ⚠️ **Doppia etichetta Urgenti/Futuri** (pill in alto vs gruppi sotto, conteggi diversi) — confonde. (backlog noto)
- 💡 FASE 3: card urgenti con bordo animato/colore intenso, visivamente distinte.

### Calendario (`/calendario`)
- Agenda 7 giorni (default) + vista Mese. Eventi color-coded.
- ⚠️ **Valutazione valore**: vedi decisione dedicata sotto.

### Libretto (`/libretto`)
- ✅ Stat card (media "—" quando vuoto), entry form prominente quando vuoto (fix precedente), trofei 30L oro, simulatore (delta rosso/verde), import CSV/PDF Delphi, export PDF.
- ⚠️ **Ridondanza**: "Obiettivo laurea" e "Proiezioni" fanno lo stesso calcolo media-obiettivo→voto richiesto. → FASE 3 unificare.
- ⚠️ Layout: tutti pannelli affiancati. → FASE 3 split verticale (trofei sx, analisi dx).

### Note (`/note`)
- ✅ Split-pane (sidebar 280px + editor), template, ricerca, markdown+KaTeX, autosave. **Già buono** — mantenere.

### Focus (`/focus`)
- ✅ Funziona (pomodoro 25/5·45/10·60/15, suoni, sfondi, heatmap, stats, kanban). Timer ora sopra la heatmap (fix precedente).
- ⚠️ **Manca l'anima**: nessuna modalità di studio, nessuna sessione immersiva, stats poco motivanti, suoni non combinabili, nessun collegamento task→timer. → FASE 4 (il grosso del lavoro).

### Assistente (`/assistente`)
- ✅ Chat AI professionale (full-height, avatar, markdown, copia, nuova chat, retry, textarea auto-resize) — ridisegnata nella sessione precedente. Context-aware via Groq llama-3.3-70b.

### Impostazioni (`/impostazioni`)
- ✅ Profilo, Aspetto, Account, Dati (reset con warning).
- ⚠️ **Troppo scarna**: mancano obiettivi di studio, notifiche, accessibilità, privacy/dati dettagliata, info app. → FASE 5.

---

## Decisione: Calendario
**Verdetto: ha valore, NON fonderlo nel Panoramica.** L'Agenda 7-giorni unifica lezioni+appelli+task+focus in un'unica timeline cronologica che né Orario (solo lezioni, vista settimana) né Appelli (solo esami, vista mese) offrono. È l'unica vista "cosa mi succede nei prossimi giorni a colpo d'occhio". La vista Mese dà il quadro mensile multi-tipo. Rimuoverlo perderebbe la cross-type timeline. → **Tenere**, ma rendere gli eventi cliccabili (deep-link) in futuro (backlog).

---

## Lista "non-wow" (cosa non reggeva l'aspettativa)
1. Focus senza modalità/immersività/motivazione (la pagina con più potenziale sprecato).
2. Layout uniforme (glass affiancati) su Panoramica/Libretto → manca varietà visiva (Linear/Notion/Vercel).
3. Impostazioni troppo scarne.
4. Libretto: ridondanza Obiettivo/Proiezioni.
5. Landing: testimonial finti + lista atenei hardcoded che può divergere dai preset reali.
6. Appelli: card urgenti non abbastanza distinte; doppia etichetta Urgenti/Futuri.

---

## FASE 2 — Test multi-università (via script JS, IndexedDB + reload)
| Ateneo | Preset | Esito |
|---|---|---|
| **Firenze Informatica** (sync) | `unifi-informatica` / "Informatica" | ✅ 355 lezioni + 103 esami, sorgenti `informatica-orario/esami-anno-{1,2,3}`, 0 errori |
| **Parma Informatica** (sync) | `unipr-informatica` / "Informatica" | ✅ 342 lezioni + 168 esami, sorgenti namespaced, 0 errori |
| **Bologna** (manuale) | `unibo` | ✅ "Nessuna fonte attiva" (manuale corretto); 3 lezioni + 2 appelli inseriti → renderizzati nella griglia |
| **Cambio ateneo → reset** | — | 🐞 **BUG**: vedi sotto |

Differenze tra atenei: nessuna a livello funzionale — il motore di sync è identico, cambiano solo i codici verificati per ateneo. TV usa source-id "bare" (`orario-anno-N`), gli altri namespaced (`<slug>-orario-anno-N`); `matchesYear` legge il suffisso `-anno-N` in entrambi → filtri ok ovunque.

---

## 🐞 BUG TROVATI
1. ~~Cambio ateneo non azzera i dati del precedente~~ → **FALSO POSITIVO** (riverificato sul codice). `OnboardingFlow.finish` chiama **già** `clearSyncedCaches()` (riga 177) + `sync()` prima del redirect, quindi il cambio ateneo *reale* (Impostazioni → "Cambia ateneo o corso" → onboarding) azzera e ricarica correttamente. Il lingering visto in Fase 2D nasceva dal mio test che scriveva le settings **direttamente in IndexedDB bypassando `finish()`** → artefatto del metodo di test, non un bug dell'app. Nessun fix necessario.
2. (fix minori già chiusi in sessioni precedenti: bottone "+ Aggiungi" appelli morto, media "0,0" libretto, timer focus sotto la piega, settimana orario vuota — tutti committati.)
3. Nessun nuovo bug funzionale trovato nelle fasi 1-2. Le voci aperte restano UX/ridondanza (Urgenti/Futuri doppia etichetta, Obiettivo/Proiezioni), affrontate nei redesign.

---

## 💡 IDEE AGGIUNTE (oltre lo spec, implementate)
- Focus: **chime di completamento** (Web Audio), **record personali** (sessione più lunga + giorno migliore), citazioni di studio del giorno (deterministiche, no random), **guardia beforeunload** durante la sessione.
- Impostazioni: **contatori dati reali**, **export JSON** completo (riusa `exportBackup`), changelog "Novità recenti".
- Appelli: bordo **pulsante** danger sulle card urgenti (rispetta reduced-motion).

---

## ✅ FATTO QUESTA SESSIONE (commit su main)
1. `docs(audit)` — audit fasi 1-2 (questo file).
2. `feat(focus)` — ambiente di studio: 4 modalità (Pomodoro/Deep Work/Flow count-up/Sprint), sessione immersiva (la pagina collassa sul timer), widget motivazionale, record, chime, beforeunload. **Verificato live** (Flow conta in su, immersivo collassa/riapre, timer non si resetta).
3. `feat(impostazioni)` — Privacy e dati (contatori + export JSON + cancellazione granulare) + Info app. **Verificato live** (9 esami, 56 appelli).
4. `feat(appelli)` — card urgenti con bordo pulsante. **Verificato live**.
5. `feat(panoramica)` — **layout bento asimmetrico**: hero prossimo esame + countdown (2/3) con Carriera/CFU impilati accanto, riga media Oggi/Appelli, riga piccola. Rimossi SummaryBar + banner ridondanti. **Verificato live**.
6. `feat(libretto)` — **split verticale** (esami a sx, analisi a dx, tab su mobile) + **unione Obiettivo laurea/Proiezioni** in un pannello (ridondanza eliminata, ProjectionPanel rimosso). **Verificato live**.

## ⏳ RIMANENZE (non completate — budget sessione)
- **FASE 3 redesign** restanti: Orario barra "Oggi" in cima (pill lezioni di oggi), Impostazioni a colonne tematiche. (Panoramica bento e Libretto split ✅ fatti.)
- **FASE 4 Focus** scope rimandato: **sopravvivenza sessione cross-route** (richiede lift del timer in uno store globale — escluso per non rompere il timer funzionante) + indicatore "In sessione" in navbar + dialog "stai studiando, esci?"; **suoni combinabili** (ora uno alla volta) + più suoni/sfondi; **confetti** su task completato; **avvia timer da un task** (StudyTask.examId è già nel tipo ma inutilizzato — gancio pronto).
- **FASE 5 Impostazioni** rimandate: Studio&obiettivi (ore settimanali → unificare l'orfano localStorage `studentos-weekly-goal-hours`, CFU/semestre, inizio settimana, pausa lunga dopo N), Notifiche (4 toggle), Accessibilità (dimensione testo, riduci animazioni, alto contrasto → richiedono nuovi campi `AppSettings` + applier globale su `<html>` + CSS; `db.ts` NON va toccato, i campi opzionali sono schema-safe).
- **Backlog UX** (da [[studentos-ux-backlog]]): appelli doppia etichetta Urgenti/Futuri, deep-link da Cmd+K/FAB/calendario.

Punto di ripartenza consigliato: Panoramica bento → Libretto split+merge → Focus cross-route session → Impostazioni Studio/Notifiche/Accessibilità.


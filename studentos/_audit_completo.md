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

### Cruscotto (`/cruscotto`)
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
**Verdetto: ha valore, NON fonderlo nel Cruscotto.** L'Agenda 7-giorni unifica lezioni+appelli+task+focus in un'unica timeline cronologica che né Orario (solo lezioni, vista settimana) né Appelli (solo esami, vista mese) offrono. È l'unica vista "cosa mi succede nei prossimi giorni a colpo d'occhio". La vista Mese dà il quadro mensile multi-tipo. Rimuoverlo perderebbe la cross-type timeline. → **Tenere**, ma rendere gli eventi cliccabili (deep-link) in futuro (backlog).

---

## Lista "non-wow" (cosa non reggeva l'aspettativa)
1. Focus senza modalità/immersività/motivazione (la pagina con più potenziale sprecato).
2. Layout uniforme (glass affiancati) su Cruscotto/Libretto → manca varietà visiva (Linear/Notion/Vercel).
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
1. **Cambio ateneo non azzera i dati del precedente** (Fase 2D). Passando da Parma a Bologna (manuale) le 342 lezioni + 168 esami di Parma **restano**. Causa radice: il cambio ateneo aggiorna solo le settings; `replaceSourceData` sostituisce solo le sorgenti *abilitate*, e un ateneo manuale non ne ha → le cache vecchie sopravvivono (`resetLocalData` gira solo al cambio utente, non al cambio ateneo). **Fix (Fase 6)**: in `OnboardingFlow.finish`, quando presetId/programme cambiano, svuotare le cache sincronizzate (classEvents/examCalls/news/syncMeta/changeNotices).
2. (altri fix minori già chiusi in sessioni precedenti: bottone "+ Aggiungi" appelli morto, media "0,0" libretto, timer focus sotto la piega, settimana orario vuota — tutti committati.)

---

## 💡 IDEE AGGIUNTE (oltre lo spec)
- Focus: chime di completamento sessione, record personali (sessione più lunga, giorno migliore), insight orario, confetti su task completato.
- Impostazioni: contatori dati reali + export JSON, sezione "Studio e obiettivi" che assorbe l'orfano `studentos-weekly-goal-hours`.
- (aggiornato man mano che implemento)

---

## ✅ STATO LAVORI / RIMANENZE
- ✅ FASE 1 audit + ✅ FASE 2 multi-uni → documentati qui.
- ⏳ FASE 3 redesign, FASE 4 Focus, FASE 5 Impostazioni, FASE 6 fix → in corso, un commit per area. Le voci non completate alla fine della sessione sono elencate qui sotto man mano.


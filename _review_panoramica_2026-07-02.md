# StudentOS — Review Panoramica: voce studente + voce esperta (2026-07-02)

Review indipendente di `/panoramica` (`src/components/dashboard/Dashboard.tsx`) da due
punti di vista, condotta A FREDDO: lo storico (audit-completo.md 15/06, STATO.md) è stato
letto SOLO dopo aver chiuso le due valutazioni. Nessuna modifica al codice in questa
sessione: solo osservazione (Playwright, dev server locale) e questo report.

Legenda: ✅ ok · ⚠️ migliorabile · 🐞 bug · 💡 idea

**Setup osservazione**: profilo vergine → onboarding Tor Vergata / Informatica
(triennale) / 2° anno / 180 CFU → sync live reale (39 appelli, orario estivo vuoto).
Stato osservato = "primo utilizzo" REALE (`firstRun` true: 0 voti, 0 lezioni entro 14
giorni — luglio) ma con appelli veri. Temi dark+light, viewport 1440×900 e 390×844,
confronto con la card "Anteprima" della landing (`HeroPreview.tsx`).

**Limiti ambiente**: Supabase env assente in dev → `useAuth` = "offline", quindi
`BackupNudge` (che richiede status "signedOut") non è osservabile; valutato solo da
codice. Le misure di contrasto sono calcolate dai token (`globals.css`) su fondi rgba
stratificati: approssimazioni oneste, non misure spettro.

---

## FASE 3 — Voce studente
Persona: studente italiano, primo accesso, tra due lezioni, zero familiarità col codice.

### Cosa funziona
- ✅ **La domanda "cosa devo sapere oggi?" ha risposta in ~2 secondi**: hero "Oggi —
  ALGORITMI E STRUTTURE DATI B · ore 09:00 · Aula 13 · GUALA' LUCIANO". Nome, ora, aula,
  docente: tutto quello che serve, nell'ordine giusto.
- ✅ **Wow onesto al primo avvio**: 3 domande di onboarding e la pagina si riempie di
  dati veri del mio corso, senza account. Nessun placeholder finto.
- ✅ Empty state caldi in primo utilizzo: "il tuo orario si aggiornerà automaticamente
  ogni giorno", "Aggiungi il tuo primo voto per iniziare a tracciare la tua carriera".
  L'app vuota non sembra rotta.
- ✅ Azioni rapide azzeccate (Aggiungi voto / Vai al portale / Nuova nota) e il portale è
  quello giusto del mio ateneo (Delphi).
- ✅ Saluto e data corretti ("Buongiorno · giovedì 2 luglio"), copy italiano naturale.
- ✅ Il conflitto di orario spiega "non dipendono da te" — ansia gestita bene.
- ✅ Footer coerente col patto local-first: "I tuoi dati restano su questo dispositivo".

### Cosa non funziona
- ⚠️ **L'anno dichiarato all'onboarding viene ignorato dalla Panoramica.** Ho detto
  "2° anno"; hero, timeline, badge "39", "7 appelli questa settimana" e perfino il
  conflitto rosso mescolano appelli di 1°, 2° e 3° anno (il "conflitto" è tra un esame di
  1° e uno di 2°: non è un MIO conflitto). La riga "Tutti gli appelli del tuo corso ·
  filtra in /appelli" lo ammette, ma la prima impressione resta "carico enorme e avvisi
  non miei" → fiducia nei numeri ↓.
- 🐞 **Il tour di benvenuto appare rotto**: card larga tutto lo schermo, incollata in
  basso a sinistra, mezza sotto il fold, col testo dei pannelli sottostanti che traspare
  attraverso il vetro. Primo contatto col prodotto = un dialog sbagliato (dettagli
  tecnici nella voce esperta).
- ⚠️ **"Prossimo esame: Oggi" alle 09:14 per un appello delle 09:00** con CTA "Studia per
  questo esame": l'esame è già iniziato. Manca lo stato "in corso / si è tenuto stamattina".
- ⚠️ **"Modifiche rilevate: nuovo appello il 21/05/2026"** (6 settimane fa) comparse al
  secondo sync senza che nulla fosse cambiato: 7 notice, tutte FISICA, molte su date
  passate. Sembrano avvisi sbagliati → altra tacca sulla fiducia.
- ⚠️ **La card "Oggi" d'estate è un buco enorme**: 534px (misurati) per una sola riga di
  testo, a fianco di una timeline piena. Metà schermo persa proprio nello stato in cui
  arriva ogni nuovo utente estivo.
- ⚠️ **"Scadenze prenotazione" è una carta morta per il mio ateneo**: EasyAcademy non
  espone le finestre di iscrizione, quindi resterà "Nessuna scadenza imminente ✓" per
  sempre — promette una funzione che qui non arriverà mai.
- ⚠️ **Su mobile le sezioni cambiano nome**: tab "Crusc. / Materie / Esami / Voti" vs
  pagine "Panoramica / Insegnamenti / Appelli / Libretto". "Crusc." da solo è
  incomprensibile; "Esami" apre una pagina intitolata "Appelli".
- ⚠️ Due porte di configurazione simili con destinazioni diverse: "Configura" (rifà
  l'onboarding) vs ingranaggio in navbar (Impostazioni).
- ⚠️ Su mobile l'hero arriva dopo ~1,5 schermate di chrome (header + saluto +
  Configura/sync + 3 pill).

### Idee
- 💡 Default = solo il mio anno (dal profilo), con toggle "Tutto il corso" — il codice
  ha già `matchesYear`/`yearOfSource`.
- 💡 Hero con stato "in corso"/"si è tenuto oggi" e passaggio automatico al prossimo.
- 💡 "Oggi" vuoto d'estate → mostra la prossima cosa reale ("Prossimo appello: domani
  Geometria" o "Le lezioni riprendono a settembre").
- 💡 Nascondere "Scadenze prenotazione" quando la fonte non può popolarla.

### Voto: **7/10**
I dati veri senza account valgono da soli metà del voto. Tolgono: anno mescolato (i
numeri "non miei"), tour rotto al primo accesso, notice su date passate, due card morte.

### I 4 cambiamenti che portano al 10/10 (studente)
1. Scope per anno di default su hero/timeline/conflitti/contatori.
2. Tour riparato (centrato, leggibile, sopra il fold).
3. Hero consapevole dell'orario (esame in corso/concluso) + notice senza date passate.
4. Empty estivi utili: "Oggi" col prossimo evento reale, "Scadenze" nascosta se non
   applicabile.

---

## FASE 4 — Voce esperta (design/prodotto, standard Linear/Notion/Vercel)

### Cosa regge il confronto
- ✅ **Fondamenta token-driven vere** (`globals.css` @theme + var blocks dark/light):
  reskin centralizzato, `color-mix` per i dim, AA documentato sui token base
  (`--ink-faint` corretto con commento del rapporto, globals.css:61,85).
- ✅ **Gerarchia bento reale**: `panel-hero` + `accent-top` marcano hero e timeline
  (elevazione differenziata, non pannelli fotocopia). Il numerone in Bricolage con
  `clamp(3rem,9vw,5.2rem)` è un focal point degno.
- ✅ **A11y sopra la media di categoria**: skeleton con `role="status"` + sr-only,
  aria-label su ProgressRing e su ogni icona-bottone, `aria-expanded` sui collapse,
  "(si apre in una nuova scheda)" sr-only, `:focus-visible` globale, blocco
  `prefers-reduced-motion` completo (globals.css:154-163, 786-795).
- ✅ **Motion disciplinata**: solo CSS, stagger con cap, `pulse-soft` riservato a ≤2
  giorni, niente framer.
- ✅ Pattern SSR-safety consapevoli (useSyncExternalStore, gating su `now !== null`).

### Dove il craft cede (file:riga)
- 🐞 **Overlay del tour strutturalmente rotto** — misurato: dialog 1393×214 @ y=794 su
  viewport 900 (108px sotto il fold), full-width, contenuto incollato a sinistra.
  Tre cause concorrenti:
  1. `template.tsx:7` — `.anim-page` (animation `enter-up` su transform,
     globals.css:422) crea un containing block per i `position:fixed` discendenti →
     l'overlay `inset-0` si ancora al box della PAGINA (~1800px), non al viewport:
     `items-center` centra sulla pagina, quindi sotto il fold.
  2. `Overlay.tsx:105` — il dialog è `w-full` senza max-width propria.
  3. `PanoramicaTour.tsx:159` — il `max-w-md` sta sul div interno, senza `mx-auto`.
  In più il backdrop-filter del pannello risulta computato `none` (osservato) → il testo
  sottostante traspare. Nota: "inert/scroll-lock sfondo Overlay" era già in STATO.md
  "In sospeso"; il mis-anchoring è nuovo e più grave.
- ⚠️ **Skeleton ≠ layout reale**: skeleton `lg:grid-cols-12` span 7/5/8/4
  (Dashboard.tsx:302-308) vs griglia reale `lg:grid-cols-6` span 4/2/3/3 → shift di
  composizione a ogni load. Un sistema alla Linear tiene le due mappe speculari.
- ⚠️ **Ritmo del bento sfondato dagli empty state**: "Oggi" vuoto = 534px per una riga
  (riga media allineata all'altezza della timeline); colonna destra `justify-between`
  con ~130px d'aria tra Carriera e CFU (Dashboard.tsx:335). Il bento è disegnato per lo
  stato pieno; lo stato reale di luglio lo smentisce.
- ⚠️ **Micro-contrasti sotto AA** (calcolati dai token, fondi stratificati):
  `--ink-faint` su `.glass` dark ≈ 3,8:1 (riga contesto text-xs, ExamTimeline.tsx:163);
  link `text-signal` piccoli ≈ 3,9–4,1:1 ("filtra in /appelli" :165, "+N altre date"
  :255); `chip-warn` in light ≈ 3,2:1 a 11,5px/600 (globals.css:575 — le chip "tra N
  giorni"). Il lavoro AA fatto sui fondi base (--bg) non copre i fondi glass.
- ⚠️ **Scroll affordance assente**: lista appelli `max-h-[360px]` con scrollbar
  invisibile a riposo (ExamTimeline.tsx:28-33,211), nessun fade-out: 35 appelli su 39
  non esistono visivamente.
- ⚠️ **Reference /design invecchiata**: parla di "anello chartreuse", "superfici al
  carbonio", "un solo colore di segnale" (design/page.tsx:31,72-74) — l'estetica di due
  generazioni fa. Non documenta glass/aurora/panel-hero/accent-top/gradient-ring/
  card-glow né --signal-2/--signal-3. La pagina che dovrebbe essere la fonte di verità
  del sistema non descrive più il sistema.
- ⚠️ **Comment/code drift nel hero**: il commento promette "rosso < 7 giorni, arancione
  < 14" (Dashboard.tsx:45-46), il codice fa ambra ≤ 2 e viola altrimenti (:58-60).
- ⚠️ Progress bar hero: mapping `100 - days*2.5` (Dashboard.tsx:61) non spiegato,
  semantica inversa (piena = 0 giorni), nessun ruolo ARIA; è l'unico indicatore
  quantitativo del pannello.
- ⚠️ Badge sync "agg. 02/07 · 09:08" tecnico; il dettaglio è solo in `title`
  (SyncStatus.tsx:41), inaccessibile da tastiera/touch. Meglio relativo ("agg. 6 min fa").
- ⚠️ Stagger d'ingresso rieseguito a OGNI navigazione (template remount +
  `stagger-children`, Dashboard.tsx:311): 0,7s di coda animata anche al decimo rientro.
- ⚠️ Mobile 390×844: top pill + bottom tab + bubble assistente ≈ 25% di viewport in
  chrome fisso; QuickActions spingono l'hero sotto il fold.
- ⚠️ **HeroPreview fedele ma idealizzata** (HeroPreview.tsx): stessa griglia/gerarchia
  della pagina vera (bene), ma senza QuickActions/banner/riga-contesto, countdown viola
  pieno (:62-67) dove il reale in urgenza va d'ambra, "Oggi" pieno di lezioni dove il
  primo load estivo è vuoto con banner rosso. Non è drift da correggere nella preview:
  è la pagina reale che al primo load non mantiene la quiete promessa.

### Voto: **6,5/10**
Fondamenta (token, a11y, motion) da 8; l'esecuzione perde su dialog rotto, empty state
che sfondano il ritmo, micro-contrasti e una reference di design che non è più vera.

### I 5 cambiamenti che portano al 10/10 (esperto)
1. Overlay via portal su `document.body` + `max-w` sul dialog stesso.
2. Empty state che ripiegano il grid (col-span dinamici o contenuto alternativo ricco),
   non buchi a altezza fissa.
3. Passata micro-contrasti sui tre usage sotto AA.
4. /design rigenerata dai token immersive correnti.
5. Skeleton speculare alla griglia reale.

---

## FASE 5 — Confronto con lo storico

Nota di metodo: `_audit_completo.md` oggi vive in `docs/stato/audit-completo.md` (riorg
docs). In STATO.md non esiste una voce "bento redesign 18/06": il bento è documentato
nel §FATTO del 15/06 (audit-completo.md:107, "feat(panoramica) — layout bento
asimmetrico… Verificato live"); le sessioni del 18/06 riguardano la landing (tra cui
HeroPreview). Classificazione fatta contro entrambe le fonti.

| Punto (Fasi 3-4) | Stato vs storico |
|---|---|
| Layout piatto, poca gerarchia (15/06) | **Già segnalato e RISOLTO** (bento 15/06, confermato oggi) |
| Badge/contatori sull'intero corso, non sullo studente (15/06: "es. 53") | **Già segnalato e ANCORA APERTO** — oggi 39; la riga di contesto mitiga, ma il punto si è ALLARGATO: anche hero, "7 questa settimana" e conflitti ignorano l'anno del profilo |
| Overlay senza scroll-lock/inert (STATO.md "In sospeso") | **Già segnalato e APERTO**; il mis-anchoring/full-width del dialog è **NUOVO e più grave** |
| Weekly goal orfano in localStorage (15/06, FASE 5 rimandata) | **Già segnalato e APERTO** (WeeklyGoalCard.tsx:18) |
| HeroPreview coerente con la pagina (18/06 "verificato") | **Regge ancora** strutturalmente; nuova osservazione: divario di tono col primo load reale estivo |
| Tour rotto (anchor/width/legibilità) | **NUOVO** |
| Notice "nuovo appello" su date passate al re-sync | **NUOVO** |
| Hero cieco all'orario del giorno ("Oggi" alle 09:14 per le 09:00) | **NUOVO** |
| "Oggi"/"Scadenze" empty a altezza piena (dead space 534px) | **NUOVO** (figlio del bento del 15/06: disegnato sullo stato pieno) |
| Micro-contrasti AA su glass/chip/link piccoli | **NUOVO** (il fix AA del 15-22/06 copriva i fondi base) |
| Skeleton ≠ layout reale | **NUOVO** |
| /design non descrive più il sistema | **NUOVO** |
| Naming mobile ≠ desktop ("Crusc./Materie/Esami/Voti") | **NUOVO** (nato con la nav 18/06→7 voci; CLAUDE.md dice ancora "6 voci") |
| Doppio ingresso Configura vs Impostazioni | **NUOVO** (minore; il tour lo spiega, ma il tour è rotto) |

---

## Lista finale prioritizzata

| # | Priorità | Effort | Voce | Fix concreto |
|---|---|---|---|---|
| 1 | **Alta** | Low-Med | Tour/Overlay rotto | `Overlay.tsx`: render via `createPortal(document.body)` (react-dom, zero dipendenze nuove) così `fixed` torna al viewport; spostare la max-width sul dialog (prop `className` → `max-w-md` da PanoramicaTour, togliere il `max-w-md` interno); già che si è lì: scroll-lock (`overflow:hidden` su body a overlay aperto, voce STATO.md). Verificare poi che il backdrop-blur del pannello si applichi |
| 2 | **Alta** | Med | Anno del profilo ignorato | In `Dashboard.tsx`, filtrare `myExamCalls`/`todayEvents`/clashes con `matchesYear(yearOfSource(e.sourceId), yearOfStudy)` (già esistono in `domain/sources.ts`; `yearOfStudy` è in settings) con default = anno del profilo e chip "Tutto il corso" per estendere; il badge "39" e "7 questa settimana" seguono da soli |
| 3 | **Alta** | Low | Notice su date passate | Lato client (senza toccare engine/diff core): in `ChangeNotices`/store, scartare i notice `new-exam` con `date < oggi` alla visualizzazione; poi indagare perché un re-sync a dati invariati genera notice (probabile: la finestra `defaultSyncRange` scorre col tempo → item che entrano nel range sembrano "nuovi" a `storage/diff.ts`) |
| 4 | **Media** | Low | Hero cieco all'orario | In `nextExam` (Dashboard.tsx:236-246), se `date === oggi && time < now` → etichetta "In corso / si è tenuto alle HH:MM" o passa al successivo; niente CTA "Studia" per un esame già iniziato |
| 5 | **Media** | Med | Empty state estivi | `TodayTimeline` firstRun/estate: aggiungere la prossima cosa reale (prima lezione futura nota o prossimo appello) sotto il messaggio; `BookingDeadlines`: montare la card solo se la fonte può esporre booking (capability sul preset — per EasyAcademy oggi è sempre no), altrimenti nulla — lo slot lo prende LinksPanel |
| 6 | **Media** | Low | Micro-contrasti AA | ExamTimeline.tsx:163 riga contesto → `text-ink-mute`; link piccoli `text-signal` → aggiungere `font-medium underline` (o alzare --signal in dark); `[data-theme="light"] .chip-warn` → colore testo dedicato più scuro (es. `#a15c04`-range verificato ≥4,5:1) |
| 7 | **Media** | Low | Skeleton mismatch | Dashboard.tsx:302-308 → stessa griglia del layout reale (`lg:grid-cols-6`, span 4/2/3/3 + riga piccola 2/2/2) |
| 8 | **Bassa** | Low | Scroll affordance timeline | Fade-out sotto la lista (`mask-image: linear-gradient`) o footer "39 appelli · vedi tutti →" fisso in fondo al pannello |
| 9 | **Bassa** | Low | Naming mobile | AppNav.tsx:37-44: `short` allineati ("Crusc."→"Home"; "Materie/Esami/Voti"→ o si rinominano le pagine o si usano gli stessi nomi); aggiornare CLAUDE.md (7 voci, non 6) |
| 10 | **Bassa** | Low | /design stantia | Riscrivere copy+swatch di design/page.tsx sui token immersive (aggiungere signal-2/-3, glass, panel-hero, accent-top, gradient-ring, card-glow; via "chartreuse"/"carbonio") |
| 11 | **Bassa** | Low | Dettagli hero | Allineare il commento tone-grading (Dashboard.tsx:45-46 vs 60); badge sync in formato relativo ("agg. 6 min fa") con dettaglio accessibile non solo via `title` |
| 12 | **Bassa** | Low | Stagger a ogni rientro | Valutare stagger solo al primo mount per sessione (flag modulo-level), o accorciare la coda oltre il 6° figlio |

**Non toccati qui** (fuori scope Panoramica ma emersi): CLAUDE.md dice "Nav (6 voci)" ma
le voci sono 7 (Insegnamenti); il doppio ingresso Configura/Impostazioni meriterebbe una
decisione di prodotto (unificare su /impostazioni con link "Cambia ateneo/corso").

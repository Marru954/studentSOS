# Ricognizione Cineca-UP / GOMP — 6 atenei target

**Data:** 2026-07-03 · **Tipo:** sola lettura (nessun adapter, nessun codice app toccato).
**Obiettivo:** per Sapienza, Bologna, PoliMi, PoliTo, Padova, Pisa scoprire il sistema di
catalogo/orario/appelli sottostante, catturare una fixture reale e classificare, così da
sapere **quanti adapter distinti servono davvero** prima di scriverne uno.

---

## ⚠️ Vincolo di ambiente — egress bloccato oggi (leggere prima)

In **questo** ambiente la policy di egress dell'organizzazione **nega tutti e 6 gli host**
bersaglio: ogni richiesta HTTPS (curl, WebFetch e browser passano dallo stesso proxy)
riceve **`403` alla CONNECT** — *policy denial*, non errore transitorio. Il README del
proxy è esplicito: non ritentare, non aggirare, riportare l'host bloccato.

Evidenza: `fixtures/recon/_proxy-status-2026-07-03.json` (dump di
`http://127.0.0.1:40587/__agentproxy/status`) con i `connect_rejected 403` per
`corsidilaurea.uniroma1.it`, `corsi.unibo.it`, `www.polimi.it`, `onlineservices.polimi.it`,
`didattica.polito.it`, `swas.polito.it`, `www.unipd.it`, `agendastudentiunipd.easystaff.it`,
`unipi.prod.up.cineca.it`, `www.unipi.it`, `www.unibo.it`, `www.uniroma1.it`.

**Conseguenza sulla FASE 3:** oggi **non è stato possibile scaricare alcuna fixture reale**.
`fixtures/recon/` contiene solo la sua `README.md` (mappa di cosa catturare) e la prova del
blocco. Muro #4: nessuna fixture inventata da frammenti — *wrong data is worse than none*.

**Provenienza dei dati di questo report.** La classificazione (FASE 2) e il raggruppamento
(FASE 5) qui sotto poggiano su **richieste reali eseguite dal progetto il 2026-07-02**
(status HTTP + payload verbatim registrati in `_recon_cineca-gomp_2026-07-02.md`, alla radice
del repo). Le rispettive catture grezze vivevano nella scratchpad di quella sessione
(ephemeral, non committata, oggi non più disponibile). Quindi: **sistema e confidenza sono
solidi** (verificati end-to-end 24 h fa), ma **le fixture vanno ri-catturate** appena
l'egress sarà disponibile — vedi `fixtures/recon/README.md` per il comando esatto per host.

---

## Tabella riassuntiva

| Ateneo | Sistema | Confidenza | Fixture salvata | Note |
|---|---|---|---|---|
| **Sapienza** (uniroma1) | GOMP dietro Drupal 7 (`corsidilaurea.uniroma1.it`) | **Alta** | **No** — host 403 oggi; verificato 02-07 | Orario JSON + appelli HTML **pubblici**. Adapter dedicato, non generalizza al resto GOMP. |
| **Bologna** (unibo) | In-house Plone (`corsi.unibo.it`) | **Alta** (sistema) | **No** — host 403 oggi; verificato 02-07 | Appelli HTML pubblici. Orario JSON vivo ma **vuoto** fuori semestre → verdetto orario rinviato a settembre. |
| **PoliMi** (polimi) | In-house, **gated** (Servizi Online, login) | **Alta** | **No** — host 403 oggi; verificato 02-07 | Pubblici solo i **manifesti**; orario vero e appelli dietro `aunicalogin`. Nessun adapter fattibile → manuale. |
| **PoliTo** (polito) | In-house ASP.NET **WebForms** (`swas.polito.it`) | **Alta** | **No** — host 403 oggi; verificato 02-07 | Orario **pubblico** ma stateful (`__VIEWSTATE`/`__doPostBack`), fragile. Niente appelli pubblici. |
| **Padova** (unipd) | **EasyAcademy** (`agendastudentiunipd.easystaff.it`) | **Alta** | **No** — host 403 oggi; verificato 02-07 | **Stesso adapter già in produzione**, exams-only. ⚠️ `robots.txt = Disallow: /`. |
| **Pisa** (unipi) | **Cineca University Planner** (`unipi.prod.up.cineca.it`) | **Alta** | **No** — host 403 oggi; verificato 02-07 | REST pubblico (POST), contratto verificato e **riusabile su ~9-12 atenei UP**. |

Nessuna delle 6 righe è "sistema ignoto": la classificazione è completa. L'unico dato
mancante sono le fixture grezze, mancanti per il blocco di rete odierno (non per ambiguità).

---

## Dettaglio per ateneo (verificato 2026-07-02)

### Sapienza — GOMP dietro `corsidilaurea.uniroma1.it` · pubblico
- **Sistema:** GOMP (Be Smart) esposto via un frontend **Drupal 7** ("Course catalogue");
  i dati arrivano da rotte `…/services/gomp/…` server-side, non da un `*-public.gomp.it`.
- **Superfici pubbliche verificate:** orario JSON
  `GET /it/services/gomp/timetable-data/<nodeId>?start=&end=` (es. corso 33503 = Informatica,
  ~53 KB JSON); appelli come **tabella HTML** `GET /it/course/<nodeId>/attendance/exams`;
  la home elenca tutti i corsi come `/it/course/<id>` (enumerazione in un GET).
- **Campi chiave:** `events[].start/end` ISO; `title` è **HTML embedded** (nome/docente/aula
  da spacchettare); `curricula`/`course_years`/`partitions`/`ssds` per i filtri. `Crawl-delay: 10`.
- **Non pubblico:** prenotazione appelli e carriera (Infostud, login).
- **Adapter:** dedicato Sapienza, complessità **media** (JSON + title-parsing + esami HTML +
  mappa corso/coorte). **Non** riusabile sugli altri atenei GOMP (Roma Tre/Catania/Cassino
  usano superfici `*-public.gomp.it` diverse).

### Bologna — in-house Plone su `corsi.unibo.it` · pubblico (orario da rivalidare)
- **Sistema:** in-house **Plone**; ogni corso ha pagine `corsi.unibo.it/laurea/<slug>/…`.
- **Verificato:** appelli **pubblici** (`/laurea/<slug>/appelli`, ~409 KB HTML, con data/ora,
  docente, iscrizioni); orario via `@@orario_reale_json?anno=&curricula=&start=&end=`
  (200 JSON) + `@@available_curricula` (200 JSON) **ma payload `[]` in ogni finestra provata**
  (ott 2025, mag/set 2026) → dati AA passato rimossi, 2026/27 non ancora pubblicato.
- **Campi chiave:** curricula `{value:"000-000",label:…}`; checkbox insegnamento con id
  composti (`2026-000-319297--I|58414`).
- **Aperto:** enumerazione degli slug corso (sitemap / opendata unibo) — non fatta.
- **Adapter:** dedicato, complessità **media**; **verdetto orario rinviato a settembre**
  (ricontrollare `@@orario_reale_json` nella prima settimana di lezione).

### PoliMi — in-house, sostanzialmente **gated**
- **Sistema:** in-house; l'orario ufficiale vive nei Servizi Online (`aunicalogin` → login).
- **Verificato pubblico:** solo i **Manifesti**
  (`onlineservices.polimi.it/manifesti/…/ManifestoPublic.do?aa=2026&k_cf=&k_corso_la=&k_indir=`),
  con righe corso (`codDescr`, `semestre`, `anno_corso`) e uno strumento "Orario
  Personalizzato" a **carrello stateful** (`EVN_ADDCART`/`jsessionid`) — **non un feed dati**.
- **Non trovato senza login:** orario strutturato, appelli pubblici. `polimi.it/strumenti/orario-lezioni/` = 404.
- **Adapter:** **alta** complessità e basso valore → di fatto **non integrabile** senza
  credenziali. Resta **modalità manuale**. Da riaprire solo se emergesse un'API pubblica.

### PoliTo — in-house ASP.NET WebForms · orario pubblico ma fragile
- **Sistema:** in-house, **ASP.NET WebForms** su `swas.polito.it/dotnet/orari_lezione_pub/`.
- **Verificato:** indice pubblico + `filtri_consultazione_generale.aspx` con cascata
  `ddlAnnoAccademico → ddlSede → ddlTipoLaurea → ddlArea → ddlCdl` (anni 2015/16…2025/26).
  **Ma** ogni passo è un `__doPostBack` con `__VIEWSTATE`: per arrivare alla griglia serve
  replicare lo stato server passo-passo, non una GET parametrica. Appelli sul Portale della
  Didattica → **non verificabile senza credenziali**.
- **Adapter:** dedicato, complessità **medio-alta** (scraping WebForms stateful, fragile a
  ogni deploy), niente appelli. Da sondare la vista `mobile/` prima di scartare.

### Padova — EasyAcademy · integrabile con l'adapter esistente (exams-only)
- **Sistema:** **EasyAcademy** (`agendastudentiunipd.easystaff.it`) — lo stesso dei 18 atenei
  live già in produzione.
- **Verificato:** `combo.php?sw=ec_&aa=2025&page=corsi` → 400 corsi ma `elenco_anni` **vuoto
  su tutti** (orario non esposto per corso/anno); `POST test_call.php` (body identico
  all'adapter, es. `esami_cdl=SC2987` Informatica, Scuola di Scienze) → **200, 82 KB, 6
  insegnamenti / 18 appelli reali**, shape identica al contratto esistente.
- **Verdetto:** **esami sì, orario no.** ⚠️ `robots.txt = Disallow: /` (host intero): il sync
  agisce da client per lo studente come per gli altri host EasyAcademy, ma **la policy va
  messa a verbale prima del wiring**.
- **Adapter:** **nessuno nuovo.** Serve solo una **variante exams-only** di
  `degreeSources()` (in `easystaff.ts`, layer `universities/` — non tra i file intoccabili)
  + preset + censimento corsi. Nessun tocco a `adapters/easyacademy.ts` né `engine.ts`.

### Pisa — Cineca University Planner · REST pubblico, contratto verificato
- **Sistema:** **Cineca UP** (`unipi.prod.up.cineca.it`), SPA AngularJS + REST LoopBack su
  `/api`; `calendarioPubblico` senza login.
- **Catena verificata end-to-end:**
  `GET /api/Clienti/cercaPerDominio?dominio=unipi.prod.up.cineca.it` → `{clienteId}`;
  `POST /api/Impegni/getImpegniCalendarioPubblico {clienteId, linkCalendarioId, dataInizio,
  dataFine}` → **200, ~760 KB** (32 impegni in una settimana). Le rotte pubbliche sono
  **POST** (GET → 401); enumerazione calendari `getLinkCalendariPubbliciUP` → **401** (non
  pubblica). Contratto **identico** su `unito.prod.up.cineca.it` (parità confermata).
- **Campi chiave (impegno):** `dataInizio/dataFine` ISO, `aule[].descrizione`, `docenti[]`,
  `evento.dettagliDidattici[]` con `nome`, `annoCorso`, `cfu`, `annoOrdinamento` → mappabile
  a `ClassEvent` incluso il filtro anno. Esiste anche export iCal (`/FiltriICal/impegniICal?id=`)
  → potenziale percorso con l'adapter `ical` esistente. Appelli **non** nel calendarioPubblico
  (pista Esse3, non verificata).
- **Adapter:** **UP**, complessità **media**, JSON pulito e **riusabile su ~9-12 atenei UP**
  (unito, unipv, unisi, univr, unical, unime, unibs, unifg, unirc, unibas, uniurb, uniroma4).
  Nodo: censimento dei `linkCalendarioId` (GUID) per corso/anno/semestre + rotazione annuale
  (stessa disciplina dei codici EasyAcademy: mai inventati, censiti e verificati).

---

## FASE 5 — Raggruppamento per sistema → adapter distinti

I 6 atenei **non** ricadono in un unico sistema: servono **più adapter distinti**.

| Gruppo / sistema | Atenei | Adapter necessario |
|---|---|---|
| **EasyAcademy** (esistente) | Padova | **0 nuovi** — variante *exams-only* di `degreeSources()` + preset |
| **Cineca University Planner** (REST) | Pisa (+ ~9-12 atenei UP riusabili) | **1 nuovo** — il più ad alto rendimento (riuso ampio) |
| **GOMP-via-Drupal** | Sapienza | **1 nuovo** — dedicato, non generalizza al resto GOMP |
| **In-house Plone (JSON+HTML)** | Bologna | **1 nuovo** — dedicato; orario da rivalidare a settembre |
| **In-house ASP.NET WebForms** | PoliTo | **1 nuovo** (opzionale) — pubblico ma fragile, exams assenti |
| **In-house gated (login)** | PoliMi | **0** — non integrabile senza credenziali → resta manuale |

**Risposta alla domanda del titolo:** *non un adapter solo.* Realisticamente **4 nuovi
adapter distinti** (UP, GOMP-Sapienza, Plone-Bologna, WebForms-PoliTo) **+ una variante
exams-only** su EasyAcademy per Padova; **PoliMi escluso** (gated). L'unico con riuso reale
oltre l'ateneo singolo è **Cineca UP**.

---

## Ordine di attacco consigliato

1. **Padova** — exams-only sull'adapter esistente: massimo rapporto sforzo/valore, nessun
   adapter nuovo. Prerequisiti: (a) decisione esplicita sulla policy `robots Disallow: /`;
   (b) censimento corsi target; (c) spec della variante exams-only.
2. **Pisa → adapter Cineca UP** — il vero "prossimo adapter": contratto verificato e
   riusabile su ~9-12 atenei. Prerequisiti: censire i `linkCalendarioId`, definire la
   granularità (corso/anno/semestre) e il mapping `dettagliDidattici → ClassEvent`,
   chiarire la storia esami (Esse3?).
3. **Sapienza** — pubblico (orario JSON + appelli HTML), altissimo valore, ma adapter
   dedicato che non generalizza. Dopo UP.
4. **Bologna** — appelli già pubblici; orario rinviato a settembre (endpoint vivo ma vuoto).
5. **PoliTo** — pubblico ma WebForms/VIEWSTATE fragile, senza appelli; sondare `mobile/` prima.
6. **PoliMi** — gated; in coda, solo se emerge un'API pubblica.

**Regola d'arresto** (2 atenei bloccati per lo stesso motivo): **non scattata** — 4/6 hanno
superfici pubbliche verificate; i 2 Politecnici sono difficili per motivi *diversi* (PoliMi
login-gated, PoliTo WebForms stateful).

---

## Cosa manca per chiudere la ricognizione (quando l'egress sarà disponibile)

- **FASE 3 — fixture reali:** ri-eseguire le 7 catture in `fixtures/recon/README.md` e
  salvarle grezze. È l'unico pezzo mancante; tutto il resto (localizzazione, sistema,
  struttura, raggruppamento) è già determinato.
- **FASE 6 — `scripts/verified-endpoints.txt`:** gli URL verificati il 2026-07-02 sono già
  stati aggiunti in un blocco datato e caveato ("host oggi irraggiungibili, da riconfermare").
  Alla prossima cattura riuscita vanno **riconfermati** (togliere il caveat).
- **Bologna:** completare l'enumerazione slug corso e ricontrollare `@@orario_reale_json` a
  settembre.
- **PoliTo:** sondare la vista `mobile/` per un contratto meno fragile del WebForms.

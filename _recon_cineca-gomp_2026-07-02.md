# Ricognizione Cineca-UP / GOMP — 6 atenei target (2026-07-02)

Ricognizione **sola lettura** (nessun codice scritto) sui 6 atenei candidati per il
prossimo adapter: Sapienza, Bologna, PoliMi, PoliTo, Padova, Pisa. Metodo: robots.txt
per primo su ogni host, richieste `curl` singole e moderate, evidenza reale per ogni
affermazione (status HTTP + payload). Per i portali SPA i path API sono stati estratti
dal bundle JS e poi verificati con richieste dirette. Ciò che richiede login è marcato
"non verificabile senza credenziali" — mai ipotizzato.

Contesto stagionale: a luglio le lezioni 2025/26 sono finite e l'AA 2026/27 spesso non
è pubblicato; una griglia vuota **non** prova "non pubblicato" (lezione già imparata col
caveat celle=0 EasyAcademy). Dove rilevante è indicata la finestra provata.

Evidenza grezza (output curl completi) salvata nella scratchpad di sessione
(`recon-<ateneo>/`), non committata.

---

## Sapienza (uniroma1) — GOMP dietro corsidilaurea.uniroma1.it · PUBBLICO ✅

**Sistema**: GOMP (Be Smart), esposto però tramite **corsidilaurea.uniroma1.it**
(Drupal 7, "Course catalogue"): i dati arrivano da rotte `services/gomp/…` server-side,
niente `*-public.gomp.it` da chiamare direttamente.

**Stato**: orario **pubblico** (JSON), appelli **pubblici** (HTML server-rendered).
La prenotazione resta su Infostud (login, fuori scope lettura).

| Richiesta | Esito |
|---|---|
| GET `/robots.txt` | 200 — permissivo, `Crawl-delay: 10` |
| GET `/it/course/33503/attendance/timetable` | 200 — pagina FullCalendar; nei Drupal settings: `events_url` |
| GET `/it/services/gomp/timetable-data/33503?start=2025-10-13&end=2025-10-18` | **200, 53 KB JSON** |
| GET `/it/course/33503/attendance/exams` | **200 — tabella HTML appelli** (docente, finestra prenotazione, data appello; dati reali fino a settembre 2026) |
| GET `/` (home) | 200 — elenca **tutti** i corsi come link `/it/course/<id>` |
| GET `/sitemap.xml` | 404 |
| GET `/it/services/gomp/exams-data/33503` | pagina errore Drupal → nessun feed JSON esami |

**Esempio reale** (orario, corso 33503 = Informatica):

```json
{"events":[{"id":0,"start":"2025-10-14T14:00:00.0000000","end":"2025-10-14T17:00:00.0000000",
"title":"<b>PROGRAMMAZIONE PER IL WEB</b><p class=\"cal-space\"><i title=\"Aula\" …></i> Aula Magna (RM111, Accessibile: Si)…",
"curricula":[],"course_years":[],"partitions":[],"ssds":[]}]}
```

**Equivalente combo.php**: la home elenca tutti i corsi (`/it/course/<id>`) in un solo
GET; il feed orario/esami è keyed sul node id del corso. Da chiarire in implementazione
la semantica id↔coorte/anno accademico.

**Particolarità**: `title` è HTML embedded nel JSON (nome, docente, aula da spacchettare);
`course_years`/`curricula`/`partitions` presenti per filtri; esami solo come tabella HTML;
`Crawl-delay: 10` da onorare nel sync.

**Complessità adapter**: **media** — JSON pulito ma title-parsing + esami HTML + mappatura
corso/coorte. Non generalizza automaticamente agli altri atenei GOMP (Roma Tre, Catania,
Cassino usano superfici `*-public.gomp.it` diverse): di fatto sarebbe un adapter Sapienza.

**Non verificabile senza credenziali**: prenotazione appelli (Infostud), carriera.

---

## Bologna (unibo) — in-house Plone su corsi.unibo.it · PUBBLICO, orario da rivalidare a settembre ⚠️

**Sistema**: in-house (Plone). Ogni corso ha pagine `corsi.unibo.it/laurea/<slug>/…`.

**Stato**: appelli **pubblici** (HTML). Orario: endpoint JSON **pubblico e funzionante**
(200, JSON valido) ma **payload vuoto in ogni finestra provata** — ott 2025, mag 2026,
set 2026, con e senza `anno`/`curricula` → i dati dell'AA passato paiono rimossi e il
2026/27 non è ancora pubblicato. Verdetto orario rinviato a settembre.

| Richiesta | Esito |
|---|---|
| GET `corsi.unibo.it/robots.txt` | 200 — disallow solo su path di test/modello |
| GET `/laurea/informatica/orario-lezioni` | 200 — calendario con `data-url` → `@@orario_reale_json?` |
| GET `/laurea/informatica/orario-lezioni/@@available_curricula` | **200 JSON**: `[{"value":"000-000","label":"CURRICULUM: INFORMATICA"}]` |
| GET `…/@@orario_reale_json?anno=1&curricula=000-000&start=2025-10-13&end=2025-10-18` | 200 — `[]` |
| GET `…/@@orario_reale_json?start=2026-05-11&end=2026-05-16` (e altre 2 finestre) | 200 — `[]` |
| GET `/laurea/informatica/appelli` | **200, 409 KB HTML pubblico**: tabelle per insegnamento con "Data e ora: 16 luglio 2026 ore 09:00", lista iscrizioni |

**Equivalente combo.php**: non verificato oggi — serve enumerazione degli slug corso
(sitemap di corsi.unibo.it o il portale opendata unibo, da sondare in implementazione).

**Particolarità**: parametri del calendario appesi via patternslib (glue non isolato nel
JS pubblico); i checkbox insegnamenti usano id composti (`2026-000-319297--I|58414`).

**Complessità adapter**: **media** — se a settembre il JSON orario torna popolato è un
adapter semplice (JSON + HTML appelli); l'enumerazione slug è il lavoro extra.

**Non verificabile senza credenziali**: nulla di essenziale (AlmaEsami per iscrizione).

---

## Politecnico di Milano (polimi) — in-house · sostanzialmente GATED ❌

**Sistema**: in-house. Lo strumento orario ufficiale vive nei Servizi Online
(aunicalogin → **login**).

**Stato**: **misto, di fatto gated per l'orario vero**. Pubblici solo i **Manifesti**
(`onlineservices.polimi.it/manifesti/manifesti/controller/ManifestoPublic.do` con
parametri espliciti `aa=2026&k_cf=222&k_corso_la=1030&k_indir=IE1…`), che includono uno
strumento "Orario Personalizzato": un flusso a carrello (`EVN_ADDCART`/`EVN_DELCART`,
`jsessionid` stateful, `OrarioSlot.css`) per costruirsi la settimana — non un feed dati.

| Richiesta | Esito |
|---|---|
| GET robots (www + onlineservices) | 200 — permissivi (`Crawl-delay: 5` su onlineservices) |
| GET `ManifestoPublic.do?…k_corso_la=1030…` | 200 — manifesto pubblico con righe corso (`codDescr`, `semestre`, `anno_corso`) |
| GET `polimi.it/strumenti/orario-lezioni/` | **404** |
| Orario per corso senza login | **non trovato**; il manifesto rimanda al "servizio Orario delle lezioni presente nel tuo elenco dei Servizi Online" (login) |
| Appelli pubblici | **non trovati** — non verificabile senza credenziali |

**Equivalente combo.php**: i codici `k_corso_la`/`k_cf`/`k_indir` sono enumerabili dalle
pagine manifesti, ma alimentano solo il piano studi, non un orario strutturato.

**Complessità adapter**: **alta** e a valore ridotto (senza login niente orario reale né
appelli). Da riconsiderare solo se emergesse un'API pubblica non trovata oggi.

---

## Politecnico di Torino (polito) — in-house · orario PUBBLICO ma WebForms ⚠️

**Sistema**: in-house, ASP.NET WebForms: **swas.polito.it/dotnet/orari_lezione_pub/**.

**Stato**: orario **pubblico** senza login; appelli sul Portale della Didattica
(**non verificabile senza credenziali**).

| Richiesta | Esito |
|---|---|
| GET `didattica.polito.it/robots.txt` | 200 — disallow su `/guida/<anni>/` (rispettato) |
| GET `swas.polito.it/robots.txt` | 200 — disallow `/cgi-bin/` e servizi non pertinenti |
| GET `/dotnet/orari_lezione_pub/Default.aspx` | 200 — indice pubblico (+ `mobile/default.aspx`, ricerca aule libere) |
| GET `/dotnet/orari_lezione_pub/filtri_consultazione_generale.aspx` | 200 — cascata `ddlAnnoAccademico` (2026 = 2025/2026) → `ddlSede` → `ddlTipoLaurea` → `ddlArea` → `ddlCdl` |

**Equivalente combo.php**: la cascata di select È l'enumerazione (anni dal 2015/16 al
2025/26 visibili), **ma** ogni passo è un `__doPostBack` con `__VIEWSTATE`: per arrivare
alla griglia serve replicare lo stato server passo-passo, non una GET parametrica.

**Complessità adapter**: **medio-alta** — pubblico ma scraping WebForms stateful,
fragile a ogni deploy; niente appelli. Esiste anche una vista `mobile/` non approfondita
oggi che potrebbe avere un contratto più semplice (da sondare prima di scartare).

---

## Padova (unipd) — EasyAcademy: **appelli integrabili OGGI con l'adapter esistente** ✅

**Sistema**: EasyAcademy (`agendastudentiunipd.easystaff.it`), lo stesso dell'adapter
già in produzione.

**⚠️ robots.txt**: `User-agent: * / Disallow: /` (blocco totale). Il probe odierno è
stato quindi ridotto a **2 richieste** identiche a quelle della UI pubblica (uso da
client, non crawling). Prima del wiring va deciso esplicitamente come trattare questo
robots nel sync di prodotto (il sync agisce come client per conto dello studente, come
per gli altri host EasyAcademy — ma la scelta va messa a verbale).

| Richiesta | Esito |
|---|---|
| GET `combo.php?sw=ec_&aa=2025&page=corsi` | 200 — **400 corsi**, `elenco_anni` **vuoto su tutti** (confermato anche oggi) → orario NON esposto per corso/anno |
| POST `test_call.php` (body identico all'adapter: `view=easytest&form-type=et_cdl&…&scuola=ScuoladiScienze&esami_cdl=SC2987&anno2[]=1,2,3&datefrom=02-07-2026&dateto=31-12-2026`) | **200, 82 KB: 6 insegnamenti, 18 appelli reali**, shape identica al contratto dell'adapter |

**Esempio reale** (INFORMATICA `SC2987`, Scuola di Scienze):
`ARCHITETTURA DEGLI ELABORATORI — Data 07-07-2026, 09:30-14:00, LABTA [TORRE ARCHIMEDE],
docenti Sperduti/Navarin, event_Annullato: 0, cds: "INFORMATICA [SC2987] - Laurea, 1 anno"`.

**Verdetto**: **esami sì, orario no** (chiave a periodo/semestre senza `anno2` pubblici).
Risposta netta alla domanda chiave: **integrabile con l'adapter esistente, exams-only**.
Unico lavoro tecnico: oggi `degreeSources()` (easystaff.ts, layer universities — non è
tra i file intoccabili) emette sempre anche la sorgente orario; serve una variante
exams-only per preset. Nessun tocco a `adapters/easyacademy.ts` né a `engine.ts`.

**Complessità**: **bassa** — niente adapter nuovo; censimento corsi target + sonda
end-to-end multi-corso (stesso metodo dei 19 atenei live) + preset.

---

## Pisa (unipi) — Cineca University Planner · PUBBLICO, contratto API verificato ✅

**Sistema**: Cineca UP (`unipi.prod.up.cineca.it`), SPA AngularJS + REST LoopBack su
`/api`. Il `calendarioPubblico` funziona senza login.

**Catena pubblica completa, verificata end-to-end:**

| Richiesta | Esito |
|---|---|
| GET `/robots.txt` | 200 — permissivo |
| GET `/api/Clienti/cercaPerDominio?dominio=unipi.prod.up.cineca.it` | **200**: `{"id":"628de8b9b63679f193b87046","codice":"UNIPI",…}` → `clienteId` |
| POST `/api/Impegni/getImpegniCalendarioPubblico` `{clienteId, linkCalendarioId, dataInizio, dataFine}` | **200, 760 KB** su calendario recente (32 impegni in una settimana di marzo 2026) |
| stessa POST senza `clienteId` | 400 esplicito `"clienteId is a required argument"` |
| stessa rotta in GET | 401 `AUTHORIZATION_REQUIRED` (le rotte pubbliche sono **POST**) |
| POST su calendario stantio (2022, "Informatica Triennale" da vecchio link) | 200 — `[]` (attenzione ai link morti) |
| POST `/api/LinkCalendario/getLinkCalendariPubbliciUP` | **401** → l'enumerazione dei calendari NON è pubblica |
| GET `unito.prod.up.cineca.it/api/Clienti/cercaPerDominio?dominio=…` | **200, stesso shape** (`codice":"UNITO"`) → contratto identico tra istanze |

**Struttura dati** (impegno): `dataInizio`/`dataFine` ISO, `aule[].descrizione`,
`docenti[]`, `evento.dettagliDidattici[]` con `nome`, `annoCorso`, `cfu`, `annoOrdinamento`
— tutto il necessario per mappare a `ClassEvent`, incluso il filtro per anno di corso.

**Equivalente combo.php**: **non pubblico** (la rotta di enumerazione è 401). I
`linkCalendarioId` (GUID) vanno raccolti dai link che i dipartimenti unipi pubblicano
sulle proprie pagine (`…/calendarioPubblico/linkCalendarioId=<guid>`, facilmente
reperibili) — stessa disciplina della cattura manuale dei codici EasyAcademy: mai
inventarli, censirli e verificarli.

**Particolarità**: esiste anche un export iCal (`GET /FiltriICal/impegniICal?id=<filtroId>`,
id generato dalla UI) — potenziale percorso "incolla il link del tuo calendario" col
adapter `ical` **già esistente**, non verificato oggi senza un filtro reale. Gli appelli
d'esame NON risultano esposti dal calendarioPubblico (a UI sono orari lezioni/aule);
per gli esami unipi la pista è Esse3 — **non verificato oggi**.

**Complessità adapter UP**: **media** — contratto JSON pulito e identico tra istanze
(≈9-12 atenei UP nel censimento: unito, unipv, unisi, univr, unical, unime, unibs,
unifg, unirc, unibas, uniurb, uniroma4); il nodo è il censimento/manutenzione dei
`linkCalendarioId` per corso/anno/semestre e la loro rotazione annuale.

---

## Raccomandazione — ordine di attacco

1. **Padova (exams-only, adapter esistente)** — rapporto sforzo/valore imbattibile:
   zero adapter nuovo, contratto già verificato oggi con appelli reali. Non richiede
   la sessione dedicata Opus: è lavoro standard da sync-engineer (variante exams-only
   di `degreeSources` + preset + censimento corsi). **Prerequisiti prima della sessione:**
   (a) decisione esplicita sulla policy robots (`Disallow: /` sull'host unipd);
   (b) lista dei corsi target e sonda end-to-end batch su ciascuno;
   (c) spec della variante exams-only (il preset non deve emettere sorgenti orario).
2. **Pisa → adapter Cineca UP** — il vero "prossimo adapter" del titolo: contratto
   verificato end-to-end oggi e **riusabile su ~9-12 atenei** (parità confermata su
   unito). Prima della sessione di implementazione (Opus 4.8/xhigh come da piano):
   censire i `linkCalendarioId` dei corsi target dalle pagine unipi, decidere la
   granularità dei calendari (per corso/anno/semestre), definire il mapping
   `dettagliDidattici → ClassEvent`, chiarire la storia esami (Esse3? manuale?).
3. **Sapienza** — pubblico sia orario (JSON) che appelli (HTML), valore enorme
   (l'ateneo più grande d'Italia), ma adapter dedicato che non generalizza al resto
   del mondo GOMP: da fare dopo UP.
4. **Bologna** — appelli pubblici già oggi; il verdetto sull'orario è rinviato a
   settembre (endpoint vivo ma vuoto off-season). Ricontrollare `@@orario_reale_json`
   nella prima settimana di lezione e completare l'enumerazione slug.
5. **PoliTo** — pubblico ma WebForms/VIEWSTATE stateful: fattibile, fragile, senza
   appelli. Prima di scartare: sondare la vista `mobile/`.
6. **PoliMi** — orario vero e appelli dietro login; pubblici solo manifesti + carrello
   orario personalizzato. Al fondo della lista.

**Regola d'arresto** (2 atenei bloccati per lo stesso motivo): non scattata — 4/6 hanno
superfici pubbliche verificate, i 2 Politecnici sono gated/fragili per motivi diversi.

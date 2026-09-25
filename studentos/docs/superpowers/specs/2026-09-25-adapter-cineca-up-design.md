# SPEC — Adapter Cineca University Planner (UP)

Data: 2026-09-25 · Stato: **adapter dormiente sul branch, nessun preset collegato**.

**Obiettivo:** orario lezioni live per gli atenei su Cineca University Planner
(`*.prod.up.cineca.it/calendarioPubblico`), partendo da Pisa, con un solo
provider riusabile su tutte le istanze.

## Perché UP

Un adapter copre 13 atenei oggi in modalità manuale (`_coverage.md`): Torino,
Pisa, Pavia, Verona, Siena, Calabria, Messina, Brescia, Foggia, Reggio
Calabria, Basilicata, Urbino, Foro Italico. Il contratto REST è identico tra
istanze (parità Pisa/Torino verificata il 2026-07-02).

## Contratto (fonti)

Verificato dal vivo il 2026-07-02 (`_recon_cineca-gomp_2026-07-02.md`):

| Richiesta | Esito |
|---|---|
| `GET /api/Clienti/cercaPerDominio?dominio=<host>` | 200 `{"id":"<ObjectId>","codice":"UNIPI",…}` → `clienteId` |
| `POST /api/Impegni/getImpegniCalendarioPubblico` `{clienteId, linkCalendarioId, dataInizio, dataFine}` | 200, **array** di impegni (760 KB per 32 impegni in una settimana); calendario stantio → `[]` |
| stessa POST senza `clienteId` | 400 `"clienteId is a required argument"` |
| stessa rotta in GET | 401 (le rotte pubbliche sono POST) |
| `POST /api/LinkCalendario/getLinkCalendariPubbliciUP` | 401 → l'elenco dei calendari NON è pubblico |

Campi dell'impegno visti nel recon: `dataInizio`/`dataFine` (ISO), `aule[].descrizione`,
`docenti[]`, `evento.dettagliDidattici[]` con `nome`, `annoCorso`, `cfu`, `annoOrdinamento`.

Da fonti pubbliche (ricerca web 2026-09-25, **seconda mano**): il body accetta anche
`mostraImpegniAnnullati`, `mostraIndisponibilitaTotali`, `pianificazioneTemplate`
(di solito `false`); i link pubblici dei dipartimenti hanno la forma
`/calendarioPubblico/linkCalendarioId=<ObjectId>` e talvolta filtri `corsi=`/`anniCorso=`.
Il `linkCalendarioId` è un ObjectId: i primi 8 caratteri esadecimali sono il timestamp
di creazione, utile a scartare i calendari degli anni passati (es. "orario Informatica
Triennale" di Pisa trovato online = settembre 2022, stantio).

**Da confermare con una fixture reale prima di collegare un preset** (ambiente cloud
del 2026-09-25 senza egress verso gli atenei):
1. formato di `dataInizio`/`dataFine` nella richiesta (l'adapter manda ISO UTC);
2. fuso delle date nella risposta (con `Z`/offset → preso così; senza → ora di Roma);
3. forma di `docenti[]` (stringa o `{nome, cognome}`: gestite entrambe);
4. campo del tipo attività (`LEZIONE`/…): oggi `kind: "other"` (nella UI identico a lezione);
5. campo dello stato annullato: oggi la richiesta chiede `mostraImpegniAnnullati: false`
   (le lezioni annullate spariscono invece di comparire come attive: mai dati sbagliati);
6. se `anniCorso`/`corsi` del link pubblico sono filtri server-side o solo della UI;
7. per un insegnamento condiviso tra lauree, `dettagliDidattici` elenca più coppie
   (corso, anno): oggi il filtro anno tiene l'impegno se QUALSIASI anno combacia; va
   ristretto alla coppia del proprio corso appena la fixture mostra il campo del codice corso.

## Design

**File:**
- `src/lib/sync/adapters/cineca-up.ts` — provider `cineca-up`, capability `timetable`.
- `src/lib/sync/registry.ts` — registrazione.
- `src/lib/sync/universities/cineca-up.ts` — `upProgramSources(baseUrl, clienteId, slug, years)`,
  gemello di `degreeSources`: emette `<slug>-orario-anno-N` (il suffisso che leggono
  `yearOfSource`/`matchesYear` per i filtri anno di /orario, /appelli e Panoramica).
- `scripts/probe-cineca-up.ts` — verifica live di sola lettura (vedi sotto).
- `tests/cinecaUp.test.ts` — payload **sintetici** dichiarati come tali.

Nessun tocco a `engine.ts`, `easyacademy.ts`, `db.ts`. L'allowlist SSRF si ricava da
`params.baseUrl` per `providerId` (`validateUrl.ts`): senza preset, nessun host UP è
raggiungibile da `/api/sync` → l'adapter è inerte finché non esiste un preset.

**Params (zod):** `{ kind: "timetable", baseUrl, clienteId, linkCalendarioIds[], anniCorso? }`.
`clienteId` e ogni `linkCalendarioId` devono essere ObjectId (24 hex): catturati, mai
inventati. Più calendari per sorgente (es. I e II semestre dello stesso anno).
`anniCorso` filtra sugli `evento.dettagliDidattici[].annoCorso`; con il filtro attivo
un impegno senza anno dichiarato viene scartato (meglio niente che l'anno sbagliato).

**Richieste:** una POST per settimana per calendario (max 20 settimane, come
EasyAcademy), via `politeFetch` (UA, backoff, 250 ms tra richieste allo stesso host,
`redirect: "manual"`). Le sorgenti per-anno di uno stesso corso condividono spesso lo
stesso calendario: una memo di processo (60 s) per `baseUrl|calendario|settimana` fa sì
che il calendario venga scaricato una volta sola per sync, non una per anno.

**Mapping impegno → `ClassEvent`:** `courseName` = primo `dettagliDidattici[].nome`
(fallback `nome` dell'impegno; senza nome → scartato); `start`/`end` normalizzati a
UTC; `room` = `aule[].descrizione` unite; `teacher` = `docenti` resi "Nome Cognome";
`id` = `stableId("up", <id upstream> | nome+inizio)`. Risposta non-array o HTTP non-2xx
→ la sorgente fallisce (conserva la cache).

**Esami:** non esposti dal calendario pubblico. Gli atenei UP restano con appelli
manuali (pista futura: Esse3 pubblico), come gli atenei EasyAcademy "solo orario".

## Verifica live (quando c'è rete)

```
cd studentos
./node_modules/.bin/tsx scripts/probe-cineca-up.ts https://unipi.prod.up.cineca.it <linkCalendarioId>…
```
Risolve `clienteId`, fa una POST per calendario sulla settimana corrente, salva la
risposta grezza in `tests/fixtures/cineca-up/`, stampa chiavi dei campi, anni di
corso trovati e l'esito del parser dell'adapter sulla risposta reale.

## Ordine dei lavori rimasti

1. Probe su Pisa (e Torino) → fixture reali committate → test sull'adapter che le
   parsa; correggere i punti 1-6 sopra in base a ciò che si vede.
2. Censimento dei `linkCalendarioId` 2026/27 dalle pagine dei dipartimenti (timestamp
   ObjectId recente + POST con impegni reali), poche lauree di Pisa per iniziare.
3. Preset `unipi.ts` con `livePrograms` da `upProgramSources`, righe in
   `scripts/verified-endpoints.txt`, `_unipi_coverage.md`, verifica in browser.
4. Poi Torino e gli altri atenei UP; ogni settembre ri-censire i calendari (ruotano).

**Fuori scope:** esami UP, export iCal UP (`/FiltriICal/impegniICal`), GOMP/Sapienza.

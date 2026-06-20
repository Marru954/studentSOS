# Esperimento sync client-side — Tor Vergata Informatica

**Esito: FUNZIONA.** Il sync lato browser scarica e salva le materie reali del
manifesto di Informatica (triennale) di Tor Vergata. Verificato end-to-end nel
browser con il dev server: **25 insegnamenti reali** salvati in IndexedDB.

Branch: `feat/sync-client-side` (da `main`, isolato dalle fasi 1-5).

## La premessa era già risolta in architettura

L'obiettivo era "far funzionare il parsing lato browser" perché `DOMParser` non
esiste in Node. Ma il codice su `main` **fa già esattamente questo**:

- `src/app/api/insegnamenti/sync/route.ts` (server) **non** parsa: scopre l'URL e
  restituisce l'**HTML grezzo** (`ManifestoApiResponse.html`).
- `src/lib/insegnamenti/parser.ts` (client) parsa con `DOMParser` nel browser.
- `src/lib/insegnamenti/sync.ts` (client) chiama la route, parsa l'HTML e salva
  in IndexedDB.

Quindi lo split server-fetch / client-parse c'era già. Il vero problema era un
**altro**: la `discovery` puntava all'host sbagliato.

## Il vero bug: host sbagliato nella discovery

`src/lib/insegnamenti/discovery.ts` aveva:

```ts
uniroma2: { base: "https://didattica.uniroma2.it" }
```

`didattica.uniroma2.it` è JS-driven (niente tabella nell'HTML statico), e per di
più il manifesto di Informatica non sta lì. Il manifesto vero è una pagina
**WordPress server-rendered** su un altro host:

    https://informatica.uniroma2.it/home/triennale/studiare/insegnamenti/

Verificato con `curl`: HTTP 200, 108 KB, **1 `<table>` con 43 token CFU**, nessun
marker SPA (solo `wp-content`). Le colonne sono esattamente quelle attese dal
parser: Insegnamento · Codice · Settore · CFU · Semestre · Docente · Propedeuticità.

### Fix applicato (discovery.ts)

```ts
uniroma2: {
  base: "https://informatica.uniroma2.it",
  corsoUrls: (slug) => {
    if (!slug.includes("informatica")) return [];
    const livello = slug.includes("magistr") ? "magistrale" : "triennale";
    return [`https://informatica.uniroma2.it/home/${livello}/studiare/insegnamenti/`];
  },
},
```

- L'allowlist SSRF ora include `informatica.uniroma2.it` (deriva da `base`).
- `corsoUrls` scatta **solo** per i corsi di Informatica; gli altri corsi di Tor
  Vergata cadono correttamente in manuale (nessun dato sbagliato).
- Magistrale: l'URL è costruito per simmetria ma **non l'ho verificato** — va
  controllato prima di darlo per buono (regola: non inventare endpoint).

## Enhancement parser: anno dalle righe-sezione

La tabella **non ha una colonna "Anno"**: gli anni sono righe-separatore a cella
singola ("I Anno", "II Anno", "III Anno"). Il parser le saltava → tutte le materie
restavano senza `anno`.

Aggiunto `annoFromHeader()` in `parser.ts`: una riga con una sola cella
significativa che contiene "...anno..." (numero / romano / parola) imposta
`annoCorrente`, applicato alle materie successive (se non hanno una colonna anno
propria). Pattern di tabella standard, non un workaround fragile.

Risultato dopo l'enhancement: **anno 1 → 6 materie, anno 2 → 7, anno 3 → 12.**

## Cosa ho cambiato (solo su questo branch)

- `src/lib/insegnamenti/discovery.ts` — host + corsoUrls per Informatica Tor Vergata.
- `src/lib/insegnamenti/parser.ts` — `annoFromHeader()` + tracking riga-sezione.

`engine.ts` e `easyacademy.ts` non toccati. tsc + lint + build + test verdi.

## Da decidere al risveglio

1. Portare questi due fix anche sul branch delle fasi 1-5 (o mergiare prima
   questo). Sono indipendenti e additivi.
2. Verificare l'URL magistrale prima di affidarcisi.
3. Generalizzare: lo stesso pattern (manifesto WordPress server-rendered) vale per
   altri dipartimenti? Per ora wired solo Informatica triennale (verificato).

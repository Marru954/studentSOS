# StudentOS

Gestionale universitario **offline-first** per studenti italiani: orario delle
lezioni, appelli d'esame, libretto, note e sessioni di studio in un'unica app.
I dati pubblici (orari, esami, news) vengono sincronizzati live dai portali degli
atenei; i dati personali (libretto, note, task) restano sul dispositivo.

## Cosa fa

- **Sync live degli orari/esami** da **18 atenei EasyAcademy** (Tor Vergata,
  Firenze, Genova, Napoli Federico II, Perugia, Parma, Salerno, …). I codici
  corso/anno vengono **catturati dagli endpoint reali, mai inventati**: un corso
  non verificabile resta in modalità manuale. Il resto degli atenei pubblici
  italiani è disponibile come preset **manuale**.
- **Libretto "sincronizzato dall'ateneo"** via import PDF Delphi lato client
  (pdfjs nel browser, zero upload). I voti sincronizzati sono separati dai record
  manuali dell'utente.
- **Orario, panoramica, calendario appelli, note, focus/studio** — tutto
  navigabile offline, con notifiche di cambiamento (diff dei contenuti sincronizzati).
- **Layer online opzionale (Supabase):** login email+password istituzionale con
  sincronizzazione cloud. Se le variabili Supabase sono assenti, l'app è
  esattamente la build locale-only.

## Stack

| Area | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19**, **Tailwind CSS v4** |
| Linguaggio | **TypeScript** (strict) |
| Stato | **Zustand 5** (mirror in-memory write-through) |
| Persistenza locale | **IndexedDB** via `idb` — unica fonte di verità |
| Cloud opzionale | **Supabase** (`@supabase/ssr` + `supabase-js`), env-gated |
| Validazione | **zod** |

**Offline-first:** IndexedDB (`src/lib/storage/db.ts`) è la source of truth; gli
store Zustand si idratano da IndexedDB al mount e riscrivono a ogni sync. Due
territori dati distinti: **SYNCED** (cache pubbliche, sostituite in blocco per
sorgente) e **MANUAL** (record dell'utente, la sync non li tocca mai).

## Avvio in locale

Requisiti: Node.js 24, npm.

```bash
cd studentos
npm install

# dev server → http://localhost:3000
npm run dev
```

L'app parte senza alcuna configurazione (modalità locale-only).

### Layer cloud opzionale (Supabase)

Per abilitare login e sync cloud, crea `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Schema + RLS in `supabase/migrations/`.

## Comandi

```bash
npm run dev      # dev server (Turbopack)
npm run build    # build di produzione
npm run start    # serve la build
npm test         # suite di test (tsx, node:test)
npm run lint     # eslint
```

## Struttura

```
src/
  app/            route App Router + API (/api/sync, /api/sync-delphi, …)
  components/     UI (landing, onboarding, libretto, orario, …)
  lib/
    storage/      IndexedDB (db.ts), diff, sync client
    state/        store Zustand
    sync/         engine sync + adapters (easyacademy, ical, wordpress-news)
      universities/  preset per ateneo (uno per ateneo live) + coverage
    supabase/     auth + client SSR (opzionale)
    domain/       tipi e logica di dominio
docs/
  stato/          STATO.md (log di sessione) + report QA
  superpowers/    plan e spec datati
```

I dettagli di architettura e le regole di progetto sono in
[`CLAUDE.md`](../CLAUDE.md); lo stato corrente in [`docs/stato/STATO.md`](docs/stato/STATO.md).

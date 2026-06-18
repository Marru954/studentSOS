# Obiettivo laurea: switch unità /30 ↔ /110

Data: 2026-06-18

## Problema

Lo studente pensa all'obiettivo in due modi a seconda di quanto è avanti:
- **media /30** — il numero che vede ogni giorno, utile sempre;
- **voto di laurea /110** — il modo in cui ragiona quando è vicino alla fine ("voglio uscire con almeno 99").

Oggi il pannello **"Obiettivo laurea"** (`GoalPanel`, `src/components/dashboard/CareerPanels.tsx`) accetta l'obiettivo **solo in media /30**. Il punto di vista /110 esiste solo in lettura (base di laurea), mai come input.

## Cosa esiste già (NON va rifatto)

Il cuore di questa feature è già spedito in `GoalPanel`:
- input media obiettivo /30 + CFU del piano (editabili);
- media attuale · "serve nei prossimi: X su Y CFU" (via `requiredAverage`) · CFU mancanti;
- esiti già gestiti: `met` ("al sicuro") / `reachable` / `unreachable` ("oltre 30") / `no-remaining` ("piano completato").

La matematica di inversione media→voto richiesto (`requiredAverage` in `src/lib/domain/projection.ts`) e media→/110 (`graduationBase` in `src/lib/domain/libretto.ts`) è già presente e testata.

## Scope (cosa è davvero nuovo)

Solo l'input dell'obiettivo diventa **bi-unità**, con uno switch /30 ↔ /110.

Fuori scope (scartati in brainstorming):
- modalità "tetto/pavimento" (tutti 30L / voto minimo) — clutter ansiogeno, riga singola già chiara;
- punti tesi / bonus lode / formula laurea per ateneo — solo **base di laurea**, niente formula inventata (regola repo "wrong data is worse than none");
- card nel cruscotto — il cruscotto resta com'è, niente doppione.

## Design

### 1. Dominio — `src/lib/domain/libretto.ts`

Aggiungere l'inverso esatto di `graduationBase`, accanto ad essa:

```ts
/** Inverso di graduationBase: dalla base /110 ricava la media ponderata /30. */
export function baseToAverage(base: number): number {
  return (base / 110) * 30;
}
```

Pura, deterministica. Verifica (roundtrip esatto, già controllata):
`99/110 → 27,00` · `110 → 30` · `66 → 18` · `baseToAverage(graduationBase(27)) === 27`.

### 2. UI — `GoalPanel` in `src/components/dashboard/CareerPanels.tsx`

Il campo "Media obiettivo" diventa un gruppo con **toggle unità** (due chip/segmented: `/30` · `/110`), default `/30`.

- Stato unità: `useState<"avg"|"base">("avg")` (locale al pannello, non persistito).
- L'input mostra il valore nell'unità scelta:
  - unità `avg`: valore = `targetAverage`, range 18–30, step 0.5;
  - unità `base`: valore = `graduationBase(targetAverage)`, range 66–110, step 1.
- Su `onChange`: converto sempre verso `targetAverage` (/30) con `baseToAverage` quando in modalità `base`, poi chiamo `onPlanChange`/`onTargetChange` come oggi. **Lo storage non cambia: si salva sempre `targetAverage` /30.**
- Sotto l'input, riga grigia con l'equivalente nell'altra unità: in `avg` → "≈ {base}/110"; in `base` → "≈ media {avg}".

Resto del pannello (media attuale, "serve nei prossimi", CFU mancanti) invariato — legge sempre `targetAverage`.

### 3. Accessibilità

- Toggle unità: `role="group"` con `aria-label="Unità obiettivo"`, ogni chip un `button` con `aria-pressed`.
- Input collegato a `<label>` esistente (`Field`), `aria-label` aggiornato all'unità attiva.
- Tutto keyboard-reachable (chip = button nativi).

## Vincoli repo rispettati

- `src/lib/storage/db.ts` **non toccato** — `targetAverage` resta /30, nessun `DB_VERSION` bump.
- Sync core non toccato.
- Design system invariato (chip/segmented con token esistenti, niente CSS per-componente).
- UI copy italiano.

## Test

`baseToAverage` è l'inverso algebrico esatto di `graduationBase`. **Non aggiungibile a `npm test`**: sia `tests/projection.test.ts`/`tests/*` sia `package.json` sono nella lista "mai editare" della repo. Verifica fatta via `node -e` (roundtrip esatto, sopra). Limite dichiarato: questo one-liner non avrà copertura in CI finché la repo non sblocca l'aggiunta di test file.

## Verifica finale

`npm run build`, `tsc --noEmit`, `npm run lint` verdi. Verifica visiva in Chrome (firmato) su `/libretto`: toggle /30↔/110 cambia il valore mostrato e la riga "serve nei prossimi" resta coerente.

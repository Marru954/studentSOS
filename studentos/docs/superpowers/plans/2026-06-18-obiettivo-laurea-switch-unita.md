# Obiettivo laurea: switch unità /30 ↔ /110 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettere di impostare l'obiettivo della media nel pannello "Obiettivo laurea" sia come media /30 sia come voto di laurea /110, salvando sempre internamente la media /30.

**Architecture:** Aggiungo l'inverso puro `baseToAverage` accanto a `graduationBase` in `domain/libretto.ts`; il pannello `GoalPanel` (`dashboard/CareerPanels.tsx`) ottiene un toggle unità locale (`useState`) che converte il valore mostrato/inserito ma chiama sempre gli stessi callback con `targetAverage` /30. Storage invariato.

**Tech Stack:** Next.js 16 (Turbopack), React 19, Tailwind v4, TypeScript. Token CSS del design system esistente.

## Global Constraints

- `src/lib/storage/db.ts` e `tests/` e `package.json` e `scripts/` **mai editare**.
- Sync core mai editare: `src/lib/sync/adapters/easyacademy.ts`, `src/lib/sync/engine.ts`.
- Nessuna nuova dipendenza npm.
- `targetAverage` resta sempre /30 — nessun `DB_VERSION` bump.
- UI copy in italiano.
- `"use client"` solo dove serve (qui il pannello è già client per gli input).
- a11y su ogni componente nuovo: `aria-label`, `aria-pressed`, keyboard-reachable.
- Verde prima del commit: `npm run build`, `tsc --noEmit`, `npm run lint`.
- Design system fisso: usare token/primitive esistenti, niente CSS per-componente.

---

### Task 1: `baseToAverage` in domain

**Files:**
- Modify: `src/lib/domain/libretto.ts` (aggiungere funzione dopo `graduationBase`, ~riga 54)
- Test: NESSUNO committabile. `tests/*` e `package.json` sono congelati (Global Constraints). Verifica via `node -e` standalone, sotto.

**Interfaces:**
- Consumes: niente.
- Produces: `baseToAverage(base: number): number` — inverso di `graduationBase`. Per ogni `a` in [18,30], `baseToAverage(graduationBase(a)) === a`.

- [ ] **Step 1: Implementare la funzione**

In `src/lib/domain/libretto.ts`, subito dopo `graduationBase`:

```ts
/** Inverso di graduationBase: dalla base /110 ricava la media ponderata /30. */
export function baseToAverage(base: number): number {
  return (base / 110) * 30;
}
```

- [ ] **Step 2: Verificare l'inverso (standalone, non committato)**

Run:
```bash
cd "studentos" && node -e "const g=a=>(a/30)*110,b=x=>(x/110)*30; console.log(b(99).toFixed(2),b(110).toFixed(2),b(66).toFixed(2), b(g(27)).toFixed(4))"
```
Expected: `27.00 30.00 18.00 27.0000`

- [ ] **Step 3: Typecheck**

Run: `cd "studentos" && ./node_modules/.bin/tsc --noEmit`
Expected: nessun errore.

- [ ] **Step 4: Commit**

```bash
git add src/lib/domain/libretto.ts
git commit -m "feat: baseToAverage, inverso di graduationBase"
```

---

### Task 2: Toggle unità /30 ↔ /110 in `GoalPanel`

**Files:**
- Modify: `src/components/dashboard/CareerPanels.tsx` (componente `GoalPanel`, ~righe 200-291)
- Test: verifica visiva in Chrome (no test unit per componenti in questa repo).

**Interfaces:**
- Consumes: `baseToAverage` (Task 1), `graduationBase` (già importato da `@/lib/domain/libretto`).
- Produces: nessuna nuova API pubblica. `GoalPanel` props invariate; salva sempre `targetAverage` /30 via `onPlanChange`/`onTargetChange` come oggi.

- [ ] **Step 1: Importare `baseToAverage`**

In `CareerPanels.tsx`, aggiungere `baseToAverage` alla import esistente da `@/lib/domain/libretto`:

```ts
import {
  cfuPerMonth,
  earnedCfu,
  baseToAverage,
  graduationBase,
  gradePoints,
  weightedAverage,
} from "@/lib/domain/libretto";
```

- [ ] **Step 2: Stato unità + valore mostrato dentro `GoalPanel`**

Dopo `const remaining = ...` in `GoalPanel`, aggiungere:

```tsx
const [unit, setUnit] = useState<"avg" | "base">("avg");
const shownValue =
  targetAverage === undefined
    ? ""
    : unit === "base"
      ? Math.round(graduationBase(targetAverage))
      : targetAverage;
const equivalent =
  targetAverage === undefined
    ? undefined
    : unit === "base"
      ? `≈ media ${fmtNum(targetAverage, 1)}`
      : `≈ ${fmtNum(graduationBase(targetAverage), 0)}/110`;
```

Aggiungere `useState` all'import di `react` in cima al file se non presente:

```ts
import { useState } from "react";
```

- [ ] **Step 3: Sostituire il `Field` "Media obiettivo" con il gruppo toggle + input**

Rimpiazzare il blocco `<Field label="Media obiettivo" ...> ... </Field>` (righe ~222-240) con:

```tsx
<div className="flex flex-col gap-1.5">
  <div className="flex items-center justify-between">
    <label htmlFor="goal-target" className="text-label font-medium text-ink-mute">
      Obiettivo
    </label>
    <div role="group" aria-label="Unità obiettivo" className="flex gap-1">
      {(["avg", "base"] as const).map((u) => (
        <button
          key={u}
          type="button"
          aria-pressed={unit === u}
          onClick={() => setUnit(u)}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            unit === u
              ? "bg-signal text-night-950"
              : "border border-line text-ink-mute hover:text-ink"
          }`}
        >
          {u === "avg" ? "/30" : "/110"}
        </button>
      ))}
    </div>
  </div>
  <input
    id="goal-target"
    type="number"
    inputMode="decimal"
    aria-label={unit === "base" ? "Voto di laurea obiettivo su 110" : "Media obiettivo su 30"}
    min={unit === "base" ? 66 : 18}
    max={unit === "base" ? 110 : 30}
    step={unit === "base" ? 1 : 0.5}
    value={shownValue}
    placeholder={unit === "base" ? "es. 99" : "es. 28"}
    onChange={(e) => {
      const raw = Number(e.target.value);
      const next =
        e.target.value === "" || Number.isNaN(raw)
          ? undefined
          : unit === "base"
            ? baseToAverage(raw)
            : raw;
      onPlanChange?.({ targetAverage: next });
      onTargetChange?.(next);
    }}
    className={inputClass}
  />
  {equivalent && (
    <span className="text-xs text-ink-faint">{equivalent}</span>
  )}
</div>
```

Nota: la griglia esistente `grid grid-cols-2 gap-3` resta; questo blocco occupa la prima colonna, "CFU del piano" la seconda (invariato).

- [ ] **Step 4: Build + lint + typecheck**

Run:
```bash
cd "studentos" && ./node_modules/.bin/tsc --noEmit && npm run lint && npm run build
```
Expected: tutto verde.

- [ ] **Step 5: Verifica visiva in Chrome (firmato) su `/libretto`**

- toggle `/30` ↔ `/110` cambia il numero nell'input (es. 28 ↔ 103);
- digitando `99` in `/110` la riga "serve nei prossimi" si aggiorna coerente (99/110 = media 27,0);
- la riga grigia equivalente appare e cambia con l'unità.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/CareerPanels.tsx
git commit -m "feat: toggle unita /30 in /110 sull'Obiettivo laurea"
```

---

## Self-Review

- **Spec coverage:** Task 1 = `baseToAverage` dominio ✓. Task 2 = toggle UI + conversione + equivalente + a11y ✓. Storage invariato ✓. Scartati (3 modalità/tesi/cruscotto) non pianificati ✓.
- **Placeholder scan:** nessun TBD/TODO; tutto il codice è mostrato.
- **Type consistency:** `baseToAverage(base: number): number` usato in Task 2 come definito in Task 1; `unit: "avg"|"base"` coerente in tutti gli step.
- **Limite test dichiarato:** nessun test CI per `baseToAverage` perché `tests/`+`package.json` congelati; verifica `node -e` esatta.

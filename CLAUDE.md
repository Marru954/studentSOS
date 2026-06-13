# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace layout

Git repo at this root; it holds the product plus design mockups:

- **`studentos/`** — the main product: "University Student OS", a Next.js App Router app. Almost all work happens here.
- **`*.html`** (`student-os-clean-v2.html`, etc.) — early self-contained React+Tailwind-via-CDN design mockups, openable directly in a browser. Historical: these captured an earlier **clean light Notion** direction.
- **`design-reference/`** (`immersive.css` + jsx) — the **current** visual reference: an immersive aesthetic (Bricolage Grotesque display font, glass surfaces, drifting aurora background, dark-by-default with a light toggle). This style now lives in the app; see the design-system note below.

Run all commands **inside `studentos/`**, not from this root.

> History note: a `uniportal/` scaffold (Express + React) once proved the full SAML 2.0 SP flow against Tor Vergata's Delphi/IDEM-GARR. Its SAML logic was adapted into `studentos` (`src/lib/saml/`, `src/app/api/saml/*`) and the scaffold was then removed — StudentOS is the only project now.

## ⚠️ Next.js version caveat (read first)

`studentos/AGENTS.md` warns: this is **Next.js 16.2.9 (Turbopack), React 19, Tailwind v4** — APIs differ from training data. **Before writing any Next/React code, read the relevant guide under `studentos/node_modules/next/dist/docs/`.** Concretely confirmed differences already hit: `cookies()` is **async**; Route Handlers set cookies on the returned `NextResponse`; the `react-hooks` ESLint rules reject `setState` in a mount effect (use `useSyncExternalStore`, see `src/lib/hooks/useNowMinute.ts`) and reject ref writes during render.

## Commands (studentos)

```bash
cd studentos
npm run dev            # next dev (often a stray dev server lingers — kill `next dev`/`next-server` first if a port is busy)
npm run build          # next build (also surfaces SAML/bundling errors)
npm run lint           # eslint
npm test               # runs every tests/*.test.ts file in sequence
./node_modules/.bin/tsc --noEmit                 # typecheck (no script alias)
./node_modules/.bin/tsx tests/urgency.test.ts    # run ONE test file (use the binary directly; `npx tsx --test` has hung here)
./node_modules/.bin/tsx scripts/audit-render.ts  # SSR-render components to static HTML for markup/a11y audits (no browser available)
```

Tests use `node:test` + `tsx` + `fake-indexeddb` (no Jest/Vitest). There is **no browser in this environment**: verify UI accessibility/markup via `scripts/audit-render.ts` and verify color contrast by computing WCAG ratios from the compiled CSS in `.next/static`. The Delphi PDF import has two extra helpers that run pdfjs headless in Node: `scripts/dump-pdf-text.ts <file.pdf>` (dump extracted text to a fixture) and `scripts/verify-delphi-pdf.ts <file.pdf>` (end-to-end parse check).

## StudentOS architecture (the big picture)

**Offline-first, no backend database.** IndexedDB (via `idb`, schema in `src/lib/storage/db.ts`) is the source of truth. Zustand stores (`src/lib/state/*`) are in-memory mirrors with **write-through**: `StoreProvider` (`src/components/StoreProvider.tsx`) hydrates every store from IndexedDB on mount, renders immediately (cached data), then kicks a background sync. After any sync, the store re-reads from IndexedDB ("single source of truth"). Bump `DB_VERSION` and add an `upgrade()` branch for schema changes.

**Two strict data territories** (`src/lib/domain/types.ts`):
- **SYNCED** (public data: timetable, exams, news) — fetched by pluggable providers, treated as disposable caches replaced wholesale per source.
- **MANUAL** (libretto, notes, study tasks, focus sessions) — the user's own records; sync never writes here. Persisted in IndexedDB, mirrored by `src/lib/state/manual.ts` (a generic `createManualStore` factory).

**Pluggable sync engine** (`src/lib/sync/`): everything flows through the `SyncProvider` interface (`provider.ts`, capabilities `"timetable" | "exams" | "news"`, zod-validated params). Adapters live in `adapters/` (`easyacademy` — the live Tor Vergata source via EasyAcademy JSON endpoints; `ical`; `wordpress-news`); `registry.ts` lists them; `engine.ts` runs sources with per-source failure isolation; `universities/` holds presets (e.g. `uniroma2-informatica`). The server entry is `src/app/api/sync/route.ts`; the browser side (`src/lib/storage/syncClient.ts` + `repo.ts`) atomically replaces each source's cache in one transaction and computes **change notices** via the content-diff engine (`src/lib/storage/diff.ts`). Synced entities use stable content-hash ids (`stableId`, cyrb53, in `sync/util.ts`) so they survive re-syncs and are diffable.

**Pure domain logic, tested in isolation from React.** `src/lib/domain/` holds framework-free, deterministic modules — clocks/timezones are passed in as arguments — each with a matching `tests/*.test.ts`: `urgency`, `libretto` (weighted average, lode=30, pass/excluded skip), `projection`, `week` (timetable lane layout), `booking`, `calendar`, `notes` (search), `focus`, `academicYear`, `csv` (libretto import), `delphiPdf` (parses the reflowed "Esami verbalizzati" Delphi PDF text — client-side via pdfjs in `components/libretto/ImportDelphiPdf.tsx`, zero upload). `src/lib/esse3/parse.ts` and `src/lib/sync/delphi/parse.ts` are likewise pure + tested. Prefer adding logic here (pure + testable) over inside components.

**Design system is token-driven.** Colors/radii/fonts are CSS variables in `src/app/globals.css` `@theme`. The Tailwind token *names* (`night-*`, `ink`, `line`, `signal`, …) are legacy; their **values are remapped to immersive vars** (`var(--bg)`, `var(--surface)`, `var(--ink)`, `var(--signal)`, …) defined in two blocks above `@theme`: `[data-theme="dark"]` (the default) and `[data-theme="light"]`. So a reskin = editing those var blocks + a few primitives (`src/components/primitives/`), **never** sweeping every component. Fonts: **Bricolage Grotesque** for display (`--font-display`, used by `h1`–`h4`) + **Inter** for body, both loaded in `layout.tsx` via `next/font/google`; `--font-mono` is still Inter + tabular-nums (no real monospace face). Keep contrast AA in both themes; UI copy is **Italian-first**.

**Theming + motion (immersive layer).** Theme is an attribute on `<html data-theme>`, set before first paint by an inline `<head>` script in `layout.tsx` (no FOUC) and toggled via `ThemeToggle` → `src/lib/hooks/useTheme.ts` (a `useSyncExternalStore` over `documentElement.dataset.theme` + `localStorage['studentos-theme']`). The drifting **aurora** is the `.atmosphere` div (fixed, `z-index:-1`) in `layout.tsx`; glass/lift/reveal/grad-text and all keyframes live in `globals.css`. **Animations are pure CSS keyframes** (framer-motion is NOT installed) plus minimal JS: `CountUp` (imperative `textContent` tween, SSR-safe), `RevealManager` (IntersectionObserver adds `.in` to `.reveal` on scroll), `useScrolled` (navbar frost). A global `prefers-reduced-motion` block neutralizes them. Per the Next caveat, hook stores use `useSyncExternalStore`, and **server components must not pass functions to client components** (e.g. `CountUp` takes serializable `decimals`/`suffix`, not a `format` fn).

**SAML/SSO + career sync** (`src/app/api/saml/*`, `src/lib/saml/`, `src/lib/esse3/`): built to fit the no-DB app — `@node-saml/node-saml` is used directly in Route Handlers (it is in `serverExternalPackages` in `next.config.ts`), and the session is an **HMAC-signed cookie** (`src/lib/saml/session.ts`), not a server session. `/api/saml/synced` returns the student's career as `LibrettoEntry[]` — real data via the Esse3 e3rest adapter (`src/lib/esse3/client.ts`, gated on `ESSE3_*` env, needs an integration account) or 12 mock exams in dev. Synced libretto rows are tagged `source: "delphi"` (the "synced from ateneo" bucket) vs `"manual"`; `replaceDelphiLibretto` swaps only the synced bucket atomically, leaving manual entries untouched. **Currently the SSO UI is intentionally disabled ("prossimamente") in `DelphiConnect`**; the backend (login/acs/metadata/logout + full Single Logout, mock + Esse3) stays wired for future activation. Real SSO needs env: `SAML_IDP_CERT`, `SAML_SP_PRIVATE_KEY`/`SAML_SP_CERT`, the `SAML_*_URL`s, `SAML_SESSION_SECRET`.

**Routes:** `/` (public **landing** page — hero with the animated `S→tudent🛟S` wordmark, feature cards, "Come funziona", stats, footer; no login), `/cruscotto` (the predictive bento **dashboard** — instruments media/CFU/projection read the libretto store reactively, live), `/orario` (CSS-Grid week view), `/appelli` (month calendar + exam cards), `/libretto` (manual entry + CSV import + Delphi PDF import + career instruments + "Obiettivo laurea" goal card), `/note` (Markdown+KaTeX+code editor with full-text search), `/focus` (pomodoro + kanban), `/design` (component gallery). `template.tsx` wraps every page for the per-navigation entrance animation; the `Wordmark` (lucide `LifeBuoy` as the "O") is the brand mark in navbar + footer.

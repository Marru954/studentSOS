# Contesto tecnico StudentOS

Data: 2026-09-25 (sezioni 6 e 7 aggiornate dopo la PR #29) — generato da sessione Claude Code, **solo lettura** (nessun file applicativo modificato; unico file nuovo: questo). Branch: `chore/contesto-tecnico`.

Scopo: contesto per la pianificazione futura. Gli output sotto sono reali (comandi lanciati in `studentos/`); dove un comando non ha trovato nulla o uno strumento manca, è scritto esplicitamente.

## 1. Letture iniziali (STATO.md + Registro decisioni)

`docs/stato/STATO.md` letto (ultimo aggiornamento 2026-09-25: ri-cattura codici 2026 su 18 atenei, pulizia gate/esse3/easyAcademyPreset/Delphi, hook muri #1 e #2). Unica voce nel Registro decisioni:

> 2026-09-25 — muro #1 e #2: STRICT sempre (non STRICT-solo-auto/WARN come #4/#5). Override esplicito solo per #1 via `ALLOW_PROTECTED_EDIT=1` (caso per caso, es. migration di db.ts autorizzata); nessun override per #2 (unica via: `scripts/safe-merge.sh` o PR).

Le voci "In sospeso" e "Prossimi obiettivi" di STATO.md (DNS-rebinding TOCTOU #6, postcss #7, adapter Cineca-UP/GOMP, rate-limit per-IP distribuito) restano il riferimento per le priorità.

## 2. Albero file (`src/`, profondità 3)

`tree` non è installato (`which tree` → non trovato): usato il fallback `find src -maxdepth 3 -type d | sort`.

```
src
src/app
src/app/api
src/app/api/alerts
src/app/api/assistente
src/app/api/health
src/app/api/import-pdf
src/app/api/insegnamenti
src/app/api/sync
src/app/api/sync-delphi
src/app/appelli
src/app/assistente
src/app/auth
src/app/auth/callback
src/app/auth/reset
src/app/calendario
src/app/design
src/app/focus
src/app/impostazioni
src/app/insegnamenti
src/app/libretto
src/app/login
src/app/note
src/app/onboarding
src/app/orario
src/app/panoramica
src/components
src/components/alerts
src/components/assistente
src/components/auth
src/components/backup
src/components/calendar
src/components/celebration
src/components/dashboard
src/components/exams
src/components/focus
src/components/import
src/components/insegnamenti
src/components/landing
src/components/libretto
src/components/notes
src/components/onboarding
src/components/primitives
src/components/quickadd
src/components/search
src/components/settings
src/components/timetable
src/lib
src/lib/api
src/lib/domain
src/lib/hooks
src/lib/insegnamenti
src/lib/pdf
src/lib/state
src/lib/storage
src/lib/supabase
src/lib/sync
src/lib/sync/adapters
src/lib/sync/delphi
src/lib/sync/universities
src/types
```

## 3. Schema IndexedDB (`src/lib/storage/db.ts`, sola lettura)

Wrapper: `idb` (`openDB`), DB `studentos`, **`DB_VERSION = 3`**. Migrazione idempotente in `upgrade()`: ogni store mancante viene creato con `contains()`, senza early return (un salto v1→v3 non salta store intermedi). Sotto: il file completo (interfacce/tipi = forma dei dati), poi i tipi dei `value` referenziati.

### 3.1 Riepilogo store

| Store | keyPath | Indici | Territorio | Value |
|---|---|---|---|---|
| `classEvents` | `id` | `by-source`(sourceId), `by-start`(start) | SYNCED | `ClassEvent` |
| `examCalls` | `id` | `by-source`, `by-date` | SYNCED | `ExamCall` |
| `news` | `id` | `by-source` | SYNCED | `NewsItem` |
| `syncMeta` | `sourceId` | — | SYNCED (bookkeeping) | `SyncMeta` |
| `changeNotices` | `id` | `by-detected`(detectedAt) | derivato dal diff | `ChangeNotice` |
| `libretto` | `id` | — | MANUAL | `LibrettoEntry` |
| `notes` | `id` | `by-updated`(updatedAt) | MANUAL | `Note` |
| `studyTasks` | `id` | `by-status`(status) | MANUAL | `StudyTask` |
| `focusSessions` | `id` | `by-started`(startedAt) | MANUAL | `FocusSession` |
| `settings` | out-of-line | — | key-value | `unknown` (AppSettings + singleton) |
| `secrets` | out-of-line | — | key-value | `unknown` (blob cifrato + CryptoKey non estraibile) |
| `insegnamenti` | `id` | `by-ateneo`(ateneo_id), `by-corso`(corso_id) | piano di studi | `Insegnamento` |
| `manifesti` | `id` | `by-ateneo`, `by-corso` | piano di studi | `ManifestoInsegnamenti` |

### 3.2 `src/lib/storage/db.ts` (integrale)

```ts
/**
 * IndexedDB schema (via `idb`). One database, two territories:
 *  - synced stores are disposable caches, replaced wholesale per source;
 *  - manual stores are the user's primary data — never touched by sync.
 * Schema changes bump DB_VERSION and add a migration branch in upgrade().
 */
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  ClassEvent,
  ExamCall,
  FocusSession,
  LibrettoEntry,
  NewsItem,
  Note,
  StudyTask,
} from "@/lib/domain/types";
import type { ChangeNotice, SyncMeta } from "./types";
import type { Insegnamento, ManifestoInsegnamenti } from "@/types/insegnamenti";

export interface StudentOSDB extends DBSchema {
  classEvents: {
    key: string;
    value: ClassEvent;
    indexes: { "by-source": string; "by-start": string };
  };
  examCalls: {
    key: string;
    value: ExamCall;
    indexes: { "by-source": string; "by-date": string };
  };
  news: {
    key: string;
    value: NewsItem;
    indexes: { "by-source": string };
  };
  syncMeta: { key: string; value: SyncMeta };
  changeNotices: { key: string; value: ChangeNotice; indexes: { "by-detected": string } };
  libretto: { key: string; value: LibrettoEntry };
  notes: { key: string; value: Note; indexes: { "by-updated": string } };
  studyTasks: { key: string; value: StudyTask; indexes: { "by-status": string } };
  focusSessions: { key: string; value: FocusSession; indexes: { "by-started": string } };
  /** Key-value bucket for AppSettings and future singletons. */
  settings: { key: string; value: unknown };
  /** Encrypted Delphi credential blob + the non-extractable AES key that
   *  unlocks it. The key is a CryptoKey with extractable:false, so even a
   *  full dump of this store cannot recover the password off-device. */
  secrets: { key: string; value: unknown };
  /** Piano di studi: insegnamenti del corso (obbligatori, a scelta, altri). */
  insegnamenti: {
    key: string;
    value: Insegnamento;
    indexes: { "by-ateneo": string; "by-corso": string };
  };
  /** Metadati del manifesto degli studi per corso/anno accademico. */
  manifesti: {
    key: string;
    value: ManifestoInsegnamenti;
    indexes: { "by-ateneo": string; "by-corso": string };
  };
}

const DB_NAME = "studentos";
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase<StudentOSDB>> | undefined;

export function getDb(): Promise<IDBPDatabase<StudentOSDB>> {
  dbPromise ??= openDB<StudentOSDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Idempotent, order-independent migration: create each missing store (with
      // its indexes) guarded by contains(), in schema order. NO early returns —
      // every prior version reaches every check, so a multi-version jump (e.g.
      // v1 → v3) can't skip a store added in an intermediate version. A fresh DB
      // (oldVersion 0) creates them all; an existing DB only fills the gaps.
      if (!db.objectStoreNames.contains("classEvents")) {
        const classEvents = db.createObjectStore("classEvents", { keyPath: "id" });
        classEvents.createIndex("by-source", "sourceId");
        classEvents.createIndex("by-start", "start");
      }
      if (!db.objectStoreNames.contains("examCalls")) {
        const examCalls = db.createObjectStore("examCalls", { keyPath: "id" });
        examCalls.createIndex("by-source", "sourceId");
        examCalls.createIndex("by-date", "date");
      }
      if (!db.objectStoreNames.contains("news")) {
        const news = db.createObjectStore("news", { keyPath: "id" });
        news.createIndex("by-source", "sourceId");
      }
      if (!db.objectStoreNames.contains("syncMeta")) {
        db.createObjectStore("syncMeta", { keyPath: "sourceId" });
      }
      if (!db.objectStoreNames.contains("changeNotices")) {
        const notices = db.createObjectStore("changeNotices", { keyPath: "id" });
        notices.createIndex("by-detected", "detectedAt");
      }
      if (!db.objectStoreNames.contains("libretto")) {
        db.createObjectStore("libretto", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("notes")) {
        const notes = db.createObjectStore("notes", { keyPath: "id" });
        notes.createIndex("by-updated", "updatedAt");
      }
      if (!db.objectStoreNames.contains("studyTasks")) {
        const tasks = db.createObjectStore("studyTasks", { keyPath: "id" });
        tasks.createIndex("by-status", "status");
      }
      if (!db.objectStoreNames.contains("focusSessions")) {
        const focus = db.createObjectStore("focusSessions", { keyPath: "id" });
        focus.createIndex("by-started", "startedAt");
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings");
      }
      if (!db.objectStoreNames.contains("secrets")) {
        db.createObjectStore("secrets");
      }
      if (!db.objectStoreNames.contains("insegnamenti")) {
        const ins = db.createObjectStore("insegnamenti", { keyPath: "id" });
        ins.createIndex("by-ateneo", "ateneo_id");
        ins.createIndex("by-corso", "corso_id");
      }
      if (!db.objectStoreNames.contains("manifesti")) {
        const man = db.createObjectStore("manifesti", { keyPath: "id" });
        man.createIndex("by-ateneo", "ateneo_id");
        man.createIndex("by-corso", "corso_id");
      }
    },
  });
  return dbPromise;
}

/** Test seam: closes the connection so tests can deleteDatabase between
 *  cases (deletion blocks while a connection is open). */
export async function __resetDbForTests(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise.catch(() => undefined);
    db?.close();
  }
  dbPromise = undefined;
}
```

### 3.3 `src/lib/domain/types.ts` (integrale)

```ts
/**
 * Core domain models for StudentOS.
 *
 * Two strict data territories:
 *  - SYNCED (public data): timetables, exam calls, news — fetched by SyncProviders.
 *  - MANUAL (personal data): libretto, notes, tasks, focus sessions — offline-first,
 *    never scraped, never sent anywhere.
 */

// ── Shared ──────────────────────────────────────────────────────────────────

/** ISO 8601 datetime string, always UTC (`...Z`). Render in the user's timezone. */
export type IsoDateTime = string;
/** ISO date `YYYY-MM-DD` (no time component). */
export type IsoDate = string;

export interface DateRange {
  from: IsoDate;
  to: IsoDate;
}

// ── Synced: timetable ───────────────────────────────────────────────────────

export type ClassEventKind = "lecture" | "lab" | "exercise" | "seminar" | "other";

export interface ClassEvent {
  /** Stable hash of (source, course, start) — survives re-syncs for diffing. */
  id: string;
  courseName: string;
  /** Course code on the source system, when exposed (e.g. EasyAcademy course key). */
  courseCode?: string;
  teacher?: string;
  start: IsoDateTime;
  end: IsoDateTime;
  room?: string;
  building?: string;
  kind: ClassEventKind;
  /** Set by the diff engine when room/time changed vs. the previous sync. */
  change?: { field: "room" | "time" | "cancelled"; previous?: string };
  sourceId: string;
}

// ── Synced: exams ───────────────────────────────────────────────────────────

export type ExamKind = "written" | "oral" | "written+oral" | "practical" | "unknown";

export interface ExamCall {
  id: string;
  courseName: string;
  courseCode?: string;
  date: IsoDate;
  time?: string;
  room?: string;
  kind: ExamKind;
  /** Booking window when the source exposes it — drives deadline urgencies. */
  booking?: { opensAt?: IsoDate; closesAt?: IsoDate };
  teacher?: string;
  notes?: string;
  sourceId: string;
}

// ── Synced: news ────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  publishedAt?: IsoDateTime;
  excerpt?: string;
  sourceId: string;
}

// ── Manual: libretto (strictly local, never synced) ─────────────────────────

/** 18–30 numeric, 30 e lode, or pass/fail ("idoneo"). */
export type Grade =
  | { kind: "numeric"; value: number; laude: boolean }
  | { kind: "pass" };

export interface LibrettoEntry {
  id: string;
  courseName: string;
  cfu: number;
  grade: Grade;
  date: IsoDate;
  /** Academic year, e.g. "2023/2024". */
  academicYear?: string;
  /** Teacher, optional. */
  teacher?: string;
  /** Excluded from the weighted average (e.g. extracurricular CFU). */
  excludeFromAverage?: boolean;
  /** Provenance: hand-entered, or scraped from the Delphi portal.
   *  Defaults to manual when absent. Delphi-sourced rows are replaced
   *  wholesale on each sync; manual rows are never touched. */
  source?: "manual" | "delphi";
}

export interface DegreePlan {
  totalCfu: number; // e.g. 180 triennale, 120 magistrale
  /** Optional target the predictive widgets compare against. */
  targetAverage?: number;
}

// ── Manual: knowledge base ──────────────────────────────────────────────────

export interface Note {
  id: string;
  title: string;
  /** Markdown with ```lang code fences and $…$/$$…$$ LaTeX. */
  content: string;
  tags: string[];
  /** Auto-linked from the synced timetable when titles match a course. */
  courseName?: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

// ── Manual: focus hub ───────────────────────────────────────────────────────

export type TaskStatus = "backlog" | "todo" | "doing" | "done";

export interface StudyTask {
  id: string;
  title: string;
  status: TaskStatus;
  courseName?: string;
  /** Links the task to a specific exam call for countdown context. */
  examId?: string;
  due?: IsoDate;
  createdAt: IsoDateTime;
}

export interface FocusSession {
  id: string;
  courseName?: string;
  startedAt: IsoDateTime;
  /** Actual focused minutes (breaks excluded). */
  minutes: number;
}

// ── Derived: predictive engine output ───────────────────────────────────────

export type UrgencyKind =
  | "class-overlap"
  | "exam-overlap"
  | "booking-deadline"
  | "room-change"
  | "exam-imminent";

export type UrgencySeverity = "info" | "warning" | "critical";

export interface Urgency {
  id: string;
  kind: UrgencyKind;
  severity: UrgencySeverity;
  /** Already-localized human message, composed by the urgency engine. */
  message: string;
  /** When the urgency stops mattering — expired urgencies are dropped. */
  expiresAt: IsoDateTime;
  relatedIds: string[];
}
```

### 3.4 `src/lib/storage/types.ts` (integrale)

```ts
/** App-level persistence types: sync bookkeeping, change detection, settings.
 *  University data types live in lib/domain/types. */
import type { IsoDateTime } from "@/lib/domain/types";
import type { SyncCapability } from "@/lib/sync/provider";

export interface SyncMeta {
  sourceId: string;
  capability: SyncCapability;
  lastAttemptAt: IsoDateTime;
  lastSuccessAt?: IsoDateTime;
  ok: boolean;
  error?: string;
  itemCount: number;
}

/** A meaningful difference between two syncs, surfaced on the dashboard.
 *  This is what makes sync feel alive: "aula cambiata", "nuovo appello". */
export interface ChangeNotice {
  id: string;
  kind: "room-change" | "time-change" | "cancelled" | "new-exam";
  courseName: string;
  /** Already-localized detail, e.g. "Aula T5 → Aula A2". */
  detail: string;
  /** id of the ClassEvent or ExamCall this notice refers to. */
  entityId: string;
  detectedAt: IsoDateTime;
  seen: boolean;
}

export interface AppSettings {
  /** Selected built-in preset, if any. */
  presetId?: string;
  /** Year of study chosen at onboarding (tailors exams, defaults). */
  yearOfStudy?: number;
  /** Degree course chosen at onboarding (label only — tailors copy). */
  programme?: string;
  /** Which of the preset's sources actually sync. */
  enabledSourceIds: string[];
  /** Courses the user actually attends; empty = show everything.
   *  The merged all-years timetable filters on this. */
  pinnedCourses: string[];
  degreePlan: { totalCfu: number; targetAverage?: number };
  /** How far ahead the sync window reaches, in days. */
  syncHorizonDays: number;
  /** UI density: "comfortable" (default) or "compact" (tighter spacing). */
  density?: "comfortable" | "compact";
  /** First day of the week for the calendar grid. */
  weekStartsOn?: "mon" | "sun";
  /** Show in-app reminders for upcoming exams. */
  examReminders?: boolean;
  /** How many days before an exam the reminder kicks in. */
  reminderDaysBefore?: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  enabledSourceIds: [],
  pinnedCourses: [],
  degreePlan: { totalCfu: 180 },
  syncHorizonDays: 120,
  density: "comfortable",
  weekStartsOn: "mon",
  examReminders: true,
  reminderDaysBefore: 3,
};
```

### 3.5 `src/types/insegnamenti.ts` (integrale)

```ts
export type TipoInsegnamento = "obbligatorio" | "scelta" | "altro";

export interface Insegnamento {
  id: string;
  ateneo_id: string;
  corso_id: string;
  nome: string;
  codice?: string;
  settore?: string;
  cfu: number;
  semestre?: number | string;
  docente?: string;
  propedeuticita?: string[];
  anno?: string;
  tipo: TipoInsegnamento;
  inserito_manualmente: boolean;
  superata?: boolean;
  /** Note personali dello studente (facoltative). */
  note?: string;
  /** True quando lo studente ha modificato questa materia (manuale o da sync):
   *  da quel momento il sync non la sovrascrive più (vedi `lib/insegnamenti/sync`). */
  modificato_manualmente?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ManifestoInsegnamenti {
  id: string;
  ateneo_id: string;
  corso_id: string;
  url_sorgente?: string;
  anno_accademico: string;
  last_sync?: string;
}
```

## 4. Preset EasyAcademy di riferimento — Tor Vergata

File: `src/lib/sync/universities/uniroma2.ts` (live, 2026/27, `ANNO = "2026"`), contenuto integrale. Punti da notare per futuri adapter/preset: helper locale `degreeSources(slug, scuola, years)` con id namespaced `<slug>-orario-anno-N` / `<slug>-esami-anno-N`; Informatica triennale mantiene id "nudi" (`orario-anno-N`) per retro-compatibilità e porta il feed news WordPress; l'`id` del preset (`uniroma2-informatica-triennale`) è storico e va mantenuto; `sources: []` perché multi-programma (`livePrograms`). Gli altri 18 atenei usano l'helper condiviso `degreeSources(baseUrl, anno, slug, scuola, years, exams)` in `easystaff.ts`, non questa copia locale.

```ts
/**
 * Preset: Università di Roma "Tor Vergata" — the WHOLE ateneo.
 *
 * Tor Vergata is the first "complete" ateneo and the replicable model for the
 * others: every degree whose EasyAcademy codes were verified live (real
 * grid_call.php / test_call.php requests returning non-empty data) is wired in
 * `livePrograms`, each with its own per-programme namespaced sources so caches
 * never collide across courses. Courses without verifiable codes stay manual —
 * they still appear in the onboarding catalogue (ateneo-courses.ts) and the
 * student enters data by hand.
 *
 * Codes are captured from the public combo.php cascade, NEVER invented. The full
 * per-course verification status is in `_uniroma2_coverage.md`. Re-verify each
 * September (universities renumber corso/anno2 per cohort) and bump ANNO.
 */
import type { LiveProgram, SyncSource, UniversityPreset } from "../provider";

const EASY_BASE = "https://easyutv.uniroma2.it/agendaweb";
/** Academic-year start (2026/27). Bump each September after re-verifying codes. */
const ANNO = "2026";

/** Per-year timetable + exams sources for one degree. Ids are namespaced by
 *  `slug` so two courses of the same ateneo never share a cache key. Exams take
 *  the plain year number as `anno2` and the year's `corso` as `cdl` (easytest);
 *  the 2025/26 ordinamento reform can split a triennale across two `corso`
 *  codes, so every year carries its own. */
function degreeSources(
  slug: string,
  scuola: string,
  years: { year: number; corso: string; anno2: string[] }[],
): SyncSource[] {
  const out: SyncSource[] = [];
  for (const y of years) {
    out.push({
      id: `${slug}-orario-anno-${y.year}`,
      label: `Orario lezioni — ${y.year}° anno`,
      capability: "timetable",
      providerId: "easyacademy",
      params: {
        kind: "timetable",
        baseUrl: EASY_BASE,
        anno: ANNO,
        scuola,
        corso: y.corso,
        anno2: y.anno2,
      },
    });
    out.push({
      id: `${slug}-esami-anno-${y.year}`,
      label: `Appelli d'esame — ${y.year}° anno`,
      capability: "exams",
      providerId: "easyacademy",
      params: {
        kind: "exams",
        baseUrl: EASY_BASE,
        scuola,
        cdl: y.corso,
        anno2: [String(y.year)],
      },
    });
  }
  return out;
}

// ── Informatica (triennale, H02) — the original wiring, verified 2026-06-12.
//    Kept with BARE source ids (orario-anno-N / esami-anno-N) exactly as first
//    shipped so existing setups keep working byte-for-byte. Plain "comune|N"
//    common track; carries the department WordPress news feed (other degrees
//    have no department site wired).
const informatica: LiveProgram = {
  programme: "Informatica (triennale)",
  sources: [
    ...[1, 2, 3].map((year) => ({
      id: `orario-anno-${year}`,
      label: `Orario lezioni — ${year}° anno`,
      capability: "timetable" as const,
      providerId: "easyacademy",
      params: {
        kind: "timetable",
        baseUrl: EASY_BASE,
        anno: ANNO,
        scuola: "FacoltadiScienzeMatematiche-FisicheeNaturali",
        corso: "H02",
        anno2: [`comune|${year}`],
      },
    })),
    ...[1, 2, 3].map((year) => ({
      id: `esami-anno-${year}`,
      label: `Appelli d'esame — ${year}° anno`,
      capability: "exams" as const,
      providerId: "easyacademy",
      params: {
        kind: "exams",
        baseUrl: EASY_BASE,
        scuola: "FacoltadiScienzeMatematiche-FisicheeNaturali",
        cdl: "H02",
        anno2: [String(year)],
      },
    })),
    {
      id: "avvisi-dipartimento",
      label: "Avvisi del corso di laurea",
      capability: "news" as const,
      providerId: "wordpress-news",
      params: { baseUrl: "https://informatica.uniroma2.it" },
    },
  ],
};

/** Every verified-live degree at Tor Vergata. Informatica first (original);
 *  the rest are appended from live probing — see _uniroma2_coverage.md. Use
 *  `degreeSources(slug, scuola, years)` for each. */
const livePrograms: LiveProgram[] = [
  informatica,
  {
    programme: "Astrophysics and Space Science",
    sources: degreeSources("astrophysics-and-space-science", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA3", anno2: ["comune|1"] },
      { year: 2, corso: "AA3", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Bioinformatica",
    sources: degreeSources("bioinformatica", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J61", anno2: ["biomedico|1", "informatico|1"] },
      { year: 2, corso: "J61", anno2: ["biomedico|2", "informatico|2"] },
    ]),
  },
  {
    programme: "Biologia Cellulare, Molecolare e Ricerca Biomedica",
    sources: degreeSources("biologia-cellulare-molecolare-e-ricerca-biomedica", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB7", anno2: ["comune|1"] },
      { year: 2, corso: "AB7", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Biotechnology for Industry and Health",
    sources: degreeSources("biotechnology-for-industry-and-health", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB6", anno2: ["clinicalresearch|1", "experimentalbiotechnology|1"] },
      { year: 2, corso: "AB6", anno2: ["clinicalresearch|2", "experimentalbiotechnology|2"] },
    ]),
  },
  {
    programme: "Biotecnologie",
    sources: degreeSources("biotecnologie", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H04", anno2: ["comune|1"] },
      { year: 2, corso: "H04", anno2: ["comune|2"] },
      { year: 3, corso: "H04", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Biotecnologie Agrarie",
    sources: degreeSources("biotecnologie-agrarie", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB3", anno2: ["comune|1"] },
      { year: 2, corso: "AB3", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Chemical Nano-Engineering",
    sources: degreeSources("chemical-nano-engineering", "FacoltadiIngegneria", [
      { year: 1, corso: "W46", anno2: ["comune|1"] },
      { year: 2, corso: "W46", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Chimica (magistrale)",
    sources: degreeSources("chimica-magistrale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J63", anno2: ["chimicadeisistemicomplessiediinteressebiologico|1", "chimicaperlambiente-lenergiaelasostenibilita|1"] },
      { year: 2, corso: "J63", anno2: ["chimicadeisistemicomplessiediinteressebiologico|2", "chimicaperlambiente-lenergiaelasostenibilita|2"] },
    ]),
  },
  {
    programme: "Chimica (triennale)",
    sources: degreeSources("chimica-triennale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H05", anno2: ["comune|1", "comune_canaleA-L|1", "comune_canaleM-Z|1"] },
      { year: 2, corso: "H05", anno2: ["comune|2"] },
      { year: 3, corso: "H05", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Chimica Applicata",
    sources: degreeSources("chimica-applicata", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H06", anno2: ["comune|1"] },
      { year: 2, corso: "H06", anno2: ["comune|2"] },
      { year: 3, corso: "H06", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Engineering Sciences",
    sources: degreeSources("engineering-sciences", "FacoltadiIngegneria", [
      { year: 1, corso: "K73", anno2: ["comune|1"] },
      { year: 2, corso: "K73", anno2: ["comune|2"] },
      { year: 3, corso: "K73", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Fisica (magistrale)",
    sources: degreeSources("fisica-magistrale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J64", anno2: ["astrophysicsandspacescience|1", "fisicabiofisicaefisicamedica|1", "fisicadellaatmosferaedelclimaemeteorologia|1", "fisicaelettronicaecibernetica|1", "fisicafisicateorica|1", "fisicastrutturadellamateria|1", "physicsofcomplexsystemsandbigdata|1", "physicsoffundamentalinteractionsandexperimentaltechniques|1"] },
      { year: 2, corso: "J64", anno2: ["astrophysicsandspacescience|2", "fisicadellaatmosferaedelclimaemeteorologia|2", "fisicaelettronicaecibernetica|2", "fisicafisicadeibiosistemi|2", "fisicafisicateorica|2", "fisicastrutturadellamateria|2", "physicsofcomplexsystemsandbigdata|2", "physicsoffundamentalinteractionsandexperimentaltechniques|2"] },
    ]),
  },
  {
    programme: "Fisica (triennale)",
    sources: degreeSources("fisica-triennale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H08", anno2: ["fisica|1", "fisicadellatmosferaedelclimaemeteorologia|1"] },
      { year: 2, corso: "H08", anno2: ["fisica|2", "fisicadellatmosferaedelclimaemeteorologia|2"] },
      { year: 3, corso: "H08", anno2: ["fisica|3", "fisicadellatmosferaedelclimaemeteorologia|3"] },
    ]),
  },
  {
    programme: "ICT and Internet Engineering - Ingegneria di Internet e delle Tecnologie per l'Informazione e la Comunicazione",
    sources: degreeSources("ict-and-internet-engineering-ingegneria-di-internet-e-delle-tecnologie-per-l-informazione-e-la-comunicazione", "FacoltadiIngegneria", [
      { year: 1, corso: "Q66", anno2: ["comune|1"] },
      { year: 2, corso: "Q66", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Informatica (magistrale)",
    sources: degreeSources("informatica-magistrale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J65", anno2: ["comune|1"] },
      { year: 2, corso: "J65", anno2: ["comune|2"] },
      { year: 3, corso: "H02", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Civile",
    sources: degreeSources("ingegneria-civile", "FacoltadiIngegneria", [
      { year: 1, corso: "H30", anno2: ["infrastruttureesistemiditrasporto|1", "struttureegeotecnica|1"] },
      { year: 2, corso: "H30", anno2: ["infrastruttureesistemiditrasporto|2", "struttureegeotecnica|2"] },
    ]),
  },
  {
    programme: "Ingegneria Civile e Ambientale",
    sources: degreeSources("ingegneria-civile-e-ambientale", "FacoltadiIngegneria", [
      { year: 1, corso: "K72", anno2: ["comune|1"] },
      { year: 2, corso: "K72", anno2: ["comune|2"] },
      { year: 3, corso: "K72", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria dell'Automazione",
    sources: degreeSources("ingegneria-dell-automazione", "FacoltadiIngegneria", [
      { year: 1, corso: "H31", anno2: ["comune|1"] },
      { year: 2, corso: "H31", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria dell'Edilizia",
    sources: degreeSources("ingegneria-dell-edilizia", "FacoltadiIngegneria", [
      { year: 1, corso: "H20", anno2: ["comune|1"] },
      { year: 2, corso: "H20", anno2: ["comune|2"] },
      { year: 3, corso: "H20", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria di Internet",
    sources: degreeSources("ingegneria-di-internet", "FacoltadiIngegneria", [
      { year: 1, corso: "P65", anno2: ["comune|1"] },
      { year: 2, corso: "P65", anno2: ["comune|2"] },
      { year: 3, corso: "P65", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria e Tecniche del Costruire",
    sources: degreeSources("ingegneria-e-tecniche-del-costruire", "FacoltadiIngegneria", [
      { year: 1, corso: "H32", anno2: ["comune|1"] },
      { year: 2, corso: "H32", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria Edile-architettura",
    sources: degreeSources("ingegneria-edile-architettura", "FacoltadiIngegneria", [
      { year: 1, corso: "J53", anno2: ["comune|1"] },
      { year: 2, corso: "J53", anno2: ["comune|2"] },
      { year: 3, corso: "J53", anno2: ["comune|3"] },
      { year: 4, corso: "J53", anno2: ["comune|4"] },
      { year: 5, corso: "J53", anno2: ["comune|5"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (magistrale)",
    sources: degreeSources("ingegneria-elettronica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H33", anno2: ["percorsoaelettronicaperlenergia|1", "percorsobelettronicaperlindustria|1", "percorsocelettronicaperlamedicina|1", "percorsodelettronicaperlospazioelasicurezza|1", "percorsoeelettronicaperildigitalchipdesign|1", "percorsofelettronicaperlfintelligenzaartificiale|1"] },
      { year: 2, corso: "H33", anno2: ["indirizzoaelettronicaperlenergia|2", "indirizzobelettronicaperlindustria|2", "indirizzocelettronicaperlasaluteelambiente|2", "indirizzodelettronicaperlospazioelasicurezza|2", "indirizzoeelettronicaperletelecomunicazionielamultimedialita|2"] },
    ]),
  },
  {
    programme: "Ingegneria Elettronica (triennale)",
    sources: degreeSources("ingegneria-elettronica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "H21", anno2: ["comune|1"] },
      { year: 2, corso: "H21", anno2: ["comune|2"] },
      { year: 3, corso: "H21", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Energetica",
    sources: degreeSources("ingegneria-energetica", "FacoltadiIngegneria", [
      { year: 1, corso: "H34", anno2: ["comune|1"] },
      { year: 2, corso: "H34", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (in Modalità Prevalentemente a Distanza)",
    sources: degreeSources("ingegneria-gestionale-in-modalita-prevalentemente-a-distanza", "FacoltadiIngegneria", [
      { year: 1, corso: "V89", anno2: ["comune|1"] },
      { year: 2, corso: "V89", anno2: ["comune|2"] },
      { year: 3, corso: "V89", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (magistrale)",
    sources: degreeSources("ingegneria-gestionale-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "AC1", anno2: ["dataanalytics|1", "direzionedimpresa|1", "ingegneriadelleimpresedigitali|1", "ingegneriagestionaledelletelecomunicazioni|1", "sistemidiproduzione|1", "sistemilogisticieditrasporto|1", "technologyandnewfrontiermanagement|1"] },
      { year: 2, corso: "AC1", anno2: ["dataanalytics|2", "direzionedimpresa|2", "gestionedellaproduzionealimentare|2", "ingegneriadelleimpresedigitali|2", "ingegneriagestionaledelletelecomunicazioni|2", "sistemidiproduzione|2", "sistemilogisticieditrasporto|2", "technologyandnewfrontiermanagement|2"] },
    ]),
  },
  {
    programme: "Ingegneria Gestionale (triennale)",
    sources: degreeSources("ingegneria-gestionale-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "U09", anno2: ["ingegneriadellorganizzazione|1", "ingegneriadellaproduzione|1", "ingegneriadelleinfrastruttureedeisistemiarete|1", "ingegneriagestionaledelletelecomunicazioni|1", "ingegnerialogisticaedeitrasporti|1"] },
      { year: 2, corso: "U09", anno2: ["ingegneriadellorganizzazione|2", "ingegneriadellaproduzione|2", "ingegneriadelleinfrastruttureedeisistemiarete|2", "ingegneriagestionaledelletelecomunicazioni|2", "ingegnerialogisticaedeitrasporti|2"] },
      { year: 3, corso: "U09", anno2: ["ingegneriadellorganizzazione|3", "ingegneriadellaproduzione|3", "ingegneriadelleinfrastruttureedeisistemiarete|3", "ingegneriagestionaledelletelecomunicazioni|3", "ingegnerialogisticaedeitrasporti|3"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (magistrale)",
    sources: degreeSources("ingegneria-informatica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H36", anno2: ["artificialintelligenceanddataengineering|1", "computerandinformationengineeringindirizzocybersecurity|1", "computerandinformationengineeringindirizzogenerale|1", "computerandinformationengineeringindirizzosystemsandsoftwareengineering|1"] },
      { year: 2, corso: "H36", anno2: ["computerandinformationengineeringindirizzocybersecurity|2", "computerandinformationengineeringindirizzogenerale|2", "computerandinformationengineeringindirizzosystemsandsoftwareengineering|2", "datascienceandengineering|2"] },
    ]),
  },
  {
    programme: "Ingegneria Informatica (triennale)",
    sources: degreeSources("ingegneria-informatica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "U08", anno2: ["roboticaeautomazione|1", "sistemisoftwareeweb|1"] },
      { year: 2, corso: "U08", anno2: ["roboticaeautomazione|2", "sistemisoftwareeweb|2"] },
      { year: 3, corso: "U08", anno2: ["roboticaeautomazione|3", "sistemisoftwareeweb|3"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (magistrale)",
    sources: degreeSources("ingegneria-meccanica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H37", anno2: ["ingegneriadeiprocessisostenibili|1", "ingegneriadiprodotto|1"] },
      { year: 2, corso: "H37", anno2: ["ingegneriadeiprocessisostenibili|2", "ingegneriadiprodotto|2"] },
    ]),
  },
  {
    programme: "Ingegneria Meccanica (triennale)",
    sources: degreeSources("ingegneria-meccanica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "H25", anno2: ["comune|1"] },
      { year: 2, corso: "H25", anno2: ["comune|2"] },
      { year: 3, corso: "H25", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria Medica (magistrale)",
    sources: degreeSources("ingegneria-medica-magistrale", "FacoltadiIngegneria", [
      { year: 1, corso: "H38", anno2: ["comune|1"] },
      { year: 2, corso: "H38", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Ingegneria Medica (triennale)",
    sources: degreeSources("ingegneria-medica-triennale", "FacoltadiIngegneria", [
      { year: 1, corso: "H26", anno2: ["comune|1"] },
      { year: 2, corso: "H26", anno2: ["comune|2"] },
      { year: 3, corso: "H26", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Ingegneria per l'Ambiente e il Territorio",
    sources: degreeSources("ingegneria-per-l-ambiente-e-il-territorio", "FacoltadiIngegneria", [
      { year: 1, corso: "H29", anno2: ["indirizzoininglese|1", "indirizzoinitaliano|1"] },
      { year: 2, corso: "H29", anno2: ["indirizzoininglese|2", "indirizzoinitaliano|2"] },
    ]),
  },
  {
    programme: "Ingegneria per l'Energia e l'Ambiente",
    sources: degreeSources("ingegneria-per-l-energia-e-l-ambiente", "FacoltadiIngegneria", [
      { year: 1, corso: "X63", anno2: ["energeticaambientale|1", "energeticaindustriale|1"] },
      { year: 2, corso: "X63", anno2: ["energeticaambientale|2", "energeticaindustriale|2"] },
      { year: 3, corso: "X63", anno2: ["energeticaambientale|3", "energeticaindustriale|3"] },
    ]),
  },
  {
    programme: "Matematica",
    sources: degreeSources("matematica", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H11", anno2: ["comune|1"] },
      { year: 2, corso: "H11", anno2: ["comune|2"] },
      { year: 3, corso: "H11", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Mechatronics Engineering",
    sources: degreeSources("mechatronics-engineering", "FacoltadiIngegneria", [
      { year: 1, corso: "T20", anno2: ["computionalmethods|1", "electromechanics|1", "electronicsanddigitaltransition|1", "mechanicsanddigitaltransition|1", "mechatronicsystemsandictinterconnectedelectricvehiclesengineering|1", "mechatronicsystemsandictlearningandcommunication|1"] },
      { year: 2, corso: "T20", anno2: ["computionalmethods|2", "electromechanics|2", "electronicsanddigitaltransition|2", "mechanicsanddigitaltransition|2", "mechatronicsystemsandictinterconnectedelectricvehiclesengineering|2", "mechatronicsystemsandictlearningandcommunication|2"] },
    ]),
  },
  {
    programme: "Metodi e Modelli per Data Science",
    sources: degreeSources("metodi-e-modelli-per-data-science", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA2", anno2: ["comune|1"] },
      { year: 2, corso: "AA2", anno2: ["comune|2"] },
      { year: 3, corso: "AA2", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Pharmacy",
    sources: degreeSources("pharmacy", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA4", anno2: ["comune|1"] },
      { year: 2, corso: "AA4", anno2: ["comune|2"] },
      { year: 3, corso: "AA4", anno2: ["comune|3"] },
      { year: 4, corso: "AA4", anno2: ["comune|4"] },
      { year: 5, corso: "AA4", anno2: ["comune|5"] },
    ]),
  },
  {
    programme: "Scienza dei Materiali",
    sources: degreeSources("scienza-dei-materiali", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AB1", anno2: ["comune|1"] },
      { year: 2, corso: "AB1", anno2: ["comune|2"] },
      { year: 3, corso: "AB1", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Scienza e Tecnologia dei Materiali",
    sources: degreeSources("scienza-e-tecnologia-dei-materiali", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA1", anno2: ["emjmgreenano|1", "materialigreenesostenibili|1", "scienzaetecnologiadeimateriali|1"] },
      { year: 2, corso: "AA1", anno2: ["emjmgreenano|2", "materialigreenesostenibili|2", "scienzaetecnologiadeimateriali|2"] },
    ]),
  },
  {
    programme: "Scienze Biologiche",
    sources: degreeSources("scienze-biologiche", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H03", anno2: ["comune|1"] },
      { year: 2, corso: "H03", anno2: ["comune|2"] },
      { year: 3, corso: "H03", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Biologia Ambientale",
    sources: degreeSources("biologia-ambientale", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "AA7", anno2: ["comune|1"] },
      { year: 2, corso: "AA7", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Matematica Pura e Applicata",
    sources: degreeSources("matematica-pura-e-applicata", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "J66", anno2: ["comune|1"] },
      { year: 2, corso: "J66", anno2: ["comune|2"] },
    ]),
  },
  {
    programme: "Scienze e Tecnologie per i Media",
    sources: degreeSources("scienze-e-tecnologie-per-i-media", "FacoltadiScienzeMatematiche-FisicheeNaturali", [
      { year: 1, corso: "H12", anno2: ["comune|1"] },
      { year: 2, corso: "H12", anno2: ["comune|2"] },
      { year: 3, corso: "H12", anno2: ["comune|3"] },
    ]),
  },
  {
    programme: "Semestre Filtro",
    sources: degreeSources("semestre-filtro", "", [
      { year: 1, corso: "SMF", anno2: ["comune|1"] },
    ]),
  },
];

export const uniroma2: UniversityPreset = {
  // Stable id kept verbatim: it is the detectAteneo target for *.uniroma2.it and
  // may already be saved in profiles. The name is historical; this preset now
  // covers the whole ateneo via livePrograms.
  id: "uniroma2-informatica-triennale",
  name: 'Università di Roma "Tor Vergata"',
  shortName: "Tor Vergata",
  city: "Roma",
  programme: "Informatica (triennale)",
  liveSources: true,
  sources: [], // multi-programme ateneo: real sources live under livePrograms
  livePrograms,
  portalUrl: "https://delphi.uniroma2.it",
  links: [
    { label: "Delphi — Segreteria online", url: "https://delphi.uniroma2.it" },
    { label: "Portale di Ateneo", url: "https://web.uniroma2.it" },
  ],
};

```

## 5. `npm run gate`

Lo script **esiste** in `package.json` (sezione scripts):

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "gate": "npm run build && npm test && tsc --noEmit && npm run lint",
    "test": "tsx tests/storage.test.ts && tsx tests/urgency.test.ts && tsx tests/week.test.ts && tsx tests/projection.test.ts && tsx tests/notes.test.ts && tsx tests/focus.test.ts && tsx tests/delphi.test.ts && tsx tests/calendar.test.ts && tsx tests/csv.test.ts && tsx tests/delphiPdf.test.ts && tsx tests/validateUrl.test.ts && tsx tests/validateUrlPort.test.ts && tsx tests/validateUrlProvider.test.ts && tsx tests/achievements.test.ts && tsx tests/trophyView.test.ts && tsx tests/celebrations.test.ts && tsx tests/dateField.test.ts && tsx tests/pdfImport.test.ts && tsx tests/isOnboarded.test.ts && tsx tests/alerts.test.ts && tsx tests/guard.test.ts && tsx tests/api-sync.test.ts && tsx tests/api-assistente.test.ts && tsx tests/api-import-pdf.test.ts && tsx tests/api-sync-delphi.test.ts && tsx tests/api-health.test.ts && tsx tests/api-alerts.test.ts && tsx tests/insegnamentiParser.test.ts && tsx tests/insegnamentiDiscovery.test.ts && tsx tests/insegnamentiSync.test.ts && tsx tests/libretto.test.ts && tsx tests/sources.test.ts && tsx tests/academicYear.test.ts && tsx tests/emailToAteneo.test.ts && tsx tests/booking.test.ts && tsx tests/diff.test.ts && tsx tests/diffPastExams.test.ts && tsx tests/syncUtil.test.ts && tsx tests/manualStore.test.ts && tsx tests/distributedRateLimit.test.ts && tsx tests/hooks-muri.test.ts && tsx tests/hooks-muri-1-2.test.ts"
  },
```

`npm run gate` = `npm run build && npm test && tsc --noEmit && npm run lint` — i 4 comandi (build / test / tsc / lint) in sequenza fail-fast. `npm test` è una lista esplicita di `tsx tests/*.test.ts` concatenati con `&&` (NON un glob): un test nuovo gira solo se aggiunto allo script. Nota: lo snapshot dello script `test` qui sopra è precedente alla PR #29, che vi ha aggiunto `&& tsx tests/http.test.ts`. Esito del gate su questo branch: vedi sezione 10.

## 6. Rate limiting / attese nei sync

> **Aggiornato dopo la PR #29** (`3711e2f`, `src/lib/sync/http.ts`, nuovo). Nello snapshot iniziale di questa sessione non c'era nessun delay a runtime; ora c'è.

Comando richiesto: `grep -rn "setTimeout\|delay(\|sleep(" src/lib --include="*.ts" | grep -i sync`. Rilanciato dopo la PR #29 (con `grep -rnE "setTimeout|sleep|delay"` su `src/lib/sync`) trova ora `src/lib/sync/http.ts` (`defaultSleep` con `setTimeout`, più `sleep(...)` alle righe 108, 123, 137).

### 6.1 Runtime: `politeFetch` (`src/lib/sync/http.ts`)

Client HTTP condiviso per tutti i fetch server-side verso i portali. Usato da `adapters/easyacademy.ts`, `adapters/ical.ts`, `adapters/wordpress-news.ts` e `insegnamenti/discovery.ts`. Il client di Delphi (`sync/delphi/client.ts`) ha un proprio `User-Agent` e non passa da qui. Costanti reali:

| Costante | Valore | Effetto |
|---|---|---|
| `HOST_GAP_MS` | 250 ms | spaziatura minima tra richieste allo stesso host (slot per host, retry inclusi; opzione `hostGapMs`) |
| `MAX_RETRIES_STATUS` | 3 | retry su 429/503 |
| `MAX_RETRIES_NETWORK` | 2 | retry su timeout/connessione caduta |
| `BACKOFF_BASE_MS` | 1000 ms | backoff esponenziale `1000 × 2^n + jitter(0–250 ms)` |
| `MAX_WAIT_MS` | 10 000 ms | un `Retry-After` (o backoff) più lungo → si rinuncia e il chiamante vede il 429/503 |
| `ATTEMPT_TIMEOUT_MS` | 15 000 ms | timeout per tentativo (combinato con il signal del chiamante) |
| `CACHE_MAX_ENTRIES` / `CACHE_MAX_BODY_BYTES` | 64 / 2 000 000 | cache per-processo di validatori + body |

Comportamento: `User-Agent` identificabile (`StudentOS/1.0 (+https://github.com/Marru954/studentSOS; contatto: DA-DEFINIRE)`); GET condizionali (`If-None-Match`/`If-Modified-Since` quando la risposta precedente aveva `ETag`/`Last-Modified`, un 304 è servito come 200 dalla cache); rispetto di `Retry-After` (secondi o data HTTP); `redirect: "manual"` di default; l'SSRF resta a carico del chiamante. La cache è per-processo (le istanze serverless sono effimere: best effort). Test: `tests/http.test.ts`, aggiunto allo script `test`.

Rimane invariato che `engine.ts:16` lancia **tutte le sorgenti in parallelo** con `Promise.all` (isolamento dei fallimenti per sorgente), senza limite di concorrenza globale: il limite è solo la spaziatura per host di `politeFetch`.

### 6.2 Script di ricognizione (`scripts/`, sola lettura, non toccati)

Hanno una propria logica, separata da `politeFetch`:

```
scripts/audit-codes.ts:34:      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
scripts/audit-exams.ts:40:      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
scripts/recapture-codes.ts:55:      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
scripts/recapture-codes.ts:25:const PER_HOST = 4;
scripts/audit-codes.ts:16:const PER_HOST = 4;
scripts/audit-exams.ts:16:const PER_HOST = 4;
```

Retry con backoff lineare 500 ms × (tentativo+1) (`tries = 3`, timeout 30 s, `redirect: "manual"`) e concorrenza massima 4 per host (`PER_HOST = 4`, helper `pool`). Il rate limiting lato server per gli endpoint (cookie HMAC + limite globale distribuito) riguarda le API proxy, non la cadenza dei fetch verso gli atenei (v. CLAUDE.md "Server-proxy security").

## 7. Debito tecnico esteso

Comando: `grep -rn "TODO\|FIXME\|XXX\|@deprecated" src --include="*.ts*"`

Snapshot iniziale: nessun risultato. **Dopo la PR #29** c'è una occorrenza:

```
src/lib/sync/http.ts:18:/** Descriptive UA. TODO: replace the contact placeholder with a real address. */
```

Il `contatto: DA-DEFINIRE` nello `USER_AGENT` è un segnaposto da sostituire con un indirizzo reale prima di considerarlo un client "educato" verso i portali. Il resto del debito noto è tracciato a mano in "In sospeso" di `docs/stato/STATO.md`: finding audit non fixati (postcss #7, XSS hardening LOW, DNS-rebinding TOCTOU #6); ProgressRing id gradiente duplicato; validazione ManualExamForm/ManualLessonForm non allineata all'inline-error; deferred UX (filtri in URL, deep-link SearchPalette, inert/scroll-lock Overlay).

## 8. Dettagli stack

Wrapper IndexedDB — `grep -n "idb\|dexie" package.json`:

```
18:    "idb": "^8.0.3",
```

→ **`idb` ^8.0.3** (Dexie non presente). Zustand: `"zustand": "^5.0.14"`.

Persist middleware Zustand — `grep -rn "persist(" src/store`:

```
grep: src/store: No such file or directory
```

La directory `src/store` **non esiste**: gli store stanno in `src/lib/state/`. Ricerca rifatta su tutto `src` (`grep -rn "persist(" src`):

```
src/lib/insegnamenti/sync.ts:68:  const count = await persist(ateneo_id, corso_id, parsed, api.url);
src/lib/insegnamenti/sync.ts:99:export async function persist(
src/lib/state/alerts.ts:35:  function persist(): void {
src/lib/state/alerts.ts:58:      persist();
src/lib/state/alerts.ts:68:      persist();
src/lib/state/alerts.ts:73:      persist();
src/lib/state/alerts.ts:78:      persist();
```

`grep -rn "zustand/middleware" src` → nessun risultato.

→ Il **middleware `persist` di Zustand NON è usato**. Le occorrenze di `persist(` sono funzioni omonime custom: `lib/insegnamenti/sync.ts` (scrittura del piano di studi su IndexedDB) e `state/alerts.ts` (helper locale che chiama `saveStoredAlerts`). La persistenza è **write-through manuale** verso IndexedDB (`StoreProvider` idrata gli store all'avvio; le mutazioni scrivono su IDB e sull'in-memory), più il push best-effort su Supabase in `lib/supabase/sync.ts`. File che importano `create` di zustand: `state/{alerts,celebration,insegnamenti,manual,searchPalette,settings,synced,toast,trophies,ui}.ts`, `supabase/{auth,sync}.ts`.

## 9. Note ambientali

- Shell: Git Bash su Windows; `tree` e `python` non disponibili (usato `find`).
- Toccati solo questo file: `db.ts`, `easyacademy.ts`, `scripts/` e il resto dell'app restano intatti.

## 10. Gate

`npm run gate` lanciato sul branch (dopo `npm ci` — il worktree non aveva `node_modules`; nessuna dipendenza nuova, `package.json`/lockfile invariati): **exit 0** — `next build` ok, `npm test` ok (ultimo file di test: 52 test, 52 pass, 0 fail), `tsc --noEmit` ok, `eslint` ok.

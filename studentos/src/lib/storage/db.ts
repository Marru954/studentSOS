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

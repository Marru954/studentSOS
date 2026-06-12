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
}

const DB_NAME = "studentos";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<StudentOSDB>> | undefined;

export function getDb(): Promise<IDBPDatabase<StudentOSDB>> {
  dbPromise ??= openDB<StudentOSDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // v2 adds the secrets store; guard each store so upgrades from any
      // prior version create only what's missing.
      if (oldVersion >= 1) {
        if (!db.objectStoreNames.contains("secrets")) {
          db.createObjectStore("secrets");
        }
        return;
      }
      const classEvents = db.createObjectStore("classEvents", { keyPath: "id" });
      classEvents.createIndex("by-source", "sourceId");
      classEvents.createIndex("by-start", "start");

      const examCalls = db.createObjectStore("examCalls", { keyPath: "id" });
      examCalls.createIndex("by-source", "sourceId");
      examCalls.createIndex("by-date", "date");

      const news = db.createObjectStore("news", { keyPath: "id" });
      news.createIndex("by-source", "sourceId");

      db.createObjectStore("syncMeta", { keyPath: "sourceId" });

      const notices = db.createObjectStore("changeNotices", { keyPath: "id" });
      notices.createIndex("by-detected", "detectedAt");

      db.createObjectStore("libretto", { keyPath: "id" });

      const notes = db.createObjectStore("notes", { keyPath: "id" });
      notes.createIndex("by-updated", "updatedAt");

      const tasks = db.createObjectStore("studyTasks", { keyPath: "id" });
      tasks.createIndex("by-status", "status");

      const focus = db.createObjectStore("focusSessions", { keyPath: "id" });
      focus.createIndex("by-started", "startedAt");

      db.createObjectStore("settings");
      db.createObjectStore("secrets");
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

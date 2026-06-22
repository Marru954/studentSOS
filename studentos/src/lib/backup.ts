"use client";

/** Local backup: export every manual territory + settings to a single JSON
 *  file, and restore it. This is the offline answer to "my data on another
 *  device / before I clear the browser cache" — no account, no server. */
import { z } from "zod";
import {
  useFocusSessions,
  useLibretto,
  useNotes,
  useTasks,
} from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { focusRepo, getSettings, librettoRepo, notesRepo, tasksRepo } from "@/lib/storage/repo";
import type { AppSettings } from "@/lib/storage/types";

interface BackupFile {
  app: "studentos";
  version: 1;
  exportedAt: string;
  libretto: unknown[];
  notes: unknown[];
  tasks: unknown[];
  focus: unknown[];
  settings: unknown;
}

/** Export every manual territory + settings to a single downloadable JSON file. */
export async function exportBackup(): Promise<void> {
  const [libretto, notes, tasks, focus, settings] = await Promise.all([
    librettoRepo.getAll(),
    notesRepo.getAll(),
    tasksRepo.getAll(),
    focusRepo.getAll(),
    getSettings(),
  ]);
  const data: BackupFile = {
    app: "studentos",
    version: 1,
    exportedAt: new Date().toISOString(),
    libretto,
    notes,
    tasks,
    focus,
    settings,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `studentos-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Count of rows restored per manual territory by {@link importBackup}. */
export interface ImportResult {
  libretto: number;
  notes: number;
  tasks: number;
  focus: number;
}

/** Numero massimo di righe per territorio: un backup reale ne ha al più poche
 *  migliaia; oltre è un file ostile o corrotto e va rifiutato prima di toccare i dati. */
const MAX_ROWS = 5000;

const str = (max: number) => z.string().max(max);

/** Whitelist esplicita delle chiavi settings note (src/lib/storage/types.ts):
 *  `.strict()` rifiuta qualunque chiave estranea (incl. `__proto__` come chiave
 *  letterale da JSON), `.partial()` perché un backup può ometterne alcune. */
const settingsSchema = z
  .object({
    presetId: str(200),
    yearOfStudy: z.number().int().min(0).max(20),
    programme: str(300),
    enabledSourceIds: z.array(str(200)).max(200),
    pinnedCourses: z.array(str(300)).max(2000),
    degreePlan: z
      .object({
        totalCfu: z.number().min(0).max(100_000),
        targetAverage: z.number().min(0).max(31).optional(),
      })
      .strict(),
    syncHorizonDays: z.number().int().min(0).max(3650),
    density: z.enum(["comfortable", "compact"]),
    weekStartsOn: z.enum(["mon", "sun"]),
    examReminders: z.boolean(),
    reminderDaysBefore: z.number().int().min(0).max(365),
  })
  .partial()
  .strict();

/** Struttura del file di backup. Le righe restano `unknown` (gli store/IndexedDB
 *  hanno già i loro tipi): qui serve il gate strutturale + i cap, non il tipaggio fine. */
const backupSchema = z.object({
  app: z.literal("studentos"),
  version: z.literal(1),
  exportedAt: z.string().max(64).optional(),
  libretto: z.array(z.unknown()).max(MAX_ROWS),
  notes: z.array(z.unknown()).max(MAX_ROWS),
  tasks: z.array(z.unknown()).max(MAX_ROWS),
  focus: z.array(z.unknown()).max(MAX_ROWS),
  settings: settingsSchema.optional(),
});

/** Replace all manual data + settings with the backup's contents. Throws on a
 *  malformed file. Validazione completa (zod) PRIMA di qualsiasi `clear()`: un file
 *  ostile o corrotto viene rifiutato senza cancellare i dati esistenti. */
export async function importBackup(file: File): Promise<ImportResult> {
  let raw: unknown;
  try {
    raw = JSON.parse(await file.text());
  } catch {
    throw new Error("File di backup non valido.");
  }
  const result = backupSchema.safeParse(raw);
  if (!result.success) {
    throw new Error("File di backup non valido.");
  }
  const data = result.data;

  const libretto = data.libretto as never[];
  const notes = data.notes as never[];
  const tasks = data.tasks as never[];
  const focus = data.focus as never[];

  await useLibretto.getState().clear();
  await useLibretto.getState().upsertMany(libretto);
  await useNotes.getState().clear();
  await useNotes.getState().upsertMany(notes);
  await useTasks.getState().clear();
  await useTasks.getState().upsertMany(tasks);
  await useFocusSessions.getState().clear();
  await useFocusSessions.getState().upsertMany(focus);
  if (data.settings) {
    await useSettings.getState().update(data.settings as Partial<AppSettings>);
  }

  return {
    libretto: libretto.length,
    notes: notes.length,
    tasks: tasks.length,
    focus: focus.length,
  };
}

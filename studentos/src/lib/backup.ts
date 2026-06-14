"use client";

/** Local backup: export every manual territory + settings to a single JSON
 *  file, and restore it. This is the offline answer to "my data on another
 *  device / before I clear the browser cache" — no account, no server. */
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

export interface ImportResult {
  libretto: number;
  notes: number;
  tasks: number;
  focus: number;
}

/** Replace all manual data + settings with the backup's contents. Throws on a
 *  malformed file. */
export async function importBackup(file: File): Promise<ImportResult> {
  const data = JSON.parse(await file.text()) as Partial<BackupFile>;
  if (data.app !== "studentos" || !Array.isArray(data.libretto)) {
    throw new Error("File di backup non valido.");
  }
  const libretto = (data.libretto ?? []) as never[];
  const notes = (data.notes ?? []) as never[];
  const tasks = (data.tasks ?? []) as never[];
  const focus = (data.focus ?? []) as never[];

  await useLibretto.getState().clear();
  await useLibretto.getState().upsertMany(libretto);
  await useNotes.getState().clear();
  await useNotes.getState().upsertMany(notes);
  await useTasks.getState().clear();
  await useTasks.getState().upsertMany(tasks);
  await useFocusSessions.getState().clear();
  await useFocusSessions.getState().upsertMany(focus);
  if (data.settings && typeof data.settings === "object") {
    await useSettings.getState().update(data.settings as Partial<AppSettings>);
  }

  return {
    libretto: libretto.length,
    notes: notes.length,
    tasks: tasks.length,
    focus: focus.length,
  };
}

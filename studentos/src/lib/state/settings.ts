"use client";

/** Settings store: which university preset, which sources, degree plan.
 *  Write-through to IndexedDB; hydrate() is called once by StoreProvider. */
import { create } from "zustand";
import { getPreset } from "@/lib/sync/universities";
import type { SyncSource } from "@/lib/sync/provider";
import { getSettings, saveSettings } from "@/lib/storage/repo";
import { type AppSettings, DEFAULT_SETTINGS } from "@/lib/storage/types";

interface SettingsState extends AppSettings {
  hydrated: boolean;
  hydrate(): Promise<void>;
  update(patch: Partial<AppSettings>): Promise<void>;
  /** The actual SyncSource objects currently enabled, resolved from the preset. */
  enabledSources(): SyncSource[];
}

export const useSettings = create<SettingsState>()((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const stored = await getSettings();
    set({ ...stored, hydrated: true });
  },

  async update(patch) {
    const next: AppSettings = {
      presetId: patch.presetId ?? get().presetId,
      yearOfStudy: patch.yearOfStudy ?? get().yearOfStudy,
      enabledSourceIds: patch.enabledSourceIds ?? get().enabledSourceIds,
      pinnedCourses: patch.pinnedCourses ?? get().pinnedCourses,
      degreePlan: patch.degreePlan ?? get().degreePlan,
      syncHorizonDays: patch.syncHorizonDays ?? get().syncHorizonDays,
    };
    set(next);
    await saveSettings(next);
  },

  enabledSources() {
    const { presetId, enabledSourceIds } = get();
    if (!presetId) return [];
    const preset = getPreset(presetId);
    if (!preset) return [];
    // The merged all-years timetable is a V2 invariant: every year's lessons
    // always sync once a preset is chosen (the student narrows them later via
    // pinnedCourses, never by disabling a year). This also self-heals legacy
    // setups that only enabled a single year's `orario` source. Exams and news
    // still follow the explicit enabledSourceIds picked at onboarding.
    return preset.sources.filter(
      (s) => s.capability === "timetable" || enabledSourceIds.includes(s.id),
    );
  },
}));

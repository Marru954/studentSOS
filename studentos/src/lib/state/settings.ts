"use client";

/** Settings store: which university preset, which sources, degree plan.
 *  Write-through to IndexedDB; hydrate() is called once by StoreProvider. */
import { create } from "zustand";
import { getPreset, liveProgramFor } from "@/lib/sync/universities";
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
      programme: patch.programme ?? get().programme,
      enabledSourceIds: patch.enabledSourceIds ?? get().enabledSourceIds,
      pinnedCourses: patch.pinnedCourses ?? get().pinnedCourses,
      degreePlan: patch.degreePlan ?? get().degreePlan,
      syncHorizonDays: patch.syncHorizonDays ?? get().syncHorizonDays,
    };
    set(next);
    await saveSettings(next);
  },

  enabledSources() {
    const { presetId, programme, enabledSourceIds } = get();
    if (!presetId) return [];
    const preset = getPreset(presetId);
    if (!preset) return [];
    // Multi-programme ateneo (e.g. Tor Vergata): resolve the chosen course to its
    // verified-live programme and return only that programme's sources. A course
    // that isn't one of the live degrees → no sources → manual mode. (Same
    // all-years-timetable invariant as below: every year syncs once live.)
    if (preset.livePrograms?.length) {
      const lp = liveProgramFor(preset, programme);
      if (!lp) return [];
      return lp.sources.filter(
        (s) => s.capability === "timetable" || enabledSourceIds.includes(s.id),
      );
    }
    if (preset.sources.length === 0) return [];
    // A live preset's sources cover ONLY its verified live programme. If the
    // student picked a different course at the same ateneo (onboarding now lists
    // the full catalogue), there are no live sources for it → manual mode.
    if (
      preset.programme &&
      programme &&
      programme.trim().toLowerCase() !== preset.programme.trim().toLowerCase()
    ) {
      return [];
    }
    // The merged all-years timetable is a V2 invariant: every year's lessons
    // always sync once the live course is chosen (the student narrows them later
    // via pinnedCourses, never by disabling a year). This also self-heals legacy
    // setups that only enabled a single year's `orario` source. Exams and news
    // still follow the explicit enabledSourceIds picked at onboarding.
    return preset.sources.filter(
      (s) => s.capability === "timetable" || enabledSourceIds.includes(s.id),
    );
  },
}));

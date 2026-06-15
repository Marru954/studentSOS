import type { LiveProgram, UniversityPreset } from "../provider";
import { easyAcademyLivePresets } from "./easyacademy-live";
import { italianAtenei } from "./italian-atenei";
import { uniroma2 } from "./uniroma2";

/** Built-in presets. Tor Vergata (a whole ateneo, every degree with verified
 *  codes wired live via `livePrograms` — see uniroma2.ts) plus 12 more
 *  EasyAcademy atenei are fully wired (each verified against the real endpoints);
 *  the remaining Italian universities ship in manual / PDF-import mode until
 *  their systems are supported. Users can also assemble a custom preset. */
export const UNIVERSITY_PRESETS: UniversityPreset[] = [
  uniroma2,
  ...easyAcademyLivePresets,
  ...italianAtenei,
];

export function getPreset(id: string): UniversityPreset | undefined {
  return UNIVERSITY_PRESETS.find((preset) => preset.id === id);
}

/** Resolve the chosen course to its live programme within a multi-programme
 *  preset (case-insensitive). Returns undefined for legacy single-programme
 *  presets or when the course isn't one of the verified-live degrees. */
export function liveProgramFor(
  preset: UniversityPreset | undefined,
  programme: string | undefined,
): LiveProgram | undefined {
  if (!preset?.livePrograms?.length || !programme) return undefined;
  const q = programme.trim().toLowerCase();
  return preset.livePrograms.find((lp) => lp.programme.trim().toLowerCase() === q);
}

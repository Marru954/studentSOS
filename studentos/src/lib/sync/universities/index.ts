import type { UniversityPreset } from "../provider";
import { easyAcademyLivePresets } from "./easyacademy-live";
import { italianAtenei } from "./italian-atenei";
import { uniroma2Informatica } from "./uniroma2-informatica";

/** Built-in presets. Tor Vergata plus 12 more EasyAcademy atenei are fully wired
 *  (live timetable/exam sources, each verified against the real endpoints — see
 *  easyacademy-live.ts); the remaining Italian universities ship in manual /
 *  PDF-import mode until their systems are supported. Users can also assemble a
 *  custom preset in the UI. */
export const UNIVERSITY_PRESETS: UniversityPreset[] = [
  uniroma2Informatica,
  ...easyAcademyLivePresets,
  ...italianAtenei,
];

export function getPreset(id: string): UniversityPreset | undefined {
  return UNIVERSITY_PRESETS.find((preset) => preset.id === id);
}

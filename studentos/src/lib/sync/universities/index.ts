import type { UniversityPreset } from "../provider";
import { uniroma2Informatica } from "./uniroma2-informatica";

/** Built-in presets. Users can also assemble a custom preset in the UI
 *  (e.g. pointing the iCal adapter at their own university's feed). */
export const UNIVERSITY_PRESETS: UniversityPreset[] = [uniroma2Informatica];

export function getPreset(id: string): UniversityPreset | undefined {
  return UNIVERSITY_PRESETS.find((preset) => preset.id === id);
}

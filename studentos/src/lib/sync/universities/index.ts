import type { UniversityPreset } from "../provider";
import { italianAtenei } from "./italian-atenei";
import { uniroma2Informatica } from "./uniroma2-informatica";

/** Built-in presets. Tor Vergata Informatica is fully wired (live sources);
 *  the other Italian universities ship in manual / PDF-import mode until their
 *  endpoints are verified. Users can also assemble a custom preset in the UI. */
export const UNIVERSITY_PRESETS: UniversityPreset[] = [
  uniroma2Informatica,
  ...italianAtenei,
];

export function getPreset(id: string): UniversityPreset | undefined {
  return UNIVERSITY_PRESETS.find((preset) => preset.id === id);
}

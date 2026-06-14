import type { UniversityPreset } from "../provider";
import {
  unipgInformatica,
  unitsIngegneriaInformatica,
} from "./easyacademy-live";
import { italianAtenei } from "./italian-atenei";
import { uniroma2Informatica } from "./uniroma2-informatica";

/** Built-in presets. Tor Vergata Informatica, Trieste Ingegneria Elettronica e
 *  Informatica and Perugia Informatica are fully wired (live EasyAcademy
 *  sources, verified); the other Italian universities ship in manual /
 *  PDF-import mode until their endpoints are verified. Users can also assemble a
 *  custom preset in the UI. */
export const UNIVERSITY_PRESETS: UniversityPreset[] = [
  uniroma2Informatica,
  unitsIngegneriaInformatica,
  unipgInformatica,
  ...italianAtenei,
];

export function getPreset(id: string): UniversityPreset | undefined {
  return UNIVERSITY_PRESETS.find((preset) => preset.id === id);
}

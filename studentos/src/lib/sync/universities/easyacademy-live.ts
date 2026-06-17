/**
 * Live EasyAcademy presets beyond Tor Vergata.
 *
 * Every `scuola` / `corso` / `anno2[]` below was captured from each ateneo's
 * public combo cascade (`combo.php?sw=ec_&aa=2025&page=corsi`) and then VERIFIED
 * end-to-end on 2026-06-15 by POSTing grid_call.php (real lessons) and, where
 * the ateneo publishes them, test_call.php (real exam calls). Atenei that keep
 * exams in Esse3 (no easytest feed) ship timetable-only via `exams: false`.
 *
 * The 2025/26 ministerial ordinamento reform splits most triennali across two
 * `corso` codes — a brand-new 1st year vs. the older 2nd/3rd years — and uses
 * curriculum-coded `anno2`, so each year carries its own `corso` + `anno2[]`.
 * Re-verify every September: these codes (especially the curriculum suffixes)
 * are the volatile part. Never edit a code without re-running grid_call.php.
 *
 * Priority is the informatica / ingegneria area, per ateneo. Adding a course is
 * config, not code — see easystaff.ts `easyAcademyPreset`.
 */
import type { UniversityPreset } from "../provider";
import { unifi } from "./unifi";
import { unige } from "./unige";
import { unipr } from "./unipr";
import { unica } from "./unica";
import { unisa } from "./unisa";
import { unife } from "./unife";
import { unitn } from "./unitn";
import { unina } from "./unina";
import { uniupo } from "./uniupo";
import { uniss } from "./uniss";
import { unipg } from "./unipg";
import { unistrasi } from "./unistrasi";
import { units } from "./units";
import { unive } from "./unive";
import { unisalento } from "./unisalento";
import { unicampania } from "./unicampania";














/** All verified live EasyAcademy presets, registered in `index.ts`. */
export const easyAcademyLivePresets: UniversityPreset[] = [
  units,
  unipg,
  unica,
  unitn,
  unina,
  unife,
  unipr,
  unisa,
  uniss,
  unifi,
  unige,
  uniupo,
  unistrasi,
  unive,
  unisalento,
  unicampania,
];

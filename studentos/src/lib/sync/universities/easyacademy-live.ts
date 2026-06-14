/**
 * Live EasyAcademy presets beyond Tor Vergata.
 *
 * Every `scuola` / `corso` / `anno2[]` below was captured from each ateneo's
 * public combo cascade and then VERIFIED end-to-end on 2026-06-15 by POSTing
 * grid_call.php (real lessons) and test_call.php (real exam calls). Re-verify
 * each September: the 2025/26 ordinamento reform is still shifting codes (the
 * curriculum-coded `anno2` selectors are the most volatile part).
 */
import { easyAcademyPreset } from "./easystaff";

/**
 * Università di Trieste — Ingegneria Elettronica e Informatica (triennale).
 * The reform splits the course: the 1st year sits under the new `IN05A`
 * ordinamento, the 2nd/3rd years under the older `IN05` (curricula 5/6/7).
 * Verified 2026-06-15: y1 12 lessons / 22 appelli, y2 22 / 37, y3 20 / 15.
 */
export const unitsIngegneriaInformatica = easyAcademyPreset({
  id: "units-ingegneria-informatica",
  name: "Università degli Studi di Trieste",
  shortName: "Università di Trieste",
  city: "Trieste",
  programme: "Ingegneria Elettronica e Informatica",
  baseUrl: "https://orari.units.it/agendaweb",
  scuola: "DipartimentodiIngegneriaeArchitettura",
  anno: "2025",
  years: [
    {
      year: 1,
      corso: "IN05A",
      anno2: ["IN05A+5+|1", "IN05A+7+|1", "IN05A+6+|1"],
      examCdl: "IN05A",
    },
    {
      year: 2,
      corso: "IN05",
      anno2: ["IN05+5+|2", "IN05+6+|2", "IN05+7+|2"],
      examCdl: "IN05",
    },
    {
      year: 3,
      corso: "IN05",
      anno2: ["IN05+5+|3", "IN05+7+|3"],
      examCdl: "IN05",
    },
  ],
});

/**
 * Università di Perugia — Informatica (triennale, curriculum GEN).
 * Split too: 1st year under `L0921`, 2nd/3rd years under `L062` — both in the
 * Dipartimento di Matematica e Informatica. Verified 2026-06-15: y1 10 lessons
 * / 7 appelli, y2 6 lessons, y3 10 lessons.
 */
export const unipgInformatica = easyAcademyPreset({
  id: "unipg-informatica",
  name: "Università degli Studi di Perugia",
  shortName: "Università di Perugia",
  city: "Perugia",
  programme: "Informatica",
  baseUrl: "https://easyacademy.unipg.it/agendaweb",
  scuola: "DipartimentodiMatematicaeInformatica",
  anno: "2025",
  years: [
    { year: 1, corso: "L0921", anno2: ["GEN|1"], examCdl: "L0921" },
    { year: 2, corso: "L062", anno2: ["GEN|2"], examCdl: "L062" },
    { year: 3, corso: "L062", anno2: ["GEN|3"], examCdl: "L062" },
  ],
});

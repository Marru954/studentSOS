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
import { easyAcademyPreset } from "./easystaff";
import { unisa } from "./unisa";
import { unife } from "./unife";
import { unitn } from "./unitn";
import { unina } from "./unina";
import { uniupo } from "./uniupo";
import { uniss } from "./uniss";
import { unipg } from "./unipg";
import { unistrasi } from "./unistrasi";
import { units } from "./units";



// Cagliari — Informatica (L-31). y1 60/84, y2/3 60/61. Verified 9/11/10 lessons,
// 6/14/15 appelli.
const unica = easyAcademyPreset({
  id: "unica-informatica",
  name: "Università degli Studi di Cagliari",
  shortName: "Università di Cagliari",
  city: "Cagliari",
  programme: "Informatica",
  baseUrl: "https://unica.easystaff.it/AgendaWeb",
  scuola: "FacoltadiScienze",
  anno: "2025",
  years: [
    { year: 1, corso: "60/84", anno2: ["84/00|1"] },
    { year: 2, corso: "60/61", anno2: ["61/00|2"] },
    { year: 3, corso: "60/61", anno2: ["61/00|3"] },
  ],
});




// Parma — Informatica (curriculum GEN). y1 3127, y2/3 3027. Verified 17/7/12
// lessons, 18/32/51 appelli.
const unipr = easyAcademyPreset({
  id: "unipr-informatica",
  name: "Università degli Studi di Parma",
  shortName: "Università di Parma",
  city: "Parma",
  programme: "Informatica",
  baseUrl: "https://agendastudenti.unipr.it",
  scuola: "",
  anno: "2025",
  years: [
    { year: 1, corso: "3127", anno2: ["GEN|1"] },
    { year: 2, corso: "3027", anno2: ["GEN|2"] },
    { year: 3, corso: "3027", anno2: ["GEN|3"] },
  ],
});



// Firenze — Informatica (curriculum GEN). y1 B324, y2/3 B032. Verified 10/18/23
// lessons, 9/26/19 appelli. (Firenze brands agendaweb as "Kairos".)
const unifi = easyAcademyPreset({
  id: "unifi-informatica",
  name: "Università degli Studi di Firenze",
  shortName: "Università di Firenze",
  city: "Firenze",
  programme: "Informatica",
  baseUrl: "https://kairos.unifi.it/agendaweb",
  scuola: "ScuoladiScienzeMatematiche-FisicheeNaturali",
  anno: "2025",
  years: [
    { year: 1, corso: "B324", anno2: ["GEN|1"] },
    { year: 2, corso: "B032", anno2: ["GEN|2"] },
    { year: 3, corso: "B032", anno2: ["GEN|3"] },
  ],
});

// Genova — Informatica. y1 11896 (2 curricula), y2/3 8759. Verified 22/10/27
// lessons, 29/11/27 appelli. (base path is /portalestudenti here.)
const unige = easyAcademyPreset({
  id: "unige-informatica",
  name: "Università degli Studi di Genova",
  shortName: "Università di Genova",
  city: "Genova",
  programme: "Informatica",
  baseUrl: "https://easyacademy.unige.it/portalestudenti",
  scuola: "ScuoladiScienzeMat-Fis-Nat",
  anno: "2025",
  years: [
    { year: 1, corso: "11896", anno2: ["1|1", "2|1"] },
    { year: 2, corso: "8759", anno2: ["4|2", "5|2"] },
    { year: 3, corso: "8759", anno2: ["4|3", "5|3"] },
  ],
});



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
];

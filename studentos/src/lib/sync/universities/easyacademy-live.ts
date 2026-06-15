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

// Trento — Informatica (Scienze e Tecnologie Informatiche). y1 0532G, y2/3 0514G.
// Verified 16/19/21 lessons, 22/52/45 appelli. (scuola not used by this instance.)
const unitn = easyAcademyPreset({
  id: "unitn-informatica",
  name: "Università degli Studi di Trento",
  shortName: "Università di Trento",
  city: "Trento",
  programme: "Informatica",
  baseUrl: "https://easyacademy.unitn.it/AgendaStudentiUnitn",
  scuola: "",
  anno: "2025",
  years: [
    { year: 1, corso: "0532G", anno2: ["P0405|1"] },
    { year: 2, corso: "0514G", anno2: ["P0405|2"] },
    { year: 3, corso: "0514G", anno2: ["P0405|3"] },
  ],
});

// Napoli Federico II — Informatica. y1 DE1, y2/3 N86 (Collegio di Scienze).
// Timetable verified 27/21/17 lessons; exams live in Esse3 → timetable-only.
const unina = easyAcademyPreset({
  id: "unina-informatica",
  name: "Università degli Studi di Napoli Federico II",
  shortName: "Federico II",
  city: "Napoli",
  programme: "Informatica",
  baseUrl: "https://easyacademy.unina.it/agendastudenti",
  scuola: "CollegiodiScienze",
  anno: "2025",
  exams: false,
  years: [
    { year: 1, corso: "DE1", anno2: ["C1_A-DE|1", "C2_DF-M|1", "C3_N-Z|1", "GEN|1"] },
    { year: 2, corso: "N86", anno2: ["C1_A-G|2", "C2_H-Z|2", "GEN|2"] },
    {
      year: 3,
      corso: "N86",
      anno2: ["GEN|3", "GEN_FGA-G|3", "GEN_FGH-Z|3", "MSA_H-Z|3"],
    },
  ],
});

// Ferrara — Informatica. y1 3252, y2/3 1233. Verified 11/13/15 lessons,
// 13/21/13 appelli.
const unife = easyAcademyPreset({
  id: "unife-informatica",
  name: "Università degli Studi di Ferrara",
  shortName: "Università di Ferrara",
  city: "Ferrara",
  programme: "Informatica",
  baseUrl: "https://aule.unife.it/AgendaStudenti",
  scuola: "",
  anno: "2025",
  years: [
    { year: 1, corso: "3252", anno2: ["PDS0|1"] },
    { year: 2, corso: "1233", anno2: ["PDS0|2"] },
    { year: 3, corso: "1233", anno2: ["PDS0|3"] },
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

// Salerno — Informatica. y1 NF121 (4 partizioni alfabetiche), y2/3 05121.
// Verified 44/37/30 lessons, 30/43/56 appelli. NB: the "PDS0-2017- N|y" anno2
// values contain a literal space — keep it exactly.
const unisa = easyAcademyPreset({
  id: "unisa-informatica",
  name: "Università degli Studi di Salerno",
  shortName: "Università di Salerno",
  city: "Salerno",
  programme: "Informatica",
  baseUrl: "https://easycourse.unisa.it/AgendaStudenti",
  scuola: "300392",
  anno: "2025",
  years: [
    {
      year: 1,
      corso: "NF121",
      anno2: [
        "PDS0-2025-A-C|1",
        "PDS0-2025-D-G|1",
        "PDS0-2025-H-PET|1",
        "PDS0-2025-PEU-Z|1",
      ],
    },
    {
      year: 2,
      corso: "05121",
      anno2: ["PDS0-2017- 0|2", "PDS0-2017- 1|2", "PDS0-2017- 2|2"],
    },
    {
      year: 3,
      corso: "05121",
      anno2: ["PDS0-2017- 0|3", "PDS0-2017- 1|3", "PDS0-2017- 2|3"],
    },
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

// Piemonte Orientale — Informatica (sede di Vercelli). y1 A149, y2/3
// 1932_VERCELLI. Verified 8/5/5 lessons, 8/24/24 appelli. (public app at
// /timetable; an identical Informatica exists at Alessandria.)
const uniupo = easyAcademyPreset({
  id: "uniupo-informatica",
  name: "Università del Piemonte Orientale",
  shortName: "Piemonte Orientale",
  city: "Vercelli",
  programme: "Informatica",
  baseUrl: "https://upoplanner.uniupo.it/timetable",
  scuola: "Vercelli",
  anno: "2025",
  years: [
    { year: 1, corso: "A149", anno2: ["000|1"] },
    { year: 2, corso: "1932_VERCELLI", anno2: ["000|2"] },
    { year: 3, corso: "1932_VERCELLI", anno2: ["000|3"] },
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

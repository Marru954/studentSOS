import { UNIVERSITY_PRESETS } from "@/lib/sync/universities";

export type AteneoListItem = { name: string; live: boolean };

/** Lista LEGGERA di tutti gli atenei ({name, live}), dedup + ordinata live-first
 *  poi alfabetica. Derivata server-side dai preset e passata come prop alla
 *  landing, così il grafo pesante di UNIVERSITY_PRESETS (codici + livePrograms)
 *  NON entra nel bundle client. Unica fonte: i dati reali. */
export const ATENEI_LIST: AteneoListItem[] = UNIVERSITY_PRESETS.map((p) => ({
  name: p.shortName ?? p.name,
  live: Boolean(p.liveSources),
}))
  .filter((a, i, arr) => arr.findIndex((b) => b.name === a.name) === i)
  .sort((a, b) =>
    a.live === b.live ? a.name.localeCompare(b.name, "it") : a.live ? -1 : 1,
  );

/** Solo i nomi degli atenei con sync live, ordine alfabetico — per la striscia
 *  di social proof, il conteggio stat band e la meta description. */
export const LIVE_ATENEI: string[] = ATENEI_LIST.filter((a) => a.live)
  .map((a) => a.name)
  .sort((a, b) => a.localeCompare(b, "it"));

export const LIVE_COUNT = LIVE_ATENEI.length;

/** Totale dei corsi di laurea live verificati uno per uno (somma di
 *  `livePrograms` su tutti i preset). Prova sociale onesta e concreta — un
 *  numero reale, non un testimonial inventato. Derivato server-side. */
export const LIVE_PROGRAMME_COUNT = UNIVERSITY_PRESETS.reduce(
  (sum, p) => sum + (p.livePrograms?.length ?? 0),
  0,
);

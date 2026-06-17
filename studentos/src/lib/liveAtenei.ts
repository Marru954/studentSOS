import { UNIVERSITY_PRESETS } from "@/lib/sync/universities";

/** Nomi reali degli atenei con sync live (orari/esami in automatico), derivati
 *  dai preset — singola fonte di verità per la striscia di social proof onesta,
 *  il conteggio nella stat band e la meta description. Niente numeri inventati. */
export const LIVE_ATENEI: string[] = UNIVERSITY_PRESETS.filter((p) => p.liveSources)
  .map((p) => p.shortName ?? p.name)
  .filter((n, i, a) => a.indexOf(n) === i)
  .sort((a, b) => a.localeCompare(b, "it"));

export const LIVE_COUNT = LIVE_ATENEI.length;

/**
 * Static provider registry. Adding a new source system to StudentOS means:
 *   1. implement SyncProvider in ./adapters/<name>.ts
 *   2. add it to PROVIDERS below
 *   3. reference its id from a university preset
 * Nothing else in the app changes.
 */
import type { SyncProvider } from "./provider";
import { easyAcademyProvider } from "./adapters/easyacademy";
import { icalProvider } from "./adapters/ical";
import { wordpressNewsProvider } from "./adapters/wordpress-news";

const PROVIDERS: SyncProvider<never>[] = [
  easyAcademyProvider as SyncProvider<never>,
  icalProvider as SyncProvider<never>,
  wordpressNewsProvider as SyncProvider<never>,
  // future: esse3Provider (public /e3rest exam-board endpoints)
];

const byId = new Map(PROVIDERS.map((p) => [p.id, p]));

export function getProvider(id: string): SyncProvider<never> | undefined {
  return byId.get(id);
}

export function listProviders(): readonly SyncProvider<never>[] {
  return PROVIDERS;
}

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

/**
 * Look up a registered sync provider by its stable id.
 * @param id The provider id referenced from a university preset.
 * @returns The matching provider, or undefined if no provider has that id.
 */
export function getProvider(id: string): SyncProvider<never> | undefined {
  return byId.get(id);
}

/**
 * List every registered sync provider.
 * @returns The full, read-only registry of providers.
 */
export function listProviders(): readonly SyncProvider<never>[] {
  return PROVIDERS;
}

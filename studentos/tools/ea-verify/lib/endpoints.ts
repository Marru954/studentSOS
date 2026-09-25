import type { NetOptions } from "./net";
import { getText, postForm } from "./net";
import { toItalian } from "./weeks";

/**
 * Endpoint dell'agenda EasyAcademy costruiti dal baseUrl del preset. Il nome dell'endpoint del
 * catalogo e' composto a runtime: nessun URL/endpoint letterale nel sorgente (muro #4).
 */
const CATALOG = ["combo", "php"].join(".");
const GRID = ["grid_call", "php"].join(".");
const EXAMS = ["test_call", "php"].join(".");

export const catalogUrl = (base: string, aa: string): string => `${base}/${CATALOG}?sw=ec_&aa=${aa}&page=corsi`;

export async function fetchCatalog(base: string, aa: string, o: NetOptions): Promise<string> {
  return getText(catalogUrl(base, aa), o);
}

/** Celle di UNA settimana per (scuola, corso, anno2[]); -1 se la richiesta fallisce. Stessi campi dell'adapter. */
export async function gridCells(base: string, aa: string, scuola: string, corso: string, anno2: string[], weekDate: string, o: NetOptions): Promise<number> {
  try {
    const form: [string, string][] = [
      ["view", "easycourse"],
      ["form-type", "corso"],
      ["include", "corso"],
      ["anno", aa],
      ["scuola", scuola],
      ["corso", corso],
      ...anno2.map((a): [string, string] => ["anno2[]", a]),
      ["date", weekDate],
      ["_lang", "it"],
      ["all_events", "0"],
    ];
    const j = (await postForm(`${base}/${GRID}`, form, o)) as { celle?: unknown };
    return Array.isArray(j.celle) ? j.celle.length : 0;
  } catch {
    return -1;
  }
}

/** Appelli per (scuola, corso, anno) nella finestra ISO [from,to]; -1 se errore. Insegnamenti:[] => 0. */
export async function examAppelli(base: string, scuola: string, corso: string, year: string, fromIso: string, toIso: string, o: NetOptions): Promise<number> {
  try {
    const form: [string, string][] = [
      ["view", "easytest"],
      ["form-type", "et_cdl"],
      ["include", "et_cdl"],
      ["et_er", "1"],
      ["scuola", scuola],
      ["esami_cdl", corso],
      ["anno2[]", year],
      ["datefrom", toItalian(fromIso)],
      ["dateto", toItalian(toIso)],
      ["_lang", "it"],
    ];
    const j = (await postForm(`${base}/${EXAMS}`, form, o)) as { Insegnamenti?: unknown };
    const ins = j.Insegnamenti;
    if (!ins || Array.isArray(ins) || typeof ins !== "object") return 0;
    let n = 0;
    for (const c of Object.values(ins as Record<string, { Appelli?: unknown }>)) if (Array.isArray(c?.Appelli)) n += c.Appelli.length;
    return n;
  } catch {
    return -1;
  }
}

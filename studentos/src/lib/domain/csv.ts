/**
 * Import CSV del libretto. Pure e testabile. Formato colonne richiesto:
 *   corso, cfu, voto, data, anno_accademico
 * Tollerante: rileva il separatore (`,` `;` tab — Excel italiano usa `;`),
 * accetta alias d'intestazione, gestisce i campi fra virgolette, e segnala
 * le righe scartate senza interrompere l'import.
 */
import type { Grade, LibrettoEntry } from "./types";
import { normalizeAcademicYear } from "./academicYear";
import { stableId } from "@/lib/sync/util";

/** Esito di un import CSV: le righe valide più il conteggio e gli errori dello scarto. */
export interface CsvImportResult {
  entries: LibrettoEntry[];
  imported: number;
  skipped: number;
  errors: string[];
}

const COLUMNS: Record<string, string[]> = {
  corso: ["corso", "insegnamento", "esame", "materia", "nome", "nomecorso"],
  cfu: ["cfu", "crediti", "peso"],
  voto: ["voto", "esito", "valutazione"],
  data: ["data", "dataesame", "dataappello"],
  anno: ["annoaccademico", "anno", "aa", "annoacc"],
};

function detectDelimiter(headerLine: string): string {
  const ranked = [",", ";", "\t"]
    .map((d) => [d, headerLine.split(d).length] as const)
    .sort((a, b) => b[1] - a[1]);
  return ranked[0][1] > 1 ? ranked[0][0] : ",";
}

function splitCsvLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === delim) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[\s_]+/g, "");
}

function parseVoto(raw: string): Grade | undefined {
  const t = raw.toLowerCase().trim();
  if (!t) return undefined;
  if (/idone|sup|appro|positiv|pass/.test(t)) return { kind: "pass" };
  const laude = /lode|30\s*l/.test(t);
  const m = /(\d{2})/.exec(t);
  if (!m) return undefined;
  const v = Number(m[1]);
  if (v < 18 || v > 30) return undefined;
  return { kind: "numeric", value: v, laude };
}

function parseDate(raw: string): string | undefined {
  const s = raw.trim();
  if (!s) return undefined;
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
  const dmy = /^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})/.exec(s);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }
  return undefined;
}

/**
 * Effettua il parsing del testo CSV del libretto in voci validate.
 * Rileva il separatore, riconosce gli alias d'intestazione e scarta le righe
 * non valide segnalandole senza interrompere l'import.
 * @param text Il contenuto grezzo del file CSV.
 * @returns Le voci importate con i conteggi di importate/scartate e gli errori.
 */
export function parseLibrettoCsv(text: string): CsvImportResult {
  const errors: string[] = [];
  const entries: LibrettoEntry[] = [];
  let skipped = 0;

  const lines = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    // righe vuote e commenti ("# …", presenti nel modello) ignorati
    .filter((l) => l.trim() !== "" && !l.trimStart().startsWith("#"));
  if (lines.length < 2) {
    return { entries, imported: 0, skipped: 0, errors: ["File vuoto o senza righe dati."] };
  }

  const delim = detectDelimiter(lines[0]);
  const header = splitCsvLine(lines[0], delim).map(normalizeHeader);
  const col: Record<string, number> = {};
  for (const [key, aliases] of Object.entries(COLUMNS)) {
    col[key] = header.findIndex((h) => aliases.includes(h));
  }
  if (col.corso < 0 || col.cfu < 0 || col.voto < 0) {
    return {
      entries,
      imported: 0,
      skipped: 0,
      errors: ["Intestazione non valida: servono almeno le colonne corso, cfu, voto."],
    };
  }

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i], delim);
    const at = (k: string) => (col[k] >= 0 ? (cells[col[k]] ?? "").trim() : "");
    const courseName = at("corso");
    const rowNo = i + 1;

    if (!courseName) {
      skipped++;
      errors.push(`Riga ${rowNo}: nome corso mancante.`);
      continue;
    }
    const cfu = Number(at("cfu"));
    if (!Number.isInteger(cfu) || cfu < 1 || cfu > 60) {
      skipped++;
      errors.push(`Riga ${rowNo}: CFU non valido ("${at("cfu")}").`);
      continue;
    }
    const grade = parseVoto(at("voto"));
    if (!grade) {
      skipped++;
      errors.push(`Riga ${rowNo}: voto non valido ("${at("voto")}").`);
      continue;
    }
    const date = parseDate(at("data"));
    const academicYear = normalizeAcademicYear(at("anno"));

    entries.push({
      id: stableId("import", courseName, date ?? "", academicYear ?? ""),
      courseName,
      cfu,
      grade,
      date: date ?? "",
      ...(academicYear ? { academicYear } : {}),
      source: "manual",
    });
  }

  return { entries, imported: entries.length, skipped, errors };
}

/**
 * Parser della pagina "Esami verbalizzati" del portale Delphi (Tor Vergata).
 * Puro e testabile: riceve il TESTO già estratto da pdfjs-dist lato client
 * (nessun upload).
 *
 * Il PDF è la STAMPA di una tabella HTML: pdfjs la sfilaccia su più righe e
 * incolla insieme i campi numerici, es. "2024/202520/01/20259.0". Per ogni
 * esame compaiono, in ordine ma sparpagliati:
 *   codice (8 cifre, 80……) · nome (su più righe) · SSD · AA · data · crediti · voto
 * e un numero di verbale (7 cifre, 0……). Lo stesso esame può ripetersi (più
 * tentativi: RESPINTO/RITIRATO e infine il voto valido).
 *
 * Strategia: segmentiamo per CODICE insegnamento (ogni tentativo è una
 * finestra fra due codici), poi dentro la finestra ancoriamo la "coda"
 * data+crediti+voto. Teniamo SOLO i voti validi (NN/30 o IDONEO); RESPINTO e
 * RITIRATO non vengono nemmeno catturati. Il nome si ricostruisce togliendo
 * dalla finestra tutto il rumore (codice, verbale, SSD, AA/data/crediti/voto,
 * numero di riga).
 */
import type { Grade, IsoDate, LibrettoEntry } from "./types";
import { stableId } from "@/lib/sync/util";

export interface DelphiPdfResult {
  entries: LibrettoEntry[];
  imported: number;
  skipped: number;
  rejected: { courseName: string; reason: string }[];
  errors: string[];
}

/** Coda valida: [AA] data crediti voto. AA opzionale (a volte non è adiacente);
 *  i campi possono essere incollati senza spazi. Voto solo NN/30 o IDONEO. */
const TAIL_SOURCE = String.raw`(20\d{2}\/20\d{2})?\s*(\d{1,2}\/\d{1,2}\/20\d{2})\s*(\d{1,2}[.,]\d+)\s*(\d{1,2}\/30|30\s*L|30\s*e\s*lode|IDONE[AO])`;

const COURSE_CODE = /\b80\d{5}\b/g;

/** Righe di intestazione/piè di pagina del portale, da scartare prima di tutto. */
const FURNITURE =
  /^https?:\/\/|Portale Università|^\d{1,2}\/\d{1,2}\/\d{2,4},|^LOGOUT|^Versione:|^Studente:|^Matricola:|^Corso di Laurea:|^\(\*\)|^N\.|^verbale Da|^Attività$|^Note$|^Tipo$/i;

/** Da qui in poi è il riepilogo: si tronca. */
const FOOTER_START = /^(RENDIMENTO|Esami validi)/i;

function toIsoDate(ddmmyyyy: string): IsoDate {
  const [d, m, y] = ddmmyyyy.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function parseVoto(raw: string): Grade | undefined {
  const t = raw.toUpperCase().replace(/\s+/g, "");
  if (/30ELODE|30L/.test(t)) return { kind: "numeric", value: 30, laude: true };
  const m = /^(\d{1,2})\/30$/.exec(t);
  if (m) {
    const v = Number(m[1]);
    return v >= 18 && v <= 30 ? { kind: "numeric", value: v, laude: false } : undefined;
  }
  if (/IDONE[AO]/.test(t)) return { kind: "pass" };
  return undefined;
}

const TITLE_LOWER = new Set([
  "e", "ed", "di", "dei", "del", "dello", "della", "con", "a", "ai", "alla",
  "in", "il", "lo", "la", "le", "i", "gli", "per", "da",
]);

/** UPPERCASE Delphi → "Title Case" leggibile: minuscole sulle congiunzioni,
 *  token con cifre (B2) e singole lettere (D) lasciati come sono. */
function titleCase(words: string[]): string {
  return words
    .map((w, i) => {
      if (/\d/.test(w)) return w; // B2, …
      const acronym = /^\(([A-Z]{2,})\)$/.exec(w);
      if (acronym) return acronym[1]; // "(AAS)" → "AAS"
      const lw = w.toLowerCase();
      if (i > 0 && TITLE_LOWER.has(lw)) return lw; // congiunzione (anche "e")
      if (w.replace(/[^A-Za-zÀ-ÿ]/g, "").length === 1) return w.toUpperCase(); // D
      return lw.replace(/[a-zà-ÿ]/, (c) => c.toUpperCase()); // prima lettera
    })
    .join(" ");
}

/** Ricostruisce il nome dalla finestra del record, togliendo ogni rumore. */
function cleanName(window: string): string {
  const s = ` ${window} `
    .replace(COURSE_CODE, " ") // codice insegnamento (80……)
    .replace(/\b0\d{6}\b/g, " ") // numero di verbale (0……)
    .replace(/\b[A-Z]{1,6}(?:-[A-Z]{1,6})?\s*\/\s*\d{2}/gi, " ") // SSD: INF/01, MAT/02, L-LIN/12… (anche incollati all'AA)
    .replace(/\b[A-Z]{1,5}-(?=\s)/g, " ") // frammenti SSD spezzati: "SMFN-", "ING-", "L-"
    .replace(/20\d{2}\s*\/\s*20\d{2}/g, " ") // AA
    .replace(/\d{1,2}\/\d{1,2}\/20\d{2}/g, " ") // data
    .replace(/\d{1,2}[.,]\d+/g, " ") // crediti
    .replace(/\b\d{1,2}\s*\/\s*30\b/g, " ") // voto NN/30
    .replace(/\bIDONE[AO]\b/gi, " ")
    .replace(/\b(?:RESPINTO|RITIRATO|ASSENTE)\b/gi, " ")
    .replace(/-{2,}/g, " ") // celle vuote "---"
    .replace(/\b\d{1,2}\b/g, " ") // numero di riga
    .replace(/\bSMFN\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // La stampa ripete il nome (colonna nome + colonna "tipo attività"),
  // interlacciato: tieni la prima occorrenza di ogni parola "piena"
  // (le congiunzioni possono ripetersi legittimamente).
  const seen = new Set<string>();
  const words: string[] = [];
  for (const w of s.split(" ").filter(Boolean)) {
    const key = w.toLowerCase();
    if (!TITLE_LOWER.has(key)) {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    words.push(w);
  }
  // niente congiunzioni penzolanti a inizio/fine ("… Tipo D di").
  while (words.length && TITLE_LOWER.has(words[0].toLowerCase())) words.shift();
  while (words.length && TITLE_LOWER.has(words[words.length - 1].toLowerCase()))
    words.pop();
  return titleCase(words).trim();
}

export function parseDelphiPdfText(text: string): DelphiPdfResult {
  // 1. Filtra le righe di contorno e tronca al riepilogo.
  const lines: string[] = [];
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (FOOTER_START.test(line)) break;
    if (FURNITURE.test(line)) continue;
    lines.push(line);
  }
  const flat = lines.join(" ").replace(/\s+/g, " ");

  // 2. Segmenta per codice insegnamento: ogni finestra = un tentativo d'esame.
  const codes = [...flat.matchAll(COURSE_CODE)].map((m) => m.index ?? 0);
  const entries: LibrettoEntry[] = [];
  const rejected: { courseName: string; reason: string }[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (let i = 0; i < codes.length; i++) {
    const window = flat.slice(codes[i], codes[i + 1] ?? flat.length);

    const tail = new RegExp(TAIL_SOURCE, "i").exec(window);
    if (!tail) continue; // nessun voto valido in questa finestra (es. RESPINTO)

    const [, aaRaw, dateRaw, creditiRaw, votoRaw] = tail;
    const grade = parseVoto(votoRaw);
    if (!grade) continue;

    const date = toIsoDate(dateRaw);
    const academicYear = (
      aaRaw ?? window.match(/20\d{2}\s*\/\s*20\d{2}/)?.[0] ?? ""
    ).replace(/\s+/g, "");
    const cfu = Math.round(parseFloat(creditiRaw.replace(",", ".")));
    const courseName = cleanName(window);

    if (!courseName) {
      skipped++;
      errors.push(`Esame senza nome riconoscibile (voto ${votoRaw}).`);
      continue;
    }
    if (!Number.isFinite(cfu) || cfu < 1) {
      skipped++;
      errors.push(`Crediti non validi per "${courseName}".`);
      continue;
    }

    entries.push({
      id: stableId("delphi-pdf", flat.slice(codes[i], codes[i] + 7), date),
      courseName,
      cfu,
      grade,
      date,
      ...(academicYear ? { academicYear } : {}),
      ...(grade.kind === "pass" ? { excludeFromAverage: true } : {}),
      source: "manual",
    });
  }

  // Dedup per id (codice+data).
  const byId = new Map(entries.map((e) => [e.id, e]));
  const deduped = [...byId.values()];

  return {
    entries: deduped,
    imported: deduped.length,
    skipped,
    rejected,
    errors,
  };
}

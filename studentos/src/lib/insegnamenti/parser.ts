/**
 * Manifesto HTML → `Insegnamento[]` parser.
 *
 * Pure and deterministic: given the same HTML it always returns the same rows,
 * with NO ids, NO ateneo/corso, NO timestamps — those identity/provenance
 * fields are stamped by `sync.ts` once it knows the corso. Every row is tagged
 * `inserito_manualmente: false` (it came from the ateneo, not the student).
 *
 * Uses ONLY the native `DOMParser` (no library) → this module runs CLIENT-SIDE
 * (the browser has `DOMParser`; Node does not). The server route only fetches
 * the raw HTML and hands it here via the client.
 *
 * Robust by design: a manifesto table can have any column order, missing cells,
 * decorative rows, or no `<th>` at all. We locate columns by header text, skip
 * rows that don't yield a name + a parseable CFU value, and never throw on a
 * malformed cell.
 */
import type { Insegnamento, TipoInsegnamento } from "@/types/insegnamenti";

type ColKey =
  | "nome"
  | "codice"
  | "settore"
  | "cfu"
  | "semestre"
  | "docente"
  | "propedeuticita"
  | "anno"
  | "tipo";

type ColMap = Partial<Record<ColKey, number>>;

/**
 * Header-text → column patterns, **most specific first**. `nome` is last and
 * deliberately broad: a header claims the first pattern it matches that isn't
 * already taken, so "Codice"/"SSD"/"Docente" win their cells before the generic
 * name matcher sweeps up "Insegnamento" / "Denominazione".
 */
const HEADER_PATTERNS: [ColKey, RegExp][] = [
  ["cfu", /\bcfu\b|cred/i],
  ["codice", /codic/i],
  ["settore", /\bssd\b|settore/i],
  ["docente", /docent|titolar/i],
  ["semestre", /semestr|period/i],
  ["propedeuticita", /propedeutic/i],
  ["anno", /\banno\b/i],
  ["tipo", /tipolog|\btipo\b|ambito|attivit/i],
  ["nome", /insegnam|denominaz|materia|\bnome\b|disciplin/i],
];

const norm = (s: string | null | undefined): string => (s ?? "").replace(/\s+/g, " ").trim();

/** First `<tr>` containing a `<th>`, else the first row (td-only headers). */
function headerRowOf(table: Element): Element | undefined {
  const rows = Array.from(table.querySelectorAll("tr"));
  return rows.find((r) => r.querySelector("th")) ?? rows[0];
}

function mapColumns(headerRow: Element | undefined): ColMap {
  const map: ColMap = {};
  if (!headerRow) return map;
  const cells = Array.from(headerRow.querySelectorAll("th, td"));
  cells.forEach((cell, index) => {
    const text = norm(cell.textContent);
    for (const [key, re] of HEADER_PATTERNS) {
      if (map[key] === undefined && re.test(text)) {
        map[key] = index;
        break;
      }
    }
  });
  return map;
}

/** "6", "6,0", "6 CFU", "6/9" → 6. Undefined when no number is present. */
function parseCfu(raw: string): number | undefined {
  const m = raw.replace(",", ".").match(/\d+(?:\.\d+)?/);
  if (!m) return undefined;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : undefined;
}

/** "1° semestre" → 1; "Annuale" → "Annuale"; "" → undefined. */
function parseSemestre(raw: string): number | string | undefined {
  if (!raw) return undefined;
  const m = raw.match(/\b([12])\b/);
  return m ? Number(m[1]) : raw;
}

/** Split a propedeuticità cell on commas / semicolons / slashes. */
function parseList(raw: string): string[] | undefined {
  if (!raw) return undefined;
  const parts = raw
    .split(/[;,/]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function inferTipo(tipoCell: string, nome: string): TipoInsegnamento {
  const hay = `${tipoCell} ${nome}`.toLowerCase();
  if (/scelt|opzional|elective|libero/.test(hay)) return "scelta";
  if (/tirocin|stage|prova final|tesi|lingua|abilit|altre attività|crediti liberi/.test(hay)) {
    return "altro";
  }
  return "obbligatorio";
}

/**
 * Parse every manifesto-shaped table in `html`. Returns content-only
 * `Insegnamento` rows (identity fields blank, filled by `sync.ts`).
 */
export function parseManifestoHTML(html: string): Insegnamento[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out: Insegnamento[] = [];
  const seen = new Set<string>();

  for (const table of Array.from(doc.querySelectorAll("table"))) {
    const headerRow = headerRowOf(table);
    const cols = mapColumns(headerRow);
    // Not a manifesto table unless it has both a name and a CFU column.
    if (cols.nome === undefined || cols.cfu === undefined) continue;

    const dataRows = Array.from(table.querySelectorAll("tr")).filter(
      (r) => r !== headerRow && r.querySelector("td"),
    );

    for (const row of dataRows) {
      const cells = Array.from(row.querySelectorAll("td"));
      if (!cells.length) continue;
      const at = (i: number | undefined): string =>
        i === undefined ? "" : norm(cells[i]?.textContent);

      const nome = at(cols.nome);
      if (!nome) continue;
      const cfu = parseCfu(at(cols.cfu));
      if (cfu === undefined) continue;

      const codice = at(cols.codice) || undefined;
      const dedupeKey = (codice ?? nome).toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      out.push({
        id: "",
        ateneo_id: "",
        corso_id: "",
        nome,
        codice,
        settore: at(cols.settore) || undefined,
        cfu,
        semestre: parseSemestre(at(cols.semestre)),
        docente: at(cols.docente) || undefined,
        propedeuticita: parseList(at(cols.propedeuticita)),
        anno: at(cols.anno) || undefined,
        tipo: inferTipo(at(cols.tipo), nome),
        inserito_manualmente: false,
        created_at: "",
        updated_at: "",
      });
    }
  }
  return out;
}

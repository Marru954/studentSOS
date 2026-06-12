/**
 * Pure parser for the Delphi "libretto" HTML table → LibrettoEntry[].
 * Kept separate from the network flow so it can be unit-tested against a
 * captured fixture (the live page needs real credentials we never store).
 *
 * Delphi's markup is legacy table soup with no stable ids, so this is
 * deliberately heuristic: for each data row we look for a grade-shaped cell,
 * a CFU-shaped cell, a date, and take the longest text as the course name.
 */
import * as cheerio from "cheerio";
import type { Grade, LibrettoEntry } from "@/lib/domain/types";
import { italianDateToIso, stableId } from "@/lib/sync/util";

/** "30 e lode" / "30L" / "28" / "IDONEO" / "APPROVATO" → Grade | undefined. */
export function parseGrade(raw: string): Grade | undefined {
  const t = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  if (/idone|approv|superat/.test(t)) return { kind: "pass" };
  // 18–30, not part of a longer number; a trailing letter (the "L" of 30L)
  // is allowed, so a plain \b boundary won't do.
  const m = /(?<!\d)(1[89]|2\d|30)(?!\d)/.exec(t);
  if (!m) return undefined;
  const value = Number(m[1]);
  const laude = value === 30 && /lode|30\s*l|e\s*l\b/.test(t);
  return { kind: "numeric", value, laude };
}

function parseDate(raw: string): string | undefined {
  const m = /\b(\d{2})[/.-](\d{2})[/.-](\d{4})\b/.exec(raw);
  return m ? italianDateToIso(`${m[1]}-${m[2]}-${m[3]}`) : undefined;
}

/** CFU is a small integer cell (1–30) that is NOT the grade cell. */
function parseCfu(cells: string[], gradeIdx: number): number | undefined {
  for (let i = 0; i < cells.length; i++) {
    if (i === gradeIdx) continue;
    const m = /^\s*(\d{1,2})\s*$/.exec(cells[i]);
    if (m) {
      const n = Number(m[1]);
      if (n >= 1 && n <= 30) return n;
    }
  }
  return undefined;
}

export function parseLibretto(html: string): LibrettoEntry[] {
  const $ = cheerio.load(html);
  const entries = new Map<string, LibrettoEntry>();

  $("tr").each((_, tr) => {
    const cells = $(tr)
      .find("td")
      .toArray()
      .map((td) => $(td).text().replace(/\s+/g, " ").trim());
    if (cells.length < 3) return;

    const gradeIdx = cells.findIndex((c) => parseGrade(c) !== undefined);
    if (gradeIdx === -1) return;
    const grade = parseGrade(cells[gradeIdx])!;

    const date = cells.map(parseDate).find(Boolean);
    const cfu = parseCfu(cells, gradeIdx) ?? 0;

    // course name: the longest mostly-alphabetic cell that isn't the grade
    const courseName = cells
      .filter((_, i) => i !== gradeIdx)
      .filter((c) => /[a-zà-ù]{4,}/i.test(c) && !parseDate(c))
      .sort((a, b) => b.length - a.length)[0];
    if (!courseName) return;

    const id = stableId("delphi", courseName, date);
    entries.set(id, {
      id,
      courseName,
      cfu,
      grade,
      date: date ?? "",
      source: "delphi",
    });
  });

  return [...entries.values()];
}

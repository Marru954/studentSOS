/** Helper per l'anno accademico (formato "2023/2024"). L'anno accademico
 *  inizia a settembre: da settembre in poi è `${y}/${y+1}`. */

export function currentAcademicYear(now = new Date()): string {
  const y = now.getFullYear();
  return now.getMonth() >= 8 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
}

/** Lista discendente di anni accademici per il dropdown (corrente + indietro). */
export function academicYearOptions(now = new Date(), count = 9): string[] {
  const start = Number(currentAcademicYear(now).slice(0, 4));
  return Array.from({ length: count }, (_, i) => `${start - i}/${start - i + 1}`);
}

/** Normalizza varianti ("2023-2024", "2023/24", "2023") → "2023/2024". */
export function normalizeAcademicYear(raw: string): string | undefined {
  const s = raw.trim();
  if (!s) return undefined;
  const pair = /^(\d{4})\s*[/\-]\s*(\d{2,4})$/.exec(s);
  if (pair) {
    const a = Number(pair[1]);
    const b =
      pair[2].length === 2 ? Number(`${pair[1].slice(0, 2)}${pair[2]}`) : Number(pair[2]);
    return `${a}/${b}`;
  }
  const single = /^(\d{4})$/.exec(s);
  if (single) {
    const a = Number(single[1]);
    return `${a}/${a + 1}`;
  }
  return undefined;
}

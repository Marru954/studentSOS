/**
 * Pure date helpers behind the masked DateField (gg/mm/aaaa ↔ ISO). Run with:
 *   ./node_modules/.bin/tsx tests/dateField.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { formatItDate, parseItDate } from "../src/lib/format";

test("formatItDate: ISO → gg/mm/aaaa; non-ISO/empty → ''", () => {
  assert.equal(formatItDate("2026-06-20"), "20/06/2026");
  assert.equal(formatItDate("2027-01-09"), "09/01/2027");
  assert.equal(formatItDate(""), "");
  assert.equal(formatItDate("nope"), "");
});

test("parseItDate: gg/mm/aaaa → ISO, accepts / - . separators", () => {
  assert.equal(parseItDate("20/06/2026"), "2026-06-20");
  assert.equal(parseItDate("9/1/2027"), "2027-01-09");
  assert.equal(parseItDate("20-06-2026"), "2026-06-20");
  assert.equal(parseItDate("15.02.2026"), "2026-02-15");
});

test("parseItDate: rejects impossible/incomplete dates", () => {
  assert.equal(parseItDate("31/02/2026"), null); // 31 Feb
  assert.equal(parseItDate("20/13/2026"), null); // month 13
  assert.equal(parseItDate("00/06/2026"), null); // day 0
  assert.equal(parseItDate("20/06"), null); // incomplete
  assert.equal(parseItDate("2026-06-20"), null); // ISO, not IT
  assert.equal(parseItDate(""), null);
});

test("round-trip ISO ↔ display", () => {
  assert.equal(formatItDate(parseItDate("20/06/2026")!), "20/06/2026");
  assert.equal(parseItDate(formatItDate("2026-06-20"))!, "2026-06-20");
});

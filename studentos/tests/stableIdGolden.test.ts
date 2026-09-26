import assert from "node:assert/strict";
import { test } from "node:test";
import { stableId } from "@/lib/sync/util";

// Valori di riferimento calcolati PRIMA di sostituire il NUL letterale in
// util.ts con l'escape "\0": gli id sono chiavi in IndexedDB e nel diff delle
// notifiche, quindi non devono cambiare tra una versione e l'altra.
const GOLDEN: [(string | number | undefined)[], string][] = [
  [["corso-1", "lezione", 42], "1gs0z0knzjw"],
  [["orario", undefined, "2026"], "vpi2f03p5a"],
  [["a", "b"], "wmao3leoz1"],
  [["ab"], "xb319mxp3m"],
  [["x"], "49fp6jq86t"],
  [[""], "wvjl67o803"],
  [["uniroma2-orario-anno-2", "Analisi I", "2026-10-12T09:00", "Aula 3"], "2bjocenw4cc"],
  [[1, 2, 3], "fwu8vjuwsl"],
];

test("stableId produce gli stessi id di riferimento (id stabili tra versioni)", () => {
  for (const [parts, expected] of GOLDEN) {
    assert.equal(stableId(...parts), expected, JSON.stringify(parts));
  }
});

test("stableId separa le parti con NUL: ['a','b'] ≠ ['ab']", () => {
  assert.notEqual(stableId("a", "b"), stableId("ab"));
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { channelOf, channelsOf, filterByChannel } from "@/lib/domain/channels";

const ev = (courseName: string) => ({ courseName });

test("channelOf: legge il tag finale tra parentesi, in maiuscolo", () => {
  assert.equal(channelOf("GEOMETRIA (SG1:A-I)"), "SG1:A-I");
  assert.equal(channelOf("geometria ( sg2:j-z ) "), "SG2:J-Z");
  assert.equal(channelOf("FISICA"), null);
  assert.equal(channelOf("FISICA (parte 1) II"), null); // tag non finale
});

test("channelsOf: canali distinti ordinati con conteggio; vuoto senza tag", () => {
  const events = [ev("A (SG2:J-Z)"), ev("B (SG1:A-I)"), ev("C (SG1:A-I)"), ev("D")];
  assert.deepEqual(channelsOf(events), [
    { channel: "SG1:A-I", count: 2 },
    { channel: "SG2:J-Z", count: 1 },
  ]);
  assert.deepEqual(channelsOf([ev("D")]), []);
});

test("filterByChannel: canale scelto + lezioni senza tag; null = tutto", () => {
  const events = [ev("A (SG1:A-I)"), ev("B (SG2:J-Z)"), ev("C")];
  assert.deepEqual(filterByChannel(events, "SG1:A-I").map((e) => e.courseName), [
    "A (SG1:A-I)",
    "C",
  ]);
  assert.equal(filterByChannel(events, null).length, 3);
});

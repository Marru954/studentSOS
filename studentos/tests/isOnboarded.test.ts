import assert from "node:assert/strict";
import { test } from "node:test";
import { isOnboarded } from "@/lib/supabase/isOnboarded";

test("null / undefined profile is not onboarded", () => {
  assert.equal(isOnboarded(null), false);
  assert.equal(isOnboarded(undefined), false);
});

test("partial profile (only preset_id) is not onboarded", () => {
  assert.equal(isOnboarded({ preset_id: "uniroma2" }), false);
});

test("partial profile (preset_id + programme, no year) is not onboarded", () => {
  assert.equal(
    isOnboarded({ preset_id: "uniroma2", programme: "Informatica" }),
    false,
  );
});

test("partial profile (programme + year, no preset) is not onboarded", () => {
  assert.equal(
    isOnboarded({ programme: "Informatica", year_of_study: 1 }),
    false,
  );
});

test("complete profile is onboarded", () => {
  assert.equal(
    isOnboarded({
      preset_id: "uniroma2",
      programme: "Informatica",
      year_of_study: 1,
    }),
    true,
  );
});

test("undefined fields are treated as absent", () => {
  assert.equal(
    isOnboarded({
      preset_id: undefined,
      programme: undefined,
      year_of_study: undefined,
    }),
    false,
  );
});

test("explicit null fields are treated as absent", () => {
  assert.equal(
    isOnboarded({ preset_id: null, programme: null, year_of_study: null }),
    false,
  );
});

test("empty-string preset_id / programme count as not set", () => {
  assert.equal(
    isOnboarded({ preset_id: "", programme: "", year_of_study: 1 }),
    false,
  );
  assert.equal(
    isOnboarded({ preset_id: "uniroma2", programme: "", year_of_study: 1 }),
    false,
  );
});

test("year_of_study of 0 counts as present (!= null)", () => {
  assert.equal(
    isOnboarded({
      preset_id: "uniroma2",
      programme: "Informatica",
      year_of_study: 0,
    }),
    true,
  );
});

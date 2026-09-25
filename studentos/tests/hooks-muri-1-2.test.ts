/**
 * Tests deterministici per gli hook PreToolUse muri #1 (file intoccabili)
 * e #2 (niente merge/push diretto su main).
 *
 * Stesso pattern di hooks-muri.test.ts: processi figli, stdin/stdout,
 * CLAUDE_HOOK_TEST_BRANCH al posto di git.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { test } from "node:test";

const HOOKS_DIR = resolve(__dirname, "../scripts/hooks");
const HOOK_PROTECTED = resolve(HOOKS_DIR, "check-protected-files.mjs");

function runHook(
  scriptPath: string,
  payload: object,
  opts: { branch?: string; env?: Record<string, string> } = {}
): { exitCode: number; stdout: string } {
  const result = spawnSync("node", [scriptPath], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    env: {
      ...process.env,
      ALLOW_PROTECTED_EDIT: "",
      CLAUDE_HOOK_TEST_BRANCH: opts.branch ?? "fix/qualcosa",
      ...opts.env,
    },
    timeout: 8000,
  });
  return { exitCode: result.status ?? -1, stdout: result.stdout ?? "" };
}

function decision(stdout: string): { decision: string; reason?: string } | null {
  if (!stdout.trim()) return null;
  try { return JSON.parse(stdout); } catch { return null; }
}

// ─── MURO #1 — file intoccabili ──────────────────────────────────────────────

const PROTECTED = [
  "src/lib/storage/db.ts",
  "src/lib/sync/engine.ts",
  "src/lib/sync/adapters/easyacademy.ts",
  "package.json",
  "scripts/safe-merge.sh",
  "scripts/hooks/check-new-deps.mjs",
  "tests/hooks-muri.test.ts", // esistente (vedi pathOf)
];

// I file di tests/ sono protetti solo se esistono davvero: usa il path reale.
const pathOf = (rel: string) =>
  rel.startsWith("tests/") ? resolve(__dirname, "..", rel) : `/repo/studentos/${rel}`;

for (const rel of PROTECTED) {
  for (const tool of ["Edit", "Write"]) {
    test(`muro#1: blocca ${tool} su ${rel}`, () => {
      const r = runHook(HOOK_PROTECTED, { tool_name: tool, tool_input: { file_path: pathOf(rel) } });
      assert.equal(r.exitCode, 2);
      assert.equal(decision(r.stdout)?.decision, "block");
    });
  }
}

test("muro#1: blocca anche su branch normale e con path Windows", () => {
  const r = runHook(
    HOOK_PROTECTED,
    { tool_name: "Edit", tool_input: { file_path: "C:\\repo\\studentos\\src\\lib\\storage\\db.ts" } },
    { branch: "feature/x" }
  );
  assert.equal(r.exitCode, 2);
});

test("muro#1: ALLOW_PROTECTED_EDIT=1 sblocca", () => {
  const r = runHook(
    HOOK_PROTECTED,
    { tool_name: "Edit", tool_input: { file_path: "/repo/studentos/src/lib/storage/db.ts" } },
    { env: { ALLOW_PROTECTED_EDIT: "1" } }
  );
  assert.equal(r.exitCode, 0);
});

test("muro#1: consente l'hook stesso (niente autoblocco)", () => {
  const r = runHook(HOOK_PROTECTED, {
    tool_name: "Edit",
    tool_input: { file_path: "/repo/studentos/scripts/hooks/check-protected-files.mjs" },
  });
  assert.equal(r.exitCode, 0);
});

test("muro#1: consente file di sorgente normali", () => {
  for (const rel of ["src/components/Foo.tsx", "src/lib/sync/universities/unifi.ts", "docs/stato/STATO.md", "src/lib/storage/repo.ts"]) {
    const r = runHook(HOOK_PROTECTED, { tool_name: "Edit", tool_input: { file_path: `/repo/studentos/${rel}` } });
    assert.equal(r.exitCode, 0, rel);
  }
});

test("muro#1: consente un test NUOVO (non ancora esistente) in tests/", () => {
  const r = runHook(HOOK_PROTECTED, {
    tool_name: "Write",
    tool_input: { file_path: "/repo/studentos/tests/questo-file-non-esiste-ancora.test.ts" },
  });
  assert.equal(r.exitCode, 0);
});

test("muro#1: non si confonde con node_modules né con altri tool", () => {
  assert.equal(
    runHook(HOOK_PROTECTED, { tool_name: "Edit", tool_input: { file_path: "/repo/studentos/node_modules/x/scripts/a.js" } }).exitCode,
    0
  );
  assert.equal(
    runHook(HOOK_PROTECTED, { tool_name: "Bash", tool_input: { command: "echo package.json" } }).exitCode,
    0
  );
});

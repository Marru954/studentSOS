/**
 * Tests deterministici per l'hook PreToolUse check-invented-data (unico muro attivo).
 *
 * Gli hook girano come processi figli separati (leggono stdin, scrivono stdout).
 * La env CLAUDE_HOOK_TEST_BRANCH sovrascrive git per determinare la modalità.
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { test } from "node:test";

const HOOKS_DIR = resolve(__dirname, "../scripts/hooks");
const HOOK_DATA = resolve(HOOKS_DIR, "check-invented-data.mjs");

function runHook(
  scriptPath: string,
  payload: object,
  branch: string
): { exitCode: number; stdout: string; stderr: string } {
  const result = spawnSync("node", [scriptPath], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    env: { ...process.env, CLAUDE_HOOK_TEST_BRANCH: branch },
    timeout: 8000,
  });
  return {
    exitCode: result.status ?? -1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function parseDecision(stdout: string): { decision: string; reason?: string; additionalContext?: string } | null {
  if (!stdout.trim()) return null;
  try { return JSON.parse(stdout); } catch { return null; }
}

// ─── HOOK A — MURO #4 (no dati inventati) ────────────────────────────────────

test("hook-A: ignora file fuori dai path monitorati", () => {
  const r = runHook(HOOK_DATA, {
    tool_name: "Edit",
    tool_input: {
      file_path: "src/components/Foo.tsx",
      old_string: "",
      new_string: 'corso: "B999"',
    },
  }, "auto/feature-test");
  assert.equal(r.exitCode, 0);
  assert.equal(r.stdout, "");
});

test("hook-A: ignora Edit senza nuovi codici EA o URL", () => {
  const r = runHook(HOOK_DATA, {
    tool_name: "Edit",
    tool_input: {
      file_path: "src/lib/sync/universities/unifi.ts",
      old_string: "// commento\n",
      new_string: "// commento aggiornato\n",
    },
  }, "auto/feature-test");
  assert.equal(r.exitCode, 0);
  assert.equal(r.stdout, "");
});

test("hook-A [STRICT]: blocca nuovo corso EA in branch auto/", () => {
  const r = runHook(HOOK_DATA, {
    tool_name: "Edit",
    tool_input: {
      file_path: "src/lib/sync/universities/unifi.ts",
      old_string: '  programme: "Fisica",\n',
      new_string:
        '  programme: "Fisica",\n' +
        '  { year: 1, corso: "B999", anno2: ["GEN|1"] },\n',
    },
  }, "auto/test-invented");
  assert.equal(r.exitCode, 2, "deve uscire con 2 (block)");
  const dec = parseDecision(r.stdout);
  assert.ok(dec, "deve emettere JSON");
  assert.equal(dec?.decision, "block");
  assert.match(dec?.reason ?? "", /Muro #4/);
  assert.match(dec?.reason ?? "", /Vietato in full-auto/);
});

test("hook-A [STRICT]: blocca nuovo anno2 EA in branch auto/", () => {
  const r = runHook(HOOK_DATA, {
    tool_name: "Edit",
    tool_input: {
      file_path: "src/lib/sync/universities/uniroma2.ts",
      old_string: "// esistente\n",
      new_string: '// esistente\n  anno2: ["NUOVO|1"],\n',
    },
  }, "auto/another");
  assert.equal(r.exitCode, 2);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "block");
});

test("hook-A [STRICT]: blocca nuovo URL https in discovery.ts — branch auto/", () => {
  const r = runHook(HOOK_DATA, {
    tool_name: "Write",
    tool_input: {
      file_path: "src/lib/insegnamenti/discovery.ts",
      content: 'const url = "https://www.ateneo-inventato.it/insegnamenti";',
    },
  }, "auto/test");
  assert.equal(r.exitCode, 2);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "block");
  assert.match(dec?.reason ?? "", /URL/i);
});

test("hook-A [WARN]: consente + additionalContext su branch supervisionato", () => {
  const r = runHook(HOOK_DATA, {
    tool_name: "Edit",
    tool_input: {
      file_path: "src/lib/sync/universities/unifi.ts",
      old_string: '  programme: "Fisica",\n',
      new_string:
        '  programme: "Fisica",\n' +
        '  { year: 1, corso: "B999", anno2: ["GEN|1"] },\n',
    },
  }, "feature/my-branch");
  assert.equal(r.exitCode, 0, "deve uscire 0 (warn, non blocca)");
  const dec = parseDecision(r.stdout);
  assert.ok(dec, "deve emettere JSON");
  assert.equal(dec?.decision, "allow");
  assert.match(dec?.additionalContext ?? "", /Muro #4 WARN/);
});

test("hook-A [WARN]: ignora tool diversi da Write/Edit", () => {
  const r = runHook(HOOK_DATA, {
    tool_name: "Bash",
    tool_input: {
      command: 'grep -r "corso:" src/lib/sync/universities/',
    },
  }, "auto/test");
  assert.equal(r.exitCode, 0);
  assert.equal(r.stdout, "");
});

test("hook-A: ignora righe già presenti nell'old_string (non è contenuto nuovo)", () => {
  // Il campo corso: "B377" è già in old_string → non è "nuovo"
  const existing = '  { year: 1, corso: "B377", anno2: ["F033|1"] },\n';
  const r = runHook(HOOK_DATA, {
    tool_name: "Edit",
    tool_input: {
      file_path: "src/lib/sync/universities/unifi.ts",
      old_string: existing,
      new_string: existing + "  // solo commento aggiunto\n",
    },
  }, "auto/test");
  assert.equal(r.exitCode, 0, "riga invariata non deve triggerare il blocco");
});

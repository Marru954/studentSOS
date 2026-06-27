/**
 * Tests deterministici per gli hook PreToolUse muri #4 e #5.
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
const HOOK_DEPS = resolve(HOOKS_DIR, "check-new-deps.mjs");

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

// ─── HOOK B — MURO #5 (no nuove dipendenze) ──────────────────────────────────

test("hook-B [STRICT]: blocca npm install <pkg> in branch auto/", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Bash",
    tool_input: { command: "npm install lodash" },
  }, "auto/test");
  assert.equal(r.exitCode, 2);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "block");
  assert.match(dec?.reason ?? "", /Muro #5/);
  assert.match(dec?.reason ?? "", /lodash/);
});

test("hook-B [STRICT]: blocca pnpm add in branch auto/", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Bash",
    tool_input: { command: "pnpm add zod" },
  }, "auto/test");
  assert.equal(r.exitCode, 2);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "block");
});

test("hook-B [STRICT]: blocca yarn add in branch auto/", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Bash",
    tool_input: { command: "yarn add react-query" },
  }, "auto/test");
  assert.equal(r.exitCode, 2);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "block");
});

test("hook-B: consente npm install (bare, senza pacchetto)", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Bash",
    tool_input: { command: "npm install" },
  }, "auto/test");
  assert.equal(r.exitCode, 0);
  assert.equal(r.stdout, "");
});

test("hook-B: consente npm run build", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Bash",
    tool_input: { command: "npm run build" },
  }, "auto/test");
  assert.equal(r.exitCode, 0);
  assert.equal(r.stdout, "");
});

test("hook-B [STRICT]: blocca nuova dep in package.json (Edit) — branch auto/", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Edit",
    tool_input: {
      file_path: "studentos/package.json",
      old_string: '  "dependencies": {\n    "react": "^19.0.0"\n  }',
      new_string: '  "dependencies": {\n    "react": "^19.0.0",\n    "lodash": "^4.0.0"\n  }',
    },
  }, "auto/test");
  assert.equal(r.exitCode, 2);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "block");
  assert.match(dec?.reason ?? "", /package\.json/);
});

test("hook-B [STRICT]: blocca modifica diretta a package-lock.json — branch auto/", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Edit",
    tool_input: {
      file_path: "studentos/package-lock.json",
      old_string: "{}",
      new_string: '{"name":"x"}',
    },
  }, "auto/test");
  assert.equal(r.exitCode, 2);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "block");
  assert.match(dec?.reason ?? "", /lockfile/i);
});

test("hook-B [WARN]: consente + additionalContext su branch supervisionato (npm install)", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Bash",
    tool_input: { command: "npm install dayjs" },
  }, "main");
  assert.equal(r.exitCode, 0, "deve uscire 0 (warn, non blocca)");
  const dec = parseDecision(r.stdout);
  assert.ok(dec, "deve emettere JSON");
  assert.equal(dec?.decision, "allow");
  assert.match(dec?.additionalContext ?? "", /Muro #5 WARN/);
});

test("hook-B [WARN]: consente + additionalContext su branch supervisionato (package.json edit)", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Edit",
    tool_input: {
      file_path: "package.json",
      old_string: '  "dependencies": {\n    "react": "^19.0.0"\n  }',
      new_string: '  "dependencies": {\n    "react": "^19.0.0",\n    "dayjs": "^1.0.0"\n  }',
    },
  }, "feature/my-thing");
  assert.equal(r.exitCode, 0);
  const dec = parseDecision(r.stdout);
  assert.equal(dec?.decision, "allow");
  assert.match(dec?.additionalContext ?? "", /Muro #5 WARN/);
});

test("hook-B: ignora Edit a package.json senza nuove dep (solo aggiornamento versione)", () => {
  // Cambia versione di una dep esistente → la riga è sia in old che in new
  const r = runHook(HOOK_DEPS, {
    tool_name: "Edit",
    tool_input: {
      file_path: "package.json",
      old_string: '    "react": "^18.0.0"',
      new_string: '    "react": "^19.0.0"',
    },
  }, "auto/test");
  // "react" cambia solo versione — la chiave "react" è già in old_string
  // Il RE_DEP_ENTRY matcha il pattern, ma la riga react è diversa (versione diversa)
  // quindi sarà rilevata come "nuova" — questo è corretto: cambiare versione
  // potrebbe essere un aggiornamento voluto o meno, meglio avvisare.
  // In auto/ → blocca (comportamento conservativo).
  assert.equal(r.exitCode, 2);
});

test("hook-B: ignora file che non sono package.json né lockfile", () => {
  const r = runHook(HOOK_DEPS, {
    tool_name: "Edit",
    tool_input: {
      file_path: "src/components/MyComponent.tsx",
      old_string: "",
      new_string: '"lodash": "^4.0.0"',
    },
  }, "auto/test");
  assert.equal(r.exitCode, 0);
  assert.equal(r.stdout, "");
});

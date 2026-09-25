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
const HOOK_MAIN = resolve(HOOKS_DIR, "check-main-protection.mjs");

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
  for (const tool of ["Edit", "Write", "NotebookEdit"]) {
    test(`muro#1: blocca ${tool} su ${rel}`, () => {
      const input = tool === "NotebookEdit" ? { notebook_path: pathOf(rel) } : { file_path: pathOf(rel) };
      const r = runHook(HOOK_PROTECTED, { tool_name: tool, tool_input: input });
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

// ─── MURO #2 — niente merge / push diretto su main ───────────────────────────

const bash = (command: string) => ({ tool_name: "Bash", tool_input: { command } });

const BLOCKED_CMDS = [
  "git merge feature/x",
  "git merge --no-ff origin/main",
  "git -C studentos merge foo",
  "git fetch && git merge origin/main",
  "git push origin main",
  "git push -u origin HEAD:main",
  "git push origin +main",
  "git push origin fix/x:main",
  "git push origin HEAD:refs/heads/main",
  "git push --force origin main",
  "FOO=1 git push origin main",
  'bash -c "git merge x"',
];

for (const cmd of BLOCKED_CMDS) {
  test(`muro#2: blocca \`${cmd}\``, () => {
    const r = runHook(HOOK_MAIN, bash(cmd));
    assert.equal(r.exitCode, 2);
    assert.equal(decision(r.stdout)?.decision, "block");
  });
}

test("muro#2: nessun override via env (ALLOW_PROTECTED_EDIT, ALLOW_*)", () => {
  const r = runHook(HOOK_MAIN, bash("git push origin main"), {
    env: { ALLOW_PROTECTED_EDIT: "1", ALLOW_UNVERIFIED_URLS: "1", ALLOW_NEW_DEPS: "1" },
  });
  assert.equal(r.exitCode, 2);
});

test("muro#2: blocca `git push` senza refspec solo se si è su main", () => {
  assert.equal(runHook(HOOK_MAIN, bash("git push"), { branch: "main" }).exitCode, 2);
  assert.equal(runHook(HOOK_MAIN, bash("git push origin"), { branch: "main" }).exitCode, 2);
  assert.equal(runHook(HOOK_MAIN, bash("git push"), { branch: "fix/qualcosa" }).exitCode, 0);
});

const ALLOWED_CMDS = [
  "git push origin fix/qualcosa",
  "git push -u origin HEAD",
  "git push origin main-fix",
  "git push origin feature/main",
  "git push origin fix/x:fix/x",
  "bash scripts/safe-merge.sh",
  "./scripts/safe-merge.sh",
  "DRY_RUN=1 SKIP_GATE=1 ./scripts/safe-merge.sh",
  "git status && git log --oneline",
  "git checkout main",
  "git fetch origin main",
  "git rebase origin/main",
  "git branch --merged",
  'git commit -m "fix: git merge e git push origin main non più diretti"',
  "git commit -F - <<'EOF'\nnote: git merge origin/main\ngit push origin main\nEOF",
  "echo git merge foo",
  "npm run build",
];

for (const cmd of ALLOWED_CMDS) {
  test(`muro#2: consente \`${cmd.split("\n")[0]}\``, () => {
    const r = runHook(HOOK_MAIN, bash(cmd));
    assert.equal(r.exitCode, 0, r.stdout);
    assert.equal(r.stdout, "");
  });
}

test("muro#2: ignora tool diversi da Bash", () => {
  const r = runHook(HOOK_MAIN, { tool_name: "Edit", tool_input: { file_path: "x", new_string: "git merge" } });
  assert.equal(r.exitCode, 0);
});

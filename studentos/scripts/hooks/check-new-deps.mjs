#!/usr/bin/env node
/**
 * PreToolUse hook — Muro #5: niente nuove dipendenze npm non autorizzate.
 *
 * Rileva:
 *  - Write|Edit su package.json: nuove entry nette in dependencies/devDependencies.
 *  - Write|Edit su lockfile (package-lock.json, yarn.lock, pnpm-lock.yaml):
 *    qualsiasi modifica (i lockfile cambiano solo se cambia package.json).
 *  - Bash: `npm install <pkg>`, `pnpm add <pkg>`, `yarn add <pkg>` con pacchetto.
 *
 * Branch auto/* → STRICT blocca SEMPRE.
 * Branch supervisionato → WARN (consenti + additionalContext).
 *
 * Payload stdin: PreToolUse JSON di Claude Code.
 */

import { execFileSync } from 'node:child_process';

const LOCKFILES = /(?:^|[/\\])(?:package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/;
const PACKAGE_JSON = /(?:^|[/\\])package\.json$/;

// Pattern bash con pacchetto esplicito (no bare npm install)
const RE_NPM_INSTALL = /\bnpm\s+install\s+(?!--)[^\s&|;]/;
const RE_PNPM_ADD    = /\bpnpm\s+add\s+(?!--)[^\s&|;]/;
const RE_YARN_ADD    = /\byarn\s+add\s+(?!--)[^\s&|;]/;

function getBranch() {
  // Test seam: CLAUDE_HOOK_TEST_BRANCH bypasses git (used by automated tests)
  if (process.env.CLAUDE_HOOK_TEST_BRANCH) return process.env.CLAUDE_HOOK_TEST_BRANCH;
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      timeout: 3000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unknown';
  }
}

function addedLines(a, b) {
  const setA = new Set(a.split('\n'));
  return b.split('\n').filter(l => !setA.has(l)).join('\n');
}

// Rileva righe che sembrano entry di dipendenza: "pkg": "version"
const RE_DEP_ENTRY = /^\s*"(?!version|name|description|scripts|files|main|exports)[@a-zA-Z][^"]*"\s*:\s*"[^"]+"/;

function hasNewDepEntry(added) {
  return added.split('\n').some(l => RE_DEP_ENTRY.test(l));
}

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(2);
}

function warn(additionalContext) {
  process.stdout.write(JSON.stringify({ decision: 'allow', additionalContext }));
  process.exit(0);
}

function decide(isAuto, detail) {
  if (isAuto) {
    block(
      `Muro #5: ${detail}. ` +
      'Nuove dipendenze npm vietate in full-auto. ' +
      'Se la dep è necessaria, riporta come blocker e gestisci in sessione supervisionata.'
    );
  } else {
    warn(
      `[Muro #5 WARN] ${detail}. ` +
      'Il task non nomina esplicitamente questa dipendenza? ' +
      'Se non è richiesta dal task, non aggiungerla (CLAUDE.md muro #5). ' +
      'In modalità full-auto sarebbe bloccato.'
    );
  }
}

let raw = '';
process.stdin.on('data', c => { raw += c; });
process.stdin.on('end', () => {
  let payload;
  try { payload = JSON.parse(raw); } catch { process.exit(0); }

  const { tool_name, tool_input } = payload;

  const branch = getBranch();
  const isAuto = branch.startsWith('auto/') || branch === 'unknown';

  // --- Bash: npm install / pnpm add / yarn add con pacchetto ---
  if (tool_name === 'Bash') {
    const cmd = tool_input?.command ?? '';
    if (RE_NPM_INSTALL.test(cmd)) {
      decide(isAuto, `npm install con pacchetto rilevato: \`${cmd.slice(0, 80)}\``);
    }
    if (RE_PNPM_ADD.test(cmd)) {
      decide(isAuto, `pnpm add rilevato: \`${cmd.slice(0, 80)}\``);
    }
    if (RE_YARN_ADD.test(cmd)) {
      decide(isAuto, `yarn add rilevato: \`${cmd.slice(0, 80)}\``);
    }
    process.exit(0);
  }

  if (!['Write', 'Edit'].includes(tool_name)) process.exit(0);

  const filePath = (tool_input?.file_path ?? '').replace(/\\/g, '/');

  // --- Lockfile: blocca qualsiasi modifica diretta ---
  if (LOCKFILES.test(filePath)) {
    decide(isAuto, `modifica diretta al lockfile ${filePath.split('/').pop()} (i lockfile cambiano solo via package manager)`);
    return;
  }

  // --- package.json: rileva nuove entry di dipendenza ---
  if (!PACKAGE_JSON.test(filePath)) process.exit(0);

  let added = '';
  if (tool_name === 'Edit') {
    added = addedLines(tool_input.old_string ?? '', tool_input.new_string ?? '');
  } else {
    // Write completo: considera tutto come nuovo
    added = tool_input.content ?? '';
  }

  if (hasNewDepEntry(added)) {
    decide(isAuto, `nuova dipendenza rilevata in package.json`);
  } else {
    process.exit(0);
  }
});

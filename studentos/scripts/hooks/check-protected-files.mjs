#!/usr/bin/env node
/**
 * PreToolUse hook — Muro #1: file intoccabili.
 *
 * Su Write|Edit blocca SEMPRE (qualsiasi branch: "intoccabile" non ha WARN)
 * la scrittura su:
 *  - src/lib/storage/db.ts            (schema IndexedDB)
 *  - src/lib/sync/engine.ts           (sync core)
 *  - src/lib/sync/adapters/easyacademy.ts (sync core)
 *  - package.json                     (qualsiasi modifica; le nuove dipendenze
 *                                      restano coperte in più dal muro #5)
 *  - qualunque path dentro scripts/   (eccetto questo hook, o si autoblocca)
 *  - qualunque file GIÀ ESISTENTE dentro tests/ (i test nuovi sono ok)
 *
 * Via di sblocco esplicita, caso per caso: ALLOW_PROTECTED_EDIT=1
 * (es. migration di db.ts autorizzata dall'utente).
 *
 * Payload stdin: PreToolUse JSON di Claude Code.
 */

import { existsSync } from 'node:fs';

const SELF = /(?:^|\/)scripts\/hooks\/check-protected-files\.mjs$/;

const PROTECTED_FILES = [
  [/(?:^|\/)src\/lib\/storage\/db\.ts$/, 'schema IndexedDB (db.ts)'],
  [/(?:^|\/)src\/lib\/sync\/engine\.ts$/, 'sync core (engine.ts)'],
  [/(?:^|\/)src\/lib\/sync\/adapters\/easyacademy\.ts$/, 'sync core (easyacademy.ts)'],
  [/(?:^|\/)package\.json$/, 'package.json'],
];
const IN_SCRIPTS = /(?:^|\/)scripts\//;
const IN_TESTS = /(?:^|\/)tests\//;

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(2);
}

let raw = '';
process.stdin.on('data', c => { raw += c; });
process.stdin.on('end', () => {
  let payload;
  try { payload = JSON.parse(raw); } catch { process.exit(0); }

  const { tool_name, tool_input } = payload;
  if (!['Write', 'Edit'].includes(tool_name)) process.exit(0);

  const rawPath = tool_input?.file_path ?? '';
  const filePath = rawPath.replace(/\\/g, '/');
  if (!filePath) process.exit(0);

  // Dipendenze installate / build output: mai file del progetto.
  if (/(?:^|\/)(?:node_modules|\.next)\//.test(filePath)) process.exit(0);
  if (SELF.test(filePath)) process.exit(0);

  let what = null;
  for (const [re, label] of PROTECTED_FILES) {
    if (re.test(filePath)) { what = label; break; }
  }
  if (!what && IN_SCRIPTS.test(filePath)) what = 'scripts/';
  if (!what && IN_TESTS.test(filePath) && existsSync(rawPath)) what = 'test esistente';

  if (!what) process.exit(0);

  if (process.env.ALLOW_PROTECTED_EDIT === '1') process.exit(0);

  block(
    `Muro #1: ${filePath.split('/').slice(-3).join('/')} è intoccabile (${what}). ` +
    'Serve autorizzazione esplicita dell\'utente per questo caso specifico; ' +
    'se ce l\'hai, rilancia con ALLOW_PROTECTED_EDIT=1. Altrimenti trova un\'altra strada o riporta come blocker.'
  );
});

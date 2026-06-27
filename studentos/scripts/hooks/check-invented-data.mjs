#!/usr/bin/env node
/**
 * PreToolUse hook — Muro #4: niente dati inventati.
 *
 * Rileva nuovi codici EasyAcademy (corso/anno2) o URL https aggiunti
 * in file sync/universities, sync adapters e insegnamenti/discovery.
 *
 * Branch auto/* → STRICT (blocca, exit 2 + JSON).
 * Branch supervisionato → WARN (consenti, additionalContext al modello).
 *
 * Payload stdin: PreToolUse JSON di Claude Code.
 * Risposta stdout: JSON { decision, reason|additionalContext } oppure nulla (exit 0).
 */

import { execFileSync } from 'node:child_process';

const WATCHED_PATTERNS = [
  /src[/\\]lib[/\\]sync[/\\]universities[/\\][^/\\]+\.ts$/,
  /src[/\\]lib[/\\]sync[/\\][^/\\]+\.ts$/,
  /src[/\\]lib[/\\]insegnamenti[/\\]discovery\.ts$/,
];

// Regex per rilevare contenuto sospetto nel diff aggiunto
// Corso EA: corso: "ABCD" o corso: '12345' — lettere maiuscole o cifre, 1-40 char
const RE_CORSO = /\bcorso\s*:\s*["'][A-Za-z0-9/|. \-]{1,40}["']/;
// Anno2 EA: anno2: [...]
const RE_ANNO2 = /\banno2\s*:\s*\[/;
// URL https nel contenuto aggiunto
const RE_URL = /https?:\/\/[^\s"',)]+/;

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

/** Righe presenti in `b` ma assenti in `a`. */
function addedLines(a, b) {
  const setA = new Set(a.split('\n'));
  return b.split('\n').filter(l => !setA.has(l)).join('\n');
}

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(2);
}

function warn(additionalContext) {
  process.stdout.write(JSON.stringify({ decision: 'allow', additionalContext }));
  process.exit(0);
}

let raw = '';
process.stdin.on('data', c => { raw += c; });
process.stdin.on('end', () => {
  let payload;
  try { payload = JSON.parse(raw); } catch { process.exit(0); }

  const { tool_name, tool_input } = payload;
  if (!['Write', 'Edit'].includes(tool_name)) process.exit(0);

  const filePath = (tool_input?.file_path ?? '').replace(/\\/g, '/');
  if (!WATCHED_PATTERNS.some(p => p.test(filePath))) process.exit(0);

  let added = '';
  if (tool_name === 'Edit') {
    added = addedLines(tool_input.old_string ?? '', tool_input.new_string ?? '');
  } else {
    added = tool_input.content ?? '';
  }

  const findings = [];
  if (RE_CORSO.test(added) || RE_ANNO2.test(added)) findings.push('nuovo codice EA (corso/anno2)');
  if (RE_URL.test(added)) findings.push('nuovo URL https');

  if (findings.length === 0) process.exit(0);

  const branch = getBranch();
  const isAuto = branch.startsWith('auto/') || branch === 'unknown';
  const detail = `${findings.join(', ')} in ${filePath.split('/').slice(-3).join('/')}`;

  if (isAuto) {
    block(
      `Muro #4: ${detail}. ` +
      'Codici EA e URL manifesti devono essere verificati su combo.php / sito ateneo. ' +
      'Vietato in full-auto. Riporta come blocker.'
    );
  } else {
    warn(
      `[Muro #4 WARN] ${detail}. ` +
      'Verifica la fonte su combo.php / sito ateneo prima di committare. ' +
      'In modalità full-auto questo cambio sarebbe bloccato.'
    );
  }
});

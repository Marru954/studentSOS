#!/usr/bin/env node
/**
 * PreToolUse hook — Muro #2: niente merge / push diretto su main.
 *
 * Su Bash blocca SEMPRE, senza override via env:
 *  - qualunque `git merge`
 *  - `git push` il cui refspec di destinazione è main (origin main,
 *    HEAD:main, +main, refs/heads/main, ...), oppure `git push` senza
 *    refspec mentre si è sul branch main.
 * L'unica via legittima è scripts/safe-merge.sh o una PR.
 *
 * Il comando viene tokenizzato (quote-aware) e diviso in sotto-comandi, così
 * un messaggio di commit che contiene "git merge" o `bash scripts/safe-merge.sh`
 * non generano falsi positivi. Ricorre dentro `bash|sh|zsh -c "..."`.
 *
 * Payload stdin: PreToolUse JSON di Claude Code.
 */

import { execFileSync } from 'node:child_process';

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

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(2);
}

/** Rimuove i corpi degli heredoc (testo, non comandi). */
function stripHeredocs(cmd) {
  return cmd.replace(
    /(<<-?\s*['"]?(\w+)['"]?[^\n]*)\n[\s\S]*?\n[ \t]*\2[ \t]*(?=\n|$)/g,
    '$1',
  );
}

/** Divide in sotto-comandi (su ; & | newline fuori dalle quote), ognuno una lista di token. */
function parseCommands(cmd) {
  const commands = [];
  let tokens = [];
  let cur = '';
  let has = false;
  let quote = null;
  const pushTok = () => { if (has) tokens.push(cur); cur = ''; has = false; };
  const pushCmd = () => { pushTok(); if (tokens.length) commands.push(tokens); tokens = []; };

  for (let i = 0; i < cmd.length; i++) {
    const ch = cmd[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && quote === '"' && i + 1 < cmd.length) { cur += cmd[++i]; }
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; has = true; continue; }
    if (ch === '\\' && i + 1 < cmd.length) { cur += cmd[++i]; has = true; continue; }
    if (ch === ';' || ch === '&' || ch === '|' || ch === '\n' || ch === '(' || ch === ')' || ch === '{' || ch === '}') {
      pushCmd();
      continue;
    }
    if (/\s/.test(ch)) { pushTok(); continue; }
    cur += ch; has = true;
  }
  pushCmd();
  return commands;
}

const GIT_OPTS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--exec-path']);
const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash']);

/** Ritorna un motivo di blocco oppure null. */
function inspect(command, branch, depth = 0) {
  if (depth > 3) return null;
  for (let toks of parseCommands(stripHeredocs(command))) {
    // salta assegnazioni d'ambiente iniziali (FOO=bar git ...)
    while (toks.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(toks[0])) toks = toks.slice(1);
    if (!toks.length) continue;

    const exe = toks[0].replace(/\\/g, '/').split('/').pop().replace(/\.exe$/i, '');

    if (SHELLS.has(exe)) {
      const ci = toks.findIndex(t => /^-\w*c\w*$/.test(t));
      if (ci !== -1 && toks[ci + 1]) {
        const r = inspect(toks[ci + 1], branch, depth + 1);
        if (r) return r;
      }
      continue;
    }
    if (exe !== 'git') continue;

    // salta le opzioni globali di git per trovare il sottocomando
    let i = 1;
    while (i < toks.length && toks[i].startsWith('-')) {
      i += GIT_OPTS_WITH_VALUE.has(toks[i]) ? 2 : 1;
    }
    const sub = toks[i];
    const args = toks.slice(i + 1);

    if (sub === 'merge') return '`git merge` diretto';

    if (sub === 'push') {
      const positional = [];
      for (let j = 0; j < args.length; j++) {
        const a = args[j];
        if (a === '-o' || a === '--push-option' || a === '--repo' || a === '--receive-pack' || a === '--exec') { j++; continue; }
        if (a.startsWith('-')) continue;
        positional.push(a);
      }
      const refspecs = positional.slice(1); // [0] = remote
      for (const spec of refspecs) {
        const dest = spec.replace(/^\+/, '').split(':').pop();
        if (dest === 'main' || dest === 'refs/heads/main') return `\`git push\` verso main (${spec})`;
      }
      if (refspecs.length === 0 && branch === 'main') return '`git push` da main';
    }
  }
  return null;
}

let raw = '';
process.stdin.on('data', c => { raw += c; });
process.stdin.on('end', () => {
  let payload;
  try { payload = JSON.parse(raw); } catch { process.exit(0); }

  const { tool_name, tool_input } = payload;
  if (tool_name !== 'Bash') process.exit(0);

  const reason = inspect(tool_input?.command ?? '', getBranch());
  if (!reason) process.exit(0);

  block(
    `Muro #2: ${reason} vietato. main è protetto: ci si arriva solo con ` +
    'scripts/safe-merge.sh (gate verde + tag di rollback) o tramite PR. Nessun override.'
  );
});

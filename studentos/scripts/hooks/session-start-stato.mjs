#!/usr/bin/env node
/**
 * SessionStart hook — legge docs/stato/STATO.md all'avvio di ogni sessione.
 *
 * Stampa su stdout (che Claude Code aggiunge al contesto iniziale):
 *  - intestazione del file (titolo + data di aggiornamento)
 *  - la sessione più recente della sezione "Completati"
 *  - da "## In sospeso" fino a fine file (In sospeso, Prossimi obiettivi,
 *    Registro decisioni)
 * Le sessioni storiche restano consultabili nel file. Tetto di sicurezza
 * MAX_CHARS: oltre, l'estratto è troncato con un avviso.
 *
 * Non blocca mai l'avvio: qualunque errore → exit 0 senza output.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_CHARS = 30000;

try {
  const here = dirname(fileURLToPath(import.meta.url));
  const file = join(here, '..', '..', 'docs', 'stato', 'STATO.md');
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);

  const firstSession = lines.findIndex((l) => l.startsWith('### '));
  const nextSession = lines.findIndex((l, i) => i > firstSession && /^(### |## )/.test(l));
  const pending = lines.findIndex((l) => /^## In sospeso/.test(l));

  let out;
  if (firstSession === -1 || pending === -1) {
    out = lines.join('\n'); // struttura inattesa: meglio tutto che niente
  } else {
    out = [
      ...lines.slice(0, firstSession),
      ...lines.slice(firstSession, nextSession),
      '[…sessioni precedenti omesse: vedi docs/stato/STATO.md…]',
      '',
      ...lines.slice(pending),
    ].join('\n');
  }
  if (out.length > MAX_CHARS) out = out.slice(0, MAX_CHARS) + '\n[…troncato: leggi docs/stato/STATO.md…]';

  process.stdout.write(
    'STATO.md (letto automaticamente all\'avvio sessione — rispetta il Registro decisioni):\n\n' + out + '\n',
  );
} catch {
  // mai bloccare l'avvio
}

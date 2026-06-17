"use client";

/** "Cerca il tuo ateneo": sostituisce le due griglie lunghe (sync live +
 *  manuale) con una ricerca compatta e onesta. L'utente digita, vede se il suo
 *  ateneo c'è e — dentro al risultato — se è "sync live" (orario ed esami in
 *  automatico) o "manuale" (inseriti a mano). Se non c'è: lo consiglia. */
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type Ateneo = { name: string; live: boolean };

/** Minuscolo + senza accenti, per un confronto tollerante. */
const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function AteneoSearch({ atenei }: { atenei: Ateneo[] }) {
  const [query, setQuery] = useState("");
  const q = norm(query.trim());

  const liveCount = useMemo(() => atenei.filter((a) => a.live).length, [atenei]);
  const manualCount = atenei.length - liveCount;

  const results = useMemo(
    () => (q === "" ? atenei : atenei.filter((a) => norm(a.name).includes(q))),
    [q, atenei],
  );

  return (
    <div className="reveal mx-auto mt-8 max-w-xl">
      <div className="glass flex items-center gap-2.5 rounded-full border border-line px-4 py-2.5 focus-within:border-line-strong">
        <Search aria-hidden="true" className="size-[1.05rem] shrink-0 text-ink-mute" />
        <label htmlFor="ateneo-search" className="sr-only">
          Cerca il tuo ateneo
        </label>
        <input
          id="ateneo-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca il tuo ateneo…"
          autoComplete="off"
          className="w-full bg-transparent text-[0.95rem] text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} atenei trovati
      </p>

      {results.length > 0 ? (
        <ul
          className="mt-3 max-h-[19rem] space-y-2 overflow-y-auto pr-1"
          aria-label="Atenei supportati"
        >
          {results.map((a) => (
            <li
              key={a.name}
              className="glass flex items-center justify-between gap-3 rounded-lg px-[1.1rem] py-[0.8rem]"
            >
              <span className="font-semibold text-ink">{a.name}</span>
              {a.live ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[var(--signal-2)]">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-[var(--signal-2)]"
                  />
                  Sync live
                  <span className="font-medium text-ink-mute">· orario ed esami automatici</span>
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-mute">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--ink-faint)]" />
                  Manuale
                  <span className="text-ink-faint">· inseriti a mano</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-center text-sm text-ink-mute">
          Non c&apos;è il tuo ateneo?{" "}
          <a
            href="mailto:support@studentos.app?subject=Consiglia%20un%20ateneo"
            className="font-semibold text-ink underline hover:text-[var(--signal-2)]"
          >
            Consigliacelo →
          </a>
        </p>
      )}

      <p className="mt-4 text-center text-xs text-ink-faint">
        {liveCount} atenei in sync live · {manualCount} in manuale
      </p>
    </div>
  );
}

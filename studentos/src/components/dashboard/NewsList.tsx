"use client";

import { Megaphone } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/primitives/Panel";
import type { NewsItem } from "@/lib/domain/types";
import { fmtDayMonth } from "@/lib/format";

const COMPACT = 3;

/** Latest department news, newest first. Shows the 3 most recent; the rest
 *  collapse behind "Mostra tutti gli avvisi". */
export function NewsList({
  items,
  className,
}: {
  items: NewsItem[];
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...items].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  const visible = expanded ? sorted : sorted.slice(0, COMPACT);
  const hidden = sorted.length - visible.length;

  return (
    <Panel title="Avvisi" icon={<Megaphone />} className={className}>
      {sorted.length === 0 ? (
        <p className="text-sm text-ink-mute">
          Nessun avviso sincronizzato dal corso di laurea.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col divide-y divide-line">
            {visible.map((n) => (
              <li key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-baseline gap-3">
                  {n.publishedAt && (
                    <span className="shrink-0 font-mono text-xs text-ink-mute">
                      {fmtDayMonth(n.publishedAt)}
                    </span>
                  )}
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink underline-offset-2 hover:text-signal hover:underline"
                  >
                    {n.title}
                    <span className="sr-only"> (si apre in una nuova scheda)</span>
                  </a>
                </div>
                {n.excerpt && (
                  <p className="mt-1 line-clamp-2 text-xs text-ink-mute">
                    {n.excerpt}
                  </p>
                )}
              </li>
            ))}
          </ul>
          {(hidden > 0 || expanded) && sorted.length > COMPACT && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="self-start text-xs font-medium text-signal hover:underline"
            >
              {expanded
                ? "Mostra meno"
                : `Mostra tutti gli avvisi (${hidden} in più)`}
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}

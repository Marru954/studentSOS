import { Megaphone } from "lucide-react";
import { Panel } from "@/components/primitives/Panel";
import type { NewsItem } from "@/lib/domain/types";
import { fmtDayMonth } from "@/lib/format";

const MAX_ITEMS = 6;

/** Latest department news, newest first, linking to the source site. */
export function NewsList({
  items,
  className,
}: {
  items: NewsItem[];
  className?: string;
}) {
  const latest = [...items]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, MAX_ITEMS);

  return (
    <Panel title="Avvisi" icon={<Megaphone />} className={className}>
      {latest.length === 0 ? (
        <p className="text-sm text-ink-mute">
          Nessun avviso sincronizzato dal corso di laurea.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {latest.map((n) => (
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
      )}
    </Panel>
  );
}

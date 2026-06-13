import { Megaphone } from "lucide-react";
import { Panel } from "@/components/primitives/Panel";
import type { NewsItem } from "@/lib/domain/types";
import { fmtDayMonth } from "@/lib/format";

/** Latest department news, newest first, in a fixed-height internal scroll so
 *  the column matches the exam timeline and the dashboard fits one screen. */
export function NewsList({
  items,
  className,
}: {
  items: NewsItem[];
  className?: string;
}) {
  const sorted = [...items].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );

  return (
    <Panel title="Avvisi" icon={<Megaphone />} className={className}>
      {sorted.length === 0 ? (
        <p className="text-sm text-ink-mute">
          Nessun avviso sincronizzato dal corso di laurea.
        </p>
      ) : (
        <ul className="flex max-h-[360px] flex-col divide-y divide-line overflow-y-auto">
          {sorted.map((n) => (
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
                  className="link-underline text-sm text-ink transition-colors hover:text-signal"
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

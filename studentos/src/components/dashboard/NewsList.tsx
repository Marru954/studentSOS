import { Megaphone } from "lucide-react";
import { Panel } from "@/components/primitives/Panel";
import type { NewsItem } from "@/lib/domain/types";
import { fmtDayMonth } from "@/lib/format";

/** Thin, neutral, hover-revealed scrollbar — no resting groove or line. */
const SOFT_SCROLL =
  "[scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--hairline-strong)_transparent] " +
  "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb]:duration-200 " +
  "hover:[&::-webkit-scrollbar-thumb]:bg-[var(--hairline-strong)]";

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
        <ul className={`flex max-h-[360px] flex-col divide-y divide-line overflow-y-auto ${SOFT_SCROLL}`}>
          {sorted.map((n) => (
            <li key={n.id} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
              <span
                aria-hidden="true"
                className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--signal-2)]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-sm font-medium text-ink transition-colors hover:text-signal"
                  >
                    {n.title}
                    <span className="sr-only"> (si apre in una nuova scheda)</span>
                  </a>
                  {n.publishedAt && (
                    <span className="ml-auto shrink-0 font-num text-xs text-ink-faint">
                      {fmtDayMonth(n.publishedAt)}
                    </span>
                  )}
                </div>
                {n.excerpt && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-mute">
                    {n.excerpt}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

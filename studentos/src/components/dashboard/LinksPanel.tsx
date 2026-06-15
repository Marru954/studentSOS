"use client";

import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Panel } from "@/components/primitives/Panel";
import { cn } from "@/lib/cn";
import { useSettings } from "@/lib/state/settings";
import { getPreset } from "@/lib/sync/universities";

/** National fallbacks — always relevant, used when the active preset carries no
 *  institutional links of its own. */
const FALLBACK_LINKS: { label: string; url: string }[] = [
  { label: "Universitaly (MIUR)", url: "https://www.universitaly.it" },
  { label: "UniPass", url: "https://www.unipass.it" },
];

/** Quick institutional links contextual to the student's ateneo (student portal,
 *  ateneo site…), with a national fallback. Replaces the often-empty "Avvisi"
 *  panel on the dashboard: this card is always useful and never shows an empty
 *  state. */
export function LinksPanel({ className }: { className?: string }) {
  const presetId = useSettings((s) => s.presetId);
  const preset = getPreset(presetId ?? "");
  const links = preset?.links?.length ? preset.links : FALLBACK_LINKS;

  return (
    <Panel
      title="Link utili"
      icon={<LinkIcon />}
      className={cn("flex flex-col", className)}
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <ul className="flex flex-col divide-y divide-line">
        {links.map((link) => (
          <li key={link.url} className="first:pt-0 last:pb-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 py-2.5 text-sm text-ink transition-colors hover:text-signal"
            >
              <ExternalLink
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--signal-2)]"
              />
              <span className="link-underline min-w-0 flex-1 truncate font-medium">
                {link.label}
              </span>
              <span className="sr-only"> (si apre in una nuova scheda)</span>
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

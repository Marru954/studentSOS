"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";
import { Panel } from "@/components/primitives/Panel";
import type { Urgency, UrgencySeverity } from "@/lib/domain/types";
import { daysFromToday } from "@/lib/format";

const SEVERITY: Record<UrgencySeverity, { label: string; tone: BadgeTone }> = {
  critical: { label: "Critico", tone: "danger" },
  warning: { label: "Attenzione", tone: "warn" },
  info: { label: "Info", tone: "neutral" },
};

/** Time buckets, worst first. Colour carries the horizon; the per-item badge
 *  still carries the severity (meaning never rides on colour alone). */
type BucketKey = "today" | "week" | "later";

const BUCKETS: { key: BucketKey; label: string; dot: string; text: string }[] = [
  { key: "today", label: "Oggi", dot: "bg-danger", text: "text-danger" },
  { key: "week", label: "Questa settimana", dot: "bg-warn", text: "text-warn" },
  { key: "later", label: "Prossimamente", dot: "bg-ink-mute", text: "text-ink-mute" },
];

const MAX_VISIBLE = 4;

function bucketOf(u: Urgency, now: Date): BucketKey {
  const days = daysFromToday(u.expiresAt.slice(0, 10), now);
  if (days <= 0) return "today";
  if (days <= 7) return "week";
  return "later";
}

/** The radar: output of the urgency engine, grouped by horizon. */
export function UrgencyList({
  urgencies,
  now,
  className,
}: {
  urgencies: Urgency[];
  now: Date;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? urgencies : urgencies.slice(0, MAX_VISIBLE);
  const hidden = urgencies.length - visible.length;

  return (
    <Panel
      title="Urgenze"
      icon={<AlertTriangle />}
      className={className}
      actions={
        urgencies.length > 0 && (
          <Badge tone={SEVERITY[urgencies[0].severity].tone}>
            {urgencies.length}
          </Badge>
        )
      }
    >
      {urgencies.length === 0 ? (
        <p className="text-sm text-ink-mute">
          Nessuna urgenza rilevata per i prossimi giorni.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {BUCKETS.map((b) => {
            const items = visible.filter((u) => bucketOf(u, now) === b.key);
            if (items.length === 0) return null;
            return (
              <section key={b.key} className="flex flex-col gap-1">
                <h3 className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${b.dot}`}
                  />
                  <span
                    className={`text-label font-semibold uppercase tracking-wide ${b.text}`}
                  >
                    {b.label}
                  </span>
                </h3>
                <ul className="flex flex-col divide-y divide-line">
                  {items.map((u) => (
                    <li key={u.id} className="flex items-start gap-3 py-3">
                      <Badge
                        tone={SEVERITY[u.severity].tone}
                        className="mt-0.5 shrink-0"
                      >
                        {SEVERITY[u.severity].label}
                      </Badge>
                      <p className="text-sm leading-relaxed text-ink">
                        {u.message}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {(hidden > 0 || expanded) && urgencies.length > MAX_VISIBLE && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="self-start text-xs font-medium text-signal hover:underline"
            >
              {expanded ? "Mostra meno" : `Mostra tutto (${hidden} in più)`}
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}

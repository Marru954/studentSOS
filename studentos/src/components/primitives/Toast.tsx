"use client";

/** Renders the current toast bottom-right and auto-dismisses after 3s. Pure CSS
 *  entrance (`.overlay-in` reused); honours the global reduced-motion reset. */
import { CheckCircle2, TriangleAlert, XCircle } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { type ToastTone, useToast } from "@/lib/state/toast";

const TONE: Record<ToastTone, { cls: string; Icon: typeof CheckCircle2 }> = {
  ok: { cls: "border-ok/40 text-ok", Icon: CheckCircle2 },
  warn: { cls: "border-warn/40 text-warn", Icon: TriangleAlert },
  danger: { cls: "border-danger/45 text-danger", Icon: XCircle },
};

export function ToastHost() {
  const id = useToast((s) => s.id);
  const message = useToast((s) => s.message);
  const tone = useToast((s) => s.tone);
  const dismiss = useToast((s) => s.dismiss);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(dismiss, 3000);
    return () => clearTimeout(t);
  }, [id, message, dismiss]);

  if (!message) return null;
  const { cls, Icon } = TONE[tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed bottom-[84px] right-4 z-50 sm:bottom-4"
    >
      <div
        className={cn(
          "glass overlay-in flex max-w-[min(92vw,22rem)] items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium shadow-soft",
          cls,
        )}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <span className="text-ink">{message}</span>
      </div>
    </div>
  );
}

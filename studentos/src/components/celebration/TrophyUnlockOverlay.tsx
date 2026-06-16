"use client";

/** Full-screen scenic for a freshly-earned event trophy. Salvagente/SOS theme
 *  in the signal palette (not red). Deliberately NOT a modal: it does not trap
 *  focus, steal focus, or block the keyboard (no role="dialog"/aria-modal). It
 *  announces itself via aria-live and closes on Esc, tap-anywhere, or a button.
 *  Under reduced motion it drops the sparks and the global reset flattens the
 *  entrance to a plain appearance. */
import { useEffect } from "react";
import { LifeBuoy, X } from "lucide-react";

export function TrophyUnlockOverlay({
  title,
  condition,
  reducedMotion,
  onClose,
}: {
  title: string;
  condition: string;
  reducedMotion: boolean;
  onClose: () => void;
}) {
  // Keyboard close without trapping: a single Esc listener while mounted.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sparks = reducedMotion ? [] : Array.from({ length: 10 }, (_, i) => i);

  return (
    <div
      className="no-print overlay-in fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      {/* annuncio per screen reader, fuori dal flusso visivo */}
      <p aria-live="assertive" className="sr-only">
        Trofeo sbloccato: {title}
      </p>

      <div
        className="trophy-card glass relative flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl border border-line p-8 text-center shadow-soft"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="glass-2 absolute right-3 top-3 rounded-full p-1.5 text-ink-mute transition-colors hover:text-ink"
        >
          <X aria-hidden="true" className="size-4" />
        </button>

        <div className="trophy-buoy">
          {sparks.map((i) => (
            <span
              key={i}
              aria-hidden="true"
              className="celebrate-spark"
              style={{ left: `${8 + i * 9}%`, animationDelay: `${i * 70}ms` }}
            />
          ))}
          <LifeBuoy aria-hidden="true" className="size-20 text-[var(--signal-2)]" />
        </div>

        <div className="eyebrow text-[var(--signal-2)]">Trofeo sbloccato</div>
        <h2 className="grad-text font-display text-3xl font-bold leading-tight">
          {title}
        </h2>
        <p className="text-sm text-ink-mute">{condition}</p>

        <button
          type="button"
          onClick={onClose}
          className="btn btn-primary mt-2"
          style={{ padding: "0.55rem 1.4rem" }}
        >
          Continua
        </button>
      </div>
    </div>
  );
}

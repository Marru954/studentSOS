"use client";

/**
 * Channel ("canale"/turno) chips for /orario. Shown only when the feed carries
 * two or more parallel channels — a student follows one, so the others are just
 * noise (and used to pile up as unreadable narrow columns in the week grid).
 * Controlled: the parent owns the value.
 */
export function ChannelFilter({
  channels,
  value,
  onChange,
}: {
  channels: { channel: string; count: number }[];
  value: string | null;
  onChange: (channel: string | null) => void;
}) {
  if (channels.length < 2) return null;
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Filtra per canale o turno"
    >
      <span className="eyebrow text-ink-mute">Canale:</span>
      {[null, ...channels.map((c) => c.channel)].map((c) => (
        <button
          key={c ?? "all"}
          type="button"
          onClick={() => onChange(c)}
          aria-pressed={value === c}
          className={
            value === c
              ? "grad-fill rounded-full px-3 py-1 text-xs font-semibold text-white shadow-soft"
              : "chip transition-colors hover:border-line-strong"
          }
        >
          {c ?? "Tutti"}
        </button>
      ))}
    </div>
  );
}

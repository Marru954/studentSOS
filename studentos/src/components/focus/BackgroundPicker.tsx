"use client";

/** Themed study backgrounds. Each non-default theme overrides the global
 *  `.atmosphere` (aurora) element's background with a CSS gradient; selecting
 *  Default — or leaving the page — restores it. No external images. */
import { useEffect, useState } from "react";

const BACKGROUNDS = [
  { id: "default", label: "🌌 Default", css: "" },
  {
    id: "forest",
    label: "🌲 Foresta",
    css: "linear-gradient(135deg, #0a1f0a 0%, #1a3d1a 40%, #0d2d0d 100%)",
  },
  {
    id: "ocean",
    label: "🌊 Oceano",
    css: "linear-gradient(135deg, #020b18 0%, #0c2a4a 50%, #041525 100%)",
  },
  {
    id: "sunset",
    label: "🌅 Tramonto",
    css: "linear-gradient(135deg, #1a0533 0%, #3d1520 40%, #1f0a0a 100%)",
  },
  {
    id: "space",
    label: "🚀 Spazio",
    css: "linear-gradient(135deg, #000005 0%, #0a0520 50%, #050010 100%)",
  },
] as const;

export function BackgroundPicker() {
  const [active, setActive] = useState<string>("default");

  useEffect(() => {
    const el = document.querySelector(".atmosphere");
    if (!(el instanceof HTMLElement)) return;
    const bg = BACKGROUNDS.find((b) => b.id === active);
    el.style.background = active === "default" || !bg?.css ? "" : bg.css;
    // restore the default aurora when switching away or leaving the page
    return () => {
      el.style.background = "";
    };
  }, [active]);

  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow text-ink-mute">Sfondo:</span>
      <div className="flex flex-wrap items-center gap-2">
        {BACKGROUNDS.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={active === b.id}
            onClick={() => setActive(b.id)}
            className={active === b.id ? "chip chip-signal" : "chip"}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

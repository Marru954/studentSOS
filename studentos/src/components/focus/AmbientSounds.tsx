"use client";

/** Ambient study sounds, synthesised with the native Web Audio API — no files,
 *  no network, no dependencies. Each "sound" is looping noise shaped by a
 *  filter (plus a slow swell for the waves). Sounds are combinable: layer rain
 *  + café + waves and they mix together on a shared master gain. */
import { useEffect, useRef, useState } from "react";

const SOUNDS = [
  { id: "rain", label: "🌧️ Pioggia" },
  { id: "cafe", label: "☕ Caffè" },
  { id: "forest", label: "🌲 Foresta" },
  { id: "waves", label: "🌊 Onde" },
  { id: "white", label: "⚪ Rumore" },
] as const;

type SoundId = (typeof SOUNDS)[number]["id"];

/** Headroom factor per voice so several layered sounds don't clip the master. */
const MIX = 0.5;

/** A few seconds of white noise, looped. */
function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

interface Voice {
  noise: AudioBufferSourceNode;
  lfo: OscillatorNode | null;
}

export function AmbientSounds() {
  const [active, setActive] = useState<SoundId[]>([]);
  const [volume, setVolume] = useState(0.5);

  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  // One live voice per active sound, so they layer instead of replacing.
  const voicesRef = useRef<Map<SoundId, Voice>>(new Map());

  function stopVoice(id: SoundId) {
    const v = voicesRef.current.get(id);
    if (!v) return;
    try {
      v.noise.stop();
      v.lfo?.stop();
    } catch {
      // already stopped
    }
    v.noise.disconnect();
    v.lfo?.disconnect();
    voicesRef.current.delete(id);
  }

  function play(id: SoundId) {
    const ctx = ctxRef.current!;
    const master = masterRef.current!;

    const noise = ctx.createBufferSource();
    noise.buffer = bufferRef.current;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    let base = 1;

    switch (id) {
      case "rain":
        filter.type = "highpass";
        filter.frequency.value = 1200;
        break;
      case "cafe":
        filter.type = "lowpass";
        filter.frequency.value = 700;
        base = 0.85;
        break;
      case "forest":
        filter.type = "bandpass";
        filter.frequency.value = 1600;
        filter.Q.value = 0.5;
        break;
      case "waves":
        filter.type = "lowpass";
        filter.frequency.value = 550;
        break;
      case "white":
        filter.type = "allpass";
        break;
    }
    gain.gain.value = base * MIX;

    noise.connect(filter).connect(gain).connect(master);
    noise.start();

    let lfo: OscillatorNode | null = null;
    if (id === "waves") {
      lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.4 * MIX; // swell around the base gain
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
    }

    voicesRef.current.set(id, { noise, lfo });
  }

  function toggleSound(id: SoundId) {
    // lazily create the context on the first user gesture (autoplay policy)
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
      bufferRef.current = makeNoiseBuffer(ctx);
    }
    void ctxRef.current.resume();

    if (voicesRef.current.has(id)) {
      stopVoice(id);
      setActive((a) => a.filter((x) => x !== id));
    } else {
      play(id);
      setActive((a) => [...a, id]);
    }
  }

  // keep the master gain in sync with the slider
  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume;
  }, [volume]);

  // tear everything down on unmount. The voices Map is created once (stable
  // identity) so we can copy it; the AudioContext is created lazily on first
  // play, so it must be read live at cleanup, not captured at mount.
  useEffect(() => {
    const voices = voicesRef.current;
    return () => {
      for (const v of voices.values()) {
        try {
          v.noise.stop();
          v.lfo?.stop();
        } catch {
          // already stopped
        }
      }
      voices.clear();
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow text-ink-mute">
        Ambiente{active.length > 0 ? ` · ${active.length} attivi` : ""}:
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {SOUNDS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={active.includes(s.id)}
            onClick={() => toggleSound(s.id)}
            className={active.includes(s.id) ? "chip chip-signal" : "chip"}
          >
            {s.label}
          </button>
        ))}
        {active.length > 0 && (
          <label className="flex items-center gap-1.5">
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              className="w-20 accent-signal"
            />
          </label>
        )}
      </div>
    </div>
  );
}

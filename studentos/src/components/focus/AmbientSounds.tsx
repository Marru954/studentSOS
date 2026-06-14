"use client";

/** Ambient study sounds, synthesised with the native Web Audio API — no files,
 *  no network, no dependencies. Each "sound" is looping noise shaped by a
 *  filter (plus a slow swell for the waves). One sound at a time. */
import { useEffect, useRef, useState } from "react";

const SOUNDS = [
  { id: "rain", label: "🌧️ Pioggia" },
  { id: "cafe", label: "☕ Caffè" },
  { id: "forest", label: "🌲 Foresta" },
  { id: "waves", label: "🌊 Onde" },
  { id: "white", label: "⚪ Rumore" },
] as const;

type SoundId = (typeof SOUNDS)[number]["id"];

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
  const [active, setActive] = useState<SoundId | null>(null);
  const [volume, setVolume] = useState(0.5);

  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const voiceRef = useRef<Voice | null>(null);

  function stopVoice() {
    const v = voiceRef.current;
    if (!v) return;
    try {
      v.noise.stop();
      v.lfo?.stop();
    } catch {
      // already stopped
    }
    v.noise.disconnect();
    v.lfo?.disconnect();
    voiceRef.current = null;
  }

  function play(id: SoundId) {
    const ctx = ctxRef.current!;
    const master = masterRef.current!;
    stopVoice();

    const noise = ctx.createBufferSource();
    noise.buffer = bufferRef.current;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    gain.gain.value = 1;

    switch (id) {
      case "rain":
        filter.type = "highpass";
        filter.frequency.value = 1200;
        break;
      case "cafe":
        filter.type = "lowpass";
        filter.frequency.value = 700;
        gain.gain.value = 0.85;
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

    noise.connect(filter).connect(gain).connect(master);
    noise.start();

    let lfo: OscillatorNode | null = null;
    if (id === "waves") {
      lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.4; // swell ±0.4 around the base gain of 1
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
    }

    voiceRef.current = { noise, lfo };
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

    if (active === id) {
      stopVoice();
      setActive(null);
    } else {
      play(id);
      setActive(id);
    }
  }

  // keep the master gain in sync with the slider
  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume;
  }, [volume]);

  // tear everything down on unmount (refs only — no external deps)
  useEffect(() => {
    return () => {
      const v = voiceRef.current;
      try {
        v?.noise.stop();
        v?.lfo?.stop();
      } catch {
        // already stopped
      }
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow text-ink-mute">Ambiente:</span>
      <div className="flex flex-wrap items-center gap-2">
        {SOUNDS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={active === s.id}
            onClick={() => toggleSound(s.id)}
            className={active === s.id ? "chip chip-signal" : "chip"}
          >
            {s.label}
          </button>
        ))}
        {active && (
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

"use client";

/** /assistente: AI chat (Groq via /api/assistente). The student context is
 *  gathered live from the stores and sent with every request; history lives in
 *  component state only (not persisted). iMessage-style bubbles on the glass. */
import { MessageSquare, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  type AssistantContext,
  type ChatMessage,
} from "@/lib/assistente";
import { earnedCfu, weightedAverage } from "@/lib/domain/libretto";
import { minutesInRange } from "@/lib/domain/focus";
import {
  fmtDayOfMonth,
  fmtMonthAbbr,
  fmtTime,
  localDayOf,
  localToday,
  mondayOf,
} from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import {
  useFocusSessions,
  useLibretto,
} from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { getPreset } from "@/lib/sync/universities";

const SUGGESTIONS: { label: string; prompt: string }[] = [
  {
    label: "Prossimo esame 📅",
    prompt: "Qual è il mio prossimo esame e come mi conviene prepararmi?",
  },
  {
    label: "Piano di studio 📚",
    prompt: "Aiutami a organizzare un piano di studio per i prossimi esami.",
  },
  {
    label: "La mia media 📊",
    prompt: "Com'è la mia media e cosa posso fare per migliorarla?",
  },
  {
    label: "Ore studiate questa settimana ⏱️",
    prompt: "Quante ore ho studiato questa settimana?",
  },
];

export function AssistantChat() {
  const now = useNowMinute();
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const librettoItems = useLibretto((s) => s.items);
  const focusItems = useFocusSessions((s) => s.items);
  const presetId = useSettings((s) => s.presetId);
  const programme = useSettings((s) => s.programme);
  const yearOfStudy = useSettings((s) => s.yearOfStudy);

  const context = useMemo<AssistantContext>(() => {
    const today = now ? localToday(now) : null;

    const upcomingExams = today
      ? examCalls
          .filter((e) => e.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 10)
          .map((e) => ({
            courseName: e.courseName,
            date: `${fmtDayOfMonth(e.date)} ${fmtMonthAbbr(e.date)}`,
            time: e.time,
          }))
      : [];

    const todayLessons = today
      ? classEvents
          .filter((e) => localDayOf(e.start) === today)
          .sort((a, b) => a.start.localeCompare(b.start))
          .map((e) => ({
            courseName: e.courseName,
            time: `${fmtTime(e.start)}–${fmtTime(e.end)}`,
            room: e.room,
          }))
      : [];

    let focusMinutesThisWeek = 0;
    if (now) {
      const weekStart = mondayOf(now);
      weekStart.setHours(0, 0, 0, 0);
      focusMinutesThisWeek = minutesInRange(
        focusItems,
        weekStart.toISOString(),
        now.toISOString(),
      );
    }

    const preset = presetId ? getPreset(presetId) : undefined;
    return {
      ateneo: preset?.shortName,
      programme: programme || undefined,
      year: yearOfStudy ?? undefined,
      upcomingExams,
      todayLessons,
      average: weightedAverage(librettoItems),
      earnedCfu: earnedCfu(librettoItems),
      focusMinutesThisWeek,
    };
  }, [
    now,
    classEvents,
    examCalls,
    librettoItems,
    focusItems,
    presetId,
    programme,
    yearOfStudy,
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [awaiting, setAwaiting] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, awaiting]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setAwaiting(true);
    try {
      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      if (!res.ok || !res.body) {
        let msg = "Si è verificato un errore. Riprova tra poco.";
        try {
          const j = (await res.json()) as { error?: string };
          if (j?.error) msg = j.error;
        } catch {
          /* non-JSON error body */
        }
        setAwaiting(false);
        setMessages((m) => [...m, { role: "assistant", content: msg }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let started = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        if (!started) {
          started = true;
          setAwaiting(false);
          setMessages((m) => [...m, { role: "assistant", content: chunk }]);
        } else {
          setMessages((m) =>
            m.map((msg, i) =>
              i === m.length - 1
                ? { ...msg, content: msg.content + chunk }
                : msg,
            ),
          );
        }
      }
      if (!started) {
        setAwaiting(false);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Non ho ricevuto una risposta. Riprova." },
        ]);
      }
    } catch {
      setAwaiting(false);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connessione interrotta. Riprova." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="reveal">
        <h1 className="text-[clamp(2rem,5vw,3rem)]">Assistente</h1>
        <p className="muted mt-1.5">
          Chiedi qualsiasi cosa sulla tua carriera universitaria
        </p>
      </header>

      <div
        className="glass gradient-ring reveal flex flex-col overflow-hidden rounded-2xl"
        style={{ height: "min(68vh, 640px)", minHeight: 380 }}
      >
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-label="Conversazione con l'assistente"
          className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-5"
        >
          {messages.length === 0 && !awaiting ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              <div className="bg-primary-gradient shadow-accent flex size-14 items-center justify-center rounded-2xl">
                <MessageSquare aria-hidden="true" className="size-7 text-white" />
              </div>
              <p className="muted max-w-sm text-sm">
                Conosco i tuoi esami, le lezioni, il libretto e le ore di studio.
                Da dove vuoi iniziare?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => void send(s.prompt)}
                    className="glass rounded-full border border-line px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:bg-night-700"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary-gradient rounded-br-md text-white"
                      : "glass rounded-bl-md text-ink",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}

          {awaiting && (
            <div className="flex justify-start">
              <div className="glass flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-ink-mute"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
                <span className="sr-only">L&rsquo;assistente sta scrivendo…</span>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2 border-t border-line p-3"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Scrivi un messaggio
          </label>
          <input
            id="assistant-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un messaggio…"
            autoComplete="off"
            className="placeholder:text-ink-faint flex-1 rounded-xl border border-line bg-night-900/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-signal/60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Invia messaggio"
            className="btn btn-primary disabled:pointer-events-none disabled:opacity-45"
            style={{ padding: "0.6rem 0.9rem" }}
          >
            <Send aria-hidden="true" className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

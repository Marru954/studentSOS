"use client";

/** /assistente: full-height AI chat (Groq via /api/assistente). Student context
 *  is gathered live from the stores and sent with every request; history lives
 *  in component state only (not persisted). Claude.ai/ChatGPT-style layout:
 *  scrolling message area + pinned composer, AI avatars, rendered Markdown,
 *  copy-on-hover, retry-on-error, auto-growing textarea. */
import { Check, Copy, RotateCcw, Send, Sparkles, SquarePen } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { type AssistantContext, type ChatMessage } from "@/lib/assistente";
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
import { useFocusSessions, useLibretto } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { getPreset } from "@/lib/sync/universities";

interface Turn {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const SUGGESTIONS: { label: string; prompt: string }[] = [
  {
    label: "Quando è il mio prossimo esame?",
    prompt: "Quando è il mio prossimo esame?",
  },
  {
    label: "Pianifica le mie sessioni di studio",
    prompt: "Pianifica le mie sessioni di studio per i prossimi esami.",
  },
  {
    label: "Analizza la mia media e come migliorarla",
    prompt: "Analizza la mia media e dimmi come posso migliorarla.",
  },
  {
    label: "Cosa devo studiare questa settimana?",
    prompt: "Cosa mi conviene studiare questa settimana?",
  },
  {
    label: "Quante ore mi mancano per laurearmi?",
    prompt: "Quanti CFU mi mancano per laurearmi e a che punto sono?",
  },
  {
    label: "Crea un piano per il prossimo esame",
    prompt: "Crea un piano di studio dettagliato per il mio prossimo esame.",
  },
];

const MAX_TEXTAREA_PX = 132; // ~5 lines

const MD_COMPONENTS: Components = {
  p: ({ children }) => <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-1.5 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-signal underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/25 px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-black/25 p-3 text-[0.82em] leading-relaxed">
      {children}
    </pre>
  ),
  h1: ({ children }) => (
    <p className="mb-1 mt-2 font-semibold first:mt-0">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="mb-1 mt-2 font-semibold first:mt-0">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="mb-1 mt-2 font-semibold first:mt-0">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-1.5 border-l-2 border-line pl-3 text-ink-mute">
      {children}
    </blockquote>
  ),
};

function toApiMessages(turns: Turn[]): ChatMessage[] {
  return turns
    .filter((t) => !t.error)
    .map(({ role, content }) => ({ role, content }));
}

function AiAvatar() {
  return (
    <div className="bg-primary-gradient mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
      <Sparkles aria-hidden="true" className="size-4 text-white" />
    </div>
  );
}

/** The chat experience. `compact` tunes it for the floating bubble panel
 *  (smaller title, single-column suggestions, no page padding); the default
 *  is the full-height `/assistente` page. */
export function AssistantChat({ compact = false }: { compact?: boolean } = {}) {
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

  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [awaiting, setAwaiting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, awaiting]);

  function resizeTextarea() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_PX)}px`;
  }

  function resetTextareaHeight() {
    if (taRef.current) taRef.current.style.height = "auto";
  }

  async function runCompletion(apiMessages: ChatMessage[]) {
    setBusy(true);
    setAwaiting(true);
    try {
      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, context }),
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
        setTurns((t) => [
          ...t,
          { id: crypto.randomUUID(), role: "assistant", content: msg, error: true },
        ]);
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
          setTurns((t) => [
            ...t,
            { id: crypto.randomUUID(), role: "assistant", content: chunk },
          ]);
        } else {
          setTurns((t) =>
            t.map((m, i) =>
              i === t.length - 1 ? { ...m, content: m.content + chunk } : m,
            ),
          );
        }
      }
      if (!started) {
        setAwaiting(false);
        setTurns((t) => [
          ...t,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Non ho ricevuto una risposta. Riprova.",
            error: true,
          },
        ]);
      }
    } catch {
      setAwaiting(false);
      setTurns((t) => [
        ...t,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Connessione interrotta. Riprova.",
          error: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const userTurn: Turn = { id: crypto.randomUUID(), role: "user", content };
    const updated = [...turns, userTurn];
    setTurns(updated);
    setInput("");
    resetTextareaHeight();
    void runCompletion(toApiMessages(updated));
  }

  function retry() {
    if (busy) return;
    const cleaned = turns.filter((t) => !t.error);
    if (cleaned.length === 0) return;
    setTurns(cleaned);
    void runCompletion(toApiMessages(cleaned));
  }

  function newConversation() {
    if (busy) return;
    setTurns([]);
    setInput("");
    resetTextareaHeight();
  }

  function copy(id: string, text: string) {
    void navigator.clipboard?.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((c) => (c === id ? null : c));
    }, 1500);
  }

  const empty = turns.length === 0 && !awaiting;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        compact ? "pt-2" : "py-4 sm:py-6",
      )}
    >
      <header
        className={cn(
          "flex shrink-0 items-center justify-between gap-3 pb-3",
          // lascia spazio al pulsante "Chiudi" della bubble (assoluto in alto a destra).
          compact && "pr-10",
        )}
      >
        <h1
          className={cn(
            "font-semibold",
            compact ? "text-lg" : "text-2xl sm:text-3xl",
          )}
        >
          Assistente
        </h1>
        {turns.length > 0 && (
          <button
            type="button"
            onClick={newConversation}
            disabled={busy}
            aria-label="Nuova conversazione"
            className="glass flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-mute transition-colors hover:text-ink disabled:opacity-45"
          >
            <SquarePen aria-hidden="true" className="size-3.5" />
            <span className={cn(compact && "sr-only")}>Nuova conversazione</span>
          </button>
        )}
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="off"
        aria-label="Conversazione con l'assistente"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-0.5 py-2"
      >
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="bg-primary-gradient shadow-accent flex size-16 items-center justify-center rounded-2xl">
              <Sparkles aria-hidden="true" className="size-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-ink">Come posso aiutarti?</h2>
              <p className="muted mt-1.5 text-sm">
                Conosco i tuoi esami, l&rsquo;orario, il libretto e le ore di studio.
              </p>
            </div>
            <div
              className={cn(
                "grid w-full max-w-xl grid-cols-1 gap-2.5",
                !compact && "sm:grid-cols-2",
              )}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => send(s.prompt)}
                  className="glass rounded-xl border border-line px-4 py-3 text-left text-sm text-ink transition-colors hover:border-signal/50 hover:bg-night-700"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {turns.map((t) =>
              t.role === "user" ? (
                <div key={t.id} className="flex justify-end">
                  <div className="bg-primary-gradient max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed text-white">
                    {t.content}
                  </div>
                </div>
              ) : (
                <div key={t.id} className="flex gap-2.5">
                  <AiAvatar />
                  <div className="group min-w-0 flex-1">
                    <div
                      className={cn(
                        "glass rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed text-ink",
                        t.error && "border border-danger/40",
                      )}
                    >
                      {t.error ? (
                        <span>{t.content}</span>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={MD_COMPONENTS}
                        >
                          {t.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {t.error ? (
                        <button
                          type="button"
                          onClick={retry}
                          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-signal transition-colors hover:underline"
                        >
                          <RotateCcw aria-hidden="true" className="size-3" />
                          Riprova
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => copy(t.id, t.content)}
                          aria-label="Copia la risposta"
                          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-ink-mute opacity-0 transition-opacity hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          {copiedId === t.id ? (
                            <>
                              <Check aria-hidden="true" className="size-3" />
                              Copiato
                            </>
                          ) : (
                            <>
                              <Copy aria-hidden="true" className="size-3" />
                              Copia
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}

            {awaiting && (
              <div className="flex gap-2.5">
                <AiAvatar />
                <div className="glass flex flex-col gap-1.5 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-2 animate-pulse rounded-full bg-signal"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-ink-mute">
                    StudentOS sta pensando…
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Il log sopra è aria-live="off" così lo screen reader non rilegge ogni
          token in streaming; qui annunciamo la risposta completa una volta sola
          quando lo streaming termina (busy/awaiting tornano falsi). */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {!busy &&
        !awaiting &&
        turns.length > 0 &&
        turns[turns.length - 1].role === "assistant" &&
        !turns[turns.length - 1].error
          ? turns[turns.length - 1].content
          : ""}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="shrink-0 pt-3"
      >
        <div className="glass flex items-end gap-2 rounded-2xl border border-line p-2 transition-colors focus-within:border-signal/50">
          <label htmlFor="assistant-input" className="sr-only">
            Scrivi un messaggio
          </label>
          <textarea
            id="assistant-input"
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea();
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Chiedimi degli esami, dell'orario, della tua media…"
            className="placeholder:text-ink-faint max-h-[132px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-ink outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Invia messaggio"
            className="btn btn-primary shrink-0 disabled:pointer-events-none disabled:opacity-45"
            style={{ padding: "0.6rem 0.9rem" }}
          >
            <Send aria-hidden="true" className="size-4" />
          </button>
        </div>
        <p className="muted mt-1.5 text-center text-[0.7rem]">
          L&rsquo;assistente può sbagliare. Verifica le informazioni importanti.
        </p>
      </form>
    </div>
  );
}

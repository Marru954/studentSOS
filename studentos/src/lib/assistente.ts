/**
 * Shared types + the pure system-prompt builder for the /assistente chat.
 * Framework-free and deterministic: the client gathers the student context from
 * the stores (already locale-formatted) and the API route turns it into the
 * system prompt. Kept here so both sides share one source of truth.
 */

export interface AssistantExam {
  courseName: string;
  /** Already locale-formatted, e.g. "22 giu". */
  date: string;
  /** "HH:MM" when known. */
  time?: string;
}

export interface AssistantLesson {
  courseName: string;
  /** Already locale-formatted span, e.g. "09:00–11:00". */
  time: string;
  room?: string;
}

export interface AssistantContext {
  ateneo?: string;
  programme?: string;
  year?: number;
  upcomingExams: AssistantExam[];
  todayLessons: AssistantLesson[];
  /** Weighted average, undefined when no graded exam yet. */
  average?: number;
  earnedCfu: number;
  focusMinutesThisWeek: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Build the Italian system prompt from the student's live context. Pure. */
export function buildSystemPrompt(ctx: AssistantContext): string {
  const exams = ctx.upcomingExams.length
    ? ctx.upcomingExams
        .map((e) => `${e.courseName} (${e.date}${e.time ? ` ore ${e.time}` : ""})`)
        .join("; ")
    : "nessuno in programma";

  const lessons = ctx.todayLessons.length
    ? ctx.todayLessons
        .map((l) => `${l.courseName} ${l.time}${l.room ? ` · ${l.room}` : ""}`)
        .join("; ")
    : "nessuna lezione oggi";

  const media =
    ctx.average === undefined
      ? "non disponibile"
      : ctx.average.toFixed(2).replace(".", ",");

  return [
    "Sei l'assistente universitario di StudentOS. Conosci tutti i dati dello studente:",
    `- Ateneo: ${ctx.ateneo ?? "non impostato"}, Corso: ${ctx.programme ?? "non impostato"}, Anno: ${ctx.year ?? "non impostato"}`,
    `- Prossimi esami: ${exams}`,
    `- Lezioni di oggi: ${lessons}`,
    `- Libretto: media ${media}, ${ctx.earnedCfu} CFU acquisiti`,
    `- Focus: ${ctx.focusMinutesThisWeek} minuti studiati questa settimana`,
    "Rispondi sempre in italiano. Sii concreto, diretto e utile. Mai rispondere con liste lunghissime — max 3-4 punti. Se non hai i dati per rispondere, dillo chiaramente.",
  ].join("\n");
}

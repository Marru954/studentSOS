"use client";

/** Local reminders for imminent exams and booking deadlines, driven by the
 *  pure urgency engine. Notifications fire while a tab (or the registered
 *  service worker) is alive — true background push would need a server, which
 *  this offline-first app doesn't have. Each urgency is shown at most once per
 *  day (deduped in localStorage). */
import type { ClassEvent, ExamCall } from "@/lib/domain/types";
import { computeUrgencies } from "@/lib/domain/urgency";

export type PermissionState = NotificationPermission | "unsupported";

const SEEN_KEY = "studentos-notified";

function supported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

// ── external store so React reads permission without a mount-effect setState ──
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}
export function subscribePermission(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getPermissionSnapshot(): PermissionState {
  return supported() ? Notification.permission : "unsupported";
}
export function getPermissionServerSnapshot(): PermissionState {
  return "default";
}

export async function requestNotifyPermission(): Promise<PermissionState> {
  if (!supported()) return "unsupported";
  try {
    const res = await Notification.requestPermission();
    emit();
    return res;
  } catch {
    return "denied";
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function seenToday(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "{}");
    return raw.day === todayKey() ? new Set<string>(raw.ids ?? []) : new Set();
  } catch {
    return new Set();
  }
}

function persistSeen(ids: Set<string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify({ day: todayKey(), ids: [...ids] }));
  } catch {
    // storage unavailable (private mode) — reminders just won't dedupe
  }
}

/** Fire a notification for each new critical/warning urgency not yet shown
 *  today. Returns how many were fired. No-op unless permission is granted. */
export function runReminderCheck(
  classEvents: ClassEvent[],
  examCalls: ExamCall[],
  now: Date,
): number {
  if (getPermissionSnapshot() !== "granted") return 0;
  const seen = seenToday();
  const due = computeUrgencies(classEvents, examCalls, now).filter(
    (u) => u.severity === "critical" || u.severity === "warning",
  );
  let fired = 0;
  for (const u of due) {
    if (seen.has(u.id)) continue;
    try {
      new Notification("StudentOS", { body: u.message, tag: u.id, icon: "/icon.svg" });
      seen.add(u.id);
      fired++;
    } catch {
      // construction can throw on some platforms — skip
    }
  }
  persistSeen(seen);
  return fired;
}

"use client";

/** Promemoria di chiusura iscrizione: avvisa quando la finestra di iscrizione a
 *  un appello sta per chiudere (entro 48h). Se le notifiche del browser sono
 *  attive, ne invia una per ogni nuovo appello in scadenza (deduplicata in
 *  localStorage così parte una volta sola); altrimenti mostra un banner in-app.
 *  Ricontrolla al mount e quando la scheda torna visibile (visibilitychange). */
import { TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { examsClosingWithin } from "@/lib/domain/booking";
import { fmtPlainDayMonth, localToday } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import {
  getPermissionServerSnapshot,
  getPermissionSnapshot,
  requestNotifyPermission,
  subscribePermission,
} from "@/lib/notifications";
import { useSynced } from "@/lib/state/synced";

/** Finestra entro cui considerare un'iscrizione "in chiusura". */
const CLOSING_HOURS = 48;
/** localStorage: id degli appelli per cui abbiamo già notificato la chiusura. */
const NOTIFIED_KEY = "studentos-notified-closings";

function notifiedSet(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? "[]");
    return new Set<string>(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

function persistNotified(ids: Set<string>) {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]));
  } catch {
    // storage non disponibile (es. navigazione privata) — niente dedupe
  }
}

export function BookingReminders({ className }: { className?: string }) {
  const examCalls = useSynced((s) => s.examCalls);
  const now = useNowMinute();
  const perm = useSyncExternalStore(
    subscribePermission,
    getPermissionSnapshot,
    getPermissionServerSnapshot,
  );

  // Bump on `visibilitychange` (quando la scheda torna visibile) per ricalcolare
  // gli appelli in scadenza. Listener con cleanup → consentito da react-hooks.
  const [visibleTick, setVisibleTick] = useState(0);
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setVisibleTick((t) => t + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const closing = useMemo(() => {
    if (now === null) return [];
    return examsClosingWithin(examCalls, localToday(now), CLOSING_HOURS);
    // `visibleTick` forza il ricalcolo al ritorno in primo piano.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examCalls, now, visibleTick]);

  // Effetto side: chiede il permesso una volta sola alla prima urgenza, oppure
  // — se concesso — invia una notifica per ogni appello non ancora notificato.
  useEffect(() => {
    if (closing.length === 0) return;
    if (perm === "default") {
      void requestNotifyPermission();
      return;
    }
    if (perm !== "granted") return;
    const seen = notifiedSet();
    let changed = false;
    for (const exam of closing) {
      if (seen.has(exam.id)) continue;
      try {
        new Notification("StudentOS · Iscrizione in chiusura", {
          body: `${exam.courseName} — iscrizione entro il ${fmtPlainDayMonth(
            exam.booking!.closesAt!,
          )}`,
          tag: `closing-${exam.id}`,
          icon: "/icon.svg",
        });
        seen.add(exam.id);
        changed = true;
      } catch {
        // la costruzione può fallire su alcune piattaforme — si salta
      }
    }
    if (changed) persistNotified(seen);
  }, [closing, perm]);

  // Banner in-app solo quando ci sono scadenze E le notifiche non sono attive.
  if (closing.length === 0 || perm === "granted") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`glass flex flex-col gap-2 rounded-lg border border-warn/40 bg-warn-dim px-4 py-3 text-sm ${className ?? ""}`}
    >
      <p className="flex items-center gap-2 font-medium text-warn">
        <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
        Iscrizioni in chiusura
      </p>
      <ul className="flex flex-col gap-1 text-ink-mute">
        {closing.map((exam) => (
          <li key={exam.id}>
            <span className="text-ink">{exam.courseName}</span>
            {" — entro "}
            {fmtPlainDayMonth(exam.booking!.closesAt!)}
          </li>
        ))}
      </ul>
    </div>
  );
}

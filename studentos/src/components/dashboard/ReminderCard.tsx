"use client";

/** Opt-in local reminders for exam deadlines. Uses the browser Notification
 *  API; fires while the app/SW is alive (no server, no background push). */
import { Bell, BellOff, BellRing } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { Panel } from "@/components/primitives/Panel";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import {
  getPermissionServerSnapshot,
  getPermissionSnapshot,
  requestNotifyPermission,
  runReminderCheck,
  subscribePermission,
} from "@/lib/notifications";
import { useToast } from "@/lib/state/toast";
import { useSynced } from "@/lib/state/synced";

export function ReminderCard({ className }: { className?: string }) {
  const classEvents = useSynced((s) => s.classEvents);
  const examCalls = useSynced((s) => s.examCalls);
  const now = useNowMinute();
  const perm = useSyncExternalStore(
    subscribePermission,
    getPermissionSnapshot,
    getPermissionServerSnapshot,
  );

  // when reminders are on, re-check on each tick (deduped per day)
  useEffect(() => {
    if (perm === "granted" && now) runReminderCheck(classEvents, examCalls, now);
  }, [perm, now, classEvents, examCalls]);

  async function enable() {
    const res = await requestNotifyPermission();
    if (res === "granted" && now) {
      const n = runReminderCheck(classEvents, examCalls, now);
      useToast.getState().show(
        n > 0 ? `Promemoria attivi · ${n} avvisi inviati.` : "Promemoria attivi.",
        "ok",
      );
    } else if (res === "denied") {
      useToast.getState().show("Permesso negato dal browser.", "warn");
    }
  }

  return (
    <Panel title="Promemoria" icon={<Bell />} className={className}>
      {perm === "granted" ? (
        <div className="flex items-center gap-3 text-sm">
          <BellRing aria-hidden="true" className="size-5 shrink-0 text-ok" />
          <p className="text-ink-mute">
            Attivi. Ti avvisiamo per appelli imminenti e scadenze di iscrizione
            quando l&rsquo;app è aperta.
          </p>
        </div>
      ) : perm === "unsupported" ? (
        <div className="flex items-center gap-3 text-sm">
          <BellOff aria-hidden="true" className="size-5 shrink-0 text-ink-faint" />
          <p className="text-ink-mute">
            Il tuo browser non supporta le notifiche.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-ink-mute">
            Ricevi un avviso quando un appello si avvicina o un&rsquo;iscrizione
            sta per chiudere. Tutto in locale, nessun account.
          </p>
          <button
            type="button"
            onClick={() => void enable()}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <Bell aria-hidden="true" className="size-4" />
            Attiva promemoria
          </button>
          {perm === "denied" && (
            <p className="text-xs text-warn">
              Permesso negato: riattivalo dalle impostazioni del browser.
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}

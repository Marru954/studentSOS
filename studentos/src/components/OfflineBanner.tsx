"use client";

/**
 * Gentle "you're offline" pill. StudentOS is offline-first — IndexedDB is the
 * source of truth — so losing the network is not an error: the cached data is
 * still fully usable. We just reassure the user instead of showing a broken
 * state. Online status is read via useSyncExternalStore (no setState-in-effect).
 */
import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

const getSnapshot = () => navigator.onLine;
// Assume online during SSR / first paint so the banner never flashes on load.
const getServerSnapshot = () => true;

export function OfflineBanner() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (online) return null;
  return (
    <div
      role="status"
      className="glass fixed inset-x-0 bottom-[76px] z-40 mx-auto flex w-fit max-w-[92vw] items-center gap-2 rounded-full px-4 py-2 text-sm text-ink shadow-soft sm:bottom-5"
    >
      <WifiOff aria-hidden="true" className="size-4 text-[var(--warn)]" />
      <span>
        Sei offline — stai vedendo i dati salvati. Si aggiorneranno appena torni
        online.
      </span>
    </div>
  );
}

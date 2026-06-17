import { LIVE_ATENEI } from "@/lib/liveAtenei";

/** Social proof onesta: i nomi REALI degli atenei con sync live (orari ed esami
 *  ufficiali in automatico). Solo nomi, niente loghi (non esistono nel repo +
 *  licenze), nessun dato su utenti — parla di copertura, non di popolarità. */
export function AteneoStrip() {
  return (
    <section className="wrap py-8 text-center">
      <p className="reveal eyebrow">Orari ed esami ufficiali di</p>
      <ul className="reveal mx-auto mt-4 flex max-w-[60rem] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-ink-mute">
        {LIVE_ATENEI.map((name, i) => (
          <li key={name} className="flex items-center gap-x-4">
            {i > 0 && <span aria-hidden="true" className="text-ink-faint">·</span>}
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}

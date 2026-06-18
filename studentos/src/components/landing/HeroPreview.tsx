import {
  CalendarClock,
  Gauge,
  Lock,
  TrendingUp,
} from "lucide-react";

/** Mockup STATICO del panoramica dentro una finta finestra del browser, mostrato
 *  nell'hero della landing. Puramente decorativo (`aria-hidden`): non legge lo
 *  store, non è interattivo, non ha link — è uno "screenshot" finto fatto con i
 *  token del design system (glass, gradient-ring, --signal-2). Dati plausibili
 *  ma inventati. Resta server component: nessuno stato, nessun effetto. */
export function HeroPreview() {
  return (
    <div
      aria-hidden="true"
      className="reveal mx-auto mt-14 w-full max-w-[920px] select-none"
    >
      <div className="glass gradient-ring shadow-soft relative overflow-hidden rounded-xl">
        {/* glow locale (l'.atmosphere globale è fixed e non riusabile qui) */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -z-0 size-[420px] -translate-x-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle at center, var(--glow-1), transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        {/* barra del browser */}
        <div className="relative flex items-center gap-3 border-b border-[var(--hairline)] px-4 py-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="size-3 rounded-full" style={{ background: "var(--danger)" }} />
            <span className="size-3 rounded-full" style={{ background: "var(--warn)" }} />
            <span className="size-3 rounded-full" style={{ background: "var(--ok)" }} />
          </div>
          <div className="glass-2 mx-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-ink-mute">
            <Lock className="size-3" />
            studentos.app/panoramica
          </div>
          <span className="chip chip-signal shrink-0">Esempio</span>
        </div>

        {/* contenuto panoramica (statico) */}
        <div className="relative p-4 sm:p-6">
          {/* header mini */}
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-xl font-bold text-ink">Panoramica</div>
            <span className="chip chip-signal">Mercoledì 18 giugno</span>
          </div>

          {/* riga hero: prossimo esame + carriera/cfu */}
          <div className="grid gap-3 lg:grid-cols-5">
            {/* prossimo esame */}
            <div className="glass accent-top relative overflow-hidden rounded-xl p-5 lg:col-span-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-mute">
                <CalendarClock className="size-3.5" />
                Prossimo esame
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span
                  className="font-num text-[clamp(2.6rem,7vw,3.6rem)] font-extrabold leading-none [font-family:var(--font-display)]"
                  style={{ color: "var(--signal-2)" }}
                >
                  3
                </span>
                <span className="mb-1 text-sm text-ink-mute">giorni</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">Analisi Matematica I</h3>
              <p className="mt-0.5 text-sm text-ink-mute">21 giugno · ore 9:00 · Aula B2</p>
              {/* barra di avanzamento */}
              <div
                className="mt-4 h-1.5 overflow-hidden rounded-full"
                style={{ background: "var(--hairline)" }}
              >
                <div className="grad-fill h-full rounded-full" style={{ width: "72%" }} />
              </div>
            </div>

            {/* colonna carriera + cfu */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              <div className="glass flex items-center gap-3 rounded-xl px-4 py-3.5">
                <TrendingUp className="size-[1.125rem] shrink-0 text-[var(--signal-2)]" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink">Carriera</div>
                  <div className="text-sm text-ink-mute">
                    Media{" "}
                    <strong className="font-num text-[var(--signal-2)]">27,4</strong>
                    {" · "}
                    Base <strong className="font-num text-ink">102</strong>
                    <span className="text-ink-faint">/110</span>
                  </div>
                </div>
              </div>
              <div className="glass flex items-center gap-3 rounded-xl px-4 py-3.5">
                <Gauge className="size-[1.125rem] shrink-0 text-[var(--signal-2)]" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink">CFU</div>
                  <div className="font-num text-sm text-ink-mute">
                    84/180 · mancano 96
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* riga sotto: oggi + appelli in arrivo */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {/* oggi */}
            <div className="glass rounded-xl p-5">
              <div className="mb-3 text-sm font-semibold text-ink">Oggi</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  { t: "9:00–11:00", c: "Reti di Calcolatori" },
                  { t: "11:30–13:00", c: "Basi di Dati" },
                  { t: "14:00–16:00", c: "Laboratorio di Sistemi" },
                ].map((r) => (
                  <li key={r.t} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-ink-mute">{r.t}</span>
                    <span className="text-sm text-ink">{r.c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* appelli in arrivo */}
            <div className="glass rounded-xl p-5">
              <div className="mb-3 text-sm font-semibold text-ink">Appelli in arrivo</div>
              <ul className="flex flex-col gap-2.5">
                {[
                  { d: "21", m: "GIU", c: "Analisi Matematica I", chip: "tra 3 giorni", tone: "chip-warn" },
                  { d: "28", m: "GIU", c: "Fisica Generale", chip: "tra 10 giorni", tone: "chip-signal" },
                  { d: "05", m: "LUG", c: "Algoritmi", chip: "tra 17 giorni", tone: "chip-signal" },
                ].map((e) => (
                  <li key={e.d} className="flex items-center gap-3">
                    <div className="text-center leading-none">
                      <div className="font-display text-[1.05rem] font-bold text-ink">{e.d}</div>
                      <div className="text-[0.65rem] uppercase tracking-wide text-ink-faint">{e.m}</div>
                    </div>
                    <span className="flex-1 truncate text-sm text-ink">{e.c}</span>
                    <span className={`chip ${e.tone} shrink-0`}>{e.chip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* sfuma il fondo nello sfondo pagina (effetto screenshot) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        />
      </div>
    </div>
  );
}

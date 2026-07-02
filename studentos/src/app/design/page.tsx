import type { Metadata } from "next";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Panel } from "@/components/primitives/Panel";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { Sparkline } from "@/components/primitives/Sparkline";
import { Stat } from "@/components/primitives/Stat";

export const metadata: Metadata = { title: "Design system" };

// I nomi legacy night-* rimappano sui token immersive ([data-theme] in
// globals.css): night-950→--bg-2, 900→--bg, 800→--surface, 700→--hover.
const SWATCHES = [
  ["night-950 (--bg-2)", "bg-night-950", "pozzi, blocchi di codice"],
  ["night-900 (--bg)", "bg-night-900", "fondo applicazione"],
  ["night-800 (--surface)", "bg-night-800", "superficie glass"],
  ["night-700 (--hover)", "bg-night-700", "overlay, hover"],
  ["line", "bg-line", "bordi"],
  ["signal", "bg-signal", "interazione, live"],
  ["signal-2", "bg-[var(--signal-2)]", "accento display, icone"],
  ["signal-3", "bg-[var(--signal-3)]", "accento freddo, aurora"],
  ["signal-text", "bg-signal-text", "micro-link AA"],
  ["warn", "bg-warn", "scadenze"],
  ["danger", "bg-danger", "critico"],
  ["ok", "bg-ok", "esito positivo"],
] as const;

// Le superfici del bento: la gerarchia si fa con l'elevazione, non con
// colori per-componente.
const SURFACES = [
  ["glass", "glass", "card base: blur + hairline"],
  ["panel-hero accent-top", "glass panel-hero accent-top", "card primaria: ombra profonda + filo gradiente"],
  ["gradient-ring", "glass gradient-ring", "bordo gradiente 1px, edge premium"],
  ["card-glow", "glass card-glow", "alone radiale interno, superfici CTA"],
] as const;

export default function DesignPage() {
  return (
    <main id="contenuto" className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <header className="mb-10">
        <p className="text-label font-medium text-signal">StudentOS / design system</p>
        <h1 className="mt-2 text-2xl font-semibold">Strumento</h1>
        <p className="mt-1 max-w-xl text-sm text-ink-mute">
          Strumentazione di precisione per la carriera universitaria: superfici
          glass su un&rsquo;aurora in deriva, segnale indigo→violetto, display
          Bricolage Grotesque, dati sempre in colonna. Tutto è token CSS
          (&nbsp;<code className="font-mono">[data-theme]</code> in
          globals.css&nbsp;): il reskin si fa lì, mai per-componente.
        </p>
      </header>

      <div className="grid gap-6">
        <Panel title="Superfici e segnali">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {SWATCHES.map(([name, bg, use]) => (
              <li key={name} className="flex flex-col gap-1.5">
                <span className={`h-12 rounded-sm border border-line ${bg}`} />
                <span className="font-mono text-xs text-ink">{name}</span>
                <span className="text-xs text-ink-mute">{use}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Pulsanti — tutti gli stati">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Sincronizza ora</Button>
              <Button variant="primary" loading>
                Sincronizzazione…
              </Button>
              <Button variant="primary" disabled>
                Sincronizza ora
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Apri orario</Button>
              <Button loading>Caricamento…</Button>
              <Button disabled>Apri orario</Button>
              <Button size="sm">Dettagli</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="danger">Elimina nota</Button>
              <Button variant="danger" disabled>
                Elimina nota
              </Button>
            </div>
            <p className="text-xs text-ink-mute">
              Hover, attivo e focus da tastiera (anello indigo{" "}
              <code className="font-mono">--signal</code>) sono definiti per
              ogni variante; lo stato di caricamento blocca l&apos;interazione e imposta{" "}
              <code className="font-mono">aria-busy</code>.
            </p>
          </div>
        </Panel>

        <Panel title="Superfici immersive">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SURFACES.map(([name, cls, use]) => (
              <div key={name} className="flex flex-col gap-1.5">
                <div className={`${cls} h-24 rounded-xl`} aria-hidden="true" />
                <span className="font-mono text-xs text-ink">.{name.replace(/ /g, ".")}</span>
                <span className="text-xs text-ink-mute">{use}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Badge di stato">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge dot tone="signal">
              sync attiva
            </Badge>
            <Badge tone="warn">aula cambiata</Badge>
            <Badge tone="danger">prenotazione in scadenza</Badge>
            <Badge tone="ok">registrato</Badge>
            <Badge>archiviato</Badge>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel title="Letture numeriche">
            <div className="flex flex-wrap items-end gap-10">
              <Stat
                label="Media ponderata"
                value="27,4"
                delta={{ text: "+0,2", tone: "ok" }}
                hint="ultimi 4 esami"
              />
              <Stat label="Base di laurea" value="100,5" unit="/110" />
              <div className="flex flex-col gap-1">
                <span className="text-label font-medium text-ink-mute">
                  Andamento voti
                </span>
                <Sparkline
                  label="Andamento voti: da 25 a 28 negli ultimi sei esami"
                  values={[25, 26, 24, 27, 28, 27, 28]}
                  width={140}
                  height={36}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Avanzamento CFU">
            <div className="flex items-center gap-6">
              <ProgressRing value={96 / 180} label="96 CFU su 180">
                <span className="text-lg font-medium text-ink">96</span>
                <span className="text-xs text-ink-mute">/180 CFU</span>
              </ProgressRing>
              <p className="max-w-[26ch] text-sm text-ink-mute">
                Anello a capo netto, nessun bagliore: un indicatore, non una medaglia.
              </p>
            </div>
          </Panel>
        </div>

        <Panel title="Tabella dati — appelli" flush>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-label font-medium text-ink-mute">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Insegnamento
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Data
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Aula
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Stato
                </th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-line/60 transition-colors hover:bg-night-700/50">
                <td className="px-4 py-2.5 font-sans">Calcolo delle probabilità</td>
                <td className="px-4 py-2.5">19-06 10:00</td>
                <td className="px-4 py-2.5">Aula 18</td>
                <td className="px-4 py-2.5">
                  <Badge tone="danger">scade tra 2g</Badge>
                </td>
              </tr>
              <tr className="transition-colors hover:bg-night-700/50">
                <td className="px-4 py-2.5 font-sans">Basi di dati e conoscenza</td>
                <td className="px-4 py-2.5">03-07 09:30</td>
                <td className="px-4 py-2.5">Aula T5</td>
                <td className="px-4 py-2.5">
                  <Badge tone="signal">prenotabile</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </div>
    </main>
  );
}

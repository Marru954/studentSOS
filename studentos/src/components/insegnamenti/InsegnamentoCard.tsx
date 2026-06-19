"use client";

/** Card di un insegnamento, espandibile. Chiusa mostra l'essenziale (nome, CFU,
 *  semestre, tipo, "Superata"); il click la espande con tutto il resto (codice,
 *  SSD, docente, anno, propedeuticità, provenienza, note) e le azioni. Ogni card
 *  gestisce il proprio stato di apertura: più card possono restare aperte
 *  insieme (utile per confrontarle). L'animazione è pura CSS (grid-rows 0fr→1fr,
 *  neutralizzata dal reset globale prefers-reduced-motion). */
import { BookOpen, ChevronDown, CheckCircle2, Hash, User } from "lucide-react";
import { useId, useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/cn";
import type { Insegnamento } from "@/types/insegnamenti";
import { InsegnamentoActions } from "./InsegnamentoActions";

const SEMESTRE_LABEL: Record<string, string> = {
  "1": "1° sem",
  "2": "2° sem",
  annuale: "annuale",
};

const ANNO_LABEL: Record<string, string> = {
  "1": "I Anno",
  "2": "II Anno",
  "3": "III Anno",
  "4": "IV Anno",
  "5": "V Anno",
};

const TIPO_CHIP: Record<Insegnamento["tipo"], { cls: string; label: string }> = {
  obbligatorio: { cls: "chip", label: "obbligatorio" },
  scelta: { cls: "chip chip-signal", label: "a scelta" },
  altro: { cls: "chip", label: "altro" },
};

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.7rem] uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

export function InsegnamentoCard({
  insegnamento: ins,
  superata,
  onEdit,
  onDelete,
}: {
  insegnamento: Insegnamento;
  superata: boolean;
  onEdit: (ins: Insegnamento) => void;
  onDelete: (ins: Insegnamento) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const sem = ins.semestre !== undefined ? String(ins.semestre) : undefined;
  const semestreLabel = sem ? (SEMESTRE_LABEL[sem] ?? sem) : undefined;
  const annoLabel = ins.anno ? (ANNO_LABEL[String(ins.anno)] ?? `Anno ${ins.anno}`) : undefined;
  const tipoChip = TIPO_CHIP[ins.tipo];

  return (
    <article
      className={cn(
        "glass lift flex flex-col rounded-lg",
        superata && "opacity-75",
      )}
    >
      {/* Header cliccabile (toggle) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${ins.nome}${superata ? ", superata" : ""} — ${open ? "comprimi" : "espandi"} dettagli`}
        className="flex w-full flex-col gap-3 rounded-lg p-[1.2rem] text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-[1rem] font-semibold leading-snug text-ink [font-family:var(--font-display)]">
            {ins.nome}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "mt-0.5 size-4 shrink-0 text-ink-mute transition-transform duration-300",
              open && "rotate-180",
            )}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={tipoChip.cls}>{tipoChip.label}</span>
          <Badge tone="neutral">
            <BookOpen aria-hidden="true" className="size-3" />
            {ins.cfu} CFU
          </Badge>
          {semestreLabel && <Badge tone="neutral">{semestreLabel}</Badge>}
          {superata && (
            <Badge tone="ok">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              Superata
            </Badge>
          )}
        </div>
      </button>

      {/* Pannello espandibile (CSS: grid-rows 0fr→1fr) */}
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 border-t border-line px-[1.2rem] py-4">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {ins.codice && (
                <Detail label="Codice">
                  <span className="inline-flex items-center gap-1 font-mono text-[0.8rem]">
                    <Hash aria-hidden="true" className="size-3 text-ink-faint" />
                    {ins.codice}
                  </span>
                </Detail>
              )}
              {ins.settore && (
                <Detail label="Settore (SSD)">
                  <span className="font-mono text-[0.8rem]">{ins.settore}</span>
                </Detail>
              )}
              {ins.docente && (
                <Detail label="Docente">
                  <span className="inline-flex items-center gap-1">
                    <User aria-hidden="true" className="size-3 text-ink-faint" />
                    {ins.docente}
                  </span>
                </Detail>
              )}
              {annoLabel && <Detail label="Anno">{annoLabel}</Detail>}
            </dl>

            {ins.propedeuticita && ins.propedeuticita.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[0.7rem] uppercase tracking-wide text-ink-faint">
                  Propedeuticità
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {ins.propedeuticita.map((p) => (
                    <Badge key={p} tone="warn">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {ins.note && (
              <div className="flex flex-col gap-1">
                <span className="text-[0.7rem] uppercase tracking-wide text-ink-faint">
                  Note personali
                </span>
                <p className="whitespace-pre-wrap text-sm text-ink-mute">{ins.note}</p>
              </div>
            )}

            {/* Provenienza */}
            <div>
              {ins.inserito_manualmente ? (
                <Badge tone="signal">Inserito manualmente</Badge>
              ) : ins.modificato_manualmente ? (
                <Badge tone="signal">Da sync · modificato da te</Badge>
              ) : (
                <Badge tone="neutral">Sincronizzato dall&apos;ateneo</Badge>
              )}
            </div>

            {/* Azioni */}
            <InsegnamentoActions
              insegnamento={ins}
              onEdit={onEdit}
              onDelete={onDelete}
              className="pt-1"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

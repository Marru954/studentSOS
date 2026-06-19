import { BookOpen, CheckCircle2, User } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/cn";
import type { Insegnamento } from "@/types/insegnamenti";

const SEMESTRE_LABEL: Record<string, string> = {
  "1": "1° sem",
  "2": "2° sem",
  annuale: "annuale",
};

const TIPO_CHIP: Record<Insegnamento["tipo"], { cls: string; label: string }> = {
  obbligatorio: { cls: "chip",         label: "obbligatorio" },
  scelta:       { cls: "chip chip-signal", label: "a scelta" },
  altro:        { cls: "chip",         label: "altro" },
};

export function InsegnamentoCard({
  insegnamento: ins,
  superata,
}: {
  insegnamento: Insegnamento;
  superata: boolean;
}) {
  const sem = ins.semestre !== undefined ? String(ins.semestre) : undefined;
  const semestreLabel = sem ? (SEMESTRE_LABEL[sem] ?? sem) : undefined;
  const tipoChip = TIPO_CHIP[ins.tipo];

  return (
    <article
      className={cn(
        "glass lift flex flex-col gap-3 rounded-lg p-[1.2rem]",
        superata && "opacity-75",
      )}
      aria-label={`${ins.nome}${superata ? ", superata" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[1rem] font-semibold leading-snug text-ink [font-family:var(--font-display)]">
          {ins.nome}
        </h3>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <span className={tipoChip.cls}>{tipoChip.label}</span>
          {superata && (
            <Badge tone="ok" className="shrink-0">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              Superata
            </Badge>
          )}
        </div>
      </div>

      {/* CFU + Semestre */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">
          <BookOpen aria-hidden="true" className="size-3" />
          {ins.cfu} CFU
        </Badge>
        {semestreLabel && (
          <Badge tone="neutral">{semestreLabel}</Badge>
        )}
      </div>

      {/* Settore + Docente */}
      {(ins.settore || ins.docente) && (
        <dl className="faint flex flex-col gap-0.5 text-xs">
          {ins.settore && (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Settore scientifico-disciplinare</dt>
              <dd className="font-mono text-[0.75rem]">{ins.settore}</dd>
            </div>
          )}
          {ins.docente && (
            <div className="flex items-center gap-1.5">
              <User aria-hidden="true" className="size-3 shrink-0" />
              <dt className="sr-only">Docente</dt>
              <dd className="truncate">{ins.docente}</dd>
            </div>
          )}
        </dl>
      )}

      {/* Propedeuticità */}
      {ins.propedeuticita && ins.propedeuticita.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="faint text-xs">propedeutica a:</span>
          {ins.propedeuticita.map((p) => (
            <Badge key={p} tone="warn">
              {p}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}

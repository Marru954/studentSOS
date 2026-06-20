"use client";

/** Vista tabella del piano di studi. Stesse materie della vista card, in forma
 *  densa: una colonna per dato, raggruppate per anno (righe-intestazione). Il
 *  click su una riga ne espande i dettagli (provenienza, note, azioni) in una
 *  sotto-riga, con la stessa animazione CSS delle card. Su mobile la tabella
 *  scrolla orizzontalmente (`overflow-x-auto`) invece di rompersi. */
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Fragment, useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/cn";
import type { Insegnamento } from "@/types/insegnamenti";
import { InsegnamentoActions } from "./InsegnamentoActions";

const SEMESTRE_LABEL: Record<string, string> = {
  "1": "1°",
  "2": "2°",
  annuale: "Annuale",
};

const COLUMNS = [
  "Insegnamento",
  "Codice",
  "Settore",
  "CFU",
  "Semestre",
  "Docente",
  "Propedeuticità",
] as const;

const COL_COUNT = COLUMNS.length;

function semLabel(ins: Insegnamento): string {
  if (ins.semestre === undefined) return "—";
  const key = String(ins.semestre);
  return SEMESTRE_LABEL[key] ?? key;
}

export function InsegnamentoTable({
  groups,
  materieSuperate,
  onEdit,
  onDelete,
}: {
  /** Materie già raggruppate per anno (etichetta → righe), nell'ordine di resa. */
  groups: [string, Insegnamento[]][];
  materieSuperate: Set<string>;
  onEdit: (ins: Insegnamento) => void;
  onDelete: (ins: Insegnamento) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="glass overflow-x-auto rounded-lg">
      <table className="w-full min-w-[56rem] border-collapse text-sm">
        <caption className="sr-only">
          Piano di studi: insegnamenti raggruppati per anno
        </caption>
        <thead>
          <tr className="border-b border-line text-left">
            {COLUMNS.map((c) => (
              <th
                key={c}
                scope="col"
                className={cn(
                  "px-3 py-2.5 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-mute",
                  c === "CFU" && "text-right",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>

        {groups.map(([gruppo, items]) => (
          <tbody key={gruppo}>
            <tr>
              <th
                scope="colgroup"
                colSpan={COL_COUNT}
                className="bg-night-950/60 px-3 py-2 text-left text-[0.72rem] font-semibold uppercase tracking-widest text-ink-mute"
              >
                {gruppo}
                <span className="ml-2 font-normal normal-case tracking-normal text-ink-faint">
                  {items.length} {items.length === 1 ? "insegnamento" : "insegnamenti"}
                </span>
              </th>
            </tr>

            {items.map((ins) => {
              const superata = materieSuperate.has(ins.id) || Boolean(ins.superata);
              const isOpen = open.has(ins.id);
              const panelId = `ins-row-${ins.id}`;
              return (
                <Fragment key={ins.id}>
                  <tr
                    className={cn(
                      "border-b border-line/60 align-top transition-colors hover:bg-night-800/40",
                      superata && "opacity-75",
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggle(ins.id)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex items-start gap-1.5 text-left font-medium text-ink"
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "mt-0.5 size-3.5 shrink-0 text-ink-mute transition-transform duration-300",
                            isOpen && "rotate-180",
                          )}
                        />
                        <span>{ins.nome}</span>
                        {superata && (
                          <CheckCircle2
                            aria-label="superata"
                            className="mt-0.5 size-3.5 shrink-0 text-ok"
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[0.78rem] text-ink-mute">
                      {ins.codice ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[0.78rem] text-ink-mute">
                      {ins.settore ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink">{ins.cfu}</td>
                    <td className="px-3 py-2.5 text-ink-mute">{semLabel(ins)}</td>
                    <td className="px-3 py-2.5 text-ink-mute">{ins.docente ?? "—"}</td>
                    <td className="px-3 py-2.5 text-ink-mute">
                      {ins.propedeuticita?.length ? ins.propedeuticita.join(", ") : "—"}
                    </td>
                  </tr>

                  {/* Sotto-riga dettagli (animazione grid-rows come nelle card) */}
                  <tr>
                    <td colSpan={COL_COUNT} className="p-0">
                      <div
                        id={panelId}
                        className={cn(
                          "grid transition-[grid-template-rows] duration-300 ease-out",
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        {/* inert da chiuso: fuori dal tab order/SR, animazione viva */}
                        <div className="overflow-hidden" inert={!isOpen}>
                          <div className="flex flex-col gap-3 border-b border-line/60 bg-night-950/40 px-3 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {ins.inserito_manualmente ? (
                                <Badge tone="signal">Inserito manualmente</Badge>
                              ) : ins.modificato_manualmente ? (
                                <Badge tone="signal">Da sync · modificato da te</Badge>
                              ) : (
                                <Badge tone="neutral">Sincronizzato dall&apos;ateneo</Badge>
                              )}
                            </div>
                            {ins.note && (
                              <p className="whitespace-pre-wrap text-sm text-ink-mute">
                                <span className="text-[0.7rem] uppercase tracking-wide text-ink-faint">
                                  Note ·{" "}
                                </span>
                                {ins.note}
                              </p>
                            )}
                            <InsegnamentoActions
                              insegnamento={ins}
                              onEdit={onEdit}
                              onDelete={onDelete}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}

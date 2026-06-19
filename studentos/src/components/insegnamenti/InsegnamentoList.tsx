"use client";

import { LayoutGrid, PlusCircle, Table2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";
import type { Insegnamento, TipoInsegnamento } from "@/types/insegnamenti";
import { InsegnamentoCard } from "./InsegnamentoCard";
import { InsegnamentoTable } from "./InsegnamentoTable";

type ViewMode = "card" | "tabella";
type GroupMode = "anno" | "semestre";
type FiltroTipo = "tutti" | TipoInsegnamento | "superate";

const FILTRI: { value: FiltroTipo; label: string }[] = [
  { value: "tutti",       label: "Tutti" },
  { value: "obbligatorio",label: "Obbligatori" },
  { value: "scelta",      label: "A scelta" },
  { value: "superate",    label: "Superate" },
];

function groupByAnno(
  insegnamenti: Insegnamento[],
): Map<string, Insegnamento[]> {
  const map = new Map<string, Insegnamento[]>();
  for (const ins of insegnamenti) {
    const key = ins.anno ?? "—";
    const label =
      key === "1" ? "I Anno"
      : key === "2" ? "II Anno"
      : key === "3" ? "III Anno"
      : key === "4" ? "IV Anno"
      : key === "5" ? "V Anno"
      : key === "—" ? "Anno non specificato"
      : `Anno ${key}`;
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(ins);
  }
  return map;
}

function groupBySemestre(
  insegnamenti: Insegnamento[],
): Map<string, Insegnamento[]> {
  const map = new Map<string, Insegnamento[]>();
  for (const ins of insegnamenti) {
    const sem = ins.semestre !== undefined ? String(ins.semestre) : "—";
    const label =
      sem === "1" ? "1° Semestre"
      : sem === "2" ? "2° Semestre"
      : sem === "annuale" ? "Annuale"
      : "Semestre non specificato";
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(ins);
  }
  return map;
}

export function InsegnamentoList({
  insegnamenti,
  materieSuperate,
  onAggiungiManuale,
  onEdit,
  onDelete,
}: {
  insegnamenti: Insegnamento[];
  materieSuperate: Set<string>;
  onAggiungiManuale: () => void;
  onEdit: (ins: Insegnamento) => void;
  onDelete: (ins: Insegnamento) => void;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [groupMode, setGroupMode] = useState<GroupMode>("anno");
  const [filtro, setFiltro] = useState<FiltroTipo>("tutti");

  const filtered = insegnamenti.filter((ins) => {
    if (filtro === "tutti") return true;
    if (filtro === "superate") return materieSuperate.has(ins.id) || ins.superata;
    return ins.tipo === filtro;
  });

  // Le card seguono il toggle Anno/Semestre; la tabella è sempre per anno.
  const cardGroups =
    groupMode === "anno" ? groupByAnno(filtered) : groupBySemestre(filtered);
  const tableGroups = Array.from(groupByAnno(filtered).entries());

  return (
    <section aria-label="Elenco insegnamenti" className="flex flex-col gap-6">
      {/* Toolbar: vista · raggruppamento (solo card) · filtri */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle Card/Tabella */}
          <div
            role="group"
            aria-label="Vista"
            className="glass flex w-fit gap-px rounded-xl p-1"
          >
            {([
              { mode: "card", label: "Card", Icon: LayoutGrid },
              { mode: "tabella", label: "Tabella", Icon: Table2 },
            ] as const).map(({ mode, label, Icon }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium transition-colors",
                  viewMode === mode
                    ? "bg-signal text-white"
                    : "text-ink-mute hover:text-ink",
                )}
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Group toggle — pertinente solo alla vista card */}
          {viewMode === "card" && (
            <div
              role="group"
              aria-label="Raggruppa per"
              className="glass flex w-fit gap-px rounded-xl p-1"
            >
              {(["anno", "semestre"] as GroupMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setGroupMode(mode)}
                  aria-pressed={groupMode === mode}
                  className={cn(
                    "rounded-lg px-3 py-1 text-sm font-medium transition-colors",
                    groupMode === mode
                      ? "bg-signal text-white"
                      : "text-ink-mute hover:text-ink",
                  )}
                >
                  {mode === "anno" ? "Per Anno" : "Per Semestre"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtri tipo */}
        <div
          role="group"
          aria-label="Filtra insegnamenti"
          className="flex flex-wrap gap-1.5"
        >
          {FILTRI.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltro(f.value)}
              aria-pressed={filtro === f.value}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filtro === f.value
                  ? "bg-signal text-white"
                  : "chip hover:border-signal/40 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="glass flex flex-col items-center gap-4 rounded-lg py-12 text-center">
          <p className="muted text-sm">Nessun insegnamento trovato.</p>
          <Button variant="ghost" onClick={onAggiungiManuale}>
            <PlusCircle aria-hidden="true" className="size-4" />
            Aggiungi manualmente
          </Button>
        </div>
      )}

      {/* Vista tabella */}
      {filtered.length > 0 && viewMode === "tabella" && (
        <InsegnamentoTable
          groups={tableGroups}
          materieSuperate={materieSuperate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* Vista card */}
      {filtered.length > 0 &&
        viewMode === "card" &&
        Array.from(cardGroups.entries()).map(([gruppo, items]) => (
          <section key={gruppo} aria-label={gruppo}>
            <h2 className="mb-3 text-[0.8rem] font-semibold uppercase tracking-widest text-ink-mute">
              {gruppo}
              <span className="ml-2 font-normal normal-case tracking-normal text-ink-faint">
                {items.length} {items.length === 1 ? "insegnamento" : "insegnamenti"}
              </span>
            </h2>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {items.map((ins) => (
                <InsegnamentoCard
                  key={ins.id}
                  insegnamento={ins}
                  superata={materieSuperate.has(ins.id) || Boolean(ins.superata)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        ))}

      {/* CTA aggiungi */}
      {filtered.length > 0 && (
        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="sm" onClick={onAggiungiManuale}>
            <PlusCircle aria-hidden="true" className="size-3.5" />
            Aggiungi un insegnamento
          </Button>
        </div>
      )}
    </section>
  );
}

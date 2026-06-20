"use client";

/** Azioni su un insegnamento (Modifica + Elimina), condivise da card e tabella.
 *  "Modifica" è sempre disponibile; "Elimina" solo per le materie inserite a
 *  mano (`inserito_manualmente`). L'eliminazione è a due tempi (conferma inline,
 *  niente dialog di sistema) per evitare cancellazioni accidentali. */
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";
import type { Insegnamento } from "@/types/insegnamenti";

export function InsegnamentoActions({
  insegnamento: ins,
  onEdit,
  onDelete,
  className,
}: {
  insegnamento: Insegnamento;
  onEdit: (ins: Insegnamento) => void;
  onDelete: (ins: Insegnamento) => void;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-2", className)}
        role="group"
        aria-label="Conferma eliminazione"
      >
        <span className="text-xs text-ink-mute">Eliminare «{ins.nome}»?</span>
        <Button variant="danger" size="sm" onClick={() => onDelete(ins)}>
          <Trash2 aria-hidden="true" className="size-3.5" />
          Elimina
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Annulla
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(ins)}
        aria-label={`Modifica ${ins.nome}`}
      >
        <Pencil aria-hidden="true" className="size-3.5" />
        Modifica
      </Button>
      {ins.inserito_manualmente && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(true)}
          aria-label={`Elimina ${ins.nome}`}
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
          Elimina
        </Button>
      )}
    </div>
  );
}

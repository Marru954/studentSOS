"use client";

/** Export/restore all local data as a JSON file. Restore replaces the current
 *  manual data, so it asks for confirmation first. */
import { Download, HardDriveDownload, Upload } from "lucide-react";
import { useRef } from "react";
import { Panel } from "@/components/primitives/Panel";
import { exportBackup, importBackup } from "@/lib/backup";
import { useToast } from "@/lib/state/toast";

export function BackupCard({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (
      !window.confirm(
        "Ripristinare dal backup? I dati attuali (libretto, note, task, focus) verranno sostituiti.",
      )
    ) {
      return;
    }
    try {
      const r = await importBackup(file);
      useToast
        .getState()
        .show(
          `Ripristinati ${r.libretto} esami, ${r.notes} note, ${r.tasks} task.`,
          "ok",
        );
    } catch {
      useToast.getState().show("File di backup non valido.", "danger");
    }
  }

  return (
    <Panel title="Backup dei dati" icon={<HardDriveDownload />} className={className}>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-ink-mute">
          I dati vivono solo su questo dispositivo. Esporta un backup prima di
          svuotare la cache o per spostarti su un altro device.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void exportBackup()}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <Download aria-hidden="true" className="size-4" />
            Scarica backup
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <Upload aria-hidden="true" className="size-4" />
            Ripristina
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            aria-label="Ripristina da file di backup"
            className="sr-only"
            onChange={onFile}
          />
        </div>
      </div>
    </Panel>
  );
}

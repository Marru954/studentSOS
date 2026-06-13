"use client";

/** /libretto: the manual territory. Everything here lives only in the
 *  local IndexedDB — sync never reads or writes it. */
import { useMemo, useState } from "react";
import { ChevronDown, GraduationCap, Info } from "lucide-react";
import { CfuPanel, GoalPanel, MediaPanel } from "@/components/dashboard/CareerPanels";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { useLibretto } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { DelphiConnect } from "./DelphiConnect";
import { EntryForm } from "./EntryForm";
import { EntryTable } from "./EntryTable";
import { ImportDelphiPdf } from "./ImportDelphiPdf";
import { ImportExams } from "./ImportExams";
import { ProjectionPanel } from "./ProjectionPanel";

export function LibrettoView() {
  const libretto = useLibretto();
  const settings = useSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("all");

  const ready = libretto.hydrated && settings.hydrated;
  const editing = editingId
    ? libretto.items.find((e) => e.id === editingId)
    : undefined;

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const e of libretto.items) if (e.academicYear) set.add(e.academicYear);
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [libretto.items]);

  const hasUndated = libretto.items.some((e) => !e.academicYear);

  const visible = useMemo(() => {
    if (yearFilter === "all") return libretto.items;
    if (yearFilter === "none") return libretto.items.filter((e) => !e.academicYear);
    return libretto.items.filter((e) => e.academicYear === yearFilter);
  }, [libretto.items, yearFilter]);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold">Libretto</h1>
        <p className="mt-1 text-xs text-ink-mute">
          Aggiungi gli esami a mano o importali da CSV. Tutto resta su questo
          dispositivo; media, CFU e proiezioni si aggiornano in tempo reale.
        </p>
      </header>

      {!ready ? (
        <div
          role="status"
          aria-busy="true"
          className="grid grid-cols-1 gap-3 lg:grid-cols-12"
        >
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton className="lg:col-span-12" />
          <PanelSkeleton className="lg:col-span-4" />
          <PanelSkeleton className="lg:col-span-3" />
          <PanelSkeleton className="lg:col-span-5" />
        </div>
      ) : (
        <div className="stagger-children grid grid-cols-1 gap-3 lg:grid-cols-12">
          <GoalPanel
            entries={libretto.items}
            totalCfu={settings.degreePlan.totalCfu}
            targetAverage={settings.degreePlan.targetAverage}
            onTargetChange={(value) =>
              void settings.update({
                degreePlan: { ...settings.degreePlan, targetAverage: value },
              })
            }
            className="lg:col-span-12"
          />

          <MediaPanel
            entries={libretto.items}
            targetAverage={settings.degreePlan.targetAverage}
            className="lg:col-span-4"
          />
          <CfuPanel
            entries={libretto.items}
            totalCfu={settings.degreePlan.totalCfu}
            className="lg:col-span-3"
          />
          <ProjectionPanel
            entries={libretto.items}
            totalCfu={settings.degreePlan.totalCfu}
            targetAverage={settings.degreePlan.targetAverage}
            onPlanChange={(patch) =>
              void settings.update({
                degreePlan: { ...settings.degreePlan, ...patch },
              })
            }
            className="lg:col-span-5"
          />

          <DelphiConnect className="lg:col-span-5" />
          <EntryForm
            key={editingId ?? "new"}
            initial={editing}
            onSave={(entry) => {
              void libretto.upsert(entry);
              setEditingId(null);
            }}
            onCancel={editing ? () => setEditingId(null) : undefined}
            className="lg:col-span-7"
          />
          <Panel
            title="Esami registrati"
            icon={<GraduationCap />}
            flush
            className="lg:col-span-12"
            actions={
              libretto.items.length > 0 ? (
                <>
                  {(years.length > 0 || hasUndated) && (
                    <>
                      <label htmlFor="anno-filter" className="sr-only">
                        Filtra per anno accademico
                      </label>
                      <select
                        id="anno-filter"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="h-8 rounded-sm border border-line bg-night-800 px-2 text-xs text-ink transition-[border-color] hover:border-line-strong"
                      >
                        <option value="all">Tutti gli anni</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                        {hasUndated && <option value="none">Senza anno</option>}
                      </select>
                    </>
                  )}
                  <ConfirmButton
                    armedLabel="Cancella tutto?"
                    onConfirm={() => {
                      setEditingId(null);
                      void libretto.clear();
                    }}
                  >
                    Svuota libretto
                  </ConfirmButton>
                </>
              ) : undefined
            }
          >
            <div className="flex flex-col gap-3 border-b border-line p-3">
              <details className="group rounded-md border border-line bg-night-950">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-night-900 [&::-webkit-details-marker]:hidden">
                  <Info aria-hidden="true" className="size-4 text-signal" />
                  Come funziona
                  <ChevronDown
                    aria-hidden="true"
                    className="ml-auto size-4 text-ink-mute transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="flex flex-col gap-2 border-t border-line px-3 py-2.5 text-xs text-ink-mute">
                  <p>
                    <span className="font-medium text-ink">Manuale (form)</span>{" "}
                    — aggiungi un esame alla volta dal modulo qui sopra. Ideale
                    per pochi esami o per correzioni puntuali.
                  </p>
                  <p>
                    <span className="font-medium text-ink">PDF Delphi</span> —
                    importa l&rsquo;intera carriera in automatico dal PDF degli
                    esami verbalizzati. Voti, CFU e date letti per te, solo sul
                    tuo dispositivo.
                  </p>
                  <p>
                    <span className="font-medium text-ink">CSV (in blocco)</span>{" "}
                    — carica molti esami insieme da un foglio Excel/CSV, ad es.
                    esami non ancora presenti su Delphi.
                  </p>
                </div>
              </details>
              <ImportDelphiPdf />
              <div className="border-t border-line pt-3">
                <ImportExams />
              </div>
            </div>
            {libretto.items.length === 0 ? (
              <p className="p-4 text-sm text-ink-mute">
                Nessun esame registrato. Aggiungi il primo dal modulo qui sopra
                o importa un CSV.
              </p>
            ) : visible.length === 0 ? (
              <p className="p-4 text-sm text-ink-mute">
                Nessun esame per l&rsquo;anno selezionato.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <EntryTable
                  entries={visible}
                  onEdit={setEditingId}
                  onRemove={(id) => {
                    if (editingId === id) setEditingId(null);
                    void libretto.remove(id);
                  }}
                />
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

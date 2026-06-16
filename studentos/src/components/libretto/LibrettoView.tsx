"use client";

/** /libretto: the manual territory. Everything here lives only in the
 *  local IndexedDB — sync never reads or writes it. Layout is a vertical
 *  split: the exam list (trophies) on the left, the analysis instruments on
 *  the right; on mobile a tab switches between the two. */
import { useMemo, useState } from "react";
import { ChevronDown, FileText, GraduationCap, Info, Printer } from "lucide-react";
import { CfuPanel, GoalPanel, MediaPanel } from "@/components/dashboard/CareerPanels";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import { CountUp } from "@/components/primitives/CountUp";
import { EmptyState } from "@/components/primitives/EmptyState";
import { Panel } from "@/components/primitives/Panel";
import { PanelSkeleton } from "@/components/primitives/Skeleton";
import { cn } from "@/lib/cn";
import {
  earnedCfu,
  graduationBase,
  weightedAverage,
} from "@/lib/domain/libretto";
import { fmtLongDay } from "@/lib/format";
import { useNowMinute } from "@/lib/hooks/useNowMinute";
import { useLibretto } from "@/lib/state/manual";
import { useSettings } from "@/lib/state/settings";
import { DelphiConnect } from "./DelphiConnect";
import { EntryForm } from "./EntryForm";
import { EntryTable } from "./EntryTable";
import { GradeSimulator } from "./GradeSimulator";
import { TrophyGrid } from "./TrophyGrid";
import { ImportDelphiPdf } from "./ImportDelphiPdf";
import { ImportExams } from "./ImportExams";

const statCardStyle = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: "2.6rem",
} as const;

export function LibrettoView() {
  const libretto = useLibretto();
  const settings = useSettings();
  const now = useNowMinute();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [tab, setTab] = useState<"trofei" | "analisi">("trofei");

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

  const totalCfu = settings.degreePlan.totalCfu;
  const average = weightedAverage(libretto.items);
  const base = average === undefined ? 0 : graduationBase(average);
  const acquired = earnedCfu(libretto.items);
  const verbalised = libretto.items.length;
  const isEmpty = verbalised === 0;

  const visible = useMemo(() => {
    if (yearFilter === "all") return libretto.items;
    if (yearFilter === "none")
      return libretto.items.filter((e) => !e.academicYear);
    return libretto.items.filter((e) => e.academicYear === yearFilter);
  }, [libretto.items, yearFilter]);

  const removeEntry = (id: string) => {
    if (editingId === id) setEditingId(null);
    void libretto.remove(id);
  };

  const statCards = (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      <div className="glass accent-top" style={{ padding: "1.4rem", textAlign: "center" }}>
        <div className="eyebrow" style={{ color: "var(--ink-faint)" }}>
          Media ponderata
        </div>
        <div className="grad-text font-num" style={statCardStyle}>
          {average === undefined ? "—" : <CountUp value={average} decimals={2} />}
        </div>
      </div>
      <div className="glass" style={{ padding: "1.4rem", textAlign: "center" }}>
        <div className="eyebrow" style={{ color: "var(--ink-faint)" }}>
          Base di laurea
        </div>
        <div className="font-num" style={statCardStyle}>
          {average === undefined ? "—" : <CountUp value={base} decimals={1} />}
          <span className="muted" style={{ fontSize: "1rem" }}>
            /110
          </span>
        </div>
      </div>
      <div className="glass" style={{ padding: "1.4rem", textAlign: "center" }}>
        <div className="eyebrow" style={{ color: "var(--ink-faint)" }}>
          CFU acquisiti
        </div>
        <div className="font-num" style={statCardStyle}>
          <CountUp value={acquired} />
          <span className="muted" style={{ fontSize: "1rem" }}>
            /{totalCfu}
          </span>
        </div>
      </div>
    </div>
  );

  const entryForm = (className: string) => (
    <EntryForm
      key={editingId ?? "new"}
      initial={editing}
      onSave={(entry) => {
        void libretto.upsert(entry);
        setEditingId(null);
      }}
      onCancel={editing ? () => setEditingId(null) : undefined}
      className={className}
    />
  );

  const esamiPanel = (
    <Panel
      title="Esami registrati"
      icon={<GraduationCap />}
      flush
      actions={
        libretto.items.length > 0 ? (
          <div className="no-print flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => window.print()}>
              <Printer aria-hidden="true" className="size-3.5" />
              Esporta PDF
            </Button>
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
          </div>
        ) : undefined
      }
    >
      <div className="print-only px-3 pt-3">
        <h2 className="text-base font-semibold text-ink">
          Libretto — StudentOS{now ? ` — ${fmtLongDay(now)}` : ""}
        </h2>
      </div>
      <div className="no-print flex flex-col gap-3 border-b border-line p-3">
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
              <span className="font-medium text-ink">Manuale (form)</span> —
              aggiungi un esame alla volta dal modulo. Ideale per pochi esami o
              correzioni puntuali.
            </p>
            <p>
              <span className="font-medium text-ink">PDF Delphi</span> — importa
              l&rsquo;intera carriera dal PDF degli esami verbalizzati. Voti, CFU
              e date letti solo sul tuo dispositivo.
            </p>
            <p>
              <span className="font-medium text-ink">CSV (in blocco)</span> —
              carica molti esami insieme da un foglio Excel/CSV.
            </p>
          </div>
        </details>
        <div id="importa-delphi" style={{ scrollMarginTop: "5rem" }}>
          <ImportDelphiPdf />
        </div>
        <div className="border-t border-line pt-3">
          <ImportExams />
        </div>
      </div>
      {libretto.items.length === 0 ? (
        <p className="p-4 text-sm text-ink-mute">
          Nessun esame registrato. Aggiungi il primo dal modulo qui sopra o
          importa un CSV.
        </p>
      ) : visible.length === 0 ? (
        <p className="p-4 text-sm text-ink-mute">
          Nessun esame per l&rsquo;anno selezionato.
        </p>
      ) : (
        <>
          {/* schermo: muro di trofei (scrollabile su desktop) */}
          <div className="no-print p-3 lg:max-h-[68vh] lg:overflow-y-auto">
            <TrophyGrid
              entries={visible}
              onEdit={setEditingId}
              onRemove={removeEntry}
            />
          </div>
          {/* stampa: la tabella ordinata */}
          <div className="print-only overflow-x-auto">
            <EntryTable
              entries={visible}
              onEdit={setEditingId}
              onRemove={removeEntry}
            />
          </div>
        </>
      )}
    </Panel>
  );

  const analysisPanels = (
    <>
      <MediaPanel
        entries={libretto.items}
        targetAverage={settings.degreePlan.targetAverage}
        className="no-print"
      />
      <CfuPanel entries={libretto.items} totalCfu={totalCfu} className="no-print" />
      <GoalPanel
        entries={libretto.items}
        totalCfu={totalCfu}
        targetAverage={settings.degreePlan.targetAverage}
        onPlanChange={(patch) =>
          void settings.update({
            degreePlan: { ...settings.degreePlan, ...patch },
          })
        }
        className="no-print"
      />
      <GradeSimulator className="no-print" />
      <DelphiConnect className="no-print" />
    </>
  );

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)]">Libretto</h1>
          <p className="muted mt-1 text-sm">{verbalised} esami verbalizzati</p>
        </div>
        <a
          href="#importa-delphi"
          className="btn no-print"
          style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
        >
          <FileText aria-hidden="true" size={15} />
          Importa da PDF
        </a>
      </header>

      {!ready ? (
        <div
          role="status"
          aria-busy="true"
          className="grid grid-cols-1 gap-3 lg:grid-cols-12"
        >
          <span className="sr-only">Caricamento dei dati locali…</span>
          <PanelSkeleton className="lg:col-span-12" />
          <PanelSkeleton className="lg:col-span-7" />
          <PanelSkeleton className="lg:col-span-5" />
        </div>
      ) : (
        <div className="stagger-children flex flex-col gap-4">
          {statCards}

          {isEmpty ? (
            <>
              <EmptyState
                icon={<GraduationCap />}
                title="La tua carriera, tutta qui"
                description="Aggiungi gli esami che hai già dato: StudentOS calcola da solo media ponderata, base di laurea su 110, proiezione del voto finale e sblocca i trofei dei tuoi 30 e lode. Inizia dal modulo qui sotto o importa il libretto da Delphi in un secondo."
              >
                <a href="#importa-delphi" className="btn btn-primary no-print">
                  <FileText aria-hidden="true" className="size-4" />
                  Importa da PDF Delphi
                </a>
              </EmptyState>
              {entryForm("no-print")}
              {esamiPanel}
            </>
          ) : (
            <>
              {/* mobile: tab per alternare esami / analisi */}
              <div className="flex gap-1 rounded-xl border border-line p-1 lg:hidden">
                <button
                  type="button"
                  onClick={() => setTab("trofei")}
                  className={cn(
                    "flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors",
                    tab === "trofei"
                      ? "bg-primary-gradient text-white"
                      : "text-ink-mute",
                  )}
                >
                  I tuoi esami
                </button>
                <button
                  type="button"
                  onClick={() => setTab("analisi")}
                  className={cn(
                    "flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors",
                    tab === "analisi"
                      ? "bg-primary-gradient text-white"
                      : "text-ink-mute",
                  )}
                >
                  Analisi
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* sinistra: esami + trofei */}
                <div
                  className={cn(
                    "flex-col gap-4 lg:col-span-7",
                    tab === "trofei" ? "flex lg:flex" : "hidden lg:flex",
                  )}
                >
                  {entryForm("no-print")}
                  {esamiPanel}
                </div>
                {/* destra: strumenti di analisi */}
                <div
                  className={cn(
                    "flex-col gap-4 lg:col-span-5",
                    tab === "analisi" ? "flex lg:flex" : "hidden lg:flex",
                  )}
                >
                  {analysisPanels}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

/**
 * Import a timetable from an .ics file or URL into /orario. Parsing is the pure
 * `parseIcs` (RFC 5545, zero deps); this component is just the I/O + mapping
 * shell around it.
 *
 * Each iCal VEVENT becomes a ClassEvent written through `putClassEvents`:
 *  - id = stableId("ical", srcLabel, ev.uid || ev.start, ev.start) → re-importing
 *    the same calendar overwrites in place instead of duplicating (idempotent).
 *  - sourceId = `ical-anno-${yearOfStudy ?? 1}` → `replaceSourceData` only wipes
 *    rows of *enabled* sync sources, so imported lessons survive every sync, and
 *    `yearOfSource()` parses the trailing `anno-N` so they pass the year filter.
 *  - kind defaults to "lecture" (iCal carries no lecture/lab distinction).
 *
 * Native <details> keeps the collapse keyboard-accessible (mirrors CoursePicker
 * and ManualLessonForm).
 */
import { CalendarArrowDown } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Field, inputClass } from "@/components/primitives/Field";
import { parseIcs, type IcsEvent } from "@/lib/domain/ical";
import type { ClassEvent } from "@/lib/domain/types";
import { stableId } from "@/lib/sync/util";
import { useSettings } from "@/lib/state/settings";
import { useSynced } from "@/lib/state/synced";
import { useToast } from "@/lib/state/toast";
import { putClassEvents } from "@/lib/storage/repo";

/** Map parsed iCal events → ClassEvent rows tagged for the student's year. */
function toClassEvents(
  events: IcsEvent[],
  srcLabel: string,
  yearOfStudy: number | undefined,
): ClassEvent[] {
  const sourceId = `ical-anno-${yearOfStudy ?? 1}`;
  return events.map((ev) => ({
    id: stableId("ical", srcLabel, ev.uid || ev.start, ev.start),
    courseName: ev.summary,
    start: ev.start,
    end: ev.end,
    room: ev.location || undefined,
    kind: "lecture",
    sourceId,
  }));
}

export function ImportIcalForm({ onImported }: { onImported?: () => void }) {
  const yearOfStudy = useSettings((s) => s.yearOfStudy);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const urlId = `${baseId}-url`;
  const fileId = `${baseId}-file`;

  /** Shared tail: parse text, map, persist, refresh, toast. */
  async function importText(text: string, srcLabel: string) {
    const parsed = parseIcs(text);
    if (parsed.length === 0) {
      useToast.getState().show("Nessun evento trovato nell'iCal.", "warn");
      return;
    }
    const events = toClassEvents(parsed, srcLabel, yearOfStudy);
    await putClassEvents(events);
    await useSynced.getState().refresh();
    useToast
      .getState()
      .show(`${events.length} lezioni importate da iCal.`, "ok");
    onImported?.();
  }

  async function handleUrl() {
    const trimmed = url.trim();
    if (!trimmed || loading) return;
    // Solo http/https: blocca file:/javascript:/data: ecc. da URL utente.
    if (!/^https?:\/\//i.test(trimmed)) {
      useToast.getState().show("Inserisci un indirizzo http(s) valido.", "warn");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(trimmed);
      // Cap a ~2 MB: un calendario reale è ben sotto; oltre è un download ostile.
      const blob = await res.blob();
      if (blob.size > 2_000_000) {
        useToast.getState().show("File iCal troppo grande (max 2 MB).", "warn");
        return;
      }
      const text = await blob.text();
      await importText(text, trimmed);
      setUrl("");
    } catch {
      useToast
        .getState()
        .show("Impossibile scaricare l'iCal (verifica l'URL / CORS).", "warn");
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      void importText(text, file.name);
      // allow re-selecting the same file to re-import
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      useToast.getState().show("Impossibile leggere il file iCal.", "warn");
    };
    reader.readAsText(file);
  }

  return (
    <details className="glass rounded-lg border border-line shadow-soft">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-night-900 [&::-webkit-details-marker]:hidden">
        <CalendarArrowDown aria-hidden="true" className="size-4 text-signal" />
        Importa da iCal
        <span className="ml-auto text-xs font-normal text-ink-mute">
          da un file .ics o un link
        </span>
      </summary>
      <div className="flex flex-col gap-4 border-t border-line p-4">
        <Field label="Indirizzo iCal (URL)" htmlFor={urlId}>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={urlId}
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…/calendario.ics"
              aria-label="Indirizzo iCal da cui importare l'orario"
              autoComplete="off"
              className={inputClass}
            />
            <Button
              variant="primary"
              loading={loading}
              disabled={!url.trim()}
              onClick={() => void handleUrl()}
              className="shrink-0"
            >
              <CalendarArrowDown aria-hidden="true" className="size-4" />
              Importa da URL
            </Button>
          </div>
        </Field>

        <Field label="Oppure carica un file" htmlFor={fileId}>
          <input
            ref={fileInputRef}
            id={fileId}
            type="file"
            accept=".ics,text/calendar"
            onChange={handleFile}
            aria-label="File iCal (.ics) da cui importare l'orario"
            className={inputClass + " h-auto py-1.5 file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-night-700 file:px-3 file:py-1 file:text-xs file:font-medium file:text-ink"}
          />
        </Field>

        <p className="text-xs text-ink-mute">
          Gli eventi vengono aggiunti all&rsquo;anno{" "}
          {yearOfStudy ?? 1}°. Reimportare lo stesso calendario aggiorna le
          lezioni senza duplicarle.
        </p>
      </div>
    </details>
  );
}

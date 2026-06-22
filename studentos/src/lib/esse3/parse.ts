/**
 * Parser PURO delle righe di libretto Esse3 (CINECA e3rest,
 * `libretto-service-v2/.../righe`) → LibrettoEntry[] di StudentOS.
 * Tenuto separato dal flusso di rete per essere testato contro una fixture
 * (non avendo un'istanza Esse3 reale a disposizione). Difensivo: i nomi dei
 * campi e3rest variano per versione/ateneo, quindi leggiamo più alias.
 */
import type { Grade, LibrettoEntry } from "@/lib/domain/types";
import { stableId } from "@/lib/sync/util";

type Row = Record<string, unknown>;

function num(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function truthy(v: unknown): boolean {
  return (
    v === 1 ||
    v === true ||
    (typeof v === "string" && ["1", "s", "si", "sì", "true", "y"].includes(v.toLowerCase()))
  );
}

/** Normalizza una data Esse3 ("2024-06-18", "18/06/2024", con o senza orario). */
function isoDate(v: unknown): string | undefined {
  if (!v) return undefined;
  const s = String(v);
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  return undefined;
}

function str(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return undefined;
}

/** Mappa l'esito Esse3 su un voto del libretto, o undefined se non superato. */
function parseGrade(esito: Row): Grade | undefined {
  const voto = num(esito.voto);
  const giudizio =
    esito.modValCod === "G" ||
    (voto == null && esito.tipoGiudizioDes != null);

  if (giudizio) {
    const label = String(esito.tipoGiudizioDes ?? "").toLowerCase();
    const passed = !label || /idoneo|super|sup|appro|positiv/.test(label);
    return passed ? { kind: "pass" } : undefined;
  }
  if (voto != null && voto >= 18 && voto <= 30) {
    return { kind: "numeric", value: voto, laude: truthy(esito.lodeFlg) };
  }
  return undefined; // non sostenuta / non valutabile
}

/**
 * Converte le righe grezze del libretto Esse3 in LibrettoEntry di StudentOS,
 * scartando le righe non superate o senza nome insegnamento.
 * @param raw Payload e3rest atteso come array di righe (qualunque altra cosa → []).
 * @returns Solo gli esami superati, marcati `source: "delphi"`.
 */
export function parseEsse3Libretto(raw: unknown): LibrettoEntry[] {
  const rows = Array.isArray(raw) ? (raw as Row[]) : [];
  const out: LibrettoEntry[] = [];
  for (const row of rows) {
    const courseName = str(row.adDes, row.adsceDes, row.des);
    if (!courseName) continue;

    const esito = (row.esito ?? {}) as Row;
    const grade = parseGrade(esito);
    if (!grade) continue; // solo esami superati

    const cfu = num(row.peso ?? row.cfu ?? esito.peso) ?? 0;
    const date = isoDate(esito.dataApp ?? esito.dataEsa ?? row.dataApp ?? row.dataEsa);

    out.push({
      id: stableId("esse3", courseName, date),
      courseName,
      cfu,
      grade,
      date: date ?? "",
      // "delphi" = bucket delle righe sincronizzate dall'ateneo (Delphi/Esse3),
      // distinte da quelle inserite a mano ("manual").
      source: "delphi",
    });
  }
  return out;
}

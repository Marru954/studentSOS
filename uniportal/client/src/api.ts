// Le chiamate passano per il proxy Vite (same-origin), quindi i cookie di
// sessione vengono inviati automaticamente con `credentials: "include"`.

export interface UserProfile {
  id: string;
  matricola: string;
  fullName?: string;
  email?: string;
  courseOfStudy?: string;
}

export interface Exam {
  courseName: string;
  cfu: number;
  grade: string;
  date: string;
}
export interface CfuSummary {
  acquired: number;
  total: number;
  average: number;
  projected: string;
}
export interface PlanItem {
  courseName: string;
  cfu: number;
  year: number;
  status: "superato" | "in_corso" | "da_sostenere";
}
export interface SyncedData {
  esami?: Exam[];
  cfu?: CfuSummary;
  pianoStudi?: PlanItem[];
}

/** Recupera il profilo dell'utente autenticato, o null se la sessione manca. */
export async function fetchMe(): Promise<UserProfile | null> {
  const res = await fetch("/api/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Errore ${res.status}`);
  const data = (await res.json()) as { user: UserProfile };
  return data.user;
}

/** Dati sincronizzati (esami, CFU, piano di studi). */
export async function fetchSynced(): Promise<SyncedData> {
  const res = await fetch("/api/synced", { credentials: "include" });
  if (!res.ok) throw new Error(`Errore ${res.status}`);
  const data = (await res.json()) as { synced: SyncedData };
  return data.synced;
}

/** Config pubblica del client (es. accesso demo in sviluppo). */
export async function fetchConfig(): Promise<{ devMode: boolean }> {
  const res = await fetch("/api/config", { credentials: "include" });
  if (!res.ok) return { devMode: false };
  return (await res.json()) as { devMode: boolean };
}

/** Avvia il login SSO (full-page redirect verso l'IdP). */
export function startLogin(): void {
  window.location.href = "/saml/login";
}

/** Avvia il Single Logout. */
export function startLogout(): void {
  window.location.href = "/saml/logout";
}

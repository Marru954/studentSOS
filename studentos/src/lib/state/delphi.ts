"use client";

/**
 * Sincronizzazione del libretto via SSO SAML di Tor Vergata. Niente più
 * credenziali sul dispositivo: l'utente accede tramite l'IdP (o la dev-login
 * mock) e StudentOS legge la sessione da /api/saml/me. Gli esami arrivano da
 * /api/saml/synced e sostituiscono le righe Delphi del libretto (le righe
 * manuali restano intatte).
 */
import { create } from "zustand";
import type { LibrettoEntry } from "@/lib/domain/types";
import { replaceDelphiLibretto } from "@/lib/storage/repo";
import { useLibretto } from "./manual";

export interface SsoStudent {
  matricola: string;
  fullName?: string;
  email?: string;
  courseOfStudy?: string;
}

interface DelphiState {
  /** Studente autenticato via SSO, o null se non connesso. */
  student: SsoStudent | null;
  /** True se la disconnessione deve passare dal Single Logout SAML (sessione
   *  reale con IdP); false per le sessioni dev/mock (logout locale). */
  sloSupported: boolean;
  hydrated: boolean;
  syncing: boolean;
  lastError?: string;
  lastSyncAt?: string;

  hydrate(): Promise<void>;
  sync(): Promise<void>;
  disconnect(): Promise<void>;
}

async function dropSyncedRows(): Promise<void> {
  await replaceDelphiLibretto([]); // rimuove le righe sincronizzate, tiene le manuali
  await useLibretto.getState().reload();
}

export const useDelphi = create<DelphiState>()((set, get) => ({
  student: null,
  sloSupported: false,
  hydrated: false,
  syncing: false,

  async hydrate() {
    if (get().hydrated) return;
    try {
      const res = await fetch("/api/saml/me");
      if (res.ok) {
        const body = (await res.json()) as {
          authenticated: boolean;
          student?: SsoStudent;
          slo?: boolean;
        };
        if (body.authenticated && body.student) {
          set({ student: body.student, sloSupported: Boolean(body.slo) });
        } else {
          // sessione assente lato server (es. scaduta o dopo SLO): riconcilia
          // il libretto rimuovendo eventuali righe sincronizzate rimaste.
          await dropSyncedRows();
        }
      }
    } catch {
      // offline o errore di rete: lascia tutto com'è (offline-first)
    }
    set({ hydrated: true });
    // se già autenticato, sincronizza la carriera in background
    if (get().student) void get().sync();
  },

  async sync() {
    if (get().syncing || !get().student) return;
    set({ syncing: true, lastError: undefined });
    try {
      const res = await fetch("/api/saml/synced");
      const body = (await res.json().catch(() => ({}))) as {
        exams?: LibrettoEntry[];
        message?: string;
      };
      if (!res.ok) {
        throw new Error(body.message ?? "Sincronizzazione non riuscita.");
      }
      await replaceDelphiLibretto(body.exams ?? []);
      await useLibretto.getState().reload();
      set({ lastSyncAt: new Date().toISOString() });
    } catch (error) {
      set({ lastError: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ syncing: false });
    }
  },

  async disconnect() {
    // sessione reale: Single Logout SAML completo (redirect a pagina intera
    // verso l'IdP, ritorno su /api/saml/logout/callback). La pulizia delle
    // righe avviene poi in hydrate() al ricaricamento (sessione assente).
    if (get().sloSupported) {
      window.location.href = "/api/saml/logout";
      return;
    }
    // sessione dev/mock: logout locale senza lasciare la SPA
    try {
      await fetch("/api/saml/logout", { method: "POST" });
    } catch {
      // ignora: la sessione lato server scade comunque
    }
    await dropSyncedRows();
    set({
      student: null,
      sloSupported: false,
      lastError: undefined,
      lastSyncAt: undefined,
    });
  },
}));

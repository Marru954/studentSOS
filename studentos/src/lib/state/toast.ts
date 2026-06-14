"use client";

/** Minimal non-blocking toast store. One toast at a time (latest wins); the
 *  monotonically-increasing `id` lets the host re-arm its dismiss timer even
 *  when the same message fires twice in a row. */
import { create } from "zustand";

export type ToastTone = "ok" | "warn" | "danger";

interface ToastState {
  id: number;
  message: string | null;
  tone: ToastTone;
  show(message: string, tone?: ToastTone): void;
  dismiss(): void;
}

export const useToast = create<ToastState>()((set, get) => ({
  id: 0,
  message: null,
  tone: "ok",
  show(message, tone = "ok") {
    set({ id: get().id + 1, message, tone });
  },
  dismiss() {
    set({ message: null });
  },
}));

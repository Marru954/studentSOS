"use client";

/** Open/close state for the global search palette (Cmd+K). The keyboard
 *  shortcut lives in SearchPalette; this store lets other UI (e.g. the mobile
 *  search button in AppNav) open it without prop-drilling. Ephemeral, not
 *  persisted. */
import { create } from "zustand";

interface SearchPaletteState {
  open: boolean;
  openPalette(): void;
  closePalette(): void;
}

export const useSearchPalette = create<SearchPaletteState>()((set) => ({
  open: false,
  openPalette: () => set({ open: true }),
  closePalette: () => set({ open: false }),
}));

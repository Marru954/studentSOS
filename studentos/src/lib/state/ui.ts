"use client";

/** Ephemeral UI state shared across the shell (not persisted). */
import { create } from "zustand";

interface UiState {
  onboardingOpen: boolean;
  /** "Più tardi" on first run: don't re-show until next app load. */
  firstRunDismissed: boolean;
  openOnboarding(): void;
  closeOnboarding(): void;
}

export const useUi = create<UiState>()((set) => ({
  onboardingOpen: false,
  firstRunDismissed: false,
  openOnboarding: () => set({ onboardingOpen: true }),
  closeOnboarding: () => set({ onboardingOpen: false, firstRunDismissed: true }),
}));

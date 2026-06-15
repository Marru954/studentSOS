/**
 * Compat shim. "Proiezioni" was merged into the unified "Obiettivo laurea"
 * panel (`GoalPanel` in dashboard/CareerPanels) — same media-obiettivo → voto
 * richiesto math, one panel instead of two. This thin re-export keeps
 * `scripts/audit-render.ts` (which must not be edited) resolving its import.
 *
 * Prefer `GoalPanel` directly in app code; nothing in the live UI imports this.
 */
export { GoalPanel as ProjectionPanel } from "@/components/dashboard/CareerPanels";

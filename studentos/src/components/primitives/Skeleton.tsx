import { cn } from "@/lib/cn";

/** Pulsing placeholder block for loading states. Decorative — wrap a group in
 *  an element with role="status" + an sr-only label so it's announced once. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-night-700", className)}
    />
  );
}

/** A full-panel skeleton: header bar + a few lines, matching the Panel shape. */
export function PanelSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md border border-line bg-night-800 p-4 shadow-soft",
        className,
      )}
    >
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 flex flex-col gap-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

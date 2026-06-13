import { LifeBuoy } from "lucide-react";
import { cn } from "@/lib/cn";

/** The "Student🛟S" wordmark: the O is a monochrome lifebuoy sized and coloured
 *  like the surrounding letters (inherits currentColor). Static — the animated
 *  hero in Landing builds its own SOS→StudentOS variant. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span aria-label="StudentOS" className={cn("inline-flex items-center", className)}>
      <span aria-hidden="true" className="inline-flex items-center">
        Student
        <LifeBuoy
          className="mx-[0.03em] size-[0.85em]"
          strokeWidth={2.25}
        />
        S
      </span>
    </span>
  );
}

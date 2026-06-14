/**
 * Course pinning for the merged all-years timetable. No pins = everything
 * is shown; pinning narrows every lesson view to the courses the student
 * actually attends. Native <details> keeps it keyboard-accessible.
 */
import { ListFilter } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";

export function CoursePicker({
  courses,
  pinned,
  onChange,
}: {
  /** Every course name present in the merged feed. */
  courses: string[];
  pinned: string[];
  onChange: (pinned: string[]) => void;
}) {
  if (courses.length === 0) return null;

  function toggle(course: string) {
    onChange(
      pinned.includes(course)
        ? pinned.filter((c) => c !== course)
        : [...pinned, course],
    );
  }

  return (
    <details className="glass rounded-lg border border-line shadow-soft">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-night-900 [&::-webkit-details-marker]:hidden">
        <ListFilter aria-hidden="true" className="size-4 text-signal" />
        I miei corsi
        <Badge tone={pinned.length > 0 ? "signal" : "neutral"}>
          {pinned.length > 0
            ? `${pinned.length} di ${courses.length}`
            : "tutti"}
        </Badge>
        <span className="ml-auto text-xs font-normal text-ink-mute">
          {pinned.length > 0
            ? "vedi solo i corsi che frequenti"
            : "orario completo di tutti gli anni"}
        </span>
      </summary>
      <div className="border-t border-line p-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <label
              key={course}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-0.5 text-sm text-ink transition-colors hover:bg-night-700"
            >
              <input
                type="checkbox"
                checked={pinned.includes(course)}
                onChange={() => toggle(course)}
                className="accent-signal"
              />
              <span className="truncate">{course}</span>
            </label>
          ))}
        </div>
        {pinned.length > 0 && (
          <Button size="sm" className="mt-3" onClick={() => onChange([])}>
            Mostra tutti i corsi
          </Button>
        )}
      </div>
    </details>
  );
}

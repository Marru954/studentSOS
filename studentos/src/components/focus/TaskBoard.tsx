/**
 * Kanban over StudyTask. No drag-and-drop dependency: cards move with
 * explicit ←/→ buttons, which makes the board keyboard- and screen-reader-
 * accessible by construction.
 */
import { useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { ConfirmButton } from "@/components/primitives/ConfirmButton";
import { Field, inputClass } from "@/components/primitives/Field";
import { Panel } from "@/components/primitives/Panel";
import { cn } from "@/lib/cn";
import type { IsoDate, StudyTask, TaskStatus } from "@/lib/domain/types";
import { daysBetweenIso, fmtPlainDayMonth } from "@/lib/format";

const STATUS_ORDER: TaskStatus[] = ["backlog", "todo", "doing", "done"];
const STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "Da fare",
  doing: "In corso",
  done: "Fatte",
};

function DueChip({ due, today }: { due: IsoDate; today: IsoDate }) {
  const days = daysBetweenIso(today, due);
  const tone = days < 0 ? "danger" : days <= 2 ? "warn" : "neutral";
  const label =
    days < 0
      ? `scaduta il ${fmtPlainDayMonth(due)}`
      : days === 0
        ? "entro oggi"
        : days === 1
          ? "entro domani"
          : `entro il ${fmtPlainDayMonth(due)}`;
  return <Badge tone={tone}>{label}</Badge>;
}

function byUrgency(a: StudyTask, b: StudyTask): number {
  return (a.due ?? "9999").localeCompare(b.due ?? "9999") ||
    a.createdAt.localeCompare(b.createdAt);
}

export function TaskBoard({
  tasks,
  courses,
  today,
  onUpsert,
  onRemove,
}: {
  tasks: StudyTask[];
  courses: string[];
  today: IsoDate;
  onUpsert: (task: StudyTask) => void;
  onRemove: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [due, setDue] = useState("");

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onUpsert({
      id: crypto.randomUUID(),
      title: title.trim(),
      status: "todo",
      courseName: course || undefined,
      due: due || undefined,
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setDue("");
  }

  function move(task: StudyTask, direction: 1 | -1) {
    const idx = STATUS_ORDER.indexOf(task.status) + direction;
    const status = STATUS_ORDER[idx];
    if (status) onUpsert({ ...task, status });
  }

  return (
    <section aria-label="Attività di studio" className="flex flex-col gap-3">
      <form
        onSubmit={addTask}
        className="glass flex flex-wrap items-end gap-3 rounded-md border border-line p-4 shadow-soft"
      >
        <Field label="Nuova attività" htmlFor="task-titolo" className="min-w-56 flex-1">
          <input
            id="task-titolo"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="es. Esercizi capitolo 9"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Corso" htmlFor="task-corso" className="w-56">
          <select
            id="task-corso"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className={inputClass}
          >
            <option value="">— nessuno —</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Scadenza" htmlFor="task-scadenza" className="w-40">
          <input
            id="task-scadenza"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Button type="submit" variant="primary">
          Aggiungi
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_ORDER.map((status) => {
          const column = tasks.filter((t) => t.status === status).sort(byUrgency);
          return (
            <Panel
              key={status}
              title={`${STATUS_LABEL[status]} · ${column.length}`}
              headingLevel={3}
              flush
            >
              {column.length === 0 ? (
                <p className="p-3 text-xs text-ink-mute">Vuota.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {column.map((task) => (
                    <li key={task.id} className="flex flex-col gap-1.5 p-3">
                      <p
                        className={cn(
                          "text-sm",
                          status === "done" && "text-ink-mute line-through",
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {task.courseName && (
                          <Badge tone="signal">{task.courseName}</Badge>
                        )}
                        {task.due && status !== "done" && (
                          <DueChip due={task.due} today={today} />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {status !== "backlog" && (
                          <Button
                            size="sm"
                            aria-label={`Sposta «${task.title}» in ${STATUS_LABEL[STATUS_ORDER[STATUS_ORDER.indexOf(status) - 1]]}`}
                            onClick={() => move(task, -1)}
                          >
                            ←
                          </Button>
                        )}
                        {status !== "done" && (
                          <Button
                            size="sm"
                            aria-label={`Sposta «${task.title}» in ${STATUS_LABEL[STATUS_ORDER[STATUS_ORDER.indexOf(status) + 1]]}`}
                            onClick={() => move(task, 1)}
                          >
                            →
                          </Button>
                        )}
                        <span className="ml-auto">
                          <ConfirmButton onConfirm={() => onRemove(task.id)}>
                            Elimina
                          </ConfirmButton>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          );
        })}
      </div>
    </section>
  );
}

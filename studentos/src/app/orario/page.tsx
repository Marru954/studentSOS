import type { Metadata } from "next";
import { WeekView } from "@/components/timetable/WeekView";

export const metadata: Metadata = { title: "Orario" };

export default function OrarioPage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <WeekView />
    </main>
  );
}

import type { Metadata } from "next";
import { FocusView } from "@/components/focus/FocusView";

export const metadata: Metadata = { title: "Focus" };

export default async function FocusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Deep link "studia per questo esame": /focus?course=<nome> preseleziona il
  // corso nel timer (link dal panoramica e dalle card appello).
  const { course } = await searchParams;
  const initialCourse = Array.isArray(course) ? course[0] : course;
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      {/* key sul parametro: una soft-nav verso /focus?course=… (mentre la pagina
          è già montata) rimonta la vista, così il corso preselezionato cambia. */}
      <FocusView key={initialCourse ?? ""} initialCourse={initialCourse} />
    </main>
  );
}

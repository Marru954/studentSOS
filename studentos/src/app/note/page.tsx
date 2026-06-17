import type { Metadata } from "next";
import { NotesView } from "@/components/notes/NotesView";
import "katex/dist/katex.min.css";

export const metadata: Metadata = { title: "Note" };

export default async function NotePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Deep link dalle altre pagine: /note?course=<nome> apre le note già
  // filtrate per quel corso (la ricerca include il nome del corso).
  const { course } = await searchParams;
  const initialQuery = Array.isArray(course) ? course[0] : course;
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      {/* key sul parametro: una soft-nav verso /note?course=… (mentre la pagina
          è già montata) rimonta la vista, così la ricerca riparte dal nuovo corso. */}
      <NotesView key={initialQuery ?? ""} initialQuery={initialQuery} />
    </main>
  );
}

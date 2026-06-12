import type { Metadata } from "next";
import { NotesView } from "@/components/notes/NotesView";
import "katex/dist/katex.min.css";

export const metadata: Metadata = { title: "Note" };

export default function NotePage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <NotesView />
    </main>
  );
}

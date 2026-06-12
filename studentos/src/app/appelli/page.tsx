import type { Metadata } from "next";
import { ExamList } from "@/components/exams/ExamList";

export const metadata: Metadata = { title: "Appelli" };

export default function AppelliPage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <ExamList />
    </main>
  );
}

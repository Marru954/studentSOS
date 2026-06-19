import type { Metadata } from "next";
import { InsegnamentiView } from "@/components/insegnamenti/InsegnamentiView";

export const metadata: Metadata = { title: "Insegnamenti" };

export default function InsegnamentiPage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <InsegnamentiView />
    </main>
  );
}

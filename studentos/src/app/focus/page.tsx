import type { Metadata } from "next";
import { FocusView } from "@/components/focus/FocusView";

export const metadata: Metadata = { title: "Focus" };

export default function FocusPage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <FocusView />
    </main>
  );
}

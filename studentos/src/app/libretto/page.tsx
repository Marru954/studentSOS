import type { Metadata } from "next";
import { LibrettoView } from "@/components/libretto/LibrettoView";

export const metadata: Metadata = { title: "Libretto" };

export default function LibrettoPage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <LibrettoView />
    </main>
  );
}

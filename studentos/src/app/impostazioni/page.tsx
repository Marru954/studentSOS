import type { Metadata } from "next";
import { ImpostazioniView } from "@/components/settings/ImpostazioniView";

export const metadata: Metadata = { title: "Impostazioni" };

export default function ImpostazioniPage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <ImpostazioniView />
    </main>
  );
}

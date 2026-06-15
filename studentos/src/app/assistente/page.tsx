import type { Metadata } from "next";
import { AssistantChat } from "@/components/assistente/AssistantChat";

export const metadata: Metadata = { title: "Assistente" };

export default function AssistentePage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6"
    >
      <AssistantChat />
    </main>
  );
}

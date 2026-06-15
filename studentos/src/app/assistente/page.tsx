import type { Metadata } from "next";
import { AssistantChat } from "@/components/assistente/AssistantChat";

export const metadata: Metadata = { title: "Assistente" };

export default function AssistentePage() {
  return (
    <main
      id="contenuto"
      className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 sm:px-6"
    >
      <AssistantChat />
    </main>
  );
}

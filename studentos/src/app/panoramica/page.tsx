import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = { title: "Panoramica" };

export default function PanoramicaPage() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <Dashboard />
    </main>
  );
}

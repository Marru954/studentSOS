import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <main
      id="contenuto"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
    >
      <Dashboard />
    </main>
  );
}

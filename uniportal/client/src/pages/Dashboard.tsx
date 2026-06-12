import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMe,
  fetchSynced,
  startLogout,
  type SyncedData,
  type UserProfile,
} from "../api";

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">
        {value ?? <span className="text-gray-400">non disponibile</span>}
      </p>
    </div>
  );
}

const PLAN_STATUS: Record<string, { label: string; cls: string }> = {
  superato: { label: "Superato", cls: "bg-emerald-50 text-emerald-700" },
  in_corso: { label: "In corso", cls: "bg-amber-50 text-amber-700" },
  da_sostenere: { label: "Da sostenere", cls: "bg-gray-100 text-gray-600" },
};

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [synced, setSynced] = useState<SyncedData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMe()
      .then(async (u) => {
        if (!active) return;
        if (!u) {
          navigate("/login", { replace: true });
          return;
        }
        setUser(u);
        setSynced(await fetchSynced().catch(() => ({})));
      })
      .catch(() => active && navigate("/login?error=acs", { replace: true }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-400">Caricamento…</p>
      </main>
    );
  }
  if (!user) return null;

  const cfu = synced.cfu;
  const esami = synced.esami ?? [];
  const piano = synced.pianoStudi ?? [];
  const cfuPct = cfu ? Math.round((cfu.acquired / cfu.total) * 100) : 0;

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-white">
              U
            </span>
            <span className="font-semibold tracking-tight">UniPortal</span>
          </div>
          <button
            type="button"
            onClick={startLogout}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Esci
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-sm text-gray-500">Bentornato,</p>
        <h1 className="text-2xl font-bold tracking-tight">{user.fullName ?? user.matricola}</h1>
        <p className="mt-1 text-sm text-gray-500">{user.courseOfStudy}</p>

        {/* Profilo SAML */}
        <h2 className="mt-8 text-sm font-semibold text-gray-900">Profilo</h2>
        <section aria-label="Profilo" className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Matricola" value={user.matricola} />
          <Detail label="Nome completo" value={user.fullName} />
          <Detail label="Email" value={user.email} />
          <Detail label="Corso di laurea" value={user.courseOfStudy} />
        </section>

        {/* Riepilogo carriera */}
        {cfu && (
          <>
            <h2 className="mt-10 text-sm font-semibold text-gray-900">Carriera</h2>
            <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">CFU acquisiti</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {cfu.acquired}
                  <span className="text-base font-normal text-gray-400">/{cfu.total}</span>
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${cfuPct}%` }} />
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Media ponderata</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {cfu.average.toFixed(1).replace(".", ",")}
                  <span className="text-base font-normal text-gray-400">/30</span>
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Base di laurea</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{cfu.projected}</p>
              </div>
            </section>
          </>
        )}

        {/* Esami sostenuti */}
        {esami.length > 0 && (
          <>
            <h2 className="mt-10 text-sm font-semibold text-gray-900">Esami sostenuti</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400">
                    <th scope="col" className="px-4 py-2.5 font-medium">Insegnamento</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">CFU</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Voto</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {esami.map((e) => (
                    <tr key={e.courseName} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{e.courseName}</td>
                      <td className="px-4 py-2.5 tabular-nums text-gray-600">{e.cfu}</td>
                      <td className="px-4 py-2.5 font-semibold tabular-nums">{e.grade}</td>
                      <td className="px-4 py-2.5 tabular-nums text-gray-500">
                        {e.date.split("-").reverse().join("/")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Piano di studi */}
        {piano.length > 0 && (
          <>
            <h2 className="mt-10 text-sm font-semibold text-gray-900">Piano di studi</h2>
            <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {piano.map((p) => {
                const st = PLAN_STATUS[p.status] ?? PLAN_STATUS.da_sostenere;
                return (
                  <div key={p.courseName} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">{p.courseName}</p>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {p.cfu} CFU · {p.year}° anno
                    </p>
                  </div>
                );
              })}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

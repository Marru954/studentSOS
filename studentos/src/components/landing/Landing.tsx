"use client";

import {
  ArrowRight,
  Award,
  CalendarClock,
  CalendarDays,
  Check,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Minus,
  NotebookPen,
  Timer,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/primitives/CountUp";
import { HeroDemo } from "./HeroDemo";

const FEATURES: { icon: LucideIcon; href: string; title: string; desc: string }[] = [
  {
    icon: GraduationCap,
    href: "/libretto",
    title: "Libretto digitale",
    desc: "Importa i voti dal portale del tuo ateneo o inseriscili a mano: media ponderata e CFU sempre aggiornati.",
  },
  {
    icon: CalendarClock,
    href: "/appelli",
    title: "Appelli",
    desc: "Ogni data che conta in un posto solo. Avvisi sui conflitti, scadenze di prenotazione.",
  },
  {
    icon: Timer,
    href: "/focus",
    title: "Focus",
    desc: "Timer Pomodoro e board obiettivi. Le sessioni diventano statistiche di costanza.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Scegli il tuo ateneo",
    text: "Cerca tra le università supportate e seleziona il tuo corso di laurea e anno. Accedi con la tua email universitaria.",
  },
  {
    n: "02",
    title: "Seleziona i tuoi corsi",
    text: "Scegli le materie che frequenti. StudentOS sincronizza orario, appelli e avvisi solo per te.",
  },
  {
    n: "03",
    title: "Tutto aggiornato",
    text: "Media ponderata, CFU acquisiti, prossimi appelli e orario settimanale — pronti ovunque, sempre sincronizzati.",
  },
];

const STATS: { value: number; suffix?: string; unit: string; desc: string }[] = [
  { value: 100, suffix: "%", unit: "sincronizzato", desc: "i tuoi dati sul tuo account, accessibili da ogni dispositivo" },
  { value: 1, unit: "PDF", desc: "tutta la carriera importata in un colpo solo" },
  { value: 5, suffix: " min", unit: "setup", desc: "per essere operativo dal primo avvio" },
];

/** Sample unlocked exams for the gamification teaser. */
const SAMPLE_TROPHIES: {
  grade: string;
  laude?: boolean;
  course: string;
  border: string;
  Icon: LucideIcon;
  iconColor: string;
  grad?: boolean;
}[] = [
  { grade: "30", laude: true, course: "Algoritmi", border: "border-yellow-400/60", Icon: Trophy, iconColor: "text-yellow-400", grad: true },
  { grade: "29", course: "Basi di dati", border: "border-[color:var(--signal)]/50", Icon: Trophy, iconColor: "text-[var(--signal-2)]", grad: true },
  { grade: "28", course: "Reti", border: "border-[color:var(--signal)]/50", Icon: Trophy, iconColor: "text-[var(--signal-2)]", grad: true },
  { grade: "26", course: "Fisica", border: "border-line", Icon: Award, iconColor: "text-ink-mute" },
  { grade: "Idoneo", course: "Inglese B2", border: "border-line/60", Icon: GraduationCap, iconColor: "text-ink-mute" },
];

/** Feature comparison: StudentOS vs the usual alternatives. */
const COMPARE_COLS = ["StudentOS", "Excel", "Portale ateneo", "Altre app"];
type Cell = "yes" | "no" | "partial";
const COMPARE_ROWS: { feature: string; cells: Cell[] }[] = [
  { feature: "Accesso da qualsiasi dispositivo", cells: ["yes", "yes", "no", "no"] },
  { feature: "Nessun abbonamento", cells: ["yes", "yes", "no", "no"] },
  { feature: "Media e proiezione laurea live", cells: ["yes", "partial", "no", "partial"] },
  { feature: "Appelli + avvisi sui conflitti", cells: ["yes", "no", "partial", "partial"] },
  { feature: "Focus / Pomodoro integrato", cells: ["yes", "no", "no", "partial"] },
  { feature: "Import del PDF carriera", cells: ["yes", "no", "no", "no"] },
  { feature: "Privacy: i tuoi dati restano tuoi", cells: ["yes", "yes", "no", "no"] },
];

const UNIVERSITY_NAMES = [
  "Tor Vergata",
  "La Sapienza",
  "Politecnico di Milano",
  "Università di Bologna",
  "Federico II",
  "Politecnico di Torino",
  "Università di Padova",
  "Bocconi",
  "Trento",
  "Firenze",
  "Statale di Milano",
  "Ca' Foscari",
];

const TESTIMONIALS = [
  {
    name: "Giulia M.",
    uni: "Bologna",
    text: "Ho smesso di usare 4 app diverse. Tutto qui, sincronizzato, veloce.",
  },
  {
    name: "Lorenzo B.",
    uni: "Politecnico MI",
    text: "Il simulatore di media mi ha aiutato a capire su quali esami puntare di più.",
  },
  {
    name: "Sara P.",
    uni: "La Sapienza",
    text: "Il Pomodoro integrato con gli esami è geniale. Finalmente studio con un piano.",
  },
];

const ALL: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: GraduationCap, title: "Libretto", desc: "voti dal portale o manuali" },
  { icon: CalendarClock, title: "Appelli", desc: "date, avvisi e conflitti" },
  { icon: NotebookPen, title: "Note", desc: "appunti per materia" },
  { icon: Timer, title: "Focus", desc: "Pomodoro per studiare meglio" },
  { icon: LayoutDashboard, title: "Cruscotto", desc: "panoramica della carriera" },
  { icon: CalendarDays, title: "Orario", desc: "la settimana a colpo d'occhio" },
];

/** Fades an element up after `delay` ms — set before first paint (ref callback
 *  runs during commit) so there's no flash; a no-op under reduced motion and
 *  on the server, where the SSR markup stays fully visible. */
const fadeIn =
  (delay: number) =>
  (el: HTMLElement | null): void => {
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.opacity = "0";
    el.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 700, delay, fill: "forwards", easing: "cubic-bezier(.22,1,.36,1)" },
    );
  };

/** A single comparison-table cell. */
function CompareCell({ value, highlight }: { value: Cell; highlight: boolean }) {
  if (value === "yes")
    return (
      <Check
        aria-label="sì"
        className={`mx-auto size-[1.1rem] ${highlight ? "text-[var(--signal-2)]" : "text-ok"}`}
      />
    );
  if (value === "partial")
    return (
      <span aria-label="parziale" className="text-ink-faint">
        ~
      </span>
    );
  return <Minus aria-label="no" className="mx-auto size-[1.1rem] text-ink-faint" />;
}

/** Public landing — no login required. The global AppNav sits above it as the
 *  top bar; "Inizia ora" drops the visitor into the Cruscotto. */
export function Landing() {
  return (
    <>
      <main id="contenuto" className="relative z-[2] flex-1">
        {/* HERO */}
        <section className="wrap relative overflow-hidden py-12 text-center sm:py-16">
          <div className="reveal in mb-6 inline-flex">
            <span className="chip chip-signal">
              <LifeBuoy className="size-[0.85rem]" aria-hidden="true" />
              Il tuo sistema operativo universitario
            </span>
          </div>
          <h1
            aria-label="StudentOS"
            className="mx-auto font-bold tracking-[-0.04em] text-ink"
            style={{ fontSize: "clamp(3.2rem, 13vw, 9rem)" }}
          >
            <span className="word" aria-hidden="true">
              <span>S</span>
              <span className="mid">
                <span>tudent</span>
              </span>
              <LifeBuoy className="buoy buoy-spin" strokeWidth={2.4} aria-hidden="true" />
              <span>S</span>
            </span>
          </h1>
          <p
            ref={fadeIn(1500)}
            className="mx-auto mt-6 max-w-[40ch] text-ink-mute"
            style={{ fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)" }}
          >
            Esami, appelli, libretto e carriera in un unico posto.{" "}
            <span className="text-ink">Calmo, immersivo, sempre sincronizzato.</span>
          </p>
          <div ref={fadeIn(2000)} className="mt-9 flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/cruscotto" className="btn btn-primary">
                Inizia ora — con la tua email
                <ArrowRight className="size-[1.05rem]" aria-hidden="true" />
              </Link>
              <Link href="/focus" className="btn">
                Prova il Focus
              </Link>
            </div>
            <p className="eyebrow text-ink-faint">
              Email universitaria · dati sincronizzati · gratis
            </p>
          </div>
          <div className="mt-12">
            <HeroDemo />
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="wrap section">
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {FEATURES.map(({ icon: Icon, href, title, desc }, i) => (
              <Link
                key={title}
                href={href}
                className="glass lift reveal flex flex-col gap-[0.9rem] rounded-lg p-[1.6rem] text-left"
                style={{ ["--d" as string]: `${i * 0.08}s` }}
              >
                <span className="grad-fill inline-flex size-[46px] items-center justify-center rounded-[14px] text-white">
                  <Icon className="size-[22px]" aria-hidden="true" />
                </span>
                <h3 className="text-[1.2rem]">{title}</h3>
                <p className="text-[0.92rem] text-ink-mute">{desc}</p>
                <span className="eyebrow mt-auto inline-flex items-center gap-1.5">
                  Apri
                  <ArrowRight className="size-[0.85rem]" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ATENEI SUPPORTATI */}
        <section className="wrap section">
          <p className="reveal eyebrow text-center">Atenei supportati</p>
          <h2 className="reveal display-md mx-auto mt-2.5 max-w-[20ch] text-center">
            Funziona per il <span className="grad-text">tuo ateneo</span>.
          </h2>
          <div className="mt-8 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
            {UNIVERSITY_NAMES.map((name, i) => (
              <div
                key={name}
                className="glass lift reveal flex items-center justify-center rounded-lg px-[1.2rem] py-[1.1rem] text-center text-[0.95rem] font-semibold"
                style={{ ["--d" as string]: `${(i % 3) * 0.07}s` }}
              >
                {name}
              </div>
            ))}
          </div>
          <p className="reveal mt-6 text-center text-sm text-ink-mute">
            Il tuo ateneo non è in lista?{" "}
            <a href="mailto:support@studentos.app" className="underline hover:text-ink">
              Segnalacelo →
            </a>
          </p>
        </section>

        {/* COME FUNZIONA */}
        <section className="wrap section">
          <div className="section-lead section-lead--left">
            <p className="reveal eyebrow">Come funziona</p>
            <h2
              className="reveal display-lg mt-3 max-w-[16ch]"
              style={{ ["--d" as string]: "0.05s" }}
            >
              Dal tuo ateneo al <span className="grad-text">cruscotto</span> in tre passi.
            </h2>
            <p className="reveal mt-3 text-ink-mute" style={{ ["--d" as string]: "0.1s" }}>
              Tre passaggi, una volta sola. Dopo si aggiorna tutto da sé.
            </p>
          </div>
          <div className="mt-10 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="glass reveal rounded-lg p-[1.6rem]"
                style={{ ["--d" as string]: `${i * 0.1}s` }}
              >
                <div className="grad-text font-display font-num text-[2.6rem] font-extrabold leading-none">
                  {s.n}
                </div>
                <h3 className="mt-[0.9rem] text-[1.15rem]">{s.title}</h3>
                <p className="mt-2 text-[0.9rem] text-ink-mute">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS BAND */}
        <section className="section">
          <div className="wrap grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {STATS.map(({ value, suffix, unit, desc }, i) => (
              <div
                key={unit}
                className="glass reveal rounded-lg p-8 text-center"
                style={{ ["--d" as string]: `${i * 0.1}s` }}
              >
                <div className="font-display font-extrabold leading-none">
                  <span className="grad-text" style={{ fontSize: "clamp(3rem, 7vw, 4.5rem)" }}>
                    <CountUp value={value} suffix={suffix ?? ""} inView />
                  </span>
                  <span className="ml-1.5 text-[1.3rem] font-bold text-ink-mute">{unit}</span>
                </div>
                <p className="mx-auto mt-[0.7rem] max-w-[24ch] text-[0.9rem] text-ink-mute">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PERCHÉ STUDENTOS — comparativa */}
        <section className="wrap section">
          <div className="section-lead section-lead--left">
            <p className="reveal eyebrow">Perché StudentOS</p>
            <h2 className="reveal display-md mt-3 max-w-[20ch]">
              Non è un altro <span className="grad-text">foglio Excel</span>.
            </h2>
          </div>
          <div className="reveal mt-8 overflow-x-auto">
            <table className="glass mx-auto w-full min-w-[34rem] overflow-hidden rounded-2xl text-sm shadow-soft">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-3.5 text-left font-medium text-ink-mute" />
                  {COMPARE_COLS.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className="px-4 py-3.5 text-center font-semibold"
                    >
                      {i === 0 ? <span className="grad-text">{c}</span> : <span className="text-ink-mute">{c}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-line/50 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal text-ink">
                      {row.feature}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={`px-4 py-3 text-center ${i === 0 ? "bg-[color-mix(in_oklch,var(--signal)_9%,transparent)]" : ""}`}
                      >
                        <CompareCell value={cell} highlight={i === 0} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RESTA IN PISTA — gamification teaser */}
        <section className="wrap section">
          <p className="reveal eyebrow text-center">Resta in pista</p>
          <h2 className="reveal display-md mx-auto mt-2.5 max-w-[20ch] text-center">
            Ogni esame è un <span className="grad-text">trofeo</span> sbloccato.
          </h2>
          <p className="reveal mx-auto mt-3 max-w-[46ch] text-center text-sm text-ink-mute">
            Media, CFU e streak crescono a ogni voto registrato. Piccole
            vittorie che ti tengono sul pezzo fino alla laurea.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SAMPLE_TROPHIES.map((t, i) => {
              const Icon = t.Icon;
              return (
                <div
                  key={t.course}
                  className={`glass lift reveal flex flex-col items-center gap-1.5 rounded-xl border-2 ${t.border} p-4 text-center`}
                  style={{ ["--d" as string]: `${(i % 5) * 0.06}s` }}
                >
                  <Icon aria-hidden="true" className={`size-5 ${t.iconColor}`} />
                  <div
                    className={`font-display text-[1.7rem] font-bold leading-none ${t.grad ? "grad-text" : "text-ink"}`}
                  >
                    {t.grade}
                    {t.laude && (
                      <span aria-hidden="true" className="ml-0.5 align-top text-sm">
                        ⭐
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-ink-mute">
                    {t.course}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* DICONO DI NOI */}
        <section className="wrap section">
          <p className="reveal eyebrow text-center">Dicono di noi</p>
          <h2 className="reveal display-md mx-auto mt-2.5 max-w-[18ch] text-center">
            Studenti come <span className="grad-text">te</span>.
          </h2>
          <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className="glass reveal flex flex-col gap-4 rounded-lg p-[1.6rem]"
                style={{ ["--d" as string]: `${i * 0.1}s` }}
              >
                <blockquote className="text-[0.98rem] italic text-ink">
                  “{t.text}”
                </blockquote>
                <figcaption className="eyebrow mt-auto text-ink-faint">
                  {t.name} · {t.uni}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* TUTTO IN UN POSTO */}
        <section className="wrap section">
          <div className="section-lead section-lead--left">
            <p className="reveal eyebrow">Una sola app</p>
            <h2 className="reveal display-md mt-3">
              Tutto in un posto
            </h2>
            <p className="reveal mt-3 text-ink-mute">
              Libretto, appelli, note, focus, cruscotto e orario — senza saltare
              tra app diverse.
            </p>
          </div>
          <div className="mt-8 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {ALL.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="glass lift reveal flex items-center gap-[0.9rem] rounded-lg px-[1.2rem] py-[1.1rem]"
                style={{ ["--d" as string]: `${(i % 3) * 0.07}s` }}
              >
                <span className="glass-2 inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-[var(--signal-2)]">
                  <Icon className="size-[19px]" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-[0.95rem] font-semibold">{title}</div>
                  <div className="text-[0.82rem] text-ink-mute">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="wrap section">
          <div
            className="glass reveal relative overflow-hidden rounded-lg text-center"
            style={{ padding: "clamp(2rem, 6vw, 4rem)" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-50"
              style={{ background: "radial-gradient(60% 80% at 50% 0%, var(--glow-1), transparent 70%)" }}
            />
            <div className="relative">
              <h2 className="display-lg mx-auto max-w-[18ch]">
                Prendi il largo senza affogare negli appelli.
              </h2>
              <p className="mx-auto mt-4 max-w-[36ch] text-ink-mute">
                Accedi con la tua email universitaria. Apri il cruscotto e parti.
              </p>
              <div className="mt-7 flex justify-center">
                <Link href="/cruscotto" className="btn btn-primary">
                  Apri il Cruscotto
                  <ArrowRight className="size-[1.05rem]" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

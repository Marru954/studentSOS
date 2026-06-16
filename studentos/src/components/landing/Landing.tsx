"use client";

import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  NotebookPen,
  Timer,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/primitives/CountUp";
import { AteneoSearch } from "./AteneoSearch";
import { HeroDemo } from "./HeroDemo";

const FEATURES: { icon: LucideIcon; href: string; title: string; desc: string }[] = [
  {
    icon: CalendarClock,
    href: "/appelli",
    title: "Appelli",
    desc: "Ogni data che conta in un posto solo. Avvisi sui conflitti e sulle scadenze di prenotazione.",
  },
  {
    icon: GraduationCap,
    href: "/libretto",
    title: "Libretto",
    desc: "Voti dal portale del tuo ateneo o a mano: media ponderata e CFU sempre aggiornati.",
  },
  {
    icon: LayoutDashboard,
    href: "/cruscotto",
    title: "Cruscotto",
    desc: "Come sei messo a colpo d'occhio: media, CFU e proiezione di laurea.",
  },
  {
    icon: CalendarDays,
    href: "/orario",
    title: "Orario",
    desc: "La tua settimana di lezioni, sempre aggiornata e a portata di sguardo.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Scegli il tuo ateneo",
    text: "Cerca tra le università supportate e seleziona il tuo corso di laurea e anno. Bastano pochi tocchi, nessun account richiesto.",
  },
  {
    n: "02",
    title: "Seleziona i tuoi corsi",
    text: "Scegli le materie che frequenti. StudentOS sincronizza orario, appelli e avvisi solo per te.",
  },
  {
    n: "03",
    title: "Tutto aggiornato",
    text: "Media ponderata, CFU acquisiti, prossimi appelli e orario settimanale — pronti al volo, sul tuo dispositivo.",
  },
];

const STATS: { value: number; suffix?: string; unit: string; desc: string }[] = [
  { value: 100, suffix: "%", unit: "in locale", desc: "i tuoi dati vivono sul dispositivo; l'accesso per ritrovarli altrove è opzionale" },
  { value: 1, suffix: " file", unit: "tutta la carriera dentro", desc: "carichi il PDF del libretto e i voti sono già dentro, senza digitare nulla" },
  { value: 5, suffix: " min", unit: "setup", desc: "per essere operativo dal primo avvio" },
];

/** Traguardi ancora da sbloccare: la sezione è una PROMESSA, non uno stato
 *  pieno finto. Slot vuoti (lucchetto) che si accendono man mano che registri
 *  i voti — mostriamo il valore futuro, non dati di qualcun altro. */
const MILESTONES: { label: string; hint: string }[] = [
  { label: "Primo voto", hint: "la media parte" },
  { label: "Primo 30", hint: "trofeo d'oro" },
  { label: "Prima lode", hint: "⭐ extra" },
  { label: "Metà CFU", hint: "sei a metà" },
  { label: "Laurea", hint: "il traguardo" },
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

/** Public landing — no login required. The global AppNav sits above it as the
 *  top bar; "Inizia ora" drops the visitor into the Cruscotto. */
export function Landing() {
  return (
    <>
      <main id="contenuto" className="relative z-[2] flex-1">
        {/* HERO */}
        <section className="wrap relative overflow-hidden py-10 text-center sm:py-12">
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
            <span className="text-ink">Calmo, immersivo, sempre con te.</span>
          </p>
          <div ref={fadeIn(2000)} className="mt-9 flex flex-col items-center gap-3">
            <Link href="/cruscotto" className="btn btn-primary px-7 py-3 text-base">
              Inizia ora
              <ArrowRight className="size-[1.15rem]" aria-hidden="true" />
            </Link>
            <p className="eyebrow text-ink-faint">
              Gratis · i tuoi dati restano sul dispositivo
            </p>
            <p className="text-sm text-ink-mute">
              oppure{" "}
              <Link href="/focus" className="underline hover:text-ink">
                prova subito il Focus
              </Link>
            </p>
          </div>
          <div className="mt-8">
            <HeroDemo />
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="wrap section">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, href, title, desc }, i) => (
              <Link
                key={title}
                href={href}
                className="glass gradient-ring lift reveal flex flex-col gap-[0.9rem] rounded-xl p-[1.6rem] text-left"
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
          <p className="reveal mx-auto mt-3 max-w-[42ch] text-center text-sm text-ink-mute">
            Cerca il tuo: ti diciamo se orario ed esami arrivano in automatico
            (sync live) o se li inserisci a mano.
          </p>
          <AteneoSearch />
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
                  <span className="grad-text block" style={{ fontSize: "clamp(2.6rem, 6.5vw, 4.2rem)" }}>
                    <CountUp value={value} suffix={suffix ?? ""} inView />
                  </span>
                  <span className="mt-1.5 block text-[1.05rem] font-bold text-ink-mute">
                    {unit}
                  </span>
                </div>
                <p className="mx-auto mt-[0.7rem] max-w-[24ch] text-[0.9rem] text-ink-mute">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RESTA IN PISTA — gamification teaser */}
        <section className="wrap section">
          <p className="reveal eyebrow text-center">Resta in pista</p>
          <h2 className="reveal display-md mx-auto mt-2.5 max-w-[20ch] text-center">
            Ogni esame è un <span className="grad-text">trofeo</span> sbloccato.
          </h2>
          <p className="reveal mx-auto mt-3 max-w-[46ch] text-center text-sm text-ink-mute">
            Registra i tuoi voti: ogni esame diventa un trofeo e la media cresce
            a ogni voto. Questi traguardi ti aspettano — partono spenti e si
            accendono man mano.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {MILESTONES.map((m, i) => (
              <li
                key={m.label}
                className="glass reveal flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-line p-4 text-center"
                style={{ ["--d" as string]: `${(i % 5) * 0.06}s` }}
              >
                <Lock aria-hidden="true" className="size-5 text-ink-faint" />
                <div className="font-display text-[1.1rem] font-bold leading-tight text-ink">
                  {m.label}
                </div>
                <div className="text-xs font-medium text-ink-faint">{m.hint}</div>
              </li>
            ))}
          </ul>
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
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
            className="glass reveal relative overflow-hidden rounded-xl text-center"
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
                Scegli ateneo e corso, apri il cruscotto e parti. Nessun account richiesto.
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

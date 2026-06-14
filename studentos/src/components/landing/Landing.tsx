"use client";

import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  NotebookPen,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/primitives/CountUp";
import { ProgressRing } from "@/components/primitives/ProgressRing";
import { Sparkline } from "@/components/primitives/Sparkline";
import { Wordmark } from "@/components/Wordmark";

const FEATURES: { icon: LucideIcon; href: string; title: string; desc: string }[] = [
  {
    icon: GraduationCap,
    href: "/libretto",
    title: "Libretto digitale",
    desc: "Importa i voti da Delphi: media ponderata e CFU sempre aggiornati, in tempo reale.",
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
    title: "Scarica il PDF da Delphi",
    text: "Delphi → Esami → Esami verbalizzati → stampa la pagina come PDF dal browser.",
  },
  {
    n: "02",
    title: "Caricalo su StudentOS",
    text: "Libretto → «Importa da PDF Delphi». Leggiamo esami, voti, CFU e date automaticamente.",
  },
  {
    n: "03",
    title: "Libretto aggiornato",
    text: "Media ponderata, CFU acquisiti e andamento voti, pronti. Ri-importa quando vuoi.",
  },
];

const STATS: { value: number; suffix?: string; unit: string; desc: string }[] = [
  { value: 180, unit: "CFU", desc: "il percorso completo di Informatica a Tor Vergata" },
  { value: 30, unit: "esami", desc: "tracciati uno per uno fino alla laurea" },
  { value: 100, suffix: "%", unit: "offline", desc: "nessun dato sui server — tutto sul tuo dispositivo" },
];

const ALL: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: GraduationCap, title: "Libretto", desc: "voti da Delphi o manuali" },
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

/** Floating glass preview of the Cruscotto — illustrative figures, not live. */
function HeroCard() {
  return (
    <div className="glass float w-[min(380px,86vw)] shadow-soft" style={{ padding: "1.3rem" }}>
      <div className="mb-[1.1rem] flex items-center justify-between">
        <span className="eyebrow">Cruscotto</span>
        <span className="chip chip-signal">
          <Sparkles className="size-[0.8rem]" aria-hidden="true" />
          live
        </span>
      </div>
      <div className="flex items-center gap-[1.1rem]">
        <ProgressRing value={96 / 180} label="96 CFU su 180" size={104} strokeWidth={9}>
          <span className="font-display text-[1.5rem] font-bold text-ink">96</span>
          <span className="text-[0.7rem] text-ink-faint">/180 CFU</span>
        </ProgressRing>
        <div className="flex-1">
          <div className="eyebrow text-ink-faint">Media ponderata</div>
          <div className="font-display text-[2.4rem] font-bold leading-none text-ink">27,4</div>
          <div className="mt-1.5">
            <Sparkline
              values={[25, 26, 24, 27, 28, 27, 28]}
              label="Andamento dei voti recenti"
              width={150}
              height={40}
            />
          </div>
        </div>
      </div>
      <div className="mt-[1.1rem] flex items-center gap-2.5 border-t border-[var(--hairline)] pt-4">
        <span className="chip chip-danger">Calcolo prob. · 2g</span>
        <span className="chip">Basi di dati · 03/07</span>
      </div>
    </div>
  );
}

/** Public landing — no login required. The global AppNav sits above it as the
 *  top bar; "Inizia ora" drops the visitor into the Cruscotto. */
export function Landing() {
  return (
    <>
      <main id="contenuto" className="relative z-[2] flex-1">
        {/* HERO */}
        <section className="wrap py-12 text-center sm:py-16">
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
            <span className="text-ink">Calmo, immersivo, tutto offline.</span>
          </p>
          <div ref={fadeIn(2000)} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/cruscotto" className="btn btn-primary">
              Inizia ora
              <ArrowRight className="size-[1.05rem]" aria-hidden="true" />
            </Link>
            <Link href="/focus" className="btn">
              Prova il Focus
            </Link>
          </div>
          <div className="mt-14 flex justify-center">
            <div className="reveal" style={{ ["--d" as string]: "0.1s" }}>
              <HeroCard />
            </div>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="wrap py-12">
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

        {/* COME FUNZIONA */}
        <section className="wrap py-16">
          <p className="reveal eyebrow text-center">Come funziona</p>
          <h2
            className="reveal mx-auto mt-2.5 max-w-[16ch] text-center"
            style={{ ["--d" as string]: "0.05s", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Dal PDF di Delphi al <span className="grad-text">libretto vivo</span> in tre passi.
          </h2>
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
        <section className="py-16">
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

        {/* TUTTO IN UN POSTO */}
        <section className="wrap py-12">
          <h2 className="reveal text-center" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
            Tutto in un posto
          </h2>
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
        <section className="wrap py-16">
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
              <h2 className="mx-auto max-w-[18ch]" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
                Prendi il largo senza affogare negli appelli.
              </h2>
              <p className="mx-auto mt-4 max-w-[36ch] text-ink-mute">
                Nessun account, nessun server. Apri il cruscotto e parti.
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

      <footer className="mt-4 border-t border-[var(--hairline)]">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-8">
          <Link href="/" className="font-display font-bold text-ink">
            <Wordmark />
          </Link>
          <span className="text-[0.8rem] text-ink-faint">
            Dati 100% locali · nessun account richiesto
          </span>
        </div>
      </footer>
    </>
  );
}

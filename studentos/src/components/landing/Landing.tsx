"use client";

import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Check,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/primitives/CountUp";
import { AteneoSearch } from "./AteneoSearch";
import { HeroPreview } from "./HeroPreview";

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
    text: "Media, CFU, prossimi appelli e orario della settimana. Già sul tuo dispositivo, senza copiare niente a mano.",
  },
];

const STATS: { value: number; suffix?: string; unit: string; desc: string }[] = [
  { value: 18, suffix: "", unit: "atenei in sync live", desc: "orario ed esami arrivano in automatico dal tuo ateneo, senza copiarli a mano" },
  { value: 100, suffix: "%", unit: "in locale", desc: "i tuoi dati restano sul dispositivo; l'accesso per ritrovarli altrove è opzionale" },
  { value: 1, suffix: " file", unit: "e il libretto è dentro", desc: "carichi il PDF dal portale e i voti sono già lì, senza digitare nulla" },
];

/** Teaser gamification con stato MOCK statico (solo landing — non legge lo store
 *  né la logica reale dei trofei): i primi quattro traguardi appaiono già
 *  sbloccati con icona colorata che brilla, così la sezione comunica progresso e
 *  slancio invece di cinque caselle grigie "non hai fatto niente". Solo la Laurea
 *  resta bloccata (icona spenta), per creare tensione narrativa verso il
 *  traguardo finale. `grad`/`glow` sono accenti per-trofeo, brand-coherent. */
const MILESTONES: {
  icon: LucideIcon;
  label: string;
  hint: string;
  grad: string;
  glow: string;
  unlocked: boolean;
}[] = [
  {
    icon: Sparkles,
    label: "Primo voto",
    hint: "la media inizia a muoversi",
    grad: "linear-gradient(135deg, #6d6bff, #38bdf8)",
    glow: "rgba(109, 107, 255, 0.5)",
    unlocked: true,
  },
  {
    icon: Trophy,
    label: "Primo 30",
    hint: "ci vuole un tentativo",
    grad: "linear-gradient(135deg, #f0a500, #ffd874)",
    glow: "rgba(240, 165, 0, 0.5)",
    unlocked: true,
  },
  {
    icon: Star,
    label: "Prima lode",
    hint: "quando ci riesci",
    grad: "linear-gradient(135deg, #f97316, #fbbf24)",
    glow: "rgba(249, 115, 22, 0.5)",
    unlocked: true,
  },
  {
    icon: Target,
    label: "Metà CFU",
    hint: "sei a buon punto",
    grad: "linear-gradient(135deg, #06b6d4, #22d3ee)",
    glow: "rgba(6, 182, 212, 0.5)",
    unlocked: true,
  },
  {
    icon: GraduationCap,
    label: "Laurea",
    hint: "il traguardo che conta",
    grad: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    glow: "rgba(124, 58, 237, 0.5)",
    unlocked: false,
  },
];

/** I cinque strumenti sono solo descrittivi sulla landing (niente link): la
 *  Panoramica qui sotto è l'unico ingresso cliccabile, l'inizio del percorso. */
const ALL: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: GraduationCap, title: "Libretto", desc: "voti dal portale o manuali" },
  { icon: CalendarClock, title: "Appelli", desc: "date, avvisi e conflitti" },
  { icon: NotebookPen, title: "Note", desc: "appunti per materia" },
  { icon: Timer, title: "Focus", desc: "Pomodoro per studiare meglio" },
  { icon: CalendarDays, title: "Orario", desc: "la settimana a colpo d'occhio" },
  { icon: MessageCircle, title: "Assistente", desc: "chiedi, studia, capisci" },
];

/** Fades an element up after `delay` ms — set before first paint (ref callback
 *  runs during commit) so there's no flash; a no-op under reduced motion and
 *  on the server, where the SSR markup stays fully visible. */
const fadeIn =
  (delay: number) =>
  (el: HTMLElement | null): void => {
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Senza Web Animations API lasciamo l'elemento pienamente visibile: mai
    // nascondere la CTA dietro un'animazione che potrebbe non partire.
    if (typeof el.animate !== "function") return;
    el.style.opacity = "0";
    try {
      const anim = el.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 700, delay, fill: "forwards", easing: "cubic-bezier(.22,1,.36,1)" },
      );
      // Garantisce lo stato finale visibile anche se l'animazione viene annullata
      // (fill:forwards non scrive lo stile inline; un cancel lascerebbe opacity:0).
      const reveal = () => {
        el.style.opacity = "1";
      };
      anim.addEventListener("finish", reveal);
      anim.addEventListener("cancel", reveal);
    } catch {
      el.style.opacity = "1";
    }
  };

/** Public landing — no login required. The global AppNav sits above it as the
 *  top bar; "Inizia ora" drops the visitor into the Panoramica. */
export function Landing() {
  return (
    <>
      <main id="contenuto" className="relative z-[2] flex-1">
        {/* HERO */}
        <section className="wrap relative overflow-hidden py-10 text-center sm:py-12">
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
            className="mx-auto mt-6 max-w-[28ch] font-display font-bold leading-[1.15] text-ink"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}
          >
            Il tuo orario, gli esami e la media.{" "}
            <span className="grad-text">Tutto aggiornato, tutto sul tuo dispositivo.</span>
          </p>
          <p
            ref={fadeIn(1800)}
            className="mx-auto mt-4 max-w-[44ch] text-ink-mute"
            style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)" }}
          >
            Orario, appelli, libretto e note — già pronti per il tuo corso, senza
            account.
          </p>
          <div ref={fadeIn(2000)} className="mt-9 flex flex-col items-center gap-3">
            <Link href="/onboarding" className="btn btn-primary px-7 py-3 text-base">
              Inizia ora
              <ArrowRight className="size-[1.15rem]" aria-hidden="true" />
            </Link>
            <p className="eyebrow text-ink-faint">
              Gratis · i tuoi dati restano sul dispositivo
            </p>
            <p className="text-sm text-ink-mute">
              oppure{" "}
              <Link href="#atenei" className="underline hover:text-ink">
                controlla se c&apos;è il tuo ateneo
              </Link>
            </p>
          </div>

          <HeroPreview />
        </section>

        {/* ATENEI SUPPORTATI — il gancio: subito sotto l'hero */}
        <section id="atenei" className="wrap section scroll-mt-24">
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
              Dal tuo ateneo alla <span className="grad-text">panoramica</span> in tre passi.
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

        {/* TUTTO IN UN POSTO */}
        <section className="wrap section">
          <div className="section-lead section-lead--left">
            <p className="reveal eyebrow">Una sola app</p>
            <h2 className="reveal display-md mt-3">
              Tutto in un posto
            </h2>
            <p className="reveal mt-3 text-ink-mute">
              Libretto, appelli, note, focus, panoramica e orario — senza saltare
              tra app diverse.
            </p>
          </div>

          {/* Panoramica: anteprima cliccabile del cruscotto */}
          <Link
            href="/cruscotto"
            aria-label="Guarda un esempio della panoramica"
            className="glass gradient-ring lift reveal mt-8 flex flex-col gap-[0.9rem] rounded-xl p-[1.8rem] text-left sm:flex-row sm:items-center sm:gap-6"
          >
            <span className="grad-fill inline-flex size-[58px] shrink-0 items-center justify-center rounded-[16px] text-white">
              <LayoutDashboard className="size-7" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-[1.35rem]">Panoramica</h3>
                <span className="chip chip-signal">Anteprima</span>
              </div>
              <p className="mt-1.5 text-[0.95rem] text-ink-mute">
                Media, CFU e proiezione di laurea a colpo d&apos;occhio: il punto
                di partenza per tutto il resto.
              </p>
            </div>
            <span className="eyebrow inline-flex shrink-0 items-center gap-1.5">
              Guarda un esempio
              <ArrowRight className="size-[0.9rem]" aria-hidden="true" />
            </span>
          </Link>

          {/* Gli altri cinque strumenti: solo descrittivi, non cliccabili */}
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ALL.map(({ icon: Icon, title, desc }, i) => (
              <li
                key={title}
                className="glass reveal flex items-center gap-[0.9rem] rounded-lg px-[1.2rem] py-[1.1rem]"
                style={{ ["--d" as string]: `${(i % 3) * 0.07}s` }}
              >
                <span className="glass-2 inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-[var(--signal-2)]">
                  <Icon className="size-[19px]" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-[0.95rem] font-semibold">{title}</div>
                  <div className="text-[0.82rem] text-ink-mute">{desc}</div>
                </div>
              </li>
            ))}
          </ul>
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

        {/* TRAGUARDI — gamification teaser, secondario (sezione di chiusura) */}
        <section className="wrap section">
          <p className="reveal eyebrow text-center">Un piccolo extra</p>
          <h2 className="reveal mx-auto mt-2.5 max-w-[20ch] text-center font-display text-2xl font-bold">
            I tuoi <span className="grad-text">traguardi</span>.
          </h2>
          <p className="reveal mx-auto mt-3 max-w-[46ch] text-center text-sm text-ink-mute">
            Tieni traccia degli esami e guarda la media salire. Ogni traguardo si
            sblocca da solo.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {MILESTONES.map(({ icon: Icon, label, hint, grad, glow, unlocked }, i) => (
              <li
                key={label}
                className="glass lift reveal flex flex-col items-center gap-2 rounded-xl p-4 text-center"
                style={{ ["--d" as string]: `${(i % 5) * 0.06}s` }}
              >
                <span
                  className={
                    unlocked
                      ? "inline-flex size-11 items-center justify-center rounded-2xl text-white"
                      : "inline-flex size-11 items-center justify-center rounded-2xl bg-[var(--surface)] text-ink-faint"
                  }
                  style={
                    unlocked
                      ? { background: grad, boxShadow: `0 10px 28px -8px ${glow}` }
                      : undefined
                  }
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div
                  className={
                    unlocked
                      ? "font-display text-[0.95rem] font-bold leading-tight text-ink"
                      : "font-display text-[0.95rem] font-bold leading-tight text-ink-mute"
                  }
                >
                  {label}
                </div>
                <div className="text-xs font-medium text-ink-mute">{hint}</div>
                {unlocked ? (
                  <span className="chip chip-ok mt-auto">
                    <Check className="size-[0.85rem]" aria-hidden="true" />
                    Sbloccato
                  </span>
                ) : (
                  <span className="mt-auto rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide text-ink-faint">
                    Da sbloccare
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

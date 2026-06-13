import {
  ArrowRight,
  CalendarClock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  NotebookPen,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { Wordmark } from "@/components/Wordmark";
import styles from "./Landing.module.css";

const FEATURES = [
  {
    icon: GraduationCap,
    href: "/libretto",
    title: "Libretto digitale",
    desc: "Importa i tuoi voti da Delphi e tieni media e CFU sempre aggiornati.",
  },
  {
    icon: CalendarClock,
    href: "/appelli",
    title: "Appelli",
    desc: "Tieni traccia delle date importanti e degli appelli in arrivo.",
  },
  {
    icon: Timer,
    href: "/focus",
    title: "Focus",
    desc: "Studia con il timer Pomodoro e organizza i tuoi obiettivi.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Scarica il PDF da Delphi",
    text: "Accedi a Delphi (delphi.uniroma2.it) → Esami → Esami verbalizzati → stampa la pagina come PDF dal browser.",
  },
  {
    n: 2,
    title: "Caricalo su StudentOS",
    text: "Vai su Libretto → clicca «Importa da PDF Delphi» → seleziona il file. StudentOS legge automaticamente esami, voti, CFU e date.",
  },
  {
    n: 3,
    title: "Libretto aggiornato",
    text: "Trovi subito media ponderata, CFU acquisiti e andamento voti. Ogni volta che dai un nuovo esame, ri-importa il PDF aggiornato.",
  },
];

const STATS = [
  {
    icon: GraduationCap,
    value: "180",
    unit: "CFU",
    desc: "il percorso completo di Informatica a Tor Vergata",
  },
  {
    icon: FileText,
    value: "30",
    unit: "esami",
    desc: "da superare per laurearsi, tracciati uno per uno",
  },
  {
    icon: Lock,
    value: "100%",
    unit: "offline",
    desc: "nessun dato caricato su server — tutto sul tuo dispositivo",
  },
];

const ALL_FEATURES = [
  {
    icon: GraduationCap,
    title: "Libretto",
    desc: "importa voti da Delphi o inseriscili manualmente",
  },
  {
    icon: CalendarClock,
    title: "Appelli",
    desc: "tieni traccia delle date e ricevi avvisi sui conflitti",
  },
  {
    icon: NotebookPen,
    title: "Note",
    desc: "appunti organizzati per materia",
  },
  {
    icon: Timer,
    title: "Focus",
    desc: "timer Pomodoro per studiare meglio",
  },
  {
    icon: LayoutDashboard,
    title: "Cruscotto",
    desc: "panoramica completa della tua carriera",
  },
];

/** Public landing — no login required. The global AppNav sits above it as the
 *  top bar; "Inizia ora" drops the visitor into the Cruscotto. */
export function Landing() {
  return (
    <>
      <main id="contenuto" className="flex-1">
        {/* Hero — animated "SOS" → "Student🛟S" title */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1
            aria-label="StudentOS"
            className="text-5xl font-bold tracking-tight text-ink sm:text-6xl"
          >
            <span aria-hidden="true" className={styles.word}>
              <span>S</span>
              <span className={styles.mid}>
                <span>tudent</span>
              </span>
              <LifeBuoy className={styles.buoy} strokeWidth={2.5} />
              <span>S</span>
            </span>
          </h1>
          <p
            className={`mx-auto mt-5 max-w-2xl text-balance text-lg text-ink-mute ${styles.subtitle}`}
          >
            Il tuo portale universitario personale — tieni traccia di esami,
            appelli e carriera in un unico posto.
          </p>
          <div className={`mt-8 flex justify-center ${styles.cta}`}>
            <Link
              href="/cruscotto"
              className="inline-flex items-center gap-2 rounded-full bg-primary-gradient px-6 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
            >
              Inizia ora
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>

        {/* Feature cards — each links to its section */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, href, title, desc }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="group relative flex h-full flex-col gap-3 rounded-md border border-line bg-night-800 p-6 shadow-soft transition-[box-shadow,border-color] shadow-soft-hover hover:border-line-strong"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-signal-dim text-signal">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="text-base font-semibold text-ink">{title}</h2>
                  <p className="text-sm text-ink-mute">{desc}</p>
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute bottom-5 right-5 size-4 text-signal opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Come funziona — three numbered steps, joined by arrows */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-ink">
            Come funziona
          </h2>
          <ol className="mt-10 flex flex-col items-stretch gap-6 sm:flex-row sm:items-start sm:gap-2">
            {STEPS.map((s, i) => (
              <Fragment key={s.n}>
                <li className="flex flex-1 flex-col items-center text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-primary-gradient text-xl font-bold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-ink-mute">{s.text}</p>
                </li>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="hidden size-6 shrink-0 self-start text-ink-faint sm:block sm:mt-4"
                  />
                )}
              </Fragment>
            ))}
          </ol>
        </section>

        {/* Stats band — white cards on the grey strip */}
        <section className="border-y border-line bg-night-950">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-14 sm:grid-cols-3 sm:px-6">
            {STATS.map(({ icon: Icon, value, unit, desc }) => (
              <div
                key={unit}
                className="flex flex-col items-center rounded-md border border-line bg-night-800 p-6 text-center shadow-soft"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-signal-dim text-signal">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <p className="mt-4 font-bold leading-none text-ink">
                  <span className="text-4xl sm:text-5xl">{value}</span>{" "}
                  <span className="text-xl text-ink-mute sm:text-2xl">{unit}</span>
                </p>
                <p className="mt-2 text-sm text-ink-mute">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tutto in un posto — full feature list */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-ink">
            Tutto in un posto
          </h2>
          <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {ALL_FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-signal-dim text-signal">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{title}</h3>
                  <p className="text-sm text-ink-mute">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 sm:px-6">
          <Link href="/" className="text-sm font-semibold text-ink">
            <Wordmark />
          </Link>
          <p className="text-xs text-ink-mute">
            Dati 100% locali · nessun account richiesto
          </p>
        </div>
      </footer>
    </>
  );
}
